const infoLine = (label, getter) => _.div({ class: "cms-m-b-sm" }, _.b(`${label}: `), _.span(getter));
const formatValue = (value) => value == null ? "null" : String(value);

const volumeValue = _.rod(35);
const qualityValue = _.rod(2.5);
const temperatureValue = _.rod(7200);
const readonlyValue = _.rod(80);

const studioMaster = _.rod(72);
const studioWarmth = _.rod(35);
const studioPresence = _.rod(4);
const studioLastInput = _.rod("nessun input");
const studioLastChange = _.rod("nessun change");

const setTextSignal = (signal, prefix, field) => (value) => {
  signal.value = `${prefix}: ${field} = ${formatValue(value)}`;
};

const listSample = {
  basic: {
    code: [
      infoLine("Volume", () => `${volumeValue.value}%`),
      _.Slider({ min: 0, max: 100, model: volumeValue, label: "Master volume", showValue: true }),
      _.Slider({ min: 0, max: 100, value: 25, color: "var(--cms-success)", label: "Success range", showValue: true }),
      _.Slider({ min: 0, max: 100, value: 60, color: "var(--cms-warning)", label: "Warning range", showValue: true }),
      _.Slider({ min: 0, max: 100, value: 85, color: "var(--cms-danger)", label: "Danger range", showValue: true })
    ],
    sample: [
      "const volumeValue = _.rod(35);",
      '_.Slider({ min: 0, max: 100, model: volumeValue, label: "Master volume", showValue: true });',
      '_.Slider({ min: 0, max: 100, value: 25, color: "var(--cms-success)", label: "Success range", showValue: true });',
      '_.Slider({ min: 0, max: 100, value: 60, color: "var(--cms-warning)", label: "Warning range", showValue: true });',
      '_.Slider({ min: 0, max: 100, value: 85, color: "var(--cms-danger)", label: "Danger range", showValue: true });'
    ]
  },
  stepMarkers: {
    code: [
      infoLine("Quality", () => `${qualityValue.value.toFixed(1)}x`),
      _.Slider({
        min: 1,
        max: 4,
        step: 0.5,
        model: qualityValue,
        label: "Upscale quality",
        labelValue: _.span(() => `${qualityValue.value.toFixed(1)}x`),
        thumbLabel: _.span(() => `${qualityValue.value.toFixed(1)}x`),
        markers: true,
        markerLabels: true,
        showValue: true,
        color: "var(--cms-primary)"
      })
    ],
    sample: [
      "const qualityValue = _.rod(2.5);",
      "_.Slider({",
      '  min: 1, max: 4, step: 0.5, model: qualityValue,',
      '  label: "Upscale quality",',
      '  labelValue: _.span(() => `${qualityValue.value.toFixed(1)}x`),',
      '  thumbLabel: _.span(() => `${qualityValue.value.toFixed(1)}x`),',
      "  markers: true, markerLabels: true, showValue: true",
      "});"
    ]
  },
  labelsIcons: {
    code: [
      infoLine("Temperature", () => `${temperatureValue.value}K`),
      _.Slider({
        min: 3200,
        max: 9000,
        step: 100,
        model: temperatureValue,
        label: "Color temperature",
        icon: "wb_incandescent",
        iconRight: "ac_unit",
        startLabel: "Warm",
        endLabel: "Cold",
        labelValue: _.span(() => `${temperatureValue.value}K`),
        markers: {
          3200: "3200K",
          5600: "5600K",
          9000: "9000K"
        },
        thumbIcon: "tonality",
        showValue: true,
        color: "var(--cms-info)"
      })
    ],
    sample: [
      "const temperatureValue = _.rod(7200);",
      "_.Slider({",
      '  min: 3200, max: 9000, step: 100, model: temperatureValue,',
      '  label: "Color temperature",',
      '  icon: "wb_incandescent", iconRight: "ac_unit",',
      '  startLabel: "Warm", endLabel: "Cold",',
      '  labelValue: _.span(() => `${temperatureValue.value}K`),',
      '  markers: { 3200: "3200K", 5600: "5600K", 9000: "9000K" },',
      '  thumbIcon: "tonality", showValue: true',
      "});"
    ]
  },
  readonly: {
    code: [
      infoLine("Readonly", () => `${readonlyValue.value}%`),
      _.Slider({
        min: 0,
        max: 100,
        model: readonlyValue,
        label: "Readonly preview",
        startLabel: "Low",
        endLabel: "High",
        markers: 5,
        thumbIcon: "lock",
        showValue: true,
        readonly: true,
        color: "var(--cms-secondary)"
      })
    ],
    sample: [
      "const readonlyValue = _.rod(80);",
      '_.Slider({ min: 0, max: 100, model: readonlyValue, label: "Readonly preview", startLabel: "Low", endLabel: "High", markers: 5, thumbIcon: "lock", showValue: true, readonly: true });'
    ]
  }
};

const slider = _.div({ class: "cms-panel cms-page" },
  _.h1("Slider"),
  _.p("Slider reattivo con min/max/step, label, markers, icone e supporto a model, onInput e onChange."),
  _.h2("Props principali"),
  _.List(
    _.Item("min, max, step: definiscono il range e la granularita del valore"),
    _.Item("value o model: valore iniziale oppure binding reattivo"),
    _.Item("label, showValue, labelValue, thumbLabel: controllo del testo mostrato"),
    _.Item("icon, iconRight, thumbIcon, startLabel, endLabel, markers, markerLabels: arricchiscono la UI"),
    _.Item("readonly, disabled, withQItem, color, trackColor, thumbColor: comportamento e resa visiva")
  ),
  _.h2("Documentazione API"),
  _.docTable("Slider"),
  _.h2("Esempi"),
  boxCode("Basic", listSample.basic),
  boxCode("Step + markers", listSample.stepMarkers),
  boxCode("Labels + icons", listSample.labelsIcons),
  boxCode("Readonly", listSample.readonly),
  _.h2("Card demo completa"),
  _.Card({ header: "Studio mix control" },
    _.p("Una demo completa con tre slider collegati a model, markers custom, thumb personalizzato e log degli eventi."),
    infoLine("Summary", () => `master=${studioMaster.value}%, warmth=${studioWarmth.value}%, presence=${studioPresence.value.toFixed(1)}`),
    infoLine("Last input", () => studioLastInput.value),
    infoLine("Last change", () => studioLastChange.value),
    _.div({ class: "cms-m-t-md" },
      _.Slider({
        min: 0,
        max: 100,
        step: 1,
        model: studioMaster,
        label: "Master output",
        icon: "volume_up",
        startLabel: "Quiet",
        endLabel: "Club",
        labelValue: _.span(() => `${studioMaster.value}%`),
        thumbLabel: _.span(() => `${studioMaster.value}%`),
        markers: {
          0: "0",
          50: "50",
          100: "100"
        },
        showValue: true,
        color: "var(--cms-primary)",
        onInput: setTextSignal(studioLastInput, "input", "master"),
        onChange: setTextSignal(studioLastChange, "change", "master")
      })
    ),
    _.div({ class: "cms-m-t-md" },
      _.Slider({
        min: 0,
        max: 100,
        step: 5,
        model: studioWarmth,
        label: "Analog warmth",
        icon: "local_fire_department",
        iconRight: "severe_cold",
        startLabel: "Clean",
        endLabel: "Vintage",
        thumbIcon: "whatshot",
        markers: 5,
        markerLabels: true,
        showValue: true,
        trackColor: "rgba(0,0,0,.08)",
        color: "var(--cms-warning)",
        thumbColor: "var(--cms-warning)",
        onInput: setTextSignal(studioLastInput, "input", "warmth"),
        onChange: setTextSignal(studioLastChange, "change", "warmth")
      })
    ),
    _.div({ class: "cms-m-t-md" },
      _.Slider({
        min: 0,
        max: 10,
        step: 0.5,
        model: studioPresence,
        label: "Vocal presence",
        icon: "graphic_eq",
        endLabel: "Air",
        startLabel: "Dry",
        thumbIcon: "mic_external_on",
        labelValue: _.span(() => `${studioPresence.value.toFixed(1)} dB`),
        thumbLabel: _.span(() => `${studioPresence.value.toFixed(1)} dB`),
        markers: [
          { value: 0, label: "0 dB" },
          { value: 2.5, label: "2.5 dB" },
          { value: 5, label: "5 dB", icon: "radio_button_checked" },
          { value: 7.5, label: "7.5 dB" },
          { value: 10, label: "10 dB" }
        ],
        showValue: true,
        color: "var(--cms-success)",
        withQItem: true,
        onInput: setTextSignal(studioLastInput, "input", "presence"),
        onChange: setTextSignal(studioLastChange, "change", "presence")
      })
    )
  )
);

export { slider };
