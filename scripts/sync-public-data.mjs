import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const filesToSync = [
  ["content/articles.json", "public/articles-data.json"],
  ["content/site-data.json", "public/site-data.json"],
  ["content/site-config.json", "public/site-config.json"],
];

for (const [source, target] of filesToSync) {
  const sourcePath = path.join(root, source);
  const targetPath = path.join(root, target);
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`Synced ${source} -> ${target}`);
}
