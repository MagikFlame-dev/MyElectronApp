import ErrorPanel from "@renderer/components/AppPanels/ErrorPanel.vue"
import ExplorerPanel from "@renderer/components/AppPanels/ExplorerPanel.vue"
import RouterOutletPanel from "@renderer/components/AppPanels/RouterOutlet.panel.vue"
import TerminalPanel from "@renderer/components/AppPanels/TerminalPanel.vue"
import { Registry } from "@renderer/scripts/registry.js"
import { reactive } from "vue"

const panelRegistry = reactive(Registry.create(
    ['router-outlet', RouterOutletPanel],
    ['error', ErrorPanel],
    ['explorer', ExplorerPanel],
    ['terminal', TerminalPanel],
))

export const usePanelRegistry = () => panelRegistry
