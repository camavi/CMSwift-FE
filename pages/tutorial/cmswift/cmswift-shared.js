const cmswiftSections = [
  {
    key: "intro",
    label: "Introduction",
    route: "/demo/component/cmswift-tutorial",
    tone: "primary",
  },
  {
    key: "architecture",
    label: "Architecture",
    route: "/demo/component/cmswift-architecture",
    tone: "secondary",
  },
  {
    key: "renderer",
    label: "Renderer",
    route: "/demo/component/cmswift-renderer",
    tone: "info",
  },
  {
    key: "reactive",
    label: "Reactive Core",
    route: "/demo/component/cmswift-reactive",
    tone: "warning",
  },
  {
    key: "rod",
    label: "Rod Binding",
    route: "/demo/component/cmswift-rod",
    tone: "success",
  },
  {
    key: "components",
    label: "Components",
    route: "/demo/component/cmswift-components",
    tone: "secondary",
  },
  {
    key: "ui",
    label: "UI Composition",
    route: "/demo/component/cmswift-ui",
    tone: "primary",
  },
  {
    key: "platform",
    label: "Platform",
    route: "/demo/component/cmswift-platform-overview",
    tone: "info",
  },
  {
    key: "patterns",
    label: "App Patterns",
    route: "/demo/component/cmswift-patterns",
    tone: "success",
  },
];

const cmswiftDeepDives = {
  html: "/demo/html/html",
  lifecycle: "/demo/component/cms-lifecycle",
  reactive: "/demo/component/cms-reactive",
  rod: "/demo/component/cms-rod",
  renderer: "/demo/component/cms-renderer",
  platform: "/demo/component/cms-platform",
  docs: "/demo/component/docs",
  layout: "/demo/component/layout",
  page: "/demo/component/page",
  drawer: "/demo/component/drawer",
  form: "/demo/component/form",
};

const stack = (...children) =>
  _.div(
    {
      style: {
        display: "grid",
        gap: "12px",
      },
    },
    ...children,
  );

const grid = (...children) =>
  _.div(
    {
      style: {
        display: "grid",
        gap: "16px",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      },
    },
    ...children,
  );

const actions = (...children) =>
  _.div(
    {
      style: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
      },
    },
    ...children,
  );

const codeBlock = (lines) =>
  _.pre(
    {
      style: {
        margin: 0,
        overflowX: "auto",
      },
    },
    _.code({ class: "language-javascript" }, lines.join("\n")),
  );

const metricCard = ({ title, value, note, tone = "primary" }) =>
  _.Card(
    {
      title,
      subtitle: note,
      aside: _.Chip({ color: tone, outline: true, size: "sm" }, tone),
    },
    _.div({ class: "cms-h2" }, value),
  );

const quickLink = (label, route, tone = "primary") =>
  _.Btn(
    {
      size: "sm",
      color: tone,
      outline: true,
      onClick: () => CMSwift.router.navigate(route),
    },
    label,
  );

const getSectionIndex = (key) =>
  cmswiftSections.findIndex((section) => section.key === key);

const getSectionNavigation = (key) => {
  const index = getSectionIndex(key);
  return {
    current: cmswiftSections[index] || cmswiftSections[0],
    previous: index > 0 ? cmswiftSections[index - 1] : null,
    next:
      index >= 0 && index < cmswiftSections.length - 1
        ? cmswiftSections[index + 1]
        : null,
  };
};

const sectionTabs = (currentKey) =>
  _.div(
    { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
    ...cmswiftSections.map((section) =>
      _.Chip(
        {
          clickable: true,
          outline: currentKey !== section.key,
          color: currentKey === section.key ? section.tone : null,
          size: "sm",
          onClick: () => CMSwift.router.navigate(section.route),
        },
        section.label,
      ),
    ),
  );

const pageHero = (currentKey, title, summary, highlights = []) =>
  _.div(
    {
      style: {
        display: "grid",
        gap: "12px",
        marginBottom: "var(--cms-s-lg)",
      },
    },
    sectionTabs(currentKey),
    _.h1(title),
    _.p(summary),
    highlights.length
      ? _.div(
          { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
          ...highlights.map(([tone, label]) =>
            _.Chip({ color: tone, outline: true, size: "sm" }, label),
          ),
        )
      : null,
  );

const sectionNavigationCard = (currentKey) => {
  const { previous, next } = getSectionNavigation(currentKey);
  return _.Card(
    {
      title: "Continua il tutorial",
      subtitle: "Navigazione tra le sezioni CMSwift",
    },
    actions(
      previous
        ? quickLink(`← ${previous.label}`, previous.route, previous.tone)
        : null,
      next ? quickLink(`${next.label} →`, next.route, next.tone) : null,
    ),
  );
};

const deepDiveCard = (title, links) =>
  _.Card(
    {
      title,
      subtitle: "Route demo collegate",
    },
    actions(
      ...links.map((item) => quickLink(item.label, item.route, item.tone || "info")),
    ),
  );

function renderCmswiftTutorialPage(
  currentKey,
  { title, summary, highlights = [], sections = [] },
) {
  return _.div(
    { class: "cms-panel cms-page cmswift-tutorial" },
    pageHero(currentKey, title, summary, highlights),
    ...sections,
    sectionNavigationCard(currentKey),
  );
}

export {
  actions,
  cmswiftDeepDives,
  cmswiftSections,
  codeBlock,
  deepDiveCard,
  grid,
  metricCard,
  quickLink,
  renderCmswiftTutorialPage,
  stack,
};
