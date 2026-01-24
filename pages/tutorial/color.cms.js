

/**
 * CMSwift UI — Color System Demo
 *
 * This page showcases the CMSwift Design Tokens palette:
 * - Neutral + Primary + Accent + Status scales (50..950)
 * - Semantic tokens (bg/surface/text/border/primary/...)
 * - Light/Dark toggle via data-theme
 * - Brand skins via data-brand
 *
 * NOTE: This page assumes your global CSS tokens are defined in :root
 * (e.g. in a global css like `cmswift.tokens.css`).
 */


// Alias for readability
const UI = _ui;

const BRAND_OPTIONS = [
  { label: "Default", value: "" },
  { label: "Emerald", value: "emerald" },
  { label: "Violet", value: "violet" },
];

const THEME_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const SCALE_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const SCALES = [
  { title: "Neutral / Gray", prefix: "--cms-gray" },
  { title: "Primary / Swift Blue", prefix: "--cms-primary" },
  { title: "Accent / Aurora Teal", prefix: "--cms-accent" },
  { title: "Success", prefix: "--cms-success" },
  { title: "Warning", prefix: "--cms-warning" },
  { title: "Danger", prefix: "--cms-danger" },
  { title: "Info", prefix: "--cms-info" },
  { title: "Violet", prefix: "--cms-violet" },
  { title: "Pink", prefix: "--cms-pink" },
  { title: "Orange", prefix: "--cms-orange" },
];

const SOCIAL = [
  { title: "Facebook", token: "--cms-facebook" },
  { title: "Twitter", token: "--cms-twitter" },
  { title: "X", token: "--cms-x" },
  { title: "LinkedIn", token: "--cms-linkedin" },
  { title: "Google", token: "--cms-google" },
  { title: "YouTube", token: "--cms-youtube" },
  { title: "Vimeo", token: "--cms-vimeo" },
  { title: "Dribbble", token: "--cms-dribbble" },
  { title: "GitHub", token: "--cms-github" },
  { title: "Instagram", token: "--cms-instagram" },
  { title: "Pinterest", token: "--cms-pinterest" },
  { title: "RSS", token: "--cms-rss" },
];

const SEMANTIC = [
  {
    group: "Surfaces", items: [
      { label: "Background", token: "--cms-bg" },
      { label: "Background 2", token: "--cms-bg-2" },
      { label: "Surface", token: "--cms-surface" },
      { label: "Surface 2", token: "--cms-surface-2" },
      { label: "Surface 3", token: "--cms-surface-3" },
    ]
  },
  {
    group: "Text", items: [
      { label: "Text", token: "--cms-text" },
      { label: "Text 2", token: "--cms-text-2" },
      { label: "Text 3", token: "--cms-text-3" },
      { label: "Text Inverse", token: "--cms-text-inverse" },
    ]
  },
  {
    group: "Borders", items: [
      { label: "Border", token: "--cms-border" },
      { label: "Border 2", token: "--cms-border-2" },
    ]
  },
  {
    group: "Brand", items: [
      { label: "Primary", token: "--cms-primary" },
      { label: "Primary Hover", token: "--cms-primary-hover" },
      { label: "Primary Soft", token: "--cms-primary-soft" },
      { label: "Primary Text", token: "--cms-primary-text" },
      { label: "Accent", token: "--cms-accent" },
      { label: "Accent Soft", token: "--cms-accent-soft" },
      { label: "Accent Text", token: "--cms-accent-text" },
    ]
  },
  {
    group: "States", items: [
      { label: "Success", token: "--cms-success" },
      { label: "Success Soft", token: "--cms-success-soft" },
      { label: "Warning", token: "--cms-warning" },
      { label: "Warning Soft", token: "--cms-warning-soft" },
      { label: "Danger", token: "--cms-danger" },
      { label: "Danger Soft", token: "--cms-danger-soft" },
      { label: "Info", token: "--cms-info" },
      { label: "Info Soft", token: "--cms-info-soft" },
    ]
  },
  {
    group: "Focus / Ring", items: [
      { label: "Ring", token: "--cms-ring" },
      { label: "Ring Strong", token: "--cms-ring-strong" },
    ]
  },
  {
    group: "Shadows", items: [
      { label: "Shadow SM", token: "--cms-shadow-sm" },
      { label: "Shadow MD", token: "--cms-shadow-md" },
      { label: "Shadow LG", token: "--cms-shadow-lg" },
    ]
  },
];

function setTheme(nextTheme) {
  const root = document.documentElement;
  if (nextTheme === "dark") root.dataset.theme = "dark";
  else delete root.dataset.theme;
}

function setBrand(nextBrand) {
  const root = document.documentElement;
  if (nextBrand) root.dataset.brand = nextBrand;
  else delete root.dataset.brand;
}

function getTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getBrand() {
  return document.documentElement.dataset.brand || "";
}

function copyText(text) {
  try {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      return;
    }
  } catch (_) { }

  // Fallback
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

function Swatch({ label, token, height = 46, width = 200 } = {}) {
  const valueText = `var(${token})`;
  // prendiamo i token per il shadow
  let shadow = '';
  if (token === '--cms-shadow-sm') shadow = 'var(--cms-shadow-sm)';
  if (token === '--cms-shadow-md') shadow = 'var(--cms-shadow-md)';
  if (token === '--cms-shadow-lg') shadow = 'var(--cms-shadow-lg)';

  return UI.Card({
    class: "cms-color-swatch",
    children: [
      UI.Row({
        class: "cms-color-swatch__row",
        children: [
          UI.Col({
            class: "cms-color-swatch__chipwrap",
            children: [
              UI.Container({
                class: "cms-color-swatch__chip",
                style: {
                  minHeight: typeof height === "number" ? `${height}px` : String(height),
                  width: typeof width === "number" ? `${width}px` : String(width),
                  background: valueText,
                  boxShadow: shadow,

                  borderRadius: "12px",
                },
              }),
            ],
          }),
          UI.Col({
            class: "cms-color-swatch__meta",
            children: [
              UI.Container({ class: "cms-color-swatch__label", children: label }),
              UI.Container({ class: "cms-color-swatch__token", children: token }),
            ],
          }),
          UI.Col({
            class: "cms-color-swatch__actions",
            children: [
              UI.Btn({
                class: "cms-color-swatch__btn",
                children: "Copy",
                onClick: () => copyText(valueText),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function ScaleCard({ title, prefix } = {}) {
  return UI.Card({
    class: "cms-scale-card",
    children: [
      UI.Container({ class: "cms-scale-card__title", children: title }),
      UI.Grid({
        class: "cms-scale-grid",
        children: SCALE_STOPS.map((stop) => {
          const token = `${prefix}-${stop}`;
          return UI.GridCol({
            class: "cms-scale-grid__col",
            children: Swatch({ label: String(stop), token, height: 42 }),
          });
        }),
      }),
    ],
  });
}

function ControlsBar() {
  const theme = getTheme();
  const brand = getBrand();

  return UI.Card({
    class: "cms-controls",
    children: [
      UI.Row({
        class: "cms-controls__row",
        children: [
          UI.Col({
            children: [
              UI.Container({ class: "cms-h1", children: "CMSwift UI — Colors & Tokens" }),
              UI.Container({ class: "cms-p", children: "Palette professionale (scale + semantic tokens) con demo Light/Dark e Brand skins." }),
            ],
          }),
          UI.Col({
            class: "cms-controls__right",
            children: [
              UI.Select({
                value: theme,
                options: THEME_OPTIONS,
                onChange: (v) => setTheme(v),
              }),
              UI.Spacer({ size: 12 }),
              UI.Select({
                value: brand,
                options: BRAND_OPTIONS,
                onChange: (v) => setBrand(v),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function TokensSection() {
  return UI.Card({
    class: "cms-section",
    children: [
      UI.Container({ class: "cms-h2", children: "Semantic tokens (dev-first)" }),
      UI.Container({
        class: "cms-p",
        children: "Nei componenti CMSwift usa questi token (bg/text/border/primary/...) invece dei valori grezzi. Sono stabili e rendono i temi facilissimi.",
      }),
      UI.Separator(),
      UI.Grid({
        class: "cms-semantic-grid",
        children: SEMANTIC.flatMap((group) => {
          return [
            UI.GridCol({
              class: "cms-semantic-grid__title",
              children: UI.Container({ class: "cms-h3", children: group.group }),
            }),
            ...group.items.map((it) => UI.GridCol({
              class: "cms-semantic-grid__col",
              children: Swatch({ label: it.label, token: it.token, height: 40, width: 200 }),
            })),
          ];
        }),
      }),
    ],
  });
}

function ScalesSection() {
  return UI.Card({
    class: "cms-section",
    children: [
      UI.Container({ class: "cms-h2", children: "Color scales (50 → 950)" }),
      UI.Container({
        class: "cms-p",
        children: "Queste scale servono per costruire UI coerenti (hover, soft backgrounds, borders) e per casi avanzati."
      }),
      UI.Separator(),
      UI.Grid({
        class: "cms-scales-grid",
        children: SCALES.map((s) => UI.GridCol({
          class: "cms-scales-grid__col",
          children: ScaleCard({ title: s.title, prefix: s.prefix }),
        })),
      }),
    ],
  });
}

function SocialSection() {
  return UI.Card({
    class: "cms-section",
    children: [
      UI.Container({ class: "cms-h2", children: "Social / Brand colors" }),
      UI.Container({ class: "cms-p", children: "Token rapidi per pulsanti social e integrazioni." }),
      UI.Separator(),
      UI.Grid({
        class: "cms-social-grid",
        children: SOCIAL.map((s) => UI.GridCol({
          class: "cms-social-grid__col",
          children: Swatch({ label: s.title, token: s.token, height: 42 }),
        })),
      }),
    ],
  });
}

function ComponentsPreview() {
  return UI.Card({
    class: "cms-section",
    children: [
      UI.Container({ class: "cms-h2", children: "Preview componenti (semantic tokens in azione)" }),
      UI.Container({
        class: "cms-p",
        children: "Questa mini UI usa solo token semantici: cambi Theme/Brand e tutto resta coerente.",
      }),
      UI.Separator(),
      UI.Row({
        class: "cms-preview",
        children: [
          UI.Col({
            class: "cms-p-sm",
            children: UI.Card({
              style: { height: "100%" },
              class: "cms-preview-card",
              children: [
                UI.Container({ class: "cms-h3", children: "Card" }),
                UI.Container({ class: "cms-p", children: "Superficie, testo e border vengono dai token." }),
                UI.Row({
                  children: [
                    UI.Badge({ children: "Primary", style: { background: "var(--cms-primary-soft)", color: "var(--cms-primary-text)" } }),
                    UI.Spacer({ size: 10 }),
                    UI.Badge({ children: "Success", style: { background: "var(--cms-success-soft)", color: "var(--cms-success)" } }),
                    UI.Spacer({ size: 10 }),
                    UI.Badge({ children: "Warning", style: { background: "var(--cms-warning-soft)", color: "var(--cms-warning)" } }),
                    UI.Spacer({ size: 10 }),
                    UI.Badge({ children: "Danger", style: { background: "var(--cms-danger-soft)", color: "var(--cms-danger)" } }),
                  ],
                }),
              ],
            }),
          }),
          UI.Col({
            class: "cms-p-sm",
            children: UI.Card({
              style: { height: "100%" },
              class: "cms-preview-card",
              children: [
                UI.Container({ class: "cms-h3", children: "Buttons & Input" }),
                UI.Row({
                  children: [
                    UI.Btn({ class: "cms-demo-btn", children: "Primary" }),
                    UI.Spacer({ size: 10 }),
                    UI.Btn({
                      class: "cms-demo-btn--soft",
                      children: "Soft",
                      onClick: () => { },
                    }),
                  ],
                }),
                UI.Spacer({ size: 12 }),
                UI.Col(
                  { class: "cms-p-sm" },
                  UI.Input({
                    label: "name@domain.com",
                    class: "cms-demo-input",
                  })
                ),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}

function PageStyles() {
  // Inline minimal demo styles (keeps tutorial page self-contained)
  // You can move these into your global css if you prefer.
  return UI.Container({
    tag: "style",
    children: `
      .cms-color-page {
        font-family: var(--cms-font-sans);
        background: var(--cms-bg);
        color: var(--cms-text);
        min-height: 100vh;
        padding: 24px;
      }

      .cms-controls, .cms-section {
        background: var(--cms-surface);
        border: 1px solid var(--cms-border);
        box-shadow: var(--cms-shadow-sm);
        border-radius: var(--cms-radius-lg);
        padding: 18px;
        margin-bottom: 16px;
      }

      .cms-controls__row { align-items: center; }
      .cms-controls__right { display: flex; justify-content: flex-end; gap: 14px; align-items: flex-end; }

      .cms-h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
      .cms-h2 { font-size: 18px; font-weight: 800; margin-top: 6px; }
      .cms-h3 { font-size: 14px; font-weight: 800; }
      .cms-p  { color: var(--cms-text-2); margin-top: 6px; }

      .cms-color-swatch {
        background: transparent;
        border: 1px solid var(--cms-border);
        border-radius: 14px;
        padding: 12px;
      }

      .cms-color-swatch__row { align-items: center; }
      .cms-color-swatch__chipwrap { max-width: 92px; }
      .cms-color-swatch__meta { flex: 1; padding: 0 10px; }
      .cms-color-swatch__label { font-weight: 800; }
      .cms-color-swatch__token { font-family: var(--cms-font-mono); color: var(--cms-text-3); font-size: 12px; }

      .cms-color-swatch__actions { max-width: 96px; display: flex; justify-content: flex-end; }
      .cms-color-swatch__btn {
        background: var(--cms-surface-2);
        color: var(--cms-text);
        border: 1px solid var(--cms-border);
        border-radius: 12px;
        padding: 8px 10px;
      }
      .cms-color-swatch__btn:hover {
        background: var(--cms-primary-soft);
        border-color: var(--cms-primary-200);
      }

      .cms-scale-card {
        background: transparent;
        border: 1px solid var(--cms-border);
        border-radius: var(--cms-radius-lg);
        padding: 14px;
      }
      .cms-scale-card__title { font-weight: 900; margin-bottom: 10px; }

      .cms-scale-grid,
      .cms-social-grid,
      .cms-scales-grid,
      .cms-semantic-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }

      .cms-scales-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }

      .cms-semantic-grid__title {
        grid-column: 1 / -1;
        margin-top: 10px;
        padding-top: 6px;
      }

      .cms-preview { gap: 14px; }
      .cms-preview-card {
        background: var(--cms-card-bg);
        border: 1px solid var(--cms-card-border);
        box-shadow: var(--cms-shadow-sm);
        border-radius: var(--cms-radius-lg);
        padding: 14px;
      }

      .cms-demo-btn {
        background: var(--cms-btn-bg);
        color: var(--cms-btn-text);
        border-radius: 14px;
        padding: 10px 12px;
      }
      .cms-demo-btn:hover { background: var(--cms-btn-bg-hover); }

      .cms-demo-btn--soft {
        background: var(--cms-primary-soft);
        color: var(--cms-primary-text);
        border: 1px solid var(--cms-border);
        border-radius: 14px;
        padding: 10px 12px;
      }
      .cms-demo-btn--soft:hover {
        border-color: var(--cms-primary-200);
        background: var(--cms-primary-100);
      }

      .cms-demo-input {
        background: var(--cms-input-bg);
        border: 1px solid var(--cms-input-border);
        border-radius: 14px;
        padding: 10px 12px;
        color: var(--cms-input-text);
      }
      .cms-demo-input::placeholder { color: var(--cms-input-placeholder); }
      .cms-demo-input:focus {
        outline: 0;
        box-shadow: 0 0 0 4px var(--cms-ring);
        border-color: var(--cms-primary);
      }

      @media (max-width: 1100px) {
        .cms-scales-grid { grid-template-columns: 1fr; }
      }
      @media (max-width: 860px) {
        .cms-scale-grid,
        .cms-social-grid,
        .cms-semantic-grid { grid-template-columns: 1fr; }
        .cms-controls__right { flex-direction: column; align-items: stretch; }
      }
    `,
  });
}

// CMSwift page export
function ColorTokensDemoPage() {
  // Ensure initial state is consistent
  // (No forcing; keeps whatever is already set in the app.)
  const theme = getTheme();
  const brand = getBrand();
  if (theme === "dark") setTheme("dark");
  if (brand) setBrand(brand);
  return UI.Page({
    class: "cms-color-page",
    children: [
      //PageStyles(),
      ControlsBar(),
      ComponentsPreview(),
      TokensSection(),
      ScalesSection(),
      SocialSection(),
      UI.Footer({
        children: UI.Container({
          class: "cms-p",
          children: "Tip: usa sempre i semantic tokens nei componenti. Le scale sono per costruire variazioni (hover/soft/border).",
        }),
      }),
    ],
  });
}

export { ColorTokensDemoPage };