const valBase = _rod({ none: true });
const valSize = _rod({});
const valIcon = _rod({});
const valBasic = _rod({});
const valShadow = _rod({});
const valLightShadow = _rod({});
const valClickable = _rod({});
const valBorder = _rod({});
const valGlossy = _rod({});
const valGlossyBorder = _rod({});
const valGlow = _rod({});
const valGlass = _rod({});
const valGradient = _rod({});
const valOutline = _rod({});
const valOutlineGlow = _rod({});
const valOutlineGlossy = _rod({});
const valOutlineGlass = _rod({});
const valOutlineLightShadow = _rod({});
const valTextGradient = _rod({});
const valOutlineTextGradient = _rod({});
const listSample = {
  basic: {
    code:
      [
        _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(
          () => {
            return valBase.none ? "None" : "Success";
          }
        )),
        _ui.Checkbox({ value: (val) => { valBase.value.none = val } }, "None"),
        _ui.Checkbox({ color: "success", value: "Success", model: valBase }, "Success"),
        _ui.Checkbox({ color: "warning", value: "Warning", model: valBase }, "Warning"),
        _ui.Checkbox({ color: "danger", value: "Danger", model: valBase }, "Danger"),
        _ui.Checkbox({ color: "info", value: "Info", model: valBase }, "Info"),
        _ui.Checkbox({ color: "primary", value: "Primary", model: valBase }, "Primary"),
        _ui.Checkbox({ color: "secondary", value: "Secondary", model: valBase }, "Secondary"),
        _ui.Checkbox({ color: "dark", value: "Dark", model: valBase }, "Dark"),
        _ui.Checkbox({ color: "light", value: "Light", model: valBase }, "Light")],
    sample: [
      '_ui.Checkbox({ value:"None", model:valBase },"None");',
      '_ui.Checkbox({ color: "success", value:"Success", model:valBase },"Success");',
      '_ui.Checkbox({ color: "warning", value:"Warning", model:valBase }, "Warning" );',
      '_ui.Checkbox({ color: "danger", value:"Danger", model:valBase }, "Danger" );',
      '_ui.Checkbox({ color: "info", value:"Info", model:valBase }, "Info" );',
      '_ui.Checkbox({ color: "primary", value:"Primary", model:valBase }, "Primary" );',
      '_ui.Checkbox({ color: "secondary", value:"Secondary", model:valBase }, "Secondary" );',
      '_ui.Checkbox({ color: "dark", value:"Dark", model:valBase }, "Dark" );',
      '_ui.Checkbox({ color: "light", value:"Light", model:valBase }, "Light" );',
    ]
  },
  size: {
    code:
      [
        _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valSize)),
        _ui.Checkbox({ color: "success", value: "success xxs", model: valSize, size: "xxs" }, "Success xxs"),
        _ui.Checkbox({ color: "success", value: "success", model: valSize, size: "xs" }, "Success xs"),
        _ui.Checkbox({ color: "warning", value: "warning", model: valSize, size: "sm" }, "Warning sm"),
        _ui.Checkbox({ color: "danger", value: "danger", model: valSize, size: "md" }, "Danger md"),
        _ui.Checkbox({ color: "info", value: "info", model: valSize, size: "lg" }, "Info lg"),
        _ui.Checkbox({ color: "primary", value: "primary", model: valSize, size: "xl" }, "Primary xl"),
        _ui.Checkbox({ color: "secondary", value: "secondary", model: valSize, size: "xxl" }, "Secondary xxl")
      ],
    sample: [
      '_ui.Checkbox({ color: "success", value:"success", model:valSize, size: "xxs" }, "Success xxs");',
      '_ui.Checkbox({ color: "success", value:"success", model:valSize, size: "xs" }, "Success xs");',
      '_ui.Checkbox({ color: "warning", value:"warning", model:valSize, size: "sm" }, "Warning sm");',
      '_ui.Checkbox({ color: "danger", value:"danger", model:valSize, size: "md" }, "Danger md");',
      '_ui.Checkbox({ color: "info", value:"info", model:valSize, size: "lg" }, "Info lg");',
      '_ui.Checkbox({ color: "primary", value:"primary", model:valSize, size: "xl" }, "Primary xl");',
      '_ui.Checkbox({ color: "secondary", value:"secondary", model:valSize, size: "xxl" }, "Secondary xxl");',
    ]
  },
  icon: {
    code:
      [
        _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valIcon)),
        _ui.Checkbox({ icon: "token", value: "none", model: valIcon }, "None"),
        _ui.Checkbox({ icon: "token", color: "success", value: "success", model: valIcon }, "Success"),
        _ui.Checkbox({ icon: "token", color: "warning", value: "warning", model: valIcon }, "Warning"),
        _ui.Checkbox({ icon: "assignment_late", color: "danger", value: "danger", model: valIcon }, "Danger"),
        _ui.Checkbox({ icon: "token", iconRight: "info", color: "info", value: "info", model: valIcon }, "Info"),
        _ui.Checkbox({ icon: "contact_mail", color: "primary", value: "primary", model: valIcon }, "Primary"),
        _ui.Checkbox({ icon: "personal_bag_question", iconRight: "notification_settings", color: "secondary", value: "secondary", model: valIcon }, "Secondary"),
        _ui.Checkbox({ icon: "brightness_6", iconRight: "#brightness", color: "dark", value: "dark", model: valIcon, }, "Dark"),
        _ui.Checkbox({ icon: "sunny", iconRight: "#sun", color: "light", value: "light", model: valIcon }, "Light"),
      ],
    sample: [
      '_ui.Checkbox({ icon: "token", value:"none", model:valIcon }, "None");',
      '_ui.Checkbox({ icon: "token", color: "success", value:"success", model:valIcon }, "Success");',
      '_ui.Checkbox({ icon: "token", color: "warning", value:"warning", model:valIcon }, "Warning");',
      '_ui.Checkbox({ icon: "assignment_late", color: "danger", value:"danger", model:valIcon }, "Danger");',
      '_ui.Checkbox({ icon: "token", iconRight: "info", color: "info", value:"info", model:valIcon }, "Info");',
      '_ui.Checkbox({ icon: "contact_mail", color: "primary", value:"primary", model:valIcon }, "Primary");',
      '_ui.Checkbox({ icon: "personal_bag_question", iconRight: "notification_settings", color: "secondary", value:"secondary", model:valIcon }, "Secondary");',
      '_ui.Checkbox({ icon: "brightness_6", iconRight: "#brightness", color: "dark", value:"dark", model:valIcon, }, "Dark");',
      '_ui.Checkbox({ icon: "sunny", iconRight: "#sun", color: "light", value:"light", model:valIcon }, "Light");',
    ]
  },
  shadow: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valShadow)),
      _ui.Checkbox({ icon: "token", shadow: true, value: "none", model: valShadow }, "None"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "success", value: "success", model: valShadow }, "Success"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "warning", value: "warning", model: valShadow }, "Warning"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "danger", value: "danger", model: valShadow }, "Danger"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "info", value: "info", model: valShadow }, "Info"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "primary", value: "primary", model: valShadow }, "Primary"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "secondary", value: "secondary", model: valShadow }, "Secondary"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "dark", value: "dark", model: valShadow }, "Dark"),
      _ui.Checkbox({ icon: "token", shadow: true, color: "light", value: "light", model: valShadow }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", shadow: true, value: "none", model: valShadow }, "None");',
      '_ui.Checkbox({ icon: "token", shadow: true, color: "success", value:"success", model:valShadow }, "Success");',
      '_ui.Checkbox({ icon: "token", shadow: true, color: "warning", value:"warning", model:valShadow }, "Warning");',
      '_ui.Checkbox({ icon: "token", shadow: true, color: "danger", value:"danger", model:valShadow }, "Danger");',
      '_ui.Checkbox({ icon: "token", shadow: true, color: "info", value:"info", model:valShadow }, "Info");',
      '_ui.Checkbox({ icon: "token", shadow: true, color: "primary", value:"primary", model:valShadow }, "Primary");',
      '_ui.Checkbox({ icon: "token", shadow: true, color: "secondary", value:"secondary", model:valShadow }, "Secondary");',
      '_ui.Checkbox({ icon: "token", shadow: true, color: "dark", value:"dark", model:valShadow, }, "Dark");',
    ]
  },
  lightShadow: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valLightShadow)),
      _ui.Checkbox({ icon: "token", lightShadow: true, value: "none", model: valLightShadow }, "None"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "success", value: "success", model: valLightShadow }, "Success"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "warning", value: "warning", model: valLightShadow }, "Warning"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "danger", value: "danger", model: valLightShadow }, "Danger"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "info", value: "info", model: valLightShadow }, "Info"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "primary", value: "primary", model: valLightShadow }, "Primary"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "secondary", value: "secondary", model: valLightShadow }, "Secondary"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "dark", value: "dark", model: valLightShadow }, "Dark"),
      _ui.Checkbox({ icon: "token", lightShadow: true, color: "light", value: "light", model: valLightShadow }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", lightShadow: true, value: "none", model: valLightShadow }, "None");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, color: "success", value:"success", model:valLightShadow }, "Success");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, color: "warning", value:"warning", model:valLightShadow }, "Warning");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, color: "danger", value:"danger", model:valLightShadow }, "Danger");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, color: "info", value:"info", model:valLightShadow }, "Info");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, color: "primary", value:"primary", model:valLightShadow }, "Primary");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, color: "secondary", value:"secondary", model:valLightShadow }, "Secondary");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, color: "dark", value:"dark", model:valLightShadow, }, "Dark");',
    ]
  },
  border: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valBorder)),
      _ui.Checkbox({ icon: "token", border: true, value: "none", model: valBorder }, "None"),
      _ui.Checkbox({ icon: "token", border: true, color: "success", value: "success", model: valBorder }, "Success"),
      _ui.Checkbox({ icon: "token", border: true, color: "warning", value: "warning", model: valBorder }, "Warning"),
      _ui.Checkbox({ icon: "token", border: true, color: "danger", value: "danger", model: valBorder }, "Danger"),
      _ui.Checkbox({ icon: "token", border: true, color: "info", value: "info", model: valBorder }, "Info"),
      _ui.Checkbox({ icon: "token", border: true, color: "primary", value: "primary", model: valBorder }, "Primary"),
      _ui.Checkbox({ icon: "token", border: true, color: "secondary", value: "secondary", model: valBorder }, "Secondary"),
      _ui.Checkbox({ icon: "token", border: true, color: "dark", value: "dark", model: valBorder }, "Dark"),
      _ui.Checkbox({ icon: "token", border: true, color: "light", value: "light", model: valBorder }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", border: true, value: "none", model: valBorder }, "None");',
      '_ui.Checkbox({ icon: "token", border: true, color: "success", value:"success", model:valBorder }, "Success");',
      '_ui.Checkbox({ icon: "token", border: true, color: "warning", value:"warning", model:valBorder }, "Warning");',
      '_ui.Checkbox({ icon: "token", border: true, color: "danger", value:"danger", model:valBorder }, "Danger");',
      '_ui.Checkbox({ icon: "token", border: true, color: "info", value:"info", model:valBorder }, "Info");',
      '_ui.Checkbox({ icon: "token", border: true, color: "primary", value:"primary", model:valBorder }, "Primary");',
      '_ui.Checkbox({ icon: "token", border: true, color: "secondary", value:"secondary", model:valBorder }, "Secondary");',
      '_ui.Checkbox({ icon: "token", border: true, color: "dark", value:"dark", model:valBorder, }, "Dark");',
    ]
  },
  glossy: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valGlossy)),
      _ui.Checkbox({ icon: "token", glossy: true, value: "none", model: valGlossy }, "None"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "success", value: "success", model: valGlossy }, "Success"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "warning", value: "warning", model: valGlossy }, "Warning"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "danger", value: "danger", model: valGlossy }, "Danger"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "info", value: "info", model: valGlossy }, "Info"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "primary", value: "primary", model: valGlossy }, "Primary"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "secondary", value: "secondary", model: valGlossy }, "Secondary"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "dark", value: "dark", model: valGlossy }, "Dark"),
      _ui.Checkbox({ icon: "token", glossy: true, color: "light", value: "light", model: valGlossy }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", glossy: true, value: "none", model: valGlossy }, "None");',
      '_ui.Checkbox({ icon: "token", glossy: true, color: "success", value:"success", model:valGlossy }, "Success");',
      '_ui.Checkbox({ icon: "token", glossy: true, color: "warning", value:"warning", model:valGlossy }, "Warning");',
      '_ui.Checkbox({ icon: "token", glossy: true, color: "danger", value:"danger", model:valGlossy }, "Danger");',
      '_ui.Checkbox({ icon: "token", glossy: true, color: "info", value:"info", model:valGlossy }, "Info");',
      '_ui.Checkbox({ icon: "token", glossy: true, color: "primary", value:"primary", model:valGlossy }, "Primary");',
      '_ui.Checkbox({ icon: "token", glossy: true, color: "secondary", value:"secondary", model:valGlossy }, "Secondary");',
      '_ui.Checkbox({ icon: "token", glossy: true, color: "dark", value:"dark", model:valGlossy, }, "Dark");',
    ]
  },
  glossyBorder: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valGlossyBorder)),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, value: "none", model: valGlossyBorder }, "None"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "success", value: "success", model: valGlossyBorder }, "Success"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "warning", value: "warning", model: valGlossyBorder }, "Warning"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "danger", value: "danger", model: valGlossyBorder }, "Danger"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "info", value: "info", model: valGlossyBorder }, "Info"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "primary", value: "primary", model: valGlossyBorder }, "Primary"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "secondary", value: "secondary", model: valGlossyBorder }, "Secondary"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "dark", value: "dark", model: valGlossyBorder }, "Dark"),
      _ui.Checkbox({ icon: "token", border: true, glossy: true, color: "light", value: "light", model: valGlossyBorder }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, value: "none", model: valGlossyBorder }, "None");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "success", value:"success", model:valGlossyBorder }, "Success");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "warning", value:"warning", model:valGlossyBorder }, "Warning");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "danger", value:"danger", model:valGlossyBorder }, "Danger");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "info", value:"info", model:valGlossyBorder }, "Info");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "primary", value:"primary", model:valGlossyBorder }, "Primary");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "secondary", value:"secondary", model:valGlossyBorder }, "Secondary");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "dark", value:"dark", model:valGlossyBorder }, "Dark");',
      '_ui.Checkbox({ icon: "token", border: true, glossy: true, color: "light", value:"light", model:valGlossyBorder }, "Light");',
    ]
  },
  glow: {
    code:
      [
        _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valGlow)),
        _ui.Checkbox({ icon: "token", glow: true, value: "none", model: valGlow }, "None"),
        _ui.Checkbox({ icon: "token", glow: true, color: "success", value: "success", model: valGlow }, "Success"),
        _ui.Checkbox({ icon: "token", glow: true, color: "warning", value: "warning", model: valGlow }, "Warning"),
        _ui.Checkbox({ icon: "token", glow: true, color: "danger", value: "danger", model: valGlow }, "Danger"),
        _ui.Checkbox({ icon: "token", glow: true, color: "info", value: "info", model: valGlow }, "Info"),
        _ui.Checkbox({ icon: "token", glow: true, color: "primary", value: "primary", model: valGlow }, "Primary"),
        _ui.Checkbox({ icon: "token", glow: true, color: "secondary", value: "secondary", model: valGlow }, "Secondary"),
        _ui.Checkbox({ icon: "token", glow: true, color: "dark", value: "dark", model: valGlow }, "Dark"),
        _ui.Checkbox({ icon: "token", glow: true, color: "light", value: "light", model: valGlow }, "Light"),
      ],
    sample: [
      '_ui.Checkbox({ icon: "token", glow: true, value: "none", model: valGlow }, "None");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "success", value:"success", model:valGlow }, "Success");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "warning", value:"warning", model:valGlow }, "Warning");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "danger", value:"danger", model:valGlow }, "Danger");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "info", value:"info", model:valGlow }, "Info");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "primary", value:"primary", model:valGlow }, "Primary");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "secondary", value:"secondary", model:valGlow }, "Secondary");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "dark", value:"dark", model:valGlow }, "Dark");',
      '_ui.Checkbox({ icon: "token", glow: true, color: "light", value:"light", model:valGlow }, "Light");',
    ]
  },
  glass: {
    code:
      [
        _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valGlass)),
        _ui.Checkbox({ icon: "token", glass: true, value: "none", model: valGlass }, "None"),
        _ui.Checkbox({ icon: "token", glass: true, color: "success", value: "success", model: valGlass }, "Success"),
        _ui.Checkbox({ icon: "token", glass: true, color: "warning", value: "warning", model: valGlass }, "Warning"),
        _ui.Checkbox({ icon: "token", glass: true, color: "danger", value: "danger", model: valGlass }, "Danger"),
        _ui.Checkbox({ icon: "token", glass: true, color: "info", value: "info", model: valGlass }, "Info"),
        _ui.Checkbox({ icon: "token", glass: true, color: "primary", value: "primary", model: valGlass }, "Primary"),
        _ui.Checkbox({ icon: "token", glass: true, color: "secondary", value: "secondary", model: valGlass }, "Secondary"),
        _ui.Checkbox({ icon: "token", glass: true, color: "dark", value: "dark", model: valGlass }, "Dark"),
        _ui.Checkbox({ icon: "token", glass: true, color: "light", value: "light", model: valGlass }, "Light"),
      ],
    sample: [
      '_ui.Checkbox({ icon: "token", glass: true, value: "none", model: valGlass }, "None");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "success", value:"success", model:valGlass }, "Success");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "warning", value:"warning", model:valGlass }, "Warning");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "danger", value:"danger", model:valGlass }, "Danger");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "info", value:"info", model:valGlass }, "Info");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "primary", value:"primary", model:valGlass }, "Primary");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "secondary", value:"secondary", model:valGlass }, "Secondary");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "dark", value:"dark", model:valGlass }, "Dark");',
      '_ui.Checkbox({ icon: "token", glass: true, color: "light", value:"light", model:valGlass }, "Light");',
    ]
  },
  gradient: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valGradient)),
      _ui.Checkbox({ icon: "token", gradient: true, value: "none", model: valGradient }, "None"),
      _ui.Checkbox({ icon: "token", gradient: true, color: "success", value: "success", model: valGradient }, "Success"),
      _ui.Checkbox({ icon: "token", gradient: -90, color: "warning", value: "warning", model: valGradient }, "Warning"),
      _ui.Checkbox({ icon: "token", gradient: 90, color: "danger", value: "danger", model: valGradient }, "Danger"),
      _ui.Checkbox({ icon: "token", gradient: 1, color: "info", value: "info", model: valGradient }, "Info"),
      _ui.Checkbox({ icon: "token", gradient: 25, color: "primary", value: "primary", model: valGradient }, "Primary"),
      _ui.Checkbox({ icon: "token", gradient: -25, color: "secondary", value: "secondary", model: valGradient }, "Secondary"),
      _ui.Checkbox({ icon: "token", gradient: 270, color: "dark", value: "dark", model: valGradient }, "Dark"),
      _ui.Checkbox({ icon: "token", gradient: true, color: "light", value: "light", model: valGradient }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", gradient: true, value: "none", model: valGradient }, "None");',
      '_ui.Checkbox({ icon: "token", gradient: true, color: "success", value:"success", model:valGradient }, "Success");',
      '_ui.Checkbox({ icon: "token", gradient: -90, color: "warning", value:"warning", model:valGradient }, "Warning");',
      '_ui.Checkbox({ icon: "token", gradient: 90, color: "danger", value:"danger", model:valGradient }, "Danger");',
      '_ui.Checkbox({ icon: "token", gradient: 1, color: "info", value:"info", model:valGradient }, "Info");',
      '_ui.Checkbox({ icon: "token", gradient: 25, color: "primary", value:"primary", model:valGradient }, "Primary");',
      '_ui.Checkbox({ icon: "token", gradient: -25, color: "secondary", value:"secondary", model:valGradient }, "Secondary");',
      '_ui.Checkbox({ icon: "token", gradient: 270, color: "dark", value:"dark", model:valGradient }, "Dark");',
      '_ui.Checkbox({ icon: "token", gradient: true, color: "light", value:"light", model:valGradient }, "Light");',
    ]
  },
  outline: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valOutline)),
      _ui.Checkbox({ icon: "token", outline: true, value: "none", model: valOutline }, "None"),
      _ui.Checkbox({ icon: "token", outline: true, color: "success", value: "success", model: valOutline }, "Success"),
      _ui.Checkbox({ icon: "token", outline: true, color: "warning", value: "warning", model: valOutline }, "Warning"),
      _ui.Checkbox({ icon: "token", outline: true, color: "danger", value: "danger", model: valOutline }, "Danger"),
      _ui.Checkbox({ icon: "token", outline: true, color: "info", value: "info", model: valOutline }, "Info"),
      _ui.Checkbox({ icon: "token", outline: true, color: "primary", value: "primary", model: valOutline }, "Primary"),
      _ui.Checkbox({ icon: "token", outline: true, color: "secondary", value: "secondary", model: valOutline }, "Secondary"),
      _ui.Checkbox({ icon: "token", outline: true, color: "dark", value: "dark", model: valOutline, }, "Dark"),
      _ui.Checkbox({ icon: "token", outline: true, color: "light", value: "light", model: valOutline }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", outline: true, value: "none", model: valOutline }, "None");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "success", value:"success", model:valOutline }, "Success");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "warning", value:"warning", model:valOutline }, "Warning");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "danger", value:"danger", model:valOutline }, "Danger");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "info", value:"info", model:valOutline }, "Info");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "primary", value:"primary", model:valOutline }, "Primary");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "secondary", value:"secondary", model:valOutline }, "Secondary");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "dark", value:"dark", model:valOutline, }, "Dark");',
      '_ui.Checkbox({ icon: "token", outline: true, color: "light", value:"light", model:valOutline }, "Light");',
    ]
  },
  outlineGlow: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valOutlineGlow)),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, value: "none", model: valOutlineGlow }, "None"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "success", value: "success", model: valOutlineGlow }, "Success"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "warning", value: "warning", model: valOutlineGlow }, "Warning"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "danger", value: "danger", model: valOutlineGlow }, "Danger"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "info", value: "info", model: valOutlineGlow }, "Info"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "primary", value: "primary", model: valOutlineGlow }, "Primary"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "secondary", value: "secondary", model: valOutlineGlow }, "Secondary"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "dark", value: "dark", model: valOutlineGlow, }, "Dark"),
      _ui.Checkbox({ icon: "token", glow: true, outline: true, color: "light", value: "light", model: valOutlineGlow }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, value: "none", model: valOutlineGlow }, "None");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "success", value:"success", model:valOutlineGlow }, "Success");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "warning", value:"warning", model:valOutlineGlow }, "Warning");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "danger", value:"danger", model:valOutlineGlow }, "Danger");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "info", value:"info", model:valOutlineGlow }, "Info");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "primary", value:"primary", model:valOutlineGlow }, "Primary");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "secondary", value:"secondary", model:valOutlineGlow }, "Secondary");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "dark", value:"dark", model:valOutlineGlow, }, "Dark");',
      '_ui.Checkbox({ icon: "token", glow: true, outline: true, color: "light", value:"light", model:valOutlineGlow }, "Light");',
    ]
  },
  outlineGlossy: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valOutlineGlossy)),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, value: "none", model: valOutlineGlossy }, "None"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "success", value: "success", model: valOutlineGlossy }, "Success"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "warning", value: "warning", model: valOutlineGlossy }, "Warning"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "danger", value: "danger", model: valOutlineGlossy }, "Danger"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "info", value: "info", model: valOutlineGlossy }, "Info"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "primary", value: "primary", model: valOutlineGlossy }, "Primary"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "secondary", value: "secondary", model: valOutlineGlossy }, "Secondary"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "dark", value: "dark", model: valOutlineGlossy }, "Dark"),
      _ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "light", value: "light", model: valOutlineGlossy }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, value: "none", model: valOutlineGlossy }, "None");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "success", value:"success", model:valOutlineGlossy }, "Success");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "warning", value:"warning", model:valOutlineGlossy }, "Warning");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "danger", value:"danger", model:valOutlineGlossy }, "Danger");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "info", value:"info", model:valOutlineGlossy }, "Info");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "primary", value:"primary", model:valOutlineGlossy }, "Primary");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "secondary", value:"secondary", model:valOutlineGlossy }, "Secondary");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "dark", value:"dark", model:valOutlineGlossy }, "Dark");',
      '_ui.Checkbox({ icon: "token", glossy: true, outline: true, color: "light", value:"light", model:valOutlineGlossy }, "Light");',
    ]
  },
  outlineGlass: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valOutlineGlass)),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, value: "none", model: valOutlineGlass }, "None"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "success", value: "success", model: valOutlineGlass }, "Success"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "warning", value: "warning", model: valOutlineGlass }, "Warning"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "danger", value: "danger", model: valOutlineGlass }, "Danger"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "info", value: "info", model: valOutlineGlass }, "Info"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "primary", value: "primary", model: valOutlineGlass }, "Primary"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "secondary", value: "secondary", model: valOutlineGlass }, "Secondary"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "dark", value: "dark", model: valOutlineGlass }, "Dark"),
      _ui.Checkbox({ icon: "token", outline: true, glass: true, color: "light", value: "light", model: valOutlineGlass }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, value: "none", model: valOutlineGlass }, "None");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "success", value:"success", model:valOutlineGlass }, "Success");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "warning", value:"warning", model:valOutlineGlass }, "Warning");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "danger", value:"danger", model:valOutlineGlass }, "Danger");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "info", value:"info", model:valOutlineGlass }, "Info");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "primary", value:"primary", model:valOutlineGlass }, "Primary");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "secondary", value:"secondary", model:valOutlineGlass }, "Secondary");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "dark", value:"dark", model:valOutlineGlass }, "Dark");',
      '_ui.Checkbox({ icon: "token", outline: true, glass: true, color: "light", value:"light", model:valOutlineGlass }, "Light");',
    ]
  },
  outlineLightShadow: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valOutlineLightShadow)),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, value: "none", model: valOutlineLightShadow }, "None"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "success", value: "success", model: valOutlineLightShadow }, "Success"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "warning", value: "warning", model: valOutlineLightShadow }, "Warning"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "danger", value: "danger", model: valOutlineLightShadow }, "Danger"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "info", value: "info", model: valOutlineLightShadow }, "Info"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "primary", value: "primary", model: valOutlineLightShadow }, "Primary"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "secondary", value: "secondary", model: valOutlineLightShadow }, "Secondary"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "dark", value: "dark", model: valOutlineLightShadow }, "Dark"),
      _ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "light", value: "light", model: valOutlineLightShadow }, "Light"),],
    sample: [
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, value:"none", model:valOutlineLightShadow }, "None");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "success", value:"success", model:valOutlineLightShadow }, "Success");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "warning", value:"warning", model:valOutlineLightShadow }, "Warning");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "danger", value:"danger", model:valOutlineLightShadow }, "Danger");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "info", value:"info", model:valOutlineLightShadow }, "Info");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "primary", value:"primary", model:valOutlineLightShadow }, "Primary");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "secondary", value:"secondary", model:valOutlineLightShadow }, "Secondary");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "dark", value:"dark", model:valOutlineLightShadow }, "Dark");',
      '_ui.Checkbox({ icon: "token", lightShadow: true, outline: true, color: "light", value:"light", model:valOutlineLightShadow }, "Light");',
    ]
  },
  textGradient: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valTextGradient)),
      _ui.Checkbox({ icon: "token", textGradient: true, value: "none", model: valTextGradient }, "None"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "success", value: "success", model: valTextGradient }, "Success"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "warning", value: "warning", model: valTextGradient }, "Warning"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "danger", value: "danger", model: valTextGradient }, "Danger"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "info", value: "info", model: valTextGradient }, "Info"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "primary", value: "primary", model: valTextGradient }, "Primary"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "secondary", value: "secondary", model: valTextGradient }, "Secondary"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "dark", value: "dark", model: valTextGradient }, "Dark"),
      _ui.Checkbox({ icon: "token", textGradient: true, color: "light", value: "light", model: valTextGradient }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", textGradient: true, value:"none", model:valTextGradient }, "None");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "success", value:"success", model:valTextGradient }, "Success");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "warning", value:"warning", model:valTextGradient }, "Warning");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "danger", value:"danger", model:valTextGradient }, "Danger");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "info", value:"info", model:valTextGradient }, "Info");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "primary", value:"primary", model:valTextGradient }, "Primary");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "secondary", value:"secondary", model:valTextGradient }, "Secondary");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "dark", value:"dark", model:valTextGradient }, "Dark");',
      '_ui.Checkbox({ icon: "token", textGradient: true, color: "light", value:"light", model:valTextGradient }, "Light");',
    ]
  },
  outlineTextGradient: {
    code: [
      _h.div({ class: 'cms-m-b-md' }, _h.b("Valore: "), _h.span(valOutlineTextGradient)),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, value: "none", model: valOutlineTextGradient }, "None"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "success", value: "success", model: valOutlineTextGradient }, "Success"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "warning", value: "warning", model: valOutlineTextGradient }, "Warning"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "danger", value: "danger", model: valOutlineTextGradient }, "Danger"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "info", value: "info", model: valOutlineTextGradient }, "Info"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "primary", value: "primary", model: valOutlineTextGradient }, "Primary"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "secondary", value: "secondary", model: valOutlineTextGradient }, "Secondary"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "dark", value: "dark", model: valOutlineTextGradient }, "Dark"),
      _ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "light", value: "light", model: valOutlineTextGradient }, "Light"),
    ],
    sample: [
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, value:"none", model:valOutlineTextGradient }, "None");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "success", value:"success", model:valOutlineTextGradient }, "Success");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "warning", value:"warning", model:valOutlineTextGradient }, "Warning");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "danger", value:"danger", model:valOutlineTextGradient }, "Danger");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "info", value:"info", model:valOutlineTextGradient }, "Info");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "primary", value:"primary", model:valOutlineTextGradient }, "Primary");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "secondary", value:"secondary", model:valOutlineTextGradient }, "Secondary");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "dark", value:"dark", model:valOutlineTextGradient }, "Dark");',
      '_ui.Checkbox({ icon: "token", textGradient: true, outline: true, color: "light", value:"light", model:valOutlineTextGradient }, "Light");',
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
