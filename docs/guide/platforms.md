# 平台对接

NekoBot 支持多个聊天平台，通过统一的平台适配器接口实现跨平台消息处理。

## 支持的平台

| 平台 | 状态 | 协议 |
|------|------|------|
| QQ | ✅ | OneBot V11 (AIOCQHTTP) |
| Discord | ✅ | Discord Bot API |
| Telegram | ✅ | Telegram Bot API |

## 快速开始

选择一个平台开始配置：

- [QQ](./platforms/qq.md) - 使用 NapCatQQ 对接 QQ
- [Discord](./platforms/discord.md) - 使用 Discord Bot API
- [Telegram](./platforms/telegram.md) - 使用 Telegram Bot API

## 平台配置

### 添加平台

在 Web 仪表盘中添加平台：

1. 进入"平台"页面
2. 点击"添加平台"
3. 选择平台类型并填写配置
4. 保存并启用平台

### 通过配置文件添加

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

## 平台适配器

### 开发适配器

如果你需要对接新的平台，可以开发自定义平台适配器。

参考 [QQ 平台适配器](./platforms/qq.md) 的实现。

### 平台 API

每个平台适配器需要实现以下方法：

- `connect()` - 连接到平台
- `send_message()` - 发送消息
- `disconnect()` - 断开连接
- `get_stats()` - 获取统计信息

## 统一消息模型

NekoBot 使用统一的消息模型处理不同平台的差异：

```python
{
  "message_id": 12345,
  "group_id": 67890,
  "user_id": 54321,
  "sender_name": "用户昵称",
  "message_type": "group",  # group 或 private
  "message": "消息内容",
  "platform_id": "aiocqhttp",
  "raw_message": "...",  # 原始消息
  "timestamp": 1234567890
}
```

## 消息处理流程

1. 平台接收消息
2. 转换为统一消息模型
3. 发送到 NekoBot 事件队列
4. 分发到插件处理
5. 转换回平台特定格式发送

## 常见问题

### 同时连接多个平台

NekoBot 支持同时连接多个平台，在配置文件中添加多个平台即可。

### 消息转发

通过插件可以实现跨平台消息转发。

### 平台限制

不同平台有不同的 API 限制，请参考对应平台的文档。
