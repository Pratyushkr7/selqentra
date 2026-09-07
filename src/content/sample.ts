/**
 * DEMONSTRATION DATASET.
 * Every company below is FICTIONAL. Names, countries, evidence and dates are invented
 * to show the structure of an audit. No statement here refers to any real business.
 */
export type Status = 'verified' | 'review' | 'unsupported';
export type Role = 'Manufacturer' | 'Distributor' | 'Trader' | 'Unclear' | 'Duplicate' | 'Unsupported';
export type EvType = 'supports' | 'contradicts' | 'neutral';

export interface Evidence { date: string; kind: string; note: string; type: EvType }
export interface Rec {
  id: string; company: string; country: string; claimed: string; verified: Role;
  status: Status; product: string; evidence: string; confidence: number; risk: string; action: string;
  trail: Evidence[];
}

export const sample: Rec[] = [
  {
    id: 'R-014', company: 'Norvane Intermediates Ltd', country: 'India', claimed: 'Manufacturer', verified: 'Manufacturer', status: 'verified',
    product: 'Exact grade match', evidence: 'Strong · 4 sources agree', confidence: 0.91, risk: '—', action: 'Approach first. Request a batch COA naming the site.',
    trail: [
      { date: '2026-05', kind: 'Registry', note: 'Legal entity active; registered address matches SDS address.', type: 'supports' },
      { date: '2026-03', kind: 'Own domain', note: 'TDS and SDS for the exact grade hosted on own domain; legal name consistent.', type: 'supports' },
      { date: '2025-11', kind: 'Site address', note: 'Industrial-estate plot number; satellite view shows process plant footprint.', type: 'supports' },
      { date: '2024-09', kind: 'Certificate', note: 'ISO 9001 certificate number resolves on the accreditation register; scope covers the product.', type: 'supports' },
    ],
  },
  {
    id: 'R-027', company: 'Tessaro Chem Handel GmbH', country: 'Germany', claimed: 'Manufacturer', verified: 'Trader', status: 'verified',
    product: 'Product family only', evidence: 'Clear · role contradicted', confidence: 0.86, risk: 'Role misrepresented', action: 'Trader. Useful as a price reference, not as a producer.',
    trail: [
      { date: '2026-04', kind: 'Own domain', note: 'Describes itself as "manufacturer and distributor" of 1,400 unrelated products.', type: 'contradicts' },
      { date: '2026-04', kind: 'Site address', note: 'Registered at a shared office floor; no production site named anywhere.', type: 'contradicts' },
      { date: '2026-02', kind: 'Registry', note: 'Company purpose filed as "trade in chemical products". No manufacturing licence.', type: 'contradicts' },
    ],
  },
  {
    id: 'R-041', company: 'Qiloma Fine Chemical Co.', country: 'China', claimed: 'Manufacturer', verified: 'Unclear', status: 'review',
    product: 'Exact grade match', evidence: 'Mixed · production unverified', confidence: 0.52, risk: 'Plant unverified', action: 'Approach with two questions: plant address and certificate number.',
    trail: [
      { date: '2026-06', kind: 'Own domain', note: 'Detailed technical page for the exact grade, including process notes.', type: 'supports' },
      { date: '2026-06', kind: 'Site address', note: 'Address is unit 1802 of an office tower. No plant address given.', type: 'contradicts' },
      { date: '2026-01', kind: 'Certificate', note: 'ISO logo displayed; no certificate number; About page returns 404.', type: 'neutral' },
    ],
  },
  {
    id: 'R-058', company: 'Velmark Specialty Distribution', country: 'United States', claimed: 'Distributor', verified: 'Distributor', status: 'verified',
    product: 'Exact grade match', evidence: 'Strong · principal named', confidence: 0.88, risk: '—', action: 'Channel for trial volumes. Note the principal it represents.',
    trail: [
      { date: '2026-05', kind: 'Own domain', note: 'Lists the producer as a named principal; product page carries the principal\'s TDS.', type: 'supports' },
      { date: '2026-02', kind: 'Registry', note: 'Active entity; two warehouse locations, no manufacturing.', type: 'supports' },
    ],
  },
  {
    id: 'R-063', company: 'Arundel Polymer Works Pvt Ltd', country: 'India', claimed: 'Manufacturer', verified: 'Duplicate', status: 'review',
    product: 'Exact grade match', evidence: 'Same plant as R-019', confidence: 0.79, risk: 'Duplicate legal entity', action: 'Same plant as R-019 — one source, not two. Approach once.',
    trail: [
      { date: '2026-05', kind: 'Registry', note: 'Shares registered address and two directors with "Arundel Polymers Ltd" (record R-019).', type: 'supports' },
      { date: '2026-03', kind: 'Own domain', note: 'Both entities resolve to the same website and the same SDS documents.', type: 'supports' },
    ],
  },
  {
    id: 'R-072', company: 'Brisko Materials Inc.', country: 'Canada', claimed: 'Manufacturer', verified: 'Unsupported', status: 'unsupported',
    product: 'No match found', evidence: 'None retrievable', confidence: 0.12, risk: 'Source inaccessible', action: 'No verifiable source. Left off the recommendation.',
    trail: [
      { date: '2026-06', kind: 'Cited source', note: 'The URL in the original record returns 404. Archive copy last captured 2019.', type: 'contradicts' },
      { date: '2026-06', kind: 'Registry', note: 'No active entity found under this name in the stated jurisdiction.', type: 'contradicts' },
      { date: '2026-06', kind: 'Search', note: 'Name appears only in two aggregator directories, both citing each other.', type: 'neutral' },
    ],
  },
];

export const filters = [
  { id: 'all', label: 'All', test: (_r: Rec) => true },
  { id: 'verified', label: 'Classified', test: (r: Rec) => r.status === 'verified' },
  { id: 'review', label: 'Needs review', test: (r: Rec) => r.status === 'review' },
  { id: 'unsupported', label: 'Unverifiable', test: (r: Rec) => r.status === 'unsupported' },
  { id: 'mfg', label: 'Manufacturer', test: (r: Rec) => r.verified === 'Manufacturer' },
  { id: 'dist', label: 'Distributor', test: (r: Rec) => r.verified === 'Distributor' },
  { id: 'trd', label: 'Trader', test: (r: Rec) => r.verified === 'Trader' },
] as const;
