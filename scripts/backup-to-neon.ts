// Run a backup by hand:  npx tsx scripts/backup-to-neon.ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { backupToNeon } from "../src/lib/backup.ts";

async function main() {
  for (const line of readFileSync(resolve(process.cwd(), ".env"), "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }

  const result = await backupToNeon();
  for (const t of result.tables) {
    console.log(`${t.table.padEnd(20)} supabase ${String(t.sourceRows).padStart(4)}  copied ${String(t.copied).padStart(4)}  backup now ${String(t.backupRows).padStart(4)}`);
  }
  console.log(result.ok ? `Backup finished in ${result.durationMs} ms` : `Backup FAILED: ${result.error}`);
  process.exitCode = result.ok ? 0 : 1;
}

main();
