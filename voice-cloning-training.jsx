import { useState, useEffect, useRef } from "react";
import { C, CodeBlock, InteractiveCard, QuizBank, TrainingShell, Icon } from './src/components';
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const SECTIONS = [
  { id: "intro", title: "Welcome", icon: "microphone" },
  { id: "fundamentals", title: "Audio Fundamentals", icon: "chart-bar" },
  { id: "traditional", title: "Non-AI Voice Modification", icon: "adjustments" },
  { id: "ai-cloning", title: "AI Voice Cloning", icon: "cpu" },
  { id: "local-tools", title: "Local AI Tools", icon: "computer" },
  { id: "commercial", title: "Commercial Options", icon: "cloud" },
  { id: "defense", title: "Detection & Defense", icon: "shield" },
  { id: "lab", title: "Interactive Lab", icon: "beaker" },
];

const WaveformViz = ({ type = "sine" }) => {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animId;
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = C.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const offset = frameRef.current * 0.02;
      for (let x = 0; x < w; x++) {
        const t = (x / w) * Math.PI * 6 + offset;
        let y;
        if (type === "sine") y = Math.sin(t);
        else if (type === "square") y = Math.sign(Math.sin(t));
        else y = Math.sin(t) * 0.5 + Math.sin(t * 2.5) * 0.3 + Math.sin(t * 4.1) * 0.2;
        ctx.lineTo(x, h / 2 + y * (h / 2 - 10));
      }
      ctx.stroke();
      if (!reducedMotion) {
        frameRef.current++;
        animId = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [type]);
  return <canvas ref={canvasRef} width={400} height={120} aria-label="Waveform visualization" style={{ width: "100%", maxWidth: 400, height: 120, borderRadius: 8, background: C.codeBg }} />;
};

const SpectrumViz = ({ bands = 24 }) => {
  const [heights, setHeights] = useState(Array.from({ length: bands }, () => Math.random()));
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    const iv = setInterval(() => { setHeights(prev => prev.map((h, i) => { const target = 0.2 + Math.sin(Date.now() / 500 + i * 0.5) * 0.3 + Math.random() * 0.3; return h + (target - h) * 0.3; })); }, 80);
    return () => clearInterval(iv);
  }, [bands]);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 100, padding: "8px 0" }}>
      {heights.map((h, i) => (<div key={i} style={{ flex: 1, height: `${h * 100}%`, background: `linear-gradient(to top, ${C.primary}, ${C.tertiary})`, borderRadius: "2px 2px 0 0", transition: "height 0.1s ease", opacity: 0.8 }} />))}
    </div>
  );
};

const PipelineDiagram = ({ steps, activeStep = -1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", padding: "16px 0" }}>
    {steps.map((step, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center" }}>
        <div style={{ background: i === activeStep ? `${C.primary}20` : C.card, border: `1px solid ${i === activeStep ? C.secondary : C.border}`, borderRadius: 12, padding: "12px 16px", minWidth: 100, textAlign: "center", transition: "all 0.3s ease", boxShadow: i === activeStep ? `0 0 20px ${C.primary}22` : "none" }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}><Icon name={step.icon} size={22} /></div>
          <div style={{ fontSize: 13, color: i === activeStep ? C.accent : C.muted, fontWeight: 600 }}>{step.label}</div>
        </div>
        {i < steps.length - 1 && <div style={{ color: C.border, padding: "0 4px", display: "flex", alignItems: "center" }}><ArrowRightIcon style={{ width: 16, height: 16 }} aria-hidden="true" /></div>}
      </div>
    ))}
  </div>
);

const ToolComparison = ({ tools }) => {
  const [idx, setIdx] = useState(0);
  const t = tools[idx];
  return (
    <div style={{ background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${C.border}` }}>
      <div role="tablist" style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {tools.map((tool, i) => <button key={i} role="tab" aria-selected={i === idx} onClick={() => setIdx(i)} style={{ background: i === idx ? `${C.primary}20` : "#06040c", border: `1px solid ${i === idx ? C.secondary : C.border}`, borderRadius: 8, padding: "8px 14px", color: i === idx ? C.accent : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600 }}>{tool.name}</button>)}
      </div>
      <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
        <div style={{ color: C.text, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
        <div style={{ marginBottom: 8 }}>{t.desc}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ background: "#06040c", padding: 10, borderRadius: 8 }}><div style={{ fontSize: 12, color: C.accent, fontWeight: 700, marginBottom: 4 }}>PROS</div>{t.pros.map((p, i) => <div key={i}>+ {p}</div>)}</div>
          <div style={{ background: "#06040c", padding: 10, borderRadius: 8 }}><div style={{ fontSize: 12, color: C.tertiary, fontWeight: 700, marginBottom: 4 }}>CONS</div>{t.cons.map((c, i) => <div key={i}>- {c}</div>)}</div>
        </div>
        {t.install && <div style={{ marginTop: 10 }}><CodeBlock code={t.install} language="bash" /></div>}
      </div>
    </div>
  );
};

/* ─── SECTIONS ─── */
const IntroSection = () => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
      <img src="/images/ccv-logo.png" alt="CCV" style={{ width: 64, height: 64, borderRadius: 12, border: `2px solid ${C.primary}` }} />
      <div>
        <h1 style={{ margin: 0, fontSize: 42, fontWeight: 800, letterSpacing: -1, lineHeight: 1.1, background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Voice Cloning</h1>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>Call Center Village — Training Module</div>
      </div>
    </div>
    <div style={{ fontSize: 17, color: C.muted, maxWidth: 540, lineHeight: 1.7, marginBottom: 32 }}>Learn how voices can be replicated, modified, and synthesized — from traditional audio engineering to cutting-edge AI. Understand the attack surface to build better defenses.</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
      {[{ label: "Duration", value: "~45 min", icon: "clock" }, { label: "Difficulty", value: "Intermediate", icon: "trending-up" }, { label: "Prerequisites", value: "CLI basics, audio concepts", icon: "clipboard" }].map((item, i) => (
        <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}><Icon name={item.icon} size={28} /></div>
          <div style={{ fontSize: 14, color: C.dim, fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
          <div style={{ fontSize: 16, color: C.text, fontWeight: 700 }}>{item.value}</div>
        </div>
      ))}
    </div>
    <div style={{ background: `${C.tertiary}15`, borderRadius: 12, padding: 20, border: `1px solid ${C.tertiary}44` }}>
      <div style={{ fontSize: 15, color: C.tertiary, fontWeight: 700, marginBottom: 8 }}>ETHICAL NOTICE</div>
      <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.7 }}>This training is for <strong style={{ color: C.text }}>defensive security research only</strong>. Voice cloning without consent is illegal in many jurisdictions. Always obtain explicit permission.</div>
    </div>
  </div>
);

const FundamentalsSection = () => {
  const [waveType, setWaveType] = useState("sine");
  return (<div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Audio Fundamentals</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>Voice identity comes from the physical shape of your vocal tract, learned speech patterns, and emotional expression.</p>
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Interactive Waveform Explorer</div>
      <div role="tablist" style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {["sine", "square", "complex"].map(t => <button key={t} role="tab" aria-selected={waveType === t} onClick={() => setWaveType(t)} style={{ background: waveType === t ? `${C.primary}20` : "#06040c", border: `1px solid ${waveType === t ? C.secondary : C.border}`, borderRadius: 6, padding: "6px 12px", color: waveType === t ? C.accent : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600 }}>{t === "complex" ? "Human Voice" : `${t[0].toUpperCase()+t.slice(1)} Wave`}</button>)}
      </div>
      <WaveformViz type={waveType} />
      <div style={{ fontSize: 14, color: C.dim, marginTop: 8 }}>{waveType === "sine" ? "A pure tone — single frequency." : waveType === "square" ? "A harsh digital signal. Never found in voice." : "Human voice: overlapping harmonics shaped by throat, mouth, and nasal cavity."}</div>
    </div>
    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Frequency Spectrum — Your Vocal Fingerprint</div>
    <SpectrumViz bands={32} />
    <InteractiveCard title={<><Icon name="microphone" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Key Voice Characteristics</>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[{ name: "Pitch (F0)", desc: "Fundamental frequency. Male ~85-180Hz, Female ~165-255Hz" }, { name: "Formants", desc: "Resonance peaks from vocal tract. F1-F4 encode vowel identity" }, { name: "Timbre", desc: "Harmonic content, breathiness, nasality — the 'color'" }, { name: "Prosody", desc: "Rhythm, stress, intonation — how you 'sing' speech" }].map((c, i) => (
          <div key={i} style={{ background: "#06040c", padding: 12, borderRadius: 8 }}><div style={{ fontSize: 14, color: C.accent, fontWeight: 700 }}>{c.name}</div><div style={{ fontSize: 14, marginTop: 4 }}>{c.desc}</div></div>
        ))}
      </div>
    </InteractiveCard>
    <InteractiveCard title={<><Icon name="scale" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Audio Quality Requirements for Cloning</>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[{ label: "Sample Rate", value: "≥16kHz", ideal: "44.1kHz+" }, { label: "Bit Depth", value: "≥16-bit", ideal: "24-bit" }, { label: "Duration", value: "≥30s", ideal: "3-10 min" }, { label: "Format", value: "WAV/FLAC", ideal: "WAV" }, { label: "Noise Floor", value: "<-40dB", ideal: "<-60dB" }, { label: "Clipping", value: "None", ideal: "Peak <-3dB" }].map((r, i) => (
          <div key={i} style={{ background: "#06040c", padding: 10, borderRadius: 8, textAlign: "center" }}><div style={{ fontSize: 12, color: C.dim }}>{r.label}</div><div style={{ fontSize: 14, color: C.text, fontWeight: 700 }}>{r.value}</div><div style={{ fontSize: 12, color: C.accent }}>Ideal: {r.ideal}</div></div>
        ))}
      </div>
    </InteractiveCard>
    <QuizBank questions={[
      { question: "What are formants?", options: ["The base frequency of your voice", "Resonance peaks shaped by your vocal tract", "The volume of each syllable", "Digital encoding of speech"], correctIndex: 1, explanation: "Formants are resonance frequencies from your vocal tract shape. They're the primary feature that makes each voice unique." },
      { question: "What's the minimum sample rate for voice cloning?", options: ["8kHz", "16kHz", "44.1kHz", "96kHz"], correctIndex: 1, explanation: "16kHz is the minimum. Below this, too much frequency info is lost. 44.1kHz+ is ideal but 16kHz captures essential voice frequencies." },
      { question: "Which voice characteristic is HARDEST for AI to clone?", options: ["Base pitch", "Prosody and emotional expression", "Vowel formants", "Volume"], correctIndex: 1, explanation: "Prosody — rhythm, stress, intonation, emotion — requires understanding meaning and context, not just acoustic patterns." },
    ]} />
  </div>);
};

const TraditionalSection = () => {
  const [activeStep, setActiveStep] = useState(-1);
  return (<div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Non-AI Voice Modification</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>Before AI, attackers already had powerful tools. These techniques are simpler, faster, and harder to detect.</p>
    <PipelineDiagram activeStep={activeStep} steps={[{ icon: "microphone", label: "Input" }, { icon: "chart-bar", label: "EQ/Filter" }, { icon: "arrow-path", label: "Pitch Shift" }, { icon: "scale", label: "Formant" }, { icon: "speaker-wave", label: "FX Chain" }, { icon: "headphones", label: "Output" }]} />
    <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
      {[0,1,2,3,4,5].map(i => <button key={i} onClick={() => setActiveStep(i === activeStep ? -1 : i)} style={{ background: "#06040c", border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Step {i + 1}</button>)}
    </div>
    <ToolComparison tools={[
      { name: "SoX", desc: "Swiss Army knife of CLI audio processing.", pros: ["Blazing fast", "Scriptable", "Zero latency"], cons: ["CLI only", "No formant control"], install: `sudo apt install sox libsox-fmt-all\nsox input.wav output.wav pitch 300\nsox input.wav output.wav reverb 50 equalizer 300 2q -8 equalizer 3000 1q 6` },
      { name: "FFmpeg", desc: "Universal multimedia tool with complex filter chains.", pros: ["Universal formats", "Filter graphs", "Ubiquitous"], cons: ["Verbose syntax", "Steep learning curve"], install: `ffmpeg -i input.wav -af "rubberband=pitch=1.2" output.wav\nffmpeg -i input.wav -af "highpass=f=300,lowpass=f=3400" phone.wav` },
      { name: "Audacity", desc: "Free GUI audio editor. Great for spectrograms and learning.", pros: ["Visual", "Real-time preview", "Plugins"], cons: ["GUI only", "No scripting"], install: `sudo apt install audacity\n# Effect → Change Pitch | Equalization\n# Analyze → Plot Spectrum` },
      { name: "RubberBand", desc: "Best pitch-shifting quality with time preservation.", pros: ["Top quality", "Preserves timing", "Real-time"], cons: ["Pitch/time only"], install: `sudo apt install rubberband-cli\nrubberband -p 2 input.wav output.wav   # +2 semitones\nrubberband -t 1.2 input.wav output.wav  # 120% duration` },
    ]} />
    <div style={{ marginTop: 24 }}>
      <InteractiveCard title={<><Icon name="user-group" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Voice Disguise Recipes</>} color={C.tertiary}>
        <div style={{ display: "grid", gap: 12 }}>
          {[
            { name: "Male → Female (rough)", cmd: "sox input.wav output.wav pitch 500 equalizer 250 2q -6 equalizer 4000 1q 5" },
            { name: "Robot / Anonymizer", cmd: 'ffmpeg -i input.wav -af "vibrato=f=8:d=0.5,chorus=0.5:0.9:50:0.4:0.25:2" output.wav' },
            { name: "Phone Call Simulation", cmd: "sox input.wav output.wav highpass 300 lowpass 3400 compand 0.3,1 6:-70,-60,-20 -5 -90 0.2" },
          ].map((r, i) => <div key={i} style={{ background: "#06040c", padding: 12, borderRadius: 8 }}><div style={{ color: C.tertiary, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{r.name}</div><CodeBlock code={r.cmd} language="bash" /></div>)}
        </div>
      </InteractiveCard>
    </div>
    <QuizBank questions={[
      { question: "Which technique changes pitch while preserving duration?", options: ["Speed change", "PSOLA / time-domain pitch shifting", "Lowpass filter", "Amplitude modulation"], correctIndex: 1, explanation: "PSOLA and RubberBand shift pitch independently of time. Speed changes alter both together." },
      { question: "Which tool is BEST for batch processing 1000 audio files?", options: ["Audacity", "SoX", "Praat", "Ableton"], correctIndex: 1, explanation: "SoX is purpose-built for CLI audio processing — blazing fast and scriptable." },
      { question: "How does a telephone effect help disguise a voice?", options: ["Adds reverb", "Removes frequencies outside 300-3400Hz, destroying identifying harmonics", "Speeds up audio", "Adds masking noise"], correctIndex: 1, explanation: "PSTN bandwidth (300-3400Hz) removes chest resonance and sibilance — key voice identity features." },
    ]} />
  </div>);
};

const AISection = () => {
  const [archIdx, setArchIdx] = useState(0);
  const archs = [
    { name: "TTS", desc: "Text-to-speech with cloned voice. Learns characteristics from samples, generates from any text.", flow: [{ icon: "document", label: "Text" }, { icon: "variable", label: "Phonemes" }, { icon: "cpu", label: "Voice Model" }, { icon: "chart-bar", label: "Mel Spec" }, { icon: "speaker-wave", label: "Vocoder" }, { icon: "headphones", label: "Audio" }], models: "XTTS, Bark, VALL-E, Tortoise, StyleTTS2" },
    { name: "Voice Conversion", desc: "Converts one speaker's speech to sound like another, preserving words and emotion.", flow: [{ icon: "microphone", label: "Source" }, { icon: "chart-bar", label: "Features" }, { icon: "arrows-right-left", label: "Embed" }, { icon: "cpu", label: "Convert" }, { icon: "speaker-wave", label: "Vocoder" }, { icon: "headphones", label: "Target" }], models: "RVC, so-vits-svc, FreeVC, OpenVoice" },
    { name: "Zero-Shot", desc: "Clone from seconds of audio — no fine-tuning. Generalizes from brief reference.", flow: [{ icon: "microphone", label: "3-10s" }, { icon: "fingerprint", label: "Encode" }, { icon: "document", label: "Input" }, { icon: "cpu", label: "Generate" }, { icon: "headphones", label: "Output" }], models: "XTTS v2, OpenVoice, VALL-E, MetaVoice" },
  ];
  return (<div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>AI Voice Cloning</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>Modern neural networks clone a voice from minutes — or seconds — of audio.</p>
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      {archs.map((a, i) => <button key={i} onClick={() => setArchIdx(i)} style={{ flex: 1, background: i === archIdx ? `${C.primary}15` : C.card, border: `1px solid ${i === archIdx ? C.secondary : C.border}`, borderRadius: 10, padding: "12px 8px", color: i === archIdx ? C.accent : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, textAlign: "center" }}>{a.name}</button>)}
    </div>
    <div style={{ background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${C.border}`, marginBottom: 20 }}>
      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>{archs[archIdx].desc}</div>
      <PipelineDiagram steps={archs[archIdx].flow} />
      <div style={{ fontSize: 14, color: C.dim, marginTop: 8 }}><strong style={{ color: C.accent }}>Models:</strong> {archs[archIdx].models}</div>
    </div>
    <InteractiveCard title={<><Icon name="chart-bar" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Quality vs. Effort</>}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>{["Method", "Audio", "Compute", "Quality", "RT?"].map(h => <th key={h} style={{ padding: 8, textAlign: "left", color: C.accent, fontWeight: 700 }}>{h}</th>)}</tr></thead>
        <tbody>{[["Zero-shot TTS", "3-10s", "Medium", 3, "Sometimes"], ["Fine-tuned TTS", "5-30min", "High", 4, "No"], ["RVC", "10-30min", "High", 5, "Yes*"], ["Commercial", "10-30s", "None", 4, "Yes"]].map((row, i) => <tr key={i} style={{ borderBottom: "1px solid #06040c" }}>{row.map((cell, j) => <td key={j} style={{ padding: 8, color: j === 0 ? C.text : C.muted }}>{j === 3 ? Array.from({ length: cell }, (_, k) => <Icon key={k} name="star" size={14} style={{ display: "inline-block", color: C.accent }} />) : cell}</td>)}</tr>)}</tbody>
      </table>
    </InteractiveCard>
    <InteractiveCard title={<><Icon name="fingerprint" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Speaker Embeddings</>}>
      <p>A 256-512 dimension vector capturing what makes a voice unique — a mathematical fingerprint.</p>
      <div style={{ margin: "12px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["Pitch Range", "Formants", "Breathiness", "Vibrato", "Pace", "Nasality", "...256+ dims"].map((d, i) => <span key={i} style={{ background: "#06040c", border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", fontSize: 13, color: i === 6 ? C.dim : C.accent }}>{d}</span>)}
      </div>
    </InteractiveCard>
    <QuizBank questions={[
      { question: "Which produces the highest quality voice clone?", options: ["Zero-shot from 5s", "RVC fine-tuned on 20min clean audio", "Pitch shifting with SoX", "Commercial API with 10s"], correctIndex: 1, explanation: "RVC fine-tuned on sufficient clean data produces the highest quality and can even run in real-time." },
      { question: "What is a speaker embedding?", options: ["A hidden microphone", "A numerical vector of unique voice characteristics", "An audio format", "A steganography technique"], correctIndex: 1, explanation: "Speaker embeddings are high-dimensional vectors that mathematically represent what makes a voice unique." },
      { question: "Why is zero-shot cloning considered the biggest threat to phone security?", options: ["It produces perfect quality", "It requires no training and works from a brief voicemail or public clip", "It's undetectable", "It's free"], correctIndex: 1, explanation: "Zero-shot cloning needs just seconds of audio — a voicemail greeting, a YouTube clip, or a conference recording. No training, no GPU, minimal effort." },
    ]} />
  </div>);
};

const LocalToolsSection = () => (<div>
  <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Local AI Tools</h2>
  <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>Run everything locally — no cloud, no API keys, no data leaving your machine.</p>
  <ToolComparison tools={[
    { name: "XTTS", desc: "Open-source TTS with zero-shot cloning. 16+ languages.", pros: ["Zero-shot", "Multi-language", "Fine-tunable"], cons: ["Coqui shut down (community forks active)", "GPU recommended"], install: `pip install coqui-tts\ntts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n    --speaker_wav sample.wav --language_idx en \\\n    --text "Cloned voice output." --out_path output.wav` },
    { name: "RVC", desc: "Voice conversion. Real-time on consumer GPUs. Huge community.", pros: ["Best VC quality", "Real-time", "Large community"], cons: ["Complex setup", "GPU required"], install: `git clone https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI\npip install -r requirements.txt\npython infer-web.py` },
    { name: "OpenVoice", desc: "Instant cloning with tone/emotion control. MIT license.", pros: ["Fast", "Emotion control", "Lightweight"], cons: ["Best quality in English", "Less natural"], install: `git clone https://github.com/myshell-ai/OpenVoice\ncd OpenVoice && pip install -e .` },
    { name: "Piper", desc: "Neural TTS for edge devices. Runs on Raspberry Pi.", pros: ["Runs anywhere", "Super fast", "Many voices"], cons: ["Not zero-shot", "Training needed"], install: `pip install piper-tts\necho "Hello" | piper --model en_US-lessac-medium.onnx --output_file out.wav` },
  ]} />
  <div style={{ marginTop: 20 }}>
    <InteractiveCard title={<><Icon name="bolt" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Clone a Voice in 5 Minutes</>}>
      <CodeBlock language="bash" code={`pip install coqui-tts\nrec -r 44100 -c 1 sample.wav trim 0 20\ntts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n    --speaker_wav sample.wav --language_idx en \\\n    --text "I can say anything in this voice." \\\n    --out_path cloned.wav\naplay cloned.wav`} />
    </InteractiveCard>
    <InteractiveCard title={<><Icon name="wrench" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />whisper.cpp &amp; llama.cpp</>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "#06040c", padding: 12, borderRadius: 8 }}><div style={{ color: C.accent, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>whisper.cpp</div><div style={{ fontSize: 14 }}>Local STT. Transcribe calls, extract text for re-synthesis.</div></div>
        <div style={{ background: "#06040c", padding: 12, borderRadius: 8 }}><div style={{ color: C.accent, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>llama.cpp</div><div style={{ fontSize: 14 }}>Local LLM. Generate dialogue for the cloned voice.</div></div>
      </div>
    </InteractiveCard>
  </div>
  <QuizBank questions={[
    { question: "Fastest approach for a conference demo?", options: ["Train RVC for 2hr", "XTTS zero-shot with 10s sample", "Fine-tune Piper on 4hr", "Custom model"], correctIndex: 1, explanation: "XTTS zero-shot: seconds instead of hours." },
    { question: "Which combo creates a fully local voice attack pipeline?", options: ["ElevenLabs + ChatGPT", "whisper.cpp + llama.cpp + XTTS", "Google STT + GPT-4 + Google TTS", "Deepgram + Claude + Cartesia"], correctIndex: 1, explanation: "whisper.cpp + llama.cpp + XTTS = complete pipeline, zero cloud dependency." },
  ]} />
</div>);

const CommercialSection = () => (<div>
  <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Commercial Options</h2>
  <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>Understanding what's accessible with just a credit card.</p>
  <div style={{ display: "grid", gap: 12 }}>
    {[
      { name: "ElevenLabs", color: C.accent, features: ["Instant cloning (~30s)", "70+ languages", "Real-time streaming", "Voice design from description"], threat: "Very low barrier. Free tier available." },
      { name: "Play.ht", color: C.highlight, features: ["Instant cloning", "Emotion control", "API + playground"], threat: "Similar accessibility. Free tier available." },
      { name: "Resemble.AI", color: C.tertiary, features: ["Custom cloning", "Real-time VC", "Deepfake detection", "On-premise option"], threat: "Offense AND defense capabilities." },
      { name: "Cartesia Sonic", color: C.secondary, features: ["State-space model architecture", "Ultra-low latency", "Voice mixing"], threat: "Built for real-time agents." },
    ].map((s, i) => (
      <div key={i} style={{ background: C.card, border: `1px solid ${s.color}33`, borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: s.color, marginBottom: 8 }}>{s.name}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>{s.features.map((f, j) => <span key={j} style={{ background: "#06040c", padding: "6px 10px", borderRadius: 4, fontSize: 13, color: C.muted }}>{f}</span>)}</div>
        <div style={{ fontSize: 14, color: C.tertiary, background: `${C.tertiary}10`, padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}><Icon name="magnifying-glass" size={14} />{s.threat}</div>
      </div>
    ))}
  </div>
  <div style={{ marginTop: 20 }}><QuizBank questions={[
    { question: "Minimum audio for commercial voice clone?", options: ["30 minutes", "10-30 seconds", "5 minutes", "No audio needed"], correctIndex: 1, explanation: "Most services clone from 10-30 seconds. A voicemail is enough." },
    { question: "Which also offers deepfake DETECTION?", options: ["ElevenLabs", "Play.ht", "Resemble.AI", "Cartesia"], correctIndex: 2, explanation: "Resemble.AI uniquely offers both cloning AND detection." },
  ]} /></div>
</div>);

const DefenseSection = () => (<div>
  <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Detection & Defense</h2>
  <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>How to detect and defend against voice cloning attacks.</p>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
    {[
      { layer: "Technical Detection", color: C.accent, items: ["Spectral analysis — AI has telltale patterns", "Vocoder artifact detection", "Pitch/formant consistency checks", "Watermark detection"] },
      { layer: "Procedural Defense", color: C.highlight, items: ["Callback verification", "Challenge questions", "Code words", "Multi-channel confirm"] },
      { layer: "AI-Powered Detection", color: C.tertiary, items: ["Resemblyzer embeddings", "ASVspoof models", "Real-time stream analysis", "Biometrics + liveness"] },
      { layer: "Organizational", color: C.secondary, items: ["Staff training", "No voice-only auth for high-value", "Voice biometric + PIN", "Audit suspicious calls"] },
    ].map((d, i) => (
      <div key={i} style={{ background: C.card, border: `1px solid ${d.color}33`, borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: d.color, marginBottom: 8 }}>{d.layer}</div>
        <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{d.items.map((item, j) => <div key={j} style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><Icon name="arrow-right" size={12} />{item}</div>)}</div>
      </div>
    ))}
  </div>
  <InteractiveCard title={<><Icon name="beaker" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Spectral Artifacts to Look For</>}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      {[{ sign: "Metallic shimmer", desc: "Above 8kHz from vocoders" }, { sign: "Phase breaks", desc: "At segment boundaries" }, { sign: "Unnatural pauses", desc: "TTS breathing differs" }, { sign: "Flat F0", desc: "Less micro-variation" }, { sign: "No ambience", desc: "Missing room tone" }, { sign: "Smooth formants", desc: "Over-smoothed transitions" }].map((s, i) => (
        <div key={i} style={{ background: "#06040c", padding: 10, borderRadius: 8 }}><div style={{ color: C.tertiary, fontWeight: 700, fontSize: 13 }}>{s.sign}</div><div style={{ fontSize: 13, marginTop: 4 }}>{s.desc}</div></div>
      ))}
    </div>
  </InteractiveCard>
  <QuizBank questions={[
    { question: "CEO calls CFO for urgent wire transfer. Best first defense?", options: ["AI voice detector", "Personal questions", "Hang up and call CEO's known number", "Check voice against recordings"], correctIndex: 2, explanation: "Callback verification breaks the attacker's channel control." },
    { question: "Most common spectral artifact in AI-generated voice?", options: ["Excessive bass", "Metallic shimmer above 8kHz", "Random white noise", "Perfect stereo"], correctIndex: 1, explanation: "Neural vocoders produce subtle metallic artifacts in high frequencies." },
    { question: "Why is voice biometrics alone insufficient?", options: ["Too expensive", "High-quality clones can fool voiceprint matching", "Requires too much data", "Only works in-person"], correctIndex: 1, explanation: "Quality clones match voiceprints. Liveness detection and MFA are essential." },
  ]} />
</div>);

const LabSection = () => {
  const [step, setStep] = useState(0);
  const exercises = [
    { title: "1: Record & Analyze", cmd: `rec -r 44100 -c 1 -b 16 my_voice.wav trim 0 15\nsox my_voice.wav -n spectrogram -o spectrum.png\nsoxi my_voice.wav && sox my_voice.wav -n stat 2>&1` },
    { title: "2: Voice Modification", cmd: `sox my_voice.wav v1_higher.wav pitch 400\nsox my_voice.wav v2_deeper.wav pitch -300\nsox my_voice.wav v3_phone.wav highpass 300 lowpass 3400\nffmpeg -i my_voice.wav -af "vibrato=f=6:d=0.4" v4_robot.wav` },
    { title: "3: AI Cloning", cmd: `pip install coqui-tts\ntts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n    --speaker_wav my_voice.wav --language_idx en \\\n    --text "AI clone of my voice." --out_path clone.wav` },
    { title: "4: Detection", cmd: `pip install resemblyzer\npython3 -c "\nfrom resemblyzer import VoiceEncoder, preprocess_wav\nfrom pathlib import Path; import numpy as np\nenc = VoiceEncoder()\no = enc.embed_utterance(preprocess_wav(Path('my_voice.wav')))\nc = enc.embed_utterance(preprocess_wav(Path('clone.wav')))\nprint(f'Similarity: {np.dot(o,c):.4f} (threshold is tunable, ~0.75 is a conservative starting point)')\n"` },
  ];
  return (<div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Interactive Lab</h2>
    <div role="tablist" style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
      {exercises.map((ex, i) => <button key={i} role="tab" aria-selected={i === step} onClick={() => setStep(i)} style={{ background: i === step ? `${C.primary}20` : C.card, border: `1px solid ${i === step ? C.secondary : C.border}`, borderRadius: 8, padding: "10px 16px", color: i === step ? C.accent : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}>{ex.title}</button>)}
    </div>
    <div style={{ background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${C.secondary}33` }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 12 }}>{exercises[step].title}</div>
      <CodeBlock code={exercises[step].cmd} language="bash" />
    </div>
    <div style={{ marginTop: 24, background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${C.secondary}44` }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.secondary, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><Icon name="trophy" size={16} />Challenge: Full Pipeline</div>
      <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>Record → Clone → Apply effects → Detect which is real vs AI vs modified.</div>
    </div>
  </div>);
};

const COMPS = [IntroSection, FundamentalsSection, TraditionalSection, AISection, LocalToolsSection, CommercialSection, DefenseSection, LabSection];

export default function VoiceCloningTraining() {
  return <TrainingShell sections={SECTIONS} sectionComponents={COMPS} moduleTitle="Voice Cloning" topOffset={48} />;
}
