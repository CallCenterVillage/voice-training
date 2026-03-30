import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import { C, CodeBlock, Icon, InfoBox, Lightbox, SectionDivider } from '../../components';
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const ArtifactLightbox = ({ sign, desc, renderViz }) => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        role="button" tabIndex={0} aria-label={sign}
        onClick={() => setOpen(true)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } }}
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

const AudioQualityCard = ({ title, children }) => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        role="button" tabIndex={0} aria-label={title}
        onClick={() => setOpen(true)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } }}
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
        role="button" tabIndex={0} aria-label={label}
        onClick={() => setOpen(true)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } }}
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
        role="button" tabIndex={0} aria-label={name}
        onClick={() => setOpen(true)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } }}
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
  <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", padding: "8px 0 0 0" }}>
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
  const [selectedName, setSelectedName] = useState(tools[0]?.name);
  const matchIdx = tools.findIndex(t => t.name === selectedName);
  const safeIdx = matchIdx >= 0 ? matchIdx : 0;
  const t = tools[safeIdx];
  return (
    <div style={{ background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${C.border}` }}>
      <div role="tablist" style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {tools.map((tool, i) => <button key={i} role="tab" aria-selected={i === safeIdx} onClick={() => setSelectedName(tool.name)} style={{ background: i === safeIdx ? `${C.primary}20` : "#06040c", border: `1px solid ${i === safeIdx ? C.secondary : C.border}`, borderRadius: 8, padding: "8px 14px", color: i === safeIdx ? C.accent : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600 }}>{tool.name}</button>)}
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
        {t.note && <div style={{ marginTop: 12, fontSize: 12, color: C.dim, fontStyle: "italic", lineHeight: 1.7 }}>{t.note}</div>}
      </div>
    </div>
  );
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
    { title: "Voice Model", detail: "The neural network applies the cloned voice's characteristics — pitch, timbre, speaking style — to the phoneme sequence. Think of it like a voice filter: the phonemes say WHAT to speak, and the voice model says HOW to speak it — matching the target person's unique sound. Different model architectures make different tradeoffs between quality and speed.", exampleLabel: "Explanation", exampleComponent: "architectures" },
    { title: "Mel Spectrogram", detail: "Most models output a mel spectrogram — a visual representation of the audio's frequency content over time. Think of it as a detailed blueprint for the sound. Each row is a frequency band (low at bottom, high at top) and each column is a moment in time. Brighter colors mean more energy at that frequency. Some newer models (VALL-E, Bark) use discrete audio tokens instead, and end-to-end models like VITS skip this step entirely and generate waveforms directly.", exampleComponent: "melspec" , exampleCaption: <><div>Spectrogram generated from a speech recording using SoX — horizontal bands are harmonics, bright regions show where vocal energy concentrates.</div><div style={{ marginTop: 4 }}>A true mel spectrogram compresses the upper frequencies to match human hearing perception.</div></> },
    { title: "Vocoder", detail: "The previous step created a blueprint (the spectrogram) — but you can't play a blueprint through a speaker. The vocoder's job is to turn that blueprint into actual sound waves. Think of it like a 3D printer for audio: it takes the visual plan and builds the real thing, sample by sample, 22,050 times per second.", exampleComponent: "vocoder" },
    { title: "Audio Output", detail: "The final waveform is saved as an audio file. At this point it sounds like the cloned voice speaking the input text. Generation time depends on the model architecture — autoregressive models take longer, while non-autoregressive models can generate audio much faster than real-time.", exampleComponent: "tts-audio" },
  ],
  "Voice Conversion": [
    { title: "Source Audio", detail: "You start with a recording of someone speaking — this could be your own voice, or any audio clip. The key thing is that the words, timing, rhythm, and emotion in this recording will all be preserved in the final output. Only the voice identity changes.", exampleComponent: "vc-source", exampleLabel: "How It Works" },
    { title: "Feature Extraction", detail: "The system analyzes the source audio and pulls out everything about how the words are spoken — but strips away who is speaking. It separates the content (what was said) from the identity (who said it). This is the critical step that makes voice conversion possible.", exampleComponent: "vc-features", exampleLabel: "What Gets Extracted" },
    { title: "Speaker Embedding", detail: "The target voice's identity is captured as a speaker embedding — a high-dimensional numerical vector (typically 256–512 dimensions) that encodes what makes a voice unique. Each dimension represents a learned vocal characteristic: pitch range, formant positions, breathiness, resonance, and hundreds of other features the model discovered during training. The embedding is what tells the conversion model whose voice to produce.", exampleComponent: "vc-embed", exampleLabel: "How It Works" },
    { title: "Conversion Model", detail: "The neural network takes the extracted features (content + style) and the target speaker embedding (identity) and generates a new spectrogram that sounds like the target speaker performing the source speech. This is where the actual voice swap happens. Different model architectures take fundamentally different approaches to this problem.", exampleComponent: "vc-convert", exampleLabel: "Model Architectures" },
    { title: "Vocoder", detail: "Just like in TTS, the vocoder converts the generated spectrogram into an actual audio waveform you can hear. Most voice conversion tools use HiFi-GAN for this step. The vocoder doesn't change the voice — it just turns the blueprint into playable sound.", exampleComponent: "vocoder" },
    { title: "Target Audio", detail: "The final output sounds like the target speaker saying the exact same words, with the same emotion, timing, and rhythm as the original source recording. Only the voice identity has changed — everything else is preserved from the source.", exampleComponent: "vc-target", exampleLabel: "The Result" },
  ],
};

const DefenseCard = ({ id, title, titleColor = C.text, desc, children }) => (
  <div id={id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24, ...(id ? { scrollMarginTop: 120 } : {}) }}>
    {title && <div style={{ fontSize: 16, fontWeight: 700, color: titleColor, marginBottom: 8 }}>{title}</div>}
    {desc && <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 14 }}>{desc}</p>}
    {children}
  </div>
);

const DefenseSubCard = ({ title, desc, link, linkLabel }) => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        role="button" tabIndex={0} aria-label={title}
        onClick={() => setOpen(true)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: C.codeBg, border: `1px solid ${hovered ? C.accent : C.border}`, borderRadius: 8, padding: 16, cursor: "pointer", transition: "border-color 0.2s ease" }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, color: C.dim, lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{desc}</div>
        {link && <a href={link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display: "inline-block", marginTop: 8, fontSize: 12, color: C.accent, textDecoration: "none" }}>{linkLabel || "Link"} ↗</a>}
      </div>
      {open && (
        <Lightbox onClose={() => setOpen(false)}>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>{title}</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: link ? 16 : 0 }}>{desc}</div>
          {link && <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: C.accent, textDecoration: "none", fontWeight: 600 }}>{linkLabel || "Link"} ↗</a>}
        </Lightbox>
      )}
    </>
  );
};

export {
  ArtifactLightbox,
  SectionDivider,
  Lightbox,
  AudioQualityCard,
  RecommendationCard,
  VoiceCharacteristicCard,
  PitchDiagram,
  FormantDiagram,
  TimbreDiagram,
  ProsodyDiagram,
  WaveformViz,
  VOICE_SOURCE,
  computeSpectrum,
  VOICE_PROFILES,
  FREQ_LABELS,
  SpectrumViz,
  PipelineDiagram,
  inlineCode,
  ToolComparison,
  MelSpectrogramViz,
  VocoderViz,
  AI_FLOW_DETAILS,
  DefenseCard,
  DefenseSubCard,
};
