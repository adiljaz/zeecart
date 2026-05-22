import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('BROWSER ERROR:', msg.text(), msg.location());
      }
    });
    
    page.on('pageerror', err => {
      console.log('PAGE ERROR STACK:', err.stack || err.toString());
    });
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
    await browser.close();
  } catch (err) {
    console.error('SCRIPT ERROR:', err);
    process.exit(1);
  }
})();
