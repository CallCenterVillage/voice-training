import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
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
      {[{ label: "Duration", value: "~25 min", icon: "clock" }, { label: "Difficulty", value: "Intermediate", icon: "trending-up" }, { label: "Prerequisites", value: "CLI & audio basics", icon: "clipboard" }].map((item, i) => (
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
        { name: "SoX", desc: "Export, normalize, and format final audio.", pros: ["Normalize levels", "Format conversion", "Trim silence"], cons: ["CLI only"], install: `# Normalize to -1dB\nsox input.wav output.wav gain -n -1\n\n# Trim leading/trailing silence\nsox input.wav output.wav silence 1 0.1 1% reverse silence 1 0.1 1% reverse\n\n# Convert to specific format\nsox input.wav -r 16000 -c 1 -b 16 output.wav` },
        { name: "FFmpeg", desc: "Export to any format with precise codec control.", pros: ["Any codec", "Metadata control", "Streaming formats"], cons: ["Many options to learn"], install: `# Export as high-quality MP3\nffmpeg -i input.wav -codec:a libmp3lame -qscale:a 2 output.mp3\n\n# Export as Opus (small, high quality)\nffmpeg -i input.wav -codec:a libopus -b:a 128k output.opus\n\n# Normalize volume\nffmpeg -i input.wav -af "loudnorm=I=-16:LRA=11:TP=-1" output.wav` },
        { name: "Audacity", desc: "Final review with visual waveform before export.", pros: ["Visual verification", "Multiple export formats", "Metadata editor"], cons: ["GUI only"], guide: [
          { heading: "Open your file", action: "File → Open → `~/callcentervillage/voice-cloning/input.wav`" },
          { heading: "Review and normalize", steps: ["Effect → Volume and Compression → Normalize", "View → Show Clipping (check for distortion)"] },
          { heading: "Export final audio", steps: ["File → Export Audio → save to `~/callcentervillage/voice-cloning/`", "File → Export Multiple (batch from labels)"] },
        ] },
      ],
    ][activeStep]} />
    <SectionDivider />
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: C.text, fontSize: 15, fontWeight: 600 }}>
        <Icon name="user-group" size={16} style={{ color: C.tertiary }} />Voice Disguise Recipes
      </div>
      <div style={{ display: "grid", gap: 12, color: C.muted, fontSize: 14, lineHeight: 1.8 }}>
        {[
          { name: "Male → Female (rough)", cmd: "sox input.wav output.wav pitch 500 equalizer 250 2q -6 equalizer 4000 1q 5" },
          { name: "Robot / Anonymizer", cmd: 'ffmpeg -i input.wav -af "vibrato=f=8:d=0.5,chorus=0.5:0.9:50:0.4:0.25:2" output.wav' },
          { name: "Phone Call Simulation", cmd: "sox input.wav output.wav highpass 300 lowpass 3400 compand 0.3,1 6:-70,-60,-20 -5 -90 0.2" },
        ].map((r, i) => <div key={i} style={{ background: "#06040c", padding: 12, borderRadius: 8 }}><div style={{ color: C.tertiary, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{r.name}</div><CodeBlock code={r.cmd} language="bash" /></div>)}
      </div>
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

export { SECTIONS, COMPS };

export default function VoiceCloningTraining() {
  return <TrainingShell sections={SECTIONS} sectionComponents={COMPS} moduleTitle="Voice Cloning" topOffset={48} />;
}
