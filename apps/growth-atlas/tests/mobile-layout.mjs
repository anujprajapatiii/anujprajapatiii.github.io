import {chromium,expect} from '@playwright/test';
import fs from 'node:fs';
import ts from 'typescript';
const src=ts.transpileModule(fs.readFileSync('src/catalog.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {patterns}=await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:320,height:740}});await page.goto('http://localhost:5173');await page.getByRole('button',{name:'Open navigation',exact:true}).click();await page.locator('.mobile-nav').getByRole('button',{name:/Monetization 10/}).click();await expect(page.locator('.pattern-card')).toHaveCount(10);const pageOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);const overflow=[];
for(const p of patterns){await page.evaluate(slug=>location.hash='pattern/'+slug,p.slug);await expect(page.locator('.detail-title h2')).toHaveText(p.title);if(await page.locator('.demo-card').evaluate(el=>el.scrollWidth>el.clientWidth+1))overflow.push(p.id)}
await page.screenshot({path:'/tmp/growth-mobile-demo-final.png'});console.log(JSON.stringify({narrowViewport:320,patterns:100,overflow,pageOverflow}));await browser.close();if(overflow.length||pageOverflow)process.exit(1);
