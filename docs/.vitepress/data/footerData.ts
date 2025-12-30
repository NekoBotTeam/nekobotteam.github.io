import type { FooterData } from '@theojs/lumen'

export const Footer_Data: FooterData = {
  author: { name: 'NekoBotTeam', link: 'https://github.com/NekoBotTeam' },
  group: [
    {
      title: '部署',
      icon: 'fa-solid fa-cloud',
      links: [
        { name: 'Vercel-NekoBot', link: 'https://docs.nekobot.dev/' },
        { name: 'Vercel-App', link: 'https://nekobotteamgithubio.vercel.app/' },
        { name: 'Github Page', link: 'https://nekobotteam.github.io/' },
      ],
    },
    {
      title: '社区',
      icon: 'fa-solid fa-users',
      links: [
        { name: '官方 企鹅1号社区', link: 'https://qm.qq.com/q/eOrRe4t9XW' },
        { name: 'Neko猫猫 开发者群聊', link: 'https://qm.qq.com/q/G76NPmltSu' },
      ],
    },
  ],
}
