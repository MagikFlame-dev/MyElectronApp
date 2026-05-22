<script setup lang="ts">
import AppLayoutContent from './App.Layout.Content.vue';
import AppLayoutFooter from './App.Layout.Footer.vue';
import AppLayoutTitlebar from './App.Layout.Titlebar.vue';
import AppLayoutToolbar from './App.Layout.Toolbar.vue';
</script>

<template>
    <div class="app-layout">
        <header class="app-layout-header">
            <AppLayoutTitlebar></AppLayoutTitlebar>
        </header>
        <aside class="app-layout-side-toolbar">
            <AppLayoutToolbar></AppLayoutToolbar>
        </aside>
        <main class="app-layout-panels">
            <AppLayoutContent></AppLayoutContent>
        </main>
        <footer class="app-layout-footer">
            <AppLayoutFooter></AppLayoutFooter>
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
        'h h'
        't c'
        'f f';
    grid-template-columns:
        min-content
        auto;
    grid-template-rows:
        min-content
        auto
        min-content;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.app-layout > * {
    position: relative;
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
.app-layout-side-toolbar {
    grid-area: t;
    border-right-width: 1px;
}
.app-layout-panels {
    grid-area: c;
}
.app-layout-footer {
    border-top-width: 1px;
    grid-area: f;
    overflow: hidden;
    font-size: small;
}
</style>