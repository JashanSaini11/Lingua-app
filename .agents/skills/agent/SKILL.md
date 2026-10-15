---
name: Agent
description: Use when building real-time voice or video AI agents, deploying conversational systems to production, integrating with LLMs and AI providers, or adding function calling and knowledge bases to agent applications.
metadata:
    mintlify-proj: agent
    version: "1.0"
---

# Vision Agents Skill

## Product Summary

Vision Agents is an open-source Python framework for building real-time voice and video AI agents. Agents join calls via an edge transport (Stream Video RTC, local, or Tencent), connect to swappable AI plugins (LLMs, STT, TTS, vision models), and respond in real time. The framework handles call lifecycle, audio/video routing, turn-taking, and deployment. Key files: `agent.py` (your agent definition), `pyproject.toml` (dependencies), `.env` (API keys). CLI: `uv run agent.py run` (console mode), `uv run agent.py serve` (HTTP server). See [visionagents.ai](https://visionagents.ai) for full documentation.

## When to Use

Reach for this skill when:
- **Building voice agents**: Custom STT/LLM/TTS pipelines, realtime models (Gemini, OpenAI, Qwen), phone integration with Twilio/Telnyx
- **Building video agents**: VLMs, YOLO processors, real-time video analysis, pose detection, object recognition
- **Adding tools and knowledge**: Function calling, MCP servers, RAG (Gemini FileSearch or TurboPuffer)
- **Deploying to production**: Docker, Kubernetes, horizontal scaling with Redis, metrics and observability
- **Testing agents**: Text-only testing without audio/video infrastructure
- **Integrating AI providers**: Swapping between 35+ plugins (LLMs, STT, TTS, vision, avatars, turn detection)

## Quick Reference

### Project Structure
```
my-agent/
├── agent.py              # Agent definition (create_agent, join_call, runner)
├── pyproject.toml        # Dependencies (uv)
├── .env                  # API keys (STREAM_API_KEY, GOOGLE_API_KEY, etc.)
├── Dockerfile            # CPU or GPU deployment
├── tests/                # pytest tests with TestSession
└── .env.example          # Template for .env
```

### CLI Commands
| Command | Purpose |
|---------|---------|
| `uvx vision-agents init my-agent` | Scaffold a new agent project |
| `uv run agent.py run` | Console mode (single agent, browser demo) |
| `uv run agent.py serve` | HTTP server mode (production, multi-session) |
| `uv run agent.py serve --host 0.0.0.0 --port 8000` | Server with custom host/port |
| `uv run agent.py run --video-track-override=/path/to/video.mp4` | Test with local video file |

### Core Agent Configuration
```python
from vision_agents.core import Agent, User
from vision_agents.plugins import getstream, gemini, deepgram, elevenlabs

agent = Agent(
    edge=getstream.Edge(),                    # Transport layer
    agent_user=User(name="Assistant", id="agent"),
    instructions="You're a helpful assistant.",
    llm=gemini.Realtime(),                    # Or custom pipeline:
    # llm=gemini.LLM(),
    # stt=deepgram.STT(eager_turn_detection=True),
    # tts=elevenlabs.TTS(),
    processors=[],                            # Video processors (YOLO, etc.)
    avatar=None,                              # Avatar provider
    mcp_servers=[],                           # External tools
)
```

### Agent Lifecycle
```python
async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs) -> None:
    call = await agent.create_call(call_type, call_id)
    async with agent.join(call):
        await agent.simple_response("Say hi")  # LLM generates response
        await agent.say("Direct speech")       # Bypass LLM
        await agent.finish()                   # Wait for call to end
```

### Environment Variables (`.env`)
```bash
# Edge transport
STREAM_API_KEY=your_stream_key
STREAM_API_SECRET=your_stream_secret

# LLMs
GOOGLE_API_KEY=your_google_key
OPENAI_API_KEY=your_openai_key

# STT/TTS
DEEPGRAM_API_KEY=your_deepgram_key
ELEVENLABS_API_KEY=your_elevenlabs_key

# Vision/Infrastructure
NVIDIA_API_KEY=your_nvidia_key
TURBOPUFFER_API_KEY=your_turbopuffer_key
```

### Plugin Installation
```bash
# Add plugins as extras
uv add "vision-agents[deepgram,elevenlabs,gemini]"

# Or explicit packages
uv add vision-agents-plugins-deepgram vision-agents-plugins-elevenlabs
```

## Decision Guidance

### Realtime vs Custom Pipeline
| Mode | Best For | Setup | Control |
|------|----------|-------|---------|
| **Realtime** (Gemini, OpenAI, Qwen) | Fastest, lowest latency | One line: `llm=gemini.Realtime()` | Less (unified model) |
| **Custom Pipeline** (STT + LLM + TTS) | Full control, mix providers | Three components | Full (each stage independent) |

### RAG Options
| Option | Setup | Search | Best For |
|--------|-------|--------|----------|
| **Gemini FileSearch** | Simple | Automatic | Prototypes, quick setup |
| **TurboPuffer** | More setup | Hybrid (vector + BM25) | Production, custom needs |

### Deployment Path
| Stage | Command | When |
|-------|---------|------|
| **Local dev** | `uv run agent.py run` | Testing, iteration |
| **HTTP server** | `uv run agent.py serve` | Multi-session, production-ready |
| **Docker** | `docker build -t agent .` | Containerized deployment |
| **Horizontal scaling** | Add Redis session registry | Multiple replicas needed |
| **Kubernetes** | Helm chart + Prometheus | Full production setup |

### Edge Transport
| Transport | Best For | Setup |
|-----------|----------|-------|
| **Stream Video RTC** | Default, global, chat-backed | `getstream.Edge()` |
| **Local** | Dev on your machine | `local.Edge()` |
| **Tencent RTC** | Low latency in China | `tencent.Edge()` |

## Workflow

### 1. Scaffold and Run
```bash
uvx vision-agents init my-agent && cd my-agent
cp .env.example .env
# Fill in STREAM_API_KEY, STREAM_API_SECRET, GOOGLE_API_KEY
uv run agent.py run
```
Open the browser link to talk to your agent.

### 2. Customize Agent Logic
Edit `agent.py`:
- Change `instructions` for different behavior
- Register functions with `@llm.register_function()` for tool calling
- Add processors for video analysis
- Add MCP servers for external tools

### 3. Add Plugins
```bash
uv add "vision-agents[deepgram,elevenlabs]"
```
Update `.env` with new API keys. Swap providers in `agent.py` (one line).

### 4. Add Tools and Knowledge
```python
# Function calling
@llm.register_function(description="Get weather")
async def get_weather(location: str) -> dict:
    return {"temp": 72, "condition": "sunny"}

# RAG
store = gemini.GeminiFilesearchRAG(name="my-kb")
await store.add_directory("./docs")
llm = gemini.LLM(tools=[gemini.tools.FileSearch(store)])

# MCP servers
agent = Agent(..., mcp_servers=[github_server, weather_server])
```

### 5. Test Without Audio/Video
```python
from vision_agents.testing import TestSession, LLMJudge

async def test_greeting():
    llm = gemini.LLM()
    async with TestSession(llm=llm, instructions="Be friendly") as session:
        response = await session.simple_response("Hello")
        response.assert_function_called("get_weather")
        judge = LLMJudge(gemini.LLM())
        verdict = await judge.evaluate(response.chat_messages[0], intent="Friendly greeting")
        assert verdict.success
```

### 6. Deploy to Production
```bash
# HTTP server locally
uv run agent.py serve --host 0.0.0.0 --port 8000

# Docker
docker buildx build --platform linux/amd64 -t vision-agent .
docker run -e STREAM_API_KEY=... vision-agent

# Kubernetes (with Helm)
helm install vision-agent ./helm-chart
```

## Common Gotchas

- **Do not reuse Agent instances**: Create a new agent for each call. Calling `join()` twice raises `RuntimeError`.
- **Realtime mode disables STT/TTS**: When using `AudioLLM` (realtime models), STT, TTS, and turn detection are automatically disabled. Don't configure them.
- **Only async functions in function calling**: `@llm.register_function()` requires async functions. Sync functions raise `ValueError`.
- **Agent must join before using methods**: Call `agent.join(call)` before `simple_response()`, `say()`, or `finish()`.
- **Environment variables must be loaded**: Use `load_dotenv()` before creating agents. Vision Agents auto-loads from `.env`.
- **Turn detection conflicts**: If STT has built-in turn detection (Deepgram, ElevenLabs), don't configure a separate `turn_detection` plugin — it's ignored.
- **Video override requires avatar or processor**: `set_video_track_override_path()` only works if `publish_video=True` (avatar or video processor configured).
- **Session limits in HTTP server**: Set `max_concurrent_sessions`, `max_sessions_per_call`, and `agent_idle_timeout` to prevent resource exhaustion.
- **Metrics broadcast interval**: Default is 5 seconds. Adjust `broadcast_metrics_interval` if you need faster or slower updates.
- **MCP server timeouts**: Remote MCP servers have default `timeout=10.0` and `session_timeout=300.0`. Increase for slow services.

## Verification Checklist

Before submitting agent code:

- [ ] `.env` file exists and all required API keys are filled in
- [ ] `create_agent()` returns an `Agent` instance with valid `edge`, `llm`, and `agent_user`
- [ ] `join_call()` is async and calls `agent.join(call)` as a context manager
- [ ] `runner = Runner(AgentLauncher(...))` is instantiated and `runner.cli()` is called in `__main__`
- [ ] Agent runs locally: `uv run agent.py run` opens a browser link
- [ ] All registered functions are async (no sync functions with `@llm.register_function()`)
- [ ] If using custom pipeline (STT + LLM + TTS), all three are configured
- [ ] If using realtime mode, no separate STT/TTS/turn_detection are configured
- [ ] Video processors (if any) are added to `processors=[]` list
- [ ] MCP servers (if any) are added to `mcp_servers=[]` list
- [ ] Tests pass: `uv run pytest tests/` (if tests exist)
- [ ] Docker builds: `docker buildx build --platform linux/amd64 -t agent .`
- [ ] HTTP server starts: `uv run agent.py serve --host 0.0.0.0 --port 8000`
- [ ] Health check passes: `curl http://localhost:8000/health`

## Resources

- **[llms.txt](https://visionagents.ai/llms.txt)** — Comprehensive page-by-page navigation of all documentation
- **[Quickstart](https://visionagents.ai/introduction/quickstart)** — Build your first agent in 5 minutes
- **[Voice Agents](https://visionagents.ai/introduction/voice-agents)** — Realtime models vs custom pipelines, function calling, phone integration
- **[Video Agents](https://visionagents.ai/introduction/video-agents)** — VLMs, YOLO processors, real-time video analysis
- **[Agent Class Reference](https://visionagents.ai/core/agent-core)** — Full API: lifecycle, response methods, event system, MCP integration
- **[Integrations](https://visionagents.ai/integrations/introduction-to-integrations)** — 35+ plugins: LLMs, STT, TTS, vision, avatars, turn detection, infrastructure
- **[HTTP Server & Deployment](https://visionagents.ai/guides/http-server)** — Session management, authentication, CORS, scaling
- **[Testing](https://visionagents.ai/guides/testing)** — TestSession, LLMJudge, function call assertions
- **[Telemetry](https://visionagents.ai/core/telemetry)** — OpenTelemetry, Prometheus, Jaeger, metrics reference

---

> For additional documentation and navigation, see: https://visionagents.ai/llms.txt