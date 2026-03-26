import { C, CodeBlock, QuizBank, Icon, InfoBox, SectionDivider, ServiceCardGrid } from "../../components";

export default function TTSSection() {
  return (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Text-to-Speech</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      The agent&apos;s voice. Modern TTS can stream audio in real-time, sound nearly human,
      and even clone specific voices. Here&apos;s your toolkit.
    </p>

    <h2 id="local-tts-tools" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Local / Open-Source Tools</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Run text-to-speech entirely on your machine — no cloud, no API keys, no audio leaving your network. These tools let you synthesize speech from text, compare voice quality across engines, and even clone voices locally.
    </p>

    <h2 id="piper-tts" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Piper TTS</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>ONNX-based neural TTS that runs on minimal hardware — even a Raspberry Pi. Pre-installed and available system-wide. Fast synthesis but limited to sentence-level streaming.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
      <CodeBlock language="bash" code={`# Piper is pre-installed and available system-wide\n# Wrapper at /usr/local/bin/piper → /opt/piper/speak.py\n\n# Basic text-to-speech\necho "Hello, this is Piper text to speech." \\\n  | piper --model /opt/piper/models/en_US-lessac-medium.onnx --output_raw \\\n  | aplay -r 22050 -f S16_LE\n\n# Save to a file instead of playing\necho "Save this to a file." \\\n  | piper --model /opt/piper/models/en_US-lessac-medium.onnx --output_file output.wav`} />
    </div>

    <h2 id="kokoro-tts" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Kokoro TTS</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>82M parameter TTS model with excellent quality and natural prosody. ONNX-based, runs on CPU. Higher quality than Piper but slightly slower. Streaming server available via Kokoro-FastAPI.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
      <CodeBlock language="bash" code={`# Kokoro is pre-installed and available system-wide\n# Wrapper at /usr/local/bin/kokoro → /opt/kokoro/speak.py\n\n# Basic text-to-speech\necho "Hello, this is Kokoro text to speech." \\\n  | kokoro \\\n  | aplay -r 24000 -f S16_LE\n\n# Kokoro-FastAPI streaming server (if running)\n# Web UI at http://localhost:8880/web\ntime curl -s http://localhost:8880/v1/audio/speech \\\n  -H "Content-Type: application/json" \\\n  -d '{"input": "Hello from Kokoro streaming server.", "voice": "af_heart", "response_format": "wav"}' \\\n  -o output.wav && aplay output.wav`} />
    </div>

    <h2 id="coqui-xtts" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Coqui XTTS</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Zero-shot voice cloning and TTS — clone a voice from just 6 seconds of audio. Requires more compute than Piper or Kokoro. We use the original <code style={{ background: C.codeBg, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>TTS</code> package, not the community <code style={{ background: C.codeBg, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>coqui-tts</code> fork.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
      <div style={{ background: `${C.tertiary}15`, border: `1px solid ${C.tertiary}44`, borderRadius: 6, padding: "8px 12px", marginBottom: 12, fontSize: 13, color: C.tertiary, display: "flex", alignItems: "flex-start", gap: 8 }}><Icon name="warning" size={14} style={{ flexShrink: 0, marginTop: 2 }} /><span>Coqui AI shut down in early 2024. This package has known dependency issues and is not actively maintained. Use for demos and experimentation only — not recommended for production.</span></div>
      <CodeBlock language="bash" code={`# Coqui TTS is pre-installed and available system-wide\n# Wrapper at /usr/local/bin/coqui-tts → /opt/coqui-tts/.venv/bin/tts\n\n# Basic text-to-speech\ncoqui-tts --text "Hello, this is Coqui TTS." --out_path output.wav\naplay output.wav\n\n# List available models\ncoqui-tts --list_models\n\n# Voice cloning with XTTS v2 (provide a reference audio clip)\ncoqui-tts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n  --text "Hello, this is a cloned voice." \\\n  --speaker_wav reference_voice.wav \\\n  --language_idx en \\\n  --out_path cloned_output.wav`} />
    </div>

    <SectionDivider />
    <h2 id="commercial-tts" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12, scrollMarginTop: 120 }}>Commercial Cloud Alternatives</h2>
    <InfoBox>These companies are not sponsors or affiliated with this training or Call Center Village. They're listed for educational awareness only.<br /><span style={{ color: C.dim, fontStyle: "italic" }}>That being said, if any of you are reading this — Call Center Village is <a href="https://callcentervillage.com/sponsors" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>always looking for sponsors</a>!</span></InfoBox>
    <ServiceCardGrid services={[
      { name: "ElevenLabs", url: "https://elevenlabs.io", logo: "/images/elevenlabs-logo.ico", color: C.accent, desc: "Industry-leading voice quality with streaming API and voice cloning. Used by many production voice agents." },
      { name: "Cartesia (Sonic)", url: "https://www.cartesia.ai", logo: "/images/cartesia-logo.png", logoBg: "#ffffff", color: C.highlight, desc: "Built specifically for real-time voice agents. State-space architecture with ultra-low latency." },
      { name: "Murf AI", url: "https://murf.ai", logo: "/images/murf-logo.ico", color: C.tertiary, desc: "AI voice platform with text-to-speech, voice cloning, and AI dubbing tools." },
      { name: "Deepgram Aura", url: "https://deepgram.com", logo: "/images/deepgram-logo.ico", color: C.secondary, desc: "TTS optimized for voice agents with extremely low latency. From the same company as their STT product." },
    ]} />
    <p style={{ fontSize: 12, color: C.dim, textAlign: "center", marginTop: 16 }}>Have a suggestion for a TTS service to include here? Email us at <a href="mailto:support@callcentervillage.com" style={{ color: C.accent, textDecoration: "underline" }}>support@callcentervillage.com</a></p>

    <SectionDivider />
    <h2 id="choosing-tts" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Choosing TTS for Your Agent</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>The right TTS depends on your use case — speed, quality, privacy, and budget all factor in.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Scenario", "Recommended TTS", "Why"].map(h => (
                <th key={h} style={{ padding: 8, textAlign: "left", color: C.secondary, fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Quick local demo", "Piper", "Fastest on CPU, minimal setup"],
              ["High-quality local demo", "Kokoro", "Best quality for local, runs on CPU"],
              ["Voice cloning attack sim", "Coqui XTTS", "Local cloning + generation in one"],
              ["Edge / IoT deployment", "Piper", "Runs on minimal hardware"],
              ["Production voice agent", "ElevenLabs / Cartesia", "Best quality + streaming + low latency"],
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
    <div id="knowledge-check" style={{ scrollMarginTop: 120 }}><QuizBank questions={[{ question: `Which local TTS tool offers the best audio quality on CPU?`, options: ["Piper", "Kokoro", "Deepgram Aura", "ElevenLabs"], correctIndex: 1, explanation: `Kokoro is an 82M parameter ONNX-based model that produces excellent quality audio on CPU. Piper is faster but lower quality. Deepgram Aura and ElevenLabs are cloud services, not local tools.` }, { question: `What is the main advantage of Piper TTS over Kokoro TTS?`, options: ["Better voice quality", "Faster synthesis on CPU with lower resource requirements", "Supports voice cloning", "It's a cloud service"], correctIndex: 1, explanation: `Piper is ONNX-based and designed to run on minimal hardware — even a Raspberry Pi. It synthesizes faster than Kokoro on CPU, though Kokoro produces higher quality audio. The tradeoff is speed vs quality.` }, { question: `Why is Coqui TTS not recommended for production use?`, options: ["It only works on GPU", "It sounds worse than all other options", "The company shut down in 2024 and the package has known dependency issues", "It requires a paid license"], correctIndex: 2, explanation: `Coqui AI shut down in early 2024. While the original TTS package still works, it has known dependency conflicts and is not actively maintained. It's fine for demos and experimentation but not reliable enough for production use.` }]} /></div>
  </div>
  );
}
