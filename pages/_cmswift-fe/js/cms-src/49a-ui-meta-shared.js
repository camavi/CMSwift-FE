  // ===============================
  // UI meta shared helpers
  // ===============================
  CMSwift._uiMetaShared = (() => {
    function resolveDocComponents(_) {
      return {
        hasTabPanel: typeof _.TabPanel === "function",
        Card: typeof _.Card === "function"
          ? _.Card
          : (...children) => _.div({ class: "cms-doc-card" }, ...children),
        Chip: typeof _.Chip === "function"
          ? _.Chip
          : (_props, label) => _.span({ class: "cms-chip cms-chip-fallback" }, label)
      };
    }

    function formatMetaValues(values) {
      if (!values) return "—";
      if (Array.isArray(values)) return values.join(" | ");
      return String(values);
    }

    function renderMetaItem(_, item, Chip) {
      return _.div({ class: "cms-p-md" },
        _.p(
          _.h3("Name: " + item.name),
          _.div(_.b("Type: "), item.type ? String(item.type).split("|").map((token) => Chip({ color: "secondary", dense: true }, token)) : "—")
        ),
        _.p(_.b("Default: "), _.span(item.default == null ? "—" : String(item.default))),
        _.p(
          _.h3("Values: "),
          _.div({ class: "cms-p-l-md" }, _.span(formatMetaValues(item.values)))
        ),
        _.p(
          _.h3("Description: "),
          _.div({ class: "cms-p-l-md" }, item.description || "—")
        )
      );
    }

    function renderTabGroupFallback(_, rows) {
      return _.div({ class: "cms-p-md" },
        rows.map((row) => _.div({ class: "cms-m-b-lg" }, _.h4(row.label || row.name), row.content))
      );
    }

    function normalizeEventRows(_, events) {
      if (!events) return [];
      if (Array.isArray(events)) {
        return events.map((eventItem) => ({
          name: eventItem.name,
          wrap: true,
          label: eventItem.name,
          content: _.div({ class: "cms-p-md" }, eventItem.description)
        }));
      }
      return Object.entries(events).map(([key, value]) => ({
        name: key,
        wrap: true,
        label: key,
        content: _.div({ class: "cms-p-md" }, value)
      }));
    }

    function normalizeSlotRows(_, slots) {
      if (!slots) return [];
      if (Array.isArray(slots)) {
        return slots.map((slot) => ({
          name: slot.name,
          wrap: true,
          label: slot.type,
          content: slot.description
        }));
      }
      return Object.entries(slots).map(([key, value]) => ({
        name: key,
        wrap: true,
        label: key,
        content: _.div({ class: "cms-p-md" },
          _.div(
            _.h3("Name: " + key),
            _.div({ class: "cms-p-l-md" }, value.type || "—")
          ),
          _.div(
            _.h3("Description:"),
            _.div({ class: "cms-p-l-md" }, value.description || "—")
          )
        )
      }));
    }

    return {
      resolveDocComponents,
      renderMetaItem,
      renderTabGroupFallback,
      normalizeEventRows,
      normalizeSlotRows
    };
  })();
