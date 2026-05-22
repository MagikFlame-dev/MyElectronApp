<script setup lang="ts">
import { AppLayoutBase } from '@renderer/scripts/layout.js';
import { provide } from 'vue';

const props = defineProps<{
  layout: AppLayoutBase
  withGutter?: boolean
}>()
provide<AppLayoutBase>('panelMeta', props.layout)
</script>


<template>
  <div v-if="AppLayoutBase.isPanel(layout)" class="panel">
    <component :is="layout.component" v-bind="(layout.props as object)"></component>
  </div>
  <div v-else-if="AppLayoutBase.isSplit(layout)" :class="{split: true, root: AppLayoutBase.isRoot(layout)}" :direction="layout.direction">
    <PanelLayout v-for="(panel, index) in layout.panels" :key="index" :layout="panel" :with-gutter="(index < layout.panels.length - 1)"></PanelLayout>
  </div>
  <div v-if="withGutter" class="gutter" @click="console.log"></div>
</template>

<style scoped>
.gutter:last-child {
  display: none;
}

.root {
  outline: 1px solid var(--border-color);
}
.gutter {
  flex-basis: 1px;
  position: relative;
  background: black;
}
.gutter::after {
  content: '';
  position: absolute;
  cursor: pointer;
  height: 100%;
  width: 100%;
  transition: background-color 200ms ease-in-out;
}
.gutter:hover::after {
  background: var(--border-color);
}

.panel {
  padding-inline: 3px;
  flex-basis: 0%;
}
.panel[growbehavior=expand] {
  flex-basis: 100%;
}

.split {
  display: flex;
}
.split[direction=row] {
  flex-direction: row;
}
.split[direction=row] > .gutter::after {
  left: -2px;
  width: 5px;
  cursor: ew-resize;
}
.split[direction=column] {
  flex-direction: column;
}
.split[direction=column] > .gutter::after {
  top: -2px;
  height: 5px;
  cursor: ns-resize;
}
.split > :last-child {
  flex-basis: 100%;
}

</style>
