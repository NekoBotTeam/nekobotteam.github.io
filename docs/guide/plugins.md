# 插件系统

NekoBot 提供了强大的插件系统，允许你轻松扩展机器人的功能。

## 插件概述

插件是 NekoBot 功能扩展的核心方式。通过插件，你可以：

- 添加自定义命令
- 处理消息事件
- 与平台交互
- 持久化数据
- 配置插件参数

## 插件结构

一个基本的插件结构如下：

```
data/plugins/my_plugin/
├── main.py
├── _conf_schema.json (可选)
└── metadata.yaml (可选)
```

- `main.py`: 插件主文件，包含插件类
- `_conf_schema.json`: 插件配置 Schema（可选）
- `metadata.yaml`: 插件元数据（可选）

## 创建第一个插件

### 基础插件示例

创建 `data/plugins/hello/main.py`：

```python
from packages.backend.plugins.base import BasePlugin, register

class HelloPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.name = "HelloPlugin"
        self.version = "1.0.0"
        self.description = "一个简单的问候插件"
        self.author = "Your Name"
    
    async def on_load(self):
        print(f"{self.name} 已加载")
    
    async def on_unload(self):
        print(f"{self.name} 已卸载")
    
    @register("hello", "打招呼")
    async def hello_command(self, args, message):
        await self.send_group_message(
            message['group_id'], 
            message['user_id'], 
            f"你好, {message['sender_name']}!"
        )
```

### 命令装饰器

使用 `@register` 装饰器注册命令：

```python
@register("命令名", "命令描述", aliases=["别名1", "别名2"])
async def my_command(self, args, message):
    pass
```

### 消息处理器

使用装饰器监听消息：

```python
from packages.backend.plugins.base import on_message, on_group_message, on_private_message

@on_message
async def handle_all_messages(self, message):
    pass

@on_group_message
async def handle_group_messages(self, message):
    pass

@on_private_message
async def handle_private_messages(self, message):
    pass
```

## 发送消息

插件可以通过 `send_private_message` 和 `send_group_message` 方法发送消息：

```python
# 发送群消息
await self.send_group_message(
    group_id=123456,
    user_id=789,
    message="Hello!",
    platform_id="aiocqhttp"
)

# 发送私聊消息
await self.send_private_message(
    user_id=789,
    message="Hello!",
    platform_id="aiocqhttp"
)
```

## 插件配置

### 配置 Schema

创建 `_conf_schema.json` 定义插件配置：

```json
{
  "title": "Hello Plugin 配置",
  "type": "object",
  "properties": {
    "greeting": {
      "type": "string",
      "title": "问候语",
      "default": "你好"
    },
    "enabled": {
      "type": "boolean",
      "title": "启用插件",
      "default": true
    }
  }
}
```

### 读取配置

```python
class HelloPlugin(BasePlugin):
    async def on_load(self):
        # 加载插件配置
        config = self.conf_schema
        greeting = config.get("greeting", "你好")
        print(f"问候语: {greeting}")
```

## 插件数据持久化

NekoBot 自动为每个插件创建数据目录：`data/plugin_data/<plugin_name>/`

### 保存数据

```python
import json
from pathlib import Path

async def save_data(self):
    data_dir = self.get_plugin_data_dir()
    config_file = data_dir / "config.json"
    
    data = {"key": "value"}
    with open(config_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
```

### 读取数据

```python
import json
from pathlib import Path

async def load_data(self):
    data_dir = self.get_plugin_data_dir()
    config_file = data_dir / "config.json"
    
    if config_file.exists():
        with open(config_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    return {}
```

## 插件生命周期

| 方法 | 说明 |
|------|------|
| `on_load()` | 插件加载时调用 |
| `on_unload()` | 插件卸载时调用 |
| `on_enable()` | 插件启用时调用 |
| `on_disable()` | 插件禁用时调用 |

## 从 URL 安装插件

你可以从 GitHub 等平台安装插件：

### 通过 Web 仪表盘

1. 进入"插件"页面
2. 点击"安装插件"
3. 输入插件 URL（支持 GitHub 仓库链接）
4. 点击安装

### 支持的 URL 格式

- GitHub 仓库: `https://github.com/user/repo`
- GitHub 分支: `https://github.com/user/repo/tree/branch`
- GitHub Release: `https://github.com/user/repo/releases/tag/v1.0.0`
- 直接 ZIP 文件链接

## 插件示例

### 计数器插件

```python
from packages.backend.plugins.base import BasePlugin, register, on_group_message
import json
from pathlib import Path

class CounterPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.name = "CounterPlugin"
        self.version = "1.0.0"
        self.description = "群消息计数器"
        self.author = "Your Name"
        self.counters = {}
    
    async def on_load(self):
        self.load_counters()
    
    async def on_unload(self):
        self.save_counters()
    
    def load_counters(self):
        data_dir = self.get_plugin_data_dir()
        data_file = data_dir / "counters.json"
        if data_file.exists():
            with open(data_file, "r", encoding="utf-8") as f:
                self.counters = json.load(f)
    
    def save_counters(self):
        data_dir = self.get_plugin_data_dir()
        data_dir.mkdir(parents=True, exist_ok=True)
        data_file = data_dir / "counters.json"
        with open(data_file, "w", encoding="utf-8") as f:
            json.dump(self.counters, f, ensure_ascii=False, indent=2)
    
    @on_group_message
    async def count_message(self, message):
        group_id = str(message["group_id"])
        if group_id not in self.counters:
            self.counters[group_id] = 0
        self.counters[group_id] += 1
        self.save_counters()
    
    @register("count", "查看消息计数")
    async def count_command(self, args, message):
        group_id = str(message["group_id"])
        count = self.counters.get(group_id, 0)
        await self.send_group_message(
            message['group_id'],
            message['user_id'],
            f"本群已发送 {count} 条消息"
        )
```

## 插件最佳实践

1. **错误处理**: 在插件中添加适当的错误处理
2. **资源清理**: 在 `on_unload` 中清理资源
3. **异步操作**: 使用 `async/await` 处理异步操作
4. **数据验证**: 验证输入数据，防止注入攻击
5. **日志记录**: 使用日志记录插件活动
6. **配置管理**: 使用配置 Schema 管理插件配置

## 插件参考

### BasePlugin 类

```python
class BasePlugin(ABC):
    name: str
    version: str
    description: str
    author: str
    enabled: bool
    
    async def on_load(self): ...
    async def on_unload(self): ...
    async def on_enable(self): ...
    async def on_disable(self): ...
    async def on_message(self, message): ...
    
    async def send_private_message(
        self, user_id: int, 
        message: str, 
        platform_id: str = "onebot"
    ) -> bool: ...
    
    async def send_group_message(
        self, group_id: int, 
        user_id: int, 
        message: str, 
        platform_id: str = "onebot"
    ) -> bool: ...
    
    def get_plugin_data_dir(self) -> Path: ...
```

## 更多示例

更多插件示例请参考：[NekoBot Plugins Example](https://github.com/NekoBotTeam/NekoBot_Plugins_Example)
