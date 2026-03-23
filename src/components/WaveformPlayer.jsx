import { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { C } from "./colors";

const WaveformPlayer = ({ src, label }) => {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: C.dim,
      progressColor: C.accent,
      cursorColor: C.secondary,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 64,
      normalize: true,
      backend: "WebAudio",
      url: src,
    });
    ws.on("ready", () => setReady(true));
    ws.on("play", () => setPlaying(true));
    ws.on("pause", () => setPlaying(false));
    ws.on("finish", () => setPlaying(false));
    wavesurferRef.current = ws;
    return () => { ws.destroy(); };
  }, [src]);

  return (
    <div>
      {label && <div style={{ fontSize: 12, color: C.dim, marginBottom: 6 }}>{label}</div>}
      <div style={{ background: C.codeBg, borderRadius: 8, padding: "8px 12px", border: `1px solid ${playing ? `${C.accent}44` : C.border}`, transition: "border-color 0.3s ease" }}>
        <div ref={containerRef} />
        <button
          onClick={() => wavesurferRef.current?.playPause()}
          disabled={!ready}
          style={{
            marginTop: 8, background: playing ? `${C.accent}20` : `${C.primary}20`,
            border: `1px solid ${playing ? `${C.accent}44` : `${C.primary}44`}`,
            borderRadius: 6, padding: "6px 16px", color: playing ? C.accent : C.text,
            cursor: ready ? "pointer" : "default", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
            opacity: ready ? 1 : 0.4, transition: "all 0.2s ease",
          }}
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
};

export default WaveformPlayer;
