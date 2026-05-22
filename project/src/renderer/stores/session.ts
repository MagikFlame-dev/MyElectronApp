import { defineStore } from "pinia"
import { reactive, ref } from "vue"

const useAppSessionStore = defineStore('app-session', () => {
    const title = ref('MyApp')
    const version = reactive({
        major: 0,
        minor: 0,
        patch: 0,
        toString: () => { return `v:${version.major}.${version.minor}.${version.patch}`}
    })

    return { title, version }
})

export default useAppSessionStore
// #endregion