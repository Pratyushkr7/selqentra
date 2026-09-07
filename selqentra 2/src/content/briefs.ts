/**
 * Three sample product briefs for the walkthrough. Products are real chemical classes; the buyer,
 * volumes, exporter shares and producer counts are ILLUSTRATIVE and labelled as such on the page.
 * No real company is named or implied.
 */
export type Cls = 'M' | 'D' | 'T';
export interface Brief {
  id: string; label: string;
  fields: [string, string][];
  destination: string; // country code
  exporters: { cc: string; share: number }[]; // share 0..1, sorted desc
  producers: { cc: string; classes: Cls[] }[]; // per top country
}

export const COUNTRIES: Record<string, { name: string; lat: number; lon: number }> = {
  CN: { name: 'China', lat: 33, lon: 108 }, IN: { name: 'India', lat: 21, lon: 78 }, US: { name: 'United States', lat: 38, lon: -97 },
  DE: { name: 'Germany', lat: 51, lon: 10 }, IT: { name: 'Italy', lat: 42, lon: 12 }, JP: { name: 'Japan', lat: 36, lon: 138 },
  KR: { name: 'South Korea', lat: 36, lon: 128 }, BE: { name: 'Belgium', lat: 50.5, lon: 4.5 }, NL: { name: 'Netherlands', lat: 52, lon: 5.5 },
  AE: { name: 'UAE', lat: 24, lon: 54 }, TR: { name: 'Türkiye', lat: 39, lon: 35 }, BR: { name: 'Brazil', lat: -14, lon: -51 },
  MX: { name: 'Mexico', lat: 23, lon: -102 }, GB: { name: 'United Kingdom', lat: 54, lon: -2 }, ES: { name: 'Spain', lat: 40, lon: -4 },
  FR: { name: 'France', lat: 46, lon: 2 }, TH: { name: 'Thailand', lat: 15, lon: 101 }, ID: { name: 'Indonesia', lat: -5, lon: 120 },
  SA: { name: 'Saudi Arabia', lat: 24, lon: 45 }, ZA: { name: 'South Africa', lat: -29, lon: 25 }, AU: { name: 'Australia', lat: -25, lon: 134 },
  CA: { name: 'Canada', lat: 56, lon: -106 }, PL: { name: 'Poland', lat: 52, lon: 20 }, EG: { name: 'Egypt', lat: 27, lon: 30 }, VN: { name: 'Vietnam', lat: 16, lon: 108 },
};

export const briefs: Brief[] = [
  {
    id: 'gluconate', label: 'Sodium gluconate',
    fields: [['Product', 'Sodium gluconate'], ['CAS', '527-07-1'], ['Application', 'Concrete admixture · set retarder'], ['Grade / form', 'Technical, 98% min., powder'], ['Properties', 'Low chloride, free-flowing'], ['Volume', '120 t / year'], ['Delivery', 'Rotterdam, Netherlands']],
    destination: 'NL',
    exporters: [{ cc: 'CN', share: 0.62 }, { cc: 'IN', share: 0.12 }, { cc: 'IT', share: 0.09 }, { cc: 'US', share: 0.07 }, { cc: 'DE', share: 0.05 }, { cc: 'FR', share: 0.03 }],
    producers: [{ cc: 'CN', classes: ['M', 'M', 'M', 'T', 'T', 'T', 'M', 'T', 'D'] }, { cc: 'IN', classes: ['M', 'M', 'T', 'D'] }, { cc: 'IT', classes: ['M', 'D'] }],
  },
  {
    id: 'zpt', label: 'Zinc pyrithione',
    fields: [['Product', 'Zinc pyrithione, 48% dispersion'], ['CAS', '13463-41-7'], ['Application', 'Anti-dandruff shampoo'], ['Grade / form', 'Cosmetic grade, fine particle size'], ['Properties', 'D50 ≤ 10 µm, pH 6.5–8.5'], ['Volume', '24 t / year'], ['Delivery', 'Mumbai, India']],
    destination: 'IN',
    exporters: [{ cc: 'CN', share: 0.48 }, { cc: 'US', share: 0.18 }, { cc: 'IN', share: 0.14 }, { cc: 'BE', share: 0.1 }, { cc: 'JP', share: 0.06 }, { cc: 'DE', share: 0.04 }],
    producers: [{ cc: 'CN', classes: ['M', 'T', 'T', 'M', 'T', 'D', 'T'] }, { cc: 'US', classes: ['M', 'D', 'D'] }, { cc: 'IN', classes: ['M', 'M', 'T'] }],
  },
  {
    id: 'hpmc', label: 'HPMC',
    fields: [['Product', 'Hydroxypropyl methylcellulose'], ['CAS', '9004-65-3'], ['Application', 'Tile adhesive · water retention'], ['Grade / form', 'Construction grade, 100,000 mPa·s'], ['Properties', 'Modified, delayed dissolution'], ['Volume', '400 t / year'], ['Delivery', 'Jebel Ali, UAE']],
    destination: 'AE',
    exporters: [{ cc: 'CN', share: 0.55 }, { cc: 'US', share: 0.12 }, { cc: 'DE', share: 0.1 }, { cc: 'JP', share: 0.08 }, { cc: 'KR', share: 0.07 }, { cc: 'IN', share: 0.05 }],
    producers: [{ cc: 'CN', classes: ['M', 'M', 'T', 'T', 'T', 'T', 'M', 'D', 'T', 'M'] }, { cc: 'US', classes: ['M', 'D'] }, { cc: 'DE', classes: ['M', 'D', 'D'] }],
  },
];

export const CLASS_NAME: Record<Cls, string> = { M: 'Manufacturer', D: 'Distributor', T: 'Trader' };
export const CHIPS: Record<Cls, string[]> = {
  M: ['Own-name registration', 'Plant address matches SDS', 'Process patent'],
  D: ['Principal named', 'Warehouse, no plant'],
  T: ['Office address only', 'Documents gated', 'Claims every role'],
};
