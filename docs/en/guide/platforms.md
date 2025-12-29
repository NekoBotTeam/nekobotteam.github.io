---
layout: page
title: Platform Integration
---

# Platform Integration

NekoBot supports multiple chat platforms through a unified platform adapter interface for cross-platform message processing.

## Supported Platforms

| Platform | Status | Protocol |
|----------|--------|----------|
| QQ | ✅ | OneBot V11 (AIOCQHTTP) |
| Discord | ✅ | Discord Bot API |
| Telegram | ✅ | Telegram Bot API |

## Quick Start

Select a platform to start configuration:

- [QQ](./platforms/qq.md) - Use NapCatQQ to connect QQ
- [Discord](./platforms/discord.md) - Use Discord Bot API
- [Telegram](./platforms/telegram.md) - Use Telegram Bot API

## Platform Configuration

### Add Platform

Add platform in Web dashboard:

1. Go to "Platforms" page
2. Click "Add Platform"
3. Select platform type and fill in configuration
4. Save and enable platform

### Add via Configuration File

Edit `data/platforms_sources.json`:

```json
{
  "aiocqhttp": {
    "type": "aiocqhttp",
    "enable": true,
    "id": "aiocqhttp",
    "name": "NekoBot",
    "ws_host": "0.0.0.0",
    "ws_port": 6299,
    "command_prefix": "/"
  }
}
```

## Platform Adapters

### Developing Adapters

If you need to integrate with a new platform, you can develop custom platform adapters.

Reference the implementation of [QQ Platform Adapter](./platforms/qq.md).

### Platform API

Each platform adapter needs to implement the following methods:

- `connect()` - Connect to platform
- `send_message()` - Send message
- `disconnect()` - Disconnect
- `get_stats()` - Get statistics

## Unified Message Model

NekoBot uses a unified message model to handle differences between platforms:

```python
{
  "message_id": 12345,
  "group_id": 67890,
  "user_id": 54321,
  "sender_name": "User Nickname",
  "message_type": "group",  # group or private
  "message": "Message content",
  "platform_id": "aiocqhttp",
  "raw_message": "...",  # Original message
  "timestamp": 1234567890
}
```

## Message Processing Flow

1. Platform receives message
2. Convert to unified message model
3. Send to NekoBot event queue
4. Distribute to plugins for processing
5. Convert back to platform-specific format for sending

## Common Issues

### Connecting Multiple Platforms

NekoBot supports connecting to multiple platforms simultaneously. Simply add multiple platforms in the configuration file.

### Message Forwarding

Cross-platform message forwarding can be achieved through plugins.

### Platform Limitations

Different platforms have different API limitations. Please refer to the documentation for each platform.
