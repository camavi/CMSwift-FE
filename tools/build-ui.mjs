import fs from "node:fs/promises";
import path from "node:path";
import { transform } from "esbuild";

const rootDir = path.resolve("packages/ui/src");
const outputFile = path.resolve("packages/ui/dist/ui.js");
const minOutputFile = path.resolve("packages/ui/dist/min-ui.js");
const manifestFile = path.join(rootDir, "modules.json");
const legacyOutputFile = path.resolve("pages/_cmswift-fe/js/ui.js");
const legacyMinOutputFile = path.resolve("pages/_cmswift-fe/js/min-ui.js");

async function readModule(name) {
  const filename = path.join(rootDir, name);
  return fs.readFile(filename, "utf8");
}

async function main() {
  const manifest = JSON.parse(await fs.readFile(manifestFile, "utf8"));
  const modules = Array.isArray(manifest?.buildOrder) ? manifest.buildOrder : null;
  if (!modules || !modules.length) {
    throw new Error("Invalid ui module manifest");
  }
  const chunks = await Promise.all(modules.map(readModule));
  const output = chunks.join("");
  const minified = await transform(output, {
    loader: "js",
    minify: true,
    legalComments: "none",
    target: "es2018"
  });
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.mkdir(path.dirname(legacyOutputFile), { recursive: true });
  await fs.writeFile(outputFile, output, "utf8");
  await fs.writeFile(minOutputFile, minified.code, "utf8");
  await fs.writeFile(legacyOutputFile, output, "utf8");
  await fs.writeFile(legacyMinOutputFile, minified.code, "utf8");
  process.stdout.write(`[build:ui] wrote ${path.relative(process.cwd(), outputFile)} and ${path.relative(process.cwd(), minOutputFile)} from ${modules.length} modules (legacy mirror updated)\n`);
}

main().catch((error) => {
  console.error("[build:ui] failed:", error);
  process.exitCode = 1;
});
