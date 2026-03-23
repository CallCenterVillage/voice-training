import { C, InfoBox } from '../../components';

const IntroSection = () => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
      <img src="/images/ccv-logo.png" alt="CCV" style={{ width: 64, height: 64, borderRadius: 12, border: `2px solid ${C.primary}` }} />
      <div>
        <h1 style={{ margin: 0, fontSize: 42, fontWeight: 800, letterSpacing: -1, lineHeight: 1.1, background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Appendix</h1>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>Call Center Village Training Reference</div>
      </div>
    </div>
    <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>Quick reference commands, cheat sheets, and recipes for common tasks you'll encounter in the lab. Everything below is configured on the Call Center Village laptops.</p>
    <InfoBox>The Call Center Village laptop environment is Pop!_OS 24.04 LTS from System76.</InfoBox>

    <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 10, marginTop: 24 }}>CLI Tools</div>
    <div style={{ overflowX: "auto", marginBottom: 20 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${C.border}` }}>
            {["Tool", "Location", "Purpose"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: C.accent, fontWeight: 700 }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {[
            ["whisper.cpp", "/opt/whisper.cpp", "Speech-to-text transcription"],
            ["Faster Whisper", "/opt/faster-whisper", "Accelerated speech-to-text"],
            ["llama.cpp", "/opt/llama.cpp", "Local language model inference"],
            ["Piper", "/opt/piper", "Lightweight local TTS"],
            ["Kokoro", "/opt/kokoro", "ONNX-based TTS"],
            ["Coqui TTS", "/opt/coqui-tts", "XTTS voice cloning"],
            ["Spark TTS", "/opt/spark-tts", "Zero-shot voice cloning"],
          ].map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
              {row.map((cell, j) => <td key={j} style={{ padding: "8px 12px", color: j === 0 ? C.text : C.muted, fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 10, marginTop: 32 }}>HTTP Services</div>
    <div style={{ overflowX: "auto", marginBottom: 32 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${C.border}` }}>
            {["Tool", "Location", "URL", "Purpose"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: C.accent, fontWeight: 700 }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {[
            ["llama.cpp", "/opt/llama.cpp", "http://localhost:8080", "LLM API server"],
            ["Kokoro-FastAPI", "/opt/kokoro-fastapi", "http://localhost:8880", "Fast TTS API"],
            ["Qwen3-TTS", "/opt/qwen3-tts", "http://localhost:8001", "LLM-based TTS"],
            ["OpenVoice", "/opt/openvoice", "http://localhost:7866", "Tone color conversion"],
            ["RVC", "/opt/rvc", "http://localhost:7865", "Voice conversion training"],
          ].map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
              {row.map((cell, j) => <td key={j} style={{ padding: "8px 12px", color: j === 0 ? C.text : C.muted, fontWeight: j === 0 ? 600 : 400 }}>
                {j === 2 ? <a href={cell} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>{cell}</a> : cell}
              </td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 10 }}>Laptop Accounts</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>callcentervillage</div>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
          Standard user account. If you need help with anything that requires elevated access, find a supervisor.
        </div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>supervisor</div>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
          Admin account with sudo privileges. Only used by Call Center Village staff.
        </div>
      </div>
    </div>

    <p style={{ fontSize: 12, color: C.dim, textAlign: "center" }}>This training is designed for 1920×1080 resolution on a desktop browser with a headset and microphone. We recommend <a href="https://librewolf.net" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>LibreWolf</a>.</p>
  </div>
);

export default IntroSection;
