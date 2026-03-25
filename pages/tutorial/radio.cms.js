const valBase = _.rod("");
const valSize = _.rod("");
const valIcon = _.rod("");
const valBasic = _.rod("");
const valShadow = _.rod("");
const valLightShadow = _.rod("");
const valClickable = _.rod("");
const valBorder = _.rod("");
const valGlossy = _.rod("");
const valGlossyBorder = _.rod("");
const valGlow = _.rod("");
const valGlass = _.rod("");
const valGradient = _.rod("");
const valOutline = _.rod("");
const valOutlineGlow = _.rod("");
const valOutlineGlossy = _.rod("");
const valOutlineGlass = _.rod("");
const valOutlineLightShadow = _.rod("");
const valTextGradient = _.rod("");
const valOutlineTextGradient = _.rod("");
const listSample = {
  basic: {
    code:
      [
        _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valBase)),
        _.Radio({ value: "None", model: valBase }, "None"),
        _.Radio({ color: "success", value: "Success", model: valBase }, "Success"),
        _.Radio({ color: "warning", value: "Warning", model: valBase }, "Warning"),
        _.Radio({ color: "danger", value: "Danger", model: valBase }, "Danger"),
        _.Radio({ color: "info", value: "Info", model: valBase }, "Info"),
        _.Radio({ color: "primary", value: "Primary", model: valBase }, "Primary"),
        _.Radio({ color: "secondary", value: "Secondary", model: valBase }, "Secondary"),
        _.Radio({ color: "dark", value: "Dark", model: valBase }, "Dark"),
        _.Radio({ color: "light", value: "Light", model: valBase }, "Light")],
    sample: [
      '_.Radio({ value:"None", model:valBase },"None");',
      '_.Radio({ color: "success", value:"Success", model:valBase },"Success");',
      '_.Radio({ color: "warning", value:"Warning", model:valBase }, "Warning" );',
      '_.Radio({ color: "danger", value:"Danger", model:valBase }, "Danger" );',
      '_.Radio({ color: "info", value:"Info", model:valBase }, "Info" );',
      '_.Radio({ color: "primary", value:"Primary", model:valBase }, "Primary" );',
      '_.Radio({ color: "secondary", value:"Secondary", model:valBase }, "Secondary" );',
      '_.Radio({ color: "dark", value:"Dark", model:valBase }, "Dark" );',
      '_.Radio({ color: "light", value:"Light", model:valBase }, "Light" );',
    ]
  },
  size: {
    code:
      [
        _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valSize)),
        _.Radio({ color: "success", value: "success xxs", model: valSize, size: "xxs" }, "Success xxs"),
        _.Radio({ color: "success", value: "success", model: valSize, size: "xs" }, "Success xs"),
        _.Radio({ color: "warning", value: "warning", model: valSize, size: "sm" }, "Warning sm"),
        _.Radio({ color: "danger", value: "danger", model: valSize, size: "md" }, "Danger md"),
        _.Radio({ color: "info", value: "info", model: valSize, size: "lg" }, "Info lg"),
        _.Radio({ color: "primary", value: "primary", model: valSize, size: "xl" }, "Primary xl"),
        _.Radio({ color: "secondary", value: "secondary", model: valSize, size: "xxl" }, "Secondary xxl")
      ],
    sample: [
      '_.Radio({ color: "success", value:"success", model:valSize, size: "xxs" }, "Success xxs");',
      '_.Radio({ color: "success", value:"success", model:valSize, size: "xs" }, "Success xs");',
      '_.Radio({ color: "warning", value:"warning", model:valSize, size: "sm" }, "Warning sm");',
      '_.Radio({ color: "danger", value:"danger", model:valSize, size: "md" }, "Danger md");',
      '_.Radio({ color: "info", value:"info", model:valSize, size: "lg" }, "Info lg");',
      '_.Radio({ color: "primary", value:"primary", model:valSize, size: "xl" }, "Primary xl");',
      '_.Radio({ color: "secondary", value:"secondary", model:valSize, size: "xxl" }, "Secondary xxl");',
    ]
  },
  icon: {
    code:
      [
        _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valIcon)),
        _.Radio({ icon: "token", value: "none", model: valIcon }, "None"),
        _.Radio({ icon: "token", color: "success", value: "success", model: valIcon }, "Success"),
        _.Radio({ icon: "token", color: "warning", value: "warning", model: valIcon }, "Warning"),
        _.Radio({ icon: "assignment_late", color: "danger", value: "danger", model: valIcon }, "Danger"),
        _.Radio({ icon: "token", iconRight: "info", color: "info", value: "info", model: valIcon }, "Info"),
        _.Radio({ icon: "contact_mail", color: "primary", value: "primary", model: valIcon }, "Primary"),
        _.Radio({ icon: "personal_bag_question", iconRight: "notification_settings", color: "secondary", value: "secondary", model: valIcon }, "Secondary"),
        _.Radio({ icon: "brightness_6", iconRight: "#brightness", color: "dark", value: "dark", model: valIcon, }, "Dark"),
        _.Radio({ icon: "sunny", iconRight: "#sun", color: "light", value: "light", model: valIcon }, "Light"),
      ],
    sample: [
      '_.Radio({ icon: "token", value:"none", model:valIcon }, "None");',
      '_.Radio({ icon: "token", color: "success", value:"success", model:valIcon }, "Success");',
      '_.Radio({ icon: "token", color: "warning", value:"warning", model:valIcon }, "Warning");',
      '_.Radio({ icon: "assignment_late", color: "danger", value:"danger", model:valIcon }, "Danger");',
      '_.Radio({ icon: "token", iconRight: "info", color: "info", value:"info", model:valIcon }, "Info");',
      '_.Radio({ icon: "contact_mail", color: "primary", value:"primary", model:valIcon }, "Primary");',
      '_.Radio({ icon: "personal_bag_question", iconRight: "notification_settings", color: "secondary", value:"secondary", model:valIcon }, "Secondary");',
      '_.Radio({ icon: "brightness_6", iconRight: "#brightness", color: "dark", value:"dark", model:valIcon, }, "Dark");',
      '_.Radio({ icon: "sunny", iconRight: "#sun", color: "light", value:"light", model:valIcon }, "Light");',
    ]
  },
  shadow: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valShadow)),
      _.Radio({ icon: "token", shadow: true, value: "none", model: valShadow }, "None"),
      _.Radio({ icon: "token", shadow: true, color: "success", value: "success", model: valShadow }, "Success"),
      _.Radio({ icon: "token", shadow: true, color: "warning", value: "warning", model: valShadow }, "Warning"),
      _.Radio({ icon: "token", shadow: true, color: "danger", value: "danger", model: valShadow }, "Danger"),
      _.Radio({ icon: "token", shadow: true, color: "info", value: "info", model: valShadow }, "Info"),
      _.Radio({ icon: "token", shadow: true, color: "primary", value: "primary", model: valShadow }, "Primary"),
      _.Radio({ icon: "token", shadow: true, color: "secondary", value: "secondary", model: valShadow }, "Secondary"),
      _.Radio({ icon: "token", shadow: true, color: "dark", value: "dark", model: valShadow }, "Dark"),
      _.Radio({ icon: "token", shadow: true, color: "light", value: "light", model: valShadow }, "Light"),
    ],
    sample: [
      '_.Radio({ icon: "token", shadow: true, value: "none", model: valShadow }, "None");',
      '_.Radio({ icon: "token", shadow: true, color: "success", value:"success", model:valShadow }, "Success");',
      '_.Radio({ icon: "token", shadow: true, color: "warning", value:"warning", model:valShadow }, "Warning");',
      '_.Radio({ icon: "token", shadow: true, color: "danger", value:"danger", model:valShadow }, "Danger");',
      '_.Radio({ icon: "token", shadow: true, color: "info", value:"info", model:valShadow }, "Info");',
      '_.Radio({ icon: "token", shadow: true, color: "primary", value:"primary", model:valShadow }, "Primary");',
      '_.Radio({ icon: "token", shadow: true, color: "secondary", value:"secondary", model:valShadow }, "Secondary");',
      '_.Radio({ icon: "token", shadow: true, color: "dark", value:"dark", model:valShadow, }, "Dark");',
    ]
  },
  lightShadow: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valLightShadow)),
      _.Radio({ icon: "token", lightShadow: true, value: "none", model: valLightShadow }, "None"),
      _.Radio({ icon: "token", lightShadow: true, color: "success", value: "success", model: valLightShadow }, "Success"),
      _.Radio({ icon: "token", lightShadow: true, color: "warning", value: "warning", model: valLightShadow }, "Warning"),
      _.Radio({ icon: "token", lightShadow: true, color: "danger", value: "danger", model: valLightShadow }, "Danger"),
      _.Radio({ icon: "token", lightShadow: true, color: "info", value: "info", model: valLightShadow }, "Info"),
      _.Radio({ icon: "token", lightShadow: true, color: "primary", value: "primary", model: valLightShadow }, "Primary"),
      _.Radio({ icon: "token", lightShadow: true, color: "secondary", value: "secondary", model: valLightShadow }, "Secondary"),
      _.Radio({ icon: "token", lightShadow: true, color: "dark", value: "dark", model: valLightShadow }, "Dark"),
      _.Radio({ icon: "token", lightShadow: true, color: "light", value: "light", model: valLightShadow }, "Light"),
    ],
    sample: [
      '_.Radio({ icon: "token", lightShadow: true, value: "none", model: valLightShadow }, "None");',
      '_.Radio({ icon: "token", lightShadow: true, color: "success", value:"success", model:valLightShadow }, "Success");',
      '_.Radio({ icon: "token", lightShadow: true, color: "warning", value:"warning", model:valLightShadow }, "Warning");',
      '_.Radio({ icon: "token", lightShadow: true, color: "danger", value:"danger", model:valLightShadow }, "Danger");',
      '_.Radio({ icon: "token", lightShadow: true, color: "info", value:"info", model:valLightShadow }, "Info");',
      '_.Radio({ icon: "token", lightShadow: true, color: "primary", value:"primary", model:valLightShadow }, "Primary");',
      '_.Radio({ icon: "token", lightShadow: true, color: "secondary", value:"secondary", model:valLightShadow }, "Secondary");',
      '_.Radio({ icon: "token", lightShadow: true, color: "dark", value:"dark", model:valLightShadow, }, "Dark");',
    ]
  },
  border: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valBorder)),
      _.Radio({ icon: "token", border: true, value: "none", model: valBorder }, "None"),
      _.Radio({ icon: "token", border: true, color: "success", value: "success", model: valBorder }, "Success"),
      _.Radio({ icon: "token", border: true, color: "warning", value: "warning", model: valBorder }, "Warning"),
      _.Radio({ icon: "token", border: true, color: "danger", value: "danger", model: valBorder }, "Danger"),
      _.Radio({ icon: "token", border: true, color: "info", value: "info", model: valBorder }, "Info"),
      _.Radio({ icon: "token", border: true, color: "primary", value: "primary", model: valBorder }, "Primary"),
      _.Radio({ icon: "token", border: true, color: "secondary", value: "secondary", model: valBorder }, "Secondary"),
      _.Radio({ icon: "token", border: true, color: "dark", value: "dark", model: valBorder }, "Dark"),
      _.Radio({ icon: "token", border: true, color: "light", value: "light", model: valBorder }, "Light"),
    ],
    sample: [
      '_.Radio({ icon: "token", border: true, value: "none", model: valBorder }, "None");',
      '_.Radio({ icon: "token", border: true, color: "success", value:"success", model:valBorder }, "Success");',
      '_.Radio({ icon: "token", border: true, color: "warning", value:"warning", model:valBorder }, "Warning");',
      '_.Radio({ icon: "token", border: true, color: "danger", value:"danger", model:valBorder }, "Danger");',
      '_.Radio({ icon: "token", border: true, color: "info", value:"info", model:valBorder }, "Info");',
      '_.Radio({ icon: "token", border: true, color: "primary", value:"primary", model:valBorder }, "Primary");',
      '_.Radio({ icon: "token", border: true, color: "secondary", value:"secondary", model:valBorder }, "Secondary");',
      '_.Radio({ icon: "token", border: true, color: "dark", value:"dark", model:valBorder, }, "Dark");',
    ]
  },
  glossy: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valGlossy)),
      _.Radio({ icon: "token", glossy: true, value: "none", model: valGlossy }, "None"),
      _.Radio({ icon: "token", glossy: true, color: "success", value: "success", model: valGlossy }, "Success"),
      _.Radio({ icon: "token", glossy: true, color: "warning", value: "warning", model: valGlossy }, "Warning"),
      _.Radio({ icon: "token", glossy: true, color: "danger", value: "danger", model: valGlossy }, "Danger"),
      _.Radio({ icon: "token", glossy: true, color: "info", value: "info", model: valGlossy }, "Info"),
      _.Radio({ icon: "token", glossy: true, color: "primary", value: "primary", model: valGlossy }, "Primary"),
      _.Radio({ icon: "token", glossy: true, color: "secondary", value: "secondary", model: valGlossy }, "Secondary"),
      _.Radio({ icon: "token", glossy: true, color: "dark", value: "dark", model: valGlossy }, "Dark"),
      _.Radio({ icon: "token", glossy: true, color: "light", value: "light", model: valGlossy }, "Light"),
    ],
    sample: [
      '_.Radio({ icon: "token", glossy: true, value: "none", model: valGlossy }, "None");',
      '_.Radio({ icon: "token", glossy: true, color: "success", value:"success", model:valGlossy }, "Success");',
      '_.Radio({ icon: "token", glossy: true, color: "warning", value:"warning", model:valGlossy }, "Warning");',
      '_.Radio({ icon: "token", glossy: true, color: "danger", value:"danger", model:valGlossy }, "Danger");',
      '_.Radio({ icon: "token", glossy: true, color: "info", value:"info", model:valGlossy }, "Info");',
      '_.Radio({ icon: "token", glossy: true, color: "primary", value:"primary", model:valGlossy }, "Primary");',
      '_.Radio({ icon: "token", glossy: true, color: "secondary", value:"secondary", model:valGlossy }, "Secondary");',
      '_.Radio({ icon: "token", glossy: true, color: "dark", value:"dark", model:valGlossy, }, "Dark");',
    ]
  },
  glossyBorder: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valGlossyBorder)),
      _.Radio({ icon: "token", border: true, glossy: true, value: "none", model: valGlossyBorder }, "None"),
      _.Radio({ icon: "token", border: true, glossy: true, color: "success", value: "success", model: valGlossyBorder }, "Success"),
      _.Radio({ icon: "token", border: true, glossy: true, color: "warning", value: "warning", model: valGlossyBorder }, "Warning"),
      _.Radio({ icon: "token", border: true, glossy: true, color: "danger", value: "danger", model: valGlossyBorder }, "Danger"),
      _.Radio({ icon: "token", border: true, glossy: true, color: "info", value: "info", model: valGlossyBorder }, "Info"),
      _.Radio({ icon: "token", border: true, glossy: true, color: "primary", value: "primary", model: valGlossyBorder }, "Primary"),
      _.Radio({ icon: "token", border: true, glossy: true, color: "secondary", value: "secondary", model: valGlossyBorder }, "Secondary"),
      _.Radio({ icon: "token", border: true, glossy: true, color: "dark", value: "dark", model: valGlossyBorder }, "Dark"),
      _.Radio({ icon: "token", border: true, glossy: true, color: "light", value: "light", model: valGlossyBorder }, "Light"),
    ],
    sample: [
      '_.Radio({ icon: "token", border: true, glossy: true, value: "none", model: valGlossyBorder }, "None");',
      '_.Radio({ icon: "token", border: true, glossy: true, color: "success", value:"success", model:valGlossyBorder }, "Success");',
      '_.Radio({ icon: "token", border: true, glossy: true, color: "warning", value:"warning", model:valGlossyBorder }, "Warning");',
      '_.Radio({ icon: "token", border: true, glossy: true, color: "danger", value:"danger", model:valGlossyBorder }, "Danger");',
      '_.Radio({ icon: "token", border: true, glossy: true, color: "info", value:"info", model:valGlossyBorder }, "Info");',
      '_.Radio({ icon: "token", border: true, glossy: true, color: "primary", value:"primary", model:valGlossyBorder }, "Primary");',
      '_.Radio({ icon: "token", border: true, glossy: true, color: "secondary", value:"secondary", model:valGlossyBorder }, "Secondary");',
      '_.Radio({ icon: "token", border: true, glossy: true, color: "dark", value:"dark", model:valGlossyBorder }, "Dark");',
      '_.Radio({ icon: "token", border: true, glossy: true, color: "light", value:"light", model:valGlossyBorder }, "Light");',
    ]
  },
  glow: {
    code:
      [
        _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valGlow)),
        _.Radio({ icon: "token", glow: true, value: "none", model: valGlow }, "None"),
        _.Radio({ icon: "token", glow: true, color: "success", value: "success", model: valGlow }, "Success"),
        _.Radio({ icon: "token", glow: true, color: "warning", value: "warning", model: valGlow }, "Warning"),
        _.Radio({ icon: "token", glow: true, color: "danger", value: "danger", model: valGlow }, "Danger"),
        _.Radio({ icon: "token", glow: true, color: "info", value: "info", model: valGlow }, "Info"),
        _.Radio({ icon: "token", glow: true, color: "primary", value: "primary", model: valGlow }, "Primary"),
        _.Radio({ icon: "token", glow: true, color: "secondary", value: "secondary", model: valGlow }, "Secondary"),
        _.Radio({ icon: "token", glow: true, color: "dark", value: "dark", model: valGlow }, "Dark"),
        _.Radio({ icon: "token", glow: true, color: "light", value: "light", model: valGlow }, "Light"),
      ],
    sample: [
      '_.Radio({ icon: "token", glow: true, value: "none", model: valGlow }, "None");',
      '_.Radio({ icon: "token", glow: true, color: "success", value:"success", model:valGlow }, "Success");',
      '_.Radio({ icon: "token", glow: true, color: "warning", value:"warning", model:valGlow }, "Warning");',
      '_.Radio({ icon: "token", glow: true, color: "danger", value:"danger", model:valGlow }, "Danger");',
      '_.Radio({ icon: "token", glow: true, color: "info", value:"info", model:valGlow }, "Info");',
      '_.Radio({ icon: "token", glow: true, color: "primary", value:"primary", model:valGlow }, "Primary");',
      '_.Radio({ icon: "token", glow: true, color: "secondary", value:"secondary", model:valGlow }, "Secondary");',
      '_.Radio({ icon: "token", glow: true, color: "dark", value:"dark", model:valGlow }, "Dark");',
      '_.Radio({ icon: "token", glow: true, color: "light", value:"light", model:valGlow }, "Light");',
    ]
  },
  glass: {
    code:
      [
        _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valGlass)),
        _.Radio({ icon: "token", glass: true, value: "none", model: valGlass }, "None"),
        _.Radio({ icon: "token", glass: true, color: "success", value: "success", model: valGlass }, "Success"),
        _.Radio({ icon: "token", glass: true, color: "warning", value: "warning", model: valGlass }, "Warning"),
        _.Radio({ icon: "token", glass: true, color: "danger", value: "danger", model: valGlass }, "Danger"),
        _.Radio({ icon: "token", glass: true, color: "info", value: "info", model: valGlass }, "Info"),
        _.Radio({ icon: "token", glass: true, color: "primary", value: "primary", model: valGlass }, "Primary"),
        _.Radio({ icon: "token", glass: true, color: "secondary", value: "secondary", model: valGlass }, "Secondary"),
        _.Radio({ icon: "token", glass: true, color: "dark", value: "dark", model: valGlass }, "Dark"),
        _.Radio({ icon: "token", glass: true, color: "light", value: "light", model: valGlass }, "Light"),
      ],
    sample: [
      '_.Radio({ icon: "token", glass: true, value: "none", model: valGlass }, "None");',
      '_.Radio({ icon: "token", glass: true, color: "success", value:"success", model:valGlass }, "Success");',
      '_.Radio({ icon: "token", glass: true, color: "warning", value:"warning", model:valGlass }, "Warning");',
      '_.Radio({ icon: "token", glass: true, color: "danger", value:"danger", model:valGlass }, "Danger");',
      '_.Radio({ icon: "token", glass: true, color: "info", value:"info", model:valGlass }, "Info");',
      '_.Radio({ icon: "token", glass: true, color: "primary", value:"primary", model:valGlass }, "Primary");',
      '_.Radio({ icon: "token", glass: true, color: "secondary", value:"secondary", model:valGlass }, "Secondary");',
      '_.Radio({ icon: "token", glass: true, color: "dark", value:"dark", model:valGlass }, "Dark");',
      '_.Radio({ icon: "token", glass: true, color: "light", value:"light", model:valGlass }, "Light");',
    ]
  },
  gradient: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valGradient)),
      _.Radio({ icon: "token", gradient: true, value: "none", model: valGradient }, "None"),
      _.Radio({ icon: "token", gradient: true, color: "success", value: "success", model: valGradient }, "Success"),
      _.Radio({ icon: "token", gradient: -90, color: "warning", value: "warning", model: valGradient }, "Warning"),
      _.Radio({ icon: "token", gradient: 90, color: "danger", value: "danger", model: valGradient }, "Danger"),
      _.Radio({ icon: "token", gradient: 1, color: "info", value: "info", model: valGradient }, "Info"),
      _.Radio({ icon: "token", gradient: 25, color: "primary", value: "primary", model: valGradient }, "Primary"),
      _.Radio({ icon: "token", gradient: -25, color: "secondary", value: "secondary", model: valGradient }, "Secondary"),
      _.Radio({ icon: "token", gradient: 270, color: "dark", value: "dark", model: valGradient }, "Dark"),
      _.Radio({ icon: "token", gradient: true, color: "light", value: "light", model: valGradient }, "Light"),
    ],
    sample: [
      '_.Radio({ icon: "token", gradient: true, value: "none", model: valGradient }, "None");',
      '_.Radio({ icon: "token", gradient: true, color: "success", value:"success", model:valGradient }, "Success");',
      '_.Radio({ icon: "token", gradient: -90, color: "warning", value:"warning", model:valGradient }, "Warning");',
      '_.Radio({ icon: "token", gradient: 90, color: "danger", value:"danger", model:valGradient }, "Danger");',
      '_.Radio({ icon: "token", gradient: 1, color: "info", value:"info", model:valGradient }, "Info");',
      '_.Radio({ icon: "token", gradient: 25, color: "primary", value:"primary", model:valGradient }, "Primary");',
      '_.Radio({ icon: "token", gradient: -25, color: "secondary", value:"secondary", model:valGradient }, "Secondary");',
      '_.Radio({ icon: "token", gradient: 270, color: "dark", value:"dark", model:valGradient }, "Dark");',
      '_.Radio({ icon: "token", gradient: true, color: "light", value:"light", model:valGradient }, "Light");',
    ]
  },
  outline: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valOutline)),
      _.Radio({ icon: "token", outline: true, value: "none", model: valOutline }, "None"),
      _.Radio({ icon: "token", outline: true, color: "success", value: "success", model: valOutline }, "Success"),
      _.Radio({ icon: "token", outline: true, color: "warning", value: "warning", model: valOutline }, "Warning"),
      _.Radio({ icon: "token", outline: true, color: "danger", value: "danger", model: valOutline }, "Danger"),
      _.Radio({ icon: "token", outline: true, color: "info", value: "info", model: valOutline }, "Info"),
      _.Radio({ icon: "token", outline: true, color: "primary", value: "primary", model: valOutline }, "Primary"),
      _.Radio({ icon: "token", outline: true, color: "secondary", value: "secondary", model: valOutline }, "Secondary"),
      _.Radio({ icon: "token", outline: true, color: "dark", value: "dark", model: valOutline, }, "Dark"),
      _.Radio({ icon: "token", outline: true, color: "light", value: "light", model: valOutline }, "Light"),
    ],
    sample: [
      '_.Radio({ icon: "token", outline: true, value: "none", model: valOutline }, "None");',
      '_.Radio({ icon: "token", outline: true, color: "success", value:"success", model:valOutline }, "Success");',
      '_.Radio({ icon: "token", outline: true, color: "warning", value:"warning", model:valOutline }, "Warning");',
      '_.Radio({ icon: "token", outline: true, color: "danger", value:"danger", model:valOutline }, "Danger");',
      '_.Radio({ icon: "token", outline: true, color: "info", value:"info", model:valOutline }, "Info");',
      '_.Radio({ icon: "token", outline: true, color: "primary", value:"primary", model:valOutline }, "Primary");',
      '_.Radio({ icon: "token", outline: true, color: "secondary", value:"secondary", model:valOutline }, "Secondary");',
      '_.Radio({ icon: "token", outline: true, color: "dark", value:"dark", model:valOutline, }, "Dark");',
      '_.Radio({ icon: "token", outline: true, color: "light", value:"light", model:valOutline }, "Light");',
    ]
  },
  outlineGlow: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valOutlineGlow)),
      _.Radio({ icon: "token", glow: true, outline: true, value: "none", model: valOutlineGlow }, "None"),
      _.Radio({ icon: "token", glow: true, outline: true, color: "success", value: "success", model: valOutlineGlow }, "Success"),
      _.Radio({ icon: "token", glow: true, outline: true, color: "warning", value: "warning", model: valOutlineGlow }, "Warning"),
      _.Radio({ icon: "token", glow: true, outline: true, color: "danger", value: "danger", model: valOutlineGlow }, "Danger"),
      _.Radio({ icon: "token", glow: true, outline: true, color: "info", value: "info", model: valOutlineGlow }, "Info"),
      _.Radio({ icon: "token", glow: true, outline: true, color: "primary", value: "primary", model: valOutlineGlow }, "Primary"),
      _.Radio({ icon: "token", glow: true, outline: true, color: "secondary", value: "secondary", model: valOutlineGlow }, "Secondary"),
      _.Radio({ icon: "token", glow: true, outline: true, color: "dark", value: "dark", model: valOutlineGlow, }, "Dark"),
      _.Radio({ icon: "token", glow: true, outline: true, color: "light", value: "light", model: valOutlineGlow }, "Light"),
    ],
    sample: [
      '_.Radio({ icon: "token", glow: true, outline: true, value: "none", model: valOutlineGlow }, "None");',
      '_.Radio({ icon: "token", glow: true, outline: true, color: "success", value:"success", model:valOutlineGlow }, "Success");',
      '_.Radio({ icon: "token", glow: true, outline: true, color: "warning", value:"warning", model:valOutlineGlow }, "Warning");',
      '_.Radio({ icon: "token", glow: true, outline: true, color: "danger", value:"danger", model:valOutlineGlow }, "Danger");',
      '_.Radio({ icon: "token", glow: true, outline: true, color: "info", value:"info", model:valOutlineGlow }, "Info");',
      '_.Radio({ icon: "token", glow: true, outline: true, color: "primary", value:"primary", model:valOutlineGlow }, "Primary");',
      '_.Radio({ icon: "token", glow: true, outline: true, color: "secondary", value:"secondary", model:valOutlineGlow }, "Secondary");',
      '_.Radio({ icon: "token", glow: true, outline: true, color: "dark", value:"dark", model:valOutlineGlow, }, "Dark");',
      '_.Radio({ icon: "token", glow: true, outline: true, color: "light", value:"light", model:valOutlineGlow }, "Light");',
    ]
  },
  outlineGlossy: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valOutlineGlossy)),
      _.Radio({ icon: "token", glossy: true, outline: true, value: "none", model: valOutlineGlossy }, "None"),
      _.Radio({ icon: "token", glossy: true, outline: true, color: "success", value: "success", model: valOutlineGlossy }, "Success"),
      _.Radio({ icon: "token", glossy: true, outline: true, color: "warning", value: "warning", model: valOutlineGlossy }, "Warning"),
      _.Radio({ icon: "token", glossy: true, outline: true, color: "danger", value: "danger", model: valOutlineGlossy }, "Danger"),
      _.Radio({ icon: "token", glossy: true, outline: true, color: "info", value: "info", model: valOutlineGlossy }, "Info"),
      _.Radio({ icon: "token", glossy: true, outline: true, color: "primary", value: "primary", model: valOutlineGlossy }, "Primary"),
      _.Radio({ icon: "token", glossy: true, outline: true, color: "secondary", value: "secondary", model: valOutlineGlossy }, "Secondary"),
      _.Radio({ icon: "token", glossy: true, outline: true, color: "dark", value: "dark", model: valOutlineGlossy }, "Dark"),
      _.Radio({ icon: "token", glossy: true, outline: true, color: "light", value: "light", model: valOutlineGlossy }, "Light"),
    ],
    sample: [
      '_.Radio({ icon: "token", glossy: true, outline: true, value: "none", model: valOutlineGlossy }, "None");',
      '_.Radio({ icon: "token", glossy: true, outline: true, color: "success", value:"success", model:valOutlineGlossy }, "Success");',
      '_.Radio({ icon: "token", glossy: true, outline: true, color: "warning", value:"warning", model:valOutlineGlossy }, "Warning");',
      '_.Radio({ icon: "token", glossy: true, outline: true, color: "danger", value:"danger", model:valOutlineGlossy }, "Danger");',
      '_.Radio({ icon: "token", glossy: true, outline: true, color: "info", value:"info", model:valOutlineGlossy }, "Info");',
      '_.Radio({ icon: "token", glossy: true, outline: true, color: "primary", value:"primary", model:valOutlineGlossy }, "Primary");',
      '_.Radio({ icon: "token", glossy: true, outline: true, color: "secondary", value:"secondary", model:valOutlineGlossy }, "Secondary");',
      '_.Radio({ icon: "token", glossy: true, outline: true, color: "dark", value:"dark", model:valOutlineGlossy }, "Dark");',
      '_.Radio({ icon: "token", glossy: true, outline: true, color: "light", value:"light", model:valOutlineGlossy }, "Light");',
    ]
  },
  outlineGlass: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valOutlineGlass)),
      _.Radio({ icon: "token", outline: true, glass: true, value: "none", model: valOutlineGlass }, "None"),
      _.Radio({ icon: "token", outline: true, glass: true, color: "success", value: "success", model: valOutlineGlass }, "Success"),
      _.Radio({ icon: "token", outline: true, glass: true, color: "warning", value: "warning", model: valOutlineGlass }, "Warning"),
      _.Radio({ icon: "token", outline: true, glass: true, color: "danger", value: "danger", model: valOutlineGlass }, "Danger"),
      _.Radio({ icon: "token", outline: true, glass: true, color: "info", value: "info", model: valOutlineGlass }, "Info"),
      _.Radio({ icon: "token", outline: true, glass: true, color: "primary", value: "primary", model: valOutlineGlass }, "Primary"),
      _.Radio({ icon: "token", outline: true, glass: true, color: "secondary", value: "secondary", model: valOutlineGlass }, "Secondary"),
      _.Radio({ icon: "token", outline: true, glass: true, color: "dark", value: "dark", model: valOutlineGlass }, "Dark"),
      _.Radio({ icon: "token", outline: true, glass: true, color: "light", value: "light", model: valOutlineGlass }, "Light"),
    ],
    sample: [
      '_.Radio({ icon: "token", outline: true, glass: true, value: "none", model: valOutlineGlass }, "None");',
      '_.Radio({ icon: "token", outline: true, glass: true, color: "success", value:"success", model:valOutlineGlass }, "Success");',
      '_.Radio({ icon: "token", outline: true, glass: true, color: "warning", value:"warning", model:valOutlineGlass }, "Warning");',
      '_.Radio({ icon: "token", outline: true, glass: true, color: "danger", value:"danger", model:valOutlineGlass }, "Danger");',
      '_.Radio({ icon: "token", outline: true, glass: true, color: "info", value:"info", model:valOutlineGlass }, "Info");',
      '_.Radio({ icon: "token", outline: true, glass: true, color: "primary", value:"primary", model:valOutlineGlass }, "Primary");',
      '_.Radio({ icon: "token", outline: true, glass: true, color: "secondary", value:"secondary", model:valOutlineGlass }, "Secondary");',
      '_.Radio({ icon: "token", outline: true, glass: true, color: "dark", value:"dark", model:valOutlineGlass }, "Dark");',
      '_.Radio({ icon: "token", outline: true, glass: true, color: "light", value:"light", model:valOutlineGlass }, "Light");',
    ]
  },
  outlineLightShadow: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valOutlineLightShadow)),
      _.Radio({ icon: "token", lightShadow: true, outline: true, value: "none", model: valOutlineLightShadow }, "None"),
      _.Radio({ icon: "token", lightShadow: true, outline: true, color: "success", value: "success", model: valOutlineLightShadow }, "Success"),
      _.Radio({ icon: "token", lightShadow: true, outline: true, color: "warning", value: "warning", model: valOutlineLightShadow }, "Warning"),
      _.Radio({ icon: "token", lightShadow: true, outline: true, color: "danger", value: "danger", model: valOutlineLightShadow }, "Danger"),
      _.Radio({ icon: "token", lightShadow: true, outline: true, color: "info", value: "info", model: valOutlineLightShadow }, "Info"),
      _.Radio({ icon: "token", lightShadow: true, outline: true, color: "primary", value: "primary", model: valOutlineLightShadow }, "Primary"),
      _.Radio({ icon: "token", lightShadow: true, outline: true, color: "secondary", value: "secondary", model: valOutlineLightShadow }, "Secondary"),
      _.Radio({ icon: "token", lightShadow: true, outline: true, color: "dark", value: "dark", model: valOutlineLightShadow }, "Dark"),
      _.Radio({ icon: "token", lightShadow: true, outline: true, color: "light", value: "light", model: valOutlineLightShadow }, "Light"),],
    sample: [
      '_.Radio({ icon: "token", lightShadow: true, outline: true, value:"none", model:valOutlineLightShadow }, "None");',
      '_.Radio({ icon: "token", lightShadow: true, outline: true, color: "success", value:"success", model:valOutlineLightShadow }, "Success");',
      '_.Radio({ icon: "token", lightShadow: true, outline: true, color: "warning", value:"warning", model:valOutlineLightShadow }, "Warning");',
      '_.Radio({ icon: "token", lightShadow: true, outline: true, color: "danger", value:"danger", model:valOutlineLightShadow }, "Danger");',
      '_.Radio({ icon: "token", lightShadow: true, outline: true, color: "info", value:"info", model:valOutlineLightShadow }, "Info");',
      '_.Radio({ icon: "token", lightShadow: true, outline: true, color: "primary", value:"primary", model:valOutlineLightShadow }, "Primary");',
      '_.Radio({ icon: "token", lightShadow: true, outline: true, color: "secondary", value:"secondary", model:valOutlineLightShadow }, "Secondary");',
      '_.Radio({ icon: "token", lightShadow: true, outline: true, color: "dark", value:"dark", model:valOutlineLightShadow }, "Dark");',
      '_.Radio({ icon: "token", lightShadow: true, outline: true, color: "light", value:"light", model:valOutlineLightShadow }, "Light");',
    ]
  },
  textGradient: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valTextGradient)),
      _.Radio({ icon: "token", textGradient: true, value: "none", model: valTextGradient }, "None"),
      _.Radio({ icon: "token", textGradient: true, color: "success", value: "success", model: valTextGradient }, "Success"),
      _.Radio({ icon: "token", textGradient: true, color: "warning", value: "warning", model: valTextGradient }, "Warning"),
      _.Radio({ icon: "token", textGradient: true, color: "danger", value: "danger", model: valTextGradient }, "Danger"),
      _.Radio({ icon: "token", textGradient: true, color: "info", value: "info", model: valTextGradient }, "Info"),
      _.Radio({ icon: "token", textGradient: true, color: "primary", value: "primary", model: valTextGradient }, "Primary"),
      _.Radio({ icon: "token", textGradient: true, color: "secondary", value: "secondary", model: valTextGradient }, "Secondary"),
      _.Radio({ icon: "token", textGradient: true, color: "dark", value: "dark", model: valTextGradient }, "Dark"),
      _.Radio({ icon: "token", textGradient: true, color: "light", value: "light", model: valTextGradient }, "Light"),
    ],
    sample: [
      '_.Radio({ icon: "token", textGradient: true, value:"none", model:valTextGradient }, "None");',
      '_.Radio({ icon: "token", textGradient: true, color: "success", value:"success", model:valTextGradient }, "Success");',
      '_.Radio({ icon: "token", textGradient: true, color: "warning", value:"warning", model:valTextGradient }, "Warning");',
      '_.Radio({ icon: "token", textGradient: true, color: "danger", value:"danger", model:valTextGradient }, "Danger");',
      '_.Radio({ icon: "token", textGradient: true, color: "info", value:"info", model:valTextGradient }, "Info");',
      '_.Radio({ icon: "token", textGradient: true, color: "primary", value:"primary", model:valTextGradient }, "Primary");',
      '_.Radio({ icon: "token", textGradient: true, color: "secondary", value:"secondary", model:valTextGradient }, "Secondary");',
      '_.Radio({ icon: "token", textGradient: true, color: "dark", value:"dark", model:valTextGradient }, "Dark");',
      '_.Radio({ icon: "token", textGradient: true, color: "light", value:"light", model:valTextGradient }, "Light");',
    ]
  },
  outlineTextGradient: {
    code: [
      _.div({ class: 'cms-m-b-md' }, _.b("Valore: "), _.span(valOutlineTextGradient)),
      _.Radio({ icon: "token", textGradient: true, outline: true, value: "none", model: valOutlineTextGradient }, "None"),
      _.Radio({ icon: "token", textGradient: true, outline: true, color: "success", value: "success", model: valOutlineTextGradient }, "Success"),
      _.Radio({ icon: "token", textGradient: true, outline: true, color: "warning", value: "warning", model: valOutlineTextGradient }, "Warning"),
      _.Radio({ icon: "token", textGradient: true, outline: true, color: "danger", value: "danger", model: valOutlineTextGradient }, "Danger"),
      _.Radio({ icon: "token", textGradient: true, outline: true, color: "info", value: "info", model: valOutlineTextGradient }, "Info"),
      _.Radio({ icon: "token", textGradient: true, outline: true, color: "primary", value: "primary", model: valOutlineTextGradient }, "Primary"),
      _.Radio({ icon: "token", textGradient: true, outline: true, color: "secondary", value: "secondary", model: valOutlineTextGradient }, "Secondary"),
      _.Radio({ icon: "token", textGradient: true, outline: true, color: "dark", value: "dark", model: valOutlineTextGradient }, "Dark"),
      _.Radio({ icon: "token", textGradient: true, outline: true, color: "light", value: "light", model: valOutlineTextGradient }, "Light"),
    ],
    sample: [
      '_.Radio({ icon: "token", textGradient: true, outline: true, value:"none", model:valOutlineTextGradient }, "None");',
      '_.Radio({ icon: "token", textGradient: true, outline: true, color: "success", value:"success", model:valOutlineTextGradient }, "Success");',
      '_.Radio({ icon: "token", textGradient: true, outline: true, color: "warning", value:"warning", model:valOutlineTextGradient }, "Warning");',
      '_.Radio({ icon: "token", textGradient: true, outline: true, color: "danger", value:"danger", model:valOutlineTextGradient }, "Danger");',
      '_.Radio({ icon: "token", textGradient: true, outline: true, color: "info", value:"info", model:valOutlineTextGradient }, "Info");',
      '_.Radio({ icon: "token", textGradient: true, outline: true, color: "primary", value:"primary", model:valOutlineTextGradient }, "Primary");',
      '_.Radio({ icon: "token", textGradient: true, outline: true, color: "secondary", value:"secondary", model:valOutlineTextGradient }, "Secondary");',
      '_.Radio({ icon: "token", textGradient: true, outline: true, color: "dark", value:"dark", model:valOutlineTextGradient }, "Dark");',
      '_.Radio({ icon: "token", textGradient: true, outline: true, color: "light", value:"light", model:valOutlineTextGradient }, "Light");',
    ]
  }
};
const radio = _.div({ class: "cms-panel cms-page" },
  _.h1("Radio"),
  _.p("Radio button con label, value e supporto model. Gestisce onChange/onInput e classi dense."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Documentazione API"),
  _.docTable("Radio"),
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

export { radio };
