# Python实战教程：大模型API客户端开发

*从Go开发者视角，实战构建生产级API客户端*

## 🎯 教程特色

- **对比学习**: 每个Python概念都有Go语言对比
- **实战导向**: 所有示例围绕API调用场景
- **渐进式**: 从简单到复杂，逐步构建完整工具

## 📚 第一部分：Python基础（API开发视角）

### 1. 基础数据类型和操作

#### 字符串处理
```python
# Go经验对比
# Go: fmt.Sprintf("Hello, %s", name)
# Python: 更简洁的f-string

name = "link"
api_key = "sk-123456"

# f-string格式化（推荐）
url = f"https://api.openai.com/v1/chat/completions?api_key={api_key}"
print(f"用户: {name}, API: {api_key[:10]}...")

# 传统方式（了解即可）
url_format = "https://api.openai.com/v1/chat/completions?api_key={}".format(api_key)
url_percent = "https://api.openai.com/v1/chat/completions?api_key=%s" % api_key
```

#### 字典和JSON处理
```python
# API请求数据结构
request_data = {
    "model": "gpt-3.5-turbo",
    "messages": [
        {"role": "system", "content": "你是一个有用的助手"},
        {"role": "user", "content": "解释Python的字典"}
    ],
    "temperature": 0.7,
    "max_tokens": 1000
}

# 访问数据（vs Go的map访问）
model = request_data["model"]  # 如果不存在会抛出异常
temperature = request_data.get("temperature", 0.5)  # 安全访问，默认值

# 遍历消息
for i, message in enumerate(request_data["messages"]):
    print(f"消息 {i}: {message['role']} - {message['content'][:50]}...")
```

### 2. 函数定义和错误处理

#### 基本函数定义
```python
# Go经验对比
# Go: func CallAPI(url string, method string) (string, error) { ... }
# Python: 更简洁的参数和返回值

def call_api(url: str, method: str = "GET") -> str:
    """
    调用API的简单函数

    Args:
        url: API端点URL
        method: HTTP方法，默认GET

    Returns:
        API响应内容

    Raises:
        ConnectionError: 网络连接错误
        TimeoutError: 请求超时
    """
    print(f"正在调用 {method} {url}")
    # 实际API调用逻辑稍后实现
    return "模拟响应"

# 调用函数
try:
    response = call_api("https://api.openai.com/v1/models", "GET")
    print(f"响应: {response}")
except ConnectionError as e:
    print(f"连接错误: {e}")
except TimeoutError as e:
    print(f"超时错误: {e}")
```

#### 类和对象（API客户端基础）
```python
# Go经验对比
# Go: type APIClient struct { BaseURL string; APIKey string }
# Python: 更灵活的类定义

class APIClient:
    def __init__(self, base_url: str, api_key: str, timeout: int = 30):
        """
        初始化API客户端

        Args:
            base_url: API基础URL
            api_key: API密钥
            timeout: 请求超时时间（秒）
        """
        self.base_url = base_url.rstrip('/')  # 移除末尾斜杠
        self.api_key = api_key
        self.timeout = timeout
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def get_full_url(self, endpoint: str) -> str:
        """构建完整的API URL"""
        return f"{self.base_url}/{endpoint.lstrip('/')}"

    def __str__(self) -> str:
        """字符串表示（类似Go的String()方法）"""
        return f"APIClient(base_url={self.base_url}, timeout={self.timeout})"

# 使用示例
client = APIClient(
    base_url="https://api.openai.com/v1/",
    api_key="sk-your-api-key-here"
)

print(client)
print(f"完整URL: {client.get_full_url('chat/completions')}")
```

## 📚 第二部分：HTTP客户端实战

### 3. requests库使用（同步调用）

#### 基础GET请求
```python
import requests
import json
from typing import Dict, Any, Optional

class SyncAPIClient(APIClient):
    """同步API客户端，基于requests库"""

    def get(self, endpoint: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """
        发送GET请求

        Args:
            endpoint: API端点
            params: URL参数

        Returns:
            响应数据字典

        Raises:
            requests.RequestException: 请求相关异常
        """
        url = self.get_full_url(endpoint)

        try:
            response = requests.get(
                url,
                headers=self.headers,
                params=params,
                timeout=self.timeout
            )
            response.raise_for_status()  # 检查HTTP状态码
            return response.json()

        except requests.exceptions.RequestException as e:
            print(f"GET请求失败: {e}")
            raise

    def post(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        发送POST请求

        Args:
            endpoint: API端点
            data: 请求数据

        Returns:
            响应数据字典
        """
        url = self.get_full_url(endpoint)

        try:
            response = requests.post(
                url,
                headers=self.headers,
                json=data,  # 自动序列化为JSON
                timeout=self.timeout
            )
            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            print(f"POST请求失败: {e}")
            raise

# 使用示例
def demo_sync_client():
    client = SyncAPIClient(
        base_url="https://api.openai.com/v1/",
        api_key="sk-your-api-key-here"
    )

    # 获取模型列表（示例）
    try:
        models = client.get("models")
        print(f"可用模型数量: {len(models.get('data', []))}")

        # 聊天请求示例
        chat_data = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "user", "content": "你好，请用Python写一个hello world"}
            ],
            "max_tokens": 100
        }

        response = client.post("chat/completions", chat_data)
        content = response["choices"][0]["message"]["content"]
        print(f"AI回复: {content}")

    except requests.exceptions.RequestException as e:
        print(f"API调用失败: {e}")
```

### 4. 异步HTTP客户端（aiohttp）

#### 异步API客户端
```python
import aiohttp
import asyncio
from typing import List

class AsyncAPIClient(APIClient):
    """异步API客户端，基于aiohttp"""

    async def get(self, session: aiohttp.ClientSession,
                  endpoint: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """异步GET请求"""
        url = self.get_full_url(endpoint)

        try:
            async with session.get(
                url,
                headers=self.headers,
                params=params,
                timeout=aiohttp.ClientTimeout(total=self.timeout)
            ) as response:
                response.raise_for_status()
                return await response.json()

        except aiohttp.ClientError as e:
            print(f"异步GET请求失败: {e}")
            raise

    async def post(self, session: aiohttp.ClientSession,
                   endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """异步POST请求"""
        url = self.get_full_url(endpoint)

        try:
            async with session.post(
                url,
                headers=self.headers,
                json=data,
                timeout=aiohttp.ClientTimeout(total=self.timeout)
            ) as response:
                response.raise_for_status()
                return await response.json()

        except aiohttp.ClientError as e:
            print(f"异步POST请求失败: {e}")
            raise

    async def batch_requests(self, endpoints: List[str]) -> List[Dict[str, Any]]:
        """批量并发请求"""
        async with aiohttp.ClientSession() as session:
            tasks = [self.get(session, endpoint) for endpoint in endpoints]
            return await asyncio.gather(*tasks, return_exceptions=True)

# 使用示例
async def demo_async_client():
    client = AsyncAPIClient(
        base_url="https://api.openai.com/v1/",
        api_key="sk-your-api-key-here"
    )

    # 批量获取信息
    endpoints = ["models", "engines"]

    try:
        results = await client.batch_requests(endpoints)

        for i, result in enumerate(results):
            if isinstance(result, Exception):
                print(f"请求 {endpoints[i]} 失败: {result}")
            else:
                print(f"请求 {endpoints[i]} 成功: {len(result.get('data', []))} 项数据")

    except Exception as e:
        print(f"批量请求失败: {e}")

# 运行异步示例
# asyncio.run(demo_async_client())
```

## 📚 第三部分：大模型SDK专项

### 5. OpenAI SDK使用

#### 基础聊天API
```python
from openai import OpenAI
import asyncio

class OpenAIClient:
    """OpenAI API封装"""

    def __init__(self, api_key: str, model: str = "gpt-3.5-turbo"):
        self.client = OpenAI(api_key=api_key)
        self.model = model

    def chat_completion(self, messages: List[Dict],
                       max_tokens: int = 1000,
                       temperature: float = 0.7) -> str:
        """
        同步聊天完成

        Args:
            messages: 消息列表
            max_tokens: 最大token数
            temperature: 温度参数

        Returns:
            AI回复内容
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"OpenAI API调用失败: {e}")
            raise

    async def chat_completion_async(self, messages: List[Dict],
                                   max_tokens: int = 1000,
                                   temperature: float = 0.7) -> str:
        """异步聊天完成"""
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"OpenAI异步API调用失败: {e}")
            raise

    def stream_completion(self, messages: List[Dict]):
        """
        流式聊天完成

        Args:
            messages: 消息列表

        Yields:
            流式响应片段
        """
        try:
            stream = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                stream=True  # 启用流式响应
            )

            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            print(f"OpenAI流式API调用失败: {e}")
            raise

# 使用示例
def demo_openai_client():
    client = OpenAIClient(api_key="sk-your-api-key-here")

    messages = [
        {"role": "system", "content": "你是一个Python编程专家"},
        {"role": "user", "content": "写一个Python函数，计算斐波那契数列"}
    ]

    # 同步调用
    try:
        response = client.chat_completion(messages)
        print(f"同步回复:\n{response}")
    except Exception as e:
        print(f"同步调用失败: {e}")

    # 流式调用
    print("\n流式回复:")
    try:
        for chunk in client.stream_completion(messages):
            print(chunk, end='', flush=True)  # 实时输出，不换行
        print()  # 最后换行
    except Exception as e:
        print(f"\n流式调用失败: {e}")
```

### 6. 错误处理和重试机制

#### 装饰器实现重试
```python
import time
import functools
from typing import Callable, Any

def retry_on_failure(max_retries: int = 3,
                    backoff_factor: float = 1.0,
                    exceptions: tuple = (Exception,)):
    """
    重试装饰器

    Args:
        max_retries: 最大重试次数
        backoff_factor: 退避因子
        exceptions: 需要重试的异常类型
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            last_exception = None

            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)

                except exceptions as e:
                    last_exception = e

                    if attempt < max_retries:
                        wait_time = backoff_factor * (2 ** attempt)
                        print(f"请求失败，{wait_time}秒后重试 (尝试 {attempt + 1}/{max_retries + 1})")
                        time.sleep(wait_time)
                    else:
                        print(f"重试次数已达上限，最终失败")
                        break

            raise last_exception

        return wrapper
    return decorator

# 应用重试装饰器
class RobustAPIClient(SyncAPIClient):
    """带有重试机制的API客户端"""

    @retry_on_failure(max_retries=3, backoff_factor=1.0)
    def get(self, endpoint: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """带有重试的GET请求"""
        return super().get(endpoint, params)

    @retry_on_failure(max_retries=3, backoff_factor=1.0)
    def post(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """带有重试的POST请求"""
        return super().post(endpoint, data)

# 使用示例
def demo_robust_client():
    client = RobustAPIClient(
        base_url="https://api.openai.com/v1/",
        api_key="sk-invalid-key"  # 故意使用无效key演示重试
    )

    try:
        # 这会触发多次重试
        models = client.get("models")
        print(f"获取模型成功: {len(models.get('data', []))}")
    except Exception as e:
        print(f"最终失败: {e}")
```

## 📚 第四部分：完整项目实战

### 7. 配置管理和日志

#### 配置文件处理
```python
import yaml
import logging
from pathlib import Path
from dataclasses import dataclass

@dataclass
class APIConfig:
    """API配置数据类"""
    base_url: str
    api_key: str
    timeout: int = 30
    max_retries: int = 3
    temperature: float = 0.7

class ConfigManager:
    """配置管理器"""

    def __init__(self, config_file: str = "api_config.yaml"):
        self.config_file = Path(config_file)
        self.config = self.load_config()

    def load_config(self) -> APIConfig:
        """从YAML文件加载配置"""
        if self.config_file.exists():
            with open(self.config_file, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)
                return APIConfig(**data)
        else:
            # 创建默认配置
            default_config = APIConfig(
                base_url="https://api.openai.com/v1/",
                api_key="sk-your-api-key-here"
            )
            self.save_config(default_config)
            return default_config

    def save_config(self, config: APIConfig):
        """保存配置到文件"""
        with open(self.config_file, 'w', encoding='utf-8') as f:
            yaml.dump({
                'base_url': config.base_url,
                'api_key': config.api_key,
                'timeout': config.timeout,
                'max_retries': config.max_retries,
                'temperature': config.temperature
            }, f, default_flow_style=False)

# 日志配置
def setup_logging(log_file: str = "api_client.log"):
    """设置日志记录"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file, encoding='utf-8'),
            logging.StreamHandler()  # 同时输出到控制台
        ]
    )
    return logging.getLogger(__name__)
```

#### 完整的API客户端工具
```python
class UltimateAPIClient:
    """终极API客户端：整合所有功能"""

    def __init__(self, config_file: str = "api_config.yaml"):
        # 配置管理
        self.config_manager = ConfigManager(config_file)
        self.config = self.config_manager.config

        # 日志设置
        self.logger = setup_logging()

        # OpenAI客户端
        self.openai_client = OpenAI(api_key=self.config.api_key)

        self.logger.info(f"API客户端初始化完成: {self.config.base_url}")

    def chat_with_assistant(self, message: str,
                           system_prompt: str = "你是一个有用的助手") -> str:
        """
        与AI助手对话

        Args:
            message: 用户消息
            system_prompt: 系统提示词

        Returns:
            AI回复内容
        """
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ]

        self.logger.info(f"发送消息: {message[:50]}...")

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=1000,
                temperature=self.config.temperature
            )

            result = response.choices[0].message.content
            self.logger.info(f"收到回复: {len(result)} 字符")
            return result

        except Exception as e:
            self.logger.error(f"API调用失败: {e}")
            raise

    def batch_chat(self, messages: List[str]) -> List[str]:
        """批量对话（使用异步提高效率）"""
        async def async_batch_chat():
            tasks = []
            for msg in messages:
                task = self.openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": msg}],
                    max_tokens=500
                )
                tasks.append(task)

            responses = await asyncio.gather(*tasks, return_exceptions=True)
            return [resp.choices[0].message.content for resp in responses
                   if not isinstance(resp, Exception)]

        return asyncio.run(async_batch_chat())

    def interactive_mode(self):
        """交互式对话模式"""
        print("🤖 AI助手交互模式 (输入 'quit' 退出)")
        print("=" * 50)

        while True:
            try:
                user_input = input("\n您: ").strip()

                if user_input.lower() in ['quit', 'exit', '退出']:
                    print("再见！")
                    break

                if not user_input:
                    continue

                # 显示思考状态
                print("🤔 AI正在思考...", end='', flush=True)

                response = self.chat_with_assistant(user_input)

                # 清除思考状态
                print("\r" + " " * 20 + "\r", end='')

                print(f"🤖 助手: {response}")

            except KeyboardInterrupt:
                print("\n\n程序被用户中断")
                break
            except Exception as e:
                print(f"\n❌ 错误: {e}")

# 主程序入口
def main():
    """主程序"""
    try:
        client = UltimateAPIClient()

        # 演示功能
        print("🎯 API客户端功能演示")
        print("-" * 30)

        # 单次对话
        response = client.chat_with_assistant("用Python写一个快速排序算法")
        print(f"算法代码:\n{response}")

        # 启动交互模式（可选）
        # client.interactive_mode()

    except Exception as e:
        print(f"程序启动失败: {e}")

if __name__ == "__main__":
    main()
```

## 🔧 部署和使用

### 安装依赖
```bash
# 创建虚拟环境
python3 -m venv llm-client-env
source llm-client-env/bin/activate

# 安装依赖包
pip install openai aiohttp requests pyyaml
```

### 配置文件示例 (api_config.yaml)
```yaml
base_url: "https://api.openai.com/v1/"
api_key: "sk-your-actual-api-key-here"
timeout: 30
max_retries: 3
temperature: 0.7
```

### 运行程序
```bash
# 运行完整示例
python ultimate_api_client.py

# 或使用交互式Python进行测试
python
>>> from ultimate_api_client import UltimateAPIClient
>>> client = UltimateAPIClient()
>>> response = client.chat_with_assistant("你好，请介绍Python")
>>> print(response)
```

## 🎓 学习检查点

### 基础掌握检查：
- [ ] 能使用Python基本数据类型处理API响应
- [ ] 会定义函数和类来封装API客户端
- [ ] 掌握异常处理机制
- [ ] 能使用pip管理依赖包

### 进阶技能检查：
- [ ] 会使用requests库进行HTTP请求
- [ ] 掌握aiohttp异步编程
- [ ] 能使用装饰器实现重试机制
- [ ] 会处理JSON数据和配置文件

### 实战能力检查：
- [ ] 能集成OpenAI SDK进行AI对话
- [ ] 会构建批量并发请求功能
- [ ] 掌握日志记录和错误处理
- [ ] 能开发完整的API客户端工具

---

*教程完成时间: 2025-11-06*
*后续扩展: 支持更多AI服务、Web界面、Docker部署*