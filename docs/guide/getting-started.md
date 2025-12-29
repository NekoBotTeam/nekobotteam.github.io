# 快速开始

本指南将帮助你快速上手 NekoBot，从安装到运行你的第一个机器人。

## 环境要求

- **Python**: 3.10 或更高版本
- **操作系统**: Windows / Linux / macOS
- **内存**: 建议 2GB 以上
- **网络**: 需要访问互联网以安装依赖和连接 LLM 服务

## 安装步骤

### 1. 克隆仓库

```bash
git clone https://github.com/NekoBotTeam/NekoBot.git
cd NekoBot
```

### 2. 安装依赖

NekoBot 提供两种依赖安装方式：使用 uv（推荐）或使用 pip。

#### 使用 uv（推荐）

```bash
# 安装 uv（如果尚未安装）
pip install uv

# 安装 NekoBot 及其依赖
uv pip install -e .
```

#### 使用 pip

```bash
# 安装 NekoBot 及其依赖
pip install -e .
```

### 3. 创建配置文件

首次运行时，NekoBot 会自动创建默认配置文件。你也可以手动创建 `data/cmd_config.json`：

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

### 4. 启动 NekoBot

```bash
# 使用 uv
uv run main.py

# 或使用 python
python main.py
```

### 5. 访问 Web 仪表盘

启动成功后，打开浏览器访问：

```
http://localhost:6285
```

## 默认账户

NekoBot 提供了默认管理员账户：

- **用户名**: `nekobot`
- **密码**: `nekobot`

> **安全提示**: 首次登录后，系统会强制要求你修改密码，请务必修改以确保安全。

## 验证安装

启动 NekoBot 后，你应该能在终端看到类似的日志输出：

```
2025-XX-XX XX:XX:XX.XXX [INFO] 启动 NekoBot...
2025-XX-XX XX:XX:XX.XXX [INFO] 正在初始化 NekoBot 服务器...
2025-XX-XX XX:XX:XX.XXX [INFO] 平台适配器已注册: aiocqhttp
2025-XX-XX XX:XX:XX.XXX [INFO] 开始加载插件...
2025-XX-XX XX:XX:XX.XXX [INFO] 插件加载完成，共 X 个插件
2025-XX-XX XX:XX:XX.XXX [INFO] 启动 Quart 应用: http://0.0.0.0:6285
```

## 下一步

- [安装和配置](./installation.md) - 了解详细的配置选项
- [平台对接](./platforms.md) - 配置聊天平台
- [LLM 配置](./llm.md) - 配置 AI 模型
- [插件系统](./plugins.md) - 了解插件开发

## 常见问题

### 如何修改端口？

编辑 `data/cmd_config.json` 文件，修改 `server.port` 字段：

```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 8080
  }
}
```

### 忘记密码怎么办？

运行以下命令重置密码：

```bash
# 使用 uv
uv run main.py reset-password

# 或使用 python
python main.py reset-password
```

按照提示输入两次新密码即可。

### 如何启用或禁用 Web 仪表盘？

编辑 `data/cmd_config.json`，修改 `webui_enabled` 字段：

```json
{
  "webui_enabled": true
}
```

### 如何查看日志？

NekoBot 使用 loguru 输出日志到终端。你也可以通过 Web 仪表盘的"日志"页面实时查看日志。
