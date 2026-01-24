import fs from "node:fs";
import path from "node:path";
const COL_COUNT = 24;
const MEDIA_BREAKPOINTS = [
  { size: 400, key: "xs" },
  { size: 600, key: "sm" },
  { size: 900, key: "md" },
  { size: 1200, key: "lg" },
  { size: 1440, key: "xl" },
];
const OUT_FILE = path.resolve("../pages/_cmswift-fe/css/responsive.css");

// prefisso classe
const CLASS_PREFIX = "cms-";

const UI_SIZES = ["xxs", "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"];

const DEFAULT_SIZE_GROUPS = [
  { prefix: "m", unit: "px" },
  { prefix: "p", unit: "px" },
  { prefix: "b", unit: "px" },
  { prefix: "f", unit: "px" },
  { prefix: "fw", unit: "number" },
  { prefix: "lh", unit: "number" },
  { prefix: "ls", unit: "px" },
  { prefix: "w", unit: "%" },
  { prefix: "min-w", unit: "%" },
  { prefix: "max-w", unit: "%" },
  { prefix: "h", unit: "%" },
  { prefix: "min-h", unit: "%" },
  { prefix: "max-h", unit: "%" },
  { prefix: "g", unit: "px" },
  { prefix: "r", unit: "px" },
  { prefix: "s", unit: "px" },
];

function parseSizeValue(value, unit, key, invalid) {
  const str = String(value);
  if (unit === "number") {
    if (!/^-?\d+(\.\d+)?$/.test(str)) {
      invalid.push(`${key}=${str} (expected number)`);
      return null;
    }
    const n = Number(str);
    if (!Number.isFinite(n) || n < 0) {
      invalid.push(`${key}=${str} (expected >= 0)`);
      return null;
    }
    return n;
  }

  if (unit === "px" || unit === "%") {
    const re = unit === "px" ? /^-?\d+(\.\d+)?px$/ : /^-?\d+(\.\d+)?%$/;
    if (!re.test(str)) {
      invalid.push(`${key}=${str} (expected ${unit})`);
      return null;
    }
    const n = Number(str.slice(0, -unit.length));
    if (!Number.isFinite(n) || n < 0) {
      invalid.push(`${key}=${str} (expected >= 0)`);
      return null;
    }
    return n;
  }

  invalid.push(`${key}=${str} (unknown unit ${unit})`);
  return null;
}

function validateDefaultSizes(defaultSize, sizes, groups) {
  const expected = new Set();
  const missing = [];
  const extras = [];
  const invalid = [];

  for (const group of groups) {
    let prev = -Infinity;
    for (const size of sizes) {
      const key = `${group.prefix}-${size}`;
      expected.add(key);
      if (!(key in defaultSize)) {
        missing.push(key);
        continue;
      }
      const parsed = parseSizeValue(defaultSize[key], group.unit, key, invalid);
      if (parsed !== null && parsed < prev) {
        invalid.push(`${key}=${defaultSize[key]} (non-increasing)`);
      }
      if (parsed !== null) {
        prev = parsed;
      }
    }
  }

  for (const key of Object.keys(defaultSize)) {
    if (!expected.has(key)) {
      extras.push(key);
    }
  }

  if (missing.length || extras.length || invalid.length) {
    const details = [];
    if (missing.length) details.push(`missing: ${missing.join(", ")}`);
    if (extras.length) details.push(`extras: ${extras.join(", ")}`);
    if (invalid.length) details.push(`invalid: ${invalid.join(", ")}`);
    throw new Error(`DEFAULT_SIZE validation failed: ${details.join(" | ")}`);
  }
}

const DEFAULT_SIZE = {
  //margin
  'm-xxs': '2px',
  'm-xs': '4px',
  'm-sm': '6px',
  'm-md': '10px',
  'm-lg': '16px',
  'm-xl': '24px',
  'm-xxl': '32px',
  'm-xxxl': '64px',
  //padding
  'p-xxs': '2px',
  'p-xs': '4px',
  'p-sm': '6px',
  'p-md': '10px',
  'p-lg': '16px',
  'p-xl': '24px',
  'p-xxl': '32px',
  'p-xxxl': '64px',
  //border
  'b-xxs': '2px',
  'b-xs': '4px',
  'b-sm': '6px',
  'b-md': '10px',
  'b-lg': '16px',
  'b-xl': '24px',
  'b-xxl': '32px',
  'b-xxxl': '64px',
  //font-size
  'f-xxs': '10px',
  'f-xs': '12px',
  'f-sm': '14px',
  'f-md': '16px',
  'f-lg': '18px',
  'f-xl': '20px',
  'f-xxl': '22px',
  'f-xxxl': '24px',
  //font-weight
  'fw-xxs': '100',
  'fw-xs': '200',
  'fw-sm': '300',
  'fw-md': '400',
  'fw-lg': '500',
  'fw-xl': '600',
  'fw-xxl': '700',
  'fw-xxxl': '800',
  //line-height
  'lh-xxs': '1',
  'lh-xs': '1.1',
  'lh-sm': '1.2',
  'lh-md': '1.3',
  'lh-lg': '1.4',
  'lh-xl': '1.5',
  'lh-xxl': '1.6',
  'lh-xxxl': '1.8',
  //letter-spacing
  'ls-xxs': '0px',
  'ls-xs': '0.2px',
  'ls-sm': '0.4px',
  'ls-md': '0.6px',
  'ls-lg': '0.8px',
  'ls-xl': '1px',
  'ls-xxl': '1.2px',
  'ls-xxxl': '1.6px',
  //width
  'w-xxs': '20%',
  'w-xs': '30%',
  'w-sm': '60%',
  'w-md': '80%',
  'w-lg': '100%',
  'w-xl': '120%',
  'w-xxl': '140%',
  'w-xxxl': '160%',
  //min-width
  'min-w-xxs': '20%',
  'min-w-xs': '30%',
  'min-w-sm': '60%',
  'min-w-md': '80%',
  'min-w-lg': '100%',
  'min-w-xl': '120%',
  'min-w-xxl': '140%',
  'min-w-xxxl': '160%',
  //max-width
  'max-w-xxs': '20%',
  'max-w-xs': '30%',
  'max-w-sm': '60%',
  'max-w-md': '80%',
  'max-w-lg': '100%',
  'max-w-xl': '120%',
  'max-w-xxl': '140%',
  'max-w-xxxl': '160%',
  //height
  'h-xxs': '20%',
  'h-xs': '40%',
  'h-sm': '60%',
  'h-md': '80%',
  'h-lg': '100%',
  'h-xl': '120%',
  'h-xxl': '140%',
  'h-xxxl': '160%',
  //min-height
  'min-h-xxs': '20%',
  'min-h-xs': '40%',
  'min-h-sm': '60%',
  'min-h-md': '80%',
  'min-h-lg': '100%',
  'min-h-xl': '120%',
  'min-h-xxl': '140%',
  'min-h-xxxl': '160%',
  //max-height
  'max-h-xxs': '20%',
  'max-h-xs': '40%',
  'max-h-sm': '60%',
  'max-h-md': '80%',
  'max-h-lg': '100%',
  'max-h-xl': '120%',
  'max-h-xxl': '140%',
  'max-h-xxxl': '160%',
  //gap
  'g-xxs': '2px',
  'g-xs': '4px',
  'g-sm': '6px',
  'g-md': '10px',
  'g-lg': '16px',
  'g-xl': '24px',
  'g-xxl': '32px',
  'g-xxxl': '64px',
  //border-radius
  'r-xxs': '2px',
  'r-xs': '4px',
  'r-sm': '6px',
  'r-md': '10px',
  'r-lg': '16px',
  'r-xl': '24px',
  'r-xxl': '32px',
  'r-xxxl': '9999px',
  //space
  's-xxs': '2px',
  's-xs': '4px',
  's-sm': '6px',
  's-md': '10px',
  's-lg': '16px',
  's-xl': '24px',
  's-xxl': '32px',
  's-xxxl': '64px',
};

const list_class = [
  //margin
  { name: 'margin', value: 'm', var: 'm' },
  { name: 'margin-left', value: 'm-l', var: 'm' },
  { name: 'margin-right', value: 'm-r', var: 'm' },
  { name: 'margin-top', value: 'm-t', var: 'm' },
  { name: 'margin-bottom', value: 'm-b', var: 'm' },
  //padding
  { name: 'padding', value: 'p', var: 'p' },
  { name: 'padding-left', value: 'p-l', var: 'p' },
  { name: 'padding-right', value: 'p-r', var: 'p' },
  { name: 'padding-top', value: 'p-t', var: 'p' },
  { name: 'padding-bottom', value: 'p-b', var: 'p' },
  //border
  { name: 'border', value: 'b', var: 'b' },
  { name: 'border-left', value: 'b-l', var: 'b' },
  { name: 'border-right', value: 'b-r', var: 'b' },
  { name: 'border-top', value: 'b-t', var: 'b' },
  { name: 'border-bottom', value: 'b-b', var: 'b' },
  //font
  { name: 'font-size', value: 'f', var: 'f' },
  { name: 'font-weight', value: 'fw', var: 'fw' },
  { name: 'line-height', value: 'lh', var: 'lh' },
  { name: 'letter-spacing', value: 'ls', var: 'ls' },
  //dimension
  { name: 'width', value: 'w', var: 'w' },
  { name: 'min-width', value: 'min-w', var: 'min-w' },
  { name: 'max-width', value: 'max-w', var: 'max-w' },
  { name: 'height', value: 'h', var: 'h' },
  { name: 'min-height', value: 'min-h', var: 'min-h' },
  { name: 'max-height', value: 'max-h', var: 'max-h' },
  //layout spacing
  { name: 'gap', value: 'g', var: 'g' },
  { name: 'column-gap', value: 'g-x', var: 'g' },
  { name: 'row-gap', value: 'g-y', var: 'g' },
  //radius
  { name: 'border-radius', value: 'r', var: 'r' },
];
function buildClassTemplates(classes, sizes) {
  const templates = [];
  for (const c of classes) {
    for (const size of sizes) {
      templates.push({
        suffix: `${c.value}-${size}`,
        decl: `${c.name}: var(--cms-${c.var}-${size});`,
      });
    }
  }
  return templates;
}

function buildColumnWidths(count) {
  const widths = new Array(count);
  for (let i = 0; i < count; i++) {
    const columns = i + 1;
    const v = columns * 100 / COL_COUNT;
    widths[i] = Number.isInteger(v) ? `${v}%` : `${v.toFixed(6)}%`;
  }
  return widths;
}

function addClassLines(lines, prefix, indent, templates) {
  for (const t of templates) {
    lines.push(`${indent}.${prefix}${t.suffix} { ${t.decl} }`);
  }
}
function addColumnLines(lines, prefix, indent, widths) {
  for (let i = 0; i < widths.length; i++) {
    const n = i + 1;
    const w = widths[i];
    lines.push(`${indent}.${prefix}col-${n} { flex: 0 0 ${w}; max-width: ${w}; }`);
  }
}
function main() {
  validateDefaultSizes(DEFAULT_SIZE, UI_SIZES, DEFAULT_SIZE_GROUPS);
  const lines = [];
  lines.push("/* AUTO-GENERATED FILE – DO NOT EDIT */");
  lines.push("/* CMSwift responsive – CSS classes */");
  lines.push("");

  //creare il root:
  lines.push(":root{");
  for (const i in DEFAULT_SIZE) {
    const d = DEFAULT_SIZE[i];
    lines.push(`  --cms-${i}: ${d};`);
  }
  lines.push("}");
  lines.push("");

  lines.push(".cms-row { display: flex; align-items: stretch; flex-wrap: wrap; }");
  lines.push(".cms-col { flex-direction: column; gap: var(--cms-s-md); box-sizing: border-box; }");
  lines.push(".cms-col-auto { max-width: 100%; flex: 0 0 auto; width: auto; }");
  lines.push('[class*="cms-col"] { position: relative; box-sizing: border-box; flex: 1; }');
  lines.push("");


  lines.push("");

  const classTemplates = buildClassTemplates(list_class, UI_SIZES);
  const columnWidths = buildColumnWidths(COL_COUNT);
  addClassLines(lines, CLASS_PREFIX, "", classTemplates);

  //creare i colonne da 24
  addColumnLines(lines, CLASS_PREFIX, "", columnWidths);

  // media queries
  for (const m of MEDIA_BREAKPOINTS) {
    lines.push(`@media (min-width: ${m.size}px) {`);
    const mediaPrefix = `${CLASS_PREFIX}${m.key}-`;
    addClassLines(lines, mediaPrefix, "  ", classTemplates);
    //medias colonne
    addColumnLines(lines, mediaPrefix, "  ", columnWidths);

    lines.push("}");
    lines.push("");
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, lines.join("\n"), "utf8");

  console.log(`✅ CSS generato: ${OUT_FILE}`);
  console.log(`   Classi create: ${lines.length}`);
}
main();
