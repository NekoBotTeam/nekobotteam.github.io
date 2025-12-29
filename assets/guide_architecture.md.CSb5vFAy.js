import{_ as a,c as n,o as i,az as l}from"./chunks/framework.OpiqYVxT.js";const r=JSON.parse('{"title":"架构设计","description":"","frontmatter":{},"headers":[],"relativePath":"guide/architecture.md","filePath":"guide/architecture.md","lastUpdated":1767020854000}'),p={name:"guide/architecture.md"};function e(t,s,h,c,d,o){return i(),n("div",null,[...s[0]||(s[0]=[l(`<h1 id="架构设计" tabindex="-1">架构设计 <a class="header-anchor" href="#架构设计" aria-label="Permalink to &quot;架构设计&quot;">​</a></h1><p>本文档详细介绍 NekoBot 的系统架构设计。</p><h2 id="整体架构" tabindex="-1">整体架构 <a class="header-anchor" href="#整体架构" aria-label="Permalink to &quot;整体架构&quot;">​</a></h2><p>NekoBot 采用分层架构设计，分为以下几个核心层次：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>┌─────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                    Web Dashboard                      │</span></span>
<span class="line"><span>│                   (React + Vite)                    │</span></span>
<span class="line"><span>└─────────────────────┬───────────────────────────────┘</span></span>
<span class="line"><span>                      │ HTTP / WebSocket</span></span>
<span class="line"><span>                      ▼</span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                    Quart 应用层                        │</span></span>
<span class="line"><span>│         (packages/backend/app.py)                      │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│  - 路由管理                                         │</span></span>
<span class="line"><span>│  - JWT 认证中间件                                    │</span></span>
<span class="line"><span>│  - WebSocket 服务                                     │</span></span>
<span class="line"><span>│  - 静态文件服务                                      │</span></span>
<span class="line"><span>└─────────────────────┬───────────────────────────────┘</span></span>
<span class="line"><span>                      │</span></span>
<span class="line"><span>                      ▼</span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                    核心服务层                           │</span></span>
<span class="line"><span>│         (packages/backend/core/)                        │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│  - 插件管理器 (plugin_manager.py)                    │</span></span>
<span class="line"><span>│  - 平台管理器 (platform_manager.py)                   │</span></span>
<span class="line"><span>│  - 消息流水线 (pipeline/)                            │</span></span>
<span class="line"><span>│  - 事件队列 (event_queue)                            │</span></span>
<span class="line"><span>└─────────────────────┬───────────────────────────────┘</span></span>
<span class="line"><span>                      │</span></span>
<span class="line"><span>                      ▼</span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                    平台适配层                           │</span></span>
<span class="line"><span>│        (packages/backend/platform/)                     │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│  - QQ 适配器 (aiocqhttp_platform.py)                │</span></span>
<span class="line"><span>│  - Discord 适配器 (discord_platform.py)               │</span></span>
<span class="line"><span>│  - Telegram 适配器 (telegram_platform.py)             │</span></span>
<span class="line"><span>└─────────────────────┬───────────────────────────────┘</span></span>
<span class="line"><span>                      │</span></span>
<span class="line"><span>                      ▼</span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                    插件层                              │</span></span>
<span class="line"><span>│         (packages/backend/plugins/)                     │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│  - 基础插件类 (base.py)                            │</span></span>
<span class="line"><span>│  - 用户插件 (data/plugins/)                          │</span></span>
<span class="line"><span>│  - 插件数据管理 (plugin_data_manager.py)               │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────────┘</span></span></code></pre></div><h2 id="核心组件" tabindex="-1">核心组件 <a class="header-anchor" href="#核心组件" aria-label="Permalink to &quot;核心组件&quot;">​</a></h2><h3 id="quart-应用层" tabindex="-1">Quart 应用层 <a class="header-anchor" href="#quart-应用层" aria-label="Permalink to &quot;Quart 应用层&quot;">​</a></h3><p>Quart 应用层位于 <code>app.py</code>，是整个系统的入口点。</p><p>主要职责：</p><ul><li>管理所有 HTTP 路由</li><li>处理 WebSocket 连接</li><li>实现 JWT 认证中间件</li><li>提供静态文件服务</li></ul><p>路由注册：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> route_class </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    bot_config_route,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    plugin_route,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    log_route,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    personality_route,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    mcp_route,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    llm_route,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    settings_route,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    platform_route,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    chat_route,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    command_route,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> path, (method, handler) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> route_class.routes.items():</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        app.add_url_rule(path, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">view_func</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">handler, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">methods</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[method])</span></span></code></pre></div><h3 id="核心服务层" tabindex="-1">核心服务层 <a class="header-anchor" href="#核心服务层" aria-label="Permalink to &quot;核心服务层&quot;">​</a></h3><p>核心服务层位于 <code>packages/backend/core/</code>，包含以下核心组件：</p><h4 id="插件管理器" tabindex="-1">插件管理器 <a class="header-anchor" href="#插件管理器" aria-label="Permalink to &quot;插件管理器&quot;">​</a></h4><p>插件管理器 (<code>plugin_manager.py</code>) 负责插件的加载、启用、禁用和消息分发。</p><p>主要方法：</p><ul><li><code>load_plugins()</code> - 加载所有插件</li><li><code>enable_plugin()</code> - 启用指定插件</li><li><code>disable_plugin()</code> - 禁用指定插件</li><li><code>reload_plugin()</code> - 重载指定插件</li><li><code>dispatch_message()</code> - 分发消息到插件</li></ul><h4 id="平台管理器" tabindex="-1">平台管理器 <a class="header-anchor" href="#平台管理器" aria-label="Permalink to &quot;平台管理器&quot;">​</a></h4><p>平台管理器 (<code>platform/manager.py</code>) 管理所有平台适配器。</p><p>主要方法：</p><ul><li><code>load_platforms()</code> - 加载平台配置</li><li><code>start_all()</code> - 启动所有平台</li><li><code>stop_all()</code> - 停止所有平台</li><li><code>send_message()</code> - 发送消息到指定平台</li></ul><h4 id="消息流水线" tabindex="-1">消息流水线 <a class="header-anchor" href="#消息流水线" aria-label="Permalink to &quot;消息流水线&quot;">​</a></h4><p>消息流水线 (<code>pipeline/</code>) 负责处理平台事件。</p><p>流水线阶段：</p><ol><li><code>WhitelistCheckStage</code> - 白名单检查</li><li><code>ContentSafetyCheckStage</code> - 内容安全检查</li><li><code>RateLimitStage</code> - 频率限制</li><li><code>SessionStatusCheckStage</code> - 会话状态检查</li><li><code>WakingCheckStage</code> - 唤醒检查</li><li><code>ProcessStage</code> - 处理阶段（调用插件）</li><li><code>ResultDecorateStage</code> - 结果装饰</li><li><code>RespondStage</code> - 响应发送</li></ol><h3 id="平台适配层" tabindex="-1">平台适配层 <a class="header-anchor" href="#平台适配层" aria-label="Permalink to &quot;平台适配层&quot;">​</a></h3><p>平台适配层位于 <code>packages/backend/platform/</code>，负责与各个聊天平台的交互。</p><p>每个平台适配器需要实现以下接口：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> BasePlatform</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">ABC</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">):</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    @abstractmethod</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    async</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> connect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(self):</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        pass</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    @abstractmethod</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    async</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> send_message</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(self, message_type, target_id, message):</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        pass</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    @abstractmethod</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    async</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> disconnect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(self):</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        pass</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    @abstractmethod</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> get_stats</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(self):</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        pass</span></span></code></pre></div><h3 id="插件层" tabindex="-1">插件层 <a class="header-anchor" href="#插件层" aria-label="Permalink to &quot;插件层&quot;">​</a></h3><p>插件层位于 <code>packages/backend/plugins/</code>，是用户扩展功能的主要方式。</p><p>插件基类 (<code>base.py</code>) 定义了插件的生命周期方法：</p><ul><li><code>on_load()</code> - 插件加载时调用</li><li><code>on_unload()</code> - 插件卸载时调用</li><li><code>on_enable()</code> - 插件启用时调用</li><li><code>on_disable()</code> - 插件禁用时调用</li><li><code>on_message()</code> - 收到消息时调用</li></ul><h2 id="数据流" tabindex="-1">数据流 <a class="header-anchor" href="#数据流" aria-label="Permalink to &quot;数据流&quot;">​</a></h2><h3 id="消息接收流程" tabindex="-1">消息接收流程 <a class="header-anchor" href="#消息接收流程" aria-label="Permalink to &quot;消息接收流程&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>平台适配器接收消息</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>转换为统一消息模型</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>放入事件队列 (event_queue)</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>流水线调度器从队列获取事件</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>执行各个流水线阶段</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>ProcessStage 调用插件处理</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>RespondStage 发送响应</span></span></code></pre></div><h3 id="命令处理流程" tabindex="-1">命令处理流程 <a class="header-anchor" href="#命令处理流程" aria-label="Permalink to &quot;命令处理流程&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>用户发送命令</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>平台适配器接收</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>转换为统一消息模型</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>放入事件队列</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>流水线调度器处理</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>ProcessStage 匹配命令</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>调用对应插件的命令处理函数</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>返回响应</span></span></code></pre></div><h2 id="异步处理" tabindex="-1">异步处理 <a class="header-anchor" href="#异步处理" aria-label="Permalink to &quot;异步处理&quot;">​</a></h2><p>NekoBot 全面采用异步架构，基于以下技术：</p><ul><li><strong>Quart</strong> - 异步版本的 Flask</li><li><strong>asyncio</strong> - Python 异步 I/O 库</li><li><strong>aiohttp</strong> - 异步 HTTP 客户端</li></ul><p>所有插件方法和平台适配器方法都应该是异步的：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">async</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> my_command</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(self, args, message):</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    await</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> self</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.send_group_message(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><h2 id="配置管理" tabindex="-1">配置管理 <a class="header-anchor" href="#配置管理" aria-label="Permalink to &quot;配置管理&quot;">​</a></h2><p>配置文件位于 <code>data/</code> 目录：</p><ul><li><code>cmd_config.json</code> - 主配置文件</li><li><code>platforms_sources.json</code> - 平台配置</li><li><code>llm_providers.json</code> - LLM 提供商配置</li><li><code>users.json</code> - 用户数据</li></ul><p>配置加载使用 <code>config.py</code>：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> packages.backend.core.config </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> load_config</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">CONFIG</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> load_config()</span></span></code></pre></div><h2 id="事件驱动架构" tabindex="-1">事件驱动架构 <a class="header-anchor" href="#事件驱动架构" aria-label="Permalink to &quot;事件驱动架构&quot;">​</a></h2><p>NekoBot 使用事件驱动架构，所有平台事件都通过事件队列分发：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">event_queue </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> asyncio.Queue()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">async</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> handle_events</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    while</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> True</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        event </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> event_queue.get()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pipeline_scheduler.execute(event, ctx)</span></span></code></pre></div><p>这种设计使得：</p><ul><li>平台适配器和插件解耦</li><li>支持异步消息处理</li><li>可以方便地添加新的事件处理阶段</li></ul><h2 id="扩展性" tabindex="-1">扩展性 <a class="header-anchor" href="#扩展性" aria-label="Permalink to &quot;扩展性&quot;">​</a></h2><h3 id="添加新平台" tabindex="-1">添加新平台 <a class="header-anchor" href="#添加新平台" aria-label="Permalink to &quot;添加新平台&quot;">​</a></h3><ol><li>在 <code>platform/sources/</code> 下创建新的平台适配器</li><li>继承 <code>BasePlatform</code> 并实现必需方法</li><li>在 <code>platform/register.py</code> 中注册</li></ol><h3 id="添加新-llm-提供商" tabindex="-1">添加新 LLM 提供商 <a class="header-anchor" href="#添加新-llm-提供商" aria-label="Permalink to &quot;添加新 LLM 提供商&quot;">​</a></h3><ol><li>在 <code>llm/sources/</code> 下创建新的 LLM 提供商</li><li>继承基类并实现接口</li><li>在 <code>llm/register.py</code> 中注册</li></ol><h3 id="添加流水线阶段" tabindex="-1">添加流水线阶段 <a class="header-anchor" href="#添加流水线阶段" aria-label="Permalink to &quot;添加流水线阶段&quot;">​</a></h3><ol><li>在 <code>pipeline/</code> 下创建新的阶段类</li><li>继承 <code>Stage</code> 并实现 <code>execute()</code> 方法</li><li>在流水线初始化时添加</li></ol><h2 id="性能考虑" tabindex="-1">性能考虑 <a class="header-anchor" href="#性能考虑" aria-label="Permalink to &quot;性能考虑&quot;">​</a></h2><ul><li>使用异步 I/O 提高并发性能</li><li>使用连接池管理数据库连接</li><li>使用缓存减少重复计算</li><li>使用队列缓冲事件处理</li></ul><h2 id="安全考虑" tabindex="-1">安全考虑 <a class="header-anchor" href="#安全考虑" aria-label="Permalink to &quot;安全考虑&quot;">​</a></h2><ul><li>JWT 认证保护 API 端点</li><li>bcrypt 加密用户密码</li><li>输入验证防止注入攻击</li><li>频率限制防止滥用</li></ul>`,65)])])}const g=a(p,[["render",e]]);export{r as __pageData,g as default};
