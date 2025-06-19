<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const {
  preferences,
  categoryMeta,
  updatePreferences,
} = useCookieConsent()

const localPrefs = reactive<Record<string, boolean | null>>({})
watchEffect(() => {
  if (isOpen.value && preferences && Object.keys(preferences).length) {
    for (const key in preferences) {
      localPrefs[key] = preferences.value[key] ?? null
    }
  }
})

function savePreferences() {
  updatePreferences(preferences.value)
  isOpen.value = false
}

defineExpose({
  open() {
    isOpen.value = true
  },
})
</script>

<template>
  <UModal
    v-if="isOpen"
    v-model:open="isOpen"
  >
    <template #header>
      <h2 class="text-xl font-bold">
        Cookie Preferences
      </h2>
    </template>

    <template #body>
      <div
        v-for="(meta, key) in categoryMeta"
        :key="key"
        class="mb-4 flex items-start justify-between"
      >
        <div>
          <p class="font-medium">
            {{ meta.label }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ meta.description }}
          </p>
        </div>
        <USwitch
          v-model="preferences[key]"
          :disabled="meta.required"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          @click="isOpen = false"
        >
          Cancel
        </UButton>
        <UButton
          @click="savePreferences"
        >
          Save
        </UButton>
      </div>
    </template>
  </UModal>
</template>
