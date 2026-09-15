import crypto from "node:crypto";

export const PAYU_PAYMENT_URL =
  process.env.PAYU_PAYMENT_URL || "https://test.payu.in/_payment";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function payuHash(parts: string[]) {
  return crypto.createHash("sha512").update(parts.join("|")).digest("hex");
}

export function createPayuRequestHash(input: {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}) {
  const salt = requiredEnv("PAYU_SALT");
  return payuHash([
    input.key,
    input.txnid,
    input.amount,
    input.productinfo,
    input.firstname,
    input.email,
    input.udf1 || "",
    input.udf2 || "",
    input.udf3 || "",
    input.udf4 || "",
    input.udf5 || "",
    "",
    "",
    "",
    "",
    "",
    salt,
  ]);
}

export function verifyPayuResponseHash(data: Record<string, string>) {
  const salt = requiredEnv("PAYU_SALT");
  const sequence = [
    salt,
    data.status || "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    data.udf5 || "",
    data.udf4 || "",
    data.udf3 || "",
    data.udf2 || "",
    data.udf1 || "",
    data.email || "",
    data.firstname || "",
    data.productinfo || "",
    data.amount || "",
    data.txnid || "",
    data.key || "",
  ];
  if (data.additionalCharges) {
    sequence.unshift(data.additionalCharges);
  }
  const expected = payuHash(sequence);
  const received = data.hash || "";
  return received.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}

export function payuConfig() {
  return { key: requiredEnv("PAYU_KEY"), salt: requiredEnv("PAYU_SALT") };
}
