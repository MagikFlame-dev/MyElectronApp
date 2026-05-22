<script setup lang="ts">
import useAppSessionStore from '@renderer/stores/session.js';

const appSession = useAppSessionStore()
</script>

<template>
    <span class="titlebar-panel-container">
        <span class="titlebar-panel start">
            {{ appSession.title }}
        </span>
        <span class="titlebar-panel center">
            
        </span>
        <span class="titlebar-panel end">
            
        </span>
    </span>
</template>

<style lang="less" scoped>
.titlebar-panel-container {
    --end-right-padding: calc(100% - env(titlebar-area-width, 100%));
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: env(titlebar-area-height, 40px);
}
.titlebar-panel {
    flex-basis: 50%;
    display: flex;
    align-content: stretch;
    &.start {
        justify-content: start;
        padding-inline-start: 0.25em; 
    }
    &.center {
        justify-content: center;
    }
    &.end {
        justify-content: end;
        padding-inline-end: var(--end-right-padding);
    }
}

</style>