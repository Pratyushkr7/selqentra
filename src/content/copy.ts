export const failures = [
  { claimed: 'Manufacturer', found: 'Trading company. No plant, no registration in its own name.' },
  { claimed: 'Exact product', found: 'Product family only. The specific grade never appears.' },
  { claimed: 'Grade 98% min.', found: 'Grade unspecified on every page that could be found.' },
  { claimed: '"ISO certified"', found: 'A logo image. No certificate number, no certifying body.' },
  { claimed: 'One supplier', found: 'Two legal entities, one plant. Competitive tension is illusory.' },
  { claimed: 'Source cited', found: 'Source returns 404, or was last updated in 2019.' },
  { claimed: 'Plant in stated region', found: 'Registered office only. Production location unknown.' },
  { claimed: 'Conclusion supported', found: 'The source exists. It does not say what the record says it says.' },
];

export const steps = [
  { n: '01', t: 'Identity', q: 'Does the company and legal entity exist?', s: 'Registry lookup · legal name vs trading name · registered address · status' },
  { n: '02', t: 'Role', q: 'Is it a manufacturer, distributor, trader, or unclear?', s: 'Own-name registrations · plant address vs office suite · portfolio coherence · self-description across listings' },
  { n: '03', t: 'Product', q: 'Is there direct evidence for the exact product or specification?', s: 'Product page vs family page · grade and spec stated · TDS/SDS on own domain' },
  { n: '04', t: 'Production', q: 'Is there credible evidence of manufacturing capability, location, or process?', s: 'Site address in an industrial zone · process patents with assignment history · shipment records naming the shipper' },
  { n: '05', t: 'Recency', q: 'Is the evidence current enough to support the claim?', s: 'Source dates · corporate changes since · regulatory status today, not at crawl time' },
  { n: '06', t: 'Confidence', q: 'What is verified, inferred, contradicted, or unresolved?', s: 'Every record scored · every unresolved record reported as unresolved, never guessed' },
];

export const products = [
  { n: '01', t: 'Verified Evidence Register', d: 'Every record normalized, classified, sourced, confidence-scored, risk-flagged, and assigned a recommended action.' },
  { n: '02', t: 'Executive Decision Brief', d: 'Dataset health, recurring failure patterns, structural gaps, review priorities, and recommended remediation.' },
  { n: '03', t: 'Exception Queue', d: 'Unsupported, contradicted, duplicated, and unresolved records separated for human review.' },
];

export const pilot = {
  provide: ['The supplier dataset', 'Product or category context', 'Required geography', 'Your acceptance criteria'],
  deliver: ['Verified Evidence Register', 'Executive Decision Brief', 'Exception Queue', 'Record-level evidence with sources', 'Classification and confidence scoring', 'One clarification round'],
  exclude: ['No supplier outreach', 'No commercial negotiation', 'No confidential or paid-database claims unless you provide authorised access', 'No guarantee that every record can be verified', 'Unresolved records are reported explicitly, never guessed'],
};

export const fit = {
  yes: ['You generate supplier records using AI or automated research', 'Customers rely on the credibility of your data', 'Your internal team cannot manually inspect every record', 'False positives damage product trust', 'You need an expert-reviewed ground-truth sample', 'You want to measure model or pipeline quality before scaling'],
  no: ['You need bulk lead generation', 'You want unverifiable contact lists', 'You expect fabricated certainty', 'You need someone to impersonate your team', 'You require confidential competitor or employer data', 'You are looking for mass email outreach'],
};

export const method = [
  { t: 'Scope', d: 'Agree the sample, the definitions and what "useful" means to you.' },
  { t: 'Normalize', d: 'Resolve names, entities and duplicates before judging anything.' },
  { t: 'Verify', d: 'Each record against public evidence. Every call gets a source.' },
  { t: 'Challenge', d: 'Try to break each verified call with a contradicting source.' },
  { t: 'Second-pass QA', d: 'Re-read the exception queue cold, a day later.' },
  { t: 'Deliver', d: 'Register, brief, exception queue, and one round of clarification.' },
];
