<script setup lang="ts">
import AppLayoutContent from './App.Layout.Content.vue';
import AppLayoutFooter from './App.Layout.Footer.vue';
import AppLayoutTitlebar from './App.Layout.Titlebar.vue';
</script>

<template>
    <div class="app-layout">
        <header class="app-layout-header">
            <slot name="title">
                <AppLayoutTitlebar></AppLayoutTitlebar>
            </slot>
        </header>
        <main class="app-layout-panel center">
            <AppLayoutContent></AppLayoutContent>
        </main>
        <footer class="app-layout-footer">
            <slot name="footer">
                <AppLayoutFooter></AppLayoutFooter>
            </slot>
        </footer>
    </div>
</template>

<style lang="less" scoped>
.app-layout {
    width: calc(100vw - 2px);
    height: calc(100vh - 2px);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    display: grid;
    grid-template:
        'h'
        'c'
        'f';
    grid-template-columns:
        auto;
    grid-template-rows:
        min-content
        auto
        min-content;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.app-layout > * {
    position: relative;
    overflow: auto;
    border: 0px solid var(--border-color);
}
[app-drag],
.app-layout-header {
    app-region: drag;
    -webkit-drag-region: drag;
    -webkit-drag-region: drag;
    border-bottom-width: 1px;
    grid-area: h;
    user-select: none;
    -webkit-user-select: none;
    overflow: hidden;
    min-height: 1rem;

    *:is(area, a, button, [role=link], [role=button], input, [app-no-drag]) {
        app-region: no-drag !important;
        -webkit-drag-region: no-drag !important;
    }
}
.app-layout-panel {
    &.center {
        grid-area: c;
    }
}
.app-layout-footer {
    border-top-width: 1px;
    grid-area: f;
    overflow: hidden;
    font-size: small;
}
</style>