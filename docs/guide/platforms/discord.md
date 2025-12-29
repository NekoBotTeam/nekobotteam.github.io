# Discord 平台对接

NekoBot 支持 Discord 平台，通过 Discord Bot API 对接。

## Discord Bot 令牌

### 1. 创建 Discord 应用

1. 访问 [Discord 开发者门户](https://discord.com/developers/applications)
2. 点击 "New Application" 创建新应用
3. 进入 "Bot" 页面，点击 "Add Bot"
4. 复制 Bot Token

### 2. 配置 NekoBot

编辑 `data/platforms_sources.json`：

```json
{
  "discord": {
    "type": "discord",
    "enable": true,
    "id": "discord",
    "token": "your-bot-token-here",
    "command_prefix": "/"
  }
}
```

### 3. 配置 Bot 权限

在 Discord 开发者门户设置 Bot 权限：

- `Send Messages` - 发送消息
- `Embed Links` - 嵌入链接
- `Attach Files` - 附件文件
- `Read Message History` - 读取消息历史
- `Add Reactions` - 添加表情
- `Use Slash Commands` - 使用斜杠命令

### 4. 邀请 Bot

生成邀请链接：

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot
```

或使用 Discord 开发者门户的 "OAuth2" 页面生成邀请链接。

## 消息事件

### 支持的事件

| 事件类型 | 说明 |
|----------|------|
| 消息创建 | 新消息 |
| 消息编辑 | 消息编辑 |
| 消息删除 | 消息删除 |
| 反应添加 | 表情反应添加 |
| 反应删除 | 表情反应删除 |
| 成员加入 | 成员加入服务器 |
| 成员离开 | 成员离开服务器 |

## 消息格式

Discord 消息使用 Markdown 格式：

```python
# 普通文本
message = "Hello World!"

# 加粗
message = "**Bold Text**"

# 斜体
message = "*Italic Text*"

# 代码
message = "`Code`"

# 代码块
message = "```python\nprint('Hello')\n```"

# 链接
message = "[Text](https://example.com)"

# 提及用户
message = f"<@{user_id}>"

# 提及角色
message = f"<@&{role_id}>"
```

## 嵌入消息

Discord 支持嵌入消息（Embed）：

```python
async def send_embed(self, channel_id, title, description):
    embed = {
        "title": title,
        "description": description,
        "color": 0x00ff00,
        "fields": [
            {"name": "字段1", "value": "值1", "inline": True},
            {"name": "字段2", "value": "值2", "inline": True}
        ],
        "footer": {"text": "NekoBot"},
        "timestamp": "2025-01-01T00:00:00Z"
    }
    await self.platform_server.call_platform_api(
        platform_id="discord",
        action="send_embed",
        params={"channel_id": channel_id, "embed": embed}
    )
```

## 斜杠命令

Discord 支持斜杠命令（Slash Commands）：

### 注册斜杠命令

```python
async def register_slash_command(self, name, description):
    await self.platform_server.call_platform_api(
        platform_id="discord",
        action="register_command",
        params={
            "name": name,
            "description": description,
            "options": [
                {
                    "name": "option1",
                    "description": "选项1",
                    "type": 3,  # STRING
                    "required": True
                }
            ]
        }
    )
```

### 处理斜杠命令

```python
async def on_message(self, message):
    if message.get("type") == "interaction":
        interaction = message
        command_name = interaction.get("data", {}).get("name")
        
        if command_name == "hello":
            await self.respond_to_interaction(
                interaction_id=interaction["id"],
                interaction_token=interaction["token"],
                content="Hello!"
            )
```

## 高级功能

### 发送文件

```python
async def send_file(self, channel_id, file_path):
    with open(file_path, "rb") as f:
        await self.platform_server.call_platform_api(
            platform_id="discord",
            action="send_file",
            params={"channel_id": channel_id, "file": f}
        )
```

### 获取服务器信息

```python
async def get_guild_info(self, guild_id):
    result = await self.platform_server.call_platform_api(
        platform_id="discord",
        action="get_guild",
        params={"guild_id": guild_id}
    )
    return result.get("data")
```

### 获取成员列表

```python
async def get_members(self, guild_id):
    result = await self.platform_server.call_platform_api(
        platform_id="discord",
        action="get_members",
        params={"guild_id": guild_id}
    )
    return result.get("data", [])
```

## Discord API 限制

Discord API 有速率限制：

| 操作类型 | 限制 |
|----------|------|
| 全局 | 50 请求/秒 |
| 每个频道 | 5 请求/5秒 |
| 每个成员 | 1 请求/秒 |

建议实现请求队列以避免触发限制。

## 常见问题

### Bot 无法收到消息

1. 检查 Bot 是否已添加到服务器
2. 确认 Bot 有"读取消息"权限
3. 检查 INTENTS 配置是否正确

### 消息发送失败

1. 确认 Bot 有"发送消息"权限
2. 检查频道是否允许 Bot 发送消息
3. 验证 Token 是否正确

### 速率限制

如果遇到速率限制错误：
1. 实现指数退避重试
2. 减少请求频率
3. 使用批量操作

## 相关链接

- [Discord API 文档](https://discord.com/developers/docs/intro)
- [Discord Bot 指南](https://discord.com/developers/docs/topics/guides)
- [Slash Commands](https://discord.com/developers/docs/interactions/application-commands)
