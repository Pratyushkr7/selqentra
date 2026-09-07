export const failures = [
  { claimed: 'Manufacturer', found: 'Trading company. No plant, no registration in its own name.' },
  { claimed: 'Exact product', found: 'Product family only. The specific grade never appears.' },
  { claimed: 'Grade 98% min.', found: 'Grade unspecified on every page that could be found.' },
  { claimed: '"ISO certified"', found: 'A logo image. No certificate number, no certifying body.' },
  { claimed: 'One supplier', found: 'Two legal entities, one plant. Competitive tension is illusory.' },
  { claimed: 'Source cited', found: 'Source returns 404, or was last updated in 2019.' },
  { claimed: 'Plant in stated region', found: 'Registered office only. Production location unknown.' },
  { claimed: 'Global producer', found: 'Appears in analyst lists by repetition. No primary evidence of production.' },
];

export const classes = [
  { t: 'Manufacturer', d: 'Owns the process and the plant. Holds registrations in its own legal name. Publishes its own safety and technical documents.',
    s: ['Own-name regulatory registration', 'Plant address in an industrial zone', 'Process patents, with assignment history', 'Self-hosted SDS / TDS', 'Coherent product family'] },
  { t: 'Distributor', d: 'Represents named producers under agreement. Adds stock, service and reach. A legitimate channel — and a margin.',
    s: ['Names the principal it represents', 'Warehousing, no production', 'Producer\'s documents re-issued', 'Regional or application scope', 'Often the only route for small volumes'] },
  { t: 'Trader', d: 'Buys and resells without a fixed source. Often presents as a manufacturer. Hard to tell apart from one — from the website alone.',
    s: ['Office-suite address, no plant', 'Vast, unrelated catalogue', 'Documents gated behind a form', 'Claims every role at once', 'Marketplace presence only'] },
];

export const stages = [
  { n: '01', t: 'Product brief', q: 'You tell us what you buy.', d: 'Product name, CAS number, application, grade or form, the properties that matter, the volume and where it lands. Attach the SDS or TDS you have.' },
  { n: '02', t: 'Global trade flows', q: 'Where is it actually produced and shipped from?', d: 'Trade records for the product\'s customs classification, read by exporting country and direction. The producing geographies show up before any company name does.' },
  { n: '03', t: 'Producers by country', q: 'Who, within those countries, is a candidate?', d: 'Registries, shipment records, regulatory filings and formulator databases surface the candidate companies in each exporting country.' },
  { n: '04', t: 'Classification', q: 'Manufacturer, distributor, or trader?', d: 'Every candidate is classified on evidence a trading company cannot fake — registrations in its own name, a plant address that matches its documents, patents, shipment records naming it as shipper. Nothing is dropped; everything is labelled.' },
  { n: '05', t: 'Verified Source Map', q: 'The landscape, resolved.', d: 'A classified map of real sources for your product, with the evidence behind each call and a clear recommendation on who to approach first.' },
];

export const outputs = [
  { n: '01', t: 'Verified Source Map', d: 'Every identified source classified as manufacturer, distributor or trader, with country, product and grade match, the evidence behind the call and a confidence score.' },
  { n: '02', t: 'Trade Flow Summary', d: 'Where your product is produced and exported from, by country and direction, so the map is read against how the market actually moves.' },
  { n: '03', t: 'Sourcing Recommendation', d: 'Who to approach first, who to keep as a channel, and the specific questions to put to each — so the next conversation is a short one.' },
];

export const fit = {
  yes: ['You buy chemicals or raw materials and want to know who actually makes them', 'Your current list mixes producers and resellers and you cannot tell which is which', 'You are qualifying a second source or entering a new geography', 'You need the evidence, not a directory printout', 'You want a precise landscape before you spend time on outreach'],
  no: ['You need someone to run the negotiation or place the order', 'You want a bulk contact list', 'You expect certainty where the public evidence does not support it', 'You need confidential or paid-database claims without authorised access'],
};

export const method = [
  { t: 'Brief', d: 'Product, CAS, grade, application, volume, destination.' },
  { t: 'Trade flows', d: 'Exporting countries and direction from trade records.' },
  { t: 'Producers', d: 'Candidate companies in each producing country.' },
  { t: 'Classification', d: 'Manufacturer, distributor or trader — on evidence.' },
  { t: 'Evidence check', d: 'Each call challenged against a contradicting source.' },
  { t: 'Source Map', d: 'Classified landscape and recommendation.' },
];
