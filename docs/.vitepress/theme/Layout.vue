<template>
  <div class="layout">
    <slot />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useData } from 'vitepress'
import confetti from 'canvas-confetti'

const { frontmatter, page } = useData()

onMounted(() => {
  // 只在首页显示 Confetti 效果
  if (page.value.relativePath === 'index.md' && frontmatter.value.layout === 'home') {
    confetti({
      particleCount: 100,
      spread: 170,
      origin: { y: 0.6 },
    })
  }
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
}
</style>

