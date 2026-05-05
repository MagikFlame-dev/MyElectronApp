<script setup lang="ts">
import AppLayout from './components/App.Layout.vue';


</script>

<template>
  <AppLayout>
    <template #title>Title</template>
    <template #panel-center>Center</template>
    <template #panel-top>Top</template>
    <template #panel-left>Left</template>
    <template #panel-right>Right</template>
    <template #panel-bottom>Bottom</template>
    <template #footer>Footer</template>
  </AppLayout>
</template>

<style lang="less" scoped>

</style>