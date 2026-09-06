/**
 * Runtime configuration — read from environment at build time so the source never carries
 * personal details. Set these in `.env.local` (see `.env.example`) or in the host's env panel.
 *
 * VITE_CONTACT_EMAIL is required for a production build; `npm run build` refuses without it,
 * so the site can never ship with a call to action that leads nowhere.
 */
const env = import.meta.env as Record<string, string | undefined>;

export const config = {
  brand: 'Selqentra',
  contactEmail: (env.VITE_CONTACT_EMAIL ?? '').trim(),
  /** Optional: a payment or booking link shown after the brief is sent (Razorpay page, Wise request, Cal.com). */
  pilotLink: (env.VITE_PILOT_LINK ?? '').trim(),
  /** Optional: public URL of a downloadable sample audit. The on-page sample is always available. */
  sampleUrl: (env.VITE_SAMPLE_URL ?? '').trim(),
  pilot: { price: '$299', records: 30, hours: 72 },
};

export const isConfigured = () => Boolean(config.contactEmail);

const enc = (s: string) => encodeURIComponent(s);

export const links = {
  /** Primary CTA: the on-page intake, which composes a structured brief and hands it to the visitor's mail client. */
  start: () => '#start',
  scope: () => (config.contactEmail ? `mailto:${config.contactEmail}?subject=${enc('Selqentra — scope question')}` : '#start'),
  sample: () => config.sampleUrl || '#sample',
  mailto: (subject: string, body: string) => `mailto:${config.contactEmail}?subject=${enc(subject)}&body=${enc(body)}`,
};
