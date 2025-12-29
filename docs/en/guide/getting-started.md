---
layout: page
title: Quick Start
---

# Quick Start

This guide will help you get started with NekoBot, from installation to running your first bot.

## Requirements

- **Python**: 3.10 or higher
- **Operating System**: Windows / Linux / macOS
- **Memory**: 2GB or more recommended
- **Network**: Internet access required for installing dependencies and connecting to LLM services

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/NekoBotTeam/NekoBot.git
cd NekoBot
```

### 2. Install Dependencies

NekoBot provides two ways to install dependencies: using uv (recommended) or using pip.

#### Using uv (Recommended)

```bash
# Install uv (if not already installed)
pip install uv

# Install NekoBot and its dependencies
uv pip install -e .
```

#### Using pip

```bash
# Install NekoBot and its dependencies
pip install -e .
```

### 3. Create Configuration File

On first run, NekoBot will automatically create a default configuration file. You can also manually create `data/cmd_config.json`:

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

### 4. Start NekoBot

```bash
# Using uv
uv run main.py

# Or using python
python main.py
```

### 5. Access Web Dashboard

After successful startup, open your browser and visit:

```
http://localhost:6285
```

## Default Account

NekoBot provides a default administrator account:

- **Username**: `nekobot`
- **Password**: `nekobot`

> **Security Note**: On first login, the system will require you to change your password. Please change it to ensure security.

## Verify Installation

After starting NekoBot, you should see similar log output in the terminal:

```
2025-XX-XX XX:XX:XX.XXX [INFO] Starting NekoBot...
2025-XX-XX XX:XX:XX.XXX [INFO] Initializing NekoBot server...
2025-XX-XX XX:XX:XX.XXX [INFO] Platform adapter registered: aiocqhttp
2025-XX-XX XX:XX:XX.XXX [INFO] Loading plugins...
2025-XX-XX XX:XX:XX.XXX [INFO] Plugin loading complete, X plugins loaded
2025-XX-XX XX:XX:XX.XXX [INFO] Starting Quart application: http://0.0.0.0:6285
```

## Next Steps

- [Installation and Configuration](./installation.md) - Learn detailed configuration options
- [Platform Integration](./platforms.md) - Configure chat platforms
- [LLM Configuration](./llm.md) - Configure AI models
- [Plugin System](./plugins.md) - Learn about plugin development

## Common Issues

### How to change the port?

Edit the `data/cmd_config.json` file and modify the `server.port` field:

```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 8080
  }
}
```

### Forgot password?

Run the following command to reset your password:

```bash
# Using uv
uv run main.py reset-password

# Or using python
python main.py reset-password
```

Follow the prompts to enter your new password twice.

### How to enable or disable the Web dashboard?

Edit `data/cmd_config.json` and modify the `webui_enabled` field:

```json
{
  "webui_enabled": true
}
```

### How to view logs?

NekoBot outputs logs to the terminal using loguru. You can also view logs in real-time through the "Logs" page of the Web dashboard.
