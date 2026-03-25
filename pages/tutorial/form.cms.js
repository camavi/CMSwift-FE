const roleOptions = [
  { label: "Creator", value: "creator" },
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" }
];

const planOptions = [
  { label: "Starter", value: "starter" },
  { label: "Pro", value: "pro" },
  { label: "Scale", value: "scale" }
];

const useCaseOptions = [
  { label: "Landing page", value: "landing" },
  { label: "Dashboard admin", value: "dashboard" },
  { label: "Portale docs", value: "docs" }
];

const favoriteOptions = [
  { label: "Form", value: "form" },
  { label: "Card", value: "card" },
  { label: "Chip", value: "chip" },
  { label: "Badge", value: "badge" }
];

const chipRow = (...children) => _.div({
  style: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "16px"
  }
}, ...children);

const formError = (form) => _.div({ class: "cms-error" }, () => form.submitError.value || "");
const fieldError = (field) => _.div({ class: "cms-error" }, () => field.error() || "");

const formActions = (label, onReset, form) => _.Toolbar(
  { justify: "space-between" },
  _.Btn({ onClick: onReset, type: "button" }, "Reset"),
  _.Btn(
    {
      color: "primary",
      type: "submit",
      loading: form.submitting.value
    },
    label
  )
);

const bindInput = (field, props = {}) => _.Input({
  model: field.model,
  error: () => field.error(),
  hint: field.hint,
  onInput: field.onInput,
  onBlur: field.onBlur,
  clearable: true,
  ...props
});

const registerForm = CMSwift.useForm({
  model: _.rod({
    name: "",
    email: "",
    password: "",
    role: "",
    newsletter: true,
    terms: false
  }),
  validateOn: "blur",
  rules: {
    name: [(v) => !!v || "Inserisci il nome del creator"],
    email: [(v) => (!!v && String(v).includes("@")) || "Email non valida"],
    password: [(v) => (!!v && String(v).length >= 8) || "Minimo 8 caratteri"],
    role: [(v) => !!v || "Seleziona un ruolo"],
    terms: [(v) => !!v || "Devi accettare i termini"]
  }
});

const fRegisterName = registerForm.field("name", { hint: "Nome visibile nella workspace CMSwift" });
const fRegisterEmail = registerForm.field("email", { hint: "Usa una mail reale per gli inviti" });
const fRegisterPassword = registerForm.field("password", { hint: "Almeno 8 caratteri" });
const fRegisterRole = registerForm.field("role");
const fRegisterNewsletter = registerForm.field("newsletter");
const fRegisterTerms = registerForm.field("terms");
fRegisterNewsletter.value = true;

const resetRegisterForm = () => {
  registerForm.reset();
  fRegisterName.value = "";
  fRegisterEmail.value = "";
  fRegisterPassword.value = "";
  fRegisterRole.value = "";
  fRegisterNewsletter.value = true;
  fRegisterTerms.value = false;
};

const registerSample = [
  "const registerForm = CMSwift.useForm({",
  "  model: _.rod({ name: '', email: '', password: '', role: '', newsletter: true, terms: false }),",
  "  validateOn: 'blur',",
  "  rules: {",
  "    name: [(v) => !!v || 'Inserisci il nome del creator'],",
  "    email: [(v) => (!!v && String(v).includes('@')) || 'Email non valida'],",
  "    password: [(v) => (!!v && String(v).length >= 8) || 'Minimo 8 caratteri'],",
  "    role: [(v) => !!v || 'Seleziona un ruolo'],",
  "    terms: [(v) => !!v || 'Devi accettare i termini']",
  "  }",
  "});",
  "_.Form({ form: registerForm, onSubmit: async (model) => console.log('REGISTER', model) }, () => [",
  "  _.Card(",
  "    _.cardHeader(...),",
  "    _.cardBody(",
  "      _.Input({ label: 'Nome creator', model: fRegisterName.model }),",
  "      _.Input({ label: 'Email', model: fRegisterEmail.model }),",
  "      _.Input({ type: 'password', label: 'Password', model: fRegisterPassword.model }),",
  "      _.Select({ label: 'Ruolo', model: fRegisterRole.model, options: roleOptions }),",
  "      _.Checkbox({ model: fRegisterNewsletter.model }, 'Release notes CMSwift'),",
  "      _.Checkbox({ model: fRegisterTerms.model }, 'Accetto termini e privacy')",
  "    ),",
  "    _.cardFooter(formActions('Crea account', resetRegisterForm, registerForm))",
  "  )",
  "]);"
];

const onboardingForm = CMSwift.useForm({
  model: _.rod({
    studio: "",
    stack: "",
    team: "solo",
    plan: "pro",
    automations: true,
    designReview: true,
    analytics: false
  }),
  validateOn: "blur",
  rules: {
    studio: [(v) => !!v || "Inserisci il nome dello studio"],
    stack: [(v) => !!v || "Descrivi rapidamente lo stack"],
    team: [(v) => !!v || "Seleziona il setup del team"],
    plan: [(v) => !!v || "Seleziona un piano"]
  }
});

const fStudio = onboardingForm.field("studio", { hint: "Es. CMSwift Atelier" });
const fStack = onboardingForm.field("stack", { hint: "Es. CMSwift UI, API e automazioni" });
const fTeam = onboardingForm.field("team");
const fPlan = onboardingForm.field("plan");
const fAutomations = onboardingForm.field("automations");
const fDesignReview = onboardingForm.field("designReview");
const fAnalytics = onboardingForm.field("analytics");
fTeam.value = "solo";
fPlan.value = "pro";
fAutomations.value = true;
fDesignReview.value = true;

const resetOnboardingForm = () => {
  onboardingForm.reset();
  fStudio.value = "";
  fStack.value = "";
  fTeam.value = "solo";
  fPlan.value = "pro";
  fAutomations.value = true;
  fDesignReview.value = true;
  fAnalytics.value = false;
};

const onboardingSample = [
  "const onboardingForm = CMSwift.useForm({",
  "  model: _.rod({ studio: '', stack: '', team: 'solo', plan: 'pro', automations: true, designReview: true, analytics: false }),",
  "  validateOn: 'blur',",
  "  rules: {",
  "    studio: [(v) => !!v || 'Inserisci il nome dello studio'],",
  "    stack: [(v) => !!v || 'Descrivi rapidamente lo stack'],",
  "    team: [(v) => !!v || 'Seleziona il setup del team'],",
  "    plan: [(v) => !!v || 'Seleziona un piano']",
  "  }",
  "});",
  "_.Form({ form: onboardingForm, onSubmit: async (model) => console.log('ONBOARDING', model) }, () => [",
  "  _.Card(",
  "    _.cardHeader(...Avatar, Badge, Chip...),",
  "    _.cardBody(",
  "      _.Input({ label: 'Studio name', model: fStudio.model }),",
  "      _.Input({ label: 'Stack creativo', model: fStack.model }),",
  "      _.Radio({ value: 'solo', model: fTeam.model }, 'Solo maker'),",
  "      _.Radio({ value: 'squad', model: fTeam.model }, 'Small squad'),",
  "      _.Radio({ value: 'agency', model: fTeam.model }, 'Agency mode'),",
  "      _.Select({ label: 'Piano', model: fPlan.model, options: planOptions }),",
  "      _.Toggle({ model: fAutomations.model }, 'Attiva automazioni'),",
  "      _.Checkbox({ model: fDesignReview.model }, 'Design review'),",
  "      _.Checkbox({ model: fAnalytics.model }, 'Product analytics')",
  "    ),",
  "    _.cardFooter(formActions('Lancia workspace', resetOnboardingForm, onboardingForm))",
  "  )",
  "]);"
];

const feedbackForm = CMSwift.useForm({
  model: _.rod({
    useCase: "",
    favorite: "",
    score: 4,
    recommend: true,
    followup: true,
    notes: ""
  }),
  validateOn: "blur",
  rules: {
    useCase: [(v) => !!v || "Seleziona un contesto"],
    favorite: [(v) => !!v || "Seleziona il componente preferito"],
    score: [(v) => Number(v || 0) > 0 || "Aggiungi una valutazione"]
  }
});

const fUseCase = feedbackForm.field("useCase");
const fFavorite = feedbackForm.field("favorite");
const fScore = feedbackForm.field("score");
const fRecommend = feedbackForm.field("recommend");
const fFollowup = feedbackForm.field("followup");
const fNotes = feedbackForm.field("notes", { hint: "Una nota breve ma concreta" });
fScore.value = 4;
fRecommend.value = true;
fFollowup.value = true;

const resetFeedbackForm = () => {
  feedbackForm.reset();
  fUseCase.value = "";
  fFavorite.value = "";
  fScore.value = 4;
  fRecommend.value = true;
  fFollowup.value = true;
  fNotes.value = "";
};

const feedbackSample = [
  "const feedbackForm = CMSwift.useForm({",
  "  model: _.rod({ useCase: '', favorite: '', score: 4, recommend: true, followup: true, notes: '' }),",
  "  validateOn: 'blur',",
  "  rules: {",
  "    useCase: [(v) => !!v || 'Seleziona un contesto'],",
  "    favorite: [(v) => !!v || 'Seleziona il componente preferito'],",
  "    score: [(v) => Number(v || 0) > 0 || 'Aggiungi una valutazione']",
  "  }",
  "});",
  "_.Form({ form: feedbackForm, onSubmit: async (model) => console.log('FEEDBACK', model) }, () => [",
  "  _.Card(",
  "    _.cardHeader(...Badge e Chip...),",
  "    _.cardBody(",
  "      _.Select({ label: 'Use case', model: fUseCase.model, options: useCaseOptions }),",
  "      _.Select({ label: 'Componente preferito', model: fFavorite.model, options: favoriteOptions }),",
  "      _.Rating({ model: fScore.model, max: 5 }),",
  "      _.Toggle({ model: fRecommend.model }, 'Lo consiglierei ad altri team'),",
  "      _.Checkbox({ model: fFollowup.model }, 'Voglio essere ricontattato'),",
  "      _.Input({ label: 'Nota finale', model: fNotes.model })",
  "    ),",
  "    _.cardFooter(formActions('Invia feedback', resetFeedbackForm, feedbackForm))",
  "  )",
  "]);"
];

const listSample = {
  registration: {
    code: _.Form(
      { form: registerForm, onSubmit: async (model) => console.log("REGISTER", model) },
      () => [
        _.Card(
          _.cardHeader(
            _.Toolbar(
              { justify: "space-between" },
              _.div(
                _.h3("Registrazione Creator"),
                _.p("Un form reale con validazione, stato submit e micro-componenti CMSwift."),
                _.Badge({ label: "CMSwift", notification: 3, topRight: "rocket_launch" })
              ),
            )
          ),
          _.cardBody(
            chipRow(
              _.Chip({ icon: "bolt" }, "Launch fast"),
              _.Chip({ icon: "palette" }, "Design system"),
              _.Chip({ icon: "code" }, "Reactive UI")
            ),
            bindInput(fRegisterName, { label: "Nome creator", icon: "person" }),
            bindInput(fRegisterEmail, { label: "Email", type: "email", icon: "mail" }),
            bindInput(fRegisterPassword, { label: "Password", type: "password", icon: "lock" }),
            _.Select({
              label: "Ruolo iniziale",
              model: fRegisterRole.model,
              error: fRegisterRole.error,
              options: roleOptions,
              clearable: true
            }),
            _.Checkbox(
              { model: fRegisterNewsletter.model, icon: "campaign" },
              "Ricevi release notes, pattern e update di prodotto"
            ),
            _.Checkbox(
              { model: fRegisterTerms.model, icon: "verified_user", color: "primary" },
              "Accetto termini, privacy e workspace policy"
            ),
            fieldError(fRegisterTerms),
            formError(registerForm)
          ),
          _.cardFooter(formActions("Crea account", resetRegisterForm, registerForm))
        )
      ]
    ),
    sample: registerSample
  },
  onboarding: {
    code: _.Form(
      { form: onboardingForm, onSubmit: async (model) => console.log("ONBOARDING", model) },
      () => [
        _.Card(
          _.cardHeader(
            _.Toolbar(
              { justify: "space-between" },
              _.div(
                _.Toolbar(
                  { justify: "flex-start" },
                  _.Avatar({ label: "CM", elevated: true }),
                  _.div(
                    _.h3("CMSwift Launch Pad"),
                    _.p("Un onboarding creativo per configurare una workspace pronta a scalare."),
                    _.Badge({ label: "Beta", topLeft: "auto_awesome", notification: 1 })
                  )
                )
              )
            )
          ),
          _.cardBody(
            chipRow(
              _.Chip({ icon: "dataset_linked" }, "API-first"),
              _.Chip({ icon: "dashboard_customize" }, "Composable"),
              _.Chip({ icon: "rocket_launch" }, "Fast setup")
            ),
            bindInput(fStudio, { label: "Studio name", icon: "apartment" }),
            bindInput(fStack, { label: "Stack creativo", icon: "memory" }),
            _.div(
              { class: "cms-m-b-sm" },
              _.b("Setup team"),
              _.div(
                { style: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" } },
                _.Radio({ value: "solo", model: fTeam.model, color: "primary" }, "Solo maker"),
                _.Radio({ value: "squad", model: fTeam.model, color: "info" }, "Small squad"),
                _.Radio({ value: "agency", model: fTeam.model, color: "secondary" }, "Agency mode")
              ),
              fieldError(fTeam)
            ),
            _.Select({
              label: "Piano workspace",
              model: fPlan.model,
              error: fPlan.error,
              options: planOptions
            }),
            _.Toggle({ model: fAutomations.model }, "Attiva automazioni di contenuto"),
            _.Checkbox({ model: fDesignReview.model, icon: "draw" }, "Abilita design review interna"),
            _.Checkbox({ model: fAnalytics.model, icon: "analytics" }, "Abilita analytics di prodotto"),
            formError(onboardingForm)
          ),
          _.cardFooter(formActions("Lancia workspace", resetOnboardingForm, onboardingForm))
        )
      ]
    ),
    sample: onboardingSample
  },
  feedback: {
    code: _.Form(
      { form: feedbackForm, onSubmit: async (model) => console.log("FEEDBACK", model) },
      () => [
        _.Card(
          _.cardHeader(
            _.Toolbar(
              { justify: "space-between" },
              _.div(
                _.h3("Pulse Check"),
                _.p("Feedback rapido ma ricco: rating, preferenze e follow-up in un unico form."),
                _.Badge({ label: "Live", topRight: "favorite", notification: 5 })
              )
            )
          ),
          _.cardBody(
            chipRow(
              _.Chip({ icon: "forum" }, "Community"),
              _.Chip({ icon: "tips_and_updates" }, "Ideas"),
              _.Chip({ icon: "favorite" }, "UX signal")
            ),
            _.Select({
              label: "Use case principale",
              model: fUseCase.model,
              error: fUseCase.error,
              options: useCaseOptions,
              clearable: true
            }),
            _.Select({
              label: "Componente preferito",
              model: fFavorite.model,
              error: fFavorite.error,
              options: favoriteOptions,
              clearable: true
            }),
            _.div(
              { class: "cms-m-b-sm" },
              _.b("Valutazione esperienza"),
              _.div({ style: { marginTop: "8px" } }, _.Rating({ model: fScore.model, max: 5 })),
              fieldError(fScore)
            ),
            _.Toggle({ model: fRecommend.model }, "Lo consiglierei ad altri team"),
            _.Checkbox({ model: fFollowup.model, icon: "mail" }, "Voglio essere ricontattato"),
            bindInput(fNotes, { label: "Nota finale", icon: "edit" }),
            formError(feedbackForm)
          ),
          _.cardFooter(formActions("Invia feedback", resetFeedbackForm, feedbackForm))
        )
      ]
    ),
    sample: feedbackSample
  }
};

const form = _.div({ class: "cms-panel cms-page" },
  _.h1("Form"),
  _.p("Form wrapper integrato con `useForm`: gestisce submit async, validazione e stato `submitting`. I children possono essere funzioni che ricevono l'istanza del form."),
  _.h2("Props principali"),
  _.List(
    _.Item("form: istanza restituita da `CMSwift.useForm()`"),
    _.Item("onSubmit: handler async con `(model, form)`"),
    _.Item("class, style e children function per costruire layout avanzati")
  ),
  _.h2("Documentazione API"),
  _.docTable("Form"),
  _.h2("Esempi completi"),
  _.Card({ header: "Demo" },
    boxCode("Registrazione creator", listSample.registration),
    boxCode("Onboarding CMSwift", listSample.onboarding),
    boxCode("Feedback form", listSample.feedback)
  )
);

export { form };
