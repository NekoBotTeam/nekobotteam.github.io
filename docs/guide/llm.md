# LLM 配置

NekoBot 支持多种 LLM（大语言模型）提供商，包括 OpenAI、Google Gemini、智谱 AI 等。

## 支持的 LLM 提供商

| 提供商 | 支持状态 | 说明 |
|--------|----------|------|
| OpenAI | ✅ | GPT-4、GPT-3.5 等 |
| Google Gemini | ✅ | Gemini Pro、Gemini Ultra 等 |
| 智谱 AI | ✅ | GLM-4、GLM-3 等 |
| DeepSeek | ✅ | DeepSeek 系列 |
| Moonshot AI | ✅ | Kimi 系列 |
| Ollama | ✅ | 本地部署 |
| LM Studio | ✅ | 本地部署 |
| 其他兼容 API | ✅ | 自定义 Base URL |

## 配置文件

LLM 配置存储在 `data/llm_providers.json` 中：

```json
{
  "openai": {
    "type": "openai",
    "enable": true,
    "id": "openai",
    "api_key": "your-api-key-here",
    "base_url": "https://api.openai.com/v1",
    "model": "gpt-4"
  },
  "gemini": {
    "type": "gemini",
    "enable": true,
    "id": "gemini",
    "api_key": "your-gemini-key",
    "model": "gemini-pro"
  }
}
```

## OpenAI 配置

### 基础配置

```json
{
  "type": "openai",
  "enable": true,
  "id": "openai",
  "api_key": "sk-...",
  "base_url": "https://api.openai.com/v1",
  "model": "gpt-4"
}
```

### 支持的模型

| 模型 | 说明 |
|------|------|
| gpt-4 | 最强大的模型 |
| gpt-4-turbo | 性价比高 |
| gpt-3.5-turbo | 快速、经济 |

### 自定义端点

支持使用兼容 OpenAI API 的服务：

```json
{
  "type": "openai",
  "enable": true,
  "id": "azure-openai",
  "api_key": "your-azure-key",
  "base_url": "https://your-resource.openai.azure.com",
  "model": "gpt-4"
}
```

## Google Gemini 配置

### 基础配置

```json
{
  "type": "gemini",
  "enable": true,
  "id": "gemini",
  "api_key": "your-gemini-key",
  "model": "gemini-pro"
}
```

### 支持的模型

| 模型 | 说明 |
|------|------|
| gemini-pro | 通用模型 |
| gemini-pro-vision | 多模态模型 |
| gemini-ultra | 最强大的模型 |

## 智谱 AI 配置

### 基础配置

```json
{
  "type": "glm",
  "enable": true,
  "id": "glm",
  "api_key": "your-glm-key",
  "model": "glm-4"
}
```

### 支持的模型

| 模型 | 说明 |
|------|------|
| glm-4 | 最新模型 |
| glm-3-turbo | 快速模型 |
| glm-3-130b | 大参数模型 |

## DeepSeek 配置

### 基础配置

```json
{
  "type": "openai",
  "enable": true,
  "id": "deepseek",
  "api_key": "your-deepseek-key",
  "base_url": "https://api.deepseek.com/v1",
  "model": "deepseek-chat"
}
```

## 本地 LLM 配置

### Ollama

Ollama 是一个本地运行大模型的工具。

#### 安装 Ollama

1. 下载并安装 [Ollama](https://ollama.ai)
2. 拉取模型：
```bash
ollama pull llama2
```

#### 配置 NekoBot

```json
{
  "type": "openai",
  "enable": true,
  "id": "ollama",
  "api_key": "ollama",
  "base_url": "http://localhost:11434/v1",
  "model": "llama2"
}
```

### LM Studio

LM Studio 提供了图形化界面和本地 API 服务。

#### 配置步骤

1. 启动 LM Studio
2. 启动本地服务器（默认端口 1234）
3. 配置 NekoBot：

```json
{
  "type": "openai",
  "enable": true,
  "id": "lm-studio",
  "api_key": "lm-studio",
  "base_url": "http://localhost:1234/v1",
  "model": "local-model"
}
```

## LLM 调用

### 基础调用

在插件中调用 LLM：

```python
from packages.backend.llm import llm_manager

class MyPlugin(BasePlugin):
    async def on_load(self):
        llm_manager.register_provider(...)
    
    async def ask_llm(self, prompt, message):
        result = await llm_manager.text_chat(
            provider_id="openai",
            prompt=prompt,
            session_id=str(message["user_id"])
        )
        return result.get("text", "")
```

### 流式响应

```python
async def ask_llm_stream(self, prompt, message):
    async for chunk in llm_manager.text_chat_stream(
        provider_id="openai",
        prompt=prompt,
        session_id=str(message["user_id"])
    ):
        await self.send_group_message(
            message['group_id'],
            message['user_id'],
            chunk
        )
```

### 多模态输入

```python
async def ask_llm_with_image(self, prompt, image_url, message):
    result = await llm_manager.text_chat(
        provider_id="gemini",
        prompt=prompt,
        image_urls=[image_url],
        session_id=str(message["user_id"])
    )
    return result.get("text", "")
```

## 会话管理

### 创建新会话

```python
session_id = f"user_{user_id}_{group_id}"
```

### 上下文记忆

NekoBot 自动管理对话上下文，默认保留最近 10 条消息。

### 自定义系统提示

```python
result = await llm_manager.text_chat(
    provider_id="openai",
    prompt=prompt,
    system_prompt="你是一个友好的助手。",
    session_id=session_id
)
```

## 人格配置

### 人格管理

在 Web 仪表盘中可以配置不同的人格：

1. 进入"人格管理"页面
2. 点击"添加人格"
3. 设置人格名称、描述、系统提示
4. 选择默认人格

### 使用人格

```python
result = await llm_manager.text_chat(
    provider_id="openai",
    prompt=prompt,
    persona_id="helpful_assistant",
    session_id=session_id
)
```

## 常见问题

### API 密钥错误

1. 检查 API 密钥是否正确
2. 确认账户有足够余额
3. 检查 API 密钥是否过期

### 连接超时

1. 检查网络连接
2. 检查防火墙设置
3. 尝试使用代理

### 模型不可用

1. 确认模型名称正确
2. 检查模型是否在支持的地区
3. 联系服务提供商

### 响应缓慢

1. 尝试使用更快的模型
2. 减少上下文长度
3. 使用流式响应

## 最佳实践

1. **选择合适的模型**：根据需求选择性价比最高的模型
2. **缓存响应**：对常见问题缓存响应以减少 API 调用
3. **错误处理**：妥善处理 API 错误和网络问题
4. **成本控制**：设置合理的上下文长度和频率限制
5. **多提供商**：配置多个提供商以提高可用性

## 相关链接

- [OpenAI API 文档](https://platform.openai.com/docs)
- [Google Gemini API](https://ai.google.dev/)
- [智谱 AI 开放平台](https://open.bigmodel.cn/)
- [Ollama 文档](https://ollama.ai/docs)
- [LM Studio](https://lmstudio.ai/)
