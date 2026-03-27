import { C, SectionDivider } from '../../components';
import { toAnchorId } from './_helpers';

export const seResources = [
  { name: "Cialdini's Principles of Persuasion", url: "https://www.influenceatwork.com/7-principles-of-persuasion/", desc: "Robert Cialdini's six (now seven) principles of influence — the psychological foundation behind most social engineering attacks" },
  { name: "Social Engineering: The Science of Human Hacking", url: "https://www.social-engineer.org/", desc: "Resources from Christopher Hadnagy's Social-Engineer.org including frameworks, podcasts, and training on human-side security" },
  { name: "SANS — Social Engineering Defense", url: "https://www.sans.org/white-papers/36972/", desc: "SANS whitepaper on social engineering attack methods and organizational defense strategies" },
  { name: "Vishing (Voice Phishing)", url: "https://en.wikipedia.org/wiki/Voice_phishing", desc: "Wikipedia overview of voice phishing techniques, history, and countermeasures" },
  { name: "OWASP — LLM Top 10", url: "https://genai.owasp.org/llm-top-10/", desc: "OWASP Top 10 for LLM applications — covers prompt injection, insecure output handling, and other AI-specific attack vectors" },
  { name: "Prompt Injection Attacks", url: "https://simonwillison.net/2025/Apr/9/mcp-prompt-injection/", desc: "Simon Willison's comprehensive overview of prompt injection attacks and why they matter for AI agents" },
  { name: "Pretexting", url: "https://en.wikipedia.org/wiki/Pretexting", desc: "Wikipedia overview of pretexting — creating a fabricated scenario to extract information from a target" },
  { name: "MITRE ATT&CK — Phishing for Information", url: "https://attack.mitre.org/techniques/T1598/", desc: "MITRE ATT&CK technique documentation for phishing and social engineering reconnaissance" },
  { name: "KnowBe4 — Vishing Simulations", url: "https://www.knowbe4.com/products/security-awareness-training", desc: "Security awareness training platform with vishing simulations and deepfake training modules" },
  { name: "The Art of Deception — Kevin Mitnick", url: "https://en.wikipedia.org/wiki/The_Art_of_Deception", desc: "Kevin Mitnick's classic book on how social engineering exploits human trust — essential reading for understanding the attacker mindset" },
];

const SocialEngineeringResourcesSection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Social Engineering Resources</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Books, frameworks, research, and tools for understanding social engineering — both the human psychology side and the AI/LLM attack surface. These resources complement the social engineering training module.
    </p>
    <div style={{ display: "grid", gap: 20 }}>
      {seResources.map(r => (
        <div key={r.name} id={`se-${toAnchorId(r.name)}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 20px", scrollMarginTop: 120 }}>
          <div style={{ marginBottom: 6 }}>
            <span style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>{r.name}</span>
          </div>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, margin: "0 0 8px 0" }}>{r.desc}</p>
          <div style={{ fontSize: 12 }}>
            <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>{r.url} ↗</a>
            {r.archiveUrl && <> [<a href={r.archiveUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.secondary, opacity: 0.6, textDecoration: "none" }}>archive</a>]</>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SocialEngineeringResourcesSection;
