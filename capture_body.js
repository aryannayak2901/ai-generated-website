const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/admin/login');
  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', 'admin@chambers.com');
  await page.type('input[name="password"]', 'password123');
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('button[type="submit"]')
  ]);
  
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  const fs = require('fs');
  fs.writeFileSync('body.html', bodyHTML);
  
  await browser.close();
})();
