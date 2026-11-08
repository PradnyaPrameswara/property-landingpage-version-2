import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import process from "node:process";

const dist = resolve(process.argv[2] || "dist");
async function walk(dir) {
  const output=[];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path=join(dir,entry.name);
    if (entry.isDirectory()) output.push(...await walk(path));
    if (entry.isFile()) output.push(path);
  }
  return output;
}
const files=await walk(dist);
const pages=files.filter(f=>f.endsWith("/index.html"));
if(pages.length!==14) throw Error("Expected 14 built pages; found "+pages.length);
const failures=[];
let links=0, images=0;
const exists=async path=>{try{return (await stat(path)).isFile();}catch{return false;}};
for(const page of pages) {
  const html=await readFile(page,"utf8");
  const route=page.slice(dist.length).replace(/\/index\.html$/,"")||"/";
  const headings=[...html.matchAll(/<h1(?:\s|>)/g)];
  if(headings.length!==1) failures.push(`${route}: expected one h1, got ${headings.length}`);
  const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  for(const match of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>/g)) {
    const href=match[1];
    if(!href) {failures.push(`${route}: empty anchor href`);continue;}
    links++;
    if(href[0]==="#") {
      if(href.length>1&&!ids.has(decodeURIComponent(href.slice(1)))) failures.push(`${route}: missing fragment target ${href}`);
      continue;
    }
    if(!href.startsWith("/")||href.startsWith("//")) continue;
    const url=new URL(href,"https://example.test");
    const target=decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g,"");
    if(!await exists(join(dist,target,"index.html"))) failures.push(`${route}: missing internal route ${href}`);
  }
  for(const match of html.matchAll(/<img\b[^>]*>/g)) {
    const element=match[0];
    if(!/\balt="[^"]*"/.test(element)) failures.push(`${route}: image without alt attribute`);
    const src=element.match(/\bsrc="([^"]+)"/)?.[1];
    if(!src) {failures.push(`${route}: image without src`);continue;}
    images++;
    if(src.startsWith("/")&&!src.startsWith("//")) {
      const target=decodeURIComponent(new URL(src,"https://example.test").pathname).replace(/^\/+/, "");
      if(!await exists(join(dist,target))) failures.push(`${route}: missing local image ${src}`);
    }
  }
}
await new Promise((resolveTick)=>process.stdout.write(`Checked ${pages.length} routes, ${links} links, ${images} images.\n`,resolveTick));
if(failures.length) {
  for(const error of failures) console.error(error);
  throw Error(`${failures.length} built-site QA failures`);
}
console.log("PASS generated routes, local assets, heading structure and internal links");
