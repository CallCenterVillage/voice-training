import { C, Icon, QuizBank, SectionDivider, LightboxCardGrid } from "../../components";

const CombinedSection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Combined Attacks</h1>
    <p style={{ color: C.dim, lineHeight: 1.7, marginBottom: 24 }}>
      The most dangerous attacks combine voice cloning, AI exploitation, and human social engineering
      into a single coordinated operation. This is the frontier of call center threats.
    </p>

    <h2 id="full-kill-chain" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>The Full Kill Chain</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>A combined attack follows a structured sequence — each phase builds on the last. Understanding the full chain helps defenders recognize an attack at any stage.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {[
          { phase: "Phase 1: Recon & Voice Capture", icon: "magnifying-glass", desc: "Obtain target voice samples from earnings calls, YouTube, voicemail greetings, conferences. 10-30 seconds is sufficient for modern cloning.", tools: "OSINT tools, social media scraping, conference recordings" },
          { phase: "Phase 2: Voice Clone & Agent Setup", icon: "fingerprint", desc: "Clone the target's voice using AI tools. Set up a voice agent with the cloned voice that can interact naturally, armed with researched PII and context.", tools: "XTTS/RVC for cloning, LiveKit for real-time agent, llama.cpp for conversation" },
          { phase: "Phase 3: AI Probe", icon: "command-line", desc: "Use automated tools to probe the target organization's AI defenses. Map their IVR, discover agent capabilities, test prompt injection vectors.", tools: "Automated call scripts, systematic prompt injection testing" },
          { phase: "Phase 4: The Attack Call", icon: "phone", desc: "Call the target using the cloned voice in real-time. The AI agent handles natural conversation while the human attacker directs the strategy. Hybrid human-AI attack.", tools: "Real-time voice conversion, AI agent for consistency, human for strategy" },
          { phase: "Phase 5: Exploitation", icon: "currency", desc: "Execute the objective: wire transfer, account takeover, data extraction, credential harvesting. The cloned voice provides credibility throughout.", tools: "Depends on objective" },
        ].map((p, i, arr) => (
          <div key={i}>
          {i > 0 && <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "0 0 24px 0" }} />}
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, marginTop: 2 }}><Icon name={p.icon} size={24} /></div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>{p.phase}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>{p.desc}</div>
              <div style={{ fontSize: 14, color: C.highlight }}><Icon name="wrench" size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }} />{p.tools}</div>
            </div>
          </div>
          </div>
        ))}
      </div>
    </div>

    <SectionDivider />
    <h2 id="human-in-the-loop" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Human-in-the-Loop AI Attacks</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>The most sophisticated attacks use AI as a force multiplier while a human attacker makes strategic decisions.</p>
    <LightboxCardGrid items={[
      { name: "AI handles small talk", color: C.secondary, desc: "The AI agent manages natural conversation flow — fillers, pleasantries, holding patterns, and routine responses. This keeps the call sounding natural while the human attacker listens, analyzes, and plans the next strategic move. The AI never gets flustered, never forgets its cover story, and can maintain the cloned voice perfectly throughout." },
      { name: "Human handles pivots", color: C.secondary, desc: "When the target gets suspicious, asks an unexpected question, or the conversation takes an unanticipated turn, the human attacker takes over for the critical moment. Humans are still better at reading emotional cues, improvising under pressure, and making judgment calls about when to push and when to back off." },
      { name: "AI maintains voice", color: C.accent, desc: "Real-time voice conversion keeps the cloned voice consistent throughout the entire call, even when the human attacker speaks in their natural voice. The AI handles the voice transformation layer so the human can focus entirely on strategy without worrying about maintaining a vocal disguise." },
      { name: "Human decides escalation", color: C.accent, desc: "The human attacker reads the overall situation and makes strategic decisions: when to escalate the request, when to retreat and try a different angle, when to end the call and try again later, and when to push for the final objective. This judgment is what separates a successful attack from one that gets flagged." },
    ]} />

    <SectionDivider />
    <h2 id="attack-scalability" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Attack Scalability: Why This Matters Now</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>AI hasn&apos;t just made attacks more convincing — it&apos;s made them scalable. What used to require one skilled attacker per target can now be automated across thousands.</p>
    <LightboxCardGrid items={[
      { name: "2020: Manual SE", color: C.accent, desc: "One attacker, one phone, one target at a time. Required significant skill and improvisation — the attacker needed to be fluent in the target's language, understand the organization's internal processes, and think on their feet for every unexpected question. A single failed call meant hours of preparation wasted. Didn't scale beyond a handful of targets per day." },
      { name: "2025+: AI-Augmented SE", color: C.tertiary, desc: "One attacker with AI tools can run dozens of simultaneous attacks with cloned voices, automated conversation, and real-time adaptation. The AI handles language fluency, maintains consistent cover stories, and never gets tired or flustered. The human attacker supervises multiple concurrent calls, stepping in only for critical moments. Scales to thousands of targets with minimal additional effort per target." },
    ]} />

    <SectionDivider />
    <div id="knowledge-check" style={{ scrollMarginTop: 120 }}><QuizBank questions={[{ question: `In a combined AI + voice cloning + social engineering attack, which element is hardest to defend against?`, options: [
        "The voice cloning (detecting synthetic voice)",
        "The prompt injection against AI agents",
        "The social engineering against humans",
        "The combination itself — each element reinforces the others",
      ], correctIndex: 3, explanation: `The combination is greater than the sum of its parts. A cloned voice makes social engineering more convincing. AI automation makes the attack scalable. Prompt injection lets attackers bypass AI gatekeepers. And probing AI systems reveals information that helps social-engineer humans. Defending against any single vector isn't enough.` }, { question: `During a human-in-the-loop AI attack, when does the human attacker typically take direct control?`, options: [
        "During the initial greeting",
        "When the target gets suspicious or asks unexpected questions",
        "During the entire call",
        "Only at the very end",
      ], correctIndex: 1, explanation: `The AI handles routine conversation flow — small talk, pleasantries, and expected responses. The human steps in at critical pivot points: when the target pushes back, asks something unexpected, or when the attack needs to escalate. This division of labor makes the attack both scalable and adaptable.` }, { question: `Why is the "AI Probe" phase (Phase 3) of the kill chain important for the attacker?`, options: [
        "It lets them test their voice clone quality",
        "It maps the organization's AI defenses, IVR structure, and prompt injection vulnerabilities before the real attack",
        "It's required by law before making a phone call",
        "It trains the attacker's AI model",
      ], correctIndex: 1, explanation: `The probe phase is reconnaissance against the AI systems specifically. By mapping the IVR menu structure, discovering what the AI agent can do, and testing injection vectors, the attacker knows exactly how to navigate the system during the real attack. This is the AI equivalent of casing a building before a break-in.` }]} /></div>
  </div>
);

export default CombinedSection;
