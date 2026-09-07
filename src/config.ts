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
  /** Optional: a scheduling link (Cal.com, Calendly, Google appointment page). "Book a demo" opens it when set. */
  bookingUrl: (env.VITE_BOOKING_URL ?? '').trim(),
};

export const isConfigured = () => Boolean(config.contactEmail);
const enc = (s: string) => encodeURIComponent(s);

export const links = {
  /** Primary action. A scheduling link when configured; otherwise the on-page brief, which opens a prefilled email. */
  demo: () => config.bookingUrl || '#brief',
  brief: () => '#brief',
  sample: () => '#sample',
  question: () => (config.contactEmail ? `mailto:${config.contactEmail}?subject=${enc('Selqentra — a question')}` : '#brief'),
  mailto: (subject: string, body: string) => `mailto:${config.contactEmail}?subject=${enc(subject)}&body=${enc(body)}`,
};
