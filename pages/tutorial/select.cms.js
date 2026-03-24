import { icon } from "./icon.cms";
const val = _rod("live");
const valMultiple = _rod("live");
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
      _ui.Select({ label: "Stato", options: options, value: val }),
    ],
    sample: [
      ...sampleOptions,
      '_ui.Select({ label: "Stato", options: options, value: val });',
    ]
  },
  topLabel: {
    code: [
      _ui.Select({ label: "Stato", options: options, value: val, topLabel: "Sample top label" }),
    ],
    sample: [
      ...sampleOptions,
      '_ui.Select({ label: "Stato", options: options, value: val, topLabel: "Sample top label" });',
    ]
  },
  clearable: {
    code: [
      _ui.Select({ label: "Stato", options: options, value: val, clearable: true }),
    ],
    sample: [
      ...sampleOptions,
      '_ui.Select({ label: "Stato", options: options, value: val, clearable: true });',
    ]
  },
  filterable: {
    code: [
      _ui.Select({ label: "Stato", options: options, value: val, filterable: true }),
    ],
    sample: [
      ...sampleOptions,
      '_ui.Select({ label: "Stato", options: options, value: val, filterable: true });',
    ]
  },
  multiple: {
    code: [
      _ui.Select({ label: "Stato", options: options, value: valMultiple, multiple: true }),
    ],
    sample: [
      ...sampleOptions,
      '_ui.Select({ label: "Stato", options: options, value: valMultiple, multiple: true });',
    ]
  },
  allowCustom: {
    code: [
      _ui.Select({ label: "Stato", options: options, value: val, filterable: true, allowCustom: true }),
    ],
    sample: [
      ...sampleOptions,
      '_ui.Select({ label: "Stato", options: options, value: val, allowCustom: true });',
    ]
  },

  filterPlaceholder: {
    code: [
      _ui.Select({ label: "Stato", options: options, value: val, filterable: true, filterPlaceholder: "Cerca..." }),
    ],
    sample: [
      ...sampleOptions,
      '_ui.Select({ label: "Stato", options: options, value: val, filterable: true, filterPlaceholder: "Cerca..." });',
    ]
  },
  emptyText: {
    code: [
      _ui.Select({ label: "Stato", options: options, value: val, filterable: true, emptyText: "Nessun risultato" }),
    ],
    sample: [
      ...sampleOptions,
      '_ui.Select({ label: "Stato", options: options, value: val, filterable: true, emptyText: "Nessun risultato" });',
    ]
  },
  icon: {
    code: [
      _ui.Select({ label: "Stato", options: options, value: val, icon: "home" }),
      _ui.Select({ label: "Stato", options: options, value: val, iconRight: "home" }),
      _ui.Select({ label: "Stato", options: options, value: val, icon: "home", iconRight: "home" }),
      _ui.Select({ label: "Stato", options: options, value: val, icon: "home", prefix: "Home" }),
      _ui.Select({ label: "Stato", options: options, value: val, iconRight: "home", suffix: "Home" }),
      _ui.Select({ label: "Stato", options: options, value: val, icon: "home", prefix: "Home", iconRight: "home", suffix: "Home" }),

    ],
    sample: [
      ...sampleOptions,
      '_ui.Select({ label: "Stato", options: options, value: val, icon: "home" });',
      '_ui.Select({ label: "Stato", options: options, value: val, iconRight: "home" });',
      '_ui.Select({ label: "Stato", options: options, value: val, icon: "home", iconRight: "home" });',
      '_ui.Select({ label: "Stato", options: options, value: val, icon: "home", prefix: "Home" });',
      '_ui.Select({ label: "Stato", options: options, value: val, iconRight: "home", suffix: "Home" });',
      '_ui.Select({ label: "Stato", options: options, value: val, icon: "home", prefix: "Home", iconRight: "home", suffix: "Home" });',
    ]
  },
  wrapClass: {
    code: [
      _ui.Select({ label: "Stato", options: options, value: val, wrapClass: "wrap-class" }),
    ],
    sample: [
      '<style>',
      '   .wrap-class .cms-control {',
      '       border: 1px solid red;',
      '   }',
      '</style>',
      ...sampleOptions,
      '_ui.Select({ label: "Stato", options: options, value: val, wrapClass: "wrap-class" });',
    ]
  },
  slots: {
    code: [
      _ui.Select({
        label: "Stato", options: options, value: val,
        clearable: true,
        slots: {
          topLabel: _h.h3("Sample top label"),
          arrow: _ui.Icon("place_item"),
          label: _h.div({ class: "label" }, "Sample label", _ui.Icon({ textColor: "blue", name: "token" })),
          clear: () => {
            return _h.div({ class: "cms-clear" }, _ui.Icon({ textColor: "red", name: "close" }));
          },
        }
      }),
    ],
    sample: [
      ...sampleOptions,
      '_ui.Select({',
      '   label: "Stato", options: options, value: val,',
      '   clearable: true,',
      '   slots: {',
      '       topLabel: _h.h3("Sample top label"),',
      '       arrow: _ui.Icon("place_item"),',
      '       label: _h.div({ class: "label" }, "Sample label", _ui.Icon({ textColor: "blue", name: "token" })),',
      '       clear: () => {',
      '           return _h.div({ class: "cms-clear" }, _ui.Icon({ textColor: "red", name: "close" }));',
      '       },',
      '   }',
      '});'
    ]
  }
};
const select = () => {
  return _h.div({ class: "cms-panel cms-page" },
    _h.h1("Select"),
    _h.p("Select custom con UI.FormField: gruppi, filtro, async options, multi-select e valori custom. Include tastiera, clearable e slot per opzioni/empty/loading."),
    _h.h2("Props principali"),
    _ui.List(
      _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
      _ui.Item("state: success, warning, danger, info, primary, secondary"),
      _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
    ),
    _h.h2("Documentazione API"),
    CMSwift.ui.DocTable("Select"),
    _h.h2("Esempio completo"),
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
