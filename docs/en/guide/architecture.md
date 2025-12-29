---
layout: page
title: Architecture Design
---

# Architecture Design

This document details the system architecture design of NekoBot.

## Overall Architecture

NekoBot adopts a layered architecture design, divided into the following core layers:

```
┌─────────────────────────────────────────────────────────┐
│                    Web Dashboard                      │
│                   (React + Vite)                    │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP / WebSocket
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Quart Application Layer             │
│         (packages/backend/app.py)                      │
├─────────────────────────────────────────────────────────┤
│  - Route Management                                  │
│  - JWT Authentication Middleware                      │
│  - WebSocket Service                                 │
│  - Static File Service                              │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Core Service Layer                 │
│         (packages/backend/core/)                        │
├─────────────────────────────────────────────────────────┤
│  - Plugin Manager (plugin_manager.py)                │
│  - Platform Manager (platform_manager.py)               │
│  - Message Pipeline (pipeline/)                        │
│  - Event Queue (event_queue)                         │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Platform Adapter Layer              │
│        (packages/backend/platform/)                     │
├─────────────────────────────────────────────────────────┤
│  - QQ Adapter (aiocqhttp_platform.py)               │
│  - Discord Adapter (discord_platform.py)              │
│  - Telegram Adapter (telegram_platform.py)            │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Plugin Layer                       │
│         (packages/backend/plugins/)                    │
├─────────────────────────────────────────────────────────┤
│  - Base Plugin Class (base.py)                       │
│  - User Plugins (data/plugins/)                     │
│  - Plugin Data Manager (plugin_data_manager.py)       │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### Quart Application Layer

The Quart application layer is located in `app.py` and serves as the entry point for the entire system.

Main responsibilities:
- Manage all HTTP routes
- Handle WebSocket connections
- Implement JWT authentication middleware
- Provide static file service

Route registration:
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

### Core Service Layer

The core service layer is located at `packages/backend/core/` and contains the following core components:

#### Plugin Manager

The plugin manager (`plugin_manager.py`) is responsible for loading, enabling, disabling, and dispatching messages to plugins.

Main methods:
- `load_plugins()` - Load all plugins
- `enable_plugin()` - Enable specified plugin
- `disable_plugin()` - Disable specified plugin
- `reload_plugin()` - Reload specified plugin
- `dispatch_message()` - Dispatch messages to plugins

#### Platform Manager

The platform manager (`platform/manager.py`) manages all platform adapters.

Main methods:
- `load_platforms()` - Load platform configuration
- `start_all()` - Start all platforms
- `stop_all()` - Stop all platforms
- `send_message()` - Send message to specified platform

#### Message Pipeline

The message pipeline (`pipeline/`) is responsible for processing platform events.

Pipeline stages:
1. `WhitelistCheckStage` - Whitelist check
2. `ContentSafetyCheckStage` - Content safety check
3. `RateLimitStage` - Rate limiting
4. `SessionStatusCheckStage` - Session status check
5. `WakingCheckStage` - Waking check
6. `ProcessStage` - Process stage (call plugins)
7. `ResultDecorateStage` - Result decoration
8. `RespondStage` - Response sending

### Platform Adapter Layer

The platform adapter layer is located at `packages/backend/platform/` and handles interaction with various chat platforms.

Each platform adapter needs to implement the following interface:

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

### Plugin Layer

The plugin layer is located at `packages/backend/plugins/` and is the main way for users to extend functionality.

The plugin base class (`base.py`) defines plugin lifecycle methods:

- `on_load()` - Called when plugin is loaded
- `on_unload()` - Called when plugin is unloaded
- `on_enable()` - Called when plugin is enabled
- `on_disable()` - Called when plugin is disabled
- `on_message()` - Called when a message is received

## Data Flow

### Message Reception Flow

```
Platform Adapter Receives Message
    ↓
Convert to Unified Message Model
    ↓
Push to Event Queue (event_queue)
    ↓
Pipeline Scheduler Retrieves Event from Queue
    ↓
Execute All Pipeline Stages
    ↓
ProcessStage Calls Plugin Handlers
    ↓
RespondStage Sends Response
```

### Command Processing Flow

```
User Sends Command
    ↓
Platform Adapter Receives
    ↓
Convert to Unified Message Model
    ↓
Push to Event Queue
    ↓
Pipeline Scheduler Processes
    ↓
ProcessStage Matches Command
    ↓
Call Corresponding Plugin Command Handler
    ↓
Return Response
```

## Asynchronous Processing

NekoBot fully adopts asynchronous architecture, based on the following technologies:

- **Quart** - Asynchronous version of Flask
- **asyncio** - Python asynchronous I/O library
- **aiohttp** - Asynchronous HTTP client

All plugin methods and platform adapter methods should be asynchronous:

```python
async def my_command(self, args, message):
    await self.send_group_message(...)
```

## Configuration Management

Configuration files are located in the `data/` directory:

- `cmd_config.json` - Main configuration file
- `platforms_sources.json` - Platform configuration
- `llm_providers.json` - LLM provider configuration
- `users.json` - User data

Configuration loading uses `config.py`:

```python
from packages.backend.core.config import load_config

CONFIG = load_config()
```

## Event-Driven Architecture

NekoBot uses an event-driven architecture where all platform events are distributed through an event queue:

```python
event_queue = asyncio.Queue()

async def handle_events():
    while True:
        event = await event_queue.get()
        await pipeline_scheduler.execute(event, ctx)
```

This design enables:
- Decoupling between platform adapters and plugins
- Asynchronous message processing
- Easy addition of new event processing stages

## Extensibility

### Adding New Platform

1. Create a new platform adapter in `platform/sources/`
2. Inherit from `BasePlatform` and implement required methods
3. Register in `platform/register.py`

### Adding New LLM Provider

1. Create a new LLM provider in `llm/sources/`
2. Inherit from base class and implement interface
3. Register in `llm/register.py`

### Adding Pipeline Stage

1. Create a new stage class in `pipeline/`
2. Inherit from `Stage` and implement `execute()` method
3. Add when initializing the pipeline

## Performance Considerations

- Use async I/O to improve concurrent performance
- Use connection pooling for database connections
- Use caching to reduce duplicate computations
- Use queues to buffer event processing

## Security Considerations

- JWT authentication protects API endpoints
- bcrypt encryption for user passwords
- Input validation to prevent injection attacks
- Rate limiting to prevent abuse
