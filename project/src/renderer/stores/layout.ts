import { AppLayoutPanel, AppLayoutTree } from "@renderer/scripts/layout.js"
import { defineStore } from "pinia"
import { reactive } from "vue"

// #region app-layout
const useAppLayoutStore = defineStore('app-layout', () => {
    const layout = reactive(new AppLayoutTree(
        new AppLayoutPanel('router-outlet', {})
    )) 
    return { layout }
})

export default useAppLayoutStore
// #endregion