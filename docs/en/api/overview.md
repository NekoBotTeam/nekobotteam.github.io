# API Overview

NekoBot provides comprehensive RESTful API and WebSocket API for interacting with the backend services.

## Basic Information

- **Base URL**: `http://localhost:6285/api`
- **Authentication**: JWT Bearer Token
- **Content Type**: `application/json`

## Authentication

All authenticated APIs require a JWT Token in the request header:

```http
Authorization: Bearer <your_token>
```

Get Token:

```http
POST /api/login
Content-Type: application/json

{
  "username": "nekobot",
  "password": "nekobot"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

## API Endpoints

### Authentication

| Endpoint | Method | Description | Auth |
|-----------|--------|-------------|-------|
| `/api/login` | POST | User login | No |
| `/api/logout` | POST | User logout | Yes |

### Bot Configuration

| Endpoint | Method | Description | Auth |
|-----------|--------|-------------|-------|
| `/api/bot/config` | GET | Get configuration | Yes |
| `/api/bot/config` | PUT | Update configuration | Yes |

### Plugin Management

| Endpoint | Method | Description | Auth |
|-----------|--------|-------------|-------|
| `/api/plugins` | GET | Get plugin list | Yes |
| `/api/plugins/enable` | POST | Enable plugin | No |
| `/api/plugins/disable` | POST | Disable plugin | No |
| `/api/plugins/reload` | POST | Reload plugin | No |
| `/api/plugins/upload` | POST | Upload plugin | No |
| `/api/plugins/delete` | DELETE | Delete plugin | No |
| `/api/plugins/config` | GET | Get plugin configuration | Yes |
| `/api/plugins/config` | PUT | Update plugin configuration | Yes |

### Platform Management

| Endpoint | Method | Description | Auth |
|-----------|--------|-------------|-------|
| `/api/platforms` | GET | Get platform list | Yes |
| `/api/platforms` | POST | Add platform | Yes |
| `/api/platforms/<id>` | DELETE | Delete platform | Yes |
| `/api/platform/stats` | GET | Get platform statistics | No |

### LLM Management

| Endpoint | Method | Description | Auth |
|-----------|--------|-------------|-------|
| `/api/llm/providers` | GET | Get LLM provider list | Yes |
| `/api/llm/providers` | POST | Add LLM provider | Yes |
| `/api/llm/providers/<id>` | DELETE | Delete LLM provider | Yes |
| `/api/llm/chat` | POST | Send chat request | No |

### Personality Management

| Endpoint | Method | Description | Auth |
|-----------|--------|-------------|-------|
| `/api/personalities` | GET | Get personality list | Yes |
| `/api/personalities` | POST | Create personality | Yes |
| `/api/personalities/<id>` | DELETE | Delete personality | Yes |
| `/api/personalities/default` | PUT | Set default personality | Yes |

### Command Management

| Endpoint | Method | Description | Auth |
|-----------|--------|-------------|-------|
| `/api/commands` | GET | Get all commands | No |
| `/api/commands/conflicts` | GET | Check command conflicts | No |

### Log Management

| Endpoint | Method | Description | Auth |
|-----------|--------|-------------|-------|
| `/api/logs` | GET | Get logs | Yes |

### MCP Management

| Endpoint | Method | Description | Auth |
|-----------|--------|-------------|-------|
| `/api/mcp/servers` | GET | Get MCP server list | Yes |
| `/api/mcp/servers` | POST | Add MCP server | Yes |
| `/api/mcp/servers/<id>` | DELETE | Delete MCP server | Yes |

### Settings Management

| Endpoint | Method | Description | Auth |
|-----------|--------|-------------|-------|
| `/api/settings` | GET | Get settings | Yes |
| `/api/settings` | PUT | Update settings | Yes |

### Chat Related

| Endpoint | Method | Description | Auth |
|-----------|--------|-------------|-------|
| `/chat/send` | POST | Send chat message | No |
| `/chat/new_session` | POST | Create new session | No |
| `/chat/sessions` | GET | Get session list | No |
| `/chat/get_session` | GET | Get session details | No |
| `/chat/delete_session` | DELETE | Delete session | No |

## WebSocket API

### Connect WebSocket

```javascript
const ws = new WebSocket("ws://localhost:6285/ws");
```

### Subscribe to Channels

```javascript
ws.send(JSON.stringify({
  action: "subscribe",
  channels: ["logs", "events"]
}));
```

### Available Channels

| Channel | Description |
|---------|-------------|
| `logs` | Real-time logs |
| `events` | Event notifications |

## Response Format

### Success Response

```json
{
  "status": "success",
  "data": {...}
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description"
}
```

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 400 | Invalid request parameters |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource not found |
| 500 | Server error |

## Rate Limiting

Some APIs may have rate limiting, please check the response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1234567890
```

## Common Parameters

### Pagination Parameters

For list-returning APIs, you can use the following pagination parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `page_size` | integer | 20 | Items per page |

### Sorting Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `sort_by` | string | Sort field |
| `order` | string | Sort direction: `asc` or `desc` |

## Best Practices

1. **Error Handling**: Always check the `status` field in the response
2. **Token Management**: Keep JWT Token secure and refresh it in time
3. **Concurrency Control**: Observe rate limits, avoid excessive concurrent requests
4. **Caching**: Use caching for frequently accessed data
5. **HTTPS**: Use HTTPS to protect data transmission in production
