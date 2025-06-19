<script setup lang="ts">
const {
  acceptAll,
  denyAll,
  hasUserMadeChoice,
  isConsentExpired,
  onConsentAccepted,
  onConsentDenied,
  onCategoryAccepted,
  onScriptsInjected,
  onScriptsRemoved,
} = useCookieConsent()

onConsentAccepted(() => {
  console.log('[HOOK] Consent accepted')
})

onConsentDenied(() => {
  console.log('[HOOK] Consent denied')
})

onCategoryAccepted((category) => {
  console.log('[HOOK] Category accepted:', category)
})

onScriptsInjected((category) => {
  console.log('[HOOK] Scripts injected for category:', category)
})

onScriptsRemoved((category) => {
  console.log('[HOOK] Scripts removed for category:', category)
})

const showBanner = ref(!hasUserMadeChoice.value || isConsentExpired.value)
watch([hasUserMadeChoice, isConsentExpired], () => {
  showBanner.value = !hasUserMadeChoice.value || isConsentExpired.value
})

const emit = defineEmits(['open-modal'])

function handleOpenModal() {
  emit('open-modal')
}

function handleAccept() {
  acceptAll()
  showBanner.value = false
}

function handleDeny() {
  denyAll()
  showBanner.value = false
}
</script>

<template>
  <p v-if="isConsentExpired">
    Your cookie preferences have expired. Please review them again.
  </p>
  <div
    v-if="showBanner"
    class="fixed bottom-4 left-4 right-4 bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-xl z-50 flex flex-col md:flex-row justify-between items-start gap-4"
  >
    <div class="flex-1">
      <h2 class="text-lg font-semibold">
        We use cookies 🍪
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        To personalize content and analyze traffic. You can customize your preferences.
      </p>
    </div>
    <div
      class="flex gap-2"
    >
      <UButton
        color="neutral"
        @click="handleDeny"
      >
        Deny
      </UButton>
      <UButton @click="handleAccept">
        Accept All
      </UButton>
      <UButton
        variant="link"
        @click="handleOpenModal"
      >
        Customize
      </UButton>
    </div>
  </div>
</template>
