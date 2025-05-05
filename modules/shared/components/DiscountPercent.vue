<template>
  <div class="flex gap-2">
    <input
      id="isPercent"
      v-model="isPercent"
      type="checkbox"
      class="checkbox checkbox-info border"
    />
    <label for="isPercent" class="mb-2">Учитывать ли скидки?</label>
  </div>
</template>

<script setup lang="ts">
const isPercent = defineModel<boolean>('isPercent')
</script>

<style scoped></style>
