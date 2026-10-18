import { NextResponse } from "next/server";
import { submissionSchema } from "@/lib/forms/schemas";
import { checkRateLimit, clientIpFrom } from "@/lib/forms/rateLimit";
import { deliverSubmission, failureCode } from "@/lib/forms/mailer";
import { verifyTurnstile } from "@/lib/forms/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32 * 1024;

// A submission completed in under this many milliseconds was almost certainly
// filled by a script rather than a person.
const MIN_ELAPSED_MS = 2500;

function fail(
  status: number,
  error: string,
  fieldErrors?: Record<string, string[]>,
  code?: string,
) {
  return NextResponse.json({ ok: false, error, fieldErrors, code }, { status });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return fail(413, "That submission is too large.");
  }

  const ip = clientIpFrom(request.headers);
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions from this connection. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail(400, "The submission could not be read.");
  }

  const parsed = submissionSchema.safeParse(payload);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    return fail(422, "Some details need attention.", flattened.fieldErrors as Record<string, string[]>);
  }

  const submission = parsed.data;

  // Honeypot and timing checks. Both answer 200 with a generic success so that a
  // bot receives no signal about why it was discarded; nothing is delivered.
  const trippedHoneypot = Boolean(submission.company);
  const tooFast = submission.elapsedMs > 0 && submission.elapsedMs < MIN_ELAPSED_MS;
  if (trippedHoneypot || tooFast) {
    return NextResponse.json({ ok: true });
  }

  const turnstile = await verifyTurnstile(
    (payload as { turnstileToken?: string } | null)?.turnstileToken,
    ip,
  );
  if (!turnstile.ok) {
    return fail(400, "Spam verification failed. Please reload the page and try again.");
  }

  const meta = {
    receivedAt: new Date().toISOString(),
    ip,
    userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? "unknown",
    consentText:
      typeof (payload as { consentText?: string } | null)?.consentText === "string"
        ? (payload as { consentText: string }).consentText.slice(0, 500)
        : "Consent checkbox accepted on the website form.",
  };

  const result = await deliverSubmission(submission, meta);

  if (!result.delivered) {
    console.error("[submit] delivery failed", { kind: submission.kind, reason: result.reason });
    return fail(
      503,
      "We could not deliver your message just now. Please email office@visiongoal.ch and we will pick it up from there.",
      undefined,
      failureCode(result.reason),
    );
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  // Personal information must never travel in a URL, so the endpoint refuses
  // anything other than POST.
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405 });
}
