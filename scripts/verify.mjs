import { chromium } from 'playwright';
const url = 'http://localhost:4173/';
const results = {};
async function run(name, opts, actions) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [], warns = [];
  page.on('console', m => { if (m.type()==='error') errors.push(m.text()); else if (m.type()==='warning') warns.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4200);
  const r = await actions(page);
  results[name] = { errors, warns: warns.slice(0,5), ...r };
  await browser.close();
}
const clipped = async (page) => page.evaluate(() => { let n=[]; document.querySelectorAll('h1,h2,h3,.big,.claim').forEach(e => { if (e.scrollWidth > e.clientWidth + 2) n.push(e.textContent.slice(0,30)); }); return n; });
const overflow = async (page) => page.evaluate(() => ({ docW: document.documentElement.scrollWidth, winW: window.innerWidth, overflow: document.documentElement.scrollWidth > window.innerWidth + 1 }));
const hasCanvas = async (page) => page.evaluate(() => !!document.querySelector('.matrix canvas'));
const fallback = async (page) => page.evaluate(() => !!document.querySelector('.matrix .fallback'));

await run('desktop', { viewport: { width: 1440, height: 900 } }, async (page) => {
  const out = { overflow: await overflow(page), canvas: await hasCanvas(page), clipped: await clipped(page) };
  await page.screenshot({ path: '/tmp/shots/d-hero.png' });
  // scroll through sections, screenshot each
  for (const id of ['problem','system','sample','receive','pilot','fit','method','contact']) {
    await page.evaluate((id) => window.scrollTo({ top: document.getElementById(id).offsetTop - 10 }), id);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `/tmp/shots/d-${id}.png` });
  }
  // mid-system scroll
  await page.evaluate(() => { const s = document.getElementById('system'); window.scrollTo({ top: s.offsetTop + s.offsetHeight*0.5 }); });
  await page.waitForTimeout(900);
  await page.screenshot({ path: '/tmp/shots/d-system-mid.png' });
  const diagramOn = await page.evaluate(() => document.querySelector('.diagram .dh b').textContent);
  // sample interaction
  await page.evaluate(() => window.scrollTo({ top: document.getElementById('sample').offsetTop }));
  await page.waitForTimeout(600);
  await page.click('.chip:nth-child(3)'); await page.waitForTimeout(200);
  const filtered = await page.evaluate(() => document.querySelectorAll('tr.rec').length);
  await page.click('.chip:nth-child(1)'); await page.waitForTimeout(200);
  await page.click('tr.rec'); await page.waitForTimeout(300);
  const expanded = await page.evaluate(() => !!document.querySelector('.trailbox'));
  await page.screenshot({ path: '/tmp/shots/d-sample-open.png' });
  // keyboard
  await page.focus('tr.rec'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); await page.waitForTimeout(200);
  const kbExpanded = await page.evaluate(() => document.querySelectorAll('.trailbox').length);
  const ctas = await page.evaluate(() => Array.from(document.querySelectorAll('a.btn')).map(a => a.getAttribute('href')));
  // intake flow
  await page.evaluate(() => window.scrollTo({ top: document.getElementById('start').offsetTop - 80 }));
  await page.waitForTimeout(500);
  await page.click('.intake button[type=submit]'); await page.waitForTimeout(200);
  const errShown = await page.evaluate(() => !!document.querySelector('.ierr'));
  await page.fill('.intake input[type=email]', 'buyer@example.com');
  await page.fill('.intake input[autocomplete=organization]', 'Example Data Co');
  const texts = await page.$$('.intake input[type=text]');
  await texts[2].fill('specialty surfactants'); await texts[3].fill('India and China');
  await page.fill('.intake textarea', 'precision on manufacturer label');
  await page.screenshot({ path: '/tmp/shots/d-intake.png' });
  const nav = page.waitForEvent('framenavigated', { timeout: 1500 }).catch(() => null);
  await page.click('.intake button[type=submit]'); await page.waitForTimeout(400);
  const sent = await page.evaluate(() => !!document.querySelector('.isent'));
  await page.screenshot({ path: '/tmp/shots/d-sent.png' });
  const dead = await page.evaluate(() => Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href')).filter(h => h === '#' || h === '' || h === '#contact-details'));
  return { ...out, diagramOn, filtered, expanded, kbExpanded, ctas: [...new Set(ctas)], intakeValidation: errShown, intakeSent: sent, deadAnchors: dead };
});

await run('mobile', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, async (page) => {
  const out = { overflow: await overflow(page), canvas: await hasCanvas(page), clipped: await clipped(page) };
  await page.screenshot({ path: '/tmp/shots/m-hero.png' });
  for (const id of ['problem','sample','pilot','contact']) {
    await page.evaluate((id) => window.scrollTo({ top: document.getElementById(id).offsetTop - 10 }), id);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `/tmp/shots/m-${id}.png` });
  }
  const sticky = await page.evaluate(() => !!document.querySelector('.sticky-cta.show'));
  const smallText = await page.evaluate(() => { let n=0; document.querySelectorAll('body *').forEach(e => { const fs = parseFloat(getComputedStyle(e).fontSize); if (e.children.length===0 && e.textContent.trim() && fs < 10.5) n++; }); return n; });
  return { ...out, sticky, smallTextNodes: smallText };
});

await run('reduced-motion', { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }, async (page) => ({ fallback: await fallback(page), canvas: await hasCanvas(page), overflow: await overflow(page), shot: await page.screenshot({ path: '/tmp/shots/rm.png' }) && 'ok' }));

await run('tablet', { viewport: { width: 900, height: 1100 } }, async (page) => { await page.screenshot({ path: '/tmp/shots/t-hero.png' }); return { overflow: await overflow(page), canvas: await hasCanvas(page) }; });

console.log(JSON.stringify(results, null, 1));
