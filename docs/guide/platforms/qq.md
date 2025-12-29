# QQ 平台对接

NekoBot 支持 QQ 平台，通过 OneBot V11 协议对接。

## OneBot V11 协议

OneBot V11 是 CQHTTP 的继承者，是一个通用的机器人消息接口标准。

## 快速开始

### 1. 安装 NapCatQQ

NapCatQQ 是基于 NTQQ 的 OneBot V11 实现。

#### Windows

1. 下载 [NapCatQQ](https://github.com/NapNeko/NapCatQQ/releases)
2. 解压并运行
3. 按照提示配置

#### Linux

```bash
git clone https://github.com/NapNeko/NapCatQQ.git
cd NapCatQQ
docker run -d --name napcat -p 6299:6299 ghcr.io/mlikiowa/napcat-docker:latest
```

### 2. 配置 NekoBot

编辑 `data/platforms_sources.json`：

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

### 3. 配置 NapCatQQ

在 NapCatQQ 配置文件中设置 WebSocket 服务：

```yaml
onebot:
  http:
    enable: false
  ws:
    enable: true
    host: 0.0.0.0
    port: 6299
```

### 4. 启动服务

1. 启动 NapCatQQ
2. 启动 NekoBot：
```bash
python main.py
```

## 事件类型

NekoBot 支持以下 QQ 事件：

### 消息事件

| 事件类型 | 说明 |
|----------|------|
| 群消息 | 群组内的消息 |
| 私聊消息 | 私聊消息 |
| 群提示消息 | 群组提示消息（如入群、退群） |
| 频道消息 | QQ 频道消息 |

### 通知事件

| 事件类型 | 说明 |
|----------|------|
| 群成员增加 | 新成员加入群组 |
| 群成员减少 | 成员离开群组 |
| 群禁言 | 群组禁言事件 |
| 好友添加 | 好友添加事件 |

## 消息发送

### 发送群消息

```python
await self.send_group_message(
    group_id=123456,
    user_id=789,
    message="Hello!",
    platform_id="aiocqhttp"
)
```

### 发送私聊消息

```python
await self.send_private_message(
    user_id=789,
    message="Hello!",
    platform_id="aiocqhttp"
)
```

### 发送图片

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

### 发送富文本消息

```python
async def send_rich_message(self, group_id, user_id):
    message = (
        "欢迎使用 NekoBot!\n"
        "[CQ:face,id=128]\n"
        "点击查看更多：https://example.com"
    )
    await self.send_group_message(
        group_id=group_id,
        user_id=user_id,
        message=message,
        platform_id="aiocqhttp"
    )
```

## CQ 码格式

OneBot V11 使用 CQ 码表示特殊消息元素：

| CQ 码 | 说明 | 示例 |
|-------|------|------|
| `[CQ:image,file=xxx]` | 图片 | `[CQ:image,file=http://example.com/image.jpg]` |
| `[CQ:record,file=xxx]` | 语音 | `[CQ:record,file=http://example.com/audio.mp3]` |
| `[CQ:at,id=xxx]` | @某人 | `[CQ:at,id=123456]` |
| `[CQ:face,id=xxx]` | 表情 | `[CQ:face,id=128]` |
| `[CQ:share,url=xxx]` | 链接分享 | `[CQ:share,url=https://example.com]` |
| `[CQ:music,id=xxx]` | 音乐分享 | `[CQ:music,id=123456]` |

## 高级功能

### 群组管理

```python
async def kick_user(self, group_id, user_id, reject_add_request=False):
    # 踢出群成员
    await self.platform_server.call_platform_api(
        platform_id="aiocqhttp",
        action="set_group_kick",
        params={"group_id": group_id, "user_id": user_id, "reject_add_request": reject_add_request}
    )

async def mute_user(self, group_id, user_id, duration=60):
    # 禁言用户（秒）
    await self.platform_server.call_platform_api(
        platform_id="aiocqhttp",
        action="set_group_ban",
        params={"group_id": group_id, "user_id": user_id, "duration": duration}
    )
```

### 好友操作

```python
async def add_friend(self, user_id, comment=""):
    # 添加好友
    await self.platform_server.call_platform_api(
        platform_id="aiocqhttp",
        action="set_friend_add_request",
        params={"flag": flag, "approve": True, "remark": comment}
    )
```

### 获取群成员列表

```python
async def get_group_members(self, group_id):
    result = await self.platform_server.call_platform_api(
        platform_id="aiocqhttp",
        action="get_group_member_list",
        params={"group_id": group_id}
    )
    return result.get("data", [])
```

## 常见问题

### 连接失败

检查以下几点：
1. NapCatQQ 是否正常运行
2. WebSocket 端口是否正确
3. 防火墙是否允许连接
4. NekoBot 是否有权限访问 NapCatQQ

### 消息发送失败

1. 检查机器人是否有权限在群组内发送消息
2. 确认 CQ 码格式是否正确
3. 检查消息内容是否包含违规内容

### 群组权限问题

确保机器人账号具有以下权限：
- 发送消息权限
- @全体成员权限（如需）
- 管理员权限（如需执行管理操作）

## 相关链接

- [OneBot V11 规范](https://11.onebot.dev/)
- [NapCatQQ GitHub](https://github.com/NapNeko/NapCatQQ)
- [CQ 码列表](https://docs.go-cqhttp.org/cqcode)
