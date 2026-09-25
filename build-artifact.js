/*
 * Builds artifact.html — the whole site as ONE self-contained file,
 * for publishing as a shareable link. Run: node build-artifact.js
 * Embeds the CSS, the JS, the brand marks and (when present) your photo.
 */
const fs = require("fs");

let h = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");
const js = fs.readFileSync("main.js", "utf8");

// drop the document skeleton — the artifact host supplies it
h = h.replace(/^[\s\S]*?<body>/, "").replace(/<\/body>[\s\S]*$/, "");

const svgURI = (f) =>
  "data:image/svg+xml;utf8," + encodeURIComponent(fs.readFileSync(f, "utf8").trim());

h = h.replace(/assets\/logo\/logo-primary\.svg/g, svgURI("assets/logo/logo-primary.svg"));
h = h.replace(/assets\/logo\/logo-cream\.svg/g, svgURI("assets/logo/logo-cream.svg"));

// the portrait, if it exists — otherwise pre-set the monogram so the page
// makes no request that can fail
const PHOTO = "assets/img/asad.jpg";
if (fs.existsSync(PHOTO)) {
  const uri = "data:image/jpeg;base64," + fs.readFileSync(PHOTO).toString("base64");
  h = h.split(PHOTO).join(uri);
  console.log("Embedded portrait:", Math.round(fs.statSync(PHOTO).size / 1024) + "KB");
} else {
  h = h.replace(/<div class="photo-frame( small)?">\s*<img[\s\S]*?>\s*(<div class="photo-fallback")/g,
                '<div class="photo-frame$1 no-photo">\n        $2');
  console.log("No portrait at " + PHOTO + " — using the AR monogram.");
}

const head = [
  "<title>Backend That Holds</title>",
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '<link href="https://fonts.googleapis.com/css2?family=Caprasimo&family=Figtree:wght@400;500;600;700;800&display=swap" rel="stylesheet">',
  "<style>" + css + "</style>",
].join("\n");

fs.writeFileSync("artifact.html", head + "\n" + h.trim() + "\n<script>" + js + "</scr" + "ipt>\n");
console.log("Wrote artifact.html —", Math.round(fs.statSync("artifact.html").size / 1024) + "KB");
