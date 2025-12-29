import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'NekoBot',
  titleTemplate: 'NekoBot - :title',
  description: 'AI驱动的机器人框架',
  base: '/',
  
  // 多语言配置
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh',
      title: 'NekoBot',
      description: 'AI驱动的机器人框架',
      themeConfig: {
        nav: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '关于', link: '/other/about' }
        ],
        sidebar: {
          '/guide/': [
            {
              text: '快速开始',
              items: [
                { text: '快速开始', link: '/guide/getting-started' },
                { text: '什么是 NekoBot', link: '/guide/what-is-nekobot' },
                { text: '安装和配置', link: '/guide/installation' },
                { text: '启动方式', link: '/guide/startup' }
              ]
            },
            {
              text: '核心功能',
              items: [
                { text: '架构设计', link: '/guide/architecture' },
                { text: '插件系统', link: '/guide/plugins' },
                { text: '命令系统', link: '/guide/commands' },
                { text: 'LLM配置', link: '/guide/llm' },
                { text: '日志管理', link: '/guide/logging' }
              ]
            },
            {
              text: '平台对接',
              items: [
                { text: '平台对接', link: '/guide/platforms' },
                { text: 'QQ', link: '/guide/platforms/qq' },
                { text: 'Discord', link: '/guide/platforms/discord' },
                { text: 'Telegram', link: '/guide/platforms/telegram' },
                { text: '钉钉', link: '/guide/platforms/dingtalk' },
                { text: '微信', link: '/guide/platforms/wechat' },
                { text: '飞书', link: '/guide/platforms/feishu' }
              ]
            }
          ],
          '/config/': [
            {
              text: '配置',
              items: [
                { text: '基础配置', link: '/config/basic' },
                { text: '高级配置', link: '/config/advanced' }
              ]
            }
          ],
          '/use/': [
            {
              text: '使用',
              items: [
                { text: '接入框架', link: '/use/integration' },
                { text: '社区资源', link: '/use/community' }
              ]
            }
          ],
          '/develop/': [
            {
              text: '开发',
              items: [
                { text: '插件开发', link: '/develop/plugin' },
                { text: 'API 文档', link: '/develop/api' },
                { text: '事件处理', link: '/develop/events' },
                { text: '消息类型', link: '/develop/messages' }
              ]
            }
          ],
          '/other/': [
            {
              text: '其他',
              items: [
                { text: '关于', link: '/other/about' },
                { text: '安全', link: '/other/security' },
                { text: '贡献指南', link: '/other/contributing' }
              ]
            }
          ],
          '/api/': [
            {
              text: 'API 参考',
              items: [
                { text: 'API 概览', link: '/api/overview' }
              ]
            }
          ]
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      title: 'NekoBot',
      description: 'AI-powered bot framework',
      themeConfig: {
        nav: [
          { text: 'Quick Start', link: '/en/guide/getting-started' },
          { text: 'About', link: '/en/other/about' }
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Quick Start',
              items: [
                { text: 'Quick Start', link: '/en/guide/getting-started' },
                { text: 'What is NekoBot', link: '/en/guide/what-is-nekobot' },
                { text: 'Installation', link: '/en/guide/installation' },
                { text: 'Startup', link: '/en/guide/startup' }
              ]
            },
            {
              text: 'Core Features',
              items: [
                { text: 'Architecture', link: '/en/guide/architecture' },
                { text: 'Plugin System', link: '/en/guide/plugins' },
                { text: 'Command System', link: '/en/guide/commands' },
                { text: 'LLM Configuration', link: '/en/guide/llm' },
                { text: 'Logging', link: '/en/guide/logging' }
              ]
            },
            {
              text: 'Platform Integration',
              items: [
                { text: 'Platforms', link: '/en/guide/platforms' },
                { text: 'QQ', link: '/en/guide/platforms/qq' },
                { text: 'Discord', link: '/en/guide/platforms/discord' },
                { text: 'Telegram', link: '/en/guide/platforms/telegram' },
                { text: 'DingTalk', link: '/en/guide/platforms/dingtalk' },
                { text: 'WeChat', link: '/en/guide/platforms/wechat' },
                { text: 'Feishu', link: '/en/guide/platforms/feishu' }
              ]
            }
          ],
          '/en/config/': [
            {
              text: 'Configuration',
              items: [
                { text: 'Basic Config', link: '/en/config/basic' },
                { text: 'Advanced Config', link: '/en/config/advanced' }
              ]
            }
          ],
          '/en/use/': [
            {
              text: 'Usage',
              items: [
                { text: 'Integration', link: '/en/use/integration' },
                { text: 'Community', link: '/en/use/community' }
              ]
            }
          ],
          '/en/develop/': [
            {
              text: 'Development',
              items: [
                { text: 'Plugin Development', link: '/en/develop/plugin' },
                { text: 'API Documentation', link: '/en/develop/api' },
                { text: 'Events', link: '/en/develop/events' },
                { text: 'Message Types', link: '/en/develop/messages' }
              ]
            }
          ],
          '/en/other/': [
            {
              text: 'Other',
              items: [
                { text: 'About', link: '/en/other/about' },
                { text: 'Security', link: '/en/other/security' },
                { text: 'Contributing', link: '/en/other/contributing' }
              ]
            }
          ],
          '/en/api/': [
            {
              text: 'API Reference',
              items: [
                { text: 'API Overview', link: '/en/api/overview' }
              ]
            }
          ]
        }
      }
    }
  },

  themeConfig: {
    // 搜索配置
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          },
          en: {
            translations: {
              button: {
                buttonText: 'Search Docs',
                buttonAriaLabel: 'Search Docs'
              },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Clear query',
                footer: {
                  selectText: 'Select',
                  navigateText: 'Navigate'
                }
              }
            }
          }
        }
      }
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/NekoBotTeam/NekoBot' }
    ],

    // 页脚
    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2025 NekoBotTeam'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/NekoBotTeam/NekoBot/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // 大纲
    outline: {
      level: [2, 3],
      label: '页面大纲'
    },

    // 返回顶部
    returnToTopLabel: '返回顶部',

    // 侧边栏菜单
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },

  // 头部配置
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.svg' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'description', content: 'AI驱动的机器人框架' }],
    ['meta', { name: 'keywords', content: 'NekoBot, 机器人, AI, 插件, 框架' }]
  ],

  vite: {
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/vitepress-plugin-enhanced-readabilities/client',
        'canvas-confetti',
        'vue'
      ]
    }
  }
})
