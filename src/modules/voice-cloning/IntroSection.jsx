import { C, Icon } from '../../components';

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
      {[{ label: "Duration", value: "~1 hour", icon: "clock" }, { label: "Difficulty", value: "Intermediate", icon: "trending-up" }, { label: "Prerequisites", value: "CLI & audio basics", icon: "clipboard" }].map((item, i) => (
        <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}><Icon name={item.icon} size={28} /></div>
          <div style={{ fontSize: 14, color: C.dim, fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
          <div style={{ fontSize: 16, color: C.text, fontWeight: 700 }}>{item.value}</div>
        </div>
      ))}
    </div>
    <p style={{ fontSize: 12, color: C.dim, textAlign: "center", marginBottom: 24 }}>This training is designed for 1920×1080 resolution on a desktop browser with a headset and microphone. We recommend <a href="https://librewolf.net" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>LibreWolf</a>.</p>
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

export default IntroSection;
