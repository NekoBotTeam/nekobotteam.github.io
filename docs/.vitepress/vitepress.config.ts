import { defineConfig } from 'vitepress'
import vue from '@vitejs/plugin-vue'
import { checker } from 'vite-plugin-checker'

export default defineConfig({
  vite: {
    server: {
      port: 5173,
      host: true
    },
    plugins: [
      vue(),
      checker({
        vueTsc: true
      })
    ]
  }
})

