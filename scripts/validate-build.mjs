import fs from "node:fs";
import path from "node:path";

const routes = [
  "index.html", "new-page-1/index.html", "patterning-plural/index.html",
  "currentwork/index.html", "entryway/index.html", "standoffour/index.html",
  "summer2020/index.html", "2019/2020/index.html", "smallwork20192020/index.html",
  "movement/index.html", "small-work/index.html", "about/index.html",
  "contact/index.html", "sculpture/index.html", "mortimer-sands-ishimoto/index.html"
];

const expectedImageCounts = {
  "index.html": 2,
  "new-page-1/index.html": 26,
  "patterning-plural/index.html": 11,
  "currentwork/index.html": 13,
  "entryway/index.html": 14,
  "standoffour/index.html": 6,
  "summer2020/index.html": 8,
  "2019/2020/index.html": 6,
  "smallwork20192020/index.html": 8,
  "movement/index.html": 0,
  "small-work/index.html": 11,
  "about/index.html": 1,
  "contact/index.html": 0,
  "sculpture/index.html": 1,
  "mortimer-sands-ishimoto/index.html": 4
};

const errors = [];
for (const route of routes) {
  const file = path.join("_site", route);
  if (!fs.existsSync(file)) {
    errors.push(`Missing route: ${route}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const imageCount = [...html.matchAll(/<img\b/g)].length - (html.includes('class="lightbox"') ? 1 : 0);
  if (imageCount !== expectedImageCounts[route]) {
    errors.push(`Unexpected image count on ${route}: ${imageCount} (expected ${expectedImageCounts[route]})`);
  }
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
    const asset = path.join("_site", match[1]);
    if (!fs.existsSync(asset)) errors.push(`Missing asset on ${route}: ${match[1]}`);
  }
}

for (const route of ["index.html", "standoffour/index.html", "mortimer-sands-ishimoto/index.html"]) {
  const html = fs.readFileSync(path.join("_site", route), "utf8");
  if (!html.includes("data-carousel")) errors.push(`Missing carousel: ${route}`);
  if (!html.includes("Previous artwork") || !html.includes("Next artwork")) errors.push(`Missing controls: ${route}`);
}

const markdownPages = fs.readdirSync("src/pages").filter((file) => file.endsWith(".md"));
if (markdownPages.length < 18) errors.push(`Expected at least 18 Markdown pages, found ${markdownPages.length}`);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${routes.length} routes and ${markdownPages.length} Markdown source files.`);
