# 日志管理

NekoBot 使用 [loguru](https://github.com/Delgan/loguru) 进行日志管理，提供强大的日志记录和查看功能。

## 日志级别

| 级别 | 说明 | 使用场景 |
|------|------|----------|
| TRACE | 最详细的跟踪信息 | 调试和性能分析 |
| DEBUG | 调试信息 | 开发和调试 |
| INFO | 一般信息 | 正常运行信息 |
| WARNING | 警告信息 | 可能存在的问题 |
| ERROR | 错误信息 | 错误和异常 |
| CRITICAL | 严重错误 | 系统无法继续运行 |

## 配置日志

### 基础配置

在 `main.py` 中配置日志：

```python
logger.remove()
logger.add(
    sys.stdout,
    format="{time:YYYY-MM-DD HH:mm:ss.SSS} <level>[{level}]</level> {message}",
    level="DEBUG",
    colorize=True,
)
```

### 添加文件输出

```python
logger.add(
    "logs/nekobot_{time:YYYY-MM-DD}.log",
    rotation="00:00",  # 每天午夜轮换
    retention="30 days",  # 保留30天
    level="INFO",
    compression="zip",  # 压缩旧日志
    encoding="utf-8"
)
```

### 配置选项

| 选项 | 说明 | 示例 |
|------|------|------|
| format | 日志格式 | `"{time} - {level} - {message}"` |
| level | 日志级别 | `"DEBUG"` |
| rotation | 日志轮换 | `"00:00"`, `"500 MB"` |
| retention | 保留时间 | `"30 days"`, `"1 week"` |
| compression | 压缩格式 | `"zip"`, `"gzip"` |
| encoding | 文件编码 | `"utf-8"` |
| colorize | 彩色输出 | `True`, `False` |

## 在插件中使用日志

```python
from loguru import logger

class MyPlugin(BasePlugin):
    async def on_load(self):
        logger.info(f"{self.name} 已加载")
    
    @register("hello", "打招呼")
    async def hello_command(self, args, message):
        logger.debug(f"收到命令: /hello from {message['user_id']}")
        
        try:
            await self.send_group_message(
                message['group_id'],
                message['user_id'],
                "Hello!"
            )
            logger.info("消息发送成功")
        except Exception as e:
            logger.error(f"消息发送失败: {e}")
```

## 日志格式

### 默认格式

```
2025-01-01 12:00:00.123 [INFO] NekoBot 已启动
```

### 自定义格式

```python
logger.add(
    "logs/nekobot.log",
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>"
)
```

### 可用的格式化变量

| 变量 | 说明 | 示例 |
|------|------|------|
| {time} | 时间 | `2025-01-01 12:00:00` |
| {level} | 日志级别 | `INFO` |
| {message} | 日志消息 | `NekoBot 已启动` |
| {name} | 模块名 | `__main__` |
| {function} | 函数名 | `main` |
| {line} | 行号 | `42` |
| {file} | 文件名 | `main.py` |
| {exception} | 异常信息 | 异常堆栈 |

## 实时日志查看

### 通过 Web 仪表盘

1. 访问 Web 仪表盘
2. 进入"日志"页面
3. 实时查看日志输出

### 通过 WebSocket

连接 WebSocket 接收实时日志：

```javascript
const ws = new WebSocket("ws://localhost:6285/ws");

ws.onopen = () => {
  ws.send(JSON.stringify({ action: "subscribe", channels: ["logs"] }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.channel === "logs") {
    console.log(data.data);
  }
};
```

### 通过命令行

```bash
# 实时查看日志
tail -f logs/nekobot_*.log

# 过滤特定级别的日志
grep ERROR logs/nekobot_*.log

# 查看最近100行
tail -n 100 logs/nekobot_*.log
```

## 日志轮换

### 按时间轮换

```python
logger.add(
    "logs/nekobot.log",
    rotation="00:00",  # 每天午夜轮换
    retention="7 days"  # 保留7天
)
```

### 按大小轮换

```python
logger.add(
    "logs/nekobot.log",
    rotation="100 MB",  # 每100MB轮换
    retention="10 files"  # 保留最近10个文件
)
```

### 按条件轮换

```python
def should_rotate(message, file):
    return message.record["exception"] is not None

logger.add(
    "logs/nekobot.log",
    rotation=should_rotate  # 有异常时轮换
)
```

## 日志压缩

```python
logger.add(
    "logs/nekobot.log",
    rotation="00:00",
    compression="zip"  # 自动压缩旧日志
)
```

支持的压缩格式：
- `zip`
- `gz`
- `tar`

## 日志过滤

### 按级别过滤

```python
logger.add(
    "logs/nekobot.log",
    filter=lambda record: record["level"].name in ["INFO", "WARNING", "ERROR"]
)
```

### 按模块过滤

```python
logger.add(
    "logs/nekobot.log",
    filter=lambda record: "my_plugin" not in record["name"]
)
```

### 自定义过滤函数

```python
def custom_filter(record):
    return record["message"].startswith("IMPORTANT")

logger.add(
    "logs/important.log",
    filter=custom_filter
)
```

## 异常处理

### 自动记录异常

```python
try:
    await some_async_operation()
except Exception as e:
    logger.exception("操作失败")
    # 或
    logger.opt(exception=True).error("操作失败")
```

### 捕获调用栈

```python
logger.opt(depth=2).info("从调用者记录日志")
```

## 性能考虑

1. **日志级别**: 生产环境使用 INFO 或 WARNING
2. **异步日志**: loguru 是线程安全的，但要注意性能
3. **文件输出**: 使用 SSD 提高性能
4. **压缩**: 启用压缩可以节省磁盘空间

## 最佳实践

1. **使用合适的级别**: 根据信息重要性选择日志级别
2. **记录上下文**: 包含足够的信息用于调试
3. **避免循环日志**: 防止日志本身产生日志
4. **定期清理**: 配置日志保留时间
5. **敏感信息**: 不要记录密码、Token 等敏感信息

## 常见问题

### 日志文件太大

减少日志级别或增加轮换频率。

### 日志不输出

检查日志配置和文件权限。

### 日志乱码

确保文件编码为 `utf-8`。

### 日志性能影响

在生产环境中使用 INFO 或更高级别。

## 相关链接

- [loguru 文档](https://loguru.readthedocs.io/)
- [Python 日志最佳实践](https://docs.python.org/3/howto/logging.html)
