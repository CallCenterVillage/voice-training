import { C, InfoBox, QuizBank } from '../../components';
import { SectionDivider } from './_helpers';

const CommercialSection = () => (<div>
  <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Commercial Voice Cloning</h2>
  <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>Understanding what's accessible with just a credit card. Keep in mind that commercial platforms may store, process, or train on your audio data — always review their privacy policies and terms of service before uploading voice samples.</p>
  <InfoBox>These companies are not sponsors or affiliated with this training or Call Center Village. They're listed for educational awareness only.<br /><span style={{ color: C.dim, fontStyle: "italic" }}>That being said, if any of you are reading this — Call Center Village is <a href="https://callcentervillage.com/sponsors" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>always looking for sponsors</a>!</span></InfoBox>
  <div id="service-providers" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, scrollMarginTop: 120 }}>
    {[
      { name: "ElevenLabs", url: "https://elevenlabs.io", logo: "/images/elevenlabs-logo.ico", color: C.accent, desc: "Industry-leading voice cloning and text-to-speech platform with real-time streaming capabilities." },
      { name: "Murf AI", url: "https://murf.ai", logo: "/images/murf-logo.ico", color: C.highlight, desc: "AI voice platform offering voice cloning, text-to-speech, and AI dubbing tools." },
      { name: "Resemble.AI", url: "https://www.resemble.ai", logo: "/images/resembleai-logo.png", color: C.tertiary, desc: "Voice cloning platform with both offensive and defensive capabilities, including deepfake detection." },
      { name: "Cartesia Sonic", url: "https://www.cartesia.ai", logo: "/images/cartesia-logo.png", logoBg: "#ffffff", color: C.secondary, desc: "Ultra-low latency voice synthesis built specifically for real-time voice agents." },
    ].map((s, i) => (
      <div key={i} style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <img src={s.logo} alt={s.name} style={{ width: 40, height: 40, borderRadius: 8, background: s.logoBg || "transparent", padding: s.logoBg ? 4 : 0 }} />
          <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 16, fontWeight: 800, color: s.color, textDecoration: "none" }}>{s.name} ↗</a>
        </div>
        <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{s.desc}</div>
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

export default CommercialSection;
