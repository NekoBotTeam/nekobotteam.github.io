---
layout: page
title: LLM Configuration
---

# LLM Configuration

NekoBot supports multiple LLM (Large Language Model) providers, including OpenAI, Google Gemini, Zhipu AI, etc.

## Supported LLM Providers

| Provider | Status | Description |
|----------|--------|-------------|
| OpenAI | ✅ | GPT-4, GPT-3.5, etc. |
| Google Gemini | ✅ | Gemini Pro, Gemini Ultra, etc. |
| Zhipu AI | ✅ | GLM-4, GLM-3, etc. |
| DeepSeek | ✅ | DeepSeek series |
| Moonshot AI | ✅ | Kimi series |
| Ollama | ✅ | Local deployment |
| LM Studio | ✅ | Local deployment |
| Other compatible APIs | ✅ | Custom Base URL |

## Configuration File

LLM configuration is stored in `data/llm_providers.json`:

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

## OpenAI Configuration

### Basic Configuration

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

### Supported Models

| Model | Description |
|-------|-------------|
| gpt-4 | Most powerful model |
| gpt-4-turbo | Cost-effective |
| gpt-3.5-turbo | Fast and economical |

### Custom Endpoint

Supports using OpenAI API-compatible services:

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

## Google Gemini Configuration

### Basic Configuration

```json
{
  "type": "gemini",
  "enable": true,
  "id": "gemini",
  "api_key": "your-gemini-key",
  "model": "gemini-pro"
}
```

### Supported Models

| Model | Description |
|-------|-------------|
| gemini-pro | General purpose model |
| gemini-pro-vision | Multimodal model |
| gemini-ultra | Most powerful model |

## Zhipu AI Configuration

### Basic Configuration

```json
{
  "type": "glm",
  "enable": true,
  "id": "glm",
  "api_key": "your-glm-key",
  "model": "glm-4"
}
```

### Supported Models

| Model | Description |
|-------|-------------|
| glm-4 | Latest model |
| glm-3-turbo | Fast model |
| glm-3-130b | Large parameter model |

## DeepSeek Configuration

### Basic Configuration

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

## Local LLM Configuration

### Ollama

Ollama is a tool for running large models locally.

#### Install Ollama

1. Download and install [Ollama](https://ollama.ai)
2. Pull model:
```bash
ollama pull llama2
```

#### Configure NekoBot

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

LM Studio provides GUI and local API service.

#### Configuration Steps

1. Start LM Studio
2. Start local server (default port 1234)
3. Configure NekoBot:

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

## LLM Invocation

### Basic Invocation

Call LLM in plugin:

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

### Streaming Response

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

### Multimodal Input

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

## Session Management

### Create New Session

```python
session_id = f"user_{user_id}_{group_id}"
```

### Context Memory

NekoBot automatically manages conversation context, keeping the last 10 messages by default.

### Custom System Prompt

```python
result = await llm_manager.text_chat(
    provider_id="openai",
    prompt=prompt,
    system_prompt="You are a helpful assistant.",
    session_id=session_id
)
```

## Personality Configuration

### Personality Management

You can configure different personalities in the Web dashboard:

1. Go to "Personality Management" page
2. Click "Add Personality"
3. Set personality name, description, system prompt
4. Select default personality

### Using Personality

```python
result = await llm_manager.text_chat(
    provider_id="openai",
    prompt=prompt,
    persona_id="helpful_assistant",
    session_id=session_id
)
```

## Common Issues

### API Key Error

1. Check if API key is correct
2. Confirm account has sufficient balance
3. Check if API key has expired

### Connection Timeout

1. Check network connection
2. Check firewall settings
3. Try using a proxy

### Model Unavailable

1. Confirm model name is correct
2. Check if model is available in supported regions
3. Contact service provider

### Slow Response

1. Try using a faster model
2. Reduce context length
3. Use streaming response

## Best Practices

1. **Choose appropriate model**: Select the most cost-effective model based on your needs
2. **Cache responses**: Cache common question responses to reduce API calls
3. **Error handling**: Properly handle API errors and network issues
4. **Cost control**: Set reasonable context length and frequency limits
5. **Multiple providers**: Configure multiple providers for improved availability

## Related Links

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Gemini API](https://ai.google.dev/)
- [Zhipu AI Open Platform](https://open.bigmodel.cn/)
- [Ollama Documentation](https://ollama.ai/docs)
- [LM Studio](https://lmstudio.ai/)
