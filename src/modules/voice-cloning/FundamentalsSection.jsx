import { useState, useRef } from "react";
import { C, QuizBank, Icon, SectionDivider } from '../../components';
import { WaveformViz, VoiceCharacteristicCard, PitchDiagram, FormantDiagram, TimbreDiagram, ProsodyDiagram, SpectrumViz, RecommendationCard, AudioQualityCard } from './_helpers';

const FundamentalsSection = () => {
  const [waveType, setWaveType] = useState("sine");
  const waveRef = useRef(null);
  const [wavePlaying, setWavePlaying] = useState(false);
  return (<div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Audio Fundamentals</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>Before we can understand how voices are cloned, we need to understand what sound actually looks like. Every sound — from a simple beep to a human voice — is a pressure wave moving through the air, and we can visualize these waves to see how they differ.</p>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>A <strong style={{ color: C.text }}>sine wave</strong> is the simplest possible sound: one smooth, repeating frequency. A <strong style={{ color: C.text }}>square wave</strong> snaps abruptly between two levels, producing a harsher tone packed with extra harmonics. Then look at the <strong style={{ color: C.text }}>human voice</strong> — it's dramatically more complex, made up of dozens of overlapping frequencies that shift constantly. That complexity is what makes every voice unique, and it's what voice cloning AI has to learn to reproduce.</p>
    <div style={{ marginBottom: 24 }}>
      <h2 id="waveform-explorer" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12, scrollMarginTop: 120 }}>Interactive Waveform Explorer</h2>
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
      <h2 id="voice-characteristics" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Key Voice Characteristics</h2>
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
      <h2 id="frequency-spectrum" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Frequency Spectrum — Your Vocal Fingerprint</h2>
      <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 16, fontSize: 14 }}>Imagine three people — an adult man, an adult woman, and a child — all saying the same vowel sound: "ah" (as in "father"). The graph below shows what each voice looks like in the frequency domain, plotted from low frequencies on the left to high frequencies on the right. The height of each bar represents how loud that frequency is. The peaks labeled F1–F4 are the formant resonances, and they land at different positions for each speaker because their vocal tracts are different sizes.</p>
      <SpectrumViz />
    </div>
    <SectionDivider />
    <div>
      <h2 id="audio-quality-recommendations" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Audio Quality Recommendations for Cloning</h2>
      <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 20, fontSize: 14 }}>Now that you know what makes a voice unique — the fundamental pitch, the formant peaks, the harmonic texture — the question becomes: how good does a recording need to be to preserve all of that? If the sample rate is too low, the upper formants get cut off. If there's too much background noise, the subtle harmonics that define timbre get buried. If the audio clips, the waveform gets distorted beyond recognition. There's no hard cutoff, but these are the general thresholds where most cloning tools start producing usable results.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
        {[
          { label: "Sample Rate", value: "≥16kHz", ideal: "44.1kHz+", detail: "Sample rate determines the highest frequency a recording can capture — specifically, half the sample rate (the Nyquist limit). At 16kHz, the maximum captured frequency is 8kHz, which barely covers the third formant (F3) for most speakers and cuts off F4 entirely. Since upper formants are a key part of what makes a voice recognizable, losing them means the cloning model has less to work with. At 44.1kHz (CD quality), the capture range extends to 22kHz — well beyond the useful range of human speech — preserving every harmonic and formant the model needs to accurately reproduce the voice. Note: many voice tools expect 16kHz mono input, so you may need to downsample higher-rate recordings before use." },
          { label: "Bit Depth", value: "≥16-bit", ideal: "24-bit", detail: "Bit depth controls how many discrete amplitude levels are available to represent the waveform. At 16-bit, there are 65,536 levels, which provides about 96dB of dynamic range — adequate for most speech. At 24-bit, that jumps to over 16 million levels and 144dB of dynamic range. The extra headroom matters because voice cloning models learn from subtle amplitude variations — the slight volume differences between voiced and unvoiced consonants, the natural decay of breath at the end of a phrase. With 24-bit, these quiet details are captured cleanly instead of being rounded into quantization noise." },
          { label: "Duration", value: "≥30s", ideal: "3-10 min", detail: "Traditional voice cloning models need enough speech to encounter every phoneme the target language uses — English has roughly 44. A 30-second clip might only cover a handful of vowels and common consonants, leaving the model guessing on sounds like 'zh,' 'th,' or 'ng.' With 3-10 minutes of varied speech, the model sees each phoneme in multiple phonetic contexts (word-initial, word-final, stressed, unstressed), which is what it needs to generalize naturally. Longer recordings also give the model more examples of the speaker's prosody patterns — how they raise pitch for questions, where they pause, how they emphasize words." },
          { label: "Format", value: "WAV/FLAC", ideal: "WAV", detail: "WAV stores raw, uncompressed PCM audio — every sample exactly as the microphone captured it. FLAC compresses the file size (typically 50-60% smaller) but is mathematically lossless, meaning the decoded audio is bit-for-bit identical to the original. MP3 and other lossy formats achieve smaller files by permanently discarding audio information the encoder considers less perceptible — but 'less perceptible to a human listener' is not the same as 'unimportant to a neural network.' Lossy compression introduces subtle artifacts in transients and quiet passages that a cloning model can pick up and reproduce. WAV avoids this entirely." },
          { label: "Noise Floor", value: "≤ −40dB", ideal: "≤ −60dB", detail: "The noise floor is the level of background sound present when the speaker is silent — air conditioning hum, electrical interference, room reverb. At −40dB, background noise is roughly 1% of the signal level, which sounds quiet to a casual listener but is clearly visible on a spectrogram. A cloning model trained on noisy audio will bake that noise into its learned representation of the voice, producing output that sounds like it was recorded in the same noisy room. At −60dB (0.1% of signal level), the noise is low enough that the model can cleanly isolate the vocal characteristics without learning artifacts from the recording environment." },
          { label: "Clipping", value: "None", ideal: "Peak ≤ −3dB", detail: "Clipping occurs when the audio signal exceeds the maximum level the recorder can represent — the waveform peaks get flattened, introducing harsh distortion. Even brief clips on loud consonants like 'p' or 'k' permanently destroy the waveform shape at those moments, and there's no way to reconstruct what was lost. Keeping peaks at or below −3dB provides headroom for natural volume spikes without hitting the ceiling. This is especially important for speech, where plosive consonants and emphatic syllables can spike 6-10dB above the average level. Once audio clips, no amount of post-processing can fix it." }
        ].map((r, i) => (
          <RecommendationCard key={i} label={r.label} value={r.value} ideal={r.ideal} detail={r.detail} />
        ))}
      </div>
      <SectionDivider />
      <h2 id="why-these-numbers-matter" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12, scrollMarginTop: 120 }}>Why These Numbers Matter</h2>
      <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 16, fontSize: 13 }}>Each diagram shows the same voice signal under <span style={{ color: C.tertiary, fontWeight: 600 }}>poor conditions</span> and <span style={{ color: "#58E880", fontWeight: 600 }}>ideal conditions</span>. Low sample rates lose upper formants, noise buries subtle harmonics, clipping flattens peaks, low bit depth adds staircase artifacts, short recordings miss phonemes the AI needs to learn, and lossy formats throw away detail the model depends on.</p>
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
    </div>
    <SectionDivider />
    <div id="knowledge-check" style={{ scrollMarginTop: 120 }}>
      <QuizBank questions={[
        { question: "What are formants?", options: ["The base frequency of your voice", "Resonance peaks shaped by your vocal tract", "The volume of each syllable", "Digital encoding of speech"], correctIndex: 1, explanation: "Formants are resonance frequencies shaped by your vocal tract. They're one of the primary features that makes each voice unique." },
        { question: "What sample rate is generally considered the minimum for voice cloning?", options: ["8kHz", "16kHz", "44.1kHz", "96kHz"], correctIndex: 1, explanation: "16kHz is the commonly accepted baseline — below this, too much frequency information tends to be lost for most cloning tools. 44.1kHz or higher is ideal, but 16kHz usually captures enough of the essential voice frequencies." },
        { question: "Which voice characteristic tends to be the HARDEST for AI to clone?", options: ["Base pitch", "Prosody and emotional expression", "Vowel formants", "Volume"], correctIndex: 1, explanation: "Prosody — rhythm, stress, intonation, emotion — generally requires understanding meaning and context, not just acoustic patterns. Most current AI models struggle with this more than the other characteristics." },
      ]} />
    </div>
  </div>);
};

export default FundamentalsSection;
