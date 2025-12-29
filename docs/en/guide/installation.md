---
layout: page
title: Installation and Configuration
---

# Installation and Configuration

This section details NekoBot installation methods, configuration options, and deployment options.

## Installation Methods

### Install from Source

#### Using uv (Recommended)

```bash
# Clone repository
git clone https://github.com/NekoBotTeam/NekoBot.git
cd NekoBot

# Install with uv
uv pip install -e .

# Start
uv run main.py
```

#### Using pip

```bash
# Clone repository
git clone https://github.com/NekoBotTeam/NekoBot.git
cd NekoBot

# Install with pip
pip install -e .

# Start
python main.py
```

### Docker Deployment

NekoBot provides Docker deployment support.

#### Using Docker Compose

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

#### Using Dockerfile

```bash
# Build image
docker build -t nekobot .

# Run container
docker run -d -p 6285:6285 --name nekobot nekobot
```

## Configuration Files

NekoBot configuration files are located in the `data/` directory.

### Main Configuration File: `data/cmd_config.json`

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

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `command_prefix` | string | `/` | Command prefix |
| `server.host` | string | `0.0.0.0` | Server listening address |
| `server.port` | number | `6285` | Server listening port |
| `jwt.secret_key` | string | - | JWT secret key (change in production) |
| `jwt.algorithm` | string | `HS256` | JWT algorithm |
| `jwt.access_token_expire_minutes` | number | `30` | Token expiration time (minutes) |
| `webui_enabled` | boolean | `true` | Enable Web dashboard |
| `demo` | boolean | `false` | Demo mode |

### Platform Configuration: `data/platforms_sources.json`

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

### LLM Provider Configuration: `data/llm_providers.json`

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

## Directory Structure

```
NekoBot/
├── data/                      # Data directory
│   ├── plugins/               # User plugins
│   ├── plugin_data/          # Plugin data
│   ├── cmd_config.json       # Main configuration file
│   ├── platforms_sources.json # Platform configuration
│   ├── llm_providers.json    # LLM configuration
│   ├── users.json            # User data
│   └── dist/                 # Web dashboard static files
│
├── dashboard/                # React frontend source
├── packages/
│   └── backend/              # Backend code
├── main.py                   # Main entry point
├── pyproject.toml           # Python project configuration
└── docker-compose.yaml      # Docker configuration
```

## User Management

### Default Account

- Username: `nekobot`
- Password: `nekobot`

### Change Password

#### Via CLI

```bash
python main.py reset-password
```

#### Via Web Dashboard

1. Login to Web dashboard
2. Go to "Settings" -> "Change Password"
3. Enter old password and new password

### User Data Storage

User data is stored in the `data/users.json` file with bcrypt password encryption.

## Log Configuration

NekoBot uses [loguru](https://github.com/Delgan/loguru) for log management.

### Log Levels

- `DEBUG`: Debug information
- `INFO`: General information
- `WARNING`: Warning information
- `ERROR`: Error information

### Custom Logging

Modify log configuration in `main.py`:

```python
logger.remove()
logger.add(
    sys.stdout,
    format="{time:YYYY-MM-DD HH:mm:ss.SSS} <level>[{level}]</level> {message}",
    level="DEBUG",
    colorize=True,
)
```

## Security Recommendations

### Production Configuration

1. **Change default password**: Change immediately after first login
2. **Change JWT secret**: Modify `jwt.secret_key` to a random string
3. **Use HTTPS**: Configure reverse proxy to use HTTPS
4. **Restrict access**: Use firewall to restrict port access
5. **Regular backups**: Backup the `data/` directory

### Generate JWT Secret Key

Generate a random secret key using Python:

```python
import secrets
print(secrets.token_urlsafe(32))
```

## Reverse Proxy Configuration

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
        
        # WebSocket support
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

## Common Issues

### Port Already in Use

If port 6285 is already in use, modify the port configuration in `data/cmd_config.json`.

### Plugin Loading Failed

Check if the plugin directory structure is correct:

```
data/plugins/your_plugin/
├── main.py
├── _conf_schema.json (optional)
└── metadata.yaml (optional)
```

### LLM Service Connection Failed

Check if the API key is correct and if the network can access the LLM service provider.

### WebSocket Connection Failed

Ensure the reverse proxy is correctly configured with WebSocket support.
