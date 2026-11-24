export const failures = [
  { claimed: 'Manufacturer', found: 'Trading company. No plant, no registration in its own name.' },
  { claimed: 'Exact product', found: 'Product family only. The specific grade never appears.' },
  { claimed: '"ISO certified"', found: 'A logo image. No certificate number, no certifying body.' },
  { claimed: 'One supplier', found: 'Two legal entities, one plant. Your "competitive" quotes come from the same place.' },
];

export const classes = [
  { t: 'Manufacturer', d: 'Owns the process and the plant. Holds registrations in its own legal name. Publishes its own safety and technical documents.',
    s: ['Own-name regulatory registration', 'Plant address in an industrial zone', 'Process patents, with assignment history', 'Self-hosted SDS / TDS', 'Coherent product family'] },
  { t: 'Distributor', d: 'Represents named producers under agreement. Adds stock, service and reach. A legitimate channel, and a margin.',
    s: ['Names the principal it represents', 'Warehousing, no production', 'Producer\'s documents re-issued', 'Regional or application scope', 'Often the only route for small volumes'] },
  { t: 'Trader', d: 'Buys and resells without a fixed source. Often presents as a manufacturer. Hard to tell apart from one on the website alone.',
    s: ['Office-suite address, no plant', 'Vast, unrelated catalogue', 'Documents gated behind a form', 'Claims every role at once', 'Marketplace presence only'] },
];

export const stages = [
  { n: '01', t: 'Product brief', q: 'You tell us what you buy.', d: 'Product name, CAS number, application, grade or form, the properties that matter, the volume and where it lands. Attach the SDS or TDS you have.' },
  { n: '02', t: 'Global trade flows', q: 'Where is it actually produced and shipped from?', d: 'Trade records for the product\'s customs classification, read by exporting country and direction. The producing geographies show up before any company name does.' },
  { n: '03', t: 'Producers by country', q: 'Who, within those countries, is a candidate?', d: 'Registries, shipment records, regulatory filings and formulator databases surface the candidate companies in each exporting country.' },
  { n: '04', t: 'Classification', q: 'Manufacturer, distributor, or trader?', d: 'Every candidate is classified on evidence a trading company cannot fake: registrations in its own name, a plant address that matches its documents, patents, shipment records naming it as shipper. Nothing is dropped; everything is labelled.' },
  { n: '05', t: 'Verified Source Map', q: 'The landscape, resolved.', d: 'A classified map of real sources for your product, with the evidence behind each call and a clear recommendation on who to approach first.' },
];

export const outputs = [
  { n: '01', t: 'Verified Source Map', d: 'Every identified source classified as manufacturer, distributor or trader, with country, product and grade match, the evidence behind the call and a confidence score.' },
  { n: '02', t: 'Trade Flow Summary', d: 'Where your product is produced and exported from, by country and direction, so the map is read against how the market actually moves.' },
  { n: '03', t: 'Sourcing Recommendation', d: 'Who to approach first, who to keep as a channel, and the specific questions to put to each, so the next conversation is a short one.' },
];

export const fit = {
  yes: ['You buy a raw material and suspect you are paying a reseller\'s margin', 'You need a qualified second source before a shortage or a price rise forces one', 'Your current list mixes producers and resellers and you cannot tell which is which', 'You are launching a product that needs a material your current suppliers cannot provide', 'You are entering a new geography or shortening lead times', 'You need the evidence, not a directory printout'],
  no: ['You need someone to run the negotiation or place the order', 'You want a bulk email list to blast', 'You expect certainty where the public evidence does not support it', 'You need confidential or paid-database claims without authorised access'],
};

export const method = [
  { t: 'Brief', d: 'Product, CAS, grade, application, volume, destination.' },
  { t: 'Trade flows', d: 'Exporting countries and direction from trade records.' },
  { t: 'Producers', d: 'Candidate companies in each producing country.' },
  { t: 'Classification', d: 'Manufacturer, distributor or trader, on evidence.' },
  { t: 'Evidence check', d: 'Each call challenged against a contradicting source.' },
  { t: 'Source Map', d: 'Classified landscape and recommendation.' },
];

export const why = [
  { t: 'Supply risk', d: 'Dual sourcing, shorter lead times and a second producing region all start with knowing who else can make it.' },
  { t: 'Price', d: 'Long relationships quietly erode your sense of the market price. One credible new producer brings the leverage back.' },
  { t: 'New products', d: 'A launch or reformulation often needs a material, grade or certification your current supply base does not have.' },
  { t: 'R&D', d: 'Chemistry moves fast. A better-performing or off-patent alternative can lower cost or open a new product.' },
];

export const hard = [
  { t: 'The market is bigger than any search', d: 'Hundreds of thousands of suppliers worldwide, and every grade, certification and volume narrows the field differently.' },
  { t: 'Real producers stay quiet', d: 'Many plants never say online what they make. The loudest listings are often resellers.' },
  { t: 'Trust takes checking', d: 'Without prior vetting, samples and negotiations with a new name stall. Evidence up front shortens qualification.' },
];

export const record = {
  stats: [['280+', 'sourcing research projects since mid-2025'], ['190+', 'supplier lists built and verified'], ['160+', 'chemicals researched by CAS number, plus 50 blends'], ['45+', 'manufacturers and brands served']] as [string, string][],
  note: 'Work done for manufacturers in personal care, coatings and inks, paper, composites, pharma, food and fragrance.',
};

export const steps = [
  { n: '01', t: 'Identity', q: 'Does the company and legal entity exist?', s: 'Registry lookup · legal name vs trading name · registered address · status' },
  { n: '02', t: 'Role', q: 'Is it a manufacturer, distributor, trader, or unclear?', s: 'Own-name registrations · plant address vs office suite · portfolio coherence · self-description across listings' },
  { n: '03', t: 'Product', q: 'Is there direct evidence for the exact product or specification?', s: 'Product page vs family page · grade and spec stated · TDS/SDS on own domain' },
  { n: '04', t: 'Production', q: 'Is there credible evidence of manufacturing capability, location, or process?', s: 'Site address in an industrial zone · process patents with assignment history · shipment records naming the shipper' },
  { n: '05', t: 'Recency', q: 'Is the evidence current enough to support the claim?', s: 'Source dates · corporate changes since · regulatory status today, not at crawl time' },
  { n: '06', t: 'Confidence', q: 'What is verified, inferred, contradicted, or unresolved?', s: 'Every company scored · anything unresolved reported as unresolved, never guessed' },
];
