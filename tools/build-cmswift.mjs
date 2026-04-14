import fs from "node:fs/promises";
import path from "node:path";
import { transform } from "esbuild";

const coreFile = path.resolve("packages/core/dist/cms.js");
const uiFile = path.resolve("packages/ui/dist/ui.js");
const uiDistDir = path.resolve("packages/ui/dist");
const cmswiftDistDir = path.resolve("packages/cmswift/dist");
const outputFile = path.join(cmswiftDistDir, "cmswift.js");
const minOutputFile = path.join(cmswiftDistDir, "min-cmswift.js");

async function main() {
  const [core, ui] = await Promise.all([
    fs.readFile(coreFile, "utf8"),
    fs.readFile(uiFile, "utf8"),
  ]);

  const output = `${core}\n\n${ui}\n`;
  const minified = await transform(output, {
    loader: "js",
    minify: true,
    legalComments: "none",
    target: "es2018",
  });

  await fs.mkdir(cmswiftDistDir, { recursive: true });
  await fs.writeFile(outputFile, output, "utf8");
  await fs.writeFile(minOutputFile, minified.code, "utf8");
  await copyDir(path.join(uiDistDir, "css"), path.join(cmswiftDistDir, "css"));
  await copyDir(path.join(uiDistDir, "fonts"), path.join(cmswiftDistDir, "fonts"));
  await copyDir(path.join(uiDistDir, "img"), path.join(cmswiftDistDir, "img"));
  process.stdout.write(
    `[build:cmswift] wrote ${path.relative(process.cwd(), outputFile)} and ${path.relative(process.cwd(), minOutputFile)} (with css/fonts/img)\n`,
  );
}

async function copyDir(source, destination) {
  await fs.rm(destination, { recursive: true, force: true });
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.cp(source, destination, { recursive: true });
}

main().catch((error) => {
  console.error("[build:cmswift] failed:", error);
  process.exitCode = 1;
});
