# API 概览

NekoBot 提供了完整的 RESTful API 和 WebSocket API，用于与后端服务进行交互。

## 基础信息

- **基础 URL**: `http://localhost:6285/api`
- **认证方式**: JWT Bearer Token
- **内容类型**: `application/json`

## 认证

所有需要认证的 API 都需要在请求头中携带 JWT Token：

```http
Authorization: Bearer <your_token>
```

获取 Token：
```http
POST /api/login
Content-Type: application/json

{
  "username": "nekobot",
  "password": "nekobot"
}
```

响应：
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

## API 端点

### 认证相关

| 端点 | 方法 | 描述 | 认证 |
|--------|------|------|------|
| `/api/login` | POST | 用户登录 | 否 |
| `/api/logout` | POST | 用户登出 | 是 |

### 机器人配置

| 端点 | 方法 | 描述 | 认证 |
|--------|------|------|------|
| `/api/bot/config` | GET | 获取配置 | 是 |
| `/api/bot/config` | PUT | 更新配置 | 是 |

### 插件管理

| 端点 | 方法 | 描述 | 认证 |
|--------|------|------|------|
| `/api/plugins` | GET | 获取插件列表 | 是 |
| `/api/plugins/enable` | POST | 启用插件 | 否 |
| `/api/plugins/disable` | POST | 禁用插件 | 否 |
| `/api/plugins/reload` | POST | 重载插件 | 否 |
| `/api/plugins/upload` | POST | 上传插件 | 否 |
| `/api/plugins/delete` | DELETE | 删除插件 | 否 |
| `/api/plugins/config` | GET | 获取插件配置 | 是 |
| `/api/plugins/config` | PUT | 更新插件配置 | 是 |

### 平台管理

| 端点 | 方法 | 描述 | 认证 |
|--------|------|------|------|
| `/api/platforms` | GET | 获取平台列表 | 是 |
| `/api/platforms` | POST | 添加平台 | 是 |
| `/api/platforms/<id>` | DELETE | 删除平台 | 是 |
| `/api/platform/stats` | GET | 获取平台统计 | 否 |

### LLM 管理

| 端点 | 方法 | 描述 | 认证 |
|--------|------|------|------|
| `/api/llm/providers` | GET | 获取 LLM 提供商列表 | 是 |
| `/api/llm/providers` | POST | 添加 LLM 提供商 | 是 |
| `/api/llm/providers/<id>` | DELETE | 删除 LLM 提供商 | 是 |
| `/api/llm/chat` | POST | 发送聊天请求 | 否 |

### 人格管理

| 端点 | 方法 | 描述 | 认证 |
|--------|------|------|------|
| `/api/personalities` | GET | 获取人格列表 | 是 |
| `/api/personalities` | POST | 创建人格 | 是 |
| `/api/personalities/<id>` | DELETE | 删除人格 | 是 |
| `/api/personalities/default` | PUT | 设置默认人格 | 是 |

### 命令管理

| 端点 | 方法 | 描述 | 认证 |
|--------|------|------|------|
| `/api/commands` | GET | 获取所有命令 | 否 |
| `/api/commands/conflicts` | GET | 检查命令冲突 | 否 |

### 日志管理

| 端点 | 方法 | 描述 | 认证 |
|--------|------|------|------|
| `/api/logs` | GET | 获取日志 | 是 |

### MCP 管理

| 端点 | 方法 | 描述 | 认证 |
|--------|------|------|------|
| `/api/mcp/servers` | GET | 获取 MCP 服务器列表 | 是 |
| `/api/mcp/servers` | POST | 添加 MCP 服务器 | 是 |
| `/api/mcp/servers/<id>` | DELETE | 删除 MCP 服务器 | 是 |

### 设置管理

| 端点 | 方法 | 描述 | 认证 |
|--------|------|------|------|
| `/api/settings` | GET | 获取设置 | 是 |
| `/api/settings` | PUT | 更新设置 | 是 |

### 聊天相关

| 端点 | 方法 | 描述 | 认证 |
|--------|------|------|------|
| `/chat/send` | POST | 发送聊天消息 | 否 |
| `/chat/new_session` | POST | 创建新会话 | 否 |
| `/chat/sessions` | GET | 获取会话列表 | 否 |
| `/chat/get_session` | GET | 获取会话详情 | 否 |
| `/chat/delete_session` | DELETE | 删除会话 | 否 |

## WebSocket API

### 连接 WebSocket

```javascript
const ws = new WebSocket("ws://localhost:6285/ws");
```

### 订阅频道

```javascript
ws.send(JSON.stringify({
  action: "subscribe",
  channels: ["logs", "events"]
}));
```

### 可用频道

| 频道 | 描述 |
|------|------|
| `logs` | 实时日志 |
| `events` | 事件通知 |

## 响应格式

### 成功响应

```json
{
  "status": "success",
  "data": {...}
}
```

### 错误响应

```json
{
  "status": "error",
  "message": "错误描述"
}
```

## 错误码

| 状态码 | 描述 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

## 速率限制

某些 API 可能有速率限制，请在响应头中查看：

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1234567890
```

## 通用参数

### 分页参数

对于返回列表的 API，可以使用以下分页参数：

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `page` | integer | 1 | 页码 |
| `page_size` | integer | 20 | 每页数量 |

### 排序参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `sort_by` | string | 排序字段 |
| `order` | string | 排序方向：`asc` 或 `desc` |

## 最佳实践

1. **错误处理**: 始终检查响应中的 `status` 字段
2. **Token 管理**: 妥善保管 JWT Token，及时刷新
3. **并发控制**: 遵守速率限制，避免过多并发请求
4. **缓存**: 对频繁访问的数据使用缓存
5. **HTTPS**: 生产环境使用 HTTPS 保护数据传输
