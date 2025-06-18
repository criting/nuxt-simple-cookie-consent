<template>
  <div>
    <UButton @click="modalRef?.open()">
      Open Cookie Preferences
    </UButton>
    <CookieBanner @open-modal="modalRef?.open()" />
    <CookieModal ref="modalRef" />
  </div>
</template>

<script setup>
const modalRef = ref()
</script>
