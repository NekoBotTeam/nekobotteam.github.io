---
layout: page
title: Logging Management
---

# Logging Management

NekoBot uses [loguru](https://github.com/Delgan/loguru) for logging management, providing powerful log recording and viewing capabilities.

## Log Levels

| Level | Description | Use Case |
|-------|-------------|----------|
| TRACE | Most detailed trace info | Debugging and performance analysis |
| DEBUG | Debug information | Development and debugging |
| INFO | General information | Normal operation information |
| WARNING | Warning information | Potential issues |
| ERROR | Error information | Errors and exceptions |
| CRITICAL | Critical errors | System cannot continue |

## Configuring Logs

### Basic Configuration

Configure logging in `main.py`:

```python
logger.remove()
logger.add(
    sys.stdout,
    format="{time:YYYY-MM-DD HH:mm:ss.SSS} <level>[{level}]</level> {message}",
    level="DEBUG",
    colorize=True,
)
```

### Add File Output

```python
logger.add(
    "logs/nekobot_{time:YYYY-MM-DD}.log",
    rotation="00:00",  # Rotate daily at midnight
    retention="30 days",  # Keep for 30 days
    level="INFO",
    compression="zip",  # Compress old logs
    encoding="utf-8"
)
```

### Configuration Options

| Option | Description | Example |
|--------|-------------|---------|
| format | Log format | `"{time} - {level} - {message}"` |
| level | Log level | `"DEBUG"` |
| rotation | Log rotation | `"00:00"`, `"500 MB"` |
| retention | Retention period | `"30 days"`, `"1 week"` |
| compression | Compression format | `"zip"`, `"gzip"` |
| encoding | File encoding | `"utf-8"` |
| colorize | Colored output | `True`, `False` |

## Using Logs in Plugins

```python
from loguru import logger

class MyPlugin(BasePlugin):
    async def on_load(self):
        logger.info(f"{self.name} loaded")
    
    @register("hello", "Say hello")
    async def hello_command(self, args, message):
        logger.debug(f"Received command: /hello from {message['user_id']}")
        
        try:
            await self.send_group_message(
                message['group_id'],
                message['user_id'],
                "Hello!"
            )
            logger.info("Message sent successfully")
        except Exception as e:
            logger.error(f"Failed to send message: {e}")
```

## Log Format

### Default Format

```
2025-01-01 12:00:00.123 [INFO] NekoBot started
```

### Custom Format

```python
logger.add(
    "logs/nekobot.log",
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>"
)
```

### Available Format Variables

| Variable | Description | Example |
|----------|-------------|---------|
| {time} | Time | `2025-01-01 12:00:00` |
| {level} | Log level | `INFO` |
| {message} | Log message | `NekoBot started` |
| {name} | Module name | `__main__` |
| {function} | Function name | `main` |
| {line} | Line number | `42` |
| {file} | File name | `main.py` |
| {exception} | Exception info | Exception stack trace |

## Real-time Log Viewing

### Via Web Dashboard

1. Access Web dashboard
2. Go to "Logs" page
3. View log output in real-time

### Via WebSocket

Connect WebSocket to receive real-time logs:

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

### Via Command Line

```bash
# View logs in real-time
tail -f logs/nekobot_*.log

# Filter logs by level
grep ERROR logs/nekobot_*.log

# View last 100 lines
tail -n 100 logs/nekobot_*.log
```

## Log Rotation

### Rotate by Time

```python
logger.add(
    "logs/nekobot.log",
    rotation="00:00",  # Rotate daily at midnight
    retention="7 days"  # Keep for 7 days
)
```

### Rotate by Size

```python
logger.add(
    "logs/nekobot.log",
    rotation="100 MB",  # Rotate every 100MB
    retention="10 files"  # Keep last 10 files
)
```

### Rotate by Condition

```python
def should_rotate(message, file):
    return message.record["exception"] is not None

logger.add(
    "logs/nekobot.log",
    rotation=should_rotate  # Rotate on exception
)
```

## Log Compression

```python
logger.add(
    "logs/nekobot.log",
    rotation="00:00",
    compression="zip"  # Auto-compress old logs
)
```

Supported compression formats:
- `zip`
- `gz`
- `tar`

## Log Filtering

### Filter by Level

```python
logger.add(
    "logs/nekobot.log",
    filter=lambda record: record["level"].name in ["INFO", "WARNING", "ERROR"]
)
```

### Filter by Module

```python
logger.add(
    "logs/nekobot.log",
    filter=lambda record: "my_plugin" not in record["name"]
)
```

### Custom Filter Function

```python
def custom_filter(record):
    return record["message"].startswith("IMPORTANT")

logger.add(
    "logs/important.log",
    filter=custom_filter
)
```

## Exception Handling

### Auto-logging Exceptions

```python
try:
    await some_async_operation()
except Exception as e:
    logger.exception("Operation failed")
    # or
    logger.opt(exception=True).error("Operation failed")
```

### Capture Call Stack

```python
logger.opt(depth=2).info("Logging from caller")
```

## Performance Considerations

1. **Log Level**: Use INFO or WARNING in production
2. **Async Logging**: loguru is thread-safe, but be mindful of performance
3. **File Output**: Use SSD for better performance
4. **Compression**: Enable compression to save disk space

## Best Practices

1. **Use appropriate levels**: Select log level based on information importance
2. **Record context**: Include sufficient information for debugging
3. **Avoid circular logging**: Prevent logs from generating logs
4. **Regular cleanup**: Configure log retention time
5. **Sensitive information**: Do not log passwords, tokens, or other sensitive information

## Common Issues

### Log File Too Large

Reduce log level or increase rotation frequency.

### No Log Output

Check log configuration and file permissions.

### Garbled Logs

Ensure file encoding is `utf-8`.

### Log Performance Impact

Use INFO or higher level in production environment.

## Related Links

- [loguru Documentation](https://loguru.readthedocs.io/)
- [Python Logging Best Practices](https://docs.python.org/3/howto/logging.html)
