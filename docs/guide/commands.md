# 命令系统

NekoBot 提供了灵活的命令系统，允许插件注册和管理命令。

## 命令概述

命令是用户与机器人交互的主要方式。用户通过发送特定格式的消息来触发命令。

## 命令格式

默认命令格式：`<命令前缀><命令名> [参数1] [参数2] ...`

示例：
```
/hello
/weather 北京
/help 群组管理
```

## 注册命令

### 基础命令注册

使用 `@register` 装饰器注册命令：

```python
from packages.backend.plugins.base import BasePlugin, register

class MyPlugin(BasePlugin):
    @register("hello", "打招呼")
    async def hello_command(self, args, message):
        await self.send_group_message(
            message['group_id'],
            message['user_id'],
            "Hello!"
        )
```

### 带别名的命令

```python
@register("weather", "查询天气", aliases=["w", "天気"])
async def weather_command(self, args, message):
    location = args[0] if args else "北京"
    await self.send_group_message(
        message['group_id'],
        message['user_id'],
        f"正在查询 {location} 的天气..."
    )
```

## 命令参数

### 访问参数

```python
@register("greet", "问候")
async def greet_command(self, args, message):
    if not args:
        await self.send_group_message(
            message['group_id'],
            message['user_id'],
            "请输入问候对象，例如：/greet Alice"
        )
        return
    
    name = args[0]
    await self.send_group_message(
        message['group_id'],
        message['user_id'],
        f"你好, {name}!"
    )
```

### 解析复杂参数

```python
@register("add", "相加")
async def add_command(self, args, message):
    try:
        num1 = float(args[0])
        num2 = float(args[1])
        result = num1 + num2
        await self.send_group_message(
            message['group_id'],
            message['user_id'],
            f"{num1} + {num2} = {result}"
        )
    except (IndexError, ValueError):
        await self.send_group_message(
            message['group_id'],
            message['user_id'],
            "格式错误，请使用：/add 数字1 数字2"
        )
```

## 消息对象

命令处理函数接收的 `message` 参数包含以下信息：

```python
{
    "message_id": 12345,
    "group_id": 67890,
    "user_id": 54321,
    "sender_name": "用户昵称",
    "message_type": "group",  # group 或 private
    "message": "/hello",
    "platform_id": "aiocqhttp",
    "raw_message": "...",  # 原始消息
    "timestamp": 1234567890
}
```

## 子命令

实现类似 Git 的子命令系统：

```python
@register("user", "用户管理")
async def user_command(self, args, message):
    if not args:
        await self.show_user_help(message)
        return
    
    subcommand = args[0]
    if subcommand == "info":
        await self.show_user_info(args[1:] if len(args) > 1 else None, message)
    elif subcommand == "list":
        await self.list_users(message)
    else:
        await self.send_group_message(
            message['group_id'],
            message['user_id'],
            f"未知的子命令: {subcommand}"
        )

async def show_user_info(self, args, message):
    user_id = args[0] if args else str(message['user_id'])
    await self.send_group_message(
        message['group_id'],
        message['user_id'],
        f"用户 ID: {user_id}"
    )

async def list_users(self, message):
    await self.send_group_message(
        message['group_id'],
        message['user_id'],
        "用户列表..."
    )
```

## 命令冲突处理

当多个插件注册相同命令时，会发生冲突。NekoBot 提供冲突检测机制：

```python
@register("hello", "打招呼")
async def hello_command(self, args, message):
    # 检查是否有冲突
    conflicts = check_command_conflicts("hello")
    if conflicts:
        await self.send_group_message(
            message['group_id'],
            message['user_id'],
            f"命令 'hello' 存在冲突: {', '.join(conflicts)}"
        )
        return
    
    # 正常处理命令
    await self.send_group_message(
        message['group_id'],
        message['user_id'],
        "Hello!"
    )
```

## 命令权限

### 实现权限检查

```python
class MyPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.admins = [123456789]  # 管理员列表
    
    def is_admin(self, user_id):
        return user_id in self.admins
    
    @register("admin", "管理员命令")
    async def admin_command(self, args, message):
        if not self.is_admin(message['user_id']):
            await self.send_group_message(
                message['group_id'],
                message['user_id'],
                "你没有权限执行此命令"
            )
            return
        
        await self.send_group_message(
            message['group_id'],
            message['user_id'],
            "管理员命令已执行"
        )
```

## 命令帮助

### 自动生成帮助

```python
class MyPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.commands = {
            "hello": {"description": "打招呼", "usage": "/hello"},
            "weather": {"description": "查询天气", "usage": "/weather [城市]"},
        }
    
    @register("help", "显示帮助")
    async def help_command(self, args, message):
        if args:
            command = args[0]
            if command in self.commands:
                await self.show_command_help(command, message)
        else:
            await self.show_all_commands(message)
    
    async def show_command_help(self, command, message):
        cmd_info = self.commands[command]
        await self.send_group_message(
            message['group_id'],
            message['user_id'],
            f"命令: {command}\n"
            f"描述: {cmd_info['description']}\n"
            f"用法: {cmd_info['usage']}"
        )
    
    async def show_all_commands(self, message):
        help_text = "可用命令:\n"
        for cmd, info in self.commands.items():
            help_text += f"/{cmd} - {info['description']}\n"
        await self.send_group_message(
            message['group_id'],
            message['user_id'],
            help_text
        )
```

## 命令最佳实践

1. **参数验证**: 始终验证命令参数
2. **错误提示**: 提供清晰的错误提示信息
3. **帮助文档**: 为每个命令提供帮助文档
4. **权限控制**: 实现适当的权限检查
5. **响应时间**: 快速响应，避免长时间阻塞

## 命令管理 API

### 检查命令冲突

```python
from packages.backend.core.command_management import check_command_conflicts

conflicts = check_command_conflicts("command_name")
```

### 获取所有命令

```python
from packages.backend.core.command_management import get_all_commands

commands = get_all_commands()
```

### 获取插件命令

```python
from packages.backend.core.command_management import get_plugin_commands

commands = get_plugin_commands("plugin_name")
```
