import { C, CodeBlock, QuizBank, Icon, InfoBox } from "../../components";
import { StaticCard, SectionDivider } from "./_helpers";

export default function TTSSection() {
  return (
  <div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Text-to-Speech</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      The agent&apos;s voice. Modern TTS can stream audio in real-time, sound nearly human,
      and even clone specific voices. Here&apos;s your toolkit.
    </p>

    <div id="local-tts-tools" style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 12, scrollMarginTop: 120 }}>Local / Open-Source Tools</div>
    <div style={{ display: "grid", gap: 24, marginBottom: 24 }}>
      {[
        {
          name: "Piper TTS",
          color: C.accent,
          desc: "ONNX-based neural TTS that runs on minimal hardware — even a Raspberry Pi. Pre-installed and available system-wide. Fast synthesis but limited to sentence-level streaming.",
          lang: "bash",
          code: `# Piper is pre-installed and available system-wide\n# Wrapper at /usr/local/bin/piper → /opt/piper/speak.py\n\n# Basic text-to-speech\necho "Hello, this is Piper text to speech." \\\n  | piper --model /opt/piper/models/en_US-lessac-medium.onnx --output_raw \\\n  | aplay -r 22050 -f S16_LE\n\n# Save to a file instead of playing\necho "Save this to a file." \\\n  | piper --model /opt/piper/models/en_US-lessac-medium.onnx --output_file output.wav`,
        },
        {
          name: "Kokoro TTS",
          color: C.accent,
          desc: "82M parameter TTS model with excellent quality and natural prosody. ONNX-based, runs on CPU. Higher quality than Piper but slightly slower. Streaming server available via Kokoro-FastAPI.",
          lang: "bash",
          code: `# Kokoro is pre-installed and available system-wide\n# Wrapper at /usr/local/bin/kokoro → /opt/kokoro/speak.py\n\n# Basic text-to-speech\necho "Hello, this is Kokoro text to speech." \\\n  | kokoro \\\n  | aplay -r 24000 -f S16_LE\n\n# Kokoro-FastAPI streaming server (if running)\n# Web UI at http://localhost:8880/web\ntime curl -s http://localhost:8880/v1/audio/speech \\\n  -H "Content-Type: application/json" \\\n  -d \'{"input": "Hello from Kokoro streaming server.", "voice": "af_heart", "response_format": "wav"}\' \\\n  -o output.wav && aplay output.wav`,
        },
        {
          name: "Coqui XTTS",
          color: C.accent,
          desc: <>Zero-shot voice cloning and TTS — clone a voice from just 6 seconds of audio. Requires more compute than Piper or Kokoro. We use the original <code style={{ background: C.codeBg, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>TTS</code> package, not the community <code style={{ background: C.codeBg, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>coqui-tts</code> fork.<div style={{ background: `${C.tertiary}15`, border: `1px solid ${C.tertiary}44`, borderRadius: 6, padding: "8px 12px", marginTop: 10, fontSize: 13, color: C.tertiary, display: "flex", alignItems: "flex-start", gap: 8 }}><Icon name="warning" size={14} style={{ flexShrink: 0, marginTop: 2 }} /><span>Coqui AI shut down in early 2024. This package has known dependency issues and is not actively maintained. Use for demos and experimentation only — not recommended for production.</span></div></>,
          lang: "bash",
          code: `# Coqui TTS is pre-installed and available system-wide\n# Wrapper at /usr/local/bin/coqui-tts → /opt/coqui-tts/.venv/bin/tts\n\n# Basic text-to-speech\ncoqui-tts --text "Hello, this is Coqui TTS." --out_path output.wav\naplay output.wav\n\n# List available models\ncoqui-tts --list_models\n\n# Voice cloning with XTTS v2 (provide a reference audio clip)\ncoqui-tts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n  --text "Hello, this is a cloned voice." \\\n  --speaker_wav reference_voice.wav \\\n  --language_idx en \\\n  --out_path cloned_output.wav`,
        },
      ].map((tool, i) => (
        <div key={i} style={{ background: C.card, border: `1px solid ${tool.color}33`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: tool.color }}>{tool.name}</div>
            <span style={{ background: `${tool.color}20`, color: tool.color, padding: "2px 8px", borderRadius: 4, fontSize: 14, fontWeight: 700 }}>Local</span>
          </div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>{tool.desc}</div>
          <CodeBlock code={tool.code} language={tool.lang} />
        </div>
      ))}
    </div>

    <SectionDivider />
    <div id="commercial-tts" style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 12, scrollMarginTop: 120 }}>Commercial Cloud Alternatives</div>
    <InfoBox>These companies are not sponsors or affiliated with this training or Call Center Village. They're listed for educational awareness only.<br /><span style={{ color: C.dim, fontStyle: "italic" }}>That being said, if any of you are reading this — Call Center Village is <a href="https://callcentervillage.com/sponsors" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>always looking for sponsors</a>!</span></InfoBox>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
      {[
        { name: "ElevenLabs", url: "https://elevenlabs.io", logo: "/images/elevenlabs-logo.ico", color: C.accent, desc: "Industry-leading voice quality with streaming API and voice cloning. Used by many production voice agents." },
        { name: "Cartesia (Sonic)", url: "https://www.cartesia.ai", logo: "/images/cartesia-logo.png", logoBg: "#ffffff", color: C.highlight, desc: "Built specifically for real-time voice agents. State-space architecture with ultra-low latency." },
        { name: "Murf AI", url: "https://murf.ai", logo: "/images/murf-logo.ico", color: C.tertiary, desc: "AI voice platform with text-to-speech, voice cloning, and AI dubbing tools." },
        { name: "Deepgram Aura", url: "https://deepgram.com", logo: "/images/deepgram-logo.ico", color: C.secondary, desc: "TTS optimized for voice agents with extremely low latency. From the same company as their STT product." },
      ].map((svc, i) => (
        <div key={i} style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <img src={svc.logo} alt={svc.name} style={{ width: 40, height: 40, borderRadius: 8, background: svc.logoBg || "transparent", padding: svc.logoBg ? 4 : 0 }} />
            <a href={svc.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 16, fontWeight: 800, color: svc.color, textDecoration: "none" }}>{svc.name} ↗</a>
          </div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{svc.desc}</div>
        </div>
      ))}
    </div>
    <p style={{ fontSize: 12, color: C.dim, textAlign: "center", marginTop: 16 }}>Have a suggestion for a TTS service to include here? Email us at <a href="mailto:support@callcentervillage.com" style={{ color: C.accent, textDecoration: "underline" }}>support@callcentervillage.com</a></p>

    <SectionDivider />
    <div id="choosing-tts" style={{ scrollMarginTop: 120 }}>
    <StaticCard title={<><Icon name="magnifying-glass" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Choosing TTS for Your Agent</>}>
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
    </StaticCard>
    </div>

    <SectionDivider />
    <QuizBank questions={[{ question: `Which local TTS tool offers the best audio quality on CPU?`, options: ["Piper", "Kokoro", "Deepgram Aura", "ElevenLabs"], correctIndex: 1, explanation: `Kokoro is an 82M parameter ONNX-based model that produces excellent quality audio on CPU. Piper is faster but lower quality. Deepgram Aura and ElevenLabs are cloud services, not local tools.` }, { question: `What is the main advantage of Piper TTS over Kokoro TTS?`, options: ["Better voice quality", "Faster synthesis on CPU with lower resource requirements", "Supports voice cloning", "It's a cloud service"], correctIndex: 1, explanation: `Piper is ONNX-based and designed to run on minimal hardware — even a Raspberry Pi. It synthesizes faster than Kokoro on CPU, though Kokoro produces higher quality audio. The tradeoff is speed vs quality.` }, { question: `Why is Coqui TTS not recommended for production use?`, options: ["It only works on GPU", "It sounds worse than all other options", "The company shut down in 2024 and the package has known dependency issues", "It requires a paid license"], correctIndex: 2, explanation: `Coqui AI shut down in early 2024. While the original TTS package still works, it has known dependency conflicts and is not actively maintained. It's fine for demos and experimentation but not reliable enough for production use.` }]} />
  </div>
  );
}
