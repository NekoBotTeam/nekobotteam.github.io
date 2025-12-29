<template>
  <div class="VPHome">
    <div class="container">
      <div class="hero">
        <img v-if="hero.image" :src="hero.image.src" :alt="hero.image.alt" class="hero-image" />
        <h1 class="name">
          <span class="clip">{{ hero.name }}</span>
        </h1>
        <p class="text">{{ hero.text }}</p>
        <p class="tagline">{{ hero.tagline }}</p>
        <div class="actions">
          <a
            v-for="action in hero.actions"
            :key="action.text"
            :href="action.link"
            :class="['action', action.theme]"
          >
            {{ action.text }}
          </a>
        </div>
      </div>
      
      <div class="features">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="feature"
        >
          <div v-if="feature.icon" class="icon">
            <img v-if="typeof feature.icon === 'object'" :src="feature.icon.src" :alt="feature.title" />
            <span v-else>{{ feature.icon }}</span>
          </div>
          <h3 class="title">{{ feature.title }}</h3>
          <p class="details">{{ feature.details }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

const hero = computed(() => frontmatter.value.hero || {})
const features = computed(() => frontmatter.value.features || [])
</script>

<style scoped>
.VPHome {
  padding: 2rem 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero {
  text-align: center;
  margin-bottom: 4rem;
}

.hero-image {
  width: 128px;
  height: 128px;
  margin-bottom: 2rem;
}

.name {
  font-size: 3.5rem;
  font-weight: 700;
  font-family: 'Outfit', sans-serif;
  margin: 0 0 1rem 0;
  background: linear-gradient(120deg, var(--vp-c-brand-light) 30%, var(--vp-c-brand-1));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem 0;
}

.tagline {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  margin: 0 0 2rem 0;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.actions :deep(.action) {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.actions :deep(.action.brand) {
  background: var(--vp-c-brand-light);
  color: white;
  border: none;
}

.actions :deep(.action.brand:hover) {
  background: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.actions :deep(.action.alt) {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.actions :deep(.action.alt:hover) {
  opacity: 0.8;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.feature {
  text-align: center;
  padding: 2rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
}

.feature:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px var(--vp-c-brand-soft);
  transform: translateY(-2px);
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.icon img {
  width: 48px;
  height: 48px;
}

.icon span {
  font-size: 3rem;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 1rem 0;
}

.details {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .name {
    font-size: 2.5rem;
  }
  
  .text {
    font-size: 1.25rem;
  }
  
  .tagline {
    font-size: 1rem;
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action {
    width: 200px;
  }
  
  .features {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .feature {
    padding: 1.5rem;
  }
}
</style>

