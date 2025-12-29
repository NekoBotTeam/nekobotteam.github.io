# 架构设计

本文档详细介绍 NekoBot 的系统架构设计。

## 整体架构

NekoBot 采用分层架构设计，分为以下几个核心层次：

```
┌─────────────────────────────────────────────────────────┐
│                    Web Dashboard                      │
│                   (React + Vite)                    │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP / WebSocket
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Quart 应用层                        │
│         (packages/backend/app.py)                      │
├─────────────────────────────────────────────────────────┤
│  - 路由管理                                         │
│  - JWT 认证中间件                                    │
│  - WebSocket 服务                                     │
│  - 静态文件服务                                      │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    核心服务层                           │
│         (packages/backend/core/)                        │
├─────────────────────────────────────────────────────────┤
│  - 插件管理器 (plugin_manager.py)                    │
│  - 平台管理器 (platform_manager.py)                   │
│  - 消息流水线 (pipeline/)                            │
│  - 事件队列 (event_queue)                            │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    平台适配层                           │
│        (packages/backend/platform/)                     │
├─────────────────────────────────────────────────────────┤
│  - QQ 适配器 (aiocqhttp_platform.py)                │
│  - Discord 适配器 (discord_platform.py)               │
│  - Telegram 适配器 (telegram_platform.py)             │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    插件层                              │
│         (packages/backend/plugins/)                     │
├─────────────────────────────────────────────────────────┤
│  - 基础插件类 (base.py)                            │
│  - 用户插件 (data/plugins/)                          │
│  - 插件数据管理 (plugin_data_manager.py)               │
└─────────────────────────────────────────────────────────┘
```

## 核心组件

### Quart 应用层

Quart 应用层位于 `app.py`，是整个系统的入口点。

主要职责：
- 管理所有 HTTP 路由
- 处理 WebSocket 连接
- 实现 JWT 认证中间件
- 提供静态文件服务

路由注册：
```python
for route_class in [
    bot_config_route,
    plugin_route,
    log_route,
    personality_route,
    mcp_route,
    llm_route,
    settings_route,
    platform_route,
    chat_route,
    command_route,
]:
    for path, (method, handler) in route_class.routes.items():
        app.add_url_rule(path, view_func=handler, methods=[method])
```

### 核心服务层

核心服务层位于 `packages/backend/core/`，包含以下核心组件：

#### 插件管理器

插件管理器 (`plugin_manager.py`) 负责插件的加载、启用、禁用和消息分发。

主要方法：
- `load_plugins()` - 加载所有插件
- `enable_plugin()` - 启用指定插件
- `disable_plugin()` - 禁用指定插件
- `reload_plugin()` - 重载指定插件
- `dispatch_message()` - 分发消息到插件

#### 平台管理器

平台管理器 (`platform/manager.py`) 管理所有平台适配器。

主要方法：
- `load_platforms()` - 加载平台配置
- `start_all()` - 启动所有平台
- `stop_all()` - 停止所有平台
- `send_message()` - 发送消息到指定平台

#### 消息流水线

消息流水线 (`pipeline/`) 负责处理平台事件。

流水线阶段：
1. `WhitelistCheckStage` - 白名单检查
2. `ContentSafetyCheckStage` - 内容安全检查
3. `RateLimitStage` - 频率限制
4. `SessionStatusCheckStage` - 会话状态检查
5. `WakingCheckStage` - 唤醒检查
6. `ProcessStage` - 处理阶段（调用插件）
7. `ResultDecorateStage` - 结果装饰
8. `RespondStage` - 响应发送

### 平台适配层

平台适配层位于 `packages/backend/platform/`，负责与各个聊天平台的交互。

每个平台适配器需要实现以下接口：

```python
class BasePlatform(ABC):
    @abstractmethod
    async def connect(self):
        pass
    
    @abstractmethod
    async def send_message(self, message_type, target_id, message):
        pass
    
    @abstractmethod
    async def disconnect(self):
        pass
    
    @abstractmethod
    def get_stats(self):
        pass
```

### 插件层

插件层位于 `packages/backend/plugins/`，是用户扩展功能的主要方式。

插件基类 (`base.py`) 定义了插件的生命周期方法：

- `on_load()` - 插件加载时调用
- `on_unload()` - 插件卸载时调用
- `on_enable()` - 插件启用时调用
- `on_disable()` - 插件禁用时调用
- `on_message()` - 收到消息时调用

## 数据流

### 消息接收流程

```
平台适配器接收消息
    ↓
转换为统一消息模型
    ↓
放入事件队列 (event_queue)
    ↓
流水线调度器从队列获取事件
    ↓
执行各个流水线阶段
    ↓
ProcessStage 调用插件处理
    ↓
RespondStage 发送响应
```

### 命令处理流程

```
用户发送命令
    ↓
平台适配器接收
    ↓
转换为统一消息模型
    ↓
放入事件队列
    ↓
流水线调度器处理
    ↓
ProcessStage 匹配命令
    ↓
调用对应插件的命令处理函数
    ↓
返回响应
```

## 异步处理

NekoBot 全面采用异步架构，基于以下技术：

- **Quart** - 异步版本的 Flask
- **asyncio** - Python 异步 I/O 库
- **aiohttp** - 异步 HTTP 客户端

所有插件方法和平台适配器方法都应该是异步的：

```python
async def my_command(self, args, message):
    await self.send_group_message(...)
```

## 配置管理

配置文件位于 `data/` 目录：

- `cmd_config.json` - 主配置文件
- `platforms_sources.json` - 平台配置
- `llm_providers.json` - LLM 提供商配置
- `users.json` - 用户数据

配置加载使用 `config.py`：

```python
from packages.backend.core.config import load_config

CONFIG = load_config()
```

## 事件驱动架构

NekoBot 使用事件驱动架构，所有平台事件都通过事件队列分发：

```python
event_queue = asyncio.Queue()

async def handle_events():
    while True:
        event = await event_queue.get()
        await pipeline_scheduler.execute(event, ctx)
```

这种设计使得：
- 平台适配器和插件解耦
- 支持异步消息处理
- 可以方便地添加新的事件处理阶段

## 扩展性

### 添加新平台

1. 在 `platform/sources/` 下创建新的平台适配器
2. 继承 `BasePlatform` 并实现必需方法
3. 在 `platform/register.py` 中注册

### 添加新 LLM 提供商

1. 在 `llm/sources/` 下创建新的 LLM 提供商
2. 继承基类并实现接口
3. 在 `llm/register.py` 中注册

### 添加流水线阶段

1. 在 `pipeline/` 下创建新的阶段类
2. 继承 `Stage` 并实现 `execute()` 方法
3. 在流水线初始化时添加

## 性能考虑

- 使用异步 I/O 提高并发性能
- 使用连接池管理数据库连接
- 使用缓存减少重复计算
- 使用队列缓冲事件处理

## 安全考虑

- JWT 认证保护 API 端点
- bcrypt 加密用户密码
- 输入验证防止注入攻击
- 频率限制防止滥用
