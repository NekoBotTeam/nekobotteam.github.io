---
layout: page
title: QQ Platform Integration
---

# QQ Platform Integration

NekoBot supports the QQ platform through the OneBot V11 protocol.

## OneBot V11 Protocol

OneBot V11 is the successor to CQHTTP, a universal robot message interface standard.

## Quick Start

### 1. Install NapCatQQ

NapCatQQ is a OneBot V11 implementation based on NTQQ.

#### Windows

1. Download [NapCatQQ](https://github.com/NapNeko/NapCatQQ/releases)
2. Extract and run
3. Follow the prompts to configure

#### Linux

```bash
git clone https://github.com/NapNeko/NapCatQQ.git
cd NapCatQQ
docker run -d --name napcat -p 6299:6299 ghcr.io/mlikiowa/napcat-docker:latest
```

### 2. Configure NekoBot

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

### 3. Configure NapCatQQ

Set up WebSocket service in NapCatQQ configuration file:

```yaml
onebot:
  http:
    enable: false
  ws:
    enable: true
    host: 0.0.0.0
    port: 6299
```

### 4. Start Services

1. Start NapCatQQ
2. Start NekoBot:
```bash
python main.py
```

## Event Types

NekoBot supports the following QQ events:

### Message Events

| Event Type | Description |
|------------|-------------|
| Group Message | Messages in groups |
| Private Message | Private messages |
| Group Notice Message | Group notice messages (e.g., join, leave) |
| Channel Message | QQ channel messages |

### Notification Events

| Event Type | Description |
|------------|-------------|
| Group Member Increase | New member joins group |
| Group Member Decrease | Member leaves group |
| Group Mute | Group mute event |
| Friend Add | Friend add event |

## Sending Messages

### Send Group Message

```python
await self.send_group_message(
    group_id=123456,
    user_id=789,
    message="Hello!",
    platform_id="aiocqhttp"
)
```

### Send Private Message

```python
await self.send_private_message(
    user_id=789,
    message="Hello!",
    platform_id="aiocqhttp"
)
```

### Send Image

```python
import httpx

async def send_image(self, group_id, user_id, image_url):
    await self.send_group_message(
        group_id=group_id,
        user_id=user_id,
        message=f"[CQ:image,file={image_url}]",
        platform_id="aiocqhttp"
    )
```

### Send Rich Message

```python
async def send_rich_message(self, group_id, user_id):
    message = (
        "Welcome to NekoBot!\n"
        "[CQ:face,id=128]\n"
        "Click for more: https://example.com"
    )
    await self.send_group_message(
        group_id=group_id,
        user_id=user_id,
        message=message,
        platform_id="aiocqhttp"
    )
```

## CQ Code Format

OneBot V11 uses CQ codes to represent special message elements:

| CQ Code | Description | Example |
|----------|-------------|---------|
| `[CQ:image,file=xxx]` | Image | `[CQ:image,file=http://example.com/image.jpg]` |
| `[CQ:record,file=xxx]` | Voice | `[CQ:record,file=http://example.com/audio.mp3]` |
| `[CQ:at,id=xxx]` | Mention | `[CQ:at,id=123456]` |
| `[CQ:face,id=xxx]` | Emoji | `[CQ:face,id=128]` |
| `[CQ:share,url=xxx]` | Link share | `[CQ:share,url=https://example.com]` |
| `[CQ:music,id=xxx]` | Music share | `[CQ:music,id=123456]` |

## Advanced Features

### Group Management

```python
async def kick_user(self, group_id, user_id, reject_add_request=False):
    await self.platform_server.call_platform_api(
        platform_id="aiocqhttp",
        action="set_group_kick",
        params={"group_id": group_id, "user_id": user_id, "reject_add_request": reject_add_request}
    )

async def mute_user(self, group_id, user_id, duration=60):
    await self.platform_server.call_platform_api(
        platform_id="aiocqhttp",
        action="set_group_ban",
        params={"group_id": group_id, "user_id": user_id, "duration": duration}
    )
```

### Friend Operations

```python
async def add_friend(self, user_id, comment=""):
    await self.platform_server.call_platform_api(
        platform_id="aiocqhttp",
        action="set_friend_add_request",
        params={"flag": flag, "approve": True, "remark": comment}
    )
```

### Get Group Member List

```python
async def get_group_members(self, group_id):
    result = await self.platform_server.call_platform_api(
        platform_id="aiocqhttp",
        action="get_group_member_list",
        params={"group_id": group_id}
    )
    return result.get("data", [])
```

## Common Issues

### Connection Failed

Check the following:
1. NapCatQQ is running normally
2. WebSocket port is correct
3. Firewall allows connection
4. NekoBot has permission to access NapCatQQ

### Message Send Failed

1. Check if bot has permission to send messages in the group
2. Confirm CQ code format is correct
3. Check if message content contains prohibited content

### Group Permission Issues

Ensure the bot account has the following permissions:
- Send message permission
- @all members permission (if needed)
- Admin permission (if management operations are required)

## Related Links

- [OneBot V11 Specification](https://11.onebot.dev/)
- [NapCatQQ GitHub](https://github.com/NapNeko/NapCatQQ)
- [CQ Code List](https://docs.go-cqhttp.org/cqcode)
