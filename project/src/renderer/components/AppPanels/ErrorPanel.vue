<script setup lang="ts">
defineProps<{}>()
</script>

<template>
    <div class="error">
        Error
    </div>
</template>

<style scoped>
.error {
    color: Red;
    font-weight: bold;
    background: repeating-linear-gradient(
        45deg,
        #ffa60030,
        #ffa60030 20px,
        transparent 20px,
        transparent 40px
    );
    justify-content: center;
    align-content: center;
    text-align: center;
    width: 100%;
    height: 100%;
    font-size: 4rem;
}
</style>