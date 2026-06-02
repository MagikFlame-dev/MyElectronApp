<script setup lang="ts">
import { ref } from 'vue';

const outerText = ref<string>('')
defineModel<string>('text', {
    default: '',
    get: (): string => innerHTML.value,
    set: (val: string) => innerHTML.value = val
})

const innerHTML = ref<string>('')
function onInput($event: InputEvent) {
    const target = $event.target as HTMLDivElement
    innerHTML.value = target.innerHTML
    outerText.value = target.innerText
}

</script>

<template>
    <div class="parser-test-workspace">

        <div
            class="input"
            contenteditable
            @input="onInput">
        </div>
        <pre class="outlet" v-text="outerText"></pre>
    </div>
</template>

<style lang="less" scoped>
.parser-test-workspace {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    .outlet,
    .input {
        counter-reset: line;
        flex-basis: 50%;
        outline: none;
        background-color: color-mix(in srgb, transparent, black 75%,);
        color: inherit;
        border: 1px solid var(--border-color);
        margin: 0px;
        text-indent: 0px;
    }
}
</style>