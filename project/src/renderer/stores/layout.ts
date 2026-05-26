import { AppLayoutPanel, AppLayoutSplit, AppLayoutTabs, AppLayoutTree } from "@renderer/scripts/layout.js"
import { defineStore } from "pinia"
import { reactive } from "vue"

// #region app-layout
const useAppLayoutStore = defineStore('app-layout', () => {
    const layout = reactive(new AppLayoutTree(
        new AppLayoutSplit(
            'row',
            new AppLayoutPanel('explorer', {}),
            new AppLayoutSplit('column', 
                new AppLayoutTabs(),
                new AppLayoutPanel('terminal', {})
            )
        ),
    )) 
    return { layout }
})

export default useAppLayoutStore
// #endregion