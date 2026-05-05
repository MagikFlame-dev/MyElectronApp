<script setup lang="ts">

</script>

<template>
    <div class="app-layout">
        <header class="app-layout-header">
            <slot name="title">Title</slot>
        </header>
        <main class="app-layout-panel center">
            <slot name="panel-center">
                <slot name="default">
                    <div> . . . </div>
                </slot>
            </slot>
        </main>
        <aside class="app-layout-panel top" :class="{hide: true}">
            <slot name="panel-top"></slot>
        </aside>
        <aside class="app-layout-panel left" :class="{hide: true}">
            <slot name="panel-left"></slot>
        </aside>
        <aside class="app-layout-panel right" :class="{hide: true}">
            <slot name="panel-right"></slot>
        </aside>
        <aside class="app-layout-panel bottom" :class="{hide: true}">
            <slot name="panel-bottom"></slot>
        </aside>
        <footer class="app-layout-footer">
            <slot name="footer"></slot>
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
        'h h h'
        'l t r'
        'l c r'
        'l b r'
        'f f f';
    grid-template-columns:
        min-content
        auto
        min-content;
    grid-template-rows:
        min-content
        min-content
        auto
        min-content
        min-content;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.app-layout > * {
    position: relative;
    overflow: auto;
    border: 0px solid var(--border-color);
}
.app-layout-header {
    app-region: drag;
    border-bottom-width: 1px;
    grid-area: h;
    -webkit-drag-region: drag;
    user-select: none;
    -webkit-user-select: none;
    overflow: hidden;
}
.app-layout-panel {
    &.center {
        grid-area: c;
    }
    &.top {
        border-bottom-width: 1px;
        grid-area: t;
    }
    &.bottom {
        border-top-width: 1px;
        grid-area: b;
    }
    &.left {
        border-right-width: 1px;
        grid-area: l;
    }
    &.right {
        border-left-width: 1px;
        grid-area: r;
        &.hide {
            width: 0px;
            border: none;
        }
    }
}
.app-layout-footer {
    border-top-width: 1px;
    grid-area: f;
    overflow: hidden;
    font-size: small;
}
</style>