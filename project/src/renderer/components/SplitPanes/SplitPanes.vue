<script setup lang="ts">
import { AppLayoutPanel } from '@renderer/scripts/stores.js';

const props = defineProps<{
    layout: AppLayoutPanel
}>()
</script>

<template>
    <span class="footer-panel-container">
        <template v-for="panel in layout.panels">
            {{ panel }}
        </template>
        <slot name="panel"></slot>
    </span>
</template>

<style lang="less" scoped>
.footer-panel-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: small;
    min-height: 1rem;
}
.footer-panel {
    flex-basis: 50%;
    display: flex;
    align-content: stretch;
    &.start {
        justify-content: start;
        padding-inline-start: 0.25em; 
    }
    &.end {
        justify-content: end;
        padding-inline-end: 0.25em;
    }
}

</style>