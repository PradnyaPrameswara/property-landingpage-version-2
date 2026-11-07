import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, mkdtemp, rm } from "node:fs/promises";
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
  for (let attempt = 0; attempt < 100; attempt++) {
    if (chrome.exitCode !== null) throw new Error("Chrome exited during startup");
    try {
      port = Number((await readFile(join(profile, "DevToolsActivePort"), "utf8")).split("\n")[0]);
      break;
    } catch { await delay(100); }
  }
  assert.ok(port, "Chrome DevTools port unavailable");
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
    message.error ? entry.reject(new Error(JSON.stringify(message.error))) : entry.resolve(message.result);
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
  await evaluate('document.querySelector(".vf-menu-button").dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}))');
  await eventually('document.querySelector(".vf-menu-button")?.getAttribute("aria-expanded")',
    (x) => x === "false", "Escape closes menu");
  console.log("PASS navigation: open, links, Escape");

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

  for (const width of [320,390,768,1440]) {
    await viewport(width);
    for (const path of ["/","/about-us","/projects","/contact"]) {
      await visit(path);
      const layout = await evaluate("({innerWidth,scrollWidth:document.documentElement.scrollWidth})");
      assert.ok(layout.scrollWidth <= layout.innerWidth + 2,
        `Overflow: ${path} at ${width}px (${layout.scrollWidth} > ${layout.innerWidth})`);
    }
  }
  console.log("PASS responsive: no horizontal overflow on four core pages at four widths");
} finally {
  for (const entry of pending.values()) entry.reject(new Error("Browser closed"));
  socket?.close();
  chrome.kill("SIGTERM");
  await delay(100);
  await rm(profile, { recursive: true, force: true });
}
