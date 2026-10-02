import {chromium} from '@playwright/test';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:5173');await page.waitForSelector('.pattern-card');await page.screenshot({path:'/tmp/growth-desktop.png'});
await page.getByRole('button',{name:'Explore Interactive ROI calculator',exact:true}).click();await page.waitForSelector('.demo-card');await page.screenshot({path:'/tmp/growth-demo.png'});
await page.getByRole('button',{name:'Close pattern',exact:true}).click();await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/growth-mobile.png'});
console.log(JSON.stringify({cards:await page.locator('.pattern-card').count(),errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)}));await browser.close();
