# Telegram 平台对接

NekoBot 支持 Telegram 平台，通过 Telegram Bot API 对接。

## Telegram Bot 令牌

### 1. 创建 Bot

1. 在 Telegram 中搜索 [@BotFather](https://t.me/BotFather)
2. 发送 `/newbot` 命令
3. 按照提示输入 Bot 名称和用户名
4. 复制获得的 API Token

### 2. 配置 NekoBot

编辑 `data/platforms_sources.json`：

```json
{
  "telegram": {
    "type": "telegram",
    "enable": true,
    "id": "telegram",
    "token": "your-bot-token-here",
    "command_prefix": "/"
  }
}
```

### 3. 设置 Webhook（可选）

Telegram 支持 Webhook 和长轮询两种模式：

#### Webhook 模式

```python
async def set_webhook(self, webhook_url):
    await self.platform_server.call_platform_api(
        platform_id="telegram",
        action="set_webhook",
        params={"url": webhook_url}
    )
```

#### 长轮询模式（默认）

无需额外配置，NekoBot 自动使用长轮询获取消息。

## 消息事件

### 支持的事件

| 事件类型 | 说明 |
|----------|------|
| 消息 | 文本、图片、视频等消息 |
| 回调查询 | 回调按钮点击 |
| 内联查询 | 内联搜索 |
| 成员加入 | 成员加入群组 |
| 成员离开 | 成员离开群组 |

## 消息格式

Telegram 消息支持 Markdown 和 HTML 格式：

### Markdown 模式

```python
message = """
*加粗文本*
_斜体文本_
`代码`
```代码块```
[链接](https://example.com)
"""
```

### HTML 模式

```python
message = """
<b>加粗文本</b>
<i>斜体文本</i>
<code>代码</code>
<pre>代码块</pre>
<a href="https://example.com">链接</a>
"""
```

## 消息类型

### 发送文本消息

```python
await self.send_group_message(
    group_id=chat_id,
    user_id=user_id,
    message="Hello!",
    platform_id="telegram"
)
```

### 发送图片

```python
async def send_photo(self, chat_id, photo_url, caption=""):
    await self.platform_server.call_platform_api(
        platform_id="telegram",
        action="send_photo",
        params={
            "chat_id": chat_id,
            "photo": photo_url,
            "caption": caption
        }
    )
```

### 发送视频

```python
async def send_video(self, chat_id, video_url, caption=""):
    await self.platform_server.call_platform_api(
        platform_id="telegram",
        action="send_video",
        params={
            "chat_id": chat_id,
            "video": video_url,
            "caption": caption
        }
    )
```

### 发送文件

```python
async def send_document(self, chat_id, file_path, caption=""):
    await self.platform_server.call_platform_api(
        platform_id="telegram",
        action="send_document",
        params={
            "chat_id": chat_id,
            "document": file_path,
            "caption": caption
        }
    )
```

## 按钮和键盘

### 内联键盘

```python
async def send_inline_keyboard(self, chat_id):
    keyboard = {
        "inline_keyboard": [
            [
                {"text": "按钮1", "callback_data": "btn1"},
                {"text": "按钮2", "callback_data": "btn2"}
            ],
            [
                {"text": "链接", "url": "https://example.com"}
            ]
        ]
    }
    await self.platform_server.call_platform_api(
        platform_id="telegram",
        action="send_message",
        params={
            "chat_id": chat_id,
            "text": "请选择：",
            "reply_markup": keyboard
        }
    )
```

### 回复键盘

```python
async def send_reply_keyboard(self, chat_id):
    keyboard = {
        "keyboard": [
            [{"text": "选项1"}, {"text": "选项2"}],
            [{"text": "取消"}]
        ],
        "resize_keyboard": True,
        "one_time_keyboard": False
    }
    await self.platform_server.call_platform_api(
        platform_id="telegram",
        action="send_message",
        params={
            "chat_id": chat_id,
            "text": "请选择：",
            "reply_markup": keyboard
        }
    )
```

## 处理回调查询

```python
async def on_message(self, message):
    if message.get("callback_query"):
        callback = message["callback_query"]
        callback_id = callback["id"]
        data = callback.get("data")
        
        # 回答回调查询
        await self.answer_callback_query(callback_id, text="已点击")
        
        # 处理按钮点击
        if data == "btn1":
            await self.send_group_message(
                group_id=callback["message"]["chat"]["id"],
                user_id=callback["from"]["id"],
                message="你点击了按钮1",
                platform_id="telegram"
            )

async def answer_callback_query(self, callback_id, text=""):
    await self.platform_server.call_platform_api(
        platform_id="telegram",
        action="answer_callback_query",
        params={"callback_query_id": callback_id, "text": text}
    )
```

## 高级功能

### 获取用户信息

```python
async def get_user_profile(self, user_id):
    result = await self.platform_server.call_platform_api(
        platform_id="telegram",
        action="get_chat",
        params={"chat_id": user_id}
    )
    return result.get("data")
```

### 获取群组信息

```python
async def get_group_info(self, group_id):
    result = await self.platform_server.call_platform_api(
        platform_id="telegram",
        action="get_chat",
        params={"chat_id": group_id}
    )
    return result.get("data")
```

### 设置命令菜单

```python
async def set_bot_commands(self):
    commands = [
        {"command": "start", "description": "开始使用"},
        {"command": "help", "description": "帮助"},
        {"command": "settings", "description": "设置"}
    ]
    await self.platform_server.call_platform_api(
        platform_id="telegram",
        action="set_my_commands",
        params={"commands": commands}
    )
```

### 获取群组成员

```python
async def get_group_members(self, group_id):
    result = await self.platform_server.call_platform_api(
        platform_id="telegram",
        action="get_chat_member_count",
        params={"chat_id": group_id}
    )
    return result.get("data", {})
```

## 文件大小限制

Telegram API 有以下文件大小限制：

| 文件类型 | 大小限制 |
|----------|----------|
| 照片 | 10 MB |
| 视频 | 50 MB |
| 文档 | 50 MB（Premium 用户 2 GB） |
| 音频 | 50 MB |
| 动画 | 50 MB |

## 常见问题

### Bot 无法收到消息

1. 确保 Bot 已添加到群组
2. 检查 Bot 有权限接收消息
3. 验证 Token 是否正确

### 消息发送失败

1. 确认 Bot 有发送消息权限
2. 检查消息内容是否符合 Telegram 规范
3. 验证聊天 ID 是否正确

### Webhook 设置失败

1. 确保 Webhook URL 可访问
2. 使用 HTTPS（Telegram 要求）
3. 验证 SSL 证书有效

## 相关链接

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [BotFather](https://t.me/BotFather)
- [Telegram 机器人开发指南](https://core.telegram.org/bots/features)
