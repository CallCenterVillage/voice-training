import { C, Icon, QuizBank } from "../../components";
import { StaticCard, SectionDivider } from "./_helpers";

const CombinedSection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Combined Attacks</h1>
    <p style={{ color: C.dim, lineHeight: 1.7, marginBottom: 24 }}>
      The most dangerous attacks combine voice cloning, AI exploitation, and human social engineering
      into a single coordinated operation. This is the frontier of call center threats.
    </p>

    <div id="full-kill-chain" style={{ background: C.card, border: `1px solid ${C.secondary}33`, borderRadius: 12, padding: 20, marginBottom: 20, scrollMarginTop: 120 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: C.secondary, marginBottom: 12 }}><Icon name="shield-exclamation" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />The Full Kill Chain</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { phase: "Phase 1: Recon & Voice Capture", icon: "magnifying-glass", desc: "Obtain target voice samples from earnings calls, YouTube, voicemail greetings, conferences. 10-30 seconds is sufficient for modern cloning.", tools: "OSINT tools, social media scraping, conference recordings" },
          { phase: "Phase 2: Voice Clone & Agent Setup", icon: "fingerprint", desc: "Clone the target's voice using AI tools. Set up a voice agent with the cloned voice that can interact naturally, armed with researched PII and context.", tools: "XTTS/RVC for cloning, LiveKit for real-time agent, llama.cpp for conversation" },
          { phase: "Phase 3: AI Probe", icon: "command-line", desc: "Use automated tools to probe the target organization's AI defenses. Map their IVR, discover agent capabilities, test prompt injection vectors.", tools: "Automated call scripts, systematic prompt injection testing" },
          { phase: "Phase 4: The Attack Call", icon: "phone", desc: "Call the target using the cloned voice in real-time. The AI agent handles natural conversation while the human attacker directs the strategy. Hybrid human-AI attack.", tools: "Real-time voice conversion, AI agent for consistency, human for strategy" },
          { phase: "Phase 5: Exploitation", icon: "currency", desc: "Execute the objective: wire transfer, account takeover, data extraction, credential harvesting. The cloned voice provides credibility throughout.", tools: "Depends on objective" },
        ].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, marginTop: 2 }}><Icon name={p.icon} size={24} /></div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{p.phase}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 4 }}>{p.desc}</div>
              <div style={{ fontSize: 14, color: C.highlight }}><Icon name="wrench" size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }} />{p.tools}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <SectionDivider />
    <div id="human-in-the-loop" style={{ scrollMarginTop: 120 }}><StaticCard title={<><Icon name="command-line" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 2 }} /><Icon name="user-group" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Human-in-the-Loop AI Attacks</>}>
      <p>The most sophisticated attacks use AI as a force multiplier while a human attacker makes strategic decisions:</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        {[
          { name: "AI handles small talk", desc: "Natural conversation, fillers, pleasantries — keeping the call flowing while the human plans the next move." },
          { name: "Human handles pivots", desc: "When the target gets suspicious or asks unexpected questions, the human takes over for critical moments." },
          { name: "AI maintains voice", desc: "Real-time voice conversion keeps the cloned voice consistent, even when the human speaks normally." },
          { name: "Human decides escalation", desc: "The human reads the situation and decides when to push, when to retreat, and when to end the call." },
        ].map((item, i) => (
          <div key={i} style={{ background: C.codeBg, padding: 12, borderRadius: 8 }}>
            <div style={{ color: C.secondary, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.name}</div>
            <div style={{ fontSize: 14 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </StaticCard></div>
    <SectionDivider />
    <div id="attack-scalability" style={{ scrollMarginTop: 120 }}><StaticCard title={<><Icon name="globe" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Attack Scalability: Why This Matters Now</>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: C.codeBg, padding: 14, borderRadius: 8 }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>2020: Manual SE</div>
          <div style={{ fontSize: 14, lineHeight: 1.6 }}>
            One attacker, one phone, one target at a time. Required significant skill and improvisation. Didn't scale.
          </div>
        </div>
        <div style={{ background: C.codeBg, padding: 14, borderRadius: 8 }}>
          <div style={{ color: C.tertiary, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>2025+: AI-Augmented SE</div>
          <div style={{ fontSize: 14, lineHeight: 1.6 }}>
            One attacker with AI tools can run dozens of simultaneous attacks with cloned voices, automated conversation, and real-time adaptation. Scales to thousands of targets.
          </div>
        </div>
      </div>
    </StaticCard></div>
    <SectionDivider />
    <QuizBank questions={[{ question: `In a combined AI + voice cloning + social engineering attack, which element is hardest to defend against?`, options: [
        "The voice cloning (detecting synthetic voice)",
        "The prompt injection against AI agents",
        "The social engineering against humans",
        "The combination itself — each element reinforces the others",
      ], correctIndex: 3, explanation: `The combination is greater than the sum of its parts. A cloned voice makes social engineering more convincing. AI automation makes the attack scalable. Prompt injection lets attackers bypass AI gatekeepers. And probing AI systems reveals information that helps social-engineer humans. Defending against any single vector isn't enough.` }]} />
  </div>
);

export default CombinedSection;
