/**
 * One sample product brief for the walkthrough. The product is real; the buyer,
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
  CA: { name: 'Canada', lat: 56, lon: -106 }, PE: { name: 'Peru', lat: -9, lon: -75 }, KE: { name: 'Kenya', lat: 0, lon: 38 }, CL: { name: 'Chile', lat: -33, lon: -71 }, NZ: { name: 'New Zealand', lat: -41, lon: 174 }, DO: { name: 'Dominican Rep.', lat: 19, lon: -70 }, PL: { name: 'Poland', lat: 52, lon: 20 }, EG: { name: 'Egypt', lat: 27, lon: 30 }, VN: { name: 'Vietnam', lat: 16, lon: 108 },
};

export const briefs: Brief[] = [
  {
    id: 'avocado', label: 'Avocado oil, refined',
    fields: [['Product', 'Avocado oil, refined'], ['CAS', '8024-32-6'], ['Application', 'Food manufacturing'], ['Grade / form', 'Conventional (non-Codex), bulk'], ['Properties', 'Low FFA, neutral taste, purity tested'], ['Volume', 'Illustrative: 80 t / year'], ['Delivery', 'United States']],
    destination: 'US',
    exporters: [{ cc: 'MX', share: 0.46 }, { cc: 'PE', share: 0.2 }, { cc: 'KE', share: 0.1 }, { cc: 'ES', share: 0.08 }, { cc: 'CL', share: 0.06 }, { cc: 'NZ', share: 0.04 }],
    producers: [{ cc: 'MX', classes: ['M', 'M', 'M', 'T', 'T', 'D', 'M', 'T'] }, { cc: 'PE', classes: ['M', 'M', 'T', 'D'] }, { cc: 'KE', classes: ['M', 'M', 'T'] }],
  },
];

export const CLASS_NAME: Record<Cls, string> = { M: 'Manufacturer', D: 'Distributor', T: 'Trader' };
export const CHIPS: Record<Cls, string[]> = {
  M: ['Own-name registration', 'Plant address matches SDS', 'Process patent'],
  D: ['Principal named', 'Warehouse, no plant'],
  T: ['Office address only', 'Documents gated', 'Claims every role'],
};
