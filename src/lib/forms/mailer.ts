import "server-only";
import { Resend } from "resend";
import { organisation } from "@/lib/organisation";
import { formKindLabels, type FormKind, type Submission } from "./schemas";
import { createOptInToken, siteUrl } from "./optIn";

// Where each form lands. Every form has an explicit destination; if an override
// is not set in the environment the general mailbox receives it, so a submission
// can never be silently dropped.
function destinationFor(kind: FormKind): string {
  const overrides: Partial<Record<FormKind, string | undefined>> = {
    application: process.env.INBOX_APPLICATIONS,
    consultation: process.env.INBOX_CONSULTATIONS,
    institutional: process.env.INBOX_INSTITUTIONAL,
    contact: process.env.INBOX_CONTACT,
    dossier: process.env.INBOX_DOSSIER,
    newsletter: process.env.INBOX_NEWSLETTER,
  };
  return overrides[kind] || process.env.INBOX_DEFAULT || organisation.email.general;
}

const FROM = process.env.MAIL_FROM || `Vision Goal <no-reply@visiongoal.ch>`;

// Resend's shared sender, which the previous visiongoal.ch site used. It needs
// no domain verification, but Resend only delivers it to the email address of
// the Resend account that owns the API key. Used automatically when Resend
// refuses FROM because visiongoal.ch is not verified in that account, so the
// enquiry notification can still reach the inbox until the domain is set up.
const FALLBACK_FROM = "Vision Goal <onboarding@resend.dev>";

// The previous site (deployed to the same Vercel project) stored its key as
// NEXT_PUBLIC_RESEND_API_KEY, so that name is accepted too. It is looked up
// by a computed name so it is read from the server's environment at request
// time: `next build` replaces any literal process.env.NEXT_PUBLIC_* reference
// with the build-time value — in the CI build that can be an empty or
// "[SENSITIVE]" placeholder rather than the key (and it would put the key in
// the build output).
const LEGACY_KEY_NAME = ["NEXT", "PUBLIC", "RESEND", "API", "KEY"].join("_");
function apiKey(): string | undefined {
  return process.env.RESEND_API_KEY || process.env[LEGACY_KEY_NAME] || undefined;
}

let client: Resend | null = null;
let clientKey: string | undefined;
function resend(): Resend | null {
  const key = apiKey();
  if (!key) return null;
  if (!client || clientKey !== key) {
    client = new Resend(key);
    clientKey = key;
  }
  return client;
}

type MailOptions = { to: string; subject: string; html: string; replyTo?: string };
type SendOutcome = { error: { message: string } | null; usedFallback: boolean };

function domainNotVerified(error: { message?: string } | null): boolean {
  return Boolean(error && /not verified/i.test(error.message ?? ""));
}

/**
 * Send from FROM; if Resend rejects it because the sending domain is not
 * verified (nothing was sent), retry once from FALLBACK_FROM. Any other error
 * is returned as is.
 */
async function send(mailer: Resend, options: MailOptions): Promise<SendOutcome> {
  const first = await mailer.emails.send({ from: FROM, ...options });
  if (!domainNotVerified(first.error) || FROM === FALLBACK_FROM) {
    return { error: first.error, usedFallback: false };
  }
  console.warn("[mailer] sending domain not verified; retrying from the shared Resend sender", {
    reason: first.error?.message,
  });
  const retry = await mailer.emails.send({ from: FALLBACK_FROM, ...options });
  return { error: retry.error, usedFallback: true };
}

const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const FIELD_LABELS: Record<string, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  role: "Role",
  organisation: "Organisation",
  institution: "Institution",
  country: "Country",
  programme: "Programme",
  cohort: "Preferred cohort",
  objective: "What they want",
  contribution: "What they bring",
  topic: "Discussion topic",
  timing: "Preferred timing",
  audience: "Audience",
  format: "Format",
  languages: "Languages",
  dates: "Preferred dates",
  description: "Description",
  subject: "Subject",
  message: "Message",
};

const HIDDEN_FIELDS = new Set(["kind", "consent", "company", "elapsedMs"]);

type Meta = { receivedAt: string; ip: string; userAgent: string; consentText: string };

function notificationHtml(submission: Submission, meta: Meta) {
  const rows = Object.entries(submission)
    .filter(([key, value]) => !HIDDEN_FIELDS.has(key) && value !== undefined && value !== "")
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding:8px 16px 8px 0;vertical-align:top;color:#5A6273;font:12px/1.5 -apple-system,Segoe UI,sans-serif;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;">${escape(
            FIELD_LABELS[key] ?? key,
          )}</td>
          <td style="padding:8px 0;vertical-align:top;color:#0B1B3F;font:14px/1.6 -apple-system,Segoe UI,sans-serif;white-space:pre-wrap;">${escape(
            String(value),
          )}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#F6F3EC;padding:32px;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #E3DED3;padding:32px;">
      <p style="margin:0 0 4px;color:#B8924A;font:11px/1 -apple-system,Segoe UI,sans-serif;text-transform:uppercase;letter-spacing:.16em;">Vision Goal — website submission</p>
      <h1 style="margin:0 0 24px;color:#0B1B3F;font:400 26px/1.2 Georgia,serif;">${escape(
        formKindLabels[submission.kind],
      )}</h1>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
      <hr style="margin:28px 0;border:0;border-top:1px solid #E3DED3;" />
      <p style="margin:0;color:#5A6273;font:12px/1.7 -apple-system,Segoe UI,sans-serif;">
        <strong style="color:#0B1B3F;">Consent record</strong><br />
        Given: yes · ${escape(meta.receivedAt)}<br />
        Statement: ${escape(meta.consentText)}<br />
        Source IP: ${escape(meta.ip)}<br />
        User agent: ${escape(meta.userAgent)}
      </p>
    </div>
  </body></html>`;
}

const ACKNOWLEDGEMENTS: Record<FormKind, { subject: string; heading: string; body: string[] }> = {
  application: {
    subject: "Your enquiry",
    heading: "Your enquiry has reached us.",
    body: [
      "Thank you for your interest. I read every enquiry personally and normally respond within 48 hours.",
    ],
  },
  consultation: {
    subject: "Your consultation request",
    heading: "Your request has reached us.",
    body: [
      "Thank you. I will be in touch within 48 hours to arrange a call at a time that suits you.",
    ],
  },
  institutional: {
    subject: "Your private cohort enquiry",
    heading: "Your enquiry has reached us.",
    body: [
      "Thank you. I normally respond within 48 hours to discuss format, timing and audience.",
    ],
  },
  contact: {
    subject: "Your message to Vision Goal",
    heading: "Your message has reached us.",
    body: ["Thank you for writing. I read every message personally and normally respond within 48 hours."],
  },
  // The dossier form is not currently reachable — no programme dates, fees or
  // cohorts are confirmed, so there is nothing to send a dossier about. The
  // schema and this copy stay so the flow can be switched back on later; the
  // wording deliberately promises no dates.
  dossier: {
    subject: "Your enquiry",
    heading: "Your request has reached us.",
    body: [
      "Thank you. I normally respond within 48 hours, and will write again once further details are confirmed.",
    ],
  },
  // The dispatch runs on a double opt-in, so this address is not subscribed until
  // the link in this email is followed. See sendOptInRequest below.
  newsletter: {
    subject: "Confirm your Vision Goal dispatch subscription",
    heading: "One more step.",
    body: [
      "Please confirm that you want to receive the dispatch by following the link below. We will not send you anything until you do.",
      "If you did not request this, ignore this message and nothing further will happen.",
    ],
  },
};

function button(href: string, label: string) {
  return `<p style="margin:0 0 24px;"><a href="${escape(
    href,
  )}" style="display:inline-block;background:#0B1B3F;color:#F6F3EC;text-decoration:none;padding:14px 28px;font:14px/1 -apple-system,Segoe UI,sans-serif;letter-spacing:.02em;">${escape(
    label,
  )}</a></p>`;
}

function acknowledgementHtml(kind: FormKind, action?: { href: string; label: string }) {
  const copy = ACKNOWLEDGEMENTS[kind];
  const paragraphs = copy.body
    .map(
      (p) =>
        `<p style="margin:0 0 16px;color:#3B4354;font:15px/1.7 -apple-system,Segoe UI,sans-serif;">${escape(
          p,
        )}</p>`,
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#F6F3EC;padding:32px;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E3DED3;padding:40px;">
      <p style="margin:0 0 6px;color:#B8924A;font:11px/1 -apple-system,Segoe UI,sans-serif;text-transform:uppercase;letter-spacing:.16em;">Vision Goal</p>
      <h1 style="margin:0 0 24px;color:#0B1B3F;font:400 28px/1.2 Georgia,serif;">${escape(
        copy.heading,
      )}</h1>
      ${paragraphs}
      ${action ? button(action.href, action.label) : ""}
      <hr style="margin:32px 0 20px;border:0;border-top:1px solid #E3DED3;" />
      <p style="margin:0;color:#8A8F9C;font:12px/1.7 -apple-system,Segoe UI,sans-serif;">
        ${escape(organisation.legalName)} · ${escape(organisation.address.line1)}, ${escape(
          `${organisation.address.postalCode} ${organisation.address.city}`,
        )}, ${escape(organisation.address.country)}<br />
        ${escape(organisation.uid)} · <a href="https://visiongoal.ch/legal/privacy" style="color:#8A8F9C;">Privacy policy</a>
      </p>
    </div>
  </body></html>`;
}

export type DeliveryResult = { delivered: boolean; reason?: string };

/**
 * Step one of the dispatch double opt-in: email the subscriber a confirmation
 * link and tell nobody else. The address is not on the list, and the Vision Goal
 * inbox is not notified, until the link is followed.
 */
export async function sendOptInRequest(email: string): Promise<DeliveryResult> {
  const mailer = resend();
  if (!mailer) return { delivered: false, reason: "RESEND_API_KEY is not configured." };

  const token = createOptInToken(email);
  if (!token) return { delivered: false, reason: "OPTIN_SECRET is not configured." };

  const result = await send(mailer, {
    to: email,
    subject: ACKNOWLEDGEMENTS.newsletter.subject,
    html: acknowledgementHtml("newsletter", {
      href: `${siteUrl()}/api/newsletter/confirm?t=${token}`,
      label: "Confirm my subscription",
    }),
  });

  if (result.error) return { delivered: false, reason: result.error.message };
  return { delivered: true };
}

/**
 * Step two: the link has been followed and the address is confirmed. Only now is
 * the subscription recorded in the inbox, with the timestamps of both the request
 * and the confirmation, which together form the opt-in evidence.
 */
export async function recordConfirmedSubscription(
  email: string,
  meta: { requestedAt: string; confirmedAt: string; ip: string },
): Promise<DeliveryResult> {
  const mailer = resend();
  if (!mailer) return { delivered: false, reason: "RESEND_API_KEY is not configured." };

  const result = await send(mailer, {
    to: destinationFor("newsletter"),
    subject: `[Dispatch subscription confirmed] ${email}`,
    html: `<!doctype html><html><body style="margin:0;background:#F6F3EC;padding:32px;">
      <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #E3DED3;padding:32px;">
        <p style="margin:0 0 4px;color:#B8924A;font:11px/1 -apple-system,Segoe UI,sans-serif;text-transform:uppercase;letter-spacing:.16em;">Vision Goal — dispatch</p>
        <h1 style="margin:0 0 24px;color:#0B1B3F;font:400 26px/1.2 Georgia,serif;">Subscription confirmed</h1>
        <p style="margin:0 0 16px;color:#0B1B3F;font:15px/1.7 -apple-system,Segoe UI,sans-serif;">Add to the dispatch list: <strong>${escape(
          email,
        )}</strong></p>
        <hr style="margin:24px 0;border:0;border-top:1px solid #E3DED3;" />
        <p style="margin:0;color:#5A6273;font:12px/1.7 -apple-system,Segoe UI,sans-serif;">
          <strong style="color:#0B1B3F;">Double opt-in record</strong><br />
          Requested: ${escape(meta.requestedAt)}<br />
          Confirmed: ${escape(meta.confirmedAt)}<br />
          Confirming IP: ${escape(meta.ip)}
        </p>
      </div>
    </body></html>`,
  });

  if (result.error) return { delivered: false, reason: result.error.message };
  return { delivered: true };
}

export async function deliverSubmission(
  submission: Submission,
  meta: Meta,
): Promise<DeliveryResult> {
  // The dispatch is the one form that must not reach the inbox on submission.
  if (submission.kind === "newsletter") {
    return sendOptInRequest(submission.email);
  }

  const mailer = resend();
  const to = destinationFor(submission.kind);

  if (!mailer) {
    // Without an API key the route still validates and records the submission,
    // but nothing can be sent. Surfaced as a 503 so the visitor is told to use
    // the direct email address rather than shown a false success screen.
    return { delivered: false, reason: "No Resend API key is configured (RESEND_API_KEY or NEXT_PUBLIC_RESEND_API_KEY)." };
  }

  const notification = await send(mailer, {
    to,
    replyTo: submission.email,
    // The dispatch is handled above, and every other form asks for a name.
    subject: `[${formKindLabels[submission.kind]}] ${submission.firstName} ${submission.lastName}`,
    html: notificationHtml(submission, meta),
  });

  if (notification.error) {
    return { delivered: false, reason: notification.error.message };
  }

  // The acknowledgement is best-effort: if it fails, the enquiry has still been
  // received and the visitor should not be told otherwise. It is skipped while
  // on the shared sender, which cannot deliver to visitors' addresses.
  if (notification.usedFallback) return { delivered: true };
  try {
    await send(mailer, {
      to: submission.email,
      subject: ACKNOWLEDGEMENTS[submission.kind].subject,
      html: acknowledgementHtml(submission.kind),
    });
  } catch {
    /* acknowledgement failure must not fail the submission */
  }

  return { delivered: true };
}
