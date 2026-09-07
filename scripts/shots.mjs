import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
for (const f of [0.02, 0.3, 0.52, 0.75, 1.0]) {
  await p.evaluate((f) => { const w = document.querySelector('.walk'); const top = w.getBoundingClientRect().top + window.scrollY; window.scrollTo({ top: top - 70 + f * (w.offsetHeight - window.innerHeight + 70) }); }, f);
  await p.waitForTimeout(1300);
  await p.screenshot({ path: `/tmp/shots/w-${Math.round(f * 100)}.png` });
}
await p.click('.chipbtn:nth-child(3)'); await p.waitForTimeout(1200); await p.screenshot({ path: '/tmp/shots/w-hpmc.png' });
for (const id of ['classes', 'receive', 'pilot']) { await p.evaluate((id) => window.scrollTo({ top: document.getElementById(id).getBoundingClientRect().top + window.scrollY - 20 }), id); await p.waitForTimeout(1100); await p.screenshot({ path: `/tmp/shots/s-${id}.png` }); }
await b.close();
