import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Confetti from './components/Confetti.vue'
import JumboBackground from './components/JumboBackground.vue'
import { h } from 'vue'
import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesPlugin,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import { Footer } from '@theojs/lumen'
import { Footer_Data } from '../data/footerData.ts'

import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-before': () => h(JumboBackground),
      'layout-bottom': () => h(Footer, { Footer_Data }),
      'nav-bar-content-after': () => h(NolebaseEnhancedReadabilitiesMenu),
      'nav-screen-content-after': () => h(NolebaseEnhancedReadabilitiesScreenMenu),
    })
  },
  enhanceApp({ app }) {
    app.component('Confetti', Confetti)
    app.use(NolebaseEnhancedReadabilitiesPlugin, {
      spotlight: {
        disableHelp: true,
        defaultToggle: true,
      },
    })
  }
}
