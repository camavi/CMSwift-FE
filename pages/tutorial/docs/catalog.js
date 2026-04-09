import appShellDoc from "./app-shell.doc.js";
import alertDoc from "./alert.doc.js";
import avatarDoc from "./avatar.doc.js";
import badgeDoc from "./badge.doc.js";
import bannerDoc from "./banner.doc.js";
import breadcrumbsDoc from "./breadcrumbs.doc.js";
import btnDoc from "./btn.doc.js";
import cardBodyDoc from "./card-body.doc.js";
import cardFooterDoc from "./card-footer.doc.js";
import cardHeaderDoc from "./card-header.doc.js";
import cardDoc from "./card.doc.js";
import checkboxDoc from "./checkbox.doc.js";
import chipDoc from "./chip.doc.js";
import colDoc from "./col.doc.js";
import containerDoc from "./container.doc.js";
import contextMenuDoc from "./context-menu.doc.js";
import dateDoc from "./date.doc.js";
import dialogDoc from "./dialog.doc.js";
import drawerDoc from "./drawer.doc.js";
import emptyStateDoc from "./empty-state.doc.js";
import footerDoc from "./footer.doc.js";
import formFieldDoc from "./form-field.doc.js";
import formDoc from "./form.doc.js";
import gridColDoc from "./grid-col.doc.js";
import gridDoc from "./grid.doc.js";
import headerDoc from "./header.doc.js";
import iconDoc from "./icon.doc.js";
import inputRawDoc from "./input-raw.doc.js";
import inputDoc from "./input.doc.js";
import itemDoc from "./item.doc.js";
import layoutDoc from "./layout.doc.js";
import listDoc from "./list.doc.js";
import loadingBarDoc from "./loading-bar.doc.js";
import menuDoc from "./menu.doc.js";
import notifyDoc from "./notify.doc.js";
import kpiDoc from "./kpi.doc.js";
import pageDoc from "./page.doc.js";
import paginationDoc from "./pagination.doc.js";
import parallaxDoc from "./parallax.doc.js";
import popoverDoc from "./popover.doc.js";
import progressDoc from "./progress.doc.js";
import radioDoc from "./radio.doc.js";
import ratingDoc from "./rating.doc.js";
import routeTabDoc from "./route-tab.doc.js";
import rowDoc from "./row.doc.js";
import selectDoc from "./select.doc.js";
import separatorDoc from "./separator.doc.js";
import sliderDoc from "./slider.doc.js";
import spacerDoc from "./spacer.doc.js";
import spinnerDoc from "./spinner.doc.js";
import statDoc from "./stat.doc.js";
import tableDoc from "./table.doc.js";
import tabsDoc from "./tabs.doc.js";
import tapPanelDoc from "./tap-panel.doc.js";
import timeDoc from "./time.doc.js";
import toggleDoc from "./toggle.doc.js";
import toolbarDoc from "./toolbar.doc.js";
import tooltipDoc from "./tooltip.doc.js";

const componentDocs = {
  "AppShell": appShellDoc,
  "Alert": alertDoc,
  "Avatar": avatarDoc,
  "Badge": badgeDoc,
  "Banner": bannerDoc,
  "Breadcrumbs": breadcrumbsDoc,
  "Btn": btnDoc,
  "cardBody": cardBodyDoc,
  "cardFooter": cardFooterDoc,
  "cardHeader": cardHeaderDoc,
  "Card": cardDoc,
  "Checkbox": checkboxDoc,
  "Chip": chipDoc,
  "Col": colDoc,
  "Container": containerDoc,
  "ContextMenu": contextMenuDoc,
  "Date": dateDoc,
  "Dialog": dialogDoc,
  "Drawer": drawerDoc,
  "EmptyState": emptyStateDoc,
  "Footer": footerDoc,
  "FormField": formFieldDoc,
  "Form": formDoc,
  "GridCol": gridColDoc,
  "Grid": gridDoc,
  "Header": headerDoc,
  "Icon": iconDoc,
  "InputRaw": inputRawDoc,
  "Input": inputDoc,
  "Item": itemDoc,
  "Layout": layoutDoc,
  "List": listDoc,
  "LoadingBar": loadingBarDoc,
  "Menu": menuDoc,
  "Notify": notifyDoc,
  "Kpi": kpiDoc,
  "Page": pageDoc,
  "Pagination": paginationDoc,
  "Parallax": parallaxDoc,
  "Popover": popoverDoc,
  "Progress": progressDoc,
  "Radio": radioDoc,
  "Rating": ratingDoc,
  "RouteTab": routeTabDoc,
  "Row": rowDoc,
  "Select": selectDoc,
  "Separator": separatorDoc,
  "Slider": sliderDoc,
  "Spacer": spacerDoc,
  "Spinner": spinnerDoc,
  "Stat": statDoc,
  "Table": tableDoc,
  "Tabs": tabsDoc,
  "TabPanel": tapPanelDoc,
  "Time": timeDoc,
  "Toggle": toggleDoc,
  "Toolbar": toolbarDoc,
  "Tooltip": tooltipDoc
};

const getComponentDoc = (name) => name ? (componentDocs[name] || null) : null;

export { componentDocs, getComponentDoc };
