import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const svg = readFileSync("/workspace/.grok/favicon.svg.tmp", "utf8");
const html = `<!DOCTYPE html><html><body style="margin:0;background:#111">
${svg.replace("<svg", '<svg width="16" height="16"')}
</body></html>`;
writeFileSync("/workspace/.grok/favicon-16.html", html);

const html32 = `<!DOCTYPE html><html><body style="margin:0;background:#111">
${svg.replace("<svg", '<svg width="32" height="32"')}
</body></html>`;
writeFileSync("/workspace/.grok/favicon-32.html", html32);

const browser = await chromium.launch();
for (const [size, file] of [[16, "favicon-16.html"], [32, "favicon-32.html"]]) {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  });
  await page.goto("file:///workspace/.grok/" + file);
  await page.screenshot({
    path: `/workspace/.grok/favicon-${size}.png`,
    type: "png",
  });
  await page.close();
}
await browser.close();
console.log("rasterized 16 and 32");
