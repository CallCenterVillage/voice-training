import { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { C } from "./colors";

const WaveformPlayer = ({ src, label }) => {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  // Reset load state when the source changes, adjusted during render rather
  // than in the effect below so there is no cascading re-render.
  const [loadedSrc, setLoadedSrc] = useState(src);
  if (loadedSrc !== src) {
    setLoadedSrc(src);
    setReady(false);
    setError(false);
  }

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
    // Without this a failed fetch or decode left `ready` false forever, which
    // rendered as a permanently greyed, disabled (so untabbable) button with no
    // message and no retry — a silent dead end.
    ws.on("error", () => { setError(true); setReady(false); });
    wavesurferRef.current = ws;
    return () => { ws.destroy(); };
  }, [src]);

  // Two players often sit on the same page, so the button needs more than "Play".
  const action = playing ? "Pause" : "Play";
  const buttonLabel = label ? `${action} ${label}` : action;

  return (
    <div>
      {label && <div style={{ fontSize: 12, color: C.dim, marginBottom: 6 }}>{label}</div>}
      <div style={{ background: C.codeBg, borderRadius: 8, padding: "8px 12px", border: `1px solid ${playing ? `${C.accent}44` : C.border}`, transition: "border-color 0.3s ease" }}>
        <div ref={containerRef} />
        {error ? (
          <div role="alert" style={{ marginTop: 8, fontSize: 13, color: "#ef4444", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span>Audio failed to load.</span>
            <a href={src} download style={{ color: C.accent, minHeight: 44, display: "inline-flex", alignItems: "center" }}>Download the file instead</a>
          </div>
        ) : (
          <button
            onClick={() => wavesurferRef.current?.playPause()}
            disabled={!ready}
            aria-label={buttonLabel}
            aria-busy={!ready}
            style={{
              marginTop: 8, background: playing ? `${C.accent}20` : `${C.primary}20`,
              border: `1px solid ${playing ? `${C.accent}44` : `${C.primary}44`}`,
              borderRadius: 6, padding: "6px 16px", minHeight: 44, color: playing ? C.accent : C.text,
              cursor: ready ? "pointer" : "default", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
              opacity: ready ? 1 : 0.4, transition: "all 0.2s ease",
            }}
          >
            {ready ? action : "Loading…"}
          </button>
        )}
      </div>
    </div>
  );
};

export default WaveformPlayer;
