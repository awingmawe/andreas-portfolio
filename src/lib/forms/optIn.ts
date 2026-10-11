import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

// Double opt-in tokens for the dispatch.
//
// The confirmation link has to carry the subscriber's address, but personal
// information must not be readable in a URL, a browser history entry, or a
// referrer header. So the address is encrypted rather than merely signed: the
// token is opaque to anyone without OPTIN_SECRET, and AES-GCM's auth tag makes
// it tamper-evident, which means no database is needed to hold pending
// subscriptions.

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;
const TAG_BYTES = 16;

export const OPT_IN_TTL_DAYS = 7;
const TTL_MS = OPT_IN_TTL_DAYS * 24 * 60 * 60 * 1000;

function key(): Buffer | null {
  const secret = process.env.OPTIN_SECRET;
  // A short secret gives a false sense of safety; require something with real
  // entropy rather than silently accepting a weak one.
  if (!secret || secret.length < 32) return null;
  return createHash("sha256").update(secret).digest();
}

export function optInConfigured(): boolean {
  return key() !== null;
}

export function createOptInToken(email: string): string | null {
  const k = key();
  if (!k) return null;

  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, k, iv);
  const payload = JSON.stringify({ e: email, t: Date.now() });
  const encrypted = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);

  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

export type OptInResult =
  | { ok: true; email: string; issuedAt: number }
  | { ok: false; reason: "unconfigured" | "malformed" | "expired" };

export function verifyOptInToken(token: string | null | undefined): OptInResult {
  const k = key();
  if (!k) return { ok: false, reason: "unconfigured" };
  if (!token) return { ok: false, reason: "malformed" };

  try {
    const raw = Buffer.from(token, "base64url");
    if (raw.length <= IV_BYTES + TAG_BYTES) return { ok: false, reason: "malformed" };

    const decipher = createDecipheriv(ALGORITHM, k, raw.subarray(0, IV_BYTES));
    decipher.setAuthTag(raw.subarray(IV_BYTES, IV_BYTES + TAG_BYTES));

    const plaintext = Buffer.concat([
      decipher.update(raw.subarray(IV_BYTES + TAG_BYTES)),
      decipher.final(),
    ]).toString("utf8");

    const { e, t } = JSON.parse(plaintext) as { e?: unknown; t?: unknown };
    if (typeof e !== "string" || typeof t !== "number") return { ok: false, reason: "malformed" };
    if (Date.now() - t > TTL_MS) return { ok: false, reason: "expired" };

    return { ok: true, email: e, issuedAt: t };
  } catch {
    // Wrong key, truncated token, or a failed auth-tag check all land here.
    return { ok: false, reason: "malformed" };
  }
}

export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  // On a production deploy, use the project's real domain (Vercel provides
  // it) rather than VERCEL_URL, which is the one-off deployment address and
  // can sit behind Vercel's deployment protection — confirmation links built
  // from it would not open for subscribers.
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://visiongoal.ch";
}
