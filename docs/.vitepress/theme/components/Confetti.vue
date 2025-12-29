<script setup lang="ts">
  import confetti from 'canvas-confetti'
  import { onMounted } from 'vue'

  onMounted(() => {
    confetti({
      particleCount: 100,
      spread: 170,
      origin: { y: 0.6 },
    })
  })
</script>

<template></template>
