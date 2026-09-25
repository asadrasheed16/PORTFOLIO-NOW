/*
 * Injects the official brand SVGs (from simple-icons) into index.html
 * between the <div class="skills"> markers. Run:  node build-skills.js
 * Re-runnable — it replaces whatever is currently in the grid.
 */
const fs = require("fs");
const path = require("path");

const ICONS = path.join(__dirname, "assets", "icons");

// file, label, brand colour (darkened where the official tone fails on cream)
const SKILLS = [
  ["nodedotjs",   "Node.js",     "#4d8c3f"],
  ["express",     "Express",     "#201e1d"],
  ["fastapi",     "FastAPI",     "#00796b"],
  ["mongodb",     "MongoDB",     "#3f8c3f"],
  ["javascript",  "JavaScript",  "#a98c00"],
  ["typescript",  "TypeScript",  "#3178c6"],
  ["python",      "Python",      "#2f6491"],
  ["react",       "React",       "#0f88a3"],
  ["nextdotjs",   "Next.js",     "#201e1d"],
  ["tailwindcss", "Tailwind CSS","#0a8fa8"],
  ["postman",     "Postman",     "#e2521a"],
  ["git",         "Git",         "#d43e1f"],
  ["github",      "GitHub",      "#201e1d"],
  ["docker",      "Docker",      "#1a7fd4"],
  ["supabase",    "Supabase",    "#1f8f60"],
  ["n8n",         "n8n",         "#d2325c"],
  ["anthropic",   "Anthropic",   "#b2622d"],
  ["figma",       "Figma",       "#d63b12"],
];

const tiles = SKILLS.map(([file, label, colour]) => {
  const raw = fs.readFileSync(path.join(ICONS, file + ".svg"), "utf8");
  const svg = raw
    .replace(/<title>.*?<\/title>/s, "")          // label lives in the caption
    .replace(/<svg /, '<svg aria-hidden="true" focusable="false" ')
    .replace(/\s*role="img"/, "")
    .trim();
  return (
    `      <div class="skill" style="color:${colour}" title="${label}">\n` +
    `        ${svg}\n` +
    `        <span>${label}</span>\n` +
    `      </div>`
  );
}).join("\n");

const indexPath = path.join(__dirname, "index.html");
let html = fs.readFileSync(indexPath, "utf8");

// Replace only the grid's own children — matched as one block so a stray
// "</div>" further down the page can never be mistaken for the grid's.
const GRID = /(<div class="skills" id="skillsGrid">)[\s\S]*?(\n?\s*<\/div>\s*\n\s*<\/div>\s*\n<\/section>)/;
if (!GRID.test(html)) throw new Error("skills grid not found in index.html");
html = html.replace(GRID, (_m, openTag, tail) => openTag + "\n" + tiles + tail);
fs.writeFileSync(indexPath, html);
console.log(`Injected ${SKILLS.length} skill logos.`);
