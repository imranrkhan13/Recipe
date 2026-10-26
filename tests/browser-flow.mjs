import { chromium } from 'playwright';
import pg from 'pg';import {randomBytes} from 'node:crypto';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const c=await browser.newContext({viewport:{width:320,height:740},reducedMotion:'reduce'});const p=await c.newPage();const username='synthetic_extra_'+Date.now();const password=randomBytes(24).toString('hex');
try {
 await p.goto('http://localhost:5173');
 await p.evaluate(()=>localStorage.setItem('mep-recipes2',JSON.stringify([{id:'old-synthetic',title:'Legacy synthetic pasta',time:12,servings:2,level:'Easy',rating:0,isFav:false,tags:[],ingredients:[],instructions:'Stir.',image:'',notes:''}])));
 await p.reload();await p.getByText('New here? Create an account').click();await p.getByLabel('Username',{exact:true}).fill(username);await p.getByLabel('Password',{exact:true}).fill(password);await p.getByRole('button',{name:'Create account',exact:true}).click();
 await p.getByRole('button',{name:'Copy into my account'}).waitFor();p.on('dialog',d=>d.accept());await p.getByRole('button',{name:'Copy into my account'}).click();await p.getByText('Legacy synthetic pasta',{exact:true}).first().waitFor();
 if(!await p.evaluate(()=>localStorage.getItem('mep-recipes2').includes('Legacy synthetic pasta'))) throw Error('Original lost');
 await p.locator('.card').scrollIntoViewIfNeeded();await p.screenshot({path:'/tmp/recipe-mobile-320.png'});
 if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Mobile overflow');
 await p.getByText('Legacy synthetic pasta',{exact:true}).last().click();await p.getByRole('button',{name:/Edit Recipe|Edit/,exact:false}).first().click();
 await p.locator('input[placeholder="e.g. Braised Short Ribs"]').fill('Edited synthetic pasta');await p.getByRole('button',{name:'Method',exact:true}).click();await p.getByRole('button',{name:/Save Recipe|Save Changes/,exact:false}).click();await p.getByText('Recipe saved to your private collection').waitFor();
 await p.reload();await p.locator('.card').waitFor();
 await p.locator('.card').scrollIntoViewIfNeeded();await p.locator('.card .ibtn').first().click();
 await p.waitForFunction(async()=>{const r=await fetch('/api/recipes');return (await r.json()).recipes[0].isFav});
 await p.setViewportSize({width:1280,height:900});await p.screenshot({path:'/tmp/recipe-desktop-final.png'});
 await p.setViewportSize({width:390,height:844});await p.screenshot({path:'/tmp/recipe-mobile-final.png'});
 await p.evaluate(()=>navigator.serviceWorker.ready);await p.reload();await p.locator('.card').waitFor();
 const cached=await p.evaluate(async()=>{const keys=await caches.keys();return (await Promise.all(keys.map(async k=>(await (await caches.open(k)).keys()).map(r=>r.url)))).flat()});if(cached.some(x=>x.includes('/api/')))throw Error('Private data cached');
 await c.setOffline(true);await p.reload();await p.getByRole('heading',{name:"You're offline"}).waitFor();await p.screenshot({path:'/tmp/recipe-offline.png'});
 await c.setOffline(false);await p.reload();await p.locator('.card').waitFor();await p.locator('.card .danger').click();await p.getByText('Recipe removed',{exact:true}).waitFor();await p.getByRole('button',{name:'Sign out',exact:true}).click();await p.getByRole('button',{name:'Sign in',exact:true}).waitFor();
 console.log('PASS import preserves originals, edit/reload/favorite/delete, mobile 320/390 and desktop, private cache exclusion, offline page, logout');
}finally{await browser.close();const db=new pg.Client({connectionString:process.env.DATABASE_URL});await db.connect();await db.query('DELETE FROM une_recette.users WHERE username=$1',[username]);await db.end();}
