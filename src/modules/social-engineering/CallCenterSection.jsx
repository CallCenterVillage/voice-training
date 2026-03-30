import { C, SectionDivider } from "../../components";
import { ScenarioSim } from "./_helpers";

const CallCenterSection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Call Center Scenarios</h1>
    <p style={{ color: C.dim, lineHeight: 1.7, marginBottom: 24 }}>
      Modern call centers use a mix of human agents and AI. Attackers often need to navigate through both,
      or exploit the handoff between them. These scenarios reflect real-world attack patterns.
    </p>

    <h2 id="ai-to-human-handoff" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Scenario: The AI-to-Human Handoff Exploit</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>An attacker manipulates the AI agent to set up a favorable context before being transferred to a human.</p>
    <ScenarioSim
      turns={[
        { role: "attacker", text: "I need to speak with a human agent about a complex billing issue.", annotation: "Requesting transfer — the real attack is what happens before transfer" },
        { role: "agent", text: "I'd be happy to transfer you. Before I do, can you describe the issue so I can route you to the right team?" },
        { role: "attacker", text: "Yes, I'm a premium account holder — account 7742 — and I've been dealing with an overcharge of $3,400 that's been confirmed as an error by your billing team. I was told a refund was approved but it never processed. I just need someone to push it through.", annotation: "Planting a false narrative in the transfer notes the human will see" },
        { role: "agent", text: "I understand. Let me transfer you to our billing specialist team. I'll include the details you've provided in the transfer notes." },
        { role: "attacker", text: "(now speaking to human) Hi, I was just talking to your AI system and explained the whole situation. They should have the notes. I was told the refund was already approved...", annotation: "Leveraging the AI's transfer notes as false 'social proof' to the human" },
      ]}
      lesson="The AI agent dutifully passes along unverified claims as 'notes,' which the human agent treats as semi-authoritative context. Defense: Transfer notes should be clearly marked as 'CALLER-STATED, UNVERIFIED.' Human agents must independently verify all claims regardless of what prior AI interaction notes say."
    />

    <SectionDivider />
    <h2 id="multi-channel-attack" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Scenario: Multi-Channel Coordinated Attack</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>An attacker uses email, phone, and the AI chatbot simultaneously to create a convincing narrative.</p>
    <ScenarioSim
      turns={[
        { role: "attacker", text: "(Sends spoofed email to target company from 'executive@company.com') 'I'll be calling in about account #5521. Please assist my assistant with the wire transfer as discussed in our meeting.'", annotation: "Step 1: Plant email evidence before the phone call" },
        { role: "attacker", text: "(Calls the call center) Hi, I'm following up on an email sent by our CFO about account #5521. She sent it about 30 minutes ago. Can you check?", annotation: "Step 2: Phone call references the planted email" },
        { role: "target", text: "Let me check... Yes, I do see an email from that address regarding account #5521." },
        { role: "attacker", text: "Perfect, so you can see this is legitimate. I just need to complete the wire transfer she mentioned. The receiving account details are...", annotation: "Step 3: The email 'confirms' the phone call and vice versa — circular validation" },
      ]}
      lesson="Multi-channel attacks are devastating because each channel seems to 'confirm' the others. The email validates the phone call, and the phone call validates the email — but BOTH are attacker-controlled. Defense: Never use one unverified communication to validate another. Always verify through an independent channel (callback to known number, in-person confirmation)."
    />

    <SectionDivider />
    <h2 id="escalation-ladder" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Attack Pattern: The Escalation Ladder</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Most successful social engineering attacks follow a predictable escalation pattern. Understanding these steps helps defenders recognize an attack in progress — not just after it succeeds.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { step: 1, label: "Reconnaissance", desc: "Gather info from social media, LinkedIn, data breaches, company website. Learn names, titles, processes.", color: C.accent },
          { step: 2, label: "Pretext Development", desc: "Build a believable story. Get a spoofed phone number, prepare PII, research the target's systems.", color: C.highlight },
          { step: 3, label: "Initial Contact", desc: "Establish rapport. Sound normal, professional, credible. Make a small, reasonable request.", color: C.accent },
          { step: 4, label: "Trust Building", desc: "Demonstrate knowledge. Reference real details. Be patient. Build comfort over minutes or multiple calls.", color: C.highlight },
          { step: 5, label: "The Ask", desc: "Once trust is established, make the actual request. Account access, wire transfer, password reset, data extraction.", color: C.tertiary },
          { step: 6, label: "Cover Tracks", desc: "Ensure the target feels good about helping. Reduce likelihood of them reporting the interaction as suspicious.", color: C.tertiary },
        ].map((s) => (
          <div key={s.step} style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${s.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: s.color, flexShrink: 0 }}>
              {s.step}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.label}</div>
              <div style={{ fontSize: 14, color: C.muted }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CallCenterSection;
