<script setup lang="ts">

</script>

<template>
    <span class="footer-panel-container">
        <span class="footer-panel start">
            
        </span>
        <span class="footer-panel end">
            v:0.0.0
        </span>
    </span>
</template>

<style lang="less" scoped>
.footer-panel-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: small;
    min-height: 1rem;
}
.footer-panel {
    flex-basis: 50%;
    display: flex;
    align-content: stretch;
    &.start {
        justify-content: start;
        padding-inline-start: 0.25em; 
    }
    &.end {
        justify-content: end;
        padding-inline-end: 0.25em;
    }
}

</style>