const infoLine = (label, getter) => _.div({ class: "cms-m-b-sm" }, _.b(`${label}: `), _.span(getter));
window.CMSWIFT_DATE_DEBUG = true

const parseIso = (value) => {
  if (typeof value !== "string") return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const countNights = (range) => {
  if (!range?.from || !range?.to) return 0;
  const from = parseIso(range.from);
  const to = parseIso(range.to);
  if (!from || !to) return 0;
  return Math.round((to.getTime() - from.getTime()) / 86400000);
};

const formatRangeValue = (value) => `${value?.from || "--"} -> ${value?.to || "--"}`;

const formatDateValue = (value) => {
  if (value == null || value === "") return "nessuna data";
  if (Array.isArray(value)) return value.length ? value.map((item) => (typeof item === "object" ? formatRangeValue(item) : String(item))).join(", ") : "nessuna data";
  if (typeof value === "object") return formatRangeValue(value);
  return String(value);
};

const setLogSignal = (signal, prefix) => (value) => {
  signal.value = `${prefix}: ${formatDateValue(value)}`;
};

const basicDate = _.rod("2026-05-18");
const hotelStay = _.rod({ from: "2026-07-14", to: "2026-07-18" });
const flexibleDates = _.rod(["2026-07-13", "2026-07-20"]);
const maintenanceWindows = _.rod([
  { from: "2026-10-03", to: "2026-10-05" },
  { from: "2026-10-10", to: "2026-10-12" }
]);
const inspectionDate = _.rod("2026-09-21");

const bookingRange = _.rod({ from: "2026-08-18", to: "2026-08-22" });
const bookingFlexibleDates = _.rod(["2026-08-16", "2026-08-17"]);
const bookingBirthDate = _.rod("1990-06-12");
const bookingLastInput = _.rod("nessun input");
const bookingLastChange = _.rod("nessun change");

const hotelBlockedDates = ["2026-08-15", "2026-08-26", "2026-08-27"];
const inspectionBlockedDates = ["2026-09-22", "2026-09-29", "2026-10-06"];

const listSample = {
  basic: {
    code: [
      infoLine("Valore", () => formatDateValue(basicDate.value)),
      _.Date({
        model: basicDate,
        label: "Data arrivo",
        icon: "calendar_month",
        clearable: true,
        min: "2026-04-01",
        max: "2026-12-31",
        locale: "it-IT"
      })
    ],
    sample: [
      'const basicDate = _.rod("2026-05-18");',
      '_.Date({',
      '  model: basicDate,',
      '  label: "Data arrivo",',
      '  icon: "calendar_month",',
      '  clearable: true,',
      '  min: "2026-04-01",',
      '  max: "2026-12-31",',
      '  locale: "it-IT"',
      '});'
    ]
  },
  range: {
    code: [
      infoLine("Soggiorno", () => formatDateValue(hotelStay.value)),
      infoLine("Notti", () => `${countNights(hotelStay.value)} notti`),
      _.Date({
        model: hotelStay,
        mode: "range",
        label: "Soggiorno hotel",
        icon: "hotel",
        iconRight: "luggage",
        monthsToShow: 2,
        min: "2026-06-01",
        max: "2026-12-31",
        minRange: 2,
        maxRange: 30,
        confirm: true,
        clearable: true,
        size: 'xs',
        locale: "it-IT",
        shortcuts: [
          { label: "Weekend lungo", value: { from: "2026-07-17", to: "2026-07-20" } },
          { label: "Settimana intera", value: { from: "2026-08-03", to: "2026-08-10" } }
        ]
      })
    ],
    sample: [
      'const hotelStay = _.rod({ from: "2026-07-14", to: "2026-07-18" });',
      '_.Date({',
      '  model: hotelStay,',
      '  mode: "range",',
      '  label: "Soggiorno hotel",',
      '  icon: "hotel",',
      '  iconRight: "luggage",',
      '  monthsToShow: 2,',
      '  min: "2026-06-01",',
      '  max: "2026-12-31",',
      '  minRange: 2,',
      '  maxRange: 30,',
      '  confirm: true,',
      '  clearable: true,',
      '  locale: "it-IT"',
      '});'
    ]
  },
  multiRange: {
    code: [
      infoLine("Finestre selezionate", () => formatDateValue(maintenanceWindows.value)),
      _.p("Usa il picker aperto per aggiungere piu intervalli consecutivi senza richiudere il pannello."),
      _.Date({
        model: maintenanceWindows,
        mode: "range-multiple",
        label: "Finestre manutenzione",
        icon: "date_range",
        monthsToShow: 2,
        closeOnSelect: false,
        clearable: true,
        locale: "it-IT",
        min: "2026-10-01",
        max: "2026-12-31",
        pointIcon: "build",
        multipleRangeLabel: "finestre selezionate"
      })
    ],
    sample: [
      "const maintenanceWindows = _.rod([",
      '  { from: "2026-10-03", to: "2026-10-05" },',
      '  { from: "2026-10-10", to: "2026-10-12" }',
      "]);",
      '_.Date({',
      '  model: maintenanceWindows,',
      '  mode: "range-multiple",',
      '  label: "Finestre manutenzione",',
      '  icon: "date_range",',
      '  monthsToShow: 2,',
      '  closeOnSelect: false,',
      '  clearable: true,',
      '  locale: "it-IT",',
      '  min: "2026-10-01",',
      '  max: "2026-12-31"',
      '});'
    ]
  },
  multiple: {
    code: [
      infoLine("Date flessibili", () => formatDateValue(flexibleDates.value)),
      _.Date({
        model: flexibleDates,
        mode: "multiple",
        label: "Date alternative",
        icon: "event_repeat",
        closeOnSelect: false,
        monthsToShow: 2,
        clearable: true,
        locale: "it-IT",
        pointIcon: "priority_high"
      })
    ],
    sample: [
      'const flexibleDates = _.rod(["2026-07-13", "2026-07-20"]);',
      '_.Date({',
      '  model: flexibleDates,',
      '  mode: "multiple",',
      '  label: "Date alternative",',
      '  icon: "event_repeat",',
      '  closeOnSelect: false,',
      '  monthsToShow: 2,',
      '  clearable: true,',
      '  locale: "it-IT",',
      '  pointIcon: "priority_high"',
      '});'
    ]
  },
  manual: {
    code: [
      infoLine("Data sopralluogo", () => formatDateValue(inspectionDate.value)),
      _.p("Manual input, solo giorni feriali e alcune date escluse per chiusura struttura."),
      _.Date({
        model: inspectionDate,
        label: "Sopralluogo location",
        icon: "storefront",
        manualInput: true,
        weekdaysOnly: true,
        disableDates: inspectionBlockedDates,
        min: "2026-09-15",
        max: "2026-10-30",
        clearable: true,
        locale: "it-IT",
        placeholder: "gg/mm/aaaa"
      })
    ],
    sample: [
      'const inspectionBlockedDates = ["2026-09-22", "2026-09-29", "2026-10-06"];',
      '_.Date({',
      '  model: inspectionDate,',
      '  label: "Sopralluogo location",',
      '  icon: "storefront",',
      '  manualInput: true,',
      '  weekdaysOnly: true,',
      '  disableDates: inspectionBlockedDates,',
      '  min: "2026-09-15",',
      '  max: "2026-10-30",',
      '  clearable: true,',
      '  locale: "it-IT",',
      '  placeholder: "gg/mm/aaaa"',
      '});'
    ]
  }
};

const date = _.div({ class: "cms-panel cms-page" },
  _.h1("Date"),
  _.p("Date picker reattivo con supporto single, range e multiple selection, input manuale, limiti, preset e casi d'uso reali come prenotazioni e soggiorni."),
  _.h2("Props principali"),
  _.List(
    _.Item("value o model: valore iniziale oppure binding reattivo in formato stringa, range o array"),
    _.Item('mode, range, multiple, range-multiple: configurano la selezione single, intervallo, multipla o multi intervallo'),
    _.Item("min, max, minRange, maxRange, disableDates, weekdaysOnly: regole di disponibilita"),
    _.Item("label, icon, iconRight, clearable, manualInput, confirm, shortcuts: UX del campo e del picker"),
    _.Item("locale, firstDayOfWeek, monthsToShow, onInput, onChange: rendering e comportamento")
  ),
  _.h2("Documentazione API"),
  _.docTable("Date"),
  _.h2("Esempi"),
  boxCode("Single date", listSample.basic),
  boxCode("Range per soggiorno", listSample.range),
  boxCode("Multi range", listSample.multiRange),
  boxCode("Selezione multipla", listSample.multiple),
  boxCode("Manual input + regole", listSample.manual),
  _.h2("Card demo completa"),
  _.Card({ header: "Prenotazione hotel vista lago" },
    _.p("Scenario reale: il cliente sceglie il soggiorno, indica date alternative se la camera non e disponibile e compila la data di nascita dell'intestatario."),
    infoLine("Soggiorno scelto", () => formatDateValue(bookingRange.value)),
    infoLine("Notti", () => `${countNights(bookingRange.value)} notti`),
    infoLine("Date alternative", () => formatDateValue(bookingFlexibleDates.value)),
    infoLine("Data di nascita", () => formatDateValue(bookingBirthDate.value)),
    infoLine("Ultimo input", () => bookingLastInput.value),
    infoLine("Ultimo change", () => bookingLastChange.value),
    _.p("Date non disponibili: 15, 26 e 27 agosto 2026."),
    _.Date({
      model: bookingRange,
      mode: "range",
      label: "Date soggiorno",
      icon: "hotel",
      iconRight: "luggage",
      monthsToShow: 2,
      min: "2026-08-01",
      max: "2026-10-31",
      minRange: 2,
      maxRange: 10,
      confirm: true,
      clearable: true,
      locale: "it-IT",
      disableDates: hotelBlockedDates,
      pointIcon: "bed",
      shortcuts: [
        { label: "Weekend romantico", value: { from: "2026-08-21", to: "2026-08-24" } },
        { label: "Settimana slow", value: { from: "2026-09-07", to: "2026-09-14" } }
      ],
      onInput: setLogSignal(bookingLastInput, "range input"),
      onChange: setLogSignal(bookingLastChange, "range change")
    }),
    _.Date({
      model: bookingFlexibleDates,
      mode: "multiple",
      label: "Date alternative accettabili",
      icon: "event_repeat",
      monthsToShow: 2,
      closeOnSelect: false,
      clearable: true,
      locale: "it-IT",
      disableDates: hotelBlockedDates,
      onInput: setLogSignal(bookingLastInput, "multiple input"),
      onChange: setLogSignal(bookingLastChange, "multiple change")
    }),
    _.Date({
      model: bookingBirthDate,
      label: "Data di nascita intestatario",
      icon: "badge",
      manualInput: true,
      min: "1930-01-01",
      max: "2008-12-31",
      clearable: true,
      locale: "it-IT",
      placeholder: "gg/mm/aaaa",
      onInput: setLogSignal(bookingLastInput, "birth input"),
      onChange: setLogSignal(bookingLastChange, "birth change")
    })
  )
);

export { date };
