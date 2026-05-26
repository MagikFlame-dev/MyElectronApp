<script setup lang="ts">
import { usePanelRegistry } from '@renderer/registries/panels.js';
import { AppLayoutBase } from '@renderer/scripts/layout.js';
import { provide } from 'vue';

const props = defineProps<{
  layout: AppLayoutBase
  withGutter?: boolean
}>()
const registry = usePanelRegistry()

provide<AppLayoutBase>('panelMeta', props.layout)

const selectTab = (id: string) => {
  if (!AppLayoutBase.isTabs(props.layout)) { return }
  props.layout.select(id);
}
</script>


<template>
  <div v-if="AppLayoutBase.isTabs(layout)" :class="{
    tab: true,
    container: true,
    panel: true,
    }">
    <div class="tab header">
      <span v-for="tab in layout.tabs" :class="{
        tab: true,
        item: true,
        }" @click="selectTab(tab.panel.ID)">
        {{ tab.header }}
      </span>
    </div>
    <div class="tab outlet">
      <PanelLayout v-if="layout.panel" :layout="layout.panel"></PanelLayout>
    </div>
  </div>
  <div v-else-if="AppLayoutBase.isPanel(layout) && registry.has(layout.component)" :class="{
    panel: true,
    }" >
    <component :is="registry.get(layout.component)" v-bind="(layout.props as any)"></component>
  </div>
  <div v-else-if="AppLayoutBase.isSplit(layout)" :class="{
    split: true,
    root: AppLayoutBase.isRoot(layout)
    }" :direction="layout.direction">
    <PanelLayout v-for="(panel, index) in layout.panels" :key="index" :layout="panel" :with-gutter="(index < layout.panels.length - 1)"></PanelLayout>
  </div>
  <div v-if="withGutter" :class="{
    gutter: true
    }"
    @click="console.log">
  </div>
</template>

<style scoped lang="less">
.root {
  outline: 1px solid var(--border-color);
  width: 100%;
  height: 100%;
}

.gutter {
  flex-basis: 1px;
  position: relative;
  background: var(--border-color);

  &:last-child {
    display: none;
  }

  &::after {
    content: '';
    position: absolute;
    cursor: pointer;
    height: 100%;
    width: 100%;
    transition: background-color 200ms ease-in-out;
  }
 
  &:hover::after {
    background: var(--border-color);
  }
}

.panel {
  padding-inline: 3px;
  flex-basis: 0%;

  &[growbehavior=expand] {
    flex-basis: 100%;
  }
}

.split {
  display: flex;
 
  &[direction=row] {
    flex-direction: row;
  }
  &[direction=row] > .gutter::after {
    left: -2px;
    width: 5px;
    cursor: ew-resize;
  }
 
  &[direction=column] {
    flex-direction: column;
  }
  &[direction=column] > .gutter::after {
    top: -2px;
    height: 5px;
    cursor: ns-resize;
  }
 
  > :last-child {
    flex-basis: 100%;
  }
}

.tab {
  &.container {
    position: relative;
  }

  &.header {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    justify-content: flex-start;

    align-items: stretch;
    height: 1.75rem;
    width: 100%;
    border-bottom: 1px solid var(--border-color);

    .item {
      padding-inline: 0.25rem;
      user-select: none;
      cursor: pointer;
      border-inline-end: 1px solid var(--border-color);
      align-content: center;
    }
  }
  &.outlet {
    position: absolute;
    top: calc(1.75rem + 1px);
    left: 0px;
    right: 0px;
    bottom: 0px;
    > * {
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
    }
  }
}
</style>