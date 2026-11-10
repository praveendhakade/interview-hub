import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createServer } from "node:net";

const project = process.cwd();
const routes = [
  "/",
  "/react",
  "/react/fundamentals",
  "/react/hooks",
  "/react/advanced",
  "/react/architecture-optimization",
  "/questions/what-is-react",
];
const widths = [375, 768, 1024, 1440];
const chromePath = process.env.CHROME_PATH ?? (process.platform === "win32"
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "google-chrome");
const externalBaseUrl = process.env.BROWSER_BASE_URL ? new URL(process.env.BROWSER_BASE_URL).origin : undefined;
const axeSource = await readFile(resolve(project, "node_modules/axe-core/axe.min.js"), "utf8");
const standaloneRoot = resolve(project, ".next/standalone");
if (!externalBaseUrl) {
  await mkdir(resolve(standaloneRoot, ".next"), { recursive: true });
  await cp(resolve(project, ".next/static"), resolve(standaloneRoot, ".next/static"), { recursive: true, force: true });
  await cp(resolve(project, "public"), resolve(standaloneRoot, "public"), { recursive: true, force: true });
}

function getPort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolvePort(address.port));
    });
  });
}

async function waitFor(check, label, timeout = 30_000) {
  const until = Date.now() + timeout;
  while (Date.now() < until) {
    try {
      const value = await check();
      if (value) return value;
    } catch {}
    await new Promise((done) => setTimeout(done, 250));
  }
  throw new Error(`Timed out waiting for ${label}`);
}

const appPort = externalBaseUrl ? undefined : await getPort();
const debugPort = await getPort();
const profile = await mkdtemp(join(tmpdir(), "interview-hub-browser-"));
const server = externalBaseUrl ? undefined : spawn(process.execPath, [resolve(project, ".next/standalone/server.js")], {
  cwd: project,
  windowsHide: true,
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, PORT: String(appPort), HOSTNAME: "127.0.0.1" },
});
const appBaseUrl = externalBaseUrl ?? `http://127.0.0.1:${appPort}`;
let serverOutput = "";
server?.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
server?.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });

let chrome;
let socket;
try {
  if (!externalBaseUrl) {
    await waitFor(async () => {
      if (server.exitCode !== null) throw new Error(`Next server exited: ${serverOutput}`);
      return (await fetch(`${appBaseUrl}/react`)).ok;
    }, "the production Next server");
  } else {
    await waitFor(async () => (await fetch(`${appBaseUrl}/react`)).ok, "the production deployment");
  }

  chrome = spawn(chromePath, [
    "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
    `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, "about:blank",
  ], { windowsHide: true, stdio: "ignore" });
  const browserInfo = await waitFor(async () => {
    const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
    return response.ok ? response.json() : undefined;
  }, "Chrome DevTools Protocol");

  const targetResponse = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: "PUT" });
  assert.equal(targetResponse.ok, true, "Chrome creates a page target");
  const target = await targetResponse.json();
  socket = new WebSocket(target.webSocketDebuggerUrl ?? browserInfo.webSocketDebuggerUrl);
  await new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener("open", resolveOpen, { once: true });
    socket.addEventListener("error", rejectOpen, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  const loadListeners = [];
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve: resolveCommand, reject: rejectCommand } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) rejectCommand(new Error(message.error.message));
      else resolveCommand(message.result);
    }
    if (message.method === "Page.loadEventFired") loadListeners.splice(0).forEach((listener) => listener());
  });

  function send(method, params = {}) {
    const id = ++nextId;
    socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolveCommand, rejectCommand) => pending.set(id, { resolve: resolveCommand, reject: rejectCommand }));
  }

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: axeSource });
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });

  async function navigate(path) {
    const loaded = new Promise((resolveLoad) => loadListeners.push(resolveLoad));
    await send("Page.navigate", { url: `${appBaseUrl}${path}` });
    await Promise.race([loaded, new Promise((_, reject) => setTimeout(() => reject(new Error(`Page load timed out: ${path}`)), 15_000))]);
  }

  async function evaluate(expression) {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  }

  async function auditAccessibility(route, width) {
    const accessibility = await evaluate(`(async () => {
      await document.fonts.ready;
      const result = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
      return result.violations.map(({ id, impact, help, nodes }) => ({
        id, impact, help,
        nodes: nodes.slice(0, 3).map((node) => ({ target: node.target, html: node.html, failureSummary: node.failureSummary })),
        probe: (() => { const element = document.querySelector('.guide-download'); if (!element) return undefined; const style = getComputedStyle(element); return { theme: document.documentElement.dataset.theme, color: style.color, background: style.backgroundColor, opacity: style.opacity, css: [...document.styleSheets].map((sheet) => sheet.href) }; })(),
      }));
    })()`);
    assert.deepEqual(accessibility, [], `${route} at ${width}px has WCAG A/AA accessibility violations: ${JSON.stringify(accessibility)}`);
    accessibilityPages += 1;
  }

  let measurements = 0;
  let accessibilityPages = 0;
  for (const route of routes) {
    await navigate(route);
    await auditAccessibility(route, 1440);
    await send("Emulation.setDeviceMetricsOverride", { width: 375, height: 900, deviceScaleFactor: 1, mobile: true });
    await auditAccessibility(route, 375);
    for (const width of widths) {
      await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
      const layout = await evaluate(`(() => ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        h1: Boolean(document.querySelector('main h1')),
        missingImageAlt: Boolean(document.querySelector('img:not([alt])')),
      }))()`);
      assert.ok(layout.document <= width + 1 && layout.body <= width + 1, `${route} has horizontal overflow at ${width}px: ${JSON.stringify(layout)}`);
      assert.equal(layout.h1, true, `${route} has a main heading at ${width}px`);
      assert.equal(layout.missingImageAlt, false, `${route} images have alt text`);
      measurements += 1;
    }
  }

  await navigate("/");
  await evaluate("new Promise((resolve) => setTimeout(resolve, 250))");
  const darkTheme = await evaluate(`(() => { document.querySelector('.header-actions .icon-button').click(); return document.documentElement.dataset.theme; })()`);
  assert.equal(darkTheme, "dark", "theme toggle switches to dark mode");
  await evaluate("new Promise((resolve) => setTimeout(resolve, 300))");
  await send("Emulation.setDeviceMetricsOverride", { width: 375, height: 900, deviceScaleFactor: 1, mobile: true });
  await auditAccessibility("/ in dark theme", 375);

  await send("Emulation.setDeviceMetricsOverride", { width: 375, height: 850, deviceScaleFactor: 1, mobile: true });
  await evaluate("new Promise((resolve) => setTimeout(resolve, 250))");
  const navigationOpened = await evaluate(`(async () => {
    const toggle = document.querySelector('.mobile-nav-toggle');
    toggle.click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    return !document.querySelector('#mobile-site-navigation').hidden && toggle.getAttribute('aria-expanded') === 'true';
  })()`);
  assert.equal(navigationOpened, true, "mobile navigation opens and exposes its state");
  const escapeClosed = await evaluate(`(async () => {
    const nav = document.querySelector('#mobile-site-navigation');
    nav.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 50));
    return nav.hidden && document.activeElement === document.querySelector('.mobile-nav-toggle');
  })()`);
  assert.equal(escapeClosed, true, "Escape closes mobile navigation and returns focus");

  console.log(`Browser checks passed: ${routes.length} primary routes × ${widths.join(", ")}px (${measurements} layout measurements); axe WCAG 2.2 A/AA passed on ${accessibilityPages} routes; mobile navigation keyboard interaction passed.`);
} catch (error) {
  console.error(error);
  if (serverOutput) console.error(serverOutput);
  process.exitCode = 1;
} finally {
  socket?.close();
  if (chrome && chrome.exitCode === null) {
    chrome.kill();
    await Promise.race([new Promise((done) => chrome.once("exit", done)), new Promise((done) => setTimeout(done, 5_000))]);
  }
  if (server && server.exitCode === null) {
    server.kill();
    await Promise.race([new Promise((done) => server.once("exit", done)), new Promise((done) => setTimeout(done, 5_000))]);
  }
  await rm(profile, { recursive: true, force: true });
}
