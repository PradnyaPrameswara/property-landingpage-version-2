import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { Buffer } from "node:buffer";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";

const chromePath = process.env.CHROME_PATH || "/usr/bin/google-chrome";
const original = process.env.REFERENCE_URL || "http://127.0.0.1:4322";
const astro = process.env.SITE_URL || "http://127.0.0.1:4321";
const directory = "visual-snapshots";
const routes = [
  ["home","index.html","/"],["about-us","about-us.html","/about-us"],
  ["services","services.html","/services"],["projects","projects.html","/projects"],
  ["team","team.html","/team"],["blog","blog.html","/blog"],
  ["contact","contact.html","/contact"],
  ["project-niewuwndijk","project/niewuwndijk.html","/project/niewuwndijk"],
  ["project-amethiststraat","project/amethiststraat.html","/project/amethiststraat"],
  ["project-keizergracht","project/keizergracht.html","/project/keizergracht"],
  ["blog-dry-floral","blog/dry-floral-compositions-guide-to-match-the-interior.html","/blog/dry-floral-compositions-guide-to-match-the-interior"],
  ["blog-concrete","blog/concrete-coating-in-interior.html","/blog/concrete-coating-in-interior"],
  ["blog-theresa","blog/meet-theresa-the-new-team-member.html","/blog/meet-theresa-the-new-team-member"],
  ["licenses","template-8igy9jfp/licenses.html","/template-8igy9jfp/licenses"],
];
const specs=[];
for(const route of routes) specs.push({route,width:390,height:1000,label:"mobile"},{route,width:1440,height:1000,label:"desktop"});
for(const route of routes.filter(([id])=>["home","about-us","projects","contact"].includes(id)))
  for(const [width,height] of [[320,900],[768,1000],[1024,1000],[1920,1080]])
    specs.push({route,width,height,label:String(width)});
for(const route of routes.filter(([id])=>["project-niewuwndijk","blog-dry-floral"].includes(id)))
  for(const width of [767,768,991,992]) specs.push({route,width,height:1000,label:String(width)});
for(const route of routes.filter(([id])=>["home","about-us","projects","services","team","contact"].includes(id)))
  specs.push({route,width:700,height:1000,label:"700"});
assert.equal(specs.length,58);
await mkdir(directory,{recursive:true});

const profile=await mkdtemp(join(tmpdir(),"vf-visual-"));
const chrome=spawn(chromePath,["--headless=new","--no-sandbox","--disable-dev-shm-usage",
  "--disable-gpu","--remote-allow-origins=*","--remote-debugging-port=0",
  "--window-size=1440,1000","--user-data-dir="+profile,"about:blank"],{stdio:"ignore"});
let socket;
const pending=new Map();
let id=0;
try {
  let port=0;
  for(let tries=0;tries<300;tries++){
    if(chrome.exitCode!==null) throw Error("Chromium exited before opening debugging port");
    try {port=Number((await readFile(join(profile,"DevToolsActivePort"),"utf8")).split("\n")[0]);break;}
    catch {await delay(100);}
  }
  assert.ok(port,"Chromium debugging port not ready");
  const targets=await (await fetch("http://127.0.0.1:"+port+"/json/list")).json();
  const page=targets.find(x=>x.type==="page");
  assert.ok(page,"Chromium page missing");
  socket=new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{
    socket.addEventListener("open",resolve,{once:true});
    socket.addEventListener("error",reject,{once:true});
  });
  socket.addEventListener("message",event=>{
    const msg=JSON.parse(event.data),p=pending.get(msg.id);
    if(!p)return;
    pending.delete(msg.id);
    if(msg.error)p.reject(Error(JSON.stringify(msg.error)));
    else p.resolve(msg.result);
  });
  const command=(method,params={})=>new Promise((resolve,reject)=>{
    const next=++id;pending.set(next,{resolve,reject});
    socket.send(JSON.stringify({id:next,method,params}));
  });
  const evalJS=async expression=>{
    const answer=await command("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});
    if(answer.exceptionDetails)throw Error(answer.exceptionDetails.text);
    return answer.result?.value;
  };
  await command("Page.enable");
  await command("Runtime.enable");
  const captures=[];
  for(const spec of specs){
    const {route,width,height,label}=spec;
    await command("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:false});
    await command("Emulation.setEmulatedMedia",{features:[{name:"prefers-reduced-motion",value:"reduce"}]});
    for(const reference of [true,false]){
      const url=reference?original+"/"+route[1]:astro+route[2];
      await command("Page.navigate",{url});
      let ready=false;
      for(let tick=0;tick<120;tick++){
        const current=await evalJS("({ready:document.readyState,path:location.pathname})").catch(()=>null);
        if(current?.ready==="complete"&&current.path===new URL(url).pathname){ready=true;break;}
        await delay(100);
      }
      assert.ok(ready,"Page failed to load: "+url);
      async function settle(isReference) {
        await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,10000))]);
        const visible=Array.from(document.images).filter(img=>{
          const r=img.getBoundingClientRect();
          return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;
        });
        await Promise.all(visible.map(async img=>{
          if(!img.complete) await Promise.race([
            new Promise(resolve=>{img.addEventListener("load",resolve,{once:true});img.addEventListener("error",resolve,{once:true});}),
            new Promise(resolve=>setTimeout(resolve,10000))
          ]);
          if(img.naturalWidth&&img.decode)await img.decode().catch(()=>{});
        }));
        let normalized=0;
        if(isReference) for(const node of document.querySelectorAll("[data-w-id][style]")){
          const style=node.style;
          if(style.opacity&&Number(style.opacity)<1){style.opacity="1";normalized++;}
          if(style.transform&&/scale3d\(0\.9|scale\(0\.9|translate3d/.test(style.transform))style.transform="none";
        }
        const fix=document.createElement("style");
        fix.textContent="*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}";
        document.head.append(fix);
        window.scrollTo(0,0);
        await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        return {fontStatus:document.fonts.status,fontFaces:document.fonts.size,
          visibleImages:visible.length,brokenVisible:visible.filter(img=>!img.naturalWidth).map(img=>img.currentSrc),
          normalized,htmlOverflow:document.documentElement.scrollWidth>innerWidth+2,
          actualViewport:{width:innerWidth,height:innerHeight}};
      }
      const evidence=await evalJS("("+settle.toString()+")("+JSON.stringify(reference)+")");
      if(!reference&&evidence.brokenVisible.length)throw Error("Broken visible Astro images: "+JSON.stringify(evidence.brokenVisible));
      if(evidence.fontStatus!=="loaded")throw Error("Fonts are not settled at "+url);
      if(evidence.actualViewport.width!==width||evidence.actualViewport.height!==height)
        throw Error("Unexpected viewport at "+url+": "+JSON.stringify(evidence.actualViewport));
      const shot=await command("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});
      const name=(reference?"reference-":"")+route[0]+"-"+label+".png";
      await writeFile(join(directory,name),Buffer.from(shot.data,"base64"));
      captures.push({name,url,reference,...evidence});
    }
    console.log("Captured settled pair:",route[0],label);
  }
  assert.equal(captures.length,116);
  await writeFile(join(directory,"capture-manifest.json"),JSON.stringify({mode:"settled-first-viewport",referenceCommit:"1385bc25b16b8be15aa4c57297afea82969fdad9",captures},null,2)+"\n");
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  await delay(400);
  if(chrome.exitCode===null)chrome.kill("SIGKILL");
  await delay(200);
  await rm(profile,{recursive:true,force:true,maxRetries:6,retryDelay:300});
}
