# 安装和配置

本节详细介绍 NekoBot 的安装方法、配置选项和部署方式。

## 安装方法

### 从源码安装

#### 使用 uv（推荐）

```bash
# 克隆仓库
git clone https://github.com/NekoBotTeam/NekoBot.git
cd NekoBot

# 使用 uv 安装
uv pip install -e .

# 启动
uv run main.py
```

#### 使用 pip

```bash
# 克隆仓库
git clone https://github.com/NekoBotTeam/NekoBot.git
cd NekoBot

# 使用 pip 安装
pip install -e .

# 启动
python main.py
```

### Docker 部署

NekoBot 提供 Docker 部署支持。

#### 使用 Docker Compose

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

#### 使用 Dockerfile

```bash
# 构建镜像
docker build -t nekobot .

# 运行容器
docker run -d -p 6285:6285 --name nekobot nekobot
```

## 配置文件

NekoBot 的配置文件位于 `data/` 目录下。

### 主配置文件: `data/cmd_config.json`

```json
{
  "command_prefix": "/",
  "server": {
    "host": "0.0.0.0",
    "port": 6285
  },
  "jwt": {
    "secret_key": "your-secret-key-here",
    "algorithm": "HS256",
    "access_token_expire_minutes": 30
  },
  "webui_enabled": true,
  "demo": false
}
```

#### 配置项说明

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `command_prefix` | string | `/` | 命令前缀 |
| `server.host` | string | `0.0.0.0` | 服务器监听地址 |
| `server.port` | number | `6285` | 服务器监听端口 |
| `jwt.secret_key` | string | - | JWT 密钥（生产环境请修改） |
| `jwt.algorithm` | string | `HS256` | JWT 算法 |
| `jwt.access_token_expire_minutes` | number | `30` | Token 过期时间（分钟） |
| `webui_enabled` | boolean | `true` | 是否启用 Web 仪表盘 |
| `demo` | boolean | `false` | 是否为演示模式 |

### 平台配置: `data/platforms_sources.json`

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

### LLM 提供商配置: `data/llm_providers.json`

```json
{
  "openai": {
    "type": "openai",
    "enable": true,
    "id": "openai",
    "api_key": "your-api-key-here",
    "base_url": "https://api.openai.com/v1",
    "model": "gpt-4"
  }
}
```

## 目录结构

```
NekoBot/
├── data/                      # 数据目录
│   ├── plugins/               # 用户插件
│   ├── plugin_data/          # 插件数据
│   ├── cmd_config.json       # 主配置文件
│   ├── platforms_sources.json # 平台配置
│   ├── llm_providers.json    # LLM 配置
│   ├── users.json            # 用户数据
│   └── dist/                 # Web 仪表盘静态文件
│
├── dashboard/                # React 前端源码
├── packages/
│   └── backend/              # 后端代码
├── main.py                   # 主入口
├── pyproject.toml           # Python 项目配置
└── docker-compose.yaml      # Docker 配置
```

## 用户管理

### 默认账户

- 用户名: `nekobot`
- 密码: `nekobot`

### 修改密码

#### 通过 CLI

```bash
python main.py reset-password
```

#### 通过 Web 仪表盘

1. 登录 Web 仪表盘
2. 进入"设置" -> "修改密码"
3. 输入旧密码和新密码

### 用户数据存储

用户数据存储在 `data/users.json` 文件中，采用 bcrypt 密码加密。

## 日志配置

NekoBot 使用 [loguru](https://github.com/Delgan/loguru) 进行日志管理。

### 日志级别

- `DEBUG`: 调试信息
- `INFO`: 一般信息
- `WARNING`: 警告信息
- `ERROR`: 错误信息

### 自定义日志

在 `main.py` 中修改日志配置：

```python
logger.remove()
logger.add(
    sys.stdout,
    format="{time:YYYY-MM-DD HH:mm:ss.SSS} <level>[{level}]</level> {message}",
    level="DEBUG",
    colorize=True,
)
```

## 安全建议

### 生产环境配置

1. **修改默认密码**: 首次登录后立即修改
2. **更改 JWT 密钥**: 修改 `jwt.secret_key` 为随机字符串
3. **使用 HTTPS**: 配置反向代理使用 HTTPS
4. **限制访问**: 使用防火墙限制端口访问
5. **定期备份**: 备份 `data/` 目录

### 生成 JWT 密钥

使用 Python 生成随机密钥：

```python
import secrets
print(secrets.token_urlsafe(32))
```

## 反向代理配置

### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:6285;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket 支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Caddy

```
your-domain.com {
    reverse_proxy 127.0.0.1:6285
}
```

## 常见问题

### 端口被占用

如果 6285 端口被占用，修改 `data/cmd_config.json` 中的端口配置。

### 插件加载失败

检查插件目录结构是否正确：

```
data/plugins/your_plugin/
├── main.py
├── _conf_schema.json (可选)
└── metadata.yaml (可选)
```

### LLM 服务连接失败

检查 API 密钥是否正确，以及网络是否能够访问 LLM 服务商。

### WebSocket 连接失败

确保反向代理正确配置了 WebSocket 支持。
