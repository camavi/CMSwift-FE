const createSection = (code, sample) => ({
  code: Array.isArray(code) ? code : [code],
  sample: Array.isArray(sample) ? sample : [sample]
});

const row = (...children) => _.div({
  style: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "center"
  }
}, ...children);

const stack = (...children) => _.div({
  style: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  }
}, ...children);

const infoRow = (label, value, tone = "info") => _.div({
  style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "10px 0",
    borderBottom: "1px solid rgba(127,127,127,0.14)"
  }
},
  _.div(
    _.div({ style: { fontWeight: "700" } }, label),
    _.div({ class: "cms-muted", style: { fontSize: "12px" } }, value)
  ),
  _.Chip({ color: tone, size: "xs", outline: true }, tone)
);

const menuStatus = _.rod("Nessuna azione eseguita.");
const densityModel = _.rod("comfortable");
const sortModel = _.rod("priority");
const filterState = _.rod({
  onlyBlocked: false,
  onlyVip: true,
  italianMarket: true
});
const filterSummary = _.rod("VIP · Italia · Priorita");

const refreshFilterSummary = () => {
  const labels = [];
  if (filterState.value.onlyBlocked === true) labels.push("Solo bloccati");
  if (filterState.value.onlyVip === true) labels.push("VIP");
  if (filterState.value.italianMarket === true) labels.push("Italia");
  labels.push(sortModel.value === "priority" ? "Priorita" : (sortModel.value === "eta" ? "ETA" : "Margine"));
  labels.push(densityModel.value);
  filterSummary.value = labels.join(" · ");
};

const quickMenu = _.Menu({
  title: "Azioni ordine",
  subtitle: "Azioni frequenti per una riga operativa senza aprire un dialog.",
  state: "primary",
  width: 320,
  items: [
    {
      label: "Apri dettaglio ordine",
      subtitle: "Vai alla scheda completa del cliente",
      icon: "open_in_new",
      shortcut: "Invio",
      onClick: () => {
        menuStatus.value = "Dettaglio ordine aperto.";
      }
    },
    {
      label: "Assegna a logistics",
      subtitle: "Routing immediato verso il team operativo",
      icon: "local_shipping",
      badge: _.Chip({ color: "info", size: "xs", outline: true }, "SLA 17 min"),
      onClick: () => {
        menuStatus.value = "Ordine assegnato a logistics.";
      }
    },
    { divider: true },
    {
      label: "Blocca evasione",
      subtitle: "Ferma la spedizione e richiede review",
      icon: "block",
      color: "warning",
      onClick: () => {
        menuStatus.value = "Evasione bloccata in attesa di review.";
      }
    },
    {
      label: "Escala a finance",
      subtitle: "Apre il flusso per verifica margine e rischio",
      icon: "monitoring",
      color: "danger",
      onClick: () => {
        menuStatus.value = "Escalation inviata al team finance.";
      }
    }
  ]
});

const quickMenuBtn = _.Btn({ color: "primary" }, "Azioni ordine");
const quickMenuToggleBtn = _.Btn({ outline: true }, "Toggle");
quickMenuBtn.addEventListener("click", () => quickMenu.open(quickMenuBtn));
quickMenuToggleBtn.addEventListener("click", () => quickMenu.toggle(quickMenuBtn));

const accountMenu = _.Menu({
  placement: "bottom-end",
  width: 340,
  state: "info",
  slots: {
    header: () => _.div({
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px"
      }
    },
      _.Avatar({ label: "Anna Rossi", size: "lg", color: "info" }),
      _.div(
        _.div({ style: { fontWeight: "700" } }, "Anna Rossi"),
        _.div({ class: "cms-muted", style: { fontSize: "12px" } }, "Owner workspace commerce-eu"),
        row(
          _.Chip({ color: "info", outline: true, size: "xs" }, "Enterprise"),
          _.Chip({ color: "secondary", outline: true, size: "xs" }, "2FA attiva")
        )
      )
    ),
    footer: ({ close }) => row(
      _.Btn({
        outline: true,
        onClick: () => {
          menuStatus.value = "Workspace switch rimandato.";
          close();
        }
      }, "Chiudi"),
      _.Btn({
        color: "info",
        onClick: () => {
          menuStatus.value = "Pannello billing aperto.";
          close();
        }
      }, "Billing")
    )
  },
  items: [
    {
      type: "group",
      label: "Workspace",
      items: [
        {
          label: "Commerce EU",
          subtitle: "Workspace attuale",
          icon: "language",
          checked: true,
          closeOnSelect: false
        },
        {
          label: "Wholesale",
          subtitle: "Passa al tenant B2B",
          icon: "storefront",
          onClick: () => {
            menuStatus.value = "Switch verso Wholesale programmato.";
          }
        }
      ]
    },
    { divider: true },
    {
      type: "group",
      label: "Account",
      items: [
        {
          label: "Profilo e permessi",
          subtitle: "Ruoli, MFA, sicurezza",
          icon: "badge",
          onClick: () => {
            menuStatus.value = "Profilo account aperto.";
          }
        },
        {
          label: "Esci dal workspace",
          subtitle: "Chiude la sessione corrente",
          icon: "logout",
          color: "danger",
          onClick: () => {
            menuStatus.value = "Logout eseguito.";
          }
        }
      ]
    }
  ]
});

const accountMenuBtn = _.Btn({ color: "info" }, "Menu account");
accountMenu.bind(accountMenuBtn);

const orderMenu = _.Menu({
  size: "sm",
  placement: "bottom-end",
  width: 320
});

const orderCards = [
  {
    id: "ORD-4421",
    customer: "Marketplace DE",
    risk: "warning",
    riskLabel: "ETA +18h",
    summary: "Spedizione fuori soglia, serve check corriere"
  },
  {
    id: "ORD-4388",
    customer: "Wholesale IT",
    risk: "danger",
    riskLabel: "P1",
    summary: "Picking bloccato da 26 minuti in hub Milano"
  },
  {
    id: "ORD-4350",
    customer: "VIP direct",
    risk: "info",
    riskLabel: "VIP",
    summary: "Cliente premium con richiesta supporto dedicato"
  }
];

const openOrderMenu = (el, order) => orderMenu.open(el, {
  title: order.id,
  subtitle: order.customer,
  status: _.Chip({ color: order.risk, outline: true, size: "xs" }, order.riskLabel),
  items: [
    {
      label: "Apri timeline",
      subtitle: order.summary,
      icon: "schedule",
      onClick: () => {
        menuStatus.value = `Timeline aperta per ${order.id}.`;
      }
    },
    {
      label: "Riassegna owner",
      subtitle: "Cambio immediato del referente operativo",
      icon: "group_add",
      onClick: () => {
        menuStatus.value = `Owner riassegnato su ${order.id}.`;
      }
    },
    {
      label: "Escala",
      subtitle: "Invia il caso al team competente",
      icon: "priority_high",
      color: order.risk,
      onClick: () => {
        menuStatus.value = `Escalation inviata per ${order.id}.`;
      }
    }
  ]
});

const filterMenu = _.Menu({
  size: "lg",
  width: 380,
  placement: "bottom-end",
  state: "secondary",
  closeOnSelect: false,
  title: "Filtri dashboard",
  subtitle: "Menu con contenuto custom quando servono controlli e CTA.",
  content: () => _.div(
    infoRow("Pipeline", "240 ordini pronti al check", "secondary"),
    _.div({ style: { marginTop: "16px" } },
      _.div({ style: { fontWeight: "700", marginBottom: "8px" } }, "Flag rapidi"),
      stack(
        _.Checkbox({ color: "warning", model: filterState.value.onlyBlocked }, "Solo ordini bloccati"),
        _.Checkbox({ color: "info", model: filterState.value.onlyVip }, "Clienti VIP"),
        _.Checkbox({ color: "secondary", model: filterState.value.italianMarket }, "Canale Italia")
      )
    ),
    _.div({ style: { marginTop: "16px" } },
      _.div({ style: { fontWeight: "700", marginBottom: "8px" } }, "Ordinamento"),
      stack(
        _.Radio({ color: "secondary", value: "priority", model: sortModel }, "Priorita"),
        _.Radio({ color: "secondary", value: "eta", model: sortModel }, "ETA spedizione"),
        _.Radio({ color: "secondary", value: "margin", model: sortModel }, "Margine")
      )
    ),
    _.div({ style: { marginTop: "16px" } },
      _.div({ style: { fontWeight: "700", marginBottom: "8px" } }, "Densita card"),
      row(
        _.Chip({
          clickable: true,
          outline: densityModel.value !== "compact",
          color: densityModel.value === "compact" ? "secondary" : null,
          onClick: () => { densityModel.value = "compact"; }
        }, "Compact"),
        _.Chip({
          clickable: true,
          outline: densityModel.value !== "comfortable",
          color: densityModel.value === "comfortable" ? "secondary" : null,
          onClick: () => { densityModel.value = "comfortable"; }
        }, "Comfortable"),
        _.Chip({
          clickable: true,
          outline: densityModel.value !== "expanded",
          color: densityModel.value === "expanded" ? "secondary" : null,
          onClick: () => { densityModel.value = "expanded"; }
        }, "Expanded")
      )
    )
  ),
  footer: ({ close }) => row(
    _.Btn({
      outline: true,
      onClick: () => {
        filterState.value.onlyBlocked = false;
        filterState.value.onlyVip = true;
        filterState.value.italianMarket = true;
        sortModel.value = "priority";
        densityModel.value = "comfortable";
        refreshFilterSummary();
        menuStatus.value = "Filtri ripristinati.";
      }
    }, "Reset"),
    _.Btn({
      color: "secondary",
      onClick: () => {
        refreshFilterSummary();
        menuStatus.value = `Filtri applicati: ${filterSummary.value}.`;
        close();
      }
    }, "Applica")
  )
});

const filterMenuBtn = _.Btn({ color: "secondary" }, "Filtri live");
filterMenu.bind(filterMenuBtn);

const listSample = {
  basic: createSection(
    [
      _.p("Caso base: menu compatto per azioni contestuali con `items`, icone, shortcut, badge e chiusura automatica su select."),
      _.div({ class: "cms-m-b-md" },
        _.b("Ultima azione: "),
        _.span(menuStatus)
      ),
      row(quickMenuBtn, quickMenuToggleBtn)
    ],
    [
      'const quickMenu = _.Menu({',
      '  title: "Azioni ordine",',
      '  subtitle: "Azioni frequenti per una riga operativa.",',
      '  state: "primary",',
      '  width: 320,',
      '  items: [',
      '    { label: "Apri dettaglio ordine", icon: "open_in_new", shortcut: "Invio", onClick: () => { /* ... */ } },',
      '    { label: "Assegna a logistics", icon: "local_shipping", badge: _.Chip({ size: "xs", outline: true }, "SLA 17 min") },',
      '    { divider: true },',
      '    { label: "Escala a finance", icon: "monitoring", color: "danger" }',
      '  ]',
      '});',
      'quickMenu.open(quickMenuBtn);',
      'quickMenu.toggle(quickMenuBtn);'
    ]
  ),
  sections: createSection(
    [
      _.p("Menu piu editoriale: header custom via slot, gruppi di item, stato checked e footer con CTA."),
      row(accountMenuBtn)
    ],
    [
      'const accountMenu = _.Menu({',
      '  placement: "bottom-end",',
      '  width: 340,',
      '  slots: {',
      '    header: () => _.div(_.Avatar({ label: "Anna Rossi" }), _.div("Anna Rossi")),',
      '    footer: ({ close }) => _.Btn({ color: "info", onClick: close }, "Billing")',
      '  },',
      '  items: [',
      '    { type: "group", label: "Workspace", items: [{ label: "Commerce EU", checked: true, closeOnSelect: false }] },',
      '    { divider: true },',
      '    { type: "group", label: "Account", items: [{ label: "Esci dal workspace", color: "danger" }] }',
      '  ]',
      '});',
      'accountMenu.bind(accountMenuBtn);'
    ]
  ),
  dynamic: createSection(
    [
      _.p("Stessa istanza, dati runtime diversi: `open(anchor, overrides)` evita di creare un menu per ogni card/tabella."),
      _.Grid(
        { min: "240px", gap: "16px" },
        ...orderCards.map((order) => _.Card({
          title: order.id,
          subtitle: order.customer,
          aside: _.Chip({ color: order.risk, outline: true, size: "xs" }, order.riskLabel)
        },
          _.p(order.summary),
          _.Btn({
            outline: true,
            onClick: (e) => openOrderMenu(e.currentTarget, order)
          }, "Apri menu riga")
        ))
      )
    ],
    [
      'const orderMenu = _.Menu({ size: "sm", placement: "bottom-end", width: 320 });',
      'const openOrderMenu = (el, order) => orderMenu.open(el, {',
      '  title: order.id,',
      '  subtitle: order.customer,',
      '  status: _.Chip({ color: order.risk, outline: true, size: "xs" }, order.riskLabel),',
      '  items: [',
      '    { label: "Apri timeline", icon: "schedule" },',
      '    { label: "Riassegna owner", icon: "group_add" },',
      '    { label: "Escala", icon: "priority_high", color: order.risk }',
      '  ]',
      '});'
    ]
  ),
  custom: createSection(
    [
      _.p("Quando `items` non bastano, il menu puo ospitare contenuto custom completo e restare un overlay leggero con `bind()` e `closeOnSelect: false`."),
      _.div({ class: "cms-m-b-md" },
        _.b("Config corrente: "),
        _.span(filterSummary)
      ),
      row(filterMenuBtn)
    ],
    [
      'const filterMenu = _.Menu({',
      '  size: "lg",',
      '  placement: "bottom-end",',
      '  state: "secondary",',
      '  closeOnSelect: false,',
      '  title: "Filtri dashboard",',
      '  content: () => _.div(',
      '    _.Checkbox({ color: "warning", model: filterState.value.onlyBlocked }, "Solo ordini bloccati"),',
      '    _.Radio({ color: "secondary", value: "priority", model: sortModel }, "Priorita"),',
      '    _.Chip({ clickable: true, onClick: () => { densityModel.value = "compact"; } }, "Compact")',
      '  ),',
      '  footer: ({ close }) => _.Btn({ color: "secondary", onClick: close }, "Applica")',
      '});',
      'filterMenu.bind(filterMenuBtn);'
    ]
  )
};

const menu = _.div({ class: "cms-panel cms-page" },
  _.h1("Menu"),
  _.p("Menu standardizzato per azioni contestuali, account switcher, filtri rapidi e controlli runtime. Supporta `items`, header/footer, contenuto custom, trigger bindabili e API imperativa con `open/close/show/hide/toggle/update/bind/isOpen`."),
  _.h2("Props principali"),
  _.List(
    _.Item("title, subtitle, eyebrow, icon, content, footer, status, empty per comporre il layout standard"),
    _.Item("items con stringhe, item object, divider, group, checked, shortcut, badge, color, onClick, closeOnSelect"),
    _.Item("slots before/icon/eyebrow/title/subtitle/header/content/item/groupLabel/footer/after per layout custom"),
    _.Item("size, state, width, minWidth, maxWidth, maxHeight, placement, offsetX, offsetY per presenza e struttura"),
    _.Item("trigger, anchorEl, closeOnSelect, closeOnOutside, closeOnEsc, autoFocus e API `open/toggle/update/bind` per il comportamento")
  ),
  _.h2("Documentazione API"),
  _.docTable("Menu"),
  _.h2("Esempi completi"),
  boxCode("Azioni rapide", listSample.basic),
  boxCode("Header custom + gruppi", listSample.sections),
  boxCode("Runtime overrides", listSample.dynamic),
  boxCode("Contenuto custom e filtri", listSample.custom)
);

export { menu };
