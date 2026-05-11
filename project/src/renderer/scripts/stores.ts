import { createPinia, defineStore } from 'pinia';
import { reactive, ref } from 'vue'

export const pinia = createPinia()

interface IAppLayoutPanel {
    area?: string
    panels?: (AppLayoutPanel | string)[]
    visible?: boolean
    resizable?: boolean
    direction?: 'row' | 'column'
    behavior?: 'grow' | 'shrink'
}
export class AppLayoutPanel implements IAppLayoutPanel {
    readonly id: string
    readonly parent?: AppLayoutPanel
    readonly root: boolean

    area?: string
    panels?: (AppLayoutPanel | string)[]
    visible?: boolean
    resizable?: boolean
    direction?: 'row' | 'column'
    behavior?: 'grow' | 'shrink'

    constructor(options?: IAppLayoutPanel, fromParent?: AppLayoutPanel) {
        this.parent = fromParent
        this.id = fromParent ? `${fromParent.id}.${fromParent.panels?.length}` : '0'
        this.root = !fromParent

        this.area = options?.area ?? 'default';
        this.panels = options?.panels ?? [];
        this.visible = options?.visible ?? true;
        this.resizable = options?.resizable ?? true;
    }
}

export const useAppSettingsStore = defineStore('app-settings', () => {
    const title = ref('MyApp')
    const layout = reactive<AppLayoutPanel>(new AppLayoutPanel({}, undefined))

    return { title, layout }
})