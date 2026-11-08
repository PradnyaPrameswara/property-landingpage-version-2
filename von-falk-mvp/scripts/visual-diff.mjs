import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import process from "node:process";
import { Buffer } from "node:buffer";
import { join, resolve } from "node:path";
import { inflateSync } from "node:zlib";

const folder = resolve(process.argv[2] || "visual-snapshots");
const destination = resolve(process.argv[3] || "visual-audit");
const signature = Buffer.from([137,80,78,71,13,10,26,10]);
function decodePng(data) {
  if (!data.subarray(0,8).equals(signature)) throw Error("Not a PNG file");
  let offset=8, width=0, height=0, depth=0, color=0, interlace=0;
  const idats=[];
  while (offset+12 <= data.length) {
    const size=data.readUInt32BE(offset), kind=data.toString("ascii",offset+4,offset+8);
    if (offset+size+12 > data.length) throw Error("Truncated PNG");
    if (kind==="IHDR") {
      width=data.readUInt32BE(offset+8);height=data.readUInt32BE(offset+12);
      depth=data[offset+16];color=data[offset+17];interlace=data[offset+20];
    }
    if (kind==="IDAT") idats.push(data.subarray(offset+8,offset+8+size));
    offset+=size+12;
    if (kind==="IEND") break;
  }
  if (!width||!height||depth!==8||![2,6].includes(color)||interlace!==0) {
    throw Error(`Unsupported PNG format: ${width}x${height}, depth=${depth}, color=${color}, interlace=${interlace}`);
  }
  const channels=color===2?3:4, stride=width*channels;
  const packed=inflateSync(Buffer.concat(idats));
  if (packed.length!==(stride+1)*height) throw Error("Unexpected PNG row count");
  const pixels=Buffer.alloc(stride*height);
  for(let y=0;y<height;y++) {
    const row=y*stride, src=y*(stride+1), filter=packed[src];
    if(filter>4) throw Error("Unsupported PNG filter "+filter);
    for(let x=0;x<stride;x++) {
      const left=x>=channels?pixels[row+x-channels]:0;
      const above=y?pixels[row-stride+x]:0;
      const upperLeft=y&&x>=channels?pixels[row-stride+x-channels]:0;
      let predictor=0;
      if(filter===1) predictor=left;
      if(filter===2) predictor=above;
      if(filter===3) predictor=Math.floor((left+above)/2);
      if(filter===4) {
        const p=left+above-upperLeft, a=Math.abs(p-left),b=Math.abs(p-above),c=Math.abs(p-upperLeft);
        predictor=a<=b&&a<=c?left:b<=c?above:upperLeft;
      }
      pixels[row+x]=(packed[src+x+1]+predictor)&255;
    }
  }
  return {width,height,channels,pixels};
}
function compare(a,b) {
  if(a.width!==b.width||a.height!==b.height) throw Error("Reference and Astro screenshot dimensions differ");
  let total=0, changed=0, xMin=a.width, yMin=a.height, xMax=0, yMax=0;
  const count=a.width*a.height;
  for(let i=0;i<count;i++) {
    let max=0;
    for(let c=0;c<3;c++) {
      const delta=Math.abs(a.pixels[i*a.channels+c]-b.pixels[i*b.channels+c]);
      total+=delta;max=Math.max(max,delta);
    }
    if(max>32) {
      changed++;
      const x=i%a.width,y=Math.floor(i/a.width);
      xMin=Math.min(xMin,x);xMax=Math.max(xMax,x);
      yMin=Math.min(yMin,y);yMax=Math.max(yMax,y);
    }
  }
  return {width:a.width,height:a.height,
    meanAbsoluteError:Number((total/(count*3)).toFixed(2)),
    changedPercent:Number((changed/count*100).toFixed(2)),
    changedBounds:changed?{x:xMin,y:yMin,width:xMax-xMin+1,height:yMax-yMin+1}:null};
}
const list=(await readdir(folder)).filter(n=>n.endsWith(".png")),all=new Set(list);
const astro=list.filter(n=>!n.startsWith("reference-")).sort();
const missing=astro.filter(n=>!all.has("reference-"+n));
const orphan=list.filter(n=>n.startsWith("reference-")&&!all.has(n.slice(10)));
if(!astro.length||missing.length||orphan.length) {
  throw Error("Incomplete screenshot pairs: "+JSON.stringify({missing,orphan,count:astro.length}));
}
const results=[];
for(const screenshot of astro) {
  const [raw,original]=await Promise.all([
    readFile(join(folder,screenshot)),readFile(join(folder,"reference-"+screenshot))
  ]);
  results.push({screenshot,...compare(decodePng(raw),decodePng(original))});
}
results.sort((a,b)=>b.changedPercent-a.changedPercent||b.meanAbsoluteError-a.meanAbsoluteError);
await mkdir(destination,{recursive:true});
const limitation="Webflow's historical HTML includes inline reveal opacity/scale and remote-asset loading. Pixel scores are a triage tool, NOT a similarity percentage or proof of pixel-perfect parity.";
await writeFile(join(destination,"metrics.json"),JSON.stringify({pairs:results.length,threshold:"largest RGB channel delta >32",limitation,results},null,2)+"\n");
const lines=["# First-viewport visual difference audit","",
  "Compared **"+results.length+" paired screenshots** at identical dimensions.","",
  "**Limitation:** "+limitation+" Compare settled, loaded browser states before treating any flagged region as an actual layout regression.","",
  "| Pair | Size | Pixels above threshold | RGB mean error |",
  "|---|---:|---:|---:|",
  ...results.map(x=>`| ${x.screenshot} | ${x.width}×${x.height} | ${x.changedPercent}% | ${x.meanAbsoluteError} |`),
  "","Reference: historical frozen Webflow export, commit `1385bc25b16b8be15aa4c57297afea82969fdad9`. Only the visible viewport is assessed; screenshots do not measure below-fold sections or interactive states.",""];
await writeFile(join(destination,"report.md"),lines.join("\n"));
console.log(`Compared ${results.length} pairs. Highest difference: ${results[0].screenshot} (${results[0].changedPercent}% above RGB threshold).`);
