const createCheckboxState = (keys) => _rod(
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
        _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valBase))),
        _ui.Checkbox({ model: valBase.value.none }, "None"),
        _ui.Checkbox({ color: "success", model: valBase.value.success }, "Success"),
        _ui.Checkbox({ color: "warning", model: valBase.value.warning }, "Warning"),
        _ui.Checkbox({ color: "danger", model: valBase.value.danger }, "Danger"),
        _ui.Checkbox({ color: "info", model: valBase.value.info }, "Info"),
        _ui.Checkbox({ color: "primary", model: valBase.value.primary }, "Primary"),
        _ui.Checkbox({ color: "secondary", model: valBase.value.secondary }, "Secondary"),
        _ui.Checkbox({ color: "dark", model: valBase.value.dark }, "Dark"),
        _ui.Checkbox({ color: "light", model: valBase.value.light }, "Light")],
    sample: [
      '_ui.Checkbox({ model: valBase.value.none }, "None");',
      '_ui.Checkbox({ color: "success", model: valBase.value.success }, "Success");',
      '_ui.Checkbox({ color: "warning", model: valBase.value.warning }, "Warning");',
      '_ui.Checkbox({ color: "danger", model: valBase.value.danger }, "Danger");',
      '_ui.Checkbox({ color: "info", model: valBase.value.info }, "Info");',
      '_ui.Checkbox({ color: "primary", model: valBase.value.primary }, "Primary");',
      '_ui.Checkbox({ color: "secondary", model: valBase.value.secondary }, "Secondary");',
      '_ui.Checkbox({ color: "dark", model: valBase.value.dark }, "Dark");',
      '_ui.Checkbox({ color: "light", model: valBase.value.light }, "Light");',
    ]
  },
  size: {
    code:
      [
        _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valSize))),
        _ui.Checkbox({ color: "success", model: valSize.value.xxs, size: "xxs" }, "Success xxs"),
        _ui.Checkbox({ color: "success", model: valSize.value.xs, size: "xs" }, "Success xs"),
        _ui.Checkbox({ color: "warning", model: valSize.value.sm, size: "sm" }, "Warning sm"),
        _ui.Checkbox({ color: "danger", model: valSize.value.md, size: "md" }, "Danger md"),
        _ui.Checkbox({ color: "info", model: valSize.value.lg, size: "lg" }, "Info lg"),
        _ui.Checkbox({ color: "primary", model: valSize.value.xl, size: "xl" }, "Primary xl"),
        _ui.Checkbox({ color: "secondary", model: valSize.value.xxl, size: "xxl" }, "Secondary xxl")
      ],
    sample: [
      '_ui.Checkbox({ color: "success", model: valSize.value.xxs, size: "xxs" }, "Success xxs");',
      '_ui.Checkbox({ color: "success", model: valSize.value.xs, size: "xs" }, "Success xs");',
      '_ui.Checkbox({ color: "warning", model: valSize.value.sm, size: "sm" }, "Warning sm");',
      '_ui.Checkbox({ color: "danger", model: valSize.value.md, size: "md" }, "Danger md");',
      '_ui.Checkbox({ color: "info", model: valSize.value.lg, size: "lg" }, "Info lg");',
      '_ui.Checkbox({ color: "primary", model: valSize.value.xl, size: "xl" }, "Primary xl");',
      '_ui.Checkbox({ color: "secondary", model: valSize.value.xxl, size: "xxl" }, "Secondary xxl");',
    ]
  },
  icon: {
    code:
      [
        _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valIcon))),
        _ui.Checkbox({ icon: "token", model: valIcon.value.none }, "None"),
        _ui.Checkbox({ icon: "token", color: "success", model: valIcon.value.success }, "Success"),
        _ui.Checkbox({ icon: "token", color: "warning", model: valIcon.value.warning }, "Warning"),
        _ui.Checkbox({ icon: "assignment_late", color: "danger", model: valIcon.value.danger }, "Danger"),
        _ui.Checkbox({ icon: "token", iconRight: "info", color: "info", model: valIcon.value.info }, "Info"),
        _ui.Checkbox({ icon: "contact_mail", color: "primary", model: valIcon.value.primary }, "Primary"),
        _ui.Checkbox({ icon: "personal_bag_question", iconRight: "notification_settings", color: "secondary", model: valIcon.value.secondary }, "Secondary"),
        _ui.Checkbox({ icon: "brightness_6", iconRight: "#brightness", color: "dark", model: valIcon.value.dark, }, "Dark"),
        _ui.Checkbox({ icon: "sunny", iconRight: "#sun", color: "light", model: valIcon.value.light }, "Light"),
      ],
    sample: [
      '_ui.Checkbox({ icon: "token", model: valIcon.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", color: "success", model: valIcon.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", color: "warning", model: valIcon.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "assignment_late", color: "danger", model: valIcon.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", iconRight: "info", color: "info", model: valIcon.value.info }, "Info");',
      '_ui.Checkbox({ icon: "contact_mail", color: "primary", model: valIcon.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "personal_bag_question", iconRight: "notification_settings", color: "secondary", model: valIcon.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "brightness_6", iconRight: "#brightness", color: "dark", model: valIcon.value.dark, }, "Dark");',
      '_ui.Checkbox({ icon: "sunny", iconRight: "#sun", color: "light", model: valIcon.value.light }, "Light");',
    ]
  },
  shadow: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valShadow))),
      _ui.Checkbox({ icon: "token", shadow: true, model: valShadow.value.none }, "None"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "success", model: valShadow.value.success }, "Success"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "warning", model: valShadow.value.warning }, "Warning"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "danger", model: valShadow.value.danger }, "Danger"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "info", model: valShadow.value.info }, "Info"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "primary", model: valShadow.value.primary }, "Primary"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "secondary", model: valShadow.value.secondary }, "Secondary"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "dark", model: valShadow.value.dark }, "Dark"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "light", model: valShadow.value.light }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", shadow: true, model: valShadow.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", shadow: true, color: "success", model: valShadow.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", shadow: true, color: "warning", model: valShadow.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "token", shadow: true, color: "danger", model: valShadow.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", shadow: true, color: "info", model: valShadow.value.info }, "Info");',
      '_ui.Checkbox({ icon: "token", shadow: true, color: "primary", model: valShadow.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "token", shadow: true, color: "secondary", model: valShadow.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "token", shadow: true, color: "dark", model: valShadow.value.dark, }, "Dark");',
      '_ui.Checkbox({ icon: "token", shadow: true, color: "light", model: valShadow.value.light }, "Light");',
    ]
  },
  lightShadow: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valLightShadow))),
      _ui.Checkbox({ icon: "token", lightShadow: true, model: valLightShadow.value.none }, "None"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "success", model: valLightShadow.value.success }, "Success"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "warning", model: valLightShadow.value.warning }, "Warning"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "danger", model: valLightShadow.value.danger }, "Danger"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "info", model: valLightShadow.value.info }, "Info"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "primary", model: valLightShadow.value.primary }, "Primary"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "secondary", model: valLightShadow.value.secondary }, "Secondary"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "dark", model: valLightShadow.value.dark }, "Dark"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "light", model: valLightShadow.value.light }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", lightShadow: true, model: valLightShadow.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, color: "success", model: valLightShadow.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, color: "warning", model: valLightShadow.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, color: "danger", model: valLightShadow.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, color: "info", model: valLightShadow.value.info }, "Info");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, color: "primary", model: valLightShadow.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, color: "secondary", model: valLightShadow.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, color: "dark", model: valLightShadow.value.dark, }, "Dark");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, color: "light", model: valLightShadow.value.light }, "Light");',
    ]
  },
  border: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valBorder))),
      _ui.Checkbox({ icon: "token", border: true, model: valBorder.value.none }, "None"),
      _ui.Checkbox({ icon: "token", border: true, color: "success", model: valBorder.value.success }, "Success"),
      _ui.Checkbox({ icon: "token", border: true, color: "warning", model: valBorder.value.warning }, "Warning"),
      _ui.Checkbox({ icon: "token", border: true, color: "danger", model: valBorder.value.danger }, "Danger"),
      _ui.Checkbox({ icon: "token", border: true, color: "info", model: valBorder.value.info }, "Info"),
      _ui.Checkbox({ icon: "token", border: true, color: "primary", model: valBorder.value.primary }, "Primary"),
      _ui.Checkbox({ icon: "token", border: true, color: "secondary", model: valBorder.value.secondary }, "Secondary"),
      _ui.Checkbox({ icon: "token", border: true, color: "dark", model: valBorder.value.dark }, "Dark"),
      _ui.Checkbox({ icon: "token", border: true, color: "light", model: valBorder.value.light }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", border: true, model: valBorder.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", border: true, color: "success", model: valBorder.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", border: true, color: "warning", model: valBorder.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "token", border: true, color: "danger", model: valBorder.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", border: true, color: "info", model: valBorder.value.info }, "Info");',
      '_ui.Checkbox({ icon: "token", border: true, color: "primary", model: valBorder.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "token", border: true, color: "secondary", model: valBorder.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "token", border: true, color: "dark", model: valBorder.value.dark, }, "Dark");',
      '_ui.Checkbox({ icon: "token", border: true, color: "light", model: valBorder.value.light }, "Light");',
    ]
  },
  glossy: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valGlossy))),
      _ui.Checkbox({ icon: "token", glossy: true, model: valGlossy.value.none }, "None"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "success", model: valGlossy.value.success }, "Success"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "warning", model: valGlossy.value.warning }, "Warning"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "danger", model: valGlossy.value.danger }, "Danger"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "info", model: valGlossy.value.info }, "Info"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "primary", model: valGlossy.value.primary }, "Primary"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "secondary", model: valGlossy.value.secondary }, "Secondary"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "dark", model: valGlossy.value.dark }, "Dark"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "light", model: valGlossy.value.light }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", glossy: true, model: valGlossy.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", glossy: true, color: "success", model: valGlossy.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", glossy: true, color: "warning", model: valGlossy.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "token", glossy: true, color: "danger", model: valGlossy.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", glossy: true, color: "info", model: valGlossy.value.info }, "Info");',
      '_ui.Checkbox({ icon: "token", glossy: true, color: "primary", model: valGlossy.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "token", glossy: true, color: "secondary", model: valGlossy.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "token", glossy: true, color: "dark", model: valGlossy.value.dark, }, "Dark");',
      '_ui.Checkbox({ icon: "token", glossy: true, color: "light", model: valGlossy.value.light }, "Light");',
    ]
  },
  glossyBorder: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valGlossyBorder))),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, model: valGlossyBorder.value.none }, "None"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "success", model: valGlossyBorder.value.success }, "Success"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "warning", model: valGlossyBorder.value.warning }, "Warning"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "danger", model: valGlossyBorder.value.danger }, "Danger"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "info", model: valGlossyBorder.value.info }, "Info"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "primary", model: valGlossyBorder.value.primary }, "Primary"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "secondary", model: valGlossyBorder.value.secondary }, "Secondary"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "dark", model: valGlossyBorder.value.dark }, "Dark"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "light", model: valGlossyBorder.value.light }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, model: valGlossyBorder.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "success", model: valGlossyBorder.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "warning", model: valGlossyBorder.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "danger", model: valGlossyBorder.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "info", model: valGlossyBorder.value.info }, "Info");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "primary", model: valGlossyBorder.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "secondary", model: valGlossyBorder.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "dark", model: valGlossyBorder.value.dark }, "Dark");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "light", model: valGlossyBorder.value.light }, "Light");',
    ]
  },
  glow: {
    code:
      [
        _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valGlow))),
        _ui.Checkbox({ icon: "token", glow: true, model: valGlow.value.none }, "None"),
        _ui.Checkbox({ icon: "token", glow: true, color: "success", model: valGlow.value.success }, "Success"),
        _ui.Checkbox({ icon: "token", glow: true, color: "warning", model: valGlow.value.warning }, "Warning"),
        _ui.Checkbox({ icon: "token", glow: true, color: "danger", model: valGlow.value.danger }, "Danger"),
        _ui.Checkbox({ icon: "token", glow: true, color: "info", model: valGlow.value.info }, "Info"),
        _ui.Checkbox({ icon: "token", glow: true, color: "primary", model: valGlow.value.primary }, "Primary"),
        _ui.Checkbox({ icon: "token", glow: true, color: "secondary", model: valGlow.value.secondary }, "Secondary"),
        _ui.Checkbox({ icon: "token", glow: true, color: "dark", model: valGlow.value.dark }, "Dark"),
        _ui.Checkbox({ icon: "token", glow: true, color: "light", model: valGlow.value.light }, "Light"),
      ],
    sample: [
      '_ui.Checkbox({ icon: "token", glow: true, model: valGlow.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "success", model: valGlow.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "warning", model: valGlow.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "danger", model: valGlow.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "info", model: valGlow.value.info }, "Info");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "primary", model: valGlow.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "secondary", model: valGlow.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "dark", model: valGlow.value.dark }, "Dark");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "light", model: valGlow.value.light }, "Light");',
    ]
  },
  glass: {
    code:
      [
        _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valGlass))),
        _ui.Checkbox({ icon: "token", glass: true, model: valGlass.value.none }, "None"),
        _ui.Checkbox({ icon: "token", glass: true, color: "success", model: valGlass.value.success }, "Success"),
        _ui.Checkbox({ icon: "token", glass: true, color: "warning", model: valGlass.value.warning }, "Warning"),
        _ui.Checkbox({ icon: "token", glass: true, color: "danger", model: valGlass.value.danger }, "Danger"),
        _ui.Checkbox({ icon: "token", glass: true, color: "info", model: valGlass.value.info }, "Info"),
        _ui.Checkbox({ icon: "token", glass: true, color: "primary", model: valGlass.value.primary }, "Primary"),
        _ui.Checkbox({ icon: "token", glass: true, color: "secondary", model: valGlass.value.secondary }, "Secondary"),
        _ui.Checkbox({ icon: "token", glass: true, color: "dark", model: valGlass.value.dark }, "Dark"),
        _ui.Checkbox({ icon: "token", glass: true, color: "light", model: valGlass.value.light }, "Light"),
      ],
    sample: [
      '_ui.Checkbox({ icon: "token", glass: true, model: valGlass.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "success", model: valGlass.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "warning", model: valGlass.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "danger", model: valGlass.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "info", model: valGlass.value.info }, "Info");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "primary", model: valGlass.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "secondary", model: valGlass.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "dark", model: valGlass.value.dark }, "Dark");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "light", model: valGlass.value.light }, "Light");',
    ]
  },
  gradient: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valGradient))),
      _ui.Checkbox({ icon: "token", gradient: true, model: valGradient.value.none }, "None"),
      _ui.Checkbox({ icon: "token", gradient: true, color: "success", model: valGradient.value.success }, "Success"),
      _ui.Checkbox({ icon: "token", gradient: -90, color: "warning", model: valGradient.value.warning }, "Warning"),
      _ui.Checkbox({ icon: "token", gradient: 90, color: "danger", model: valGradient.value.danger }, "Danger"),
      _ui.Checkbox({ icon: "token", gradient: 1, color: "info", model: valGradient.value.info }, "Info"),
      _ui.Checkbox({ icon: "token", gradient: 25, color: "primary", model: valGradient.value.primary }, "Primary"),
      _ui.Checkbox({ icon: "token", gradient: -25, color: "secondary", model: valGradient.value.secondary }, "Secondary"),
      _ui.Checkbox({ icon: "token", gradient: 270, color: "dark", model: valGradient.value.dark }, "Dark"),
      _ui.Checkbox({ icon: "token", gradient: true, color: "light", model: valGradient.value.light }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", gradient: true, model: valGradient.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", gradient: true, color: "success", model: valGradient.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", gradient: -90, color: "warning", model: valGradient.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "token", gradient: 90, color: "danger", model: valGradient.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", gradient: 1, color: "info", model: valGradient.value.info }, "Info");',
      '_ui.Checkbox({ icon: "token", gradient: 25, color: "primary", model: valGradient.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "token", gradient: -25, color: "secondary", model: valGradient.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "token", gradient: 270, color: "dark", model: valGradient.value.dark }, "Dark");',
      '_ui.Checkbox({ icon: "token", gradient: true, color: "light", model: valGradient.value.light }, "Light");',
    ]
  },
  outline: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valOutline))),
      _ui.Checkbox({ icon: "token", outline: true, model: valOutline.value.none }, "None"),
      _ui.Checkbox({ icon: "token", outline: true, color: "success", model: valOutline.value.success }, "Success"),
      _ui.Checkbox({ icon: "token", outline: true, color: "warning", model: valOutline.value.warning }, "Warning"),
      _ui.Checkbox({ icon: "token", outline: true, color: "danger", model: valOutline.value.danger }, "Danger"),
      _ui.Checkbox({ icon: "token", outline: true, color: "info", model: valOutline.value.info }, "Info"),
      _ui.Checkbox({ icon: "token", outline: true, color: "primary", model: valOutline.value.primary }, "Primary"),
      _ui.Checkbox({ icon: "token", outline: true, color: "secondary", model: valOutline.value.secondary }, "Secondary"),
      _ui.Checkbox({ icon: "token", outline: true, color: "dark", model: valOutline.value.dark, }, "Dark"),
      _ui.Checkbox({ icon: "token", outline: true, color: "light", model: valOutline.value.light }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", outline: true, model: valOutline.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "success", model: valOutline.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "warning", model: valOutline.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "danger", model: valOutline.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "info", model: valOutline.value.info }, "Info");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "primary", model: valOutline.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "secondary", model: valOutline.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "dark", model: valOutline.value.dark, }, "Dark");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "light", model: valOutline.value.light }, "Light");',
    ]
  },
  outlineGlow: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valOutlineGlow))),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, model: valOutlineGlow.value.none }, "None"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "success", model: valOutlineGlow.value.success }, "Success"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "warning", model: valOutlineGlow.value.warning }, "Warning"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "danger", model: valOutlineGlow.value.danger }, "Danger"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "info", model: valOutlineGlow.value.info }, "Info"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "primary", model: valOutlineGlow.value.primary }, "Primary"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "secondary", model: valOutlineGlow.value.secondary }, "Secondary"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "dark", model: valOutlineGlow.value.dark, }, "Dark"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "light", model: valOutlineGlow.value.light }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, model: valOutlineGlow.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "success", model: valOutlineGlow.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "warning", model: valOutlineGlow.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "danger", model: valOutlineGlow.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "info", model: valOutlineGlow.value.info }, "Info");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "primary", model: valOutlineGlow.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "secondary", model: valOutlineGlow.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "dark", model: valOutlineGlow.value.dark, }, "Dark");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "light", model: valOutlineGlow.value.light }, "Light");',
    ]
  },
  outlineGlossy: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valOutlineGlossy))),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, model: valOutlineGlossy.value.none }, "None"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "success", model: valOutlineGlossy.value.success }, "Success"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "warning", model: valOutlineGlossy.value.warning }, "Warning"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "danger", model: valOutlineGlossy.value.danger }, "Danger"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "info", model: valOutlineGlossy.value.info }, "Info"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "primary", model: valOutlineGlossy.value.primary }, "Primary"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "secondary", model: valOutlineGlossy.value.secondary }, "Secondary"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "dark", model: valOutlineGlossy.value.dark }, "Dark"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "light", model: valOutlineGlossy.value.light }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, model: valOutlineGlossy.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "success", model: valOutlineGlossy.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "warning", model: valOutlineGlossy.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "danger", model: valOutlineGlossy.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "info", model: valOutlineGlossy.value.info }, "Info");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "primary", model: valOutlineGlossy.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "secondary", model: valOutlineGlossy.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "dark", model: valOutlineGlossy.value.dark }, "Dark");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "light", model: valOutlineGlossy.value.light }, "Light");',
    ]
  },
  outlineGlass: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valOutlineGlass))),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, model: valOutlineGlass.value.none }, "None"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "success", model: valOutlineGlass.value.success }, "Success"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "warning", model: valOutlineGlass.value.warning }, "Warning"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "danger", model: valOutlineGlass.value.danger }, "Danger"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "info", model: valOutlineGlass.value.info }, "Info"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "primary", model: valOutlineGlass.value.primary }, "Primary"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "secondary", model: valOutlineGlass.value.secondary }, "Secondary"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "dark", model: valOutlineGlass.value.dark }, "Dark"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "light", model: valOutlineGlass.value.light }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, model: valOutlineGlass.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "success", model: valOutlineGlass.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "warning", model: valOutlineGlass.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "danger", model: valOutlineGlass.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "info", model: valOutlineGlass.value.info }, "Info");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "primary", model: valOutlineGlass.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "secondary", model: valOutlineGlass.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "dark", model: valOutlineGlass.value.dark }, "Dark");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "light", model: valOutlineGlass.value.light }, "Light");',
    ]
  },
  outlineLightShadow: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valOutlineLightShadow))),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, model: valOutlineLightShadow.value.none }, "None"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "success", model: valOutlineLightShadow.value.success }, "Success"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "warning", model: valOutlineLightShadow.value.warning }, "Warning"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "danger", model: valOutlineLightShadow.value.danger }, "Danger"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "info", model: valOutlineLightShadow.value.info }, "Info"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "primary", model: valOutlineLightShadow.value.primary }, "Primary"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "secondary", model: valOutlineLightShadow.value.secondary }, "Secondary"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "dark", model: valOutlineLightShadow.value.dark }, "Dark"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "light", model: valOutlineLightShadow.value.light }, "Light"),],
    sample: [
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, model: valOutlineLightShadow.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "success", model: valOutlineLightShadow.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "warning", model: valOutlineLightShadow.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "danger", model: valOutlineLightShadow.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "info", model: valOutlineLightShadow.value.info }, "Info");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "primary", model: valOutlineLightShadow.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "secondary", model: valOutlineLightShadow.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "dark", model: valOutlineLightShadow.value.dark }, "Dark");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "light", model: valOutlineLightShadow.value.light }, "Light");',
    ]
  },
  textGradient: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valTextGradient))),
      _ui.Checkbox({ icon: "token", textGradient: true, model: valTextGradient.value.none }, "None"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "success", model: valTextGradient.value.success }, "Success"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "warning", model: valTextGradient.value.warning }, "Warning"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "danger", model: valTextGradient.value.danger }, "Danger"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "info", model: valTextGradient.value.info }, "Info"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "primary", model: valTextGradient.value.primary }, "Primary"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "secondary", model: valTextGradient.value.secondary }, "Secondary"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "dark", model: valTextGradient.value.dark }, "Dark"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "light", model: valTextGradient.value.light }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", textGradient: true, model: valTextGradient.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "success", model: valTextGradient.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "warning", model: valTextGradient.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "danger", model: valTextGradient.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "info", model: valTextGradient.value.info }, "Info");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "primary", model: valTextGradient.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "secondary", model: valTextGradient.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "dark", model: valTextGradient.value.dark }, "Dark");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "light", model: valTextGradient.value.light }, "Light");',
    ]
  },
  outlineTextGradient: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(getCheckboxValues(valOutlineTextGradient))),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, model: valOutlineTextGradient.value.none }, "None"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "success", model: valOutlineTextGradient.value.success }, "Success"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "warning", model: valOutlineTextGradient.value.warning }, "Warning"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "danger", model: valOutlineTextGradient.value.danger }, "Danger"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "info", model: valOutlineTextGradient.value.info }, "Info"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "primary", model: valOutlineTextGradient.value.primary }, "Primary"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "secondary", model: valOutlineTextGradient.value.secondary }, "Secondary"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "dark", model: valOutlineTextGradient.value.dark }, "Dark"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "light", model: valOutlineTextGradient.value.light }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, model: valOutlineTextGradient.value.none }, "None");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "success", model: valOutlineTextGradient.value.success }, "Success");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "warning", model: valOutlineTextGradient.value.warning }, "Warning");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "danger", model: valOutlineTextGradient.value.danger }, "Danger");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "info", model: valOutlineTextGradient.value.info }, "Info");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "primary", model: valOutlineTextGradient.value.primary }, "Primary");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "secondary", model: valOutlineTextGradient.value.secondary }, "Secondary");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "dark", model: valOutlineTextGradient.value.dark }, "Dark");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "light", model: valOutlineTextGradient.value.light }, "Light");',
    ]
  }
};
const checkbox = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Checkbox"),
  _h.p("Checkbox con label e supporto model reattivo. Espone onChange/onInput e variante dense."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Checkbox"),
  _h.h2("Esempio completo"),
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
