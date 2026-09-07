import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader'] }); const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto('file:///tmp/og.html'); await p.waitForTimeout(500);
await p.screenshot({ path: new URL('../public/og.png', import.meta.url).pathname }); await b.close(); console.log('og ok');
