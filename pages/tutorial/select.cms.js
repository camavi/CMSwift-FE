import { icon } from "./icon.cms";
const val = _.rod("live");
const valMultiple = _.rod("live");
const options = [
  { label: "Draft chanel", value: "draft" },
  { label: "Live chanel", value: "live" },
  { label: "Archived chanel", value: "archived" }
];
const sampleOptions = [
  'const options = [',
  '   { label: "Draft chanel", value: "draft" },',
  '   { label: "Live chanel", value: "live" },',
  '   { label: "Archived chanel", value: "archived" }',
  '];',
]
const listSample = {
  basic: {
    code: [
      _.Select({ label: "Stato", options: options, value: val }),
    ],
    sample: [
      ...sampleOptions,
      '_.Select({ label: "Stato", options: options, value: val });',
    ]
  },
  topLabel: {
    code: [
      _.Select({ label: "Stato", options: options, value: val, topLabel: "Sample top label" }),
    ],
    sample: [
      ...sampleOptions,
      '_.Select({ label: "Stato", options: options, value: val, topLabel: "Sample top label" });',
    ]
  },
  clearable: {
    code: [
      _.Select({ label: "Stato", options: options, value: val, clearable: true }),
    ],
    sample: [
      ...sampleOptions,
      '_.Select({ label: "Stato", options: options, value: val, clearable: true });',
    ]
  },
  filterable: {
    code: [
      _.Select({ label: "Stato", options: options, value: val, filterable: true }),
    ],
    sample: [
      ...sampleOptions,
      '_.Select({ label: "Stato", options: options, value: val, filterable: true });',
    ]
  },
  multiple: {
    code: [
      _.Select({ label: "Stato", options: options, value: valMultiple, multiple: true }),
    ],
    sample: [
      ...sampleOptions,
      '_.Select({ label: "Stato", options: options, value: valMultiple, multiple: true });',
    ]
  },
  allowCustom: {
    code: [
      _.Select({ label: "Stato", options: options, value: val, filterable: true, allowCustom: true }),
    ],
    sample: [
      ...sampleOptions,
      '_.Select({ label: "Stato", options: options, value: val, allowCustom: true });',
    ]
  },

  filterPlaceholder: {
    code: [
      _.Select({ label: "Stato", options: options, value: val, filterable: true, filterPlaceholder: "Cerca..." }),
    ],
    sample: [
      ...sampleOptions,
      '_.Select({ label: "Stato", options: options, value: val, filterable: true, filterPlaceholder: "Cerca..." });',
    ]
  },
  emptyText: {
    code: [
      _.Select({ label: "Stato", options: options, value: val, filterable: true, emptyText: "Nessun risultato" }),
    ],
    sample: [
      ...sampleOptions,
      '_.Select({ label: "Stato", options: options, value: val, filterable: true, emptyText: "Nessun risultato" });',
    ]
  },
  icon: {
    code: [
      _.Select({ label: "Stato", options: options, value: val, icon: "home" }),
      _.Select({ label: "Stato", options: options, value: val, iconRight: "home" }),
      _.Select({ label: "Stato", options: options, value: val, icon: "home", iconRight: "home" }),
      _.Select({ label: "Stato", options: options, value: val, icon: "home", prefix: "Home" }),
      _.Select({ label: "Stato", options: options, value: val, iconRight: "home", suffix: "Home" }),
      _.Select({ label: "Stato", options: options, value: val, icon: "home", prefix: "Home", iconRight: "home", suffix: "Home" }),

    ],
    sample: [
      ...sampleOptions,
      '_.Select({ label: "Stato", options: options, value: val, icon: "home" });',
      '_.Select({ label: "Stato", options: options, value: val, iconRight: "home" });',
      '_.Select({ label: "Stato", options: options, value: val, icon: "home", iconRight: "home" });',
      '_.Select({ label: "Stato", options: options, value: val, icon: "home", prefix: "Home" });',
      '_.Select({ label: "Stato", options: options, value: val, iconRight: "home", suffix: "Home" });',
      '_.Select({ label: "Stato", options: options, value: val, icon: "home", prefix: "Home", iconRight: "home", suffix: "Home" });',
    ]
  },
  wrapClass: {
    code: [
      _.Select({ label: "Stato", options: options, value: val, wrapClass: "wrap-class" }),
    ],
    sample: [
      '<style>',
      '   .wrap-class .cms-control {',
      '       border: 1px solid red;',
      '   }',
      '</style>',
      ...sampleOptions,
      '_.Select({ label: "Stato", options: options, value: val, wrapClass: "wrap-class" });',
    ]
  },
  slots: {
    code: [
      _.Select({
        label: "Stato", options: options, value: val,
        clearable: true,
        slots: {
          topLabel: _.h3("Sample top label"),
          arrow: _.Icon("place_item"),
          label: _.div({ class: "label" }, "Sample label", _.Icon({ textColor: "blue", name: "token" })),
          clear: () => {
            return _.div({ class: "cms-clear" }, _.Icon({ textColor: "red", name: "close" }));
          },
        }
      }),
    ],
    sample: [
      ...sampleOptions,
      '_.Select({',
      '   label: "Stato", options: options, value: val,',
      '   clearable: true,',
      '   slots: {',
      '       topLabel: _.h3("Sample top label"),',
      '       arrow: _.Icon("place_item"),',
      '       label: _.div({ class: "label" }, "Sample label", _.Icon({ textColor: "blue", name: "token" })),',
      '       clear: () => {',
      '           return _.div({ class: "cms-clear" }, _.Icon({ textColor: "red", name: "close" }));',
      '       },',
      '   }',
      '});'
    ]
  }
};
const select = () => {
  return _.div({ class: "cms-panel cms-page" },
    _.h1("Select"),
    _.p("Select custom con _.FormField: gruppi, filtro, async options, multi-select e valori custom. Include tastiera, clearable e slot per opzioni/empty/loading."),
    _.h2("Props principali"),
    _.List(
      _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
      _.Item("state: success, warning, danger, info, primary, secondary"),
      _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
    ),
    _.h2("Documentazione API"),
    _.docTable("Select"),
    _.h2("Esempio completo"),
    boxCode('Basic', listSample.basic),
    boxCode('Top label', listSample.topLabel),
    boxCode('Clearable', listSample.clearable),
    boxCode('Filterable', listSample.filterable),
    boxCode('Multiple', listSample.multiple),
    boxCode('Allow custom', listSample.allowCustom),
    boxCode('Filter placeholder', listSample.filterPlaceholder),
    boxCode('Empty text', listSample.emptyText),
    boxCode('Icon', listSample.icon),
    boxCode('Wrap class', listSample.wrapClass),
    boxCode('Slots', listSample.slots)
  );
};

export { select };
