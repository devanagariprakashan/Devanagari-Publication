// Copies the store's data from Supabase (the live database) to Neon (a separate Postgres) so there is always an
// off-site copy. Plain relative imports only, so it also runs from scripts/backup-to-neon.ts outside Next.js.
//
// Every run copies ALL rows (the store is small), which includes everything from the last 24 hours plus changes to
// older rows (e.g. an order whose status changed). Rows are only inserted or updated in Neon, never deleted, so an
// accidental delete in Supabase can't wipe the backup.
import { Client } from "pg";

// Short-lived or sensitive-by-design tables that are pointless to back up.
const SKIP_TABLES = new Set(["email_otps"]);
const BATCH_SIZE = 500;

export type TableResult = { table: string; sourceRows: number; copied: number; backupRows: number };
export type BackupResult = { ok: boolean; startedAt: string; durationMs: number; tables: TableResult[]; error?: string };

const quote = (name: string) => `"${name.replace(/"/g, '""')}"`;

function connect(connectionString: string) {
  // node-postgres doesn't do SCRAM channel binding, so drop that parameter from Neon's default string.
  const cleaned = connectionString.replace(/([?&])channel_binding=[^&]*&?/, "$1").replace(/[?&]$/, "");
  return new Client({ connectionString: cleaned, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 20000 });
}

type Column = { name: string; type: string };

async function describeTable(source: Client, table: string): Promise<{ columns: Column[]; primaryKey: string[] }> {
  const cols = await source.query<Column>(
    `select a.attname as name,
            case when t.typtype in ('e', 'd') then 'text' else format_type(a.atttypid, a.atttypmod) end as type
       from pg_attribute a
       join pg_type t on t.oid = a.atttypid
      where a.attrelid = $1::regclass and a.attnum > 0 and not a.attisdropped
      order by a.attnum`,
    [`public.${quote(table)}`],
  );
  const pk = await source.query<{ name: string }>(
    `select a.attname as name
       from pg_index i
       join pg_attribute a on a.attrelid = i.indrelid and a.attnum = any(i.indkey)
      where i.indrelid = $1::regclass and i.indisprimary
      order by array_position(i.indkey, a.attnum)`,
    [`public.${quote(table)}`],
  );
  return { columns: cols.rows, primaryKey: pk.rows.map((r) => r.name) };
}

// Creates the table in Neon if needed, and adds any column that was added to Supabase later.
async function ensureBackupTable(target: Client, table: string, columns: Column[], primaryKey: string[]) {
  const defs = columns.map((c) => `${quote(c.name)} ${c.type}`);
  if (primaryKey.length) defs.push(`primary key (${primaryKey.map(quote).join(", ")})`);
  await target.query(`create table if not exists public.${quote(table)} (${defs.join(", ")})`);
  for (const c of columns) {
    await target.query(`alter table public.${quote(table)} add column if not exists ${quote(c.name)} ${c.type}`);
  }
}

async function copyTable(source: Client, target: Client, table: string): Promise<TableResult> {
  const { columns, primaryKey } = await describeTable(source, table);
  await ensureBackupTable(target, table, columns, primaryKey);

  const total = Number((await source.query(`select count(*) as n from public.${quote(table)}`)).rows[0].n);
  const orderBy = primaryKey.length ? primaryKey.map(quote).join(", ") : "ctid";
  const names = columns.map((c) => quote(c.name));
  const updates = columns.filter((c) => !primaryKey.includes(c.name)).map((c) => `${quote(c.name)} = excluded.${quote(c.name)}`);
  const conflict = primaryKey.length
    ? ` on conflict (${primaryKey.map(quote).join(", ")}) ${updates.length ? `do update set ${updates.join(", ")}` : "do nothing"}`
    : "";

  let copied = 0;
  await target.query("begin");
  try {
    // A table without a primary key can't be merged row by row, so it is replaced as a whole.
    if (!primaryKey.length) await target.query(`delete from public.${quote(table)}`);
    for (let offset = 0; offset < total; offset += BATCH_SIZE) {
      const batch = await source.query<{ j: string }>(
        `select coalesce(json_agg(t), '[]')::text as j
           from (select * from public.${quote(table)} order by ${orderBy} limit ${BATCH_SIZE} offset ${offset}) t`,
      );
      await target.query(
        `insert into public.${quote(table)} (${names.join(", ")})
         select ${names.join(", ")} from json_populate_recordset(null::public.${quote(table)}, $1::json)${conflict}`,
        [batch.rows[0].j],
      );
      copied += Math.min(BATCH_SIZE, total - offset);
    }
    await target.query("commit");
  } catch (error) {
    await target.query("rollback");
    throw new Error(`${table}: ${error instanceof Error ? error.message : String(error)}`);
  }

  const backupRows = Number((await target.query(`select count(*) as n from public.${quote(table)}`)).rows[0].n);
  return { table, sourceRows: total, copied, backupRows };
}

export async function backupToNeon(
  sourceUrl = process.env.direct_connection_str,
  targetUrl = process.env.backup_connection_str,
): Promise<BackupResult> {
  const started = Date.now();
  const startedAt = new Date(started).toISOString();
  if (!sourceUrl) return { ok: false, startedAt, durationMs: 0, tables: [], error: "direct_connection_str (Supabase) is not set" };
  if (!targetUrl) return { ok: false, startedAt, durationMs: 0, tables: [], error: "backup_connection_str (Neon) is not set" };

  const source = connect(sourceUrl);
  const target = connect(targetUrl);
  const tables: TableResult[] = [];
  let error: string | undefined;
  try {
    await source.connect();
    await target.connect();
    const list = await source.query<{ table_name: string }>(
      `select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by table_name`,
    );
    for (const { table_name } of list.rows) {
      if (SKIP_TABLES.has(table_name)) continue;
      tables.push(await copyTable(source, target, table_name));
    }
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  const result: BackupResult = { ok: !error, startedAt, durationMs: Date.now() - started, tables, error };
  try {
    // A run log in Neon, so you can see when each backup happened and how many rows it held.
    await target.query(
      `create table if not exists public.backup_runs (
         id bigserial primary key, started_at timestamptz not null, duration_ms integer, ok boolean not null, details jsonb)`,
    );
    await target.query(`insert into public.backup_runs (started_at, duration_ms, ok, details) values ($1, $2, $3, $4)`, [
      startedAt,
      result.durationMs,
      result.ok,
      JSON.stringify({ tables, error }),
    ]);
  } catch {
    // The log is a convenience; never let it hide the real result.
  }
  await source.end().catch(() => undefined);
  await target.end().catch(() => undefined);
  return result;
}
