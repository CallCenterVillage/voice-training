import { useState } from 'react';
import { C, CodeBlock, Icon, InfoBox, QuizBank, SectionDivider, Lightbox } from '../../components';
import { ArtifactLightbox, DefenseCard, DefenseSubCard } from './_helpers';

const WeDefenseArchitecture = () => {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (<>
    <div onClick={() => setOpen(true)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: C.card, border: `1px solid ${hovered ? C.accent : C.border}`, borderRadius: 12, padding: 20, marginBottom: 24, cursor: "zoom-in", transition: "border-color 0.2s ease" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>WeDefense Architecture</div>
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, borderRadius: 8, padding: 16 }}>
        <img src="/images/wedefense-architecture.png" alt="WeDefense toolkit architecture diagram" style={{ width: "100%", borderRadius: 4, display: "block" }} />
      </div>
      <div style={{ fontSize: 11, color: C.dim, marginTop: 10, lineHeight: 1.5, textAlign: "center" }}>
        WeDefense — fake audio detection and localization pipeline.{" "}
        <a href="https://github.com/zlin0/wedefense" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: C.accent, textDecoration: "none" }}>Source: zlin0/wedefense ↗</a>
      </div>
    </div>
    {open && (
      <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out", padding: 32 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, borderRadius: 12, padding: 20, maxWidth: "90vw", maxHeight: "90vh", cursor: "default" }}>
          <img src="/images/wedefense-architecture.png" alt="WeDefense toolkit architecture diagram" style={{ width: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: 4, display: "block" }} />
        </div>
      </div>
    )}
  </>);
};

const DefenseSection = () => (<div>
  <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Detection & Defense</h1>
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
  <h2 id="detection-and-defense-tools" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Detection & Defense Tools</h2>
  <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>Specific tools and approaches for each layer of defense. Some of these are hands-on tools you can run locally, others are processes and training programs to implement at your organization.</p>

  <h2 id="technical-detection" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Technical Detection</h2>
  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 14 }}>Analyze audio files for signs of AI generation using spectral analysis and voice comparison tools.</p>
  <div style={{ display: "grid", gap: 24, marginBottom: 24 }}>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Resemblyzer</div>
        <a href="https://github.com/resemble-ai/Resemblyzer" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: C.accent, textDecoration: "none" }}>GitHub ↗</a>
      </div>
      <p style={{ fontSize: 13, color: C.dim, marginBottom: 8 }}>Python library for speaker verification and voice comparison. Compares voice embeddings to detect if a voice sample matches a known speaker — useful for flagging potential clones. Runs on CPU.</p>
      <CodeBlock language="bash" code={'# Preinstalled on Call Center Village laptops\n\n# Compare two voice samples for similarity\nresemblyzer original.wav suspect.wav'} />
    </div>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>SoX Spectrogram Analysis</div>
      <p style={{ fontSize: 13, color: C.dim, marginBottom: 8 }}>Generate spectrograms and inspect them visually for vocoder artifacts, missing room tone, or unnatural frequency patterns. Already installed on the laptops.</p>
      <CodeBlock language="bash" code={'# Generate a spectrogram to visually inspect\nsox suspect.wav -n spectrogram -o suspect_spec.png\n\n# View the spectrogram in the terminal\nimgcat suspect_spec.png\n\n# Compare frequency statistics between original and suspect\nsoxi original.wav && sox original.wav -n stat 2>&1\nsoxi suspect.wav && sox suspect.wav -n stat 2>&1'} />
    </div>
    <div style={{ background: C.card, border: `1px solid ${C.accent}22`, borderRadius: 12, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>librosa Spectral Analysis</div>
        <a href="https://github.com/librosa/librosa" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: C.accent, textDecoration: "none" }}>GitHub ↗</a>
      </div>
      <p style={{ fontSize: 13, color: C.dim, marginBottom: 16 }}>Four wrapper tools built on <a href="https://github.com/librosa/librosa" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>librosa</a>, Python's standard audio analysis library. These use spectral features (mel-spectrograms, MFCCs, spectral centroid/flatness/rolloff) to compare, score, and flag audio files — no ML model or training data required.</p>
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ background: C.codeBg, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>voice-spectrogram</div>
          <p style={{ fontSize: 13, color: C.dim, marginBottom: 8 }}>Side-by-side mel-spectrogram comparison. AI-generated audio often shows unnaturally smooth or repeating patterns.</p>
          <CodeBlock language="bash" code={'# Compare spectrograms of a known-real recording vs. suspect\nvoice-spectrogram reference_call.wav suspect_call.wav output.png'} />
        </div>
        <div style={{ background: C.codeBg, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>voice-similarity</div>
          <p style={{ fontSize: 13, color: C.dim, marginBottom: 8 }}>MFCC cosine similarity score. Returns 0.0 (completely different) to 1.0 (identical) — same-speaker comparisons below ~0.75 are suspicious.</p>
          <CodeBlock language="bash" code={'# Score similarity between a known caller and incoming call\nvoice-similarity known_caller.wav incoming_call.wav'} />
        </div>
        <div style={{ background: C.codeBg, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>voice-artifact-scan</div>
          <p style={{ fontSize: 13, color: C.dim, marginBottom: 8 }}>Scan for spectral anomalies common in AI speech — low spectral variance, missing high-frequency content, and unusual flatness.</p>
          <CodeBlock language="bash" code={'# Scan a suspect call for synthetic artifacts\nvoice-artifact-scan suspect_call.wav'} />
        </div>
        <div style={{ background: C.codeBg, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>voice-batch-analyze</div>
          <p style={{ fontSize: 13, color: C.dim, marginBottom: 8 }}>Batch-analyze a folder of audio files and output a CSV report with spectral features and flags for each file.</p>
          <CodeBlock language="bash" code={'# Analyze all recordings in a folder and generate a report\nvoice-batch-analyze /path/to/call_recordings/ results.csv'} />
        </div>
      </div>
    </div>
  </div>

  <SectionDivider />
  <h2 id="ai-powered-detection" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>AI-Powered Detection</h2>
  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 14 }}>Machine learning models trained specifically to distinguish real speech from AI-generated speech.</p>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
    <DefenseSubCard title="ASVspoof Challenge Models" desc="International challenge producing open-source anti-spoofing models. Trained on large datasets of real and fake speech — state of the art in detection." link="https://www.asvspoof.org" linkLabel="asvspoof.org" />
    <DefenseSubCard title="awesome-fake-audio-detection" desc="Curated list of papers, datasets, and code for audio deepfake detection. A good starting point for finding models you can test." link="https://github.com/john852517791/awesome-fake-audio-detection" linkLabel="GitHub" />
    <DefenseSubCard title="WeDefense" desc="Open-source toolkit for fake audio detection and localization. Supports training, evaluation, and deployment of anti-spoofing models with SSL-based architectures." link="https://github.com/zlin0/wedefense" linkLabel="GitHub" />
    <DefenseSubCard title="FakeVoiceFinder" desc="Framework for synthetic and deepfake audio detection using spectral transforms (mel, log, DWT, CQT) with real/fake probability scoring." link="https://github.com/DEEP-CGPS/FakeVoiceFinder" linkLabel="GitHub" />
  </div>
  <WeDefenseArchitecture />
  <InfoBox>Running AI-powered detection models is left as an exercise for the reader. These tools typically require labeled training data (real vs. fake voice samples), significant compute for model training, and/or GPU hardware for reasonable performance. The links above are a starting point for teams ready to invest in building a detection pipeline.</InfoBox>

  <SectionDivider />
  <h2 id="procedural-defense" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Procedural Defense</h2>
  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 14 }}>No technology needed — these are process-based defenses that any organization or family can implement immediately. Voice cloning attacks don't just target companies — they target your parents, grandparents, and kids too.</p>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
    {[
      { title: "Callback Verification", desc: "Never act on a sensitive request from an inbound call. Hang up and call the person back on a known, verified number. This applies at work and at home — if \"your son\" calls asking for money, hang up and call him back.", link: "https://www.jpmorgan.com/insights/cybersecurity/business-email-compromise/when-callbacks-go-wrong", linkLabel: "JP Morgan — When Callbacks Go Wrong" },
      { title: "Challenge Questions", desc: "Ask something only the real person would know — not information available on social media or company directories. Note that NIST SP 800-63 no longer considers knowledge-based authentication (security questions) acceptable on its own due to the ease with which attackers can discover answers — but in a phone conversation, personal questions the caller can't Google remain a useful signal.", link: "https://pages.nist.gov/800-63-3/sp800-63b.html", linkLabel: "NIST SP 800-63B — Authentication Guidelines" },
      { title: "Family Code Words", desc: "Establish a family safe word that only your family knows. If someone calls claiming to be a relative in an emergency, ask for the code word. Pick something an outsider couldn't guess — not birthdays, pet names, or anything on social media. Teach this to elderly family members especially.", link: "https://www.staysafeonline.org/articles/why-your-family-and-coworkers-need-a-safe-word-in-the-age-of-ai", linkLabel: "National Cybersecurity Alliance — Safe Words in the Age of AI" },
      { title: "Multi-Channel Confirmation", desc: "Confirm sensitive requests through a second channel — email, Slack, in-person — before acting. Out-of-band verification makes it dramatically harder for attackers to succeed because they'd need to compromise multiple independent communication channels simultaneously.", link: "https://pages.nist.gov/800-63-4/sp800-63b/authenticators/", linkLabel: "NIST SP 800-63B — Out-of-Band Authenticators" },
    ].map((d, i) => <DefenseSubCard key={i} title={d.title} desc={d.desc} link={d.link} linkLabel={d.linkLabel} />)}
  </div>

  <SectionDivider />
  <h2 id="organizational" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Organizational Controls</h2>
  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 14 }}>Build a culture of security awareness so staff can recognize and respond to voice-based social engineering.</p>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
    {[
      { title: "Security Awareness Training", desc: "Regular training sessions on voice cloning threats — what they sound like, how they work, and how to respond. Programs like KnowBe4, SANS Security Awareness, or Proofpoint offer modules specifically on vishing and voice deepfakes. A 2025 Gartner survey found 62% of organizations reported experiencing a deepfake attack involving social engineering.", link: "https://www.knowbe4.com/products/security-awareness-training", linkLabel: "KnowBe4 — Security Awareness Training" },
      { title: "No Voice-Only Auth for High Value", desc: "Never authorize wire transfers, password resets, or access changes based solely on a phone call — regardless of who it sounds like. Implement dual control — one person receives the request, a second person authorizes the release — and verify through a known number, not one provided in the request.", link: "https://www.fourscorelaw.com/resources/wire-transfers-best-practices", linkLabel: "Fourscore Law — Wire Transfer Best Practices" },
      { title: "Voice Biometric + PIN", desc: "If using voiceprint authentication, always pair it with a second factor like a PIN or OTP. Voice alone is no longer sufficient. Under NIST SP 800-63B, biometrics — including voice — are not recognized as a standalone authenticator and must be bound to a physical authenticator in a multi-factor configuration.", link: "https://pages.nist.gov/800-63-4/sp800-63b.html", linkLabel: "NIST SP 800-63B — Digital Identity Guidelines" },
      { title: "Audit Suspicious Calls", desc: "Log and review calls that involve sensitive actions. Flag calls where the caller resisted verification or pushed urgency. Correlate voice call activity with authentication events — VoIP/SIP logs, MFA push anomalies, and remote access tool installation patterns all provide actionable signals.", link: "https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks", linkLabel: "CISA — Avoiding Social Engineering Attacks" },
    ].map((d, i) => <DefenseSubCard key={i} title={d.title} desc={d.desc} link={d.link} linkLabel={d.linkLabel} />)}
  </div>

  <SectionDivider />
  <h2 id="spectral-artifacts" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 14, scrollMarginTop: 120 }}>Spectral Artifacts to Look For</h2>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
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
  <SectionDivider />
  <div id="knowledge-check" style={{ scrollMarginTop: 120 }}><QuizBank questions={[
    { question: "Your company's CEO calls the CFO for an urgent wire transfer. What's the best first line of defense?", options: ["AI voice detector", "Personal questions", "Hang up and call CEO's known number", "Check voice against recordings"], correctIndex: 2, explanation: "Callback verification breaks the attacker's channel control." },
    { question: "You're analyzing a suspicious audio file and notice unnatural energy spikes above 8kHz. What does this likely indicate?", options: ["The microphone was too close", "Vocoder artifacts from AI-generated speech", "The audio was recorded in a large room", "Normal background noise"], correctIndex: 1, explanation: "Metallic shimmer above 8kHz is a telltale sign of neural vocoders used in AI speech generation — natural speech rolls off smoothly at high frequencies." },
    { question: "Why is voice biometrics alone insufficient?", options: ["Too expensive", "High-quality clones can fool voiceprint matching", "Requires too much data", "Only works in-person"], correctIndex: 1, explanation: "Quality clones match voiceprints. Liveness detection and MFA are essential." },
    { question: "Your elderly parent gets a frantic call from someone who sounds exactly like you, saying you're in trouble and need money wired immediately. What should they do?", options: ["Send the money — it sounds just like you", "Ask the caller for personal details", "Hang up and call you back on your known number", "Call the police immediately"], correctIndex: 2, explanation: "Callback verification is the single most effective defense against voice cloning attacks. Hanging up breaks the attacker's control of the conversation, and calling back on a known number confirms the real person's identity." },
    { question: "What is the most important organizational policy to prevent voice-based social engineering?", options: ["Install AI detection software on every phone", "Never allow sensitive actions like wire transfers or access changes based solely on a phone call", "Record all phone calls", "Only hire people with deep voices"], correctIndex: 1, explanation: "No voice-only authorization for high-value actions is the most impactful policy. It doesn't matter how convincing the clone is if the process requires a second factor or second channel to confirm." },
  ]} /></div>
</div>);

export default DefenseSection;
