import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import { C, CodeBlock, InteractiveCard, QuizBank, TrainingShell, Icon, InfoBox } from './src/components';
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

const ArtifactLightbox = ({ sign, desc, renderViz }) => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: "#06040c", padding: 14, borderRadius: 8, cursor: "pointer", border: `1px solid ${hovered ? C.tertiary : "transparent"}`, transition: "border-color 0.2s ease" }}
      >
        <div style={{ color: C.tertiary, fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{sign}</div>
        <div style={{ fontSize: 12, color: C.dim, marginBottom: 10 }}>{desc}</div>
        {renderViz(60)}
      </div>
      {open && (
        <Lightbox onClose={() => setOpen(false)}>
          <div style={{ fontSize: 20, color: C.tertiary, fontWeight: 700, marginBottom: 8 }}>{sign}</div>
          <div style={{ fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.7 }}>{desc}</div>
          {renderViz(180)}
        </Lightbox>
      )}
    </>
  );
};

const SectionDivider = () => <hr style={{ border: "none", borderTop: "1px solid #040208", margin: "48px 0" }} />;

const Lightbox = ({ children, onClose }) => (
  <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out", padding: 40 }}>
    <div onClick={e => e.stopPropagation()} style={{ background: "#06040c", borderRadius: 16, padding: 32, border: `1px solid ${C.border}`, maxWidth: 720, width: "100%", cursor: "default", position: "relative" }}>
      <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, fontFamily: "inherit", lineHeight: 1 }}>×</button>
      {children}
    </div>
  </div>
);

const AudioQualityCard = ({ title, children }) => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#06040c", padding: 14, borderRadius: 8, cursor: "pointer",
          border: `1px solid ${hovered ? C.accent : C.border}`,
          transition: "border-color 0.2s ease",
        }}
      >
        <div style={{ fontSize: 13, color: C.accent, fontWeight: 700, marginBottom: 16 }}>{title}</div>
        {children}
      </div>
      {open && (
        <Lightbox onClose={() => setOpen(false)}>
          <div style={{ fontSize: 20, color: C.accent, fontWeight: 700, marginBottom: 20 }}>{title}</div>
          <div className="lightbox-svg-scaled">{children}</div>
          <style>{`.lightbox-svg-scaled svg { width: 100% !important; height: 280px !important; }`}</style>
        </Lightbox>
      )}
    </>
  );
};

const RecommendationCard = ({ label, value, ideal, detail }) => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: "#06040c", padding: "28px 10px", borderRadius: 8, textAlign: "center", border: `1px solid ${hovered ? C.accent : C.border}`, cursor: "pointer", transition: "border-color 0.2s ease" }}
      >
        <div style={{ fontSize: 12, color: C.dim, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 14, color: C.text, fontWeight: 700, marginBottom: 4 }}>{value}</div>
        <div style={{ fontSize: 12, color: C.accent }}>Ideal: {ideal}</div>
      </div>
      {open && (
        <Lightbox onClose={() => setOpen(false)}>
          <div style={{ fontSize: 12, color: C.dim, marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: 22, color: C.text, fontWeight: 800, marginBottom: 4 }}>Recommended: {value}</div>
          <div style={{ fontSize: 16, color: C.accent, fontWeight: 600, marginBottom: 20 }}>Ideal: {ideal}</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{detail}</div>
        </Lightbox>
      )}
    </>
  );
};

const VoiceCharacteristicCard = ({ name, desc, diagram }) => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: "#06040c", padding: 14, borderRadius: 8, border: `1px solid ${hovered ? C.accent : C.border}`, cursor: "pointer", transition: "border-color 0.2s ease" }}
      >
        <div style={{ fontSize: 14, color: C.accent, fontWeight: 700, marginBottom: 10 }}>{name}</div>
        <div style={{ background: "#0a0812", borderRadius: 6, padding: "24px 6px", marginBottom: 8, border: `1px solid ${C.border}` }}>{diagram}</div>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{desc}</div>
      </div>
      {open && (
        <Lightbox onClose={() => setOpen(false)}>
          <div style={{ fontSize: 20, color: C.accent, fontWeight: 700, marginBottom: 20 }}>{name}</div>
          <div className="lightbox-svg-scaled" style={{ background: "#0a0812", borderRadius: 8, padding: "28px 12px", marginBottom: 20, border: `1px solid ${C.border}` }}>{diagram}</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{desc}</div>
          <style>{`.lightbox-svg-scaled svg { width: 100% !important; height: 280px !important; }`}</style>
        </Lightbox>
      )}
    </>
  );
};

// Mini diagrams for voice characteristics
const PitchDiagram = () => {
  // Two sine waves: slow (low pitch / male) vs fast (high pitch / female)
  const w = 240, h = 80, mid = h / 2;
  const malePath = Array.from({ length: w }, (_, x) => {
    const y = mid + Math.sin((x / w) * Math.PI * 4) * 18;
    return `${x === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
  const femalePath = Array.from({ length: w }, (_, x) => {
    const y = mid + Math.sin((x / w) * Math.PI * 10) * 14;
    return `${x === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h }}>
      <path d={malePath} fill="none" stroke="#6C8EEF" strokeWidth="2" opacity="0.8" />
      <path d={femalePath} fill="none" stroke="#E77CE7" strokeWidth="2" opacity="0.8" />
      <text x="4" y="14" fill="#6C8EEF" fontSize="10" fontWeight="700" fontFamily="inherit">Male ~120Hz</text>
      <text x="4" y={h - 4} fill="#E77CE7" fontSize="10" fontWeight="700" fontFamily="inherit">Female ~220Hz</text>
    </svg>
  );
};

const FormantDiagram = () => {
  // Simplified spectrum with labeled F1-F4 peaks
  const w = 240, h = 80;
  const formants = [
    { x: 0.12, h: 0.85, label: "F1", sub: "vowel" },
    { x: 0.32, h: 0.95, label: "F2", sub: "vowel" },
    { x: 0.55, h: 0.60, label: "F3", sub: "identity" },
    { x: 0.72, h: 0.45, label: "F4", sub: "identity" },
  ];
  // Build a smooth envelope path through formant peaks
  const graphH = h - 16; // reserve bottom 16px for label
  const points = [{ x: 0, y: graphH }];
  for (let px = 0; px < w; px++) {
    const nx = px / w;
    let val = 0.08;
    for (const f of formants) {
      val += f.h * Math.exp(-Math.pow((nx - f.x) / 0.06, 2));
    }
    points.push({ x: px, y: graphH - val * (graphH - 16) });
  }
  points.push({ x: w, y: graphH });
  const areaPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
  const linePath = points.slice(1, -1).map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h }}>
      <defs><linearGradient id="fmtGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity="0.3" /><stop offset="100%" stopColor={C.accent} stopOpacity="0.03" /></linearGradient></defs>
      <path d={areaPath} fill="url(#fmtGrad)" />
      <path d={linePath} fill="none" stroke={C.accent} strokeWidth="1.5" />
      {formants.map((f, i) => (
        <g key={i}>
          <line x1={f.x * w} y1={graphH - f.h * (graphH - 16)} x2={f.x * w} y2={graphH} stroke={C.accent} strokeWidth="0.5" strokeDasharray="2,2" opacity="0.4" />
          <text x={f.x * w} y={8} fill={C.accent} fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="inherit">{f.label}</text>
        </g>
      ))}
      <text x={w - 4} y={h - 2} fill={C.dim} fontSize="9" textAnchor="end" fontFamily="inherit">Frequency →</text>
    </svg>
  );
};

const TimbreDiagram = () => {
  // Same pitch, two different harmonic envelopes (breathy vs rich)
  const w = 240, h = 96, bars = 16;
  const graphH = h - 16; // reserve bottom for label
  const rich =   [0.95, 0.80, 0.70, 0.75, 0.55, 0.60, 0.45, 0.50, 0.35, 0.38, 0.28, 0.30, 0.22, 0.18, 0.12, 0.08];
  const breathy = [0.90, 0.45, 0.30, 0.25, 0.35, 0.20, 0.15, 0.12, 0.18, 0.10, 0.08, 0.06, 0.05, 0.04, 0.03, 0.02];
  const leftPad = 52;
  const barW = (w - leftPad - 4) / bars;
  const f0X = leftPad + barW / 2;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h }}>
      {/* F0 reference line */}
      <line x1={f0X} y1={10} x2={f0X} y2={graphH} stroke={C.dim} strokeWidth="0.5" strokeDasharray="3,2" opacity="0.6" />
      <text x={f0X} y={8} fill={C.dim} fontSize="7" textAnchor="middle" fontFamily="inherit">F0</text>
      {rich.map((v, i) => (
        <rect key={`r-${i}`} x={leftPad + i * barW + 1} y={graphH - v * (graphH - 14)} width={barW / 2 - 1} height={v * (graphH - 14)} fill={C.accent} opacity="0.7" rx="1" />
      ))}
      {breathy.map((v, i) => (
        <rect key={`b-${i}`} x={leftPad + i * barW + barW / 2} y={graphH - v * (graphH - 14)} width={barW / 2 - 1} height={v * (graphH - 14)} fill={C.secondary} opacity="0.7" rx="1" />
      ))}
      <text x="4" y="12" fill={C.accent} fontSize="9" fontWeight="700" fontFamily="inherit">Rich</text>
      <text x="4" y="24" fill={C.secondary} fontSize="9" fontWeight="700" fontFamily="inherit">Breathy</text>
      <text x={w - 4} y={h - 2} fill={C.dim} fontSize="9" textAnchor="end" fontFamily="inherit">Harmonics →</text>
    </svg>
  );
};

const ProsodyDiagram = () => {
  // Pitch contour over time showing intonation of a question vs statement
  const w = 240, h = 96;
  const graphH = h - 16; // reserve bottom for label
  const mid = graphH / 2;
  // Statement: gentle rise then fall
  const stmtPath = Array.from({ length: w }, (_, x) => {
    const t = x / w;
    const y = mid - (Math.sin(t * Math.PI) * 16) + (t > 0.7 ? (t - 0.7) * 30 : 0);
    return `${x === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
  // Question: rises at the end
  const qPath = Array.from({ length: w }, (_, x) => {
    const t = x / w;
    const y = mid + 4 - (Math.sin(t * Math.PI * 0.6) * 10) - (t > 0.6 ? Math.pow((t - 0.6) / 0.4, 2) * 28 : 0);
    return `${x === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h }}>
      <path d={stmtPath} fill="none" stroke={C.highlight} strokeWidth="2" opacity="0.8" />
      <path d={qPath} fill="none" stroke={C.secondary} strokeWidth="2" opacity="0.8" />
      <text x="4" y="14" fill={C.highlight} fontSize="9" fontWeight="700" fontFamily="inherit">"That's your card." ↘</text>
      <text x="4" y={graphH - 4} fill={C.secondary} fontSize="9" fontWeight="700" fontFamily="inherit">"That's your card?" ↗</text>
      <text x={w / 2} y={h - 2} fill={C.dim} fontSize="9" textAnchor="middle" fontFamily="inherit">Time →</text>
    </svg>
  );
};

const WaveformViz = forwardRef(({ type = "sine", onPlayingChange }, ref) => {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const audioRef = useRef({ ctx: null, analyser: null, gain: null, source: null });
  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [voiceMode, setVoiceMode] = useState(null); // "file" | "synth" | null

  useEffect(() => { onPlayingChange?.(playing); }, [playing, onPlayingChange]);

  const stopAudio = useCallback(() => {
    const a = audioRef.current;
    if (a.source) {
      try { a.source.stop?.(); } catch (e) { /* already stopped */ }
      try { a.source.disconnect(); } catch (e) { /* already disconnected */ }
      a.source = null;
    }
    playingRef.current = false;
    setPlaying(false);
  }, []);

  // Stop audio when waveform type changes
  useEffect(() => { stopAudio(); }, [type, stopAudio]);

  // Cleanup on unmount
  useEffect(() => () => {
    const a = audioRef.current;
    if (a.source) { try { a.source.stop?.(); } catch (e) {} try { a.source.disconnect(); } catch (e) {} }
    if (a.ctx && a.ctx.state !== "closed") { a.ctx.close(); }
  }, []);

  const ensureAudioCtx = () => {
    const a = audioRef.current;
    if (!a.ctx || a.ctx.state === "closed") {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      const gain = ctx.createGain();
      gain.gain.value = 0.12;
      analyser.connect(gain);
      gain.connect(ctx.destination);
      audioRef.current = { ...audioRef.current, ctx, analyser, gain };
    }
    return audioRef.current;
  };

  const playOscillator = async (oscType) => {
    const { ctx, analyser } = ensureAudioCtx();
    if (ctx.state === "suspended") await ctx.resume();
    const osc = ctx.createOscillator();
    osc.type = oscType;
    osc.frequency.value = 440;
    // Square waves are perceptually much louder — tame them so they don't startle
    const oscGain = ctx.createGain();
    oscGain.gain.value = oscType === "square" ? 0.3 : 1.0;
    osc.connect(oscGain);
    oscGain.connect(analyser);
    osc.start();
    // Auto-stop after 4 seconds
    osc.stop(ctx.currentTime + 4);
    osc.onended = () => { playingRef.current = false; setPlaying(false); };
    audioRef.current.source = osc;
    playingRef.current = true;
    setPlaying(true);
  };

  const synthesizeVowel = (ctx) => {
    // Create a formant-synthesized "ahh" vowel — demonstrates voice complexity without needing an audio file
    const duration = 3;
    const sr = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, sr * duration, sr);
    const data = buffer.getChannelData(0);
    const f0 = 130; // fundamental ~male voice
    for (let i = 0; i < data.length; i++) {
      const t = i / sr;
      let s = 0;
      // Natural vibrato (~5Hz, subtle)
      const vibrato = Math.sin(2 * Math.PI * 5.2 * t) * 2.5 + Math.sin(2 * Math.PI * 0.7 * t) * 1.5;
      const f = f0 + vibrato;
      // Sum harmonics shaped by formant resonances (vowel "ah")
      for (let h = 1; h <= 30; h++) {
        const freq = f * h;
        // Formant peaks for open "ah" vowel: F1≈700Hz F2≈1100Hz F3≈2600Hz F4≈3300Hz
        const f1g = Math.exp(-Math.pow((freq - 700) / 100, 2)) * 0.35;
        const f2g = Math.exp(-Math.pow((freq - 1100) / 120, 2)) * 0.22;
        const f3g = Math.exp(-Math.pow((freq - 2600) / 150, 2)) * 0.10;
        const f4g = Math.exp(-Math.pow((freq - 3300) / 180, 2)) * 0.06;
        const harmonicRolloff = 0.4 / h;
        const gain = harmonicRolloff + f1g + f2g + f3g + f4g;
        // Slight phase drift per harmonic for naturalness
        s += Math.sin(2 * Math.PI * freq * t + h * 0.15) * gain;
      }
      // Amplitude envelope (fade in/out) + micro-tremor
      const env = Math.min(1, t / 0.06) * Math.min(1, (duration - t) / 0.2);
      const tremor = 1 + Math.sin(2 * Math.PI * 3.8 * t) * 0.015;
      // Slight breathiness (filtered noise)
      const breath = (Math.random() - 0.5) * 0.03 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 4 * t));
      data[i] = (s * 0.08 + breath) * env * tremor;
    }
    return buffer;
  };

  const playVoice = async () => {
    const { ctx, analyser } = ensureAudioCtx();
    if (ctx.state === "suspended") await ctx.resume();
    // Voice is quieter than oscillators — boost it
    const voiceGain = ctx.createGain();
    voiceGain.gain.value = 3.5;
    voiceGain.connect(analyser);

    // Try loading a real voice recording first
    try {
      const resp = await fetch("/audio/voice-sample.mp3");
      if (resp.ok) {
        const arrayBuf = await resp.arrayBuffer();
        const audioBuf = await ctx.decodeAudioData(arrayBuf);
        const source = ctx.createBufferSource();
        source.buffer = audioBuf;
        source.connect(voiceGain);
        source.start();
        source.onended = () => { playingRef.current = false; setPlaying(false); };
        audioRef.current.source = source;
        playingRef.current = true;
        setPlaying(true);
        setVoiceMode("file");
        return;
      }
    } catch (e) { /* file not available, use synthesis fallback */ }

    // Fallback: formant-synthesized vowel
    const buffer = synthesizeVowel(ctx);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(voiceGain);
    source.start();
    source.onended = () => { playingRef.current = false; setPlaying(false); };
    audioRef.current.source = source;
    playingRef.current = true;
    setPlaying(true);
    setVoiceMode("synth");
  };

  const togglePlay = () => {
    if (playing) { stopAudio(); return; }
    if (type === "sine" || type === "square") playOscillator(type);
    else playVoice();
  };

  useImperativeHandle(ref, () => ({ togglePlay, playing }), [playing, type]);

  // Canvas rendering — shows real AnalyserNode data when playing, mathematical approximation when idle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animId;
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = playing ? "#58E880" : C.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const analyser = audioRef.current.analyser;
      if (playingRef.current && analyser) {
        // Real waveform from audio output
        const bufLen = analyser.frequencyBinCount;
        const data = new Uint8Array(bufLen);
        analyser.getByteTimeDomainData(data);
        const sliceW = w / bufLen;
        for (let i = 0; i < bufLen; i++) {
          const x = i * sliceW;
          const y = (data[i] / 128.0) * (h / 2);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
      } else {
        // Mathematical preview
        const offset = frameRef.current * 0.02;
        for (let x = 0; x < w; x++) {
          const t = (x / w) * Math.PI * 6 + offset;
          let y;
          if (type === "sine") y = Math.sin(t);
          else if (type === "square") y = Math.sign(Math.sin(t));
          else {
            const jitter = Math.sin(t * 0.3) * 0.08;
            y = Math.sin(t + jitter) * 0.35 + Math.sin(t * 2.02) * 0.2 + Math.sin(t * 3.03 + 0.5) * 0.15 + Math.sin(t * 4.1) * 0.1 + Math.sin(t * 5.97) * 0.06 + Math.sin(t * 7.2 + 1.0) * 0.04 + (Math.sin(t * 13.7) * 0.03 + Math.sin(t * 0.7) * 0.07);
          }
          ctx.lineTo(x, h / 2 + y * (h / 2 - 10));
        }
      }
      ctx.stroke();

      // Glow effect when playing
      if (playingRef.current) {
        ctx.shadowColor = "#58E880";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      if (!reducedMotion) {
        frameRef.current++;
        animId = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [type, playing]);

  return (
    <div>
      <canvas ref={canvasRef} width={400} height={120} aria-label={`${type} waveform visualization${playing ? " — playing audio" : ""}`} style={{ width: "100%", maxWidth: 400, height: 120, borderRadius: 8, background: C.codeBg, border: playing ? "1px solid #58E88044" : `1px solid ${C.primary}44`, transition: "border-color 0.3s ease" }} />
      {playing && type === "complex" && voiceMode === "synth" && (
        <div style={{ fontSize: 12, color: C.dim, marginTop: 4, fontStyle: "italic" }}>Formant-synthesized vowel sound. Drop a recording at <span style={{ color: C.accent, fontFamily: "monospace" }}>/audio/voice-sample.mp3</span> for real speech.</div>
      )}
    </div>
  );
});

// Formant data from Hillenbrand et al. (1995) — vowel /ɑ/ ("ah" as in "father")
// Each voice says the same vowel; differences come from vocal tract size
const VOICE_SOURCE = {
  male: {
    label: "Adult Male",
    color: "#6C8EEF",
    f0: 129,  // fundamental frequency in Hz
    formants: [
      { freq: 768, bw: 90, label: "F1" },   // F1: open vowel resonance
      { freq: 1333, bw: 120, label: "F2" },  // F2: front/back tongue position
      { freq: 2522, bw: 160, label: "F3" },  // F3: speaker identity
      { freq: 3687, bw: 200, label: "F4" },  // F4: speaker identity
    ],
  },
  female: {
    label: "Adult Female",
    color: "#E77CE7",
    f0: 220,
    formants: [
      { freq: 936, bw: 110, label: "F1" },
      { freq: 1551, bw: 140, label: "F2" },
      { freq: 2815, bw: 180, label: "F3" },
      { freq: 4044, bw: 220, label: "F4" },
    ],
  },
  child: {
    label: "Child",
    color: "#7CE7A8",
    f0: 260,
    formants: [
      { freq: 1023, bw: 120, label: "F1" },
      { freq: 1588, bw: 150, label: "F2" },
      { freq: 3298, bw: 200, label: "F3" },
      { freq: 4500, bw: 250, label: "F4" },
    ],
  },
};

// Compute 32-band spectrum using source-filter model
// Source: harmonic series from F0 with glottal rolloff (~12dB/octave)
// Filter: formant resonances modeled as Gaussian peaks
const NUM_BANDS = 32;
const BAND_MIN = 100, BAND_MAX = 8000;

const computeSpectrum = ({ f0, formants }) => {
  const spectrum = new Array(NUM_BANDS).fill(0);
  for (let b = 0; b < NUM_BANDS; b++) {
    // Log-spaced band center frequency
    const freq = BAND_MIN * Math.pow(BAND_MAX / BAND_MIN, b / (NUM_BANDS - 1));
    // Sum energy from harmonics of f0 that fall near this band
    for (let h = 1; h <= Math.ceil(BAND_MAX / f0); h++) {
      const hFreq = f0 * h;
      const dist = Math.abs(freq - hFreq);
      const bandWidth = freq * 0.12; // ~12% bandwidth per band
      if (dist < bandWidth * 2) {
        // Glottal source: ~12dB/octave rolloff
        const sourceGain = 1 / Math.pow(h, 1.2);
        // Formant filter: sum of Gaussian resonance peaks
        let filterGain = 0.02; // baseline
        for (const f of formants) {
          filterGain += Math.exp(-Math.pow((hFreq - f.freq) / f.bw, 2));
        }
        spectrum[b] += sourceGain * filterGain * Math.exp(-Math.pow(dist / bandWidth, 2));
      }
    }
  }
  // Normalize to 0-1
  const max = Math.max(...spectrum);
  return spectrum.map(v => max > 0 ? v / max : 0);
};

// Precompute spectrums and band positions for formant labels
const VOICE_PROFILES = Object.fromEntries(
  Object.entries(VOICE_SOURCE).map(([key, src]) => {
    const spectrum = computeSpectrum(src);
    const formantLabels = src.formants.map(f => {
      const band = Math.round((NUM_BANDS - 1) * Math.log(f.freq / BAND_MIN) / Math.log(BAND_MAX / BAND_MIN));
      return { band, label: f.label, freq: f.freq >= 1000 ? `${(f.freq / 1000).toFixed(1)}kHz` : `${f.freq}Hz` };
    });
    return [key, { label: src.label, color: src.color, spectrum, formants: formantLabels }];
  })
);

const FREQ_LABELS = [0, 4, 8, 12, 16, 20, 24, 28, 31].map(band => {
  const freq = BAND_MIN * Math.pow(BAND_MAX / BAND_MIN, band / (NUM_BANDS - 1));
  return { band, label: freq >= 1000 ? `${(freq / 1000).toFixed(1)}k` : `${Math.round(freq)}` };
});

const SpectrumViz = () => {
  const [selected, setSelected] = useState(["male", "female", "child"]);
  const [jitter, setJitter] = useState(0);
  const [cycling, setCycling] = useState(false);
  const cycleRef = useRef(null);
  const bands = 32;

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    const iv = setInterval(() => setJitter(Date.now()), 100);
    return () => clearInterval(iv);
  }, []);

  const stopCycle = useCallback(() => {
    if (cycleRef.current) clearTimeout(cycleRef.current);
    cycleRef.current = null;
    setCycling(false);
    setSelected(["male", "female", "child"]);
  }, []);

  const startCycle = useCallback(() => {
    const sequence = ["male", "female", "child"];
    const stepDuration = 2500;
    setCycling(true);
    setSelected([sequence[0]]);
    cycleRef.current = setTimeout(() => {
      setSelected([sequence[1]]);
      cycleRef.current = setTimeout(() => {
        setSelected([sequence[2]]);
        cycleRef.current = setTimeout(() => {
          setSelected(["male", "female", "child"]);
          setCycling(false);
          cycleRef.current = null;
        }, stepDuration);
      }, stepDuration);
    }, stepDuration);
  }, []);

  useEffect(() => () => { if (cycleRef.current) clearTimeout(cycleRef.current); }, []);

  const toggle = (key) => {
    if (cycling) return;
    setSelected(prev => prev.includes(key) ? (prev.length > 1 ? prev.filter(k => k !== key) : prev) : [...prev, key]);
  };

  const getJitteredHeight = (base, bandIdx) => {
    const noise = Math.sin(jitter / 400 + bandIdx * 1.7) * 0.04 + Math.sin(jitter / 250 + bandIdx * 0.9) * 0.03;
    return Math.max(0.05, Math.min(1, base + noise));
  };

  return (
    <div>
      <div role="tablist" style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        {Object.entries(VOICE_PROFILES).map(([key, prof]) => (
          <button key={key} role="tab" aria-selected={selected.includes(key)} onClick={() => toggle(key)} style={{ background: selected.includes(key) ? `${prof.color}20` : "#06040c", border: `1px solid ${selected.includes(key) ? prof.color : C.border}`, borderRadius: 6, padding: "6px 14px", color: selected.includes(key) ? prof.color : C.muted, cursor: cycling ? "default" : "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600, opacity: cycling ? 0.5 : 1 }}>{prof.label}</button>
        ))}
        <button
          onClick={cycling ? stopCycle : startCycle}
          aria-label={cycling ? "Stop cycle" : "Cycle through voices"}
          style={{
            background: cycling ? "#58E88025" : `${C.primary}25`,
            border: `1px solid ${cycling ? "#58E88066" : C.border}`,
            borderRadius: 6, padding: "6px 14px",
            color: cycling ? "#58E880" : C.accent,
            cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6, marginLeft: 4
          }}
        >
          <Icon name={cycling ? "stop" : "play"} size={14} />{cycling ? "Stop" : "Cycle"}
        </button>
      </div>
      <div style={{ background: C.codeBg, borderRadius: 8, padding: "16px 12px 4px 12px", position: "relative", border: `1px solid ${C.primary}44` }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 140, position: "relative" }}>
          {Array.from({ length: bands }).map((_, i) => {
            const activeProfiles = selected.map(k => VOICE_PROFILES[k]);
            const maxH = Math.max(...activeProfiles.map(p => getJitteredHeight(p.spectrum[i], i)));
            return (
              <div key={i} style={{ flex: 1, height: "100%", position: "relative", display: "flex", alignItems: "flex-end" }}>
                {activeProfiles.length === 1 ? (
                  <div style={{ width: "100%", height: `${getJitteredHeight(activeProfiles[0].spectrum[i], i) * 100}%`, background: `linear-gradient(to top, ${activeProfiles[0].color}44, ${activeProfiles[0].color})`, borderRadius: "2px 2px 0 0", transition: "height 0.12s ease" }} />
                ) : (
                  activeProfiles.map((prof, pi) => {
                    const h = getJitteredHeight(prof.spectrum[i], i);
                    return <div key={pi} style={{ position: "absolute", bottom: 0, left: `${pi * 20}%`, width: `${100 - (activeProfiles.length - 1) * 15}%`, height: `${h * 100}%`, background: `linear-gradient(to top, ${prof.color}33, ${prof.color}AA)`, borderRadius: "2px 2px 0 0", transition: "height 0.12s ease", border: `1px solid ${prof.color}44`, borderBottom: "none" }} />;
                  })
                )}
              </div>
            );
          })}
        </div>
        {/* Formant annotations */}
        {selected.map(key => {
          const prof = VOICE_PROFILES[key];
          return prof.formants.map((f, fi) => (
            <div key={`${key}-${fi}`} style={{ position: "absolute", left: `${(f.band / bands) * 100}%`, top: 4, transform: "translateX(-50%)", textAlign: "center", pointerEvents: "none", zIndex: 2 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: prof.color, lineHeight: 1 }}>{f.label}</div>
              <div style={{ width: 1, height: 8, background: `${prof.color}66`, margin: "1px auto" }} />
            </div>
          ));
        })}
        {/* Frequency axis */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0 0 0", borderTop: `1px solid ${C.border}` }}>
          {FREQ_LABELS.map((f, i) => (
            <div key={i} style={{ fontSize: 10, color: C.dim, textAlign: "center", flex: 1 }}>{f.label}Hz</div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 13, color: C.dim, marginTop: 8, lineHeight: 1.6 }}>
        {cycling
          ? `Now showing: ${VOICE_PROFILES[selected[0]].label}. Watch how the formant peaks shift position as the vocal tract size changes between speakers.`
          : selected.length > 1
          ? "The formant peaks (F1–F4) shift higher as the vocal tract gets smaller: lowest for the adult male, highest for the child. This is why you can instantly tell these voices apart, and it's the core challenge voice cloning AI has to solve."
          : `Showing the ${VOICE_PROFILES[selected[0]].label.toLowerCase()} spectral profile for the vowel \"ah.\" The peaks labeled F1–F4 are formant resonances — shaped by the size and geometry of the vocal tract. Toggle another voice to see how the same vowel looks completely different from a different speaker.`}
      </div>
      <div style={{ fontSize: 11, color: C.dim, marginTop: 6, fontStyle: "italic" }}>Based on formant measurements from <a href="https://pubmed.ncbi.nlm.nih.gov/7759650/" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }} onMouseEnter={e => e.target.style.textDecoration = "underline"} onMouseLeave={e => e.target.style.textDecoration = "none"}>Hillenbrand, Getty, Clark &amp; Wheeler (1995)</a>. Spectrum computed using <a href="https://en.wikipedia.org/wiki/Source%E2%80%93filter_model" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }} onMouseEnter={e => e.target.style.textDecoration = "underline"} onMouseLeave={e => e.target.style.textDecoration = "none"}>source-filter model</a> with glottal rolloff.</div>
    </div>
  );
};

const PipelineDiagram = ({ steps, activeStep = -1, onStepClick }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", padding: "16px 0" }}>
    {steps.map((step, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center" }}>
        <div
          onClick={onStepClick ? () => onStepClick(i) : undefined}
          onMouseEnter={onStepClick ? e => { if (i !== activeStep) { e.currentTarget.style.borderColor = C.secondary; e.currentTarget.style.background = `${C.primary}12`; } } : undefined}
          onMouseLeave={onStepClick ? e => { if (i !== activeStep) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.card; } } : undefined}
          style={{ background: i === activeStep ? `${C.primary}20` : C.card, border: `1px solid ${i === activeStep ? C.secondary : C.border}`, borderRadius: 12, padding: "12px 16px", minWidth: 100, textAlign: "center", transition: "all 0.3s ease", boxShadow: i === activeStep ? `0 0 20px ${C.primary}22` : "none", cursor: onStepClick ? "pointer" : "default" }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}><Icon name={step.icon} size={22} /></div>
          <div style={{ fontSize: 13, color: i === activeStep ? C.accent : C.muted, fontWeight: 600 }}>{step.label}</div>
        </div>
        {i < steps.length - 1 && <div style={{ color: C.border, padding: "0 4px", display: "flex", alignItems: "center" }}><ArrowRightIcon style={{ width: 16, height: 16 }} aria-hidden="true" /></div>}
      </div>
    ))}
  </div>
);

const inlineCode = (text) => {
  const parts = text.split(/(`[^`]+`)/);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part.startsWith("`") && part.endsWith("`")
      ? <code key={i} style={{ background: `${C.primary}20`, border: `1px solid ${C.primary}44`, borderRadius: 4, padding: "1px 5px", fontSize: 12, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: C.accent }}>{part.slice(1, -1)}</code>
      : part
  );
};

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
        {t.prereq && <div style={{ marginTop: 10, fontSize: 13, color: C.accent, fontWeight: 600 }}>{t.prereq}</div>}
        {t.install && <div style={{ marginTop: t.prereq ? 6 : 10 }}><CodeBlock code={t.install} language="bash" /></div>}
        {t.guide && <div style={{ marginTop: 12, background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, position: "relative" }}>
          <div style={{ position: "absolute", top: 8, right: 12, fontSize: 12, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{t.guideLabel || t.name}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {t.guide.map((g, gi) => (
              <div key={gi}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{g.heading}</div>
                {g.action && <div style={{ fontSize: 14, color: C.accent, marginBottom: 4 }}>{inlineCode(g.action)}</div>}
                {g.steps && <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: C.muted, lineHeight: 1.8 }}>
                  {g.steps.map((s, si) => <li key={si}>{inlineCode(s)}</li>)}
                </ol>}
                {g.note && <div style={{ marginTop: 8, fontSize: 12, color: C.dim, fontStyle: "italic", lineHeight: 1.7 }}>{g.note}</div>}
              </div>
            ))}
          </div>
        </div>}
        {t.image && <div style={{ marginTop: 12 }}><img src={t.image} alt={`${t.name} screenshot`} style={{ width: "100%", borderRadius: 8, border: `1px solid ${C.border}` }} /></div>}
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
        <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>Call Center Village Training Module 01</div>
      </div>
    </div>
    <div style={{ fontSize: 17, color: C.muted, maxWidth: 540, lineHeight: 1.7, marginBottom: 32 }}>Learn how voices can be replicated, modified, and synthesized — from traditional audio engineering to cutting-edge AI.</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
      {[{ label: "Duration", value: "~30 min", icon: "clock" }, { label: "Difficulty", value: "Intermediate", icon: "trending-up" }, { label: "Prerequisites", value: "CLI & audio basics", icon: "clipboard" }].map((item, i) => (
        <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}><Icon name={item.icon} size={28} /></div>
          <div style={{ fontSize: 14, color: C.dim, fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
          <div style={{ fontSize: 16, color: C.text, fontWeight: 700 }}>{item.value}</div>
        </div>
      ))}
    </div>
    <div style={{ borderRadius: 12, border: `1px solid ${C.tertiary}44`, overflow: "hidden" }}>
      <div style={{ background: `${C.tertiary}25`, padding: 20 }}>
        <div style={{ fontSize: 15, color: C.tertiary, fontWeight: 700, marginBottom: 8 }}><Icon name="warning" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />ETHICAL NOTICE</div>
        <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.7 }}>This training is for <strong style={{ color: C.text }}>defensive security research only</strong>. Voice cloning without consent is illegal in many jurisdictions. Always obtain explicit permission.</div>
      </div>
      <div style={{ background: `${C.tertiary}10`, borderTop: `1px solid ${C.tertiary}44`, padding: 20 }}>
        <div style={{ fontSize: 13, color: C.dim, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}><Icon name="book-open" size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Further Reading</div>
        <ol style={{ margin: 0, padding: 0, paddingLeft: 24, display: "flex", flexDirection: "column", gap: 6, color: C.dim }}>
          {[
            { href: "https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2023/11/preventing-harms-ai-enabled-voice-cloning", label: "FTC — Preventing Harms from AI-Enabled Voice Cloning" },
            { href: "https://sites.law.duq.edu/juris/2025/11/25/the-law-speaks-up-ai-voice-cloning-and-consent/", label: "Duquesne Law — AI Voice Cloning and Consent" },
            { href: "https://en.wikipedia.org/wiki/Telephone_call_recording_laws", label: "Wikipedia — Telephone Call Recording Laws by Jurisdiction" },
            { href: "https://en.wikipedia.org/wiki/Audio_deepfake", label: "Wikipedia — Audio Deepfakes" },
            { href: "https://www.ncsl.org/technology-and-communication/artificial-intelligence-2024-legislation", label: "NCSL — AI Legislation Tracker (State Laws)" },
            { href: "https://artificialintelligenceact.eu/", label: "EU AI Act — Official Text and Resources" },
          ].map((link, i) => (
            <li key={i}>
              <a href={link.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: C.accent, textDecoration: "none", lineHeight: 1.6 }}
                onMouseEnter={e => e.target.style.textDecoration = "underline"}
                onMouseLeave={e => e.target.style.textDecoration = "none"}
              ><Icon name="arrow-top-right-on-square" size={12} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 5 }} />{link.label}</a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </div>
);

const FundamentalsSection = () => {
  const [waveType, setWaveType] = useState("sine");
  const waveRef = useRef(null);
  const [wavePlaying, setWavePlaying] = useState(false);
  return (<div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Audio Fundamentals</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>Before we can understand how voices are cloned, we need to understand what sound actually looks like. Every sound — from a simple beep to a human voice — is a pressure wave moving through the air, and we can visualize these waves to see how they differ.</p>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>A <strong style={{ color: C.text }}>sine wave</strong> is the simplest possible sound: one smooth, repeating frequency. A <strong style={{ color: C.text }}>square wave</strong> snaps abruptly between two levels, producing a harsher tone packed with extra harmonics. Then look at the <strong style={{ color: C.text }}>human voice</strong> — it's dramatically more complex, made up of dozens of overlapping frequencies that shift constantly. That complexity is what makes every voice unique, and it's what voice cloning AI has to learn to reproduce.</p>
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Interactive Waveform Explorer</div>
      <div role="tablist" style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        {["sine", "square", "complex"].map(t => <button key={t} role="tab" aria-selected={waveType === t} onClick={() => setWaveType(t)} style={{ background: waveType === t ? `${C.primary}20` : "#06040c", border: `1px solid ${waveType === t ? C.secondary : C.border}`, borderRadius: 6, padding: "6px 12px", color: waveType === t ? C.accent : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600 }}>{t === "complex" ? "Human Voice" : `${t[0].toUpperCase()+t.slice(1)} Wave`}</button>)}
        <button
          onClick={() => waveRef.current?.togglePlay()}
          aria-label={wavePlaying ? "Stop audio" : "Play audio"}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: wavePlaying ? "#58E88025" : `${C.primary}25`,
            border: `1px solid ${wavePlaying ? "#58E88066" : C.border}`,
            borderRadius: 6, padding: "6px 12px",
            color: wavePlaying ? "#58E880" : C.accent,
            cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600,
            transition: "all 0.2s ease",
          }}
        >
          <Icon name={wavePlaying ? "stop" : "play"} size={14} />{wavePlaying ? "Stop" : "Play"}
        </button>
      </div>
      <WaveformViz ref={waveRef} type={waveType} onPlayingChange={setWavePlaying} />
      <div style={{ fontSize: 14, color: C.dim, marginTop: 8 }}>{waveType === "sine" ? "A pure tone — single frequency, 440Hz (the 'A' note). Hit play to hear it. Think tuning forks, hearing tests, and the reference pitch used to tune instruments. Sine waves are the building blocks of all complex sounds." : waveType === "square" ? "An abrupt on/off signal — rich in odd harmonics. Hit play to hear the harsh, buzzy tone. Used as clock sources in digital circuits, sync signals in audio gear, and the basis for chiptune / 8-bit video game music. Never found in natural voice." : "Human voice: many overlapping harmonics with micro-variations in pitch, amplitude, and timing. Hit play to hear a synthesized vowel and watch the waveform — notice how much more chaotic it is compared to the pure tones."}</div>
    </div>

    <SectionDivider />
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>Key Voice Characteristics</div>
      <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 16, fontSize: 14 }}>Every voice has a set of measurable properties that, taken together, form a unique acoustic signature — no two people share the same combination.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { name: "Pitch (F0)", desc: "The fundamental frequency — the lowest note your vocal cords produce. Male voices typically sit around 85–180Hz, female voices around 165–255Hz. This is the 'base note' of your voice that everything else builds on.", diagram: <PitchDiagram /> },
          { name: "Formants (F1–F4)", desc: "Resonance peaks created by the shape of your throat, mouth, and nasal cavity. F1 and F2 determine which vowel you're saying. F3 and F4 add the personal 'color' that distinguishes your voice from someone else's — even when saying the same word.", diagram: <FormantDiagram /> },
          { name: "Timbre", desc: "The overall 'texture' of a voice — how breathy, nasal, or rich it sounds. Timbre comes from the relative strength of all the harmonics above the fundamental. Same pitch, completely different character.", diagram: <TimbreDiagram /> },
          { name: "Prosody", desc: "The rhythm, stress, and intonation of speech — how you 'sing' your words. Prosody is the hardest characteristic for AI to clone because it depends on meaning and emotion, not just acoustic patterns.", diagram: <ProsodyDiagram /> },
        ].map((c, i) => (
          <VoiceCharacteristicCard key={i} name={c.name} desc={c.desc} diagram={c.diagram} />
        ))}
      </div>
      <SectionDivider />
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>Frequency Spectrum — Your Vocal Fingerprint</div>
      <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 16, fontSize: 14 }}>Imagine three people — an adult man, an adult woman, and a child — all saying the same vowel sound: "ah" (as in "father"). The graph below shows what each voice looks like in the frequency domain, plotted from low frequencies on the left to high frequencies on the right. The height of each bar represents how loud that frequency is. The peaks labeled F1–F4 are the formant resonances, and they land at different positions for each speaker because their vocal tracts are different sizes.</p>
      <SpectrumViz />
    </div>
    <SectionDivider />
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>Audio Quality Recommendations for Cloning</div>
      <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 20, fontSize: 14 }}>Now that you know what makes a voice unique — the fundamental pitch, the formant peaks, the harmonic texture — the question becomes: how good does a recording need to be to preserve all of that? If the sample rate is too low, the upper formants get cut off. If there's too much background noise, the subtle harmonics that define timbre get buried. If the audio clips, the waveform gets distorted beyond recognition. There's no hard cutoff, but these are the general thresholds where most cloning tools start producing usable results.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
        {[
          { label: "Sample Rate", value: "≥16kHz", ideal: "44.1kHz+", detail: "Sample rate determines the highest frequency a recording can capture — specifically, half the sample rate (the Nyquist limit). At 16kHz, the maximum captured frequency is 8kHz, which barely covers the third formant (F3) for most speakers and cuts off F4 entirely. Since upper formants are a key part of what makes a voice recognizable, losing them means the cloning model has less to work with. At 44.1kHz (CD quality), the capture range extends to 22kHz — well beyond the useful range of human speech — preserving every harmonic and formant the model needs to accurately reproduce the voice." },
          { label: "Bit Depth", value: "≥16-bit", ideal: "24-bit", detail: "Bit depth controls how many discrete amplitude levels are available to represent the waveform. At 16-bit, there are 65,536 levels, which provides about 96dB of dynamic range — adequate for most speech. At 24-bit, that jumps to over 16 million levels and 144dB of dynamic range. The extra headroom matters because voice cloning models learn from subtle amplitude variations — the slight volume differences between voiced and unvoiced consonants, the natural decay of breath at the end of a phrase. With 24-bit, these quiet details are captured cleanly instead of being rounded into quantization noise." },
          { label: "Duration", value: "≥30s", ideal: "3-10 min", detail: "Traditional voice cloning models need enough speech to encounter every phoneme the target language uses — English has roughly 44. A 30-second clip might only cover a handful of vowels and common consonants, leaving the model guessing on sounds like 'zh,' 'th,' or 'ng.' With 3-10 minutes of varied speech, the model sees each phoneme in multiple phonetic contexts (word-initial, word-final, stressed, unstressed), which is what it needs to generalize naturally. Longer recordings also give the model more examples of the speaker's prosody patterns — how they raise pitch for questions, where they pause, how they emphasize words." },
          { label: "Format", value: "WAV/FLAC", ideal: "WAV", detail: "WAV stores raw, uncompressed PCM audio — every sample exactly as the microphone captured it. FLAC compresses the file size (typically 50-60% smaller) but is mathematically lossless, meaning the decoded audio is bit-for-bit identical to the original. MP3 and other lossy formats achieve smaller files by permanently discarding audio information the encoder considers less perceptible — but 'less perceptible to a human listener' is not the same as 'unimportant to a neural network.' Lossy compression introduces subtle artifacts in transients and quiet passages that a cloning model can pick up and reproduce. WAV avoids this entirely." },
          { label: "Noise Floor", value: "≤ −40dB", ideal: "≤ −60dB", detail: "The noise floor is the level of background sound present when the speaker is silent — air conditioning hum, electrical interference, room reverb. At −40dB, background noise is roughly 1% of the signal level, which sounds quiet to a casual listener but is clearly visible on a spectrogram. A cloning model trained on noisy audio will bake that noise into its learned representation of the voice, producing output that sounds like it was recorded in the same noisy room. At −60dB (0.1% of signal level), the noise is low enough that the model can cleanly isolate the vocal characteristics without learning artifacts from the recording environment." },
          { label: "Clipping", value: "None", ideal: "Peak ≤ −3dB", detail: "Clipping occurs when the audio signal exceeds the maximum level the recorder can represent — the waveform peaks get flattened, introducing harsh distortion. Even brief clips on loud consonants like 'p' or 'k' permanently destroy the waveform shape at those moments, and there's no way to reconstruct what was lost. Keeping peaks at or below −3dB provides headroom for natural volume spikes without hitting the ceiling. This is especially important for speech, where plosive consonants and emphatic syllables can spike 6-10dB above the average level. Once audio clips, no amount of post-processing can fix it." }
        ].map((r, i) => (
          <RecommendationCard key={i} label={r.label} value={r.value} ideal={r.ideal} detail={r.detail} />
        ))}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Why These Numbers Matter</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <AudioQualityCard title="Sample Rate">
          <svg width="200" height="108" viewBox="0 0 200 108" style={{ width: "100%", height: 108 }}>
            <text x="4" y="10" fill={C.tertiary} fontSize="9" fontWeight="700" fontFamily="inherit">8kHz — too low</text>
            <path d={Array.from({ length: 200 }, (_, x) => { const t = (x / 200) * Math.PI * 8; const y = 29 + Math.sin(t) * 6; return `${x === 0 ? "M" : "L"}${x},${y}`; }).join(" ")} fill="none" stroke={C.tertiary} strokeWidth="1.5" opacity="0.8" />
            <rect x="100" y="19" width="100" height="20" fill="#06040c" opacity="0.7" />
            <text x="130" y="32" fill={C.tertiary} fontSize="8" fontFamily="inherit" opacity="0.6">F3, F4 lost</text>
            <text x="4" y="57" fill="#58E880" fontSize="9" fontWeight="700" fontFamily="inherit">44.1kHz — full detail</text>
            <path d={Array.from({ length: 200 }, (_, x) => { const t = (x / 200) * Math.PI * 8; const y = 76 + Math.sin(t) * 5 + Math.sin(t * 2.5) * 3 + Math.sin(t * 4.1) * 2 + Math.sin(t * 6) * 1; return `${x === 0 ? "M" : "L"}${x},${y}`; }).join(" ")} fill="none" stroke="#58E880" strokeWidth="1.5" opacity="0.8" />
            <text x="4" y="105" fill="#58E880" fontSize="8" fontFamily="inherit">All formants preserved</text>
          </svg>
        </AudioQualityCard>
        <AudioQualityCard title="Bit Depth">
          <svg width="200" height="108" viewBox="0 0 200 108" style={{ width: "100%", height: 108 }}>
            <text x="4" y="10" fill={C.tertiary} fontSize="9" fontWeight="700" fontFamily="inherit">8-bit — coarse steps</text>
            <path d={Array.from({ length: 200 }, (_, x) => { const t = (x / 200) * Math.PI * 6; const raw = Math.sin(t) * 8 + Math.sin(t * 2.5) * 4; const quantized = Math.round(raw / 3) * 3; const y = 29 + quantized; return `${x === 0 ? "M" : "L"}${x},${y}`; }).join(" ")} fill="none" stroke={C.tertiary} strokeWidth="1.5" opacity="0.8" />
            <text x="4" y="57" fill="#58E880" fontSize="9" fontWeight="700" fontFamily="inherit">24-bit — smooth detail</text>
            <path d={Array.from({ length: 200 }, (_, x) => { const t = (x / 200) * Math.PI * 6; const y = 76 + Math.sin(t) * 8 + Math.sin(t * 2.5) * 4 + Math.sin(t * 4.1) * 2; return `${x === 0 ? "M" : "L"}${x},${y}`; }).join(" ")} fill="none" stroke="#58E880" strokeWidth="1.5" opacity="0.8" />
            <text x="4" y="105" fill="#58E880" fontSize="8" fontFamily="inherit">Subtle dynamics preserved</text>
          </svg>
        </AudioQualityCard>
        <AudioQualityCard title="Duration">
          <svg width="200" height="108" viewBox="0 0 200 108" style={{ width: "100%", height: 108 }}>
            <text x="4" y="10" fill={C.tertiary} fontSize="9" fontWeight="700" fontFamily="inherit">5s — limited phonemes</text>
            <g opacity="0.8">
              {["aa","ee","oo"].map((p, i) => (
                <g key={i}>
                  <rect x={8 + i * 28} y="20" width="22" height="16" rx="3" fill={`${C.tertiary}30`} stroke={C.tertiary} strokeWidth="0.5" />
                  <text x={19 + i * 28} y="31" fill={C.tertiary} fontSize="7" textAnchor="middle" fontFamily="inherit">{p}</text>
                </g>
              ))}
              <text x="100" y="31" fill={C.tertiary} fontSize="8" fontFamily="inherit" opacity="0.5">missing most sounds</text>
            </g>
            <text x="4" y="57" fill="#58E880" fontSize="9" fontWeight="700" fontFamily="inherit">3+ min — full coverage</text>
            <g opacity="0.8">
              {["aa","ee","oo","aw","p","t","k","s","sh","th","m","n"].map((p, i) => (
                <g key={i}>
                  <rect x={4 + i * 16} y="67" width="13" height="14" rx="2" fill="#58E88020" stroke="#58E880" strokeWidth="0.5" />
                  <text x={10.5 + i * 16} y="77" fill="#58E880" fontSize="6" textAnchor="middle" fontFamily="inherit">{p}</text>
                </g>
              ))}
            </g>
            <text x="4" y="105" fill="#58E880" fontSize="8" fontFamily="inherit">Broader phoneme coverage</text>
          </svg>
        </AudioQualityCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12 }}>
        <AudioQualityCard title="Format">
          <svg width="200" height="108" viewBox="0 0 200 108" style={{ width: "100%", height: 108 }}>
            <text x="4" y="10" fill={C.tertiary} fontSize="9" fontWeight="700" fontFamily="inherit">MP3 — lossy compression</text>
            <path d={Array.from({ length: 200 }, (_, x) => { const t = (x / 200) * Math.PI * 6; const y = 25 + Math.sin(t) * 5 + Math.sin(t * 2.5) * 2.5 + (x % 20 < 3 ? 1.5 : 0); return `${x === 0 ? "M" : "L"}${x},${y}`; }).join(" ")} fill="none" stroke={C.tertiary} strokeWidth="1.5" opacity="0.8" />
            <text x="4" y="42" fill={C.tertiary} fontSize="7" fontFamily="inherit" opacity="0.5">artifacts in quiet parts</text>
            <text x="4" y="57" fill="#58E880" fontSize="9" fontWeight="700" fontFamily="inherit">WAV/FLAC — lossless</text>
            <path d={Array.from({ length: 200 }, (_, x) => { const t = (x / 200) * Math.PI * 6; const y = 76 + Math.sin(t) * 6 + Math.sin(t * 2.5) * 3 + Math.sin(t * 4.1) * 1.5 + Math.sin(t * 5.8) * 0.8; return `${x === 0 ? "M" : "L"}${x},${y}`; }).join(" ")} fill="none" stroke="#58E880" strokeWidth="1.5" opacity="0.8" />
            <text x="4" y="105" fill="#58E880" fontSize="8" fontFamily="inherit">Exact original preserved</text>
          </svg>
        </AudioQualityCard>
        <AudioQualityCard title="Noise Floor">
          <svg width="200" height="108" viewBox="0 0 200 108" style={{ width: "100%", height: 108 }}>
            <text x="4" y="10" fill={C.tertiary} fontSize="9" fontWeight="700" fontFamily="inherit">−20dB — noisy</text>
            <path d={Array.from({ length: 200 }, (_, x) => { const t = (x / 200) * Math.PI * 6; const signal = Math.sin(t) * 5 + Math.sin(t * 2.5) * 3; const noise = (Math.sin(x * 7.3) + Math.sin(x * 13.1) + Math.sin(x * 23.7)) * 3; const y = 29 + signal + noise; return `${x === 0 ? "M" : "L"}${x},${y}`; }).join(" ")} fill="none" stroke={C.tertiary} strokeWidth="1.5" opacity="0.8" />
            <text x="4" y="57" fill="#58E880" fontSize="9" fontWeight="700" fontFamily="inherit">−60dB — clean</text>
            <path d={Array.from({ length: 200 }, (_, x) => { const t = (x / 200) * Math.PI * 6; const y = 76 + Math.sin(t) * 6 + Math.sin(t * 2.5) * 3.5 + Math.sin(t * 4.1) * 2; return `${x === 0 ? "M" : "L"}${x},${y}`; }).join(" ")} fill="none" stroke="#58E880" strokeWidth="1.5" opacity="0.8" />
            <text x="4" y="105" fill="#58E880" fontSize="8" fontFamily="inherit">Harmonics clearly visible</text>
          </svg>
        </AudioQualityCard>
        <AudioQualityCard title="Clipping">
          <svg width="200" height="108" viewBox="0 0 200 108" style={{ width: "100%", height: 108 }}>
            <text x="4" y="10" fill={C.tertiary} fontSize="9" fontWeight="700" fontFamily="inherit">Clipped — distorted</text>
            <path d={Array.from({ length: 200 }, (_, x) => { const t = (x / 200) * Math.PI * 6; const raw = Math.sin(t) * 12 + Math.sin(t * 2.5) * 6; const clipped = Math.max(-7, Math.min(7, raw)); const y = 29 + clipped; return `${x === 0 ? "M" : "L"}${x},${y}`; }).join(" ")} fill="none" stroke={C.tertiary} strokeWidth="1.5" opacity="0.8" />
            <line x1="0" y1="22" x2="200" y2="22" stroke={C.tertiary} strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
            <line x1="0" y1="36" x2="200" y2="36" stroke={C.tertiary} strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
            <text x="4" y="57" fill="#58E880" fontSize="9" fontWeight="700" fontFamily="inherit">Peak ≤ −3dB — headroom</text>
            <path d={Array.from({ length: 200 }, (_, x) => { const t = (x / 200) * Math.PI * 6; const y = 76 + Math.sin(t) * 8 + Math.sin(t * 2.5) * 4 + Math.sin(t * 4.1) * 2; return `${x === 0 ? "M" : "L"}${x},${y}`; }).join(" ")} fill="none" stroke="#58E880" strokeWidth="1.5" opacity="0.8" />
            <text x="4" y="105" fill="#58E880" fontSize="8" fontFamily="inherit">Waveform intact</text>
          </svg>
        </AudioQualityCard>
      </div>
      <p style={{ color: C.muted, lineHeight: 1.7, marginTop: 16, fontSize: 13 }}>Each diagram shows the same voice signal under <span style={{ color: C.tertiary, fontWeight: 600 }}>poor conditions</span> and <span style={{ color: "#58E880", fontWeight: 600 }}>ideal conditions</span>. Low sample rates lose upper formants, noise buries subtle harmonics, clipping flattens peaks, low bit depth adds staircase artifacts, short recordings miss phonemes the AI needs to learn, and lossy formats throw away detail the model depends on.</p>
    </div>
    <SectionDivider />
    <QuizBank questions={[
      { question: "What are formants?", options: ["The base frequency of your voice", "Resonance peaks shaped by your vocal tract", "The volume of each syllable", "Digital encoding of speech"], correctIndex: 1, explanation: "Formants are resonance frequencies shaped by your vocal tract. They're one of the primary features that makes each voice unique." },
      { question: "What sample rate is generally considered the minimum for voice cloning?", options: ["8kHz", "16kHz", "44.1kHz", "96kHz"], correctIndex: 1, explanation: "16kHz is the commonly accepted baseline — below this, too much frequency information tends to be lost for most cloning tools. 44.1kHz or higher is ideal, but 16kHz usually captures enough of the essential voice frequencies." },
      { question: "Which voice characteristic tends to be the HARDEST for AI to clone?", options: ["Base pitch", "Prosody and emotional expression", "Vowel formants", "Volume"], correctIndex: 1, explanation: "Prosody — rhythm, stress, intonation, emotion — generally requires understanding meaning and context, not just acoustic patterns. Most current AI models struggle with this more than the other characteristics." },
    ]} />
  </div>);
};

const TraditionalSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  return (<div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Non-AI Voice Modification</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>Long before AI voice cloning, traditional audio tools could alter pitch, tone, and timbre characteristics. These techniques are well-understood and leave detectable signatures — but they're fast, accessible, widely used, and can still be combined with newer AI tools.</p>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 8 }}>We're representing the voice modification pipeline here as six steps, but real-world chains can be longer or shorter depending on the goal. Only <span style={{ fontStyle: "italic" }}>Input</span> and <span style={{ fontStyle: "italic" }}>Output</span> are required — <span style={{ fontStyle: "italic" }}>EQ/Filter</span>, <span style={{ fontStyle: "italic" }}>Pitch Shift</span>, <span style={{ fontStyle: "italic" }}>Formant</span>, and <span style={{ fontStyle: "italic" }}>FX Chain</span> are all optional stages you can mix and match to manipulate the audio.</p>
    <div style={{ borderLeft: `3px solid ${C.secondary}`, paddingLeft: 16, margin: "12px 0", fontStyle: "italic", color: C.dim, fontSize: 13, lineHeight: 1.7 }}>"This is my audio-toolkit. There are many like it, but this one is mine."<br />"My audio-toolkit is my best friend. It is my life."<br />"I must master it as I must master my life."<br />"Without me, my audio-toolkit is useless."<br />"Without my audio-toolkit, I am useless."<br />— <a href="https://en.wikipedia.org/wiki/Soundwave_(Transformers)" target="_blank" rel="noopener noreferrer" style={{ color: C.dim, textDecoration: "underline" }}>Soundwave</a>, probably</div>
    <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Example Tool Chains</h3>
    <p style={{ color: C.secondary, lineHeight: 1.7, marginBottom: 24, fontSize: 13 }}>Click each step below to see common tools for that stage. All tools referenced are already preinstalled.</p>
    <PipelineDiagram activeStep={activeStep} onStepClick={i => setActiveStep(i)} steps={[{ icon: "microphone", label: "Input" }, { icon: "chart-bar", label: "EQ/Filter" }, { icon: "arrow-path", label: "Pitch Shift" }, { icon: "scale", label: "Formant" }, { icon: "speaker-wave", label: "FX Chain" }, { icon: "headphones", label: "Output" }]} />
    <p style={{ color: C.accent, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{[
      "Record or obtain an audio file and convert it into a format your tool chain can work with. This is the starting point for any voice modification workflow.",
      "Equalization and filtering let you selectively boost, cut, or remove frequency ranges from the audio. In voice modification, this is used to alter the tonal quality of a voice — for example, cutting low frequencies to thin out a deep voice, boosting higher frequencies to add brightness, or bandpass filtering to simulate a phone line. It's also useful for cleaning up recordings by removing rumble, hiss, or background noise before further processing.",
      "Shift the fundamental frequency of the audio up or down. This changes how high or low the voice sounds without necessarily altering the speed or duration of the recording.",
      "Adjust the resonance characteristics that define a voice's identity. Formants are what make a voice sound distinctly male, female, or childlike — independent of pitch.",
      "Layer multiple effects together to create a more convincing or dramatic transformation. This is where you combine reverb, compression, distortion, and other effects into a single processing chain.",
      "Export and finalize your processed audio. Normalize levels, trim silence, and convert to your target format for delivery or further use.",
    ][activeStep]}</p>
    <ToolComparison tools={[
      // Step 0: Input
      [
        { name: "SoX", desc: "Record audio and convert file formats.", pros: ["Records from mic", "Format conversion", "Scriptable"], cons: ["CLI only"], prereq: "Open a console / terminal window, then run:", install: `# Preinstalled on Call Center Village laptops\n# sudo apt install sox libsox-fmt-all\n\n# Navigate to shared working directory\ncd ~/callcentervillage/voice-cloning\n\n# Record from default mic (16kHz mono, stop with Ctrl+C)\nrec -r 16000 -c 1 input.wav\n\n# Convert format\nsox input.wav output.mp3` },
        { name: "Audacity", desc: "Record, visualize, and trim audio with a GUI.", pros: ["Visual waveform", "Easy trimming", "Monitor levels"], cons: ["GUI only", "No scripting"], prereq: "Open the Audacity application (GUI):", install: `# Preinstalled on Call Center Village laptops\n# sudo apt install audacity`, guide: [
          { heading: "Configure audio devices", action: "Edit → Preferences → Audio Settings", steps: ["Set Playback Device to your speakers/headphones", "Set Recording Device to your microphone"] },
          { heading: "Record your audio", action: "File → New to create a blank project", steps: ["Click the red Record button (or press R) to start", "Click Stop (or press Space) when finished"] },
          { heading: "Save your recording", action: "File → Export Audio", steps: ["Navigate to `~/callcentervillage/voice-cloning/`", "Save as `input.wav` (WAV 16-bit PCM)"] },
        ], image: "/images/audacity-screenshot.png" },
      ],
      // Step 1: EQ/Filter
      [
        { name: "SoX", desc: "Apply EQ bands, highpass/lowpass filters, and noise reduction.", pros: ["Fast", "Chainable filters", "Scriptable"], cons: ["No visual feedback"], install: `# Highpass + lowpass (bandpass 300-3400Hz)\nsox input.wav output.wav highpass 300 lowpass 3400\n\n# Parametric EQ: boost 3kHz by 6dB\nsox input.wav output.wav equalizer 3000 1q 6\n\n# Cut low rumble\nsox input.wav output.wav highpass 80` },
        { name: "FFmpeg", desc: "Complex filter graphs for multi-band EQ and filtering.", pros: ["Filter chaining", "Precise control", "Any format"], cons: ["Steep learning curve"], install: `# Bandpass filter (telephone band)\nffmpeg -i input.wav -af "highpass=f=300,lowpass=f=3400" output.wav\n\n# Multi-band EQ\nffmpeg -i input.wav -af "equalizer=f=300:t=q:w=2:g=-8,equalizer=f=3000:t=q:w=1:g=6" output.wav` },
        { name: "Audacity", desc: "Visual EQ curves and real-time spectrum analysis.", pros: ["Graphic EQ", "Spectrum view", "Preview"], cons: ["GUI only", "No batch"], install: `# Preinstalled on Call Center Village laptops\n# sudo apt install audacity`, guide: [
          { heading: "Open your file", action: "File → Open → `~/callcentervillage/voice-cloning/input.wav`" },
          { heading: "Apply EQ and filters", steps: ["Effect → EQ and Filters → Filter Curve EQ (draw a custom EQ curve)", "Effect → EQ and Filters → High-Pass Filter / Low-Pass Filter", "Analyze → Plot Spectrum (to visualize frequencies before and after)"] },
          { heading: "Save your result", action: "File → Export Audio → save to `~/callcentervillage/voice-cloning/`" },
        ] },
      ],
      // Step 2: Pitch Shift
      [
        { name: "SoX", desc: "Quick pitch shifts in cents (1/100th of a semitone). Simple but no formant preservation.", pros: ["Blazing fast", "Scriptable", "Simple syntax"], cons: ["No formant control", "Artifacts at extremes"], install: `# Shift pitch up 300 cents (3 semitones)\nsox input.wav output.wav pitch 300\n\n# Shift pitch down 500 cents\nsox input.wav output.wav pitch -500\n\n# Speed-based pitch (changes duration too)\nsox input.wav output.wav speed 1.2` },
        { name: "RubberBand", desc: "High-quality pitch shifting that preserves timing.", pros: ["Best quality", "Preserves duration", "Real-time capable"], cons: ["Pitch/time only"], install: `# Preinstalled on Call Center Village laptops\n# sudo apt install rubberband-cli\n\n# Shift up 2 semitones (preserves duration)\nrubberband -p 2 input.wav output.wav\n\n# Shift down 3 semitones\nrubberband -p -3 input.wav output.wav` },
        { name: "FFmpeg", desc: "Pitch shifting via the RubberBand filter or asetrate.", pros: ["Integrates with pipelines", "Multiple methods"], cons: ["Verbose syntax"], install: `# RubberBand pitch shift via FFmpeg\nffmpeg -i input.wav -af "rubberband=pitch=1.2" output.wav\n\n# Crude pitch shift (changes speed too)\nffmpeg -i input.wav -af "asetrate=48000*1.25,aresample=48000" output.wav` },
      ],
      // Step 3: Formant
      [
        { name: "Praat", desc: "The gold standard for formant analysis and manipulation.", pros: ["Precise formant control", "Scientific accuracy", "Scripting"], cons: ["Dated UI", "Learning curve"], install: `# Preinstalled on Call Center Village laptops\n# sudo apt install praat\n\n# Praat script: shift formants\nRead from file: "input.wav"\nTo Manipulation: 0.01, 75, 600\nExtract formant grid\nFormula (frequencies): "self * 1.2"\nReplace formant grid\nGet resynthesis (overlap-add)\n\nSave as WAV file: "output.wav"` },
        { name: "Audacity + Praat", desc: "Visualize in Audacity, manipulate formants in Praat.", pros: ["Visual + precise", "Best of both"], cons: ["Two-tool workflow"], guide: [
          { heading: "Analyze in Audacity", action: "File → Open → `~/callcentervillage/voice-cloning/input.wav`", steps: ["Analyze → Plot Spectrum (set Algorithm to Spectrum, Size to 2048 or higher)", "Look for prominent peaks in the curve — these are your formant frequencies"], note: <>Typical formant ranges: <strong>F1</strong> ≈ 300–900 Hz, <strong>F2</strong> ≈ 1000–2500 Hz, <strong>F3</strong> ≈ 2500–3500 Hz</> },
          { heading: "Manipulate in Praat", steps: ["Export audio to Praat for formant manipulation", "Re-import result to Audacity to verify"] },
          { heading: "Save your result", action: "File → Export Audio → save to `~/callcentervillage/voice-cloning/`" },
        ], guideLabel: "Audacity + Praat" },
        { name: "SoX", desc: "Approximate formant shifts using EQ bands (limited but fast).", pros: ["Fast", "No extra tools"], cons: ["Not true formant shifting", "Crude approximation"], install: `# Approximate female formant shift:\n# boost higher formant regions, cut lower ones\nsox input.wav output.wav \\\n  equalizer 250 2q -8 \\\n  equalizer 800 2q 4 \\\n  equalizer 3000 1q 6` },
      ],
      // Step 4: FX Chain
      [
        { name: "SoX", desc: "Chain multiple effects: reverb, compression, distortion.", pros: ["All-in-one chains", "Scriptable", "Fast"], cons: ["CLI only"], install: `# Reverb + compression + EQ chain\nsox input.wav output.wav \\\n  gain -6 \\\n  reverb 50 \\\n  compand 0.3,1 6:-70,-60,-20 -5 -90 0.2 \\\n  equalizer 300 2q -8 equalizer 3000 1q 6 \\\n  gain -n -1\n\n# Telephone effect\nsox input.wav output.wav \\\n  gain -6 \\\n  highpass 300 lowpass 3400 \\\n  compand 0.3,1 6:-70,-60,-20 -5 -90 0.2 \\\n  gain -n -1` },
        { name: "FFmpeg", desc: "Complex filter graphs for layered effects processing.", pros: ["Filter chaining", "Parallel processing", "Any format"], cons: ["Verbose", "Hard to debug"], install: `# Chorus + vibrato chain\nffmpeg -i input.wav -af "vibrato=f=8:d=0.5,chorus=0.5:0.9:50:0.4:0.25:2" output.wav\n\n# Tremolo + bandpass\nffmpeg -i input.wav -af "tremolo=f=5:d=0.6,highpass=f=300,lowpass=f=3400" output.wav` },
        { name: "Audacity", desc: "Preview and stack effects with real-time playback.", pros: ["Real-time preview", "Effect stacking", "Visual feedback"], cons: ["GUI only", "No batch"], guide: [
          { heading: "Open your file", action: "File → Open → `~/callcentervillage/voice-cloning/input.wav`" },
          { heading: "Stack effects", steps: ["Effect → Delay and Reverb → Reverb → adjust Room Size, Dampening", "Effect → Volume and Compression → Compressor → set threshold, ratio", "Effect → Distortion and Modulation → Distortion → choose type, amount", "Chain via Effect → Repeat Last Effect (Ctrl+R)"] },
          { heading: "Save your result", action: "File → Export Audio → save to `~/callcentervillage/voice-cloning/`" },
        ] },
      ],
      // Step 5: Output
      [
        { name: "SoX", desc: "Export, normalize, and format final audio.", pros: ["Normalize levels", "Format conversion", "Trim silence"], cons: ["CLI only"], install: `# Normalize to -1dB\nsox input.wav output.wav gain -n -1\n\n# Trim leading/trailing silence\nsox input.wav output.wav silence 1 0.1 1% reverse silence 1 0.1 1% reverse\n\n# Convert to 16kHz mono 16-bit PCM WAV\nsox input.wav -r 16000 -c 1 -b 16 output.wav` },
        { name: "FFmpeg", desc: "Export to any format with precise codec control.", pros: ["Any codec", "Metadata control", "Streaming formats"], cons: ["Many options to learn"], install: `# Export as high-quality MP3\nffmpeg -i input.wav -codec:a libmp3lame -qscale:a 2 output.mp3\n\n# Export as Opus (small, high quality)\nffmpeg -i input.wav -codec:a libopus -b:a 128k output.opus\n\n# Normalize volume\nffmpeg -i input.wav -af "loudnorm=I=-16:LRA=11:TP=-1" output.wav` },
        { name: "Audacity", desc: "Final review with visual waveform before export.", pros: ["Visual verification", "Multiple export formats", "Metadata editor"], cons: ["GUI only"], guide: [
          { heading: "Open your file", action: "File → Open → `~/callcentervillage/voice-cloning/input.wav`" },
          { heading: "Review and normalize", steps: ["Effect → Volume and Compression → Normalize", "View → Show Clipping (check for distortion)"] },
          { heading: "Export final audio", steps: ["File → Export Audio → save to `~/callcentervillage/voice-cloning/`", "File → Export Multiple (batch from labels)"] },
        ] },
      ],
    ][activeStep]} />
    <SectionDivider />
    <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Voice Disguise Recipes</h3>
    <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 14 }}>Here are a few ready-made effect chains to try. You can also pipe tools together (e.g. FFmpeg into SoX) to chain different tools in a single command. Copy them into your terminal, swap in your own audio file, and experiment — tweak the values, stack them differently, or combine techniques. The best way to learn this stuff is to play around and hear what happens.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: C.text, fontSize: 15, fontWeight: 600 }}>
        <Icon name="beaker" size={16} style={{ color: C.tertiary }} />Try It Out
      </div>
      <div style={{ display: "grid", gap: 12, color: C.muted, fontSize: 14, lineHeight: 1.8 }}>
        {[
          { name: "Male → Female (rough)", cmd: "sox input.wav output.wav pitch 500 equalizer 250 2q -6 equalizer 4000 1q 5" },
          { name: "Female → Male (rough)", cmd: "sox input.wav output.wav pitch -400 equalizer 200 2q 4 equalizer 3500 1q -5" },
          { name: "Robot / Anonymizer", cmd: 'ffmpeg -i input.wav -af "vibrato=f=8:d=0.5,chorus=0.5:0.9:50:0.4:0.25:2" output.wav' },
          { name: "Phone Call Simulation", cmd: "sox input.wav output.wav gain -6 highpass 300 lowpass 3400 compand 0.3,1 6:-70,-60,-20 -5 -90 0.2 gain -n -1" },
          { name: "Whisper Effect", cmd: 'ffmpeg -i input.wav -af "highpass=f=500,lowpass=f=4000,volume=0.4,afftdn=nf=-20" output.wav' },
          { name: "Underwater / Muffled", cmd: "sox input.wav output.wav lowpass 600 reverb 80 gain -n -1" },
          { name: "Aged / Gravelly Voice", cmd: "sox input.wav output.wav pitch -200 overdrive 8 equalizer 800 2q 4 reverb 20 gain -n -1" },
          { name: "Piped: Record → Pitch Shift → Telephone Effect", cmd: "sox input.wav -t wav - pitch 300 | sox -t wav - output.wav highpass 300 lowpass 3400 gain -n -1" },
          { name: "Piped: Pitch Up → Reverb → Normalize", cmd: "sox input.wav -t wav - pitch 500 | sox -t wav - output.wav reverb 40 gain -n -1" },
          { name: "Piped: FFmpeg Filter → SoX Post-Processing", cmd: 'ffmpeg -i input.wav -af "vibrato=f=6:d=0.3" -f s16le -ar 16000 -ac 1 - | sox -t raw -r 16000 -e signed -b 16 -c 1 - output.wav equalizer 3000 1q 4 gain -n -1' },
        ].map((r, i) => <div key={i} style={{ background: "#06040c", padding: 12, borderRadius: 8 }}><div style={{ color: C.tertiary, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{r.name}</div><CodeBlock code={r.cmd} language="bash" /></div>)}
      </div>
    </div>
    <SectionDivider />
    <QuizBank questions={[
      { question: "Which tool shifts pitch while preserving the original duration?", options: ["SoX", "RubberBand", "FFmpeg", "Praat"], correctIndex: 1, explanation: "RubberBand uses time-stretching algorithms to shift pitch independently of duration. The SoX speed effect changes both pitch and duration together." },
      { question: "Which tool is BEST for batch processing 1000 audio files?", options: ["Audacity", "SoX", "Praat", "RubberBand"], correctIndex: 1, explanation: "SoX is purpose-built for CLI audio processing — blazing fast and scriptable." },
      { question: "How does a telephone effect help disguise a voice?", options: ["Adds reverb", "Removes frequencies outside 300-3400Hz, destroying identifying harmonics", "Speeds up audio", "Adds masking noise"], correctIndex: 1, explanation: "PSTN bandwidth (300-3400Hz) removes chest resonance and sibilance — key voice identity features." },
    ]} />
  </div>);
};

const MelSpectrogramViz = () => {
  const bands = 48;
  const frames = 80;
  // Magma-inspired colormap: black → deep purple → red-orange → yellow-white
  const colormap = (v) => {
    const clamp = Math.max(0, Math.min(1, v));
    const stops = [
      [0, 2, 4, 12], [12, 7, 40], [52, 10, 80], [110, 20, 100],
      [160, 40, 90], [200, 60, 70], [230, 100, 50], [250, 170, 40],
      [252, 230, 100], [252, 252, 200],
    ];
    const idx = clamp * (stops.length - 1);
    const lo = Math.floor(idx), hi = Math.min(lo + 1, stops.length - 1);
    const t = idx - lo;
    const r = Math.round(stops[lo][0] + (stops[hi][0] - stops[lo][0]) * t);
    const g = Math.round(stops[lo][1] + (stops[hi][1] - stops[lo][1]) * t);
    const b = Math.round(stops[lo][2] + (stops[hi][2] - stops[lo][2]) * t);
    return `rgb(${r},${g},${b})`;
  };
  // Seed a deterministic pseudo-random for consistent rendering
  const seed = (x) => { let s = Math.sin(x * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  // Simulate speech: "Hello, this is your bank calling"
  // Word boundaries (in frame positions): He-llo | this | is | your | bank | call-ing
  const wordRegions = [[2,12],[14,22],[24,28],[30,38],[40,50],[52,62],[64,74]];
  const isVoiced = (col) => wordRegions.some(([s, e]) => col >= s && col <= e);
  const data = Array.from({ length: bands }, (_, row) =>
    Array.from({ length: frames }, (_, col) => {
      const freq = 1 - row / bands; // 0=top(high freq), 1=bottom(low freq)
      if (!isVoiced(col)) return 0.02 + seed(row * 80 + col) * 0.04;
      // Fundamental frequency and harmonics
      const f0 = 0.85 + Math.sin(col * 0.15) * 0.03;
      const harmonicSpacing = 0.08;
      let energy = 0;
      // Create harmonic bands (horizontal lines characteristic of voiced speech)
      for (let h = 0; h < 8; h++) {
        const hFreq = f0 - h * harmonicSpacing;
        const dist = Math.abs(freq - hFreq);
        const harmonicStrength = Math.exp(-h * 0.4) * Math.exp(-dist * dist * 800);
        energy += harmonicStrength;
      }
      // Formant envelope: F1 (~500Hz), F2 (~1500Hz), F3 (~2500Hz)
      const f1Center = 0.75 + Math.sin(col * 0.2) * 0.05;
      const f2Center = 0.55 + Math.sin(col * 0.25 + 1) * 0.08;
      const f3Center = 0.35 + Math.sin(col * 0.18 + 2) * 0.04;
      const formantEnv =
        0.9 * Math.exp(-((freq - f1Center) ** 2) * 30) +
        0.6 * Math.exp(-((freq - f2Center) ** 2) * 40) +
        0.3 * Math.exp(-((freq - f3Center) ** 2) * 50);
      energy *= (0.3 + formantEnv * 0.7);
      // High frequencies roll off
      energy *= Math.exp(-Math.max(0, (1 - freq) - 0.5) * 3);
      // Add slight noise texture
      energy += seed(row * 80 + col) * 0.06;
      // Onset/offset fade
      const wordRegion = wordRegions.find(([s, e]) => col >= s && col <= e);
      if (wordRegion) {
        const [s, e] = wordRegion;
        const onset = Math.min(1, (col - s) / 2);
        const offset = Math.min(1, (e - col) / 2);
        energy *= onset * offset;
      }
      return Math.min(1, energy * 1.2);
    })
  );
  const cellW = 100 / frames;
  const cellH = 100 / bands;
  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 10, color: C.dim, paddingBottom: 18, textAlign: "right", minWidth: 36 }}>
          <span>8 kHz</span><span>4 kHz</span><span>1 kHz</span><span>0 Hz</span>
        </div>
        <div style={{ flex: 1 }}>
          <svg viewBox={`0 0 ${frames} ${bands}`} preserveAspectRatio="none" style={{ width: "100%", height: 180, display: "block", borderRadius: 4, border: `1px solid ${C.border}` }}>
            {data.map((row, ri) => row.map((val, ci) => (
              <rect key={`${ri}-${ci}`} x={ci} y={ri} width={1.1} height={1.1} fill={colormap(val)} />
            )))}
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.dim, marginTop: 2 }}>
            <span>0s</span>
            <div style={{ display: "flex", gap: 16, color: C.dim, fontSize: 9 }}>
              <span>He-llo</span><span>this</span><span>is</span><span>your</span><span>bank</span><span>call-ing</span>
            </div>
            <span>~2s</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, justifyContent: "center" }}>
        <span style={{ fontSize: 10, color: C.dim }}>Quiet</span>
        <div style={{ width: 120, height: 8, borderRadius: 2, background: `linear-gradient(to right, ${colormap(0)}, ${colormap(0.2)}, ${colormap(0.4)}, ${colormap(0.6)}, ${colormap(0.8)}, ${colormap(1)})` }} />
        <span style={{ fontSize: 10, color: C.dim }}>Loud</span>
      </div>
      <div style={{ fontSize: 11, color: C.dim, marginTop: 6, lineHeight: 1.5, textAlign: "center" }}>
        Simulated mel spectrogram for "Hello, this is your bank calling" — horizontal bands are harmonics, bright regions are formants
      </div>
    </div>
  );
};

const VocoderViz = () => {
  const seed = (x) => { let s = Math.sin(x * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  // Waveform bars — mimic real speech: bursts of energy with gaps between syllables
  const barCount = 60;
  const waveBars = Array.from({ length: barCount }, (_, i) => {
    const t = i / barCount;
    const syllables = [[0.02, 0.12], [0.15, 0.28], [0.32, 0.42], [0.45, 0.58], [0.62, 0.78], [0.82, 0.95]];
    let env = 0.03;
    for (const [s, e] of syllables) {
      if (t >= s && t <= e) {
        const mid = (s + e) / 2;
        const halfW = (e - s) / 2;
        env = 0.85 * (1 - ((t - mid) / halfW) ** 2) + 0.05;
        break;
      }
    }
    return env * (0.6 + seed(i * 7) * 0.4);
  });

  const vocoders = [
    { name: "HiFi-GAN", speed: 90, quality: 95, note: "Most widely used" },
    { name: "WaveGlow", speed: 60, quality: 90, note: "Smooth output" },
    { name: "WaveRNN", speed: 70, quality: 80, note: "Lightweight" },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.dim, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Spectrogram</div>
          <img src="/images/melspec.png" alt="Spectrogram" style={{ width: "100%", height: 120, objectFit: "cover", objectPosition: "top", borderRadius: 4, border: `1px solid ${C.border}` }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, padding: "0 4px" }}>
          <div style={{ background: `${C.primary}20`, border: `1px solid ${C.primary}44`, borderRadius: 8, padding: "6px 12px", fontSize: 11, color: C.accent, fontWeight: 700 }}>Vocoder</div>
          <ArrowRightIcon style={{ width: 20, height: 20, color: C.accent, marginTop: 4 }} />
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.dim, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Waveform</div>
          <div style={{ width: "100%", height: 120, borderRadius: 4, border: `1px solid ${C.border}`, background: "#08060f", display: "flex", alignItems: "center", justifyContent: "center", gap: 1, padding: "0 4px" }}>
            {waveBars.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <div style={{ width: "100%", height: Math.round(v * 50), borderRadius: 1, background: `${C.accent}${Math.round(60 + v * 40).toString(16)}` }} />
                <div style={{ width: "100%", height: Math.round(v * 50), borderRadius: 1, background: `${C.accent}${Math.round(60 + v * 40).toString(16)}` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {vocoders.map((v, i) => (
          <div key={i} style={{ background: "#06040c", border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>{v.name}</div>
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.dim, marginBottom: 2 }}><span>Speed</span><span>{v.speed}%</span></div>
              <div style={{ height: 4, borderRadius: 2, background: C.border }}><div style={{ height: 4, borderRadius: 2, background: C.accent, width: `${v.speed}%` }} /></div>
            </div>
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.dim, marginBottom: 2 }}><span>Quality</span><span>{v.quality}%</span></div>
              <div style={{ height: 4, borderRadius: 2, background: C.border }}><div style={{ height: 4, borderRadius: 2, background: C.secondary, width: `${v.quality}%` }} /></div>
            </div>
            <div style={{ fontSize: 11, color: C.dim, fontStyle: "italic" }}>{v.note}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: C.dim, marginTop: 8, textAlign: "center" }}>You don't pick a vocoder yourself — it's built into the TTS tool (e.g. Coqui TTS uses HiFi-GAN automatically)</div>
    </div>
  );
};

const AI_FLOW_DETAILS = {
  TTS: [
    { title: "Text Input", detail: "Raw text is fed into the system. This can be anything — a script, a sentence, or even a single word.", example: '"Hello, this is your bank calling about your account."' },
    { title: "Phoneme Conversion", detail: "Text is converted into phonemes — the distinct units of sound in a language. This step handles pronunciation, abbreviations, and numbers.", example: "HH AH L OW / DH IH S / IH Z / Y AO R / B AE NG K / K AO L IH NG ...", footnote: <>Most English TTS models use the <a href="https://en.wikipedia.org/wiki/ARPABET" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>ARPAbet phoneme</a> set.</> },
    { title: "Voice Model", detail: "The neural network applies the cloned voice's characteristics — pitch, timbre, speaking style — to the phoneme sequence. Think of it like a voice filter: the phonemes say WHAT to speak, and the voice model says HOW to speak it — matching the target person's unique sound. This is the step where fine-tuned vs. zero-shot matters most.", example: "How the voice model learns the target voice:\n\nFine-tuned: The model is trained on 10-30 min of the\ntarget's audio over hours of GPU time. This bakes the\nvoice deeply into the model. Highest quality.\n\nZero-shot: A pre-trained speaker encoder extracts a\nvoice embedding from just 3-10 seconds of audio.\nNo training needed — a voicemail greeting is enough.\nFaster but lower quality.\n\nModel architectures:\n\nAutoregressive (Coqui TTS, Tortoise)\n  One frame at a time — high quality, slower\n\nDiffusion (Grad-TTS, NaturalSpeech)\n  Refines noise into speech — great quality\n\nNon-autoregressive (FastSpeech, StyleTTS2)\n  All frames in parallel — very fast" },
    { title: "Mel Spectrogram", detail: "Most models output a mel spectrogram — a visual representation of the audio's frequency content over time. Think of it as a detailed blueprint for the sound. Each row is a frequency band (low at bottom, high at top) and each column is a moment in time. Brighter colors mean more energy at that frequency. Some newer models (VALL-E, Bark) use discrete audio tokens instead, and end-to-end models like VITS skip this step entirely and generate waveforms directly.", exampleComponent: "melspec" , exampleCaption: <><div>Spectrogram generated from a speech recording using SoX — horizontal bands are harmonics, bright regions show where vocal energy concentrates.</div><div style={{ marginTop: 4 }}>A true mel spectrogram compresses the upper frequencies to match human hearing perception.</div></> },
    { title: "Vocoder", detail: "The previous step created a blueprint (the spectrogram) — but you can't play a blueprint through a speaker. The vocoder's job is to turn that blueprint into actual sound waves. Think of it like a 3D printer for audio: it takes the visual plan and builds the real thing, sample by sample, 22,050 times per second.", exampleComponent: "vocoder" },
    { title: "Audio Output", detail: "The final waveform is saved as an audio file. At this point it sounds like the cloned voice speaking the input text. With fine-tuned models this takes minutes of generation time; with zero-shot, the entire process from reference clip to output can take under a minute.", exampleComponent: "tts-audio" },
  ],
  "Voice Conversion": [
    { title: "Source Audio", detail: "You start with a recording of someone speaking — this could be your own voice, or any audio clip. The key thing is that the words, timing, rhythm, and emotion in this recording will all be preserved in the final output. Only the voice identity changes.", example: "Think of it like lip-syncing in reverse: you provide the\nperformance (what to say and how to say it), and the\nmodel swaps in a different voice.\n\nSource: You recording yourself saying\n\"I need to verify your account details.\"\n\nThe words, pacing, and emotion stay — only the voice changes." },
    { title: "Feature Extraction", detail: "The system analyzes the source audio and pulls out everything about how the words are spoken — but strips away who is speaking. It separates the content (what was said) from the identity (who said it). This is the critical step that makes voice conversion possible.", example: "What gets extracted:\n\n• Pitch contour — the melody of the speech (rising for questions, etc.)\n• Phoneme timing — how long each sound lasts\n• Energy envelope — which words are louder/softer\n• Speaking rate — pauses, rhythm, speed\n\nWhat gets discarded:\n\n• Speaker identity (timbre, vocal tract shape)\n• Voice-specific resonance characteristics" },
    { title: "Speaker Embedding", detail: "The target voice's identity is loaded in as a speaker embedding — the same kind of numerical vector we covered in the Speaker Embeddings section. This is where fine-tuned vs. zero-shot matters most for voice conversion.", example: "The embedding acts like a voice \"skin\" that gets\napplied to the extracted features:\n\nSource features (what to say + how to say it)\n  + Target embedding (whose voice to use)\n  = Instructions for the conversion model\n\nFine-tuned (RVC, so-vits-svc):\n  Built from 10-30 min of clean training audio\n  Hours of GPU training\n  Highest quality, near-perfect clones\n\nZero-shot (OpenVoice, FreeVC):\n  Extracted from just 3-10 seconds of audio\n  No training needed — a voicemail is enough\n  Lower quality but instant and dangerous" },
    { title: "Conversion Model", detail: "The neural network takes the extracted features (content + style) and the target speaker embedding (identity) and generates a new spectrogram that sounds like the target speaker performing the source speech. This is where the actual voice swap happens.", example: "Different tools approach this differently:\n\nRVC — uses a retrieval-based approach, finding the\nclosest matching voice segments from training data\nand blending them. Very high quality, real-time capable.\n\nso-vits-svc — combines a variational autoencoder\nwith a vocoder for singing voice conversion.\n\nFreeVC — text-free approach that works without\ntranscription, making it language-agnostic." },
    { title: "Vocoder", detail: "Just like in TTS, the vocoder converts the generated spectrogram into an actual audio waveform you can hear. Most voice conversion tools use HiFi-GAN for this step. The vocoder doesn't change the voice — it just turns the blueprint into playable sound.", exampleComponent: "vocoder" },
    { title: "Target Audio", detail: "The final output sounds like the target speaker saying the exact same words, with the same emotion, timing, and rhythm as the original source recording. Only the voice identity has changed — everything else is preserved from the source.", example: "What stayed the same:\n• Words and pronunciation\n• Emotional tone and emphasis\n• Speaking speed and pauses\n• Rhythm and cadence\n\nWhat changed:\n• Voice identity (timbre, resonance, vocal texture)\n\nWith zero-shot, the full attack chain takes under\na minute — find a 5s clip, extract embedding,\nrecord yourself speaking, convert. With fine-tuned\nmodels like RVC, quality is near-perfect but\nrequires hours of preparation.\n\nThe result is convincing because all the natural\nvariations in human speech are preserved — only\nthe \"who\" has been swapped." },
  ],
};

const AISection = () => {
  const [archIdx, setArchIdx] = useState(0);
  const [flowStep, setFlowStep] = useState(0);
  const archs = [
    { name: "TTS", desc: "Text-to-speech with cloned voice. Learns characteristics from samples, generates from any text.", flow: [{ icon: "document", label: "Text" }, { icon: "variable", label: "Phonemes" }, { icon: "cpu", label: "Voice Model" }, { icon: "chart-bar", label: "Mel Spec" }, { icon: "speaker-wave", label: "Vocoder" }, { icon: "headphones", label: "Audio" }], tools: [
      { name: "Coqui TTS", url: "https://github.com/coqui-ai/TTS", tag: "both" },
      { name: "Bark", url: "https://github.com/suno-ai/bark", tag: "zero-shot" },
      { name: "Tortoise", url: "https://github.com/neonbjb/tortoise-tts", tag: "fine-tuned" },
      { name: "Piper", url: "https://github.com/OHF-Voice/piper1-gpl", tag: "fine-tuned" },
      { name: "StyleTTS2", url: "https://github.com/yl4579/StyleTTS2", tag: "fine-tuned" },
      { name: "MetaVoice", url: "https://github.com/metavoiceio/metavoice-src", tag: "zero-shot" },
      { name: "Qwen3-TTS", url: "https://github.com/QwenLM/Qwen3-TTS", tag: "both" },
    ] },
    { name: "Voice Conversion", desc: "Converts one speaker's speech to sound like another, preserving words and emotion.", flow: [{ icon: "microphone", label: "Source" }, { icon: "chart-bar", label: "Features" }, { icon: "arrows-right-left", label: "Embed" }, { icon: "cpu", label: "Convert" }, { icon: "speaker-wave", label: "Vocoder" }, { icon: "headphones", label: "Target" }], tools: [
      { name: "RVC", url: "https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI", tag: "fine-tuned" },
      { name: "so-vits-svc", url: "https://github.com/svc-develop-team/so-vits-svc", tag: "fine-tuned" },
      { name: "FreeVC", url: "https://github.com/OlaWod/FreeVC", tag: "zero-shot" },
      { name: "OpenVoice", url: "https://github.com/myshell-ai/OpenVoice", tag: "zero-shot" },
    ] },
  ];
  const currentArch = archs[archIdx];
  const flowDetails = AI_FLOW_DETAILS[currentArch.name];
  const activeDetail = flowStep >= 0 && flowStep < flowDetails.length ? flowDetails[flowStep] : null;
  return (<div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>AI Voice Cloning</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>Modern neural networks clone a voice from minutes — or seconds — of audio.</p>

    <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Non-AI Powered TTS</h3>
    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>Before AI-based TTS, rule-based synthesizers used formant models and pre-recorded phoneme snippets to generate speech. They sound robotic and can't clone voices, but they're lightweight, fast, and require no GPU or training data. These tools are useful as a baseline to compare against AI-generated speech.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>eSpeak NG</div>
            <a href="https://github.com/espeak-ng/espeak-ng" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.accent, textDecoration: "none" }}>GitHub ↗</a>
          </div>
          <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>Formant-based synthesizer supporting 100+ languages. Robotic but extremely fast and runs anywhere.</p>
          <CodeBlock code={'# Preinstalled on Call Center Village laptops\n# sudo apt install espeak-ng\n\n# Generate speech to audio file\nespeak-ng "Hello, this is your bank calling" -w output.wav\n\n# Change voice/language (Spanish)\nespeak-ng -v es "Gracias" -w output.wav\n\n# List available voices\nespeak-ng --voices'} language="bash" />
        </div>
        <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Festival</div>
            <a href="http://www.cstr.ed.ac.uk/projects/festival/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.accent, textDecoration: "none" }}>Project Page ↗</a>
          </div>
          <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>Unit-selection synthesizer from University of Edinburgh. Uses pre-recorded speech snippets stitched together — more natural than formant synthesis.</p>
          <CodeBlock code={'# Preinstalled on Call Center Village laptops\n# sudo apt install festival\n\n# Save speech to audio file\necho "Hello, this is your bank calling" | text2wave > output.wav\n\n# Play speech interactively\n# Must be run in a GUI session\necho "Hello, this is your bank calling" | festival --tts'} language="bash" />
        </div>
      </div>
      <p style={{ fontSize: 12, color: C.dim, lineHeight: 1.6, marginTop: 12, fontStyle: "italic" }}>Compare the output of these tools to the AI-generated TTS example later on this page — the difference in quality is what makes AI voice cloning such a powerful (and dangerous) technology.</p>
    </div>

    <SectionDivider />
    <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>AI-Powered TTS and Voice Conversion</h3>
    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>Unlike the rule-based tools above, these use neural networks to generate human-sounding speech — and can clone specific voices.</p>
    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      {archs.map((a, i) => <button key={i} onClick={() => { setArchIdx(i); setFlowStep(0); }} style={{ flex: 1, background: i === archIdx ? `${C.primary}15` : C.card, border: `1px solid ${i === archIdx ? C.secondary : C.border}`, borderRadius: 10, padding: "12px 8px", color: i === archIdx ? C.accent : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, textAlign: "center" }}>{a.name}</button>)}
    </div>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
      <div style={{ fontSize: 14, color: C.text, fontWeight: 600, marginBottom: 6 }}>{currentArch.name === "TTS" ? "How TTS Cloning Works" : "How Voice Conversion Differs from TTS"}</div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: "0 0 12px" }}>{
        currentArch.name === "TTS"
          ? "Text-to-speech cloning takes typed text and generates audio that sounds like a specific person. You provide the words, and the AI handles everything else — pronunciation, rhythm, and vocal style. The output is entirely AI-generated; there is no original human recording being modified."
          : "Unlike TTS, voice conversion starts with an actual human recording. Instead of generating speech from text, it takes an existing recording and swaps the speaker's identity while keeping everything else intact — the words, emotion, pacing, and rhythm all stay exactly as they were. Think of it as a real-time voice filter: you speak naturally, and the output sounds like someone else said it. This makes it especially powerful because the natural human speech patterns (hesitations, emphasis, breathing) are preserved, which is much harder to detect as fake."
      }</p>
      <div style={{ fontSize: 13, color: C.text, fontWeight: 600, marginBottom: 6 }}>Fine-tuned vs. Zero-shot</div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: "0 0 10px" }}>{currentArch.name === "TTS"
        ? "Both approaches use the same pipeline below, but differ in how the voice model learns the target voice:"
        : "Both approaches use the same pipeline below, but differ in how the speaker embedding is created:"
      }</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: C.codeBg, borderRadius: 8, padding: 12, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, marginBottom: 4 }}>Fine-tuned</div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>Requires 10-30 min of clean audio and hours of GPU training. Produces the highest quality clones.</div>
        </div>
        <div style={{ background: C.codeBg, borderRadius: 8, padding: 12, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.tertiary, marginBottom: 4 }}>Zero-shot</div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>Needs just 3-10 seconds of audio, no training at all. Lower quality, but fast and dangerous — a voicemail or YouTube clip is enough.</div>
        </div>
      </div>
    </div>
    <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 16 }}>
      <div style={{ fontSize: 12, color: C.dim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Example {currentArch.name} Tools</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 0, alignItems: "start" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Fine-tuned</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
            {currentArch.tools.filter(t => t.tag === "fine-tuned").map((t, i) => (
              <a key={i} href={t.url} target="_blank" rel="noopener noreferrer" style={{ background: `${C.primary}15`, border: `1px solid ${C.primary}33`, borderRadius: 6, padding: "4px 12px", fontSize: 13, color: C.accent, fontWeight: 600, textDecoration: "none", transition: "all 0.2s ease" }} onMouseEnter={e => { e.currentTarget.style.background = `${C.primary}30`; e.currentTarget.style.borderColor = C.accent; }} onMouseLeave={e => { e.currentTarget.style.background = `${C.primary}15`; e.currentTarget.style.borderColor = `${C.primary}33`; }}>{t.name} ↗</a>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 12px" }}>
          <div style={{ fontSize: 11, color: C.dim, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Both</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
            {currentArch.tools.filter(t => t.tag === "both").map((t, i) => (
              <a key={i} href={t.url} target="_blank" rel="noopener noreferrer" style={{ background: `${C.secondary}20`, border: `1px solid ${C.secondary}44`, borderRadius: 6, padding: "4px 12px", fontSize: 13, color: C.accent, fontWeight: 600, textDecoration: "none", transition: "all 0.2s ease" }} onMouseEnter={e => { e.currentTarget.style.background = `${C.secondary}40`; e.currentTarget.style.borderColor = C.accent; }} onMouseLeave={e => { e.currentTarget.style.background = `${C.secondary}20`; e.currentTarget.style.borderColor = `${C.secondary}44`; }}>{t.name} ↗</a>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.tertiary, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Zero-shot</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
            {currentArch.tools.filter(t => t.tag === "zero-shot").map((t, i) => (
              <a key={i} href={t.url} target="_blank" rel="noopener noreferrer" style={{ background: `${C.tertiary}15`, border: `1px solid ${C.tertiary}33`, borderRadius: 6, padding: "4px 12px", fontSize: 13, color: C.tertiary, fontWeight: 600, textDecoration: "none", transition: "all 0.2s ease" }} onMouseEnter={e => { e.currentTarget.style.background = `${C.tertiary}30`; e.currentTarget.style.borderColor = C.tertiary; }} onMouseLeave={e => { e.currentTarget.style.background = `${C.tertiary}15`; e.currentTarget.style.borderColor = `${C.tertiary}33`; }}>{t.name} ↗</a>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div style={{ background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${C.border}`, marginBottom: 20 }}>
      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>{currentArch.desc}</div>
      <p style={{ fontSize: 12, color: C.dim, marginBottom: 4 }}>Click a step to learn more:</p>
      <PipelineDiagram steps={currentArch.flow} activeStep={flowStep} onStepClick={i => setFlowStep(flowStep === i ? -1 : i)} />
      {activeDetail && activeDetail.exampleComponent !== "tts-audio" && (
        <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginTop: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 6 }}>{activeDetail.title}</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 10 }}>{activeDetail.detail}</div>
          <div style={{ background: `${C.primary}10`, border: `1px solid ${C.primary}33`, borderRadius: 6, padding: 10 }}>
            <div style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Example</div>
            {activeDetail.exampleComponent === "vocoder" ? <VocoderViz /> : activeDetail.exampleComponent === "melspec" ? <div>
              <CodeBlock code={'# Generate a spectrogram from your audio file\n# SoX produces a linear spectrogram\n# similar to a mel spectrogram, but with an evenly spaced frequency axis\nsox input.wav -n spectrogram -o spectrogram.png\n\n# View the spectrogram in the terminal\nimg2txt spectrogram.png'} language="bash" />
              <img src="/images/melspec.png" alt="Mel spectrogram of speech" style={{ width: "100%", borderRadius: 4, border: `1px solid ${C.border}`, marginTop: 10 }} />
              {activeDetail.exampleCaption && <div style={{ fontSize: 11, color: C.dim, marginTop: 6, lineHeight: 1.5, textAlign: "center" }}>{activeDetail.exampleCaption}</div>}
            </div> : <div style={{ fontSize: 13, color: C.text, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{activeDetail.example}</div>}
          </div>
          {activeDetail.footnote && <div style={{ marginTop: 10, fontSize: 12, color: C.dim, lineHeight: 1.6 }}>{activeDetail.footnote}</div>}
        </div>
      )}
      {activeDetail && activeDetail.exampleComponent === "tts-audio" && <>
        <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginTop: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 6 }}>AI-generated TTS</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 10 }}>{activeDetail.detail}</div>
          <div style={{ fontSize: 13, color: C.muted, fontStyle: "italic", marginBottom: 10 }}>"Hello, this is your bank calling about your account."</div>
          <audio controls style={{ width: "100%" }} src="/audio/tts-example.mp3" />
        </div>
        <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginTop: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 6 }}>eSpeak NG (non-AI)</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 10 }}>Same phrase generated by a rule-based synthesizer for comparison.</div>
          <audio controls style={{ width: "100%" }} src="/audio/espeak-compare.wav" />
        </div>
      </>}
    </div>
    <SectionDivider />
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", fontSize: 15, fontWeight: 600, color: C.text, display: "flex", alignItems: "center" }}><Icon name="chart-bar" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Quality vs. Effort</div>
      <div style={{ padding: "0 20px 20px", color: C.muted, fontSize: 14, lineHeight: 1.8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>{["Method", "Audio", "Compute", "Quality", "Real-Time"].map(h => <th key={h} style={{ padding: 8, textAlign: "left", color: C.accent, fontWeight: 700 }}>{h}</th>)}</tr></thead>
          <tbody>{[["eSpeak NG / Festival", "None", "None", 1, "Yes"], ["TTS (zero-shot)", "3-10s", "Medium", 3, "Sometimes"], ["TTS (fine-tuned)", "5-30min", "High", 4, "No"], ["VC (zero-shot)", "3-10s", "Medium", 3, "Yes"], ["VC (fine-tuned / RVC)", "10-30min", "High", 5, "Yes*"], ["Commercial API", "10-30s", "None", 4, "Yes"]].map((row, i) => <tr key={i} onMouseEnter={e => e.currentTarget.style.background = `${C.primary}10`} onMouseLeave={e => e.currentTarget.style.background = "transparent"} style={{ borderBottom: "1px solid #06040c", transition: "background 0.15s ease", cursor: "default" }}>{row.map((cell, j) => <td key={j} style={{ padding: 8, color: j === 0 ? C.text : C.muted }}>{j === 3 ? Array.from({ length: cell }, (_, k) => <Icon key={k} name="star" size={14} style={{ display: "inline-block", color: C.accent }} />) : cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
    <SectionDivider />
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", fontSize: 15, fontWeight: 600, color: C.text, display: "flex", alignItems: "center" }}><Icon name="fingerprint" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Speaker Embeddings</div>
      <div style={{ padding: "0 20px 20px", color: C.muted, fontSize: 14, lineHeight: 1.8 }}>
        <p>A 256-512 dimension vector capturing what makes a voice unique — a mathematical fingerprint.</p>
        <div style={{ margin: "12px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Pitch Range", "Formants", "Breathiness", "Vibrato", "Pace", "Nasality", "...256+ dims"].map((d, i) => <span key={i} style={{ background: "#06040c", border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", fontSize: 13, color: i === 6 ? C.dim : C.accent }}>{d}</span>)}
        </div>
        <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginTop: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>What does this actually look like?</div>
          <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.7 }}>A <strong style={{ color: C.text }}>dimension</strong> (dim) is a single measurement of a voice characteristic. A <strong style={{ color: C.text }}>vector</strong> is just a list of these measurements — like a row of numbers that together describe a voice.</p>
          <p style={{ margin: "0 0 12px", fontSize: 13, lineHeight: 1.7 }}>Each dimension is a number (usually between -1 and 1) representing how much of that characteristic the voice has. For example:</p>
          <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap", color: C.text }}>
            <div><span style={{ color: C.dim }}>dim 1 (pitch range):</span>  <span style={{ color: C.accent }}>0.72</span>  <span style={{ color: C.dim }}>← wide pitch variation</span></div>
            <div><span style={{ color: C.dim }}>dim 2 (breathiness):</span>  <span style={{ color: C.accent }}>-0.15</span> <span style={{ color: C.dim }}>← not very breathy</span></div>
            <div><span style={{ color: C.dim }}>dim 3 (nasality):</span>    <span style={{ color: C.accent }}>0.41</span>  <span style={{ color: C.dim }}>← somewhat nasal</span></div>
            <div><span style={{ color: C.dim }}>dim 4 (pace):</span>        <span style={{ color: C.accent }}>-0.63</span> <span style={{ color: C.dim }}>← slower speaker</span></div>
            <div><span style={{ color: C.dim }}>...256 more dimensions</span></div>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 13, lineHeight: 1.7 }}>The full vector — all 256+ numbers together — is the voice's unique fingerprint. In code, it's just an array of numbers:</p>
          <div style={{ background: `${C.primary}10`, border: `1px solid ${C.primary}33`, borderRadius: 6, padding: 10, marginTop: 8, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 12, lineHeight: 1.6, color: C.text, whiteSpace: "pre-wrap" }}>
            <span style={{ color: C.dim }}>// Speaker embedding for "Patrick's voice"</span>{"\n"}
            <span style={{ color: C.accent }}>speaker_vector</span> = [{"\n"}
            {"  "}<span style={{ color: C.text }}>0.72, -0.15, 0.41, -0.63, 0.28, 0.89, -0.44, 0.17,</span>{"\n"}
            {"  "}<span style={{ color: C.text }}>0.55, -0.31, 0.08, 0.93, -0.72, 0.36, -0.19, 0.61,</span>{"\n"}
            {"  "}<span style={{ color: C.dim }}>...  // additional dimensions</span>{"\n"}
            {"  "}<span style={{ color: C.text }}>0.47, -0.05, 0.33, -0.28, 0.14, 0.82, -0.51, 0.69</span>{"\n"}
            ]
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 13, lineHeight: 1.7 }}>Two voices with similar vectors will sound alike. The AI compares and manipulates these vectors to clone a voice.</p>
          <p style={{ margin: "10px 0 0", fontSize: 12, color: C.dim, lineHeight: 1.7 }}>The number of dimensions (256, 512, etc.) is a design choice by the model's creators — not a fixed rule. More dimensions can capture finer details but cost more compute. 256 is common because it's proven to be "enough" for most voice cloning tasks. Also, the individual dimensions don't map neatly to concepts like "breathiness" or "pitch" — the model learns its own abstract representations during training. The labels above are simplified for illustration.</p>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", marginBottom: 8 }}>
            <Icon name="magnifying-glass" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Vector Databases & Voice Lookup
          </div>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 8 }}>These dimensions can be stored and searched in vector databases, which find similar voices by comparing the mathematical distance between embeddings. This is how systems can take an unknown voice and quickly match it against thousands of known voiceprints.</p>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>To learn more about how this works, see <a href="https://en.wikipedia.org/wiki/Nearest_neighbor_search" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>nearest neighbor search</a> and <a href="https://en.wikipedia.org/wiki/Vector_database" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>vector databases</a>.</p>
        </div>
      </div>
    </div>
    <SectionDivider />
    <QuizBank questions={[
      { question: "Which produces the highest quality voice clone?", options: ["Zero-shot from 5s", "RVC fine-tuned on 20min clean audio", "Pitch shifting with SoX", "Commercial API with 10s"], correctIndex: 1, explanation: "RVC fine-tuned on sufficient clean data produces the highest quality clone." },
      { question: "What is a speaker embedding?", options: ["A hidden microphone", "A numerical vector of unique voice characteristics", "An audio format", "A steganography technique"], correctIndex: 1, explanation: "Speaker embeddings are high-dimensional vectors that mathematically represent what makes a voice unique." },
      { question: "Why is zero-shot cloning considered the biggest threat to phone security?", options: ["It produces perfect quality", "It requires no training and works from a brief voicemail or public clip", "It's undetectable", "It's free"], correctIndex: 1, explanation: "Zero-shot cloning needs just seconds of audio — a voicemail greeting, a YouTube clip, or a conference recording. No training, no GPU, minimal effort." },
      { question: "What is the main limitation of non-AI TTS tools like eSpeak NG and Festival?", options: ["They can't generate speech from text", "They produce robotic-sounding speech and can't clone voices", "They require a GPU to run", "They only support English"], correctIndex: 1, explanation: "Rule-based synthesizers like eSpeak NG and Festival generate speech using formant models or pre-recorded snippets — fast and lightweight, but they sound robotic and have no ability to mimic a specific person's voice." },
    ]} />
  </div>);
};

const LocalToolsSection = () => (<div>
  <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Local AI Tools</h2>
  <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>Run everything locally — no cloud, no API keys, no data leaving your machine.</p>
  <ToolComparison tools={[
    { name: "Coqui TTS", desc: "Open-source TTS with zero-shot cloning via XTTS v2 model. 16+ languages.", pros: ["Zero-shot", "Multi-language", "Fine-tunable"], cons: ["Coqui shut down (community forks active)", "GPU recommended"], install: `# Preinstalled on Call Center Village laptops\n# pip install coqui-tts\n\ntts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n    --speaker_wav sample.wav --language_idx en \\\n    --text "Cloned voice output." --out_path output.wav` },
    { name: "Piper TTS", desc: "Neural TTS for edge devices. Runs on Raspberry Pi.", pros: ["Runs anywhere", "Super fast", "Many voices"], cons: ["Not zero-shot", "Training needed"], install: `# Preinstalled on Call Center Village laptops\n# pip install piper-tts\n\necho "Hello" | piper --model en_US-lessac-medium.onnx --output_file out.wav` },
    { name: "RVC", desc: "Voice conversion. Real-time on consumer GPUs. Huge community.", pros: ["Best VC quality", "Real-time", "Large community"], cons: ["Complex setup", "GPU required"], install: `# Preinstalled on Call Center Village laptops\n# git clone https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI\n# pip install -r requirements.txt\n\n# Launch the RVC web interface\npython infer-web.py\n\n# Open LibreWolf and navigate to the URL shown in the terminal\n# (typically http://localhost:7865)` },
    { name: "OpenVoice", desc: "Instant cloning with tone/emotion control. MIT license.", pros: ["Fast", "Emotion control", "Lightweight"], cons: ["Best quality in English", "Less natural"], install: `# Preinstalled on Call Center Village laptops\n# git clone https://github.com/myshell-ai/OpenVoice\n# cd OpenVoice && pip install -e .\n\n# Clone a voice from a reference clip (zero-shot)\npython -m openvoice_cli single \\\n    -i input.wav \\\n    -r reference_voice.wav \\\n    -o output.wav\n\n# Batch process a folder of audio files\npython -m openvoice_cli batch \\\n    -id ./input_folder \\\n    -rf ./reference_voice.wav \\\n    -od ./output_folder` },
  ]} />
  <SectionDivider />
  <div>
    <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Clone a Voice in 5 Minutes</h3>
    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>Record a voice sample, feed it to Coqui TTS, and hear the clone. Read the script below to capture a wide range of phonemes and vocal characteristics in a single recording.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 8 }}>Recording Script</div>
      <p style={{ fontSize: 12, color: C.dim, marginBottom: 8 }}>Read this aloud at a natural pace. It covers all major English phonemes, varied intonation, and different mouth shapes.</p>
      <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20, fontSize: 17, color: C.text, lineHeight: 2, letterSpacing: 0.2 }}>
        "The quick brown fox jumps gracefully over a lazy dog sleeping beneath the old oak tree. She sells thick, fresh seashells down by the shimmering seashore every Thursday morning. Would you kindly confirm your date of birth and the last four digits of your account number? I wasn't sure if the package arrived yesterday or if it's expected tomorrow — could you please check on that for me? Absolutely, I'd be happy to transfer you to our billing department right away. Thank you so much for your patience, and have a wonderful evening!"
      </div>
    </div>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12, marginTop: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>Commands</div>
      <CodeBlock language="bash" code={`# Preinstalled on Call Center Village laptops\n# pip install coqui-tts\n\n# Step 1: Record yourself reading the script above (~20 seconds)\n# You can also use Audacity: Record → File → Export Audio → save as sample.wav\nrec -r 44100 -c 1 sample.wav trim 0 20\n\n# Step 2: Generate a clone from your recording\ntts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n    --speaker_wav sample.wav --language_idx en \\\n    --text "I can say anything in this voice." \\\n    --out_path cloned.wav\n\n# Step 3: Listen to the result\naplay cloned.wav`} />
    </div>
    <SectionDivider />
    <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Supporting Tools: whisper.cpp & llama.cpp</h3>
    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>These tools complete the local voice attack pipeline. whisper.cpp handles speech-to-text (transcribing what someone says), and llama.cpp runs a local LLM to generate realistic dialogue for a cloned voice. Combined with a TTS or VC tool, you have a fully local pipeline with zero cloud dependency.</p>

    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, marginBottom: 6 }}>whisper.cpp</div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>Local speech-to-text powered by OpenAI's Whisper model, compiled to run efficiently on CPU. Transcribe audio files, extract text from recordings for re-synthesis, or analyze call recordings — all offline.</p>
      <CodeBlock language="bash" code={`# whisper.cpp is installed at /opt/whisper.cpp\ncd /opt/whisper.cpp\n\n# Transcribe an audio file (using the tiny model for speed on i3)\n./build/bin/whisper-cli -m models/ggml-tiny.en.bin -f ~/callcentervillage/voice-cloning/input.wav\n\n# Transcribe with timestamps\n./build/bin/whisper-cli -m models/ggml-tiny.en.bin -f ~/callcentervillage/voice-cloning/input.wav -otxt\n\n# Output as SRT subtitles\n./build/bin/whisper-cli -m models/ggml-tiny.en.bin -f ~/callcentervillage/voice-cloning/input.wav -osrt\n\n# Use the small model for better accuracy (slower)\n./build/bin/whisper-cli -m models/ggml-small.en.bin -f ~/callcentervillage/voice-cloning/input.wav`} />
      <p style={{ fontSize: 12, color: C.dim, marginTop: 10, marginBottom: 12, lineHeight: 1.6 }}>The <strong style={{ color: C.muted }}>tiny</strong> model is fastest and works well on low-powered hardware. Use <strong style={{ color: C.muted }}>small</strong> for better accuracy if you can wait a bit longer. Models ending in <strong style={{ color: C.muted }}>.en</strong> are English-only and slightly more accurate for English.</p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>{["Model", "Size", "Memory", "Speed", "Accuracy"].map(h => <th key={h} style={{ padding: 8, textAlign: "left", color: C.accent, fontWeight: 700 }}>{h}</th>)}</tr></thead>
        <tbody>{[
          ["tiny / tiny.en", "75 MB", "~390 MB", "★★★★★", "★★☆☆☆"],
          ["base / base.en", "142 MB", "~500 MB", "★★★★☆", "★★★☆☆"],
          ["small / small.en", "466 MB", "~1.0 GB", "★★★☆☆", "★★★★☆"],
          ["medium / medium.en", "1.5 GB", "~2.6 GB", "★★☆☆☆", "★★★★☆"],
          ["large-v3", "2.9 GB", "~4.7 GB", "★☆☆☆☆", "★★★★★"],
        ].map((row, i) => <tr key={i} onMouseEnter={e => e.currentTarget.style.background = `${C.primary}10`} onMouseLeave={e => e.currentTarget.style.background = "transparent"} style={{ borderBottom: "1px solid #06040c", transition: "background 0.15s ease" }}>{row.map((cell, j) => <td key={j} style={{ padding: 8, color: j === 0 ? C.text : C.muted }}>{cell}</td>)}</tr>)}</tbody>
      </table>
      <p style={{ fontSize: 11, color: C.dim, marginTop: 8 }}>For these laptops, <strong style={{ color: C.muted }}>tiny</strong> or <strong style={{ color: C.muted }}>base</strong> are recommended. See all available models at <a href="https://huggingface.co/ggerganov/whisper.cpp" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>huggingface.co/ggerganov/whisper.cpp</a>.</p>
    </div>

    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12, marginTop: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, marginBottom: 6 }}>llama.cpp</div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>Run large language models locally on CPU. Generate realistic call scripts, social engineering dialogue, or conversational responses — all without sending data to the cloud. Perfect for generating text that a cloned voice can speak.</p>
      <CodeBlock language="bash" code={`# llama.cpp is installed at /opt/llama.cpp\ncd /opt/llama.cpp\n\n# Generate a simple response (using a small quantized model for i3)\n./llama-cli -m models/tinyllama-1.1b-chat.Q4_K_M.gguf \\\n    -p "Write a short phone script where a bank employee asks a customer to verify their identity." \\\n    -n 150\n\n# Interactive chat mode\n./llama-cli -m models/tinyllama-1.1b-chat.Q4_K_M.gguf \\\n    --interactive \\\n    -p "You are a call center agent. Respond naturally to the customer."\n\n# Generate text and save to file (for feeding into TTS)\n./llama-cli -m models/tinyllama-1.1b-chat.Q4_K_M.gguf \\\n    -p "Write a convincing voicemail message from a bank about suspicious activity." \\\n    -n 100 > ~/callcentervillage/voice-cloning/script.txt`} />
      <p style={{ fontSize: 12, color: C.dim, marginTop: 10, lineHeight: 1.6 }}>Smaller quantized models (Q4_K_M) run best on limited hardware. The output won't match GPT-4, but it's enough to generate realistic scripts entirely offline.</p>
    </div>

    <SectionDivider />
    <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Putting It All Together</h3>
    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>These tools chain together to build fully local voice cloning pipelines — no internet connection required. Here are two realistic scenarios:</p>

    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, marginBottom: 6 }}>Scenario A: Clone a voice and put words in their mouth</div>
      <p style={{ fontSize: 12, color: C.dim, marginBottom: 8 }}>You have a voice sample of someone. Generate a script and make it sound like they said it.</p>
      <CodeBlock language="bash" code={`# 1. Record or obtain a voice sample of the target\n# (You can also use Audacity to record)\nrec -r 44100 -c 1 ~/callcentervillage/voice-cloning/target_voice.wav trim 0 20\n\n# 2. Generate a script with llama.cpp\ncd /opt/llama.cpp\n./llama-cli -m models/tinyllama-1.1b-chat.Q4_K_M.gguf \\\n    -p "Write a short voicemail about a package delivery." \\\n    -n 80 > ~/callcentervillage/voice-cloning/script.txt\n\n# 3. Clone the voice with the generated script\ntts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n    --speaker_wav ~/callcentervillage/voice-cloning/target_voice.wav \\\n    --language_idx en \\\n    --text "$(cat ~/callcentervillage/voice-cloning/script.txt)" \\\n    --out_path ~/callcentervillage/voice-cloning/cloned_output.wav`} />
    </div>

    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12, marginTop: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, marginBottom: 6 }}>Scenario B: Intercept, understand, and respond as someone</div>
      <p style={{ fontSize: 12, color: C.dim, marginBottom: 8 }}>You have a recording of a conversation. Transcribe it, generate a contextual follow-up, and deliver it in the original speaker's voice.</p>
      <CodeBlock language="bash" code={`# 1. Transcribe the recording to understand what was said\ncd /opt/whisper.cpp\n./build/bin/whisper-cli -m models/ggml-tiny.en.bin \\\n    -f ~/callcentervillage/voice-cloning/recorded_call.wav \\\n    -otxt\n\n# 2. Feed the transcription to llama.cpp for a contextual response\ncd /opt/llama.cpp\n./llama-cli -m models/tinyllama-1.1b-chat.Q4_K_M.gguf \\\n    -p "The caller said: $(cat ~/callcentervillage/voice-cloning/recorded_call.wav.txt). Write a convincing follow-up response as if you are the same person calling back." \\\n    -n 100 > ~/callcentervillage/voice-cloning/response.txt\n\n# 3. Synthesize the response in the original speaker's voice\ntts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n    --speaker_wav ~/callcentervillage/voice-cloning/recorded_call.wav \\\n    --language_idx en \\\n    --text "$(cat ~/callcentervillage/voice-cloning/response.txt)" \\\n    --out_path ~/callcentervillage/voice-cloning/cloned_response.wav`} />
    </div>
  </div>
  <SectionDivider />
  <QuizBank questions={[
    { question: "You need to demo voice cloning at a conference in 5 minutes. What's your best bet?", options: ["Train an RVC model", "Use Coqui TTS zero-shot", "Fine-tune Piper TTS", "Build a custom model from scratch"], correctIndex: 1, explanation: "Coqui TTS zero-shot only needs a few seconds of reference audio and no training — you can go from sample to clone in under a minute." },
    { question: "You need to transcribe an intercepted phone call, generate a convincing follow-up response, and create a recording in the caller's voice. Which three tools would you use?", options: ["whisper.cpp, llama.cpp, Coqui TTS", "whisper.cpp, Piper TTS, OpenVoice", "llama.cpp, RVC, Piper TTS", "Coqui TTS, OpenVoice, RVC"], correctIndex: 0, explanation: "whisper.cpp transcribes the call so you understand what was said and can feed it into llama.cpp to generate a convincing follow-up response. Coqui TTS then synthesizes it in the original caller's cloned voice." },
    { question: "What makes Piper TTS different from Coqui TTS?", options: ["Piper TTS supports zero-shot cloning", "Piper TTS is designed for edge devices and runs on very low-powered hardware", "Piper TTS produces higher quality output", "Piper TTS supports more languages"], correctIndex: 1, explanation: "Piper TTS is built for edge devices — it runs on hardware as small as a Raspberry Pi. However, it requires training data and doesn't support zero-shot cloning like Coqui TTS does." },
    { question: "What is the key difference between RVC and OpenVoice?", options: ["RVC is for TTS, OpenVoice is for voice conversion", "RVC requires fine-tuning with training audio, OpenVoice works zero-shot from a short clip", "OpenVoice produces higher quality clones", "RVC only works on Linux"], correctIndex: 1, explanation: "RVC requires 10-30 minutes of training audio and GPU time for fine-tuning, producing the highest quality clones. Once trained, RVC can run in real-time as a live voice filter. OpenVoice works zero-shot from a brief reference clip — faster to set up, but lower quality." },
    { question: "In a voice cloning attack chain, what role does whisper.cpp play?", options: ["It generates the cloned voice", "It creates the speaker embedding", "It transcribes audio to text for use with an LLM", "It modifies the pitch of the audio"], correctIndex: 2, explanation: "whisper.cpp is a speech-to-text tool. In an attack chain, it transcribes a recorded conversation so the attacker can understand the context — and that transcription can be fed directly into llama.cpp to generate a convincing follow-up response in the same conversation." },
  ]} />
</div>);

const CommercialSection = () => (<div>
  <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Commercial Voice Cloning</h2>
  <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>Understanding what's accessible with just a credit card.</p>
  <InfoBox>These companies are not sponsors or affiliated with this training or Call Center Village. They're listed for educational awareness only.<br /><span style={{ color: C.dim, fontStyle: "italic" }}>That said, if any of you are reading this — Call Center Village is <a href="https://callcentervillage.com/sponsors" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>looking for sponsors</a>.</span></InfoBox>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
    {[
      { name: "ElevenLabs", url: "https://elevenlabs.io", logo: "/images/elevenlabs-logo.ico", color: C.accent, features: ["Instant cloning (~30s)", "70+ languages", "Real-time streaming", "Voice design from description"], threat: "Very low barrier. Free tier available." },
      { name: "Murf AI", url: "https://murf.ai", logo: "/images/murf-logo.ico", color: C.highlight, features: ["Voice cloning from 10s", "120+ languages", "AI dubbing", "Enterprise API"], threat: "Low barrier. Free tier available." },
      { name: "Resemble.AI", url: "https://www.resemble.ai", logo: "/images/resembleai-logo.png", color: C.tertiary, features: ["Custom cloning", "Real-time VC", "Deepfake detection", "On-premise option"], threat: "Offense AND defense capabilities." },
      { name: "Cartesia Sonic", url: "https://www.cartesia.ai", logo: "/images/cartesia-logo.png", logoBg: "#ffffff", color: C.secondary, features: ["State-space model architecture", "Ultra-low latency", "Voice mixing"], threat: "Built for real-time agents." },
    ].map((s, i) => (
      <div key={i} style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <img src={s.logo} alt={s.name} style={{ width: 40, height: 40, borderRadius: 8, background: s.logoBg || "transparent", padding: s.logoBg ? 4 : 0 }} />
          <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 16, fontWeight: 800, color: s.color, textDecoration: "none" }}>{s.name} ↗</a>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>{s.features.map((f, j) => <span key={j} style={{ background: `${C.primary}10`, border: `1px solid ${C.border}`, padding: "6px 10px", borderRadius: 4, fontSize: 13, color: C.muted }}>{f}</span>)}</div>
        <div style={{ fontSize: 13, color: C.tertiary, background: `${C.tertiary}10`, padding: "8px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}><Icon name="magnifying-glass" size={14} />{s.threat}</div>
      </div>
    ))}
  </div>
  <p style={{ fontSize: 12, color: C.dim, textAlign: "center", marginTop: 16 }}>Have a suggestion for a voice cloning service to include here? Email us at <a href="mailto:support@callcentervillage.com" style={{ color: C.accent, textDecoration: "underline" }}>support@callcentervillage.com</a></p>
  <SectionDivider />
  <div><QuizBank questions={[
    { question: "How much audio do most commercial voice cloning services need to clone a voice?", options: ["30 minutes of studio-quality recording", "10-30 seconds — a voicemail or short clip is enough", "At least 5 minutes of clean speech", "They don't need audio — they generate from a text description"], correctIndex: 1, explanation: "Most commercial services can clone a voice from just 10-30 seconds of audio. This low barrier is what makes commercial cloning so accessible and potentially dangerous." },
    { question: "Why might an organization choose a commercial voice cloning provider over running tools locally?", options: ["Commercial tools always produce better quality", "Cloud providers handle hardware inference scaling seamlessly", "Local tools are illegal to use", "Commercial providers are free"], correctIndex: 1, explanation: "Just like early cloud computing, commercial voice AI providers let teams scale without managing GPUs, model updates, or infrastructure. The tradeoff is cost, data privacy, and vendor dependency — but for rapid development and production workloads, the convenience can outweigh those concerns." },
    { question: "What is a major privacy risk of using commercial voice cloning services?", options: ["Your voice data is encrypted end-to-end and never stored", "You lose control of your voice data once it's uploaded", "Commercial providers are required by law to delete your data immediately", "Your data is only used for your account and never shared"], correctIndex: 1, explanation: "When you upload voice samples to a commercial service, that data may be used to train their models, shared with law enforcement, or sold to third parties (including the government, without the need for warrants) — depending on the provider's terms of service." },
  ]} /></div>
</div>);

const DefenseCard = ({ title, titleColor = C.text, desc, children }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
    {title && <div style={{ fontSize: 16, fontWeight: 700, color: titleColor, marginBottom: 8 }}>{title}</div>}
    {desc && <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 14 }}>{desc}</p>}
    {children}
  </div>
);

const DefenseSubCard = ({ title, desc, link, linkLabel }) => (
  <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{title}</div>
      {link && <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: C.accent, textDecoration: "none" }}>{linkLabel || "Link"} ↗</a>}
    </div>
    <div style={{ fontSize: 13, color: C.dim, lineHeight: 1.7 }}>{desc}</div>
  </div>
);

const DefenseSection = () => (<div>
  <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Detection & Defense</h2>
  <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>How to detect and defend against voice cloning attacks.</p>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
    {[
      { layer: "Technical Detection", color: C.accent, items: ["Spectral analysis — AI has telltale patterns", "Vocoder artifact detection", "Pitch/formant consistency checks", "Watermark detection"] },
      { layer: "Procedural Defense", color: C.highlight, items: ["Callback verification", "Challenge questions", "Code words", "Multi-channel confirm"] },
      { layer: "AI-Powered Detection", color: C.tertiary, items: ["Resemblyzer embeddings", "ASVspoof models", "Real-time stream analysis", "Biometrics + liveness"] },
      { layer: "Organizational", color: C.secondary, items: ["Staff training (security awareness)", "No voice-only auth for high-value", "Voice biometric + PIN", "Audit suspicious calls"] },
    ].map((d, i) => (
      <div key={i} style={{ background: C.card, border: `1px solid ${d.color}33`, borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: d.color, marginBottom: 10 }}>{d.layer}</div>
        <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{d.items.map((item, j) => <div key={j} style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}><Icon name="arrow-right" size={12} />{item}</div>)}</div>
      </div>
    ))}
  </div>

  <SectionDivider />
  <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Detection & Defense Tools</h3>
  <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>Specific tools and approaches for each layer of defense. Some of these are hands-on tools you can run locally, others are processes and training programs to implement at your organization.</p>

  <DefenseCard title="Technical Detection" titleColor={C.accent} desc="Analyze audio files for signs of AI generation using spectral analysis and voice comparison tools.">
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Resemblyzer</div>
          <a href="https://github.com/resemble-ai/Resemblyzer" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: C.accent, textDecoration: "none" }}>GitHub ↗</a>
        </div>
        <p style={{ fontSize: 13, color: C.dim, marginBottom: 8 }}>Python library for speaker verification and voice comparison. Compares voice embeddings to detect if a voice sample matches a known speaker — useful for flagging potential clones. Runs on CPU.</p>
        <CodeBlock language="bash" code={'# Preinstalled on Call Center Village laptops\n# pip install resemblyzer\n\n# Compare two voice samples for similarity\npython3 -c "\nfrom resemblyzer import VoiceEncoder, preprocess_wav\nfrom pathlib import Path; import numpy as np\nenc = VoiceEncoder()\noriginal = enc.embed_utterance(preprocess_wav(Path(\'original.wav\')))\nsuspect = enc.embed_utterance(preprocess_wav(Path(\'suspect.wav\')))\nsimilarity = np.dot(original, suspect)\nprint(f\'Similarity: {similarity:.4f}\')\nprint(\'Likely same speaker\' if similarity > 0.75 else \'Different speaker or potential clone\')\n"'} />
      </div>
      <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>SoX Spectrogram Analysis</div>
        <p style={{ fontSize: 13, color: C.dim, marginBottom: 8 }}>Generate spectrograms and inspect them visually for vocoder artifacts, missing room tone, or unnatural frequency patterns. Already installed on the laptops.</p>
        <CodeBlock language="bash" code={'# Generate a spectrogram to visually inspect\nsox suspect.wav -n spectrogram -o suspect_spec.png\n\n# View the spectrogram in the terminal\nimg2txt suspect_spec.png\n\n# Compare frequency statistics between original and suspect\nsoxi original.wav && sox original.wav -n stat 2>&1\nsoxi suspect.wav && sox suspect.wav -n stat 2>&1'} />
      </div>
    </div>
  </DefenseCard>

  <DefenseCard title="AI-Powered Detection" titleColor={C.tertiary} desc="Machine learning models trained specifically to distinguish real speech from AI-generated speech.">
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <DefenseSubCard title="ASVspoof Challenge Models" desc="International challenge producing open-source anti-spoofing models. Trained on large datasets of real and fake speech — state of the art in detection." link="https://www.asvspoof.org" linkLabel="asvspoof.org" />
      <DefenseSubCard title="awesome-fake-audio-detection" desc="Curated list of papers, datasets, and code for audio deepfake detection. A good starting point for finding models you can test." link="https://github.com/john852517791/awesome-fake-audio-detection" linkLabel="GitHub" />
    </div>
  </DefenseCard>

  <DefenseCard title="Procedural Defense" titleColor={C.highlight} desc="No technology needed — these are process-based defenses that any organization or family can implement immediately. Voice cloning attacks don't just target companies — they target your parents, grandparents, and kids too.">
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {[
        { title: "Callback Verification", desc: "Never act on a sensitive request from an inbound call. Hang up and call the person back on a known, verified number. This applies at work and at home — if \"your son\" calls asking for money, hang up and call him back." },
        { title: "Challenge Questions", desc: "Ask something only the real person would know — not information available on social media or company directories." },
        { title: "Family Code Words", desc: "Establish a family safe word that only your family knows. If someone calls claiming to be a relative in an emergency, ask for the code word. Teach this to elderly family members especially." },
        { title: "Multi-Channel Confirmation", desc: "Confirm sensitive requests through a second channel — email, Slack, in-person — before acting." },
      ].map((d, i) => <DefenseSubCard key={i} title={d.title} desc={d.desc} />)}
    </div>
  </DefenseCard>

  <DefenseCard title="Organizational" titleColor={C.secondary} desc="Build a culture of security awareness so staff can recognize and respond to voice-based social engineering.">
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {[
        { title: "Security Awareness Training", desc: "Regular training sessions on voice cloning threats — what they sound like, how they work, and how to respond. Programs like KnowBe4, SANS Security Awareness, or Proofpoint offer modules specifically on vishing and voice deepfakes." },
        { title: "No Voice-Only Auth for High Value", desc: "Never authorize wire transfers, password resets, or access changes based solely on a phone call — regardless of who it sounds like." },
        { title: "Voice Biometric + PIN", desc: "If using voiceprint authentication, always pair it with a second factor like a PIN or OTP. Voice alone is no longer sufficient." },
        { title: "Audit Suspicious Calls", desc: "Log and review calls that involve sensitive actions. Flag calls where the caller resisted verification or pushed urgency." },
      ].map((d, i) => <DefenseSubCard key={i} title={d.title} desc={d.desc} />)}
    </div>
  </DefenseCard>

  <SectionDivider />
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
    <div style={{ padding: "16px 20px", fontSize: 15, fontWeight: 600, color: C.text, display: "flex", alignItems: "center" }}><Icon name="beaker" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Spectral Artifacts to Look For</div>
    <div style={{ padding: "0 20px 20px", color: C.muted, fontSize: 14, lineHeight: 1.8 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { sign: "Metallic shimmer", desc: "Vocoders leave unnatural energy above 8kHz — natural speech rolls off smoothly, AI shows a bump in the high range", natural: (s) => {
            const pts = Array.from({length: 40}, (_, i) => { const v = Math.max(0.02, 0.85 - i * 0.022 + (Math.sin(i * 1.3) * 0.03)); return `${i * 2.5},${42 - v * 40}`; });
            return <polyline points={pts.join(" ")} fill="none" stroke={s} strokeWidth="1.5" />;
          }, ai: (s) => {
            const pts = Array.from({length: 40}, (_, i) => {
              const base = Math.max(0.02, 0.85 - i * 0.022 + (Math.sin(i * 1.3) * 0.03));
              const shimmer = i > 28 ? 0.25 + Math.sin(i * 4) * 0.12 : 0;
              return `${i * 2.5},${42 - (base + shimmer) * 40}`;
            });
            return <><polyline points={pts.join(" ")} fill="none" stroke={s} strokeWidth="1.5" /><rect x="70" y="2" width="28" height="40" fill={s} opacity="0.08" rx="2" /></>;
          }},
          { sign: "Phase breaks", desc: "Audible glitches or pops where audio segments are stitched together at boundaries", natural: (s) => {
            const pts = Array.from({length: 40}, (_, i) => `${i * 2.5},${20 + Math.sin(i * 0.8) * 12}`);
            return <polyline points={pts.join(" ")} fill="none" stroke={s} strokeWidth="1.5" />;
          }, ai: (s) => {
            const pts1 = Array.from({length: 18}, (_, i) => `${i * 2.5},${20 + Math.sin(i * 0.8) * 12}`);
            const pts2 = Array.from({length: 18}, (_, i) => `${(i + 20) * 2.5},${20 + Math.sin((i + 20) * 0.8 + 1.5) * 12}`);
            return <><polyline points={pts1.join(" ")} fill="none" stroke={s} strokeWidth="1.5" /><polyline points={pts2.join(" ")} fill="none" stroke={s} strokeWidth="1.5" /><line x1="45" y1="8" x2="50" y2="32" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" /></>;
          }},
          { sign: "Flat F0 (pitch)", desc: "AI voices lack the natural rise and fall of human speech melody — questions should rise, statements should fall, emphasis creates peaks", natural: (s) => {
            const pts = Array.from({length: 40}, (_, i) => {
              const phrase1 = i < 15 ? 22 + Math.sin(i * 0.4) * 5 - i * 0.3 : 0;
              const pause = i >= 15 && i < 18 ? 22 : 0;
              const question = i >= 18 ? 26 - (i - 18) * 0.2 + Math.sin(i * 0.5) * 3 + (i > 33 ? (i - 33) * 1.5 : 0) : 0;
              return `${i * 2.5},${(phrase1 || pause || question) + Math.sin(i * 3) * 1.2}`;
            });
            return <><polyline points={pts.join(" ")} fill="none" stroke={s} strokeWidth="1.5" /><text x="8" y="43" fill={s} fontSize="3.5" opacity="0.4">statement ↘</text><text x="65" y="43" fill={s} fontSize="3.5" opacity="0.4">question ↗</text></>;
          }, ai: (s) => {
            const pts = Array.from({length: 40}, (_, i) => `${i * 2.5},${22 + Math.sin(i * 0.15) * 3}`);
            return <><polyline points={pts.join(" ")} fill="none" stroke={s} strokeWidth="1.5" /><line x1="0" y1="22" x2="100" y2="22" stroke={s} strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3" /></>;
          }},
          { sign: "No ambience", desc: "AI audio has an unnaturally clean noise floor — real recordings always have some room tone or background hum", natural: (s) => {
            const seed = (x) => { let v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
            const pts = Array.from({length: 40}, (_, i) => `${i * 2.5},${18 + Math.sin(i * 0.7) * 8 + (seed(i) - 0.5) * 6}`);
            const noiseFloor = Array.from({length: 100}, (_, i) => {
              const y = 35 + (seed(i * 3) - 0.5) * 10;
              const h = 2 + seed(i * 7) * 6;
              return <rect key={i} x={i} y={y} width="1" height={h} fill={s} opacity={0.15 + seed(i * 11) * 0.2} />;
            });
            return <>{noiseFloor}<polyline points={pts.join(" ")} fill="none" stroke={s} strokeWidth="1.5" /><text x="50" y="44" textAnchor="middle" fill={s} fontSize="4" opacity="0.5">room tone / background noise</text></>;
          }, ai: (s) => {
            const pts = Array.from({length: 40}, (_, i) => `${i * 2.5},${18 + Math.sin(i * 0.7) * 8}`);
            return <><rect x="0" y="35" width="100" height="10" fill="#08060f" /><polyline points={pts.join(" ")} fill="none" stroke={s} strokeWidth="1.5" /><text x="50" y="44" textAnchor="middle" fill={s} fontSize="4" opacity="0.5">dead silence — no room tone</text></>;
          }},
          { sign: "Unnatural pauses", desc: "TTS breathing and pause patterns feel mechanical — pauses are too uniform and breaths are missing or perfectly timed", natural: (s) => {
            const bars = [6,8,7,9,2,0,1,7,8,6,9,8,3,0,0,1,8,7,9,6];
            return bars.map((v, i) => <rect key={i} x={i * 5} y={40 - v * 3.5} width="3.5" height={v * 3.5} fill={s} opacity={0.8} rx="0.5" />);
          }, ai: (s) => {
            const bars = [7,8,7,8,7,8,7,0,7,8,7,8,7,8,7,0,7,8,7,8];
            return bars.map((v, i) => <rect key={i} x={i * 5} y={40 - v * 3.5} width="3.5" height={v * 3.5} fill={s} opacity={0.8} rx="0.5" />);
          }},
          { sign: "Smooth formants", desc: "AI over-smooths the transitions between vowel resonance bands (F1, F2, F3). Natural speech has sharp, quick shifts between sounds.", natural: (s) => {
            const f1 = Array.from({length: 40}, (_, i) => `${i * 2.5},${34 + Math.sin(i * 0.6) * 4 + Math.sin(i * 2.5) * 2.5}`);
            const f2 = Array.from({length: 40}, (_, i) => `${i * 2.5},${22 + Math.sin(i * 0.5 + 1) * 5 + Math.sin(i * 2.1) * 3}`);
            const f3 = Array.from({length: 40}, (_, i) => `${i * 2.5},${10 + Math.sin(i * 0.4 + 2) * 3 + Math.sin(i * 1.8) * 2}`);
            return <><polyline points={f1.join(" ")} fill="none" stroke={s} strokeWidth="1.5" /><polyline points={f2.join(" ")} fill="none" stroke={s} strokeWidth="1.2" opacity="0.7" /><polyline points={f3.join(" ")} fill="none" stroke={s} strokeWidth="1" opacity="0.5" /></>;
          }, ai: (s) => {
            const f1 = Array.from({length: 40}, (_, i) => `${i * 2.5},${34 + Math.sin(i * 0.6) * 4}`);
            const f2 = Array.from({length: 40}, (_, i) => `${i * 2.5},${22 + Math.sin(i * 0.5 + 1) * 5}`);
            const f3 = Array.from({length: 40}, (_, i) => `${i * 2.5},${10 + Math.sin(i * 0.4 + 2) * 3}`);
            return <><polyline points={f1.join(" ")} fill="none" stroke={s} strokeWidth="1.5" /><polyline points={f2.join(" ")} fill="none" stroke={s} strokeWidth="1.2" opacity="0.7" /><polyline points={f3.join(" ")} fill="none" stroke={s} strokeWidth="1" opacity="0.5" /></>;
          }},
        ].map((s, i) => {
          const renderViz = (height) => (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: C.accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Natural</div>
                <svg viewBox="0 0 100 45" style={{ width: "100%", height, background: "#08060f", borderRadius: 4, border: `1px solid ${C.border}` }}>{s.natural(C.accent)}</svg>
              </div>
              <div>
                <div style={{ fontSize: 10, color: C.tertiary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>AI-Generated</div>
                <svg viewBox="0 0 100 45" style={{ width: "100%", height, background: "#08060f", borderRadius: 4, border: `1px solid ${C.tertiary}44` }}>{s.ai(C.tertiary)}</svg>
              </div>
            </div>
          );
          return <ArtifactLightbox key={i} sign={s.sign} desc={s.desc} renderViz={renderViz} />;
        })}
      </div>
    </div>
  </div>
  <SectionDivider />
  <QuizBank questions={[
    { question: "Your company's CEO calls the CFO for an urgent wire transfer. What's the best first line of defense?", options: ["AI voice detector", "Personal questions", "Hang up and call CEO's known number", "Check voice against recordings"], correctIndex: 2, explanation: "Callback verification breaks the attacker's channel control." },
    { question: "You're analyzing a suspicious audio file and notice unnatural energy spikes above 8kHz. What does this likely indicate?", options: ["The microphone was too close", "Vocoder artifacts from AI-generated speech", "The audio was recorded in a large room", "Normal background noise"], correctIndex: 1, explanation: "Metallic shimmer above 8kHz is a telltale sign of neural vocoders used in AI speech generation — natural speech rolls off smoothly at high frequencies." },
    { question: "Why is voice biometrics alone insufficient?", options: ["Too expensive", "High-quality clones can fool voiceprint matching", "Requires too much data", "Only works in-person"], correctIndex: 1, explanation: "Quality clones match voiceprints. Liveness detection and MFA are essential." },
    { question: "Your elderly parent gets a frantic call from someone who sounds exactly like you, saying you're in trouble and need money wired immediately. What should they do?", options: ["Send the money — it sounds just like you", "Ask the caller for personal details", "Hang up and call you back on your known number", "Call the police immediately"], correctIndex: 2, explanation: "Callback verification is the single most effective defense against voice cloning attacks. Hanging up breaks the attacker's control of the conversation, and calling back on a known number confirms the real person's identity." },
    { question: "What is the most important organizational policy to prevent voice-based social engineering?", options: ["Install AI detection software on every phone", "Never allow sensitive actions like wire transfers or access changes based solely on a phone call", "Record all phone calls", "Only hire people with deep voices"], correctIndex: 1, explanation: "No voice-only authorization for high-value actions is the most impactful policy. It doesn't matter how convincing the clone is if the process requires a second factor or second channel to confirm." },
  ]} />
</div>);

const LabSection = () => {
  const [step, setStep] = useState(0);
  const exercises = [
    { title: "1: Record & Analyze", cmd: `# Record your voice (15 seconds)\n# You can also use Audacity: Record → File → Export Audio → save as my_voice.wav\nrec -r 44100 -c 1 -b 16 my_voice.wav trim 0 15\n\n# Generate a spectrogram\nsox my_voice.wav -n spectrogram -o spectrum.png\n\n# View the spectrogram in the terminal\nimg2txt spectrum.png\n\n# View audio file info and statistics\nsoxi my_voice.wav && sox my_voice.wav -n stat 2>&1` },
    { title: "2: Voice Modification", cmd: `# Pitch up\nsox my_voice.wav v1_higher.wav pitch 400\n\n# Pitch down\nsox my_voice.wav v2_deeper.wav pitch -300\n\n# Telephone effect\nsox my_voice.wav v3_phone.wav highpass 300 lowpass 3400\n\n# Robot effect\nffmpeg -i my_voice.wav -af "vibrato=f=6:d=0.4" v4_robot.wav` },
    { title: "3: AI Cloning", cmd: `# Preinstalled on Call Center Village laptops\n# pip install coqui-tts\n\ntts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n    --speaker_wav my_voice.wav --language_idx en \\\n    --text "AI clone of my voice." --out_path clone.wav` },
    { title: "4: Detection", cmd: `# Preinstalled on Call Center Village laptops\n# pip install resemblyzer\n\npython3 -c "\nfrom resemblyzer import VoiceEncoder, preprocess_wav\nfrom pathlib import Path; import numpy as np\nenc = VoiceEncoder()\no = enc.embed_utterance(preprocess_wav(Path('my_voice.wav')))\nc = enc.embed_utterance(preprocess_wav(Path('clone.wav')))\nprint(f'Similarity: {np.dot(o,c):.4f} (threshold is tunable, ~0.75 is a conservative starting point)')\n"` },
  ];
  return (<div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Interactive Lab</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>Put it all together — record your voice, modify it, clone it with AI, then try to detect which is real vs AI vs modified.</p>
    <InfoBox>If you need any help, please find an on-site Call Center Village staff member.</InfoBox>
    <div role="tablist" style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
      {exercises.map((ex, i) => <button key={i} role="tab" aria-selected={i === step} onClick={() => setStep(i)} style={{ background: i === step ? `${C.primary}20` : C.card, border: `1px solid ${i === step ? C.secondary : C.border}`, borderRadius: 8, padding: "10px 16px", color: i === step ? C.accent : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}>{ex.title}</button>)}
    </div>
    <div style={{ background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${C.secondary}33` }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 12 }}>{exercises[step].title}</div>
      <CodeBlock code={exercises[step].cmd} language="bash" />
    </div>
    <SectionDivider />
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <p style={{ fontSize: 15, color: C.muted, marginBottom: 16 }}>Satisfied with your knowledge? Continue to the next module.</p>
      <a href="/voice-agents/intro" onClick={(e) => { e.preventDefault(); history.pushState(null, "", "/voice-agents/intro"); window.dispatchEvent(new PopStateEvent("popstate")); window.scrollTo(0, 0); }} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.primary, border: "none", borderRadius: 8, padding: "12px 24px", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 15, fontWeight: 700, textDecoration: "none", transition: "all 0.2s ease" }} onMouseEnter={e => { e.currentTarget.style.background = C.secondary; e.currentTarget.style.boxShadow = `0 0 12px ${C.primary}66`; }} onMouseLeave={e => { e.currentTarget.style.background = C.primary; e.currentTarget.style.boxShadow = "none"; }}>Continue to Voice Agents <ArrowRightIcon style={{ width: 16, height: 16 }} /></a>
    </div>
  </div>);
};

const COMPS = [IntroSection, FundamentalsSection, TraditionalSection, AISection, LocalToolsSection, CommercialSection, DefenseSection, LabSection];

export { SECTIONS, COMPS };

export default function VoiceCloningTraining() {
  return <TrainingShell sections={SECTIONS} sectionComponents={COMPS} moduleTitle="Voice Cloning" topOffset={48} />;
}
