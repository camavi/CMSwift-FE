const infoLine = (label, getter) => _.div({ class: "cms-m-b-xs" }, _.b(`${label}: `), _.span(getter));
const formatValue = (value) => value == null || value === "" ? "empty" : String(value);
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
const field = (label, input, note) => _.div({ class: "cms-m-b-md" },
  _.div({ class: "cms-field-label cms-m-b-xs" }, label),
  input,
  note ? _.div({ class: "cms-field-label cms-m-t-xs" }, note) : null
);

const textValue = _.rod("CMSwift FE");
const mailValue = _.rod("team@cmswift.com");
const reactiveValue = _.rod("hello world");
const searchSignal = _.signal("design system");
const getSearchSignal = searchSignal[0];

const cardName = _.rod("Anna Rossi");
const cardEmail = _.rod("anna@cmswift.com");
const cardCompany = _.rod("CMSwift Studio");
const cardPassword = _.rod("");
const cardSearch = _.signal("release notes");
const getCardSearch = cardSearch[0];
const cardBudget = _.rod("2500");

const listSample = {
  basic: {
    code: [
      _.InputRaw({ placeholder: "Type something..." }),
      _.InputRaw({ value: "Preset value" }),
      _.InputRaw({ type: "email", placeholder: "team@cmswift.com", autocomplete: "email" })
    ],
    sample: [
      '_.InputRaw({ placeholder: "Type something..." });',
      '_.InputRaw({ value: "Preset value" });',
      '_.InputRaw({ type: "email", placeholder: "team@cmswift.com", autocomplete: "email" });'
    ]
  },
  types: {
    code: [
      _.InputRaw({ type: "text", placeholder: "Plain text" }),
      _.InputRaw({ type: "search", placeholder: "Search docs..." }),
      _.InputRaw({ type: "password", placeholder: "Password" }),
      _.InputRaw({ type: "number", placeholder: "42" })
    ],
    sample: [
      '_.InputRaw({ type: "text", placeholder: "Plain text" });',
      '_.InputRaw({ type: "search", placeholder: "Search docs..." });',
      '_.InputRaw({ type: "password", placeholder: "Password" });',
      '_.InputRaw({ type: "number", placeholder: "42" });'
    ]
  },
  model: {
    code: [
      infoLine("Rod model", () => formatValue(reactiveValue.value)),
      _.InputRaw({ model: reactiveValue, placeholder: "Bound with _.rod(...)" }),
      infoLine("Signal model", () => formatValue(getSearchSignal())),
      _.InputRaw({ type: "search", model: searchSignal, placeholder: "Bound with _.signal(...)" })
    ],
    sample: [
      'const reactiveValue = _.rod("hello world");',
      'const searchSignal = _.signal("design system");',
      '_.InputRaw({ model: reactiveValue, placeholder: "Bound with _.rod(...)" });',
      '_.InputRaw({ type: "search", model: searchSignal, placeholder: "Bound with _.signal(...)" });'
    ]
  },
  autofill: {
    code: [
      _.InputRaw({ name: "name", model: textValue, placeholder: "Full name", autocomplete: "name" }),
      _.InputRaw({ type: "email", name: "email", model: mailValue, placeholder: "team@cmswift.com", autocomplete: "email" })
    ],
    sample: [
      'const textValue = _.rod("CMSwift FE");',
      'const mailValue = _.rod("team@cmswift.com");',
      '_.InputRaw({ name: "name", model: textValue, placeholder: "Full name", autocomplete: "name" });',
      '_.InputRaw({ type: "email", name: "email", model: mailValue, placeholder: "team@cmswift.com", autocomplete: "email" });'
    ]
  }
};

const inputRaw = _.div({ class: "cms-panel cms-page" },
  _.h1("InputRaw"),
  _.p("Input nativo minimale con classe `cms-input-raw`. E utile quando vuoi un campo puro HTML con binding reattivo e supporto autofill, senza il wrapper di `_.FormField`."),
  _.h2("Props principali"),
  _.List(
    _.Item("type, name, placeholder, autocomplete, value: pass-through nativi dell'input"),
    _.Item("model: binding reattivo con `_.rod(...)` oppure `_.signal(...)`"),
    _.Item("class: aggiunge classi custom al controllo raw"),
    _.Item("ideale per comporre manualmente layout o card custom partendo da un input base")
  ),
  _.h2("Esempi"),
  boxCode("Basic", listSample.basic),
  boxCode("Native types", listSample.types),
  boxCode("Reactive model", listSample.model),
  boxCode("Autocomplete ready", listSample.autofill),
  _.h2("Card demo completa"),
  _.Card({ header: "Signup / workspace quick setup" },
    _.p("Esempio completo di utilizzo manuale di `_.InputRaw` dentro una card: campi con `name` e `autocomplete`, binding `rod/signal` e riepilogo live dei valori."),
    row(
      col(
        field(
          "Nome e cognome",
          _.InputRaw({ name: "name", model: cardName, placeholder: "Nome completo", autocomplete: "name" }),
          "Autocomplete: name"
        ),
        field(
          "Email",
          _.InputRaw({ type: "email", name: "email", model: cardEmail, placeholder: "you@company.com", autocomplete: "email" }),
          "Autocomplete: email"
        ),
        field(
          "Organizzazione",
          _.InputRaw({ name: "organization", model: cardCompany, placeholder: "Company / team name", autocomplete: "organization" }),
          "Autocomplete: organization"
        ),
        field(
          "Password",
          _.InputRaw({ type: "password", name: "new-password", model: cardPassword, placeholder: "Create a password", autocomplete: "new-password" }),
          "Il browser puo gestire password manager e autofill"
        )
      ),
      col(
        field(
          "Ricerca workspace",
          _.InputRaw({ type: "search", name: "workspace-search", model: cardSearch, placeholder: "Search projects, docs, notes..." }),
          "Questo campo usa un model `_.signal(...)`"
        ),
        field(
          "Budget mensile",
          _.InputRaw({ type: "number", name: "budget", model: cardBudget, placeholder: "2500" }),
          "Puoi usare i normali type HTML senza wrapper aggiuntivi"
        ),
        _.div({ class: "cms-m-t-md" },
          infoLine("Name", () => formatValue(cardName.value)),
          infoLine("Email", () => formatValue(cardEmail.value)),
          infoLine("Company", () => formatValue(cardCompany.value)),
          infoLine("Password length", () => cardPassword.value ? `${cardPassword.value.length} chars` : "empty"),
          infoLine("Search", () => formatValue(getCardSearch())),
          infoLine("Budget", () => formatValue(cardBudget.value))
        )
      )
    )
  )
);

export { inputRaw };
