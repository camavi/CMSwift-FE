const createCheckboxState = (keys) => _.rod(
  keys.reduce((acc, key, index) => {
    acc[key] = index === 0;
    return acc;
  }, {})
);
const getCheckboxValues = (state) => () => {
  return Object.keys(state.value).filter((k) => state.value[k] === true ? k : false).join(", ");
};
const colorKeys = ["none", "success", "warning", "danger", "info", "primary", "secondary", "dark", "light"];
const sizeKeys = ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"];
const valBase = createCheckboxState(colorKeys);
const valSize = createCheckboxState(sizeKeys);
const valIcon = createCheckboxState(colorKeys);
const valBasic = createCheckboxState(colorKeys);
const valShadow = createCheckboxState(colorKeys);
const valLightShadow = createCheckboxState(colorKeys);
const valClickable = createCheckboxState(colorKeys);
const valBorder = createCheckboxState(colorKeys);
const valGlossy = createCheckboxState(colorKeys);
const valGlossyBorder = createCheckboxState(colorKeys);
const valGlow = createCheckboxState(colorKeys);
const valGlass = createCheckboxState(colorKeys);
const valGradient = createCheckboxState(colorKeys);
const valOutline = createCheckboxState(colorKeys);
const valOutlineGlow = createCheckboxState(colorKeys);
const valOutlineGlossy = createCheckboxState(colorKeys);
const valOutlineGlass = createCheckboxState(colorKeys);
const valOutlineLightShadow = createCheckboxState(colorKeys);
const valTextGradient = createCheckboxState(colorKeys);
const valOutlineTextGradient = createCheckboxState(colorKeys);
const listSample = {
  basic: {
    code:
      [
        _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valBase))),
        _.Checkbox({ model: valBase.value.none }, "None"),
        _.Checkbox({ color: "success", model: valBase.value.success }, "Success"),
        _.Checkbox({ color: "warning", model: valBase.value.warning }, "Warning"),
        _.Checkbox({ color: "danger", model: valBase.value.danger }, "Danger"),
        _.Checkbox({ color: "info", model: valBase.value.info }, "Info"),
        _.Checkbox({ color: "primary", model: valBase.value.primary }, "Primary"),
        _.Checkbox({ color: "secondary", model: valBase.value.secondary }, "Secondary"),
        _.Checkbox({ color: "dark", model: valBase.value.dark }, "Dark"),
        _.Checkbox({ color: "light", model: valBase.value.light }, "Light")],
    sample: [
      '_.Checkbox({ model: valBase.value.none }, "None");',
      '_.Checkbox({ color: "success", model: valBase.value.success }, "Success");',
      '_.Checkbox({ color: "warning", model: valBase.value.warning }, "Warning");',
      '_.Checkbox({ color: "danger", model: valBase.value.danger }, "Danger");',
      '_.Checkbox({ color: "info", model: valBase.value.info }, "Info");',
      '_.Checkbox({ color: "primary", model: valBase.value.primary }, "Primary");',
      '_.Checkbox({ color: "secondary", model: valBase.value.secondary }, "Secondary");',
      '_.Checkbox({ color: "dark", model: valBase.value.dark }, "Dark");',
      '_.Checkbox({ color: "light", model: valBase.value.light }, "Light");',
    ]
  },
  size: {
    code:
      [
        _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valSize))),
        _.Checkbox({ color: "success", model: valSize.value.xxs, size: "xxs" }, "Success xxs"),
        _.Checkbox({ color: "success", model: valSize.value.xs, size: "xs" }, "Success xs"),
        _.Checkbox({ color: "warning", model: valSize.value.sm, size: "sm" }, "Warning sm"),
        _.Checkbox({ color: "danger", model: valSize.value.md, size: "md" }, "Danger md"),
        _.Checkbox({ color: "info", model: valSize.value.lg, size: "lg" }, "Info lg"),
        _.Checkbox({ color: "primary", model: valSize.value.xl, size: "xl" }, "Primary xl"),
        _.Checkbox({ color: "secondary", model: valSize.value.xxl, size: "xxl" }, "Secondary xxl")
      ],
    sample: [
      '_.Checkbox({ color: "success", model: valSize.value.xxs, size: "xxs" }, "Success xxs");',
      '_.Checkbox({ color: "success", model: valSize.value.xs, size: "xs" }, "Success xs");',
      '_.Checkbox({ color: "warning", model: valSize.value.sm, size: "sm" }, "Warning sm");',
      '_.Checkbox({ color: "danger", model: valSize.value.md, size: "md" }, "Danger md");',
      '_.Checkbox({ color: "info", model: valSize.value.lg, size: "lg" }, "Info lg");',
      '_.Checkbox({ color: "primary", model: valSize.value.xl, size: "xl" }, "Primary xl");',
      '_.Checkbox({ color: "secondary", model: valSize.value.xxl, size: "xxl" }, "Secondary xxl");',
    ]
  },
  icon: {
    code:
      [
        _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valIcon))),
        _.Checkbox({ icon: "token", model: valIcon.value.none }, "None"),
        _.Checkbox({ icon: "token", color: "success", model: valIcon.value.success }, "Success"),
        _.Checkbox({ icon: "token", color: "warning", model: valIcon.value.warning }, "Warning"),
        _.Checkbox({ icon: "assignment_late", color: "danger", model: valIcon.value.danger }, "Danger"),
        _.Checkbox({ icon: "token", iconRight: "info", color: "info", model: valIcon.value.info }, "Info"),
        _.Checkbox({ icon: "contact_mail", color: "primary", model: valIcon.value.primary }, "Primary"),
        _.Checkbox({ icon: "personal_bag_question", iconRight: "notification_settings", color: "secondary", model: valIcon.value.secondary }, "Secondary"),
        _.Checkbox({ icon: "brightness_6", iconRight: "#brightness", color: "dark", model: valIcon.value.dark, }, "Dark"),
        _.Checkbox({ icon: "sunny", iconRight: "#sun", color: "light", model: valIcon.value.light }, "Light"),
      ],
    sample: [
      '_.Checkbox({ icon: "token", model: valIcon.value.none }, "None");',
      '_.Checkbox({ icon: "token", color: "success", model: valIcon.value.success }, "Success");',
      '_.Checkbox({ icon: "token", color: "warning", model: valIcon.value.warning }, "Warning");',
      '_.Checkbox({ icon: "assignment_late", color: "danger", model: valIcon.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", iconRight: "info", color: "info", model: valIcon.value.info }, "Info");',
      '_.Checkbox({ icon: "contact_mail", color: "primary", model: valIcon.value.primary }, "Primary");',
      '_.Checkbox({ icon: "personal_bag_question", iconRight: "notification_settings", color: "secondary", model: valIcon.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "brightness_6", iconRight: "#brightness", color: "dark", model: valIcon.value.dark, }, "Dark");',
      '_.Checkbox({ icon: "sunny", iconRight: "#sun", color: "light", model: valIcon.value.light }, "Light");',
    ]
  },
  shadow: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valShadow))),
      _.Checkbox({ icon: "token", shadow: true, model: valShadow.value.none }, "None"),
      _.Checkbox({ icon: "token", shadow: true, color: "success", model: valShadow.value.success }, "Success"),
      _.Checkbox({ icon: "token", shadow: true, color: "warning", model: valShadow.value.warning }, "Warning"),
      _.Checkbox({ icon: "token", shadow: true, color: "danger", model: valShadow.value.danger }, "Danger"),
      _.Checkbox({ icon: "token", shadow: true, color: "info", model: valShadow.value.info }, "Info"),
      _.Checkbox({ icon: "token", shadow: true, color: "primary", model: valShadow.value.primary }, "Primary"),
      _.Checkbox({ icon: "token", shadow: true, color: "secondary", model: valShadow.value.secondary }, "Secondary"),
      _.Checkbox({ icon: "token", shadow: true, color: "dark", model: valShadow.value.dark }, "Dark"),
      _.Checkbox({ icon: "token", shadow: true, color: "light", model: valShadow.value.light }, "Light"),
    ],
    sample: [
      '_.Checkbox({ icon: "token", shadow: true, model: valShadow.value.none }, "None");',
      '_.Checkbox({ icon: "token", shadow: true, color: "success", model: valShadow.value.success }, "Success");',
      '_.Checkbox({ icon: "token", shadow: true, color: "warning", model: valShadow.value.warning }, "Warning");',
      '_.Checkbox({ icon: "token", shadow: true, color: "danger", model: valShadow.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", shadow: true, color: "info", model: valShadow.value.info }, "Info");',
      '_.Checkbox({ icon: "token", shadow: true, color: "primary", model: valShadow.value.primary }, "Primary");',
      '_.Checkbox({ icon: "token", shadow: true, color: "secondary", model: valShadow.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "token", shadow: true, color: "dark", model: valShadow.value.dark, }, "Dark");',
      '_.Checkbox({ icon: "token", shadow: true, color: "light", model: valShadow.value.light }, "Light");',
    ]
  },
  lightShadow: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valLightShadow))),
      _.Checkbox({ icon: "token", lightShadow: true, model: valLightShadow.value.none }, "None"),
      _.Checkbox({ icon: "token", lightShadow: true, color: "success", model: valLightShadow.value.success }, "Success"),
      _.Checkbox({ icon: "token", lightShadow: true, color: "warning", model: valLightShadow.value.warning }, "Warning"),
      _.Checkbox({ icon: "token", lightShadow: true, color: "danger", model: valLightShadow.value.danger }, "Danger"),
      _.Checkbox({ icon: "token", lightShadow: true, color: "info", model: valLightShadow.value.info }, "Info"),
      _.Checkbox({ icon: "token", lightShadow: true, color: "primary", model: valLightShadow.value.primary }, "Primary"),
      _.Checkbox({ icon: "token", lightShadow: true, color: "secondary", model: valLightShadow.value.secondary }, "Secondary"),
      _.Checkbox({ icon: "token", lightShadow: true, color: "dark", model: valLightShadow.value.dark }, "Dark"),
      _.Checkbox({ icon: "token", lightShadow: true, color: "light", model: valLightShadow.value.light }, "Light"),
    ],
    sample: [
      '_.Checkbox({ icon: "token", lightShadow: true, model: valLightShadow.value.none }, "None");',
      '_.Checkbox({ icon: "token", lightShadow: true, color: "success", model: valLightShadow.value.success }, "Success");',
      '_.Checkbox({ icon: "token", lightShadow: true, color: "warning", model: valLightShadow.value.warning }, "Warning");',
      '_.Checkbox({ icon: "token", lightShadow: true, color: "danger", model: valLightShadow.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", lightShadow: true, color: "info", model: valLightShadow.value.info }, "Info");',
      '_.Checkbox({ icon: "token", lightShadow: true, color: "primary", model: valLightShadow.value.primary }, "Primary");',
      '_.Checkbox({ icon: "token", lightShadow: true, color: "secondary", model: valLightShadow.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "token", lightShadow: true, color: "dark", model: valLightShadow.value.dark, }, "Dark");',
      '_.Checkbox({ icon: "token", lightShadow: true, color: "light", model: valLightShadow.value.light }, "Light");',
    ]
  },
  border: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valBorder))),
      _.Checkbox({ icon: "token", border: true, model: valBorder.value.none }, "None"),
      _.Checkbox({ icon: "token", border: true, color: "success", model: valBorder.value.success }, "Success"),
      _.Checkbox({ icon: "token", border: true, color: "warning", model: valBorder.value.warning }, "Warning"),
      _.Checkbox({ icon: "token", border: true, color: "danger", model: valBorder.value.danger }, "Danger"),
      _.Checkbox({ icon: "token", border: true, color: "info", model: valBorder.value.info }, "Info"),
      _.Checkbox({ icon: "token", border: true, color: "primary", model: valBorder.value.primary }, "Primary"),
      _.Checkbox({ icon: "token", border: true, color: "secondary", model: valBorder.value.secondary }, "Secondary"),
      _.Checkbox({ icon: "token", border: true, color: "dark", model: valBorder.value.dark }, "Dark"),
      _.Checkbox({ icon: "token", border: true, color: "light", model: valBorder.value.light }, "Light"),
    ],
    sample: [
      '_.Checkbox({ icon: "token", border: true, model: valBorder.value.none }, "None");',
      '_.Checkbox({ icon: "token", border: true, color: "success", model: valBorder.value.success }, "Success");',
      '_.Checkbox({ icon: "token", border: true, color: "warning", model: valBorder.value.warning }, "Warning");',
      '_.Checkbox({ icon: "token", border: true, color: "danger", model: valBorder.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", border: true, color: "info", model: valBorder.value.info }, "Info");',
      '_.Checkbox({ icon: "token", border: true, color: "primary", model: valBorder.value.primary }, "Primary");',
      '_.Checkbox({ icon: "token", border: true, color: "secondary", model: valBorder.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "token", border: true, color: "dark", model: valBorder.value.dark, }, "Dark");',
      '_.Checkbox({ icon: "token", border: true, color: "light", model: valBorder.value.light }, "Light");',
    ]
  },
  glossy: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valGlossy))),
      _.Checkbox({ icon: "token", glossy: true, model: valGlossy.value.none }, "None"),
      _.Checkbox({ icon: "token", glossy: true, color: "success", model: valGlossy.value.success }, "Success"),
      _.Checkbox({ icon: "token", glossy: true, color: "warning", model: valGlossy.value.warning }, "Warning"),
      _.Checkbox({ icon: "token", glossy: true, color: "danger", model: valGlossy.value.danger }, "Danger"),
      _.Checkbox({ icon: "token", glossy: true, color: "info", model: valGlossy.value.info }, "Info"),
      _.Checkbox({ icon: "token", glossy: true, color: "primary", model: valGlossy.value.primary }, "Primary"),
      _.Checkbox({ icon: "token", glossy: true, color: "secondary", model: valGlossy.value.secondary }, "Secondary"),
      _.Checkbox({ icon: "token", glossy: true, color: "dark", model: valGlossy.value.dark }, "Dark"),
      _.Checkbox({ icon: "token", glossy: true, color: "light", model: valGlossy.value.light }, "Light"),
    ],
    sample: [
      '_.Checkbox({ icon: "token", glossy: true, model: valGlossy.value.none }, "None");',
      '_.Checkbox({ icon: "token", glossy: true, color: "success", model: valGlossy.value.success }, "Success");',
      '_.Checkbox({ icon: "token", glossy: true, color: "warning", model: valGlossy.value.warning }, "Warning");',
      '_.Checkbox({ icon: "token", glossy: true, color: "danger", model: valGlossy.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", glossy: true, color: "info", model: valGlossy.value.info }, "Info");',
      '_.Checkbox({ icon: "token", glossy: true, color: "primary", model: valGlossy.value.primary }, "Primary");',
      '_.Checkbox({ icon: "token", glossy: true, color: "secondary", model: valGlossy.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "token", glossy: true, color: "dark", model: valGlossy.value.dark, }, "Dark");',
      '_.Checkbox({ icon: "token", glossy: true, color: "light", model: valGlossy.value.light }, "Light");',
    ]
  },
  glossyBorder: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valGlossyBorder))),
      _.Checkbox({ icon: "token", border: true, glossy: true, model: valGlossyBorder.value.none }, "None"),
      _.Checkbox({ icon: "token", border: true, glossy: true, color: "success", model: valGlossyBorder.value.success }, "Success"),
      _.Checkbox({ icon: "token", border: true, glossy: true, color: "warning", model: valGlossyBorder.value.warning }, "Warning"),
      _.Checkbox({ icon: "token", border: true, glossy: true, color: "danger", model: valGlossyBorder.value.danger }, "Danger"),
      _.Checkbox({ icon: "token", border: true, glossy: true, color: "info", model: valGlossyBorder.value.info }, "Info"),
      _.Checkbox({ icon: "token", border: true, glossy: true, color: "primary", model: valGlossyBorder.value.primary }, "Primary"),
      _.Checkbox({ icon: "token", border: true, glossy: true, color: "secondary", model: valGlossyBorder.value.secondary }, "Secondary"),
      _.Checkbox({ icon: "token", border: true, glossy: true, color: "dark", model: valGlossyBorder.value.dark }, "Dark"),
      _.Checkbox({ icon: "token", border: true, glossy: true, color: "light", model: valGlossyBorder.value.light }, "Light"),
    ],
    sample: [
      '_.Checkbox({ icon: "token", border: true, glossy: true, model: valGlossyBorder.value.none }, "None");',
      '_.Checkbox({ icon: "token", border: true, glossy: true, color: "success", model: valGlossyBorder.value.success }, "Success");',
      '_.Checkbox({ icon: "token", border: true, glossy: true, color: "warning", model: valGlossyBorder.value.warning }, "Warning");',
      '_.Checkbox({ icon: "token", border: true, glossy: true, color: "danger", model: valGlossyBorder.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", border: true, glossy: true, color: "info", model: valGlossyBorder.value.info }, "Info");',
      '_.Checkbox({ icon: "token", border: true, glossy: true, color: "primary", model: valGlossyBorder.value.primary }, "Primary");',
      '_.Checkbox({ icon: "token", border: true, glossy: true, color: "secondary", model: valGlossyBorder.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "token", border: true, glossy: true, color: "dark", model: valGlossyBorder.value.dark }, "Dark");',
      '_.Checkbox({ icon: "token", border: true, glossy: true, color: "light", model: valGlossyBorder.value.light }, "Light");',
    ]
  },
  glow: {
    code:
      [
        _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valGlow))),
        _.Checkbox({ icon: "token", glow: true, model: valGlow.value.none }, "None"),
        _.Checkbox({ icon: "token", glow: true, color: "success", model: valGlow.value.success }, "Success"),
        _.Checkbox({ icon: "token", glow: true, color: "warning", model: valGlow.value.warning }, "Warning"),
        _.Checkbox({ icon: "token", glow: true, color: "danger", model: valGlow.value.danger }, "Danger"),
        _.Checkbox({ icon: "token", glow: true, color: "info", model: valGlow.value.info }, "Info"),
        _.Checkbox({ icon: "token", glow: true, color: "primary", model: valGlow.value.primary }, "Primary"),
        _.Checkbox({ icon: "token", glow: true, color: "secondary", model: valGlow.value.secondary }, "Secondary"),
        _.Checkbox({ icon: "token", glow: true, color: "dark", model: valGlow.value.dark }, "Dark"),
        _.Checkbox({ icon: "token", glow: true, color: "light", model: valGlow.value.light }, "Light"),
      ],
    sample: [
      '_.Checkbox({ icon: "token", glow: true, model: valGlow.value.none }, "None");',
      '_.Checkbox({ icon: "token", glow: true, color: "success", model: valGlow.value.success }, "Success");',
      '_.Checkbox({ icon: "token", glow: true, color: "warning", model: valGlow.value.warning }, "Warning");',
      '_.Checkbox({ icon: "token", glow: true, color: "danger", model: valGlow.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", glow: true, color: "info", model: valGlow.value.info }, "Info");',
      '_.Checkbox({ icon: "token", glow: true, color: "primary", model: valGlow.value.primary }, "Primary");',
      '_.Checkbox({ icon: "token", glow: true, color: "secondary", model: valGlow.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "token", glow: true, color: "dark", model: valGlow.value.dark }, "Dark");',
      '_.Checkbox({ icon: "token", glow: true, color: "light", model: valGlow.value.light }, "Light");',
    ]
  },
  glass: {
    code:
      [
        _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valGlass))),
        _.Checkbox({ icon: "token", glass: true, model: valGlass.value.none }, "None"),
        _.Checkbox({ icon: "token", glass: true, color: "success", model: valGlass.value.success }, "Success"),
        _.Checkbox({ icon: "token", glass: true, color: "warning", model: valGlass.value.warning }, "Warning"),
        _.Checkbox({ icon: "token", glass: true, color: "danger", model: valGlass.value.danger }, "Danger"),
        _.Checkbox({ icon: "token", glass: true, color: "info", model: valGlass.value.info }, "Info"),
        _.Checkbox({ icon: "token", glass: true, color: "primary", model: valGlass.value.primary }, "Primary"),
        _.Checkbox({ icon: "token", glass: true, color: "secondary", model: valGlass.value.secondary }, "Secondary"),
        _.Checkbox({ icon: "token", glass: true, color: "dark", model: valGlass.value.dark }, "Dark"),
        _.Checkbox({ icon: "token", glass: true, color: "light", model: valGlass.value.light }, "Light"),
      ],
    sample: [
      '_.Checkbox({ icon: "token", glass: true, model: valGlass.value.none }, "None");',
      '_.Checkbox({ icon: "token", glass: true, color: "success", model: valGlass.value.success }, "Success");',
      '_.Checkbox({ icon: "token", glass: true, color: "warning", model: valGlass.value.warning }, "Warning");',
      '_.Checkbox({ icon: "token", glass: true, color: "danger", model: valGlass.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", glass: true, color: "info", model: valGlass.value.info }, "Info");',
      '_.Checkbox({ icon: "token", glass: true, color: "primary", model: valGlass.value.primary }, "Primary");',
      '_.Checkbox({ icon: "token", glass: true, color: "secondary", model: valGlass.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "token", glass: true, color: "dark", model: valGlass.value.dark }, "Dark");',
      '_.Checkbox({ icon: "token", glass: true, color: "light", model: valGlass.value.light }, "Light");',
    ]
  },
  gradient: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valGradient))),
      _.Checkbox({ icon: "token", gradient: true, model: valGradient.value.none }, "None"),
      _.Checkbox({ icon: "token", gradient: true, color: "success", model: valGradient.value.success }, "Success"),
      _.Checkbox({ icon: "token", gradient: -90, color: "warning", model: valGradient.value.warning }, "Warning"),
      _.Checkbox({ icon: "token", gradient: 90, color: "danger", model: valGradient.value.danger }, "Danger"),
      _.Checkbox({ icon: "token", gradient: 1, color: "info", model: valGradient.value.info }, "Info"),
      _.Checkbox({ icon: "token", gradient: 25, color: "primary", model: valGradient.value.primary }, "Primary"),
      _.Checkbox({ icon: "token", gradient: -25, color: "secondary", model: valGradient.value.secondary }, "Secondary"),
      _.Checkbox({ icon: "token", gradient: 270, color: "dark", model: valGradient.value.dark }, "Dark"),
      _.Checkbox({ icon: "token", gradient: true, color: "light", model: valGradient.value.light }, "Light"),
    ],
    sample: [
      '_.Checkbox({ icon: "token", gradient: true, model: valGradient.value.none }, "None");',
      '_.Checkbox({ icon: "token", gradient: true, color: "success", model: valGradient.value.success }, "Success");',
      '_.Checkbox({ icon: "token", gradient: -90, color: "warning", model: valGradient.value.warning }, "Warning");',
      '_.Checkbox({ icon: "token", gradient: 90, color: "danger", model: valGradient.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", gradient: 1, color: "info", model: valGradient.value.info }, "Info");',
      '_.Checkbox({ icon: "token", gradient: 25, color: "primary", model: valGradient.value.primary }, "Primary");',
      '_.Checkbox({ icon: "token", gradient: -25, color: "secondary", model: valGradient.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "token", gradient: 270, color: "dark", model: valGradient.value.dark }, "Dark");',
      '_.Checkbox({ icon: "token", gradient: true, color: "light", model: valGradient.value.light }, "Light");',
    ]
  },
  outline: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valOutline))),
      _.Checkbox({ icon: "token", outline: true, model: valOutline.value.none }, "None"),
      _.Checkbox({ icon: "token", outline: true, color: "success", model: valOutline.value.success }, "Success"),
      _.Checkbox({ icon: "token", outline: true, color: "warning", model: valOutline.value.warning }, "Warning"),
      _.Checkbox({ icon: "token", outline: true, color: "danger", model: valOutline.value.danger }, "Danger"),
      _.Checkbox({ icon: "token", outline: true, color: "info", model: valOutline.value.info }, "Info"),
      _.Checkbox({ icon: "token", outline: true, color: "primary", model: valOutline.value.primary }, "Primary"),
      _.Checkbox({ icon: "token", outline: true, color: "secondary", model: valOutline.value.secondary }, "Secondary"),
      _.Checkbox({ icon: "token", outline: true, color: "dark", model: valOutline.value.dark, }, "Dark"),
      _.Checkbox({ icon: "token", outline: true, color: "light", model: valOutline.value.light }, "Light"),
    ],
    sample: [
      '_.Checkbox({ icon: "token", outline: true, model: valOutline.value.none }, "None");',
      '_.Checkbox({ icon: "token", outline: true, color: "success", model: valOutline.value.success }, "Success");',
      '_.Checkbox({ icon: "token", outline: true, color: "warning", model: valOutline.value.warning }, "Warning");',
      '_.Checkbox({ icon: "token", outline: true, color: "danger", model: valOutline.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", outline: true, color: "info", model: valOutline.value.info }, "Info");',
      '_.Checkbox({ icon: "token", outline: true, color: "primary", model: valOutline.value.primary }, "Primary");',
      '_.Checkbox({ icon: "token", outline: true, color: "secondary", model: valOutline.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "token", outline: true, color: "dark", model: valOutline.value.dark, }, "Dark");',
      '_.Checkbox({ icon: "token", outline: true, color: "light", model: valOutline.value.light }, "Light");',
    ]
  },
  outlineGlow: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valOutlineGlow))),
      _.Checkbox({ icon: "token", glow: true, outline: true, model: valOutlineGlow.value.none }, "None"),
      _.Checkbox({ icon: "token", glow: true, outline: true, color: "success", model: valOutlineGlow.value.success }, "Success"),
      _.Checkbox({ icon: "token", glow: true, outline: true, color: "warning", model: valOutlineGlow.value.warning }, "Warning"),
      _.Checkbox({ icon: "token", glow: true, outline: true, color: "danger", model: valOutlineGlow.value.danger }, "Danger"),
      _.Checkbox({ icon: "token", glow: true, outline: true, color: "info", model: valOutlineGlow.value.info }, "Info"),
      _.Checkbox({ icon: "token", glow: true, outline: true, color: "primary", model: valOutlineGlow.value.primary }, "Primary"),
      _.Checkbox({ icon: "token", glow: true, outline: true, color: "secondary", model: valOutlineGlow.value.secondary }, "Secondary"),
      _.Checkbox({ icon: "token", glow: true, outline: true, color: "dark", model: valOutlineGlow.value.dark, }, "Dark"),
      _.Checkbox({ icon: "token", glow: true, outline: true, color: "light", model: valOutlineGlow.value.light }, "Light"),
    ],
    sample: [
      '_.Checkbox({ icon: "token", glow: true, outline: true, model: valOutlineGlow.value.none }, "None");',
      '_.Checkbox({ icon: "token", glow: true, outline: true, color: "success", model: valOutlineGlow.value.success }, "Success");',
      '_.Checkbox({ icon: "token", glow: true, outline: true, color: "warning", model: valOutlineGlow.value.warning }, "Warning");',
      '_.Checkbox({ icon: "token", glow: true, outline: true, color: "danger", model: valOutlineGlow.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", glow: true, outline: true, color: "info", model: valOutlineGlow.value.info }, "Info");',
      '_.Checkbox({ icon: "token", glow: true, outline: true, color: "primary", model: valOutlineGlow.value.primary }, "Primary");',
      '_.Checkbox({ icon: "token", glow: true, outline: true, color: "secondary", model: valOutlineGlow.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "token", glow: true, outline: true, color: "dark", model: valOutlineGlow.value.dark, }, "Dark");',
      '_.Checkbox({ icon: "token", glow: true, outline: true, color: "light", model: valOutlineGlow.value.light }, "Light");',
    ]
  },
  outlineGlossy: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valOutlineGlossy))),
      _.Checkbox({ icon: "token", glossy: true, outline: true, model: valOutlineGlossy.value.none }, "None"),
      _.Checkbox({ icon: "token", glossy: true, outline: true, color: "success", model: valOutlineGlossy.value.success }, "Success"),
      _.Checkbox({ icon: "token", glossy: true, outline: true, color: "warning", model: valOutlineGlossy.value.warning }, "Warning"),
      _.Checkbox({ icon: "token", glossy: true, outline: true, color: "danger", model: valOutlineGlossy.value.danger }, "Danger"),
      _.Checkbox({ icon: "token", glossy: true, outline: true, color: "info", model: valOutlineGlossy.value.info }, "Info"),
      _.Checkbox({ icon: "token", glossy: true, outline: true, color: "primary", model: valOutlineGlossy.value.primary }, "Primary"),
      _.Checkbox({ icon: "token", glossy: true, outline: true, color: "secondary", model: valOutlineGlossy.value.secondary }, "Secondary"),
      _.Checkbox({ icon: "token", glossy: true, outline: true, color: "dark", model: valOutlineGlossy.value.dark }, "Dark"),
      _.Checkbox({ icon: "token", glossy: true, outline: true, color: "light", model: valOutlineGlossy.value.light }, "Light"),
    ],
    sample: [
      '_.Checkbox({ icon: "token", glossy: true, outline: true, model: valOutlineGlossy.value.none }, "None");',
      '_.Checkbox({ icon: "token", glossy: true, outline: true, color: "success", model: valOutlineGlossy.value.success }, "Success");',
      '_.Checkbox({ icon: "token", glossy: true, outline: true, color: "warning", model: valOutlineGlossy.value.warning }, "Warning");',
      '_.Checkbox({ icon: "token", glossy: true, outline: true, color: "danger", model: valOutlineGlossy.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", glossy: true, outline: true, color: "info", model: valOutlineGlossy.value.info }, "Info");',
      '_.Checkbox({ icon: "token", glossy: true, outline: true, color: "primary", model: valOutlineGlossy.value.primary }, "Primary");',
      '_.Checkbox({ icon: "token", glossy: true, outline: true, color: "secondary", model: valOutlineGlossy.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "token", glossy: true, outline: true, color: "dark", model: valOutlineGlossy.value.dark }, "Dark");',
      '_.Checkbox({ icon: "token", glossy: true, outline: true, color: "light", model: valOutlineGlossy.value.light }, "Light");',
    ]
  },
  outlineGlass: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valOutlineGlass))),
      _.Checkbox({ icon: "token", outline: true, glass: true, model: valOutlineGlass.value.none }, "None"),
      _.Checkbox({ icon: "token", outline: true, glass: true, color: "success", model: valOutlineGlass.value.success }, "Success"),
      _.Checkbox({ icon: "token", outline: true, glass: true, color: "warning", model: valOutlineGlass.value.warning }, "Warning"),
      _.Checkbox({ icon: "token", outline: true, glass: true, color: "danger", model: valOutlineGlass.value.danger }, "Danger"),
      _.Checkbox({ icon: "token", outline: true, glass: true, color: "info", model: valOutlineGlass.value.info }, "Info"),
      _.Checkbox({ icon: "token", outline: true, glass: true, color: "primary", model: valOutlineGlass.value.primary }, "Primary"),
      _.Checkbox({ icon: "token", outline: true, glass: true, color: "secondary", model: valOutlineGlass.value.secondary }, "Secondary"),
      _.Checkbox({ icon: "token", outline: true, glass: true, color: "dark", model: valOutlineGlass.value.dark }, "Dark"),
      _.Checkbox({ icon: "token", outline: true, glass: true, color: "light", model: valOutlineGlass.value.light }, "Light"),
    ],
    sample: [
      '_.Checkbox({ icon: "token", outline: true, glass: true, model: valOutlineGlass.value.none }, "None");',
      '_.Checkbox({ icon: "token", outline: true, glass: true, color: "success", model: valOutlineGlass.value.success }, "Success");',
      '_.Checkbox({ icon: "token", outline: true, glass: true, color: "warning", model: valOutlineGlass.value.warning }, "Warning");',
      '_.Checkbox({ icon: "token", outline: true, glass: true, color: "danger", model: valOutlineGlass.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", outline: true, glass: true, color: "info", model: valOutlineGlass.value.info }, "Info");',
      '_.Checkbox({ icon: "token", outline: true, glass: true, color: "primary", model: valOutlineGlass.value.primary }, "Primary");',
      '_.Checkbox({ icon: "token", outline: true, glass: true, color: "secondary", model: valOutlineGlass.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "token", outline: true, glass: true, color: "dark", model: valOutlineGlass.value.dark }, "Dark");',
      '_.Checkbox({ icon: "token", outline: true, glass: true, color: "light", model: valOutlineGlass.value.light }, "Light");',
    ]
  },
  outlineLightShadow: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valOutlineLightShadow))),
      _.Checkbox({ icon: "token", lightShadow: true, outline: true, model: valOutlineLightShadow.value.none }, "None"),
      _.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "success", model: valOutlineLightShadow.value.success }, "Success"),
      _.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "warning", model: valOutlineLightShadow.value.warning }, "Warning"),
      _.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "danger", model: valOutlineLightShadow.value.danger }, "Danger"),
      _.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "info", model: valOutlineLightShadow.value.info }, "Info"),
      _.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "primary", model: valOutlineLightShadow.value.primary }, "Primary"),
      _.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "secondary", model: valOutlineLightShadow.value.secondary }, "Secondary"),
      _.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "dark", model: valOutlineLightShadow.value.dark }, "Dark"),
      _.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "light", model: valOutlineLightShadow.value.light }, "Light"),],
    sample: [
      '_.Checkbox({ icon: "token", lightShadow: true, outline: true, model: valOutlineLightShadow.value.none }, "None");',
      '_.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "success", model: valOutlineLightShadow.value.success }, "Success");',
      '_.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "warning", model: valOutlineLightShadow.value.warning }, "Warning");',
      '_.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "danger", model: valOutlineLightShadow.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "info", model: valOutlineLightShadow.value.info }, "Info");',
      '_.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "primary", model: valOutlineLightShadow.value.primary }, "Primary");',
      '_.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "secondary", model: valOutlineLightShadow.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "dark", model: valOutlineLightShadow.value.dark }, "Dark");',
      '_.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "light", model: valOutlineLightShadow.value.light }, "Light");',
    ]
  },
  textGradient: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valTextGradient))),
      _.Checkbox({ icon: "token", textGradient: true, model: valTextGradient.value.none }, "None"),
      _.Checkbox({ icon: "token", textGradient: true, color: "success", model: valTextGradient.value.success }, "Success"),
      _.Checkbox({ icon: "token", textGradient: true, color: "warning", model: valTextGradient.value.warning }, "Warning"),
      _.Checkbox({ icon: "token", textGradient: true, color: "danger", model: valTextGradient.value.danger }, "Danger"),
      _.Checkbox({ icon: "token", textGradient: true, color: "info", model: valTextGradient.value.info }, "Info"),
      _.Checkbox({ icon: "token", textGradient: true, color: "primary", model: valTextGradient.value.primary }, "Primary"),
      _.Checkbox({ icon: "token", textGradient: true, color: "secondary", model: valTextGradient.value.secondary }, "Secondary"),
      _.Checkbox({ icon: "token", textGradient: true, color: "dark", model: valTextGradient.value.dark }, "Dark"),
      _.Checkbox({ icon: "token", textGradient: true, color: "light", model: valTextGradient.value.light }, "Light"),
    ],
    sample: [
      '_.Checkbox({ icon: "token", textGradient: true, model: valTextGradient.value.none }, "None");',
      '_.Checkbox({ icon: "token", textGradient: true, color: "success", model: valTextGradient.value.success }, "Success");',
      '_.Checkbox({ icon: "token", textGradient: true, color: "warning", model: valTextGradient.value.warning }, "Warning");',
      '_.Checkbox({ icon: "token", textGradient: true, color: "danger", model: valTextGradient.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", textGradient: true, color: "info", model: valTextGradient.value.info }, "Info");',
      '_.Checkbox({ icon: "token", textGradient: true, color: "primary", model: valTextGradient.value.primary }, "Primary");',
      '_.Checkbox({ icon: "token", textGradient: true, color: "secondary", model: valTextGradient.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "token", textGradient: true, color: "dark", model: valTextGradient.value.dark }, "Dark");',
      '_.Checkbox({ icon: "token", textGradient: true, color: "light", model: valTextGradient.value.light }, "Light");',
    ]
  },
  outlineTextGradient: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(getCheckboxValues(valOutlineTextGradient))),
      _.Checkbox({ icon: "token", textGradient: true, outline: true, model: valOutlineTextGradient.value.none }, "None"),
      _.Checkbox({ icon: "token", textGradient: true, outline: true, color: "success", model: valOutlineTextGradient.value.success }, "Success"),
      _.Checkbox({ icon: "token", textGradient: true, outline: true, color: "warning", model: valOutlineTextGradient.value.warning }, "Warning"),
      _.Checkbox({ icon: "token", textGradient: true, outline: true, color: "danger", model: valOutlineTextGradient.value.danger }, "Danger"),
      _.Checkbox({ icon: "token", textGradient: true, outline: true, color: "info", model: valOutlineTextGradient.value.info }, "Info"),
      _.Checkbox({ icon: "token", textGradient: true, outline: true, color: "primary", model: valOutlineTextGradient.value.primary }, "Primary"),
      _.Checkbox({ icon: "token", textGradient: true, outline: true, color: "secondary", model: valOutlineTextGradient.value.secondary }, "Secondary"),
      _.Checkbox({ icon: "token", textGradient: true, outline: true, color: "dark", model: valOutlineTextGradient.value.dark }, "Dark"),
      _.Checkbox({ icon: "token", textGradient: true, outline: true, color: "light", model: valOutlineTextGradient.value.light }, "Light"),
    ],
    sample: [
      '_.Checkbox({ icon: "token", textGradient: true, outline: true, model: valOutlineTextGradient.value.none }, "None");',
      '_.Checkbox({ icon: "token", textGradient: true, outline: true, color: "success", model: valOutlineTextGradient.value.success }, "Success");',
      '_.Checkbox({ icon: "token", textGradient: true, outline: true, color: "warning", model: valOutlineTextGradient.value.warning }, "Warning");',
      '_.Checkbox({ icon: "token", textGradient: true, outline: true, color: "danger", model: valOutlineTextGradient.value.danger }, "Danger");',
      '_.Checkbox({ icon: "token", textGradient: true, outline: true, color: "info", model: valOutlineTextGradient.value.info }, "Info");',
      '_.Checkbox({ icon: "token", textGradient: true, outline: true, color: "primary", model: valOutlineTextGradient.value.primary }, "Primary");',
      '_.Checkbox({ icon: "token", textGradient: true, outline: true, color: "secondary", model: valOutlineTextGradient.value.secondary }, "Secondary");',
      '_.Checkbox({ icon: "token", textGradient: true, outline: true, color: "dark", model: valOutlineTextGradient.value.dark }, "Dark");',
      '_.Checkbox({ icon: "token", textGradient: true, outline: true, color: "light", model: valOutlineTextGradient.value.light }, "Light");',
    ]
  }
};
const checkbox = _.div({ class: "cms-panel cms-page" },
  _.h1("Checkbox"),
  _.p("Checkbox con label e supporto model reattivo. Espone onChange/onInput e variante dense."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Documentazione API"),
  _.DocTable("Checkbox"),
  _.h2("Esempio completo"),
  boxCode('Basic color', listSample.basic),
  boxCode('Size', listSample.size),
  boxCode('Icon', listSample.icon),
  boxCode('Shadow', listSample.shadow),
  boxCode('Light Shadow', listSample.lightShadow),
  boxCode('Border', listSample.border),
  boxCode('Glossy', listSample.glossy),
  boxCode('Glossy border', listSample.glossyBorder),
  boxCode('Glow', listSample.glow),
  boxCode('Glass', listSample.glass),
  boxCode('Gradient', listSample.gradient),
  boxCode('Outline', listSample.outline),
  boxCode('Outline + Glow', listSample.outlineGlow),
  boxCode('Outline + Glossy', listSample.outlineGlossy),
  boxCode('Outline + Glass', listSample.outlineGlass),
  boxCode('Outline + Light Shadow', listSample.outlineLightShadow),
  boxCode('Text Gradient', listSample.textGradient),
  boxCode('Outline + Text Gradient', listSample.outlineTextGradient),
);

export { checkbox };
