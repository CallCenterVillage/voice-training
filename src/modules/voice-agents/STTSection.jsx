import { C, CodeBlock, QuizBank, InfoBox, SectionDivider, ServiceCardGrid } from "../../components";

export default function STTSection() {
  return (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Speech-to-Text</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      The agent&apos;s ears. STT must be fast, accurate, and handle real-world audio conditions — background noise,
      accents, cross-talk, and telephone-quality audio.
    </p>

    <h2 id="local-stt-tools" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Local / Open-Source Tools</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Run speech-to-text entirely on your machine — no cloud, no API keys, no audio leaving your network. These tools let you transcribe recordings, stream live audio, and benchmark model performance all locally.
    </p>

    <h2 id="whisper-cpp" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>whisper.cpp</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>C/C++ port of OpenAI Whisper. Runs on CPU/GPU locally. Best for batch processing but can do near-real-time with streaming mode.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
      <CodeBlock language="bash" code={`# whisper.cpp is pre-built at /opt/whisper.cpp\n# System-wide wrappers available at /usr/local/bin\n# (whisper-cli, whisper-stream, whisper-server)\n\n# Transcribe a file\nwhisper-cli \\\n  -m /opt/whisper.cpp/models/ggml-base.en.bin \\\n  -f /opt/whisper.cpp/samples/jfk.wav\n\n# Stream from microphone (real-time, requires SDL2)\nwhisper-stream \\\n  -m /opt/whisper.cpp/models/ggml-base.en.bin \\\n  -t 8 \\\n  --step 500 \\\n  --length 5000\n\n# Compare speed between models using time\ntime whisper-cli \\\n  -m /opt/whisper.cpp/models/ggml-tiny.en.bin \\\n  -f /opt/whisper.cpp/samples/jfk.wav\n\ntime whisper-cli \\\n  -m /opt/whisper.cpp/models/ggml-base.en.bin \\\n  -f /opt/whisper.cpp/samples/jfk.wav\n\n# Color-coded confidence output (green = high, red = low)\nwhisper-cli \\\n  -m /opt/whisper.cpp/models/ggml-base.en.bin \\\n  -f /opt/whisper.cpp/samples/jfk.wav \\\n  --print-colors\n\n# Compare multilingual vs English-only on a larger model\ntime whisper-cli \\\n  -m /opt/whisper.cpp/models/ggml-small.bin \\\n  -f /opt/whisper.cpp/samples/jfk.wav\n\ntime whisper-cli \\\n  -m /opt/whisper.cpp/models/ggml-small.en.bin \\\n  -f /opt/whisper.cpp/samples/jfk.wav`} />
    </div>

    <h2 id="faster-whisper" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Faster Whisper</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>CTranslate2-based Whisper reimplementation. 4x faster than original with same accuracy. Great for real-time with VAD.</p>
    <InfoBox>
      <strong style={{ color: C.text }}>Privacy Notice</strong>
      <br /><br />The first run normally downloads models from Hugging Face. Pre-downloaded models are available at <code style={{ background: C.codeBg, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>/opt/faster-whisper/models/</code>
      <br /><br />Use <code style={{ background: C.codeBg, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>--model</code> with a local path to skip Hugging Face entirely:
      <br /><code style={{ background: C.codeBg, padding: "4px 8px", borderRadius: 4, fontSize: 12, display: "inline-block", marginTop: 4 }}>faster-whisper audio.wav --model /opt/faster-whisper/models/base.en</code>
    </InfoBox>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 24, marginTop: 12 }}>
      <CodeBlock language="bash" code={`# Faster Whisper is pre-installed and available system-wide\n# Wrapper at /usr/local/bin/faster-whisper → /opt/faster-whisper/transcribe.py\n# Managed via uv venv at /opt/faster-whisper\n\n# Basic transcription (using local model)\nfaster-whisper audio.wav \\\n  --model /opt/faster-whisper/models/base.en\n\n# Specify device and language\nfaster-whisper audio.wav \\\n  --model /opt/faster-whisper/models/base.en \\\n  --device cpu \\\n  --language en\n\n# Use a different model\nfaster-whisper audio.wav \\\n  --model /opt/faster-whisper/models/small.en \\\n  --device cpu \\\n  --language en\n\n# Compare speed between models using time\ntime faster-whisper audio.wav \\\n  --model /opt/faster-whisper/models/tiny.en\n\ntime faster-whisper audio.wav \\\n  --model /opt/faster-whisper/models/base.en\n\ntime faster-whisper audio.wav \\\n  --model /opt/faster-whisper/models/small.en`} />
    </div>

    <SectionDivider />
    <h2 id="commercial-stt" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12, scrollMarginTop: 120 }}>Commercial Cloud Alternatives</h2>
    <InfoBox>These companies are not sponsors or affiliated with this training or Call Center Village. They're listed for educational awareness only.<br /><span style={{ color: C.dim, fontStyle: "italic" }}>That being said, if any of you are reading this — Call Center Village is <a href="https://callcentervillage.com/sponsors" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>always looking for sponsors</a>!</span></InfoBox>
    <ServiceCardGrid services={[
      { name: "Deepgram", url: "https://deepgram.com", logo: "/images/deepgram-logo.ico", color: C.accent, desc: "Commercial streaming STT. Purpose-built for real-time voice agents. Low latency with word-level timestamps." },
      { name: "AssemblyAI", url: "https://www.assemblyai.com", logo: "/images/assemblyai-logo.ico", color: C.highlight, desc: "Streaming STT with speaker diarization, sentiment analysis, and entity detection." },
      { name: "ElevenLabs", url: "https://elevenlabs.io", logo: "/images/elevenlabs-logo.ico", color: C.tertiary, desc: "Known for TTS, also offers speech-to-text with low latency and multilingual support." },
      { name: "Murf AI", url: "https://murf.ai", logo: "/images/murf-logo.ico", color: C.secondary, desc: "AI voice platform with speech-to-text capabilities alongside their voice generation tools." },
    ]} />
    <p style={{ fontSize: 12, color: C.dim, textAlign: "center", marginTop: 16 }}>Have a suggestion for a speech-to-text service to include here? Email us at <a href="mailto:support@callcentervillage.com" style={{ color: C.accent, textDecoration: "underline" }}>support@callcentervillage.com</a></p>

    <SectionDivider />
    <div id="knowledge-check" style={{ scrollMarginTop: 120 }}><QuizBank questions={[{ question: `What is the main advantage of using whisper.cpp or Faster Whisper over a cloud STT service?`, options: ["They are always faster than cloud services", "Your audio data stays local and never leaves your machine", "They support more languages", "They require no setup or configuration"], correctIndex: 1, explanation: `The primary advantage of local STT tools like whisper.cpp and Faster Whisper is privacy — your audio is processed entirely on your machine and never sent to a third-party server. Cloud services may offer lower latency, but your audio data leaves your network and is subject to the provider's data handling policies.` }, { question: `By default, what does Faster Whisper do the first time you use a model?`, options: ["Downloads the model from Hugging Face over the internet", "Uses a built-in model bundled with the package", "Prompts you to manually provide a model file", "Refuses to run without a local model path"], correctIndex: 0, explanation: `Faster Whisper automatically connects to Hugging Face to download models on first use. If you're privacy-focused or working in an air-gapped environment, you should point it to a pre-downloaded local model path using the --model flag to avoid any outbound network connections.` }, { question: `Which Faster Whisper flag specifies whether to run inference on CPU or GPU? (Hint: try faster-whisper -h)`, options: ["--compute_type", "--model", "--device", "--backend"], correctIndex: 2, explanation: `The --device flag controls whether Faster Whisper runs on CPU or GPU (e.g., --device cpu or --device cuda). Try running faster-whisper -h to see all available flags.` }]} /></div>
  </div>
  );
}
