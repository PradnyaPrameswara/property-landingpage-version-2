import assert from "node:assert/strict";
import process from "node:process";
import { spawn } from "node:child_process";
import { readFile, mkdtemp, rm, mkdir, writeFile } from "node:fs/promises";
import { Buffer } from "node:buffer";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const site = process.env.SITE_URL ?? "http://127.0.0.1:4321";
const browser = process.env.CHROME_PATH ?? process.env.CHROME_BIN ?? "/usr/bin/google-chrome";
const profile = await mkdtemp(join(tmpdir(), "vf-browser-"));
const chrome = spawn(browser, [
  "--headless=new", "--no-sandbox", "--disable-dev-shm-usage",
  "--disable-gpu", "--remote-allow-origins=*", "--remote-debugging-port=0",
  "--window-size=390,900", `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });

let socket;
let sequence = 0;
const pending = new Map();

try {
  let port;
  for (let attempt = 0; attempt < 300; attempt++) {
    if (chrome.exitCode !== null) throw new Error("Chrome exited during startup");
    try {
      port = Number((await readFile(join(profile, "DevToolsActivePort"), "utf8")).split("\n")[0]);
      break;
    } catch { await delay(100); }
  }
  assert.ok(port, "Chrome DevTools port unavailable after 30s; check runner load and Chrome startup");
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target = targets.find((item) => item.type === "page");
  assert.ok(target, "Chrome page unavailable");
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(JSON.stringify(message.error)));
    else entry.resolve(message.result);
  });
  function command(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++sequence;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await command("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result?.value;
  }
  async function eventually(expression, predicate, label, limitMs = 7000) {
    for (let elapsed = 0; elapsed < limitMs; elapsed += 100) {
      try {
        const value = await evaluate(expression);
        if (predicate(value)) return value;
      } catch { /* Navigation may replace the execution context. */ }
      await delay(100);
    }
    throw new Error(`Timed out: ${label}`);
  }
  async function visit(path) {
    await command("Page.navigate", { url: site + path });
    await eventually("({path:location.pathname,ready:document.readyState})",
      (x) => x?.path === path && x.ready === "complete", `navigate ${path}`);
  }
  async function viewport(width) {
    await command("Emulation.setDeviceMetricsOverride",
      { width, height: 1000, deviceScaleFactor: 1, mobile: false });
  }
  await command("Page.enable");
  await command("Runtime.enable");
  await viewport(390);
  await visit("/");
  const menuReady = 'document.querySelector(".vf-menu-button")?.closest("astro-island")?.hasAttribute("ssr") === false';
  await eventually(menuReady, Boolean, "React menu hydration");
  await evaluate('document.querySelector(".vf-menu-button").click()');
  await eventually('document.querySelector(".vf-menu-button")?.getAttribute("aria-expanded")',
    (x) => x === "true", "menu open");
  assert.equal(await evaluate('!!document.querySelector("#vf-nav a[href=\\"/contact\\"]")'), true);
  const mobileMenu = await evaluate('(() => { const box=document.querySelector("#vf-nav").getBoundingClientRect(); return { width:box.width, height:box.height, fontSize:parseFloat(getComputedStyle(document.querySelector("#vf-nav a")).fontSize) }; })()');
  assert.ok(mobileMenu.width >= 388 && mobileMenu.height >= 898,
    "Mobile navigation should cover the 390x1000 browser viewport: " + JSON.stringify(mobileMenu));
  assert.ok(mobileMenu.fontSize >= 62, "Expected original 4rem mobile navigation labels");
  await mkdir("interaction-snapshots", { recursive: true });
  const mobileShot = await command("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await writeFile("interaction-snapshots/menu-mobile-390.png", Buffer.from(mobileShot.data, "base64"));
  await evaluate('document.querySelector(".vf-menu-button").dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}))');
  await eventually('document.querySelector(".vf-menu-button")?.getAttribute("aria-expanded")',
    (x) => x === "false", "Escape closes menu");
  console.log("PASS navigation: open, links, Escape");
  await viewport(1440);
  await visit("/");
  await eventually('document.querySelector(".vf-menu-button")?.closest("astro-island")?.hasAttribute("ssr") === false',
    Boolean, "desktop navigation hydration");
  await evaluate('document.querySelector(".vf-menu-button").click()');
  await eventually('document.querySelector(".vf-menu-button")?.getAttribute("aria-expanded")',
    (x) => x === "true", "desktop navigation open");
  const desktopMenu = await evaluate('(() => { const box=document.querySelector("#vf-nav").getBoundingClientRect(); return { width:box.width, height:box.height, fontSize:parseFloat(getComputedStyle(document.querySelector("#vf-nav a")).fontSize) }; })()');
  assert.ok(desktopMenu.width >= 1438 && desktopMenu.height >= 998,
    "Desktop navigation should cover the full browser viewport: " + JSON.stringify(desktopMenu));
  assert.ok(desktopMenu.fontSize >= 102, "Expected original 6.5rem desktop navigation labels");
  const desktopShot = await command("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await writeFile("interaction-snapshots/menu-desktop-1440.png", Buffer.from(desktopShot.data, "base64"));
  await evaluate('document.querySelector(".vf-menu-button").click()');
  await eventually('document.querySelector(".vf-menu-button")?.getAttribute("aria-expanded")',
    (x) => x === "false", "desktop navigation closed");
  await viewport(390);
  console.log("PASS navigation layout: full-screen panel and source font sizes at 390/1440px");

  await visit("/contact");
  const formReady = 'document.querySelector("#contact-about")?.closest("astro-island")?.hasAttribute("ssr") === false';
  await eventually(formReady, Boolean, "React form hydration");
  assert.equal(await evaluate('document.querySelector("form[aria-label=\\"Project enquiry\\"]").checkValidity()'), false);
  const values = {name:"Visitor",email:"visitor@example.test",phone:"12345678",subject:"Interior project",about:"Please contact me about this project."};
  await evaluate(`(() => { const values=${JSON.stringify(values)};
    for (const [name,value] of Object.entries(values)) {
      const field=document.querySelector('[name="' + name + '"]');
      const proto=field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto,"value").set.call(field,value);
      field.dispatchEvent(new Event("input",{bubbles:true}));
    }
  })()`);
  assert.equal(await evaluate('document.querySelector("form[aria-label=\\"Project enquiry\\"]").checkValidity()'), true);
  assert.equal(await evaluate('document.querySelector(".vf-submit")?.textContent?.trim()'), "Prepare email");
  assert.equal(await evaluate('!!document.querySelector("#contact-email-note")'), true);
  console.log("PASS contact: fields, validity, explicit email-draft fallback");

  await evaluate("window.scrollTo(0, document.body.scrollHeight)");
  await eventually('document.querySelector(".vf-map-facade button")?.closest("astro-island")?.hasAttribute("ssr") === false',
    Boolean, "map hydration");
  await evaluate('document.querySelector(".vf-map-facade button").click()');
  await eventually('!!document.querySelector("iframe[title*=Map]")', Boolean, "map iframe");
  console.log("PASS map: opt-in embed");

  await visit("/project/niewuwndijk");
  await evaluate('document.querySelector(".vf-gallery-trigger")?.scrollIntoView()');
  await eventually('document.querySelector(".vf-gallery-trigger")?.closest("astro-island")?.hasAttribute("ssr") === false',
    Boolean, "project gallery hydration");
  await evaluate('document.querySelector(".vf-gallery-trigger").click()');
  await eventually('!!document.querySelector(".vf-lightbox-popup img.vf-lightbox-image")', Boolean, "gallery opens");
  const firstPhoto = await evaluate('document.querySelector(".vf-lightbox-image")?.getAttribute("src")');
  await evaluate('document.querySelector("[aria-label=\\"Next photo\\"]")?.click()');
  await eventually('document.querySelector(".vf-lightbox-image")?.getAttribute("src")',
    (value) => value && value !== firstPhoto, "gallery advances");
  await evaluate('document.querySelector("[aria-label=\\"Close image viewer\\"]")?.click()');
  await eventually('!document.querySelector(".vf-lightbox-popup")', Boolean, "gallery closes");
  console.log("PASS gallery: opens, advances and closes");

  for (const [width, columns] of [[390, 1], [700, 1], [767, 1], [768, 3], [1440, 3]]) {
    await viewport(width);
    await visit("/project/niewuwndijk");
    await evaluate('document.querySelector(".vf-gallery-grid")?.scrollIntoView({block:"center"})');
    await eventually('document.querySelector(".vf-gallery-trigger")?.closest("astro-island")?.hasAttribute("ssr") === false',
      Boolean, "project gallery hydrated at " + width);
    const positions = await evaluate('Array.from(document.querySelectorAll(".vf-gallery-grid figure")).map(el => Math.round(el.getBoundingClientRect().left))');
    assert.equal(positions.length, 3, "Expected three photos at " + width);
    const uniqueColumns = new Set(positions).size;
    assert.equal(uniqueColumns, columns, "Gallery columns at " + width + "px: " + JSON.stringify(positions));
    const photo = await evaluate('(() => { const box=document.querySelector(".vf-gallery-grid img").getBoundingClientRect(); return box.width / box.height; })()');
    const referenceRatio = width <= 767 ? 1.82 : 460 / 500;
    assert.ok(Math.abs(photo - referenceRatio) < 0.07,
      "Incorrect project image crop at " + width + "px: " + photo + " vs " + referenceRatio);
  }
  console.log("PASS gallery geometry: one column <=767px, three columns >=768px");

  for (const width of [320,390,700,767,768,1024,1440]) {
    await viewport(width);
    for (const path of ["/","/about-us","/projects","/contact"]) {
      await visit(path);
      const layout = await evaluate("({innerWidth,scrollWidth:document.documentElement.scrollWidth})");
      assert.ok(layout.scrollWidth <= layout.innerWidth + 2,
        `Overflow: ${path} at ${width}px (${layout.scrollWidth} > ${layout.innerWidth})`);
    }
  }
  console.log("PASS responsive: no horizontal overflow on four core pages at seven widths");
} finally {
  for (const entry of pending.values()) entry.reject(new Error("Browser closed"));
  socket?.close();
  chrome.kill("SIGTERM");
  await delay(100);
  await rm(profile, { recursive: true, force: true });
}
