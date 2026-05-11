<script setup lang="ts">
import AppLayout from '@renderer/components/AppLayout/App.Layout.vue'
</script>

<template>
  <AppLayout>
    <template #panel-center>Center</template>
    <template #panel-top>Top</template>
    <template #panel-left>Left</template>
    <template #panel-right>Right</template>
    <template #panel-bottom>Bottom</template>
  </AppLayout>
</template>

<style lang="less" scoped>

</style>