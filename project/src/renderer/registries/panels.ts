import RouterOutletPanel from "@renderer/components/AppPanels/RouterOutlet.panel.vue"
import { Registry } from "@renderer/scripts/registry.js"
import { reactive } from "vue"

const panelRegistry = reactive(Registry.create(
    ['router-outlet', RouterOutletPanel],
))

export const usePanelRegistry = () => panelRegistry
