const infoLine = (label, getter) => _.div({ class: "cms-m-b-sm" }, _.b(`${label}: `), _.span(getter));

const formatTimeValue = (value) => {
  if (value == null || value === "") return "nessun orario";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const setLogSignal = (signal, prefix) => (value) => {
  signal.value = `${prefix}: ${formatTimeValue(value)}`;
};

const basicTime = _.rod("09:30");
const secondsTime = _.rod("14:05:20");
const manualTime = _.rod("18:45");
const constrainedTime = _.rod("10:15");

const demoTime = _.rod("08:30:00");
const demoLastInput = _.rod("nessun input");
const demoLastChange = _.rod("nessun change");

const listSample = {
  basic: {
    code: [
      infoLine("Valore", () => formatTimeValue(basicTime.value)),
      _.Time({
        model: basicTime,
        label: "Orario inizio",
        icon: "schedule",
        clearable: true
      })
    ],
    sample: [
      'const basicTime = _.rod("09:30");',
      '_.Time({',
      '  model: basicTime,',
      '  label: "Orario inizio",',
      '  icon: "schedule",',
      '  clearable: true',
      '});'
    ]
  },
  seconds: {
    code: [
      infoLine("Valore con secondi", () => formatTimeValue(secondsTime.value)),
      _.Time({
        model: secondsTime,
        label: "Timer produzione",
        icon: "timer",
        iconRight: "precision_manufacturing",
        withSeconds: true,
        minuteStep: 5,
        secondStep: 10,
        pointIcon: "check"
      })
    ],
    sample: [
      'const secondsTime = _.rod("14:05:20");',
      '_.Time({',
      '  model: secondsTime,',
      '  label: "Timer produzione",',
      '  icon: "timer",',
      '  iconRight: "precision_manufacturing",',
      '  withSeconds: true,',
      '  minuteStep: 5,',
      '  secondStep: 10,',
      '  pointIcon: "check"',
      '});'
    ]
  },
  manual: {
    code: [
      infoLine("Input manuale", () => formatTimeValue(manualTime.value)),
      _.Time({
        model: manualTime,
        label: "Consegna serale",
        icon: "local_shipping",
        manualInput: true,
        clearable: true
      })
    ],
    sample: [
      'const manualTime = _.rod("18:45");',
      '_.Time({',
      '  model: manualTime,',
      '  label: "Consegna serale",',
      '  icon: "local_shipping",',
      '  manualInput: true,',
      '  clearable: true',
      '});'
    ]
  },
  constrained: {
    code: [
      infoLine("Finestra valida", () => formatTimeValue(constrainedTime.value)),
      _.Time({
        model: constrainedTime,
        label: "Finestra assistenza",
        icon: "support_agent",
        min: "09:00",
        max: "18:00",
        minuteStep: 15,
        confirm: true,
        shortcuts: [
          { label: "Apertura", value: "09:00" },
          { label: "Mezzogiorno", value: "12:00" },
          { label: "Chiusura", value: "18:00" }
        ]
      })
    ],
    sample: [
      'const constrainedTime = _.rod("10:15");',
      '_.Time({',
      '  model: constrainedTime,',
      '  label: "Finestra assistenza",',
      '  icon: "support_agent",',
      '  min: "09:00",',
      '  max: "18:00",',
      '  minuteStep: 15,',
      '  confirm: true,',
      '  shortcuts: [',
      '    { label: "Apertura", value: "09:00" },',
      '    { label: "Mezzogiorno", value: "12:00" },',
      '    { label: "Chiusura", value: "18:00" }',
      '  ]',
      '});'
    ]
  }
};

const time = _.div({ class: "cms-panel cms-page" },
  _.h1("Time"),
  _.p("Time picker reattivo per selezionare orari con input manuale, secondi, limiti min/max, conferma, scorciatoie e binding tramite `model`."),
  _.h2("Props principali"),
  _.List(
    _.Item("value o model: valore iniziale oppure binding reattivo in formato HH:mm o HH:mm:ss"),
    _.Item("min, max, minuteStep, secondStep, withSeconds: regole di selezione e granularita"),
    _.Item("label, icon, iconRight, pointIcon, clearable, manualInput, confirm: UX del campo e del picker"),
    _.Item("shortcuts, onInput, onChange: preset rapidi e gestione eventi")
  ),
  _.h2("Documentazione API"),
  _.docTable("Time"),
  _.h2("Esempi"),
  boxCode("Base", listSample.basic),
  boxCode("Con secondi", listSample.seconds),
  boxCode("Input manuale", listSample.manual),
  boxCode("Vincoli + shortcuts", listSample.constrained),
  _.h2("Card demo completa"),
  _.Card({ header: "Configurazione appuntamento showroom" },
    _.p("Scenario reale: l'operatore sceglie l'orario di un appuntamento, puo inserirlo manualmente, usare preset rapidi e verificare subito input e change."),
    infoLine("Orario selezionato", () => formatTimeValue(demoTime.value)),
    infoLine("Ultimo input", () => demoLastInput.value),
    infoLine("Ultimo change", () => demoLastChange.value),
    _.Time({
      model: demoTime,
      label: "Orario appuntamento",
      icon: "event_available",
      iconRight: "storefront",
      min: "08:00:00",
      max: "20:00:00",
      minuteStep: 15,
      secondStep: 10,
      withSeconds: true,
      manualInput: true,
      clearable: true,
      confirm: true,
      pointIcon: "check_circle",
      shortcuts: [
        { label: "Apertura", value: "08:00:00" },
        { label: "Briefing", value: "09:30:00" },
        { label: "Pausa pranzo", value: "13:00:00" },
        { label: "Ultimo slot", value: "19:30:00" }
      ],
      onInput: setLogSignal(demoLastInput, "input"),
      onChange: setLogSignal(demoLastChange, "change")
    })
  )
);

export { time };
