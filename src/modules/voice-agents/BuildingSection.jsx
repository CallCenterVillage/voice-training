import { C, CodeBlock, QuizBank, SectionDivider } from "../../components";

export default function BuildingSection() {
  return (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Building an Agent</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Let&apos;s walk through building a complete voice agent from scratch, step by step. We&apos;ll cover both
      the fully-local approach and the cloud-hybrid approach.
    </p>

    <h2 id="fully-local-agent" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Option A: Fully Local Agent Stack</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Everything runs on your machine. No API calls, no data leaving your network.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <CodeBlock language="bash" code={`# === FULLY LOCAL VOICE AGENT ===\n\n# 1. Start local LLM server (llama.cpp)\n./llama-server -m models/llama-3.1-8b-instruct.gguf \\\n  --host 0.0.0.0 --port 8080 -c 4096 -ngl 35\n\n# 2. Python agent script:\npip install faster-whisper piper-tts pyaudio numpy\n\n# agent_local.py — see full code in lab exercises`} />
      <div style={{ marginTop: 16 }} />
      <CodeBlock language="python" code={`# agent_local.py — Minimal local voice agent skeleton\nimport pyaudio, numpy as np, requests, subprocess, io, wave\nfrom faster_whisper import WhisperModel\n\n# Init STT\nstt_model = WhisperModel("/opt/faster-whisper/models/base.en", device="cpu", compute_type="int8")\n\n# Audio settings\nRATE, CHUNK = 16000, 1024\naudio = pyaudio.PyAudio()\nstream = audio.open(format=pyaudio.paInt16, channels=1, rate=RATE,\n                    input=True, frames_per_buffer=CHUNK)\n\ndef transcribe(audio_data):\n    """Local STT with faster-whisper"""\n    segments, _ = stt_model.transcribe(audio_data, beam_size=5, vad_filter=True)\n    return " ".join([s.text for s in segments])\n\ndef think(text, history):\n    """Local LLM via llama.cpp server (OpenAI-compatible)"""\n    messages = history + [{"role": "user", "content": text}]\n    resp = requests.post("http://localhost:8080/v1/chat/completions", json={\n        "messages": messages, "max_tokens": 150, "stream": False\n    })\n    return resp.json()["choices"][0]["message"]["content"]\n\ndef speak(text):\n    """Local TTS with Piper"""\n    proc = subprocess.run(\n        ["piper", "--model", "en_US-lessac-medium.onnx", "--output_raw"],\n        input=text.encode(), capture_output=True\n    )\n    # Play proc.stdout as raw audio...\n\nprint("Agent ready. Speak into microphone...")\n# Main loop: listen → transcribe → think → speak`} />
    </div>

    <SectionDivider />
    <h2 id="cloud-hybrid-livekit" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Option B: Cloud-Hybrid with LiveKit</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Uses LiveKit for transport with cloud STT/LLM/TTS for best quality and lowest latency.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <CodeBlock language="python" code={`# Full LiveKit agent with function calling (Agents 1.0+ API)\nfrom livekit import agents\nfrom livekit.agents import AgentServer, AgentSession, Agent, room_io, function_tool\nfrom livekit.plugins import silero\n\nclass CustomerAgent(Agent):\n    def __init__(self):\n        super().__init__(\n            instructions=\"\"\"You are a customer service agent.\n            Keep responses short and conversational.\n            Use tools to look up accounts and transfer calls.\"\"\"\n        )\n\n    @function_tool(description="Look up a customer account by phone number")\n    async def lookup_account(self, phone_number: str) -> str:\n        # Your database lookup logic here\n        return "Account found: John Doe, Balance: $1,234.56"\n\n    @function_tool(description="Transfer the call to a human agent")\n    async def transfer_to_human(self, reason: str) -> str:\n        # Trigger call transfer logic\n        return f"Transferring to human agent. Reason: {reason}"\n\nserver = AgentServer()\n\n@server.rtc_session(agent_name="customer-service")\nasync def entrypoint(ctx: agents.JobContext):\n    session = AgentSession(\n        stt="deepgram/nova-3",\n        llm="openai/gpt-4.1-mini",\n        tts="cartesia/sonic-3",\n        vad=silero.VAD.load(),\n    )\n    await session.start(room=ctx.room, agent=CustomerAgent())\n    await session.generate_reply(\n        instructions="Thank the caller and ask how you can help."\n    )\n\nif __name__ == "__main__":\n    agents.cli.run_app(server)`} />
    </div>

    <SectionDivider />
    <h2 id="architecture-decision-matrix" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Architecture Decision Matrix</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Comparing the tradeoffs between a fully local stack and a cloud-hybrid approach.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Factor", "Fully Local", "Cloud Hybrid"].map(h => (
                <th key={h} style={{ padding: 8, textAlign: "left", color: C.secondary, fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Setup complexity", "High (GPU, models, deps)", "Medium (API keys, LiveKit)"],
              ["Latency", "~1-2s (CPU), ~500ms (GPU)", "~500-800ms"],
              ["Voice quality", "Good (Piper) to Great (XTTS)", "Excellent (ElevenLabs/Cartesia)"],
              ["Privacy", "Complete — nothing leaves machine", "Audio/text goes to cloud providers"],
              ["Cost", "Hardware only", "Per-minute API costs"],
              ["Scalability", "Limited by hardware", "Elastic"],
              ["Best for", "Security research, red teaming", "Production, demos, PoCs"],
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.codeBg}` }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: 8, color: j === 0 ? C.text : C.muted }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <SectionDivider />
    <div id="knowledge-check" style={{ scrollMarginTop: 120 }}><QuizBank questions={[{ question: `In the fully local agent stack, how does the Python agent communicate with the LLM?`, options: ["It loads the model directly into Python", "It sends requests to a local llama.cpp server running an OpenAI-compatible API", "It calls the OpenAI cloud API", "It uses LiveKit's built-in LLM plugin"], correctIndex: 1, explanation: `The local agent runs llama.cpp as a separate server process on localhost:8080, which exposes an OpenAI-compatible API. The Python script sends HTTP requests to this local endpoint — no cloud calls involved.` }, { question: `What does the @function_tool decorator do in the LiveKit cloud-hybrid agent example?`, options: ["It defines a new API endpoint", "It registers a function that the LLM can choose to call during a conversation", "It creates a webhook for incoming calls", "It schedules a background task"], correctIndex: 1, explanation: `The @function_tool decorator registers a Python function as a tool the LLM can invoke. When the LLM decides it needs to look up an account or transfer a call, it calls the corresponding function — this is how voice agents take real actions beyond just talking.` }, { question: `According to the architecture decision matrix, which approach offers complete data privacy?`, options: ["Cloud hybrid — data is encrypted in transit", "Both approaches offer the same level of privacy", "Fully local — nothing leaves your machine", "Neither — both send data to external services"], correctIndex: 2, explanation: `The fully local stack keeps everything on your machine — STT, LLM, and TTS all run locally. No audio or text is sent to any cloud provider. The cloud-hybrid approach sends audio and text to external services like Deepgram, OpenAI, and Cartesia.` }]} /></div>
  </div>
  );
}
