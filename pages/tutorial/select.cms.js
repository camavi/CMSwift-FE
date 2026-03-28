const statusValue = _.rod("live");
const topLabelValue = _.rod("draft");
const clearableValue = _.rod("archived");
const filterableValue = _.rod("live");
const multipleValue = _.rod(["Design", "Frontend"]);
const customValue = _.rod(["cmswift", "select"]);

const cardChannel = _.rod("web");
const cardOwner = _.rod("anna");
const cardAudience = _.rod(["Design", "Product"]);
const cardTags = _.rod(["release", "beta"]);
const cardLastChange = _.rod("nessuna modifica");

const statusOptions = [
  { label: "Draft channel", value: "draft" },
  { label: "Live channel", value: "live" },
  { label: "Archived channel", value: "archived" }
];

const groupedChannelOptions = [
  {
    label: "Owned channels",
    options: [
      { label: "Website", value: "web" },
      { label: "Mobile app", value: "app" }
    ]
  },
  {
    label: "Communication",
    options: [
      { label: "Email", value: "email" },
      { label: "Slack", value: "slack" }
    ]
  }
];

const ownerOptions = [
  { label: "Anna Rossi", value: "anna" },
  { label: "Marco Bianchi", value: "marco" },
  { label: "Sara Neri", value: "sara" }
];

const audienceOptions = [
  "Design",
  "Frontend",
  "Product",
  "Marketing",
  "Support"
];

const baseOptionsSample = [
  "const statusOptions = [",
  '  { label: "Draft channel", value: "draft" },',
  '  { label: "Live channel", value: "live" },',
  '  { label: "Archived channel", value: "archived" }',
  "];"
];

const row = (...children) => _.div({
  style: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    alignItems: "flex-start"
  }
}, ...children);

const col = (...children) => _.div({
  style: {
    flex: "1 1 280px",
    minWidth: "260px"
  }
}, ...children);

const infoLine = (label, getter) => _.div({ class: "cms-m-b-xs" }, _.b(`${label}: `), _.span(getter));
const formatValue = (value) => {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "none";
  if (value == null || value === "") return "none";
  return String(value);
};
const setLastChange = (field) => (value) => {
  cardLastChange.value = `${field}: ${formatValue(value)}`;
};

const listSample = {
  basic: {
    code: [
      _.Select({ label: "Status", options: statusOptions, model: statusValue }),
    ],
    sample: [
      ...baseOptionsSample,
      'const statusValue = _.rod("live");',
      '_.Select({ label: "Status", options: statusOptions, model: statusValue });',
    ]
  },
  topLabel: {
    code: [
      _.Select({ label: "Status", options: statusOptions, model: topLabelValue, topLabel: "Publishing channel" }),
    ],
    sample: [
      ...baseOptionsSample,
      'const topLabelValue = _.rod("draft");',
      '_.Select({ label: "Status", options: statusOptions, model: topLabelValue, topLabel: "Publishing channel" });',
    ]
  },
  clearable: {
    code: [
      _.Select({ label: "Status", options: statusOptions, model: clearableValue, clearable: true }),
    ],
    sample: [
      ...baseOptionsSample,
      'const clearableValue = _.rod("archived");',
      '_.Select({ label: "Status", options: statusOptions, model: clearableValue, clearable: true });',
    ]
  },
  filterable: {
    code: [
      _.Select({
        label: "Status",
        options: statusOptions,
        model: filterableValue,
        filterable: true,
        filterPlaceholder: "Search channel..."
      }),
    ],
    sample: [
      ...baseOptionsSample,
      'const filterableValue = _.rod("live");',
      '_.Select({',
      '  label: "Status",',
      '  options: statusOptions,',
      '  model: filterableValue,',
      '  filterable: true,',
      '  filterPlaceholder: "Search channel..."',
      '});',
    ]
  },
  multiple: {
    code: [
      _.Select({
        label: "Team",
        options: audienceOptions,
        model: multipleValue,
        multiple: true,
        clearable: true,
        filterable: true
      }),
    ],
    sample: [
      'const audienceOptions = ["Design", "Frontend", "Product", "Marketing", "Support"];',
      'const multipleValue = _.rod(["Design", "Frontend"]);',
      '_.Select({',
      '  label: "Team",',
      '  options: audienceOptions,',
      '  model: multipleValue,',
      '  multiple: true,',
      '  clearable: true,',
      '  filterable: true',
      '});',
    ]
  },
  allowCustom: {
    code: [
      _.Select({
        label: "Tags",
        options: ["cms", "ui", "design-system"],
        model: customValue,
        multiple: true,
        filterable: true,
        allowCustom: true,
        clearable: true,
        emptyText: "Press Enter to create a new tag"
      }),
    ],
    sample: [
      'const customValue = _.rod(["cmswift", "select"]);',
      '_.Select({',
      '  label: "Tags",',
      '  options: ["cms", "ui", "design-system"],',
      '  model: customValue,',
      '  multiple: true,',
      '  filterable: true,',
      '  allowCustom: true,',
      '  clearable: true,',
      '  emptyText: "Press Enter to create a new tag"',
      '});',
    ]
  },
  icon: {
    code: [
      _.Select({ label: "Status", options: statusOptions, model: statusValue, icon: "bolt" }),
      _.Select({ label: "Status", options: statusOptions, model: statusValue, iconRight: "keyboard_arrow_down" }),
      _.Select({ label: "Status", options: statusOptions, model: statusValue, icon: "bolt", prefix: "Channel" }),
      _.Select({ label: "Status", options: statusOptions, model: statusValue, iconRight: "radio", suffix: "Live" }),
    ],
    sample: [
      ...baseOptionsSample,
      '_.Select({ label: "Status", options: statusOptions, model: statusValue, icon: "bolt" });',
      '_.Select({ label: "Status", options: statusOptions, model: statusValue, iconRight: "keyboard_arrow_down" });',
      '_.Select({ label: "Status", options: statusOptions, model: statusValue, icon: "bolt", prefix: "Channel" });',
      '_.Select({ label: "Status", options: statusOptions, model: statusValue, iconRight: "radio", suffix: "Live" });',
    ]
  },
  slots: {
    code: [
      _.Select({
        label: "Publishing channel",
        options: groupedChannelOptions,
        model: cardChannel,
        clearable: true,
        filterable: true,
        topLabel: "Custom option + arrow slots",
        slots: {
          arrow: ({ open }) => _.Icon(open ? "chevron_up" : "keyboard_arrow_down"),
          option: ({ opt, selected }) => _.div({
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%"
            }
          },
            _.span(opt.label),
            selected ? _.Icon("check") : _.span("")
          ),
          empty: ({ filter }) => _.div({ class: "cms-text-secondary" }, `No result for "${filter}"`)
        }
      }),
    ],
    sample: [
      'const groupedChannelOptions = [',
      '  {',
      '    label: "Owned channels",',
      '    options: [',
      '      { label: "Website", value: "web" },',
      '      { label: "Mobile app", value: "app" }',
      '    ]',
      '  },',
      '  {',
      '    label: "Communication",',
      '    options: [',
      '      { label: "Email", value: "email" },',
      '      { label: "Slack", value: "slack" }',
      '    ]',
      '  }',
      '];',
      '_.Select({',
      '  label: "Publishing channel",',
      '  options: groupedChannelOptions,',
      '  model: cardChannel,',
      '  clearable: true,',
      '  filterable: true,',
      '  slots: {',
      '    arrow: ({ open }) => _.Icon(open ? "chevron_up" : "keyboard_arrow_down"),',
      '    option: ({ opt, selected }) => _.div(_.span(opt.label), selected ? _.Icon("check") : _.span("")),',
      '    empty: ({ filter }) => _.div(`No result for "${filter}"`)',
      '  }',
      '});'
    ]
  }
};

const select = _.div({ class: "cms-panel cms-page" },
  _.h1("Select"),
  _.p("Select costruito su FormField: supporta opzioni semplici o raggruppate, filtro, multi-select, valori custom, clearable e slot per personalizzare il dropdown."),
  _.h2("Props principali"),
  _.List(
    _.Item("options, model o value: sorgente dati e binding reattivo"),
    _.Item("label, topLabel, hint, error, note: contenuti del field"),
    _.Item("clearable, filterable, multiple, allowCustom: principali comportamenti del select"),
    _.Item("icon, iconRight, prefix, suffix, wrapClass, slots: personalizzazione visuale")
  ),
  _.h2("Documentazione API"),
  _.docTable("Select"),
  _.h2("Esempi"),
  boxCode("Basic", listSample.basic),
  boxCode("Top label", listSample.topLabel),
  boxCode("Clearable", listSample.clearable),
  boxCode("Filterable", listSample.filterable),
  boxCode("Multiple", listSample.multiple),
  boxCode("Allow custom", listSample.allowCustom),
  boxCode("Icons, prefix, suffix", listSample.icon),
  boxCode("Slots", listSample.slots),
  _.h2("Card demo completa"),
  _.Card({ header: "Release distribution setup" },
    _.p("Un esempio piu completo con gruppi, filtro, clearable, multi-select, valori custom e riepilogo finale dei valori scelti."),
    row(
      col({ class: 'cms-m-b-md' },
        _.Select({
          label: "Publishing channel",
          topLabel: "Primary delivery",
          options: groupedChannelOptions,
          model: cardChannel,
          clearable: true,
          filterable: true,
          icon: "send",
          onChange: setLastChange("channel"),
          slots: {
            arrow: ({ open }) => _.Icon(open ? "chevron_up" : "keyboard_arrow_down"),
            option: ({ opt, selected }) => _.div({
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%"
              }
            },
              _.span(opt.label),
              selected ? _.Icon("check") : _.span("")
            )
          }
        })
      ),
      col({ class: 'cms-m-b-md' },
        _.Select({
          label: "Owner",
          topLabel: "Responsible",
          options: ownerOptions,
          model: cardOwner,
          clearable: true,
          filterable: true,
          icon: "person",
          suffix: "PM",
          onChange: setLastChange("owner")
        })
      )
    ),
    row(
      col({ class: 'cms-m-b-md' },
        _.Select({
          label: "Audience",
          options: audienceOptions,
          model: cardAudience,
          multiple: true,
          clearable: true,
          filterable: true,
          icon: "dashboard_customize",
          filterPlaceholder: "Search team...",
          onChange: setLastChange("audience")
        })
      ),
      col({ class: 'cms-m-b-md' },
        _.Select({
          label: "Tags",
          options: ["release", "beta", "design-system", "feature-flag"],
          model: cardTags,
          multiple: true,
          clearable: true,
          filterable: true,
          allowCustom: true,
          prefix: "#",
          emptyText: "No tag found. Press Enter to create one.",
          onChange: setLastChange("tags")
        })
      )
    ),
    _.div({ class: "cms-m-t-md" },
      infoLine("Channel", () => formatValue(cardChannel.value)),
      infoLine("Owner", () => formatValue(cardOwner.value)),
      infoLine("Audience", () => formatValue(cardAudience.value)),
      infoLine("Tags", () => formatValue(cardTags.value)),
      infoLine("Last change", () => cardLastChange.value)
    )
  )
);

export { select };
