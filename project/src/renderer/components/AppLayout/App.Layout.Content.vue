<script setup lang="ts">
import useAppLayoutStore from '@renderer/stores/layout.js';
import PanelLayout from '../PanelLayout/PanelLayout.vue';

const layoutStore = useAppLayoutStore()
</script>

<template>
    <span class="content-panel-container">
        <PanelLayout :layout="layoutStore.layout.root"></PanelLayout>
    </span>
</template>

<style lang="less" scoped>
.content-panel-container {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>