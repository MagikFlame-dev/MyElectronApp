import RouterOutletPanel from "@renderer/components/AppPanels/RouterOutlet.panel.vue"
import { Registry } from "@renderer/scripts/registry.js"
import { reactive } from "vue"

const layoutComponents = reactive(Registry.create(
    ['router-outlet', RouterOutletPanel]
))

export default layoutComponents