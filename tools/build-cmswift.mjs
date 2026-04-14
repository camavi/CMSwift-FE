import fs from "node:fs/promises";
import path from "node:path";
import { transform } from "esbuild";

const coreFile = path.resolve("packages/core/dist/cms.js");
const uiFile = path.resolve("packages/ui/dist/ui.js");
const outputFile = path.resolve("packages/cmswift/dist/cmswift.js");
const minOutputFile = path.resolve("packages/cmswift/dist/min-cmswift.js");

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

  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, output, "utf8");
  await fs.writeFile(minOutputFile, minified.code, "utf8");
  process.stdout.write(
    `[build:cmswift] wrote ${path.relative(process.cwd(), outputFile)} and ${path.relative(process.cwd(), minOutputFile)}\n`,
  );
}

main().catch((error) => {
  console.error("[build:cmswift] failed:", error);
  process.exitCode = 1;
});
