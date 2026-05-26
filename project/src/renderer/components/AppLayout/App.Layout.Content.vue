<script setup lang="ts">
import useAppLayoutStore from '@renderer/stores/layout.js';
import PanelLayout from '../PanelLayout/PanelLayout.vue';

const layoutStore = useAppLayoutStore()
</script>

<template>
    <div class="content-panel-container" :key="JSON.stringify(layoutStore)">
        <PanelLayout :layout="layoutStore.layout.root"></PanelLayout>
    </div>
</template>

<style lang="less" scoped>
.content-panel-container {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>