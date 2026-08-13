import { useState } from "react";
import { C, CodeBlock, NextModuleLink, SectionDivider, Tabs, tabPanelProps } from "../../components";

export default function LabSection() {
  const [exercise, setExercise] = useState(0);
  const exercises = [
    {
      title: "Exercise 1: Local STT Pipeline",
      desc: "Set up whisper.cpp and transcribe audio in real-time from your microphone.",
      code: `# Build whisper.cpp with streaming support\ngit clone https://github.com/ggerganov/whisper.cpp\ncd whisper.cpp && make\nbash models/download-ggml-model.sh base.en\n\n# Test with a file first\n./main -m models/ggml-base.en.bin -f test_audio.wav\n\n# Stream from microphone\n./stream -m models/ggml-base.en.bin \\\n  --step 500 --length 5000 -t 4\n\n# Experiment: try different models\n# tiny.en (fastest), base.en (balanced), small.en (most accurate)`,
    },
    {
      title: "Exercise 2: Local LLM Server",
      desc: "Run llama.cpp as an OpenAI-compatible API server.",
      code: `# Build llama.cpp\ngit clone https://github.com/ggerganov/llama.cpp\ncd llama.cpp && make -j\n\n# Download a model (use huggingface-cli or wget)\n# Recommended: Llama 3.1 8B Instruct (Q4_K_M quantization)\n\n# Start the server\n./llama-server \\\n  -m models/llama-3.1-8b-instruct-q4_k_m.gguf \\\n  --host 0.0.0.0 --port 8080 \\\n  -c 4096 \\\n  -ngl 35\n\n# Test it (OpenAI-compatible API!)\ncurl http://localhost:8080/v1/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "messages": [{"role":"user","content":"Hello, who are you?"}],\n    "max_tokens": 100\n  }'`,
    },
    {
      title: "Exercise 3: LiveKit Agent",
      desc: "Set up LiveKit and deploy a basic voice agent.",
      code: `# Install LiveKit server (local dev)\ncurl -sSL https://get.livekit.io | bash\nlivekit-server --dev\n\n# In another terminal: set up agent\nmkdir my-agent && cd my-agent\npython -m venv venv && source venv/bin/activate\npip install livekit-agents livekit-plugins-silero\n\n# Create agent.py (see Building section for AgentSession code)\n# Then run:\npython agent.py dev\n\n# Connect via LiveKit Playground:\n# https://agents-playground.livekit.io\n# Enter your local server URL`,
    },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Interactive Lab</h1>
      <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
        Hands-on exercises to build and test a voice agent. Follow these in order for the best experience.
      </p>
      <Tabs
        idBase="va-lab"
        label="Lab exercises"
        selected={String(exercise)}
        onSelect={key => setExercise(Number(key))}
        tabs={exercises.map((ex, i) => ({ key: String(i), label: ex.title }))}
        style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}
        tabStyle={isSelected => ({ background: isSelected ? `${C.secondary}20` : C.card, border: `1px solid ${isSelected ? C.secondary : C.border}`, borderRadius: 8, padding: "10px 14px", minHeight: 44, color: isSelected ? C.secondary : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600 })}
      />
      <div {...tabPanelProps("va-lab", String(exercise))} style={{ background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${C.secondary}33` }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: C.text }}>{exercises[exercise].title}</h3>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>{exercises[exercise].desc}</div>
        <CodeBlock code={exercises[exercise].code} language="bash" />
      </div>
      <SectionDivider />
      <NextModuleLink href="/social-engineering/intro" label="Continue to Social Engineering" />
    </div>
  );
}
