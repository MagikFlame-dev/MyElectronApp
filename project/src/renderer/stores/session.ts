import { defineStore } from "pinia"
import { computed, reactive, ref } from "vue"

export type ShortCut = {
    name: string,
    keys: string[],
}

const useAppSessionStore = defineStore('app-session', () => {
    const _version = reactive({
        major: 0,
        minor: 0,
        patch: 0,
    })

    const title = ref('MyApp')
    const version = computed(() => `v:${_version.major}.${_version.minor}.${_version.patch}`)
    const shortCuts = ref<ShortCut[]>([])

    return { title, version, shortCuts }
})

export default useAppSessionStore
// #endregion