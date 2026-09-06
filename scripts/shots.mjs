import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await p.evaluate(() => window.scrollTo({ top: 560 })); await p.waitForTimeout(4500);
await p.screenshot({ path: '/tmp/shots/d-matrix.png' });
for (const [name, frac] of [['a', 0.18], ['b', 0.42], ['c', 0.7]]) {
  await p.evaluate((f) => { const s = document.getElementById('system'); window.scrollTo({ top: s.offsetTop + f * s.offsetHeight - 200 }); }, frac); await p.waitForTimeout(800);
  await p.screenshot({ path: `/tmp/shots/d-sys-${name}.png` });
}
await p.evaluate(() => window.scrollTo({ top: document.getElementById('problem').offsetTop + 200 })); await p.waitForTimeout(1200);
await p.screenshot({ path: '/tmp/shots/d-cards.png' });
await p.evaluate(() => window.scrollTo({ top: document.getElementById('receive').offsetTop })); await p.waitForTimeout(1200);
await p.screenshot({ path: '/tmp/shots/d-products.png' });
await b.close();
