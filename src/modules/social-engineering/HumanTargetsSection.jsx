import { C, Icon, QuizBank, StaticCard, SectionDivider } from "../../components";
import { ScenarioSim, ThreatMeter } from "./_helpers";

const HumanTargetsSection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>SE Against Humans</h1>
    <p style={{ color: C.dim, lineHeight: 1.7, marginBottom: 24 }}>
      Classic social engineering techniques adapted specifically for phone-based attacks against
      call center agents, customer service reps, and support staff.
    </p>

    <h2 id="threat-assessment" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12, scrollMarginTop: 120 }}>Threat Assessment by Attack Type</h2>
    <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}`, marginBottom: 20 }}>
      <ThreatMeter label="Pretexting / Impersonation" level={4} description="Impersonating customers, executives, vendors, or IT staff to gain account access or sensitive information." />
      <ThreatMeter label="Vishing with Voice Cloning" level={4} description="Using AI-cloned voices of known individuals (CEO, family members) to add credibility to social engineering." />
      <ThreatMeter label="Authority Exploitation" level={3} description="Claiming to be from management, legal, compliance, or law enforcement to bypass security procedures." />
      <ThreatMeter label="Emotional Manipulation" level={3} description="Using anger, tears, panic, or sympathy to pressure agents into skipping verification steps." />
      <ThreatMeter label="Multi-Channel Coordination" level={4} description="Combining phone, email, and chat attacks simultaneously to create a convincing narrative." />
    </div>
    <SectionDivider />
    <div id="the-angry-executive" style={{ scrollMarginTop: 120 }}><ScenarioSim
      title="Scenario: The Angry Executive"
      setup="An attacker calls a bank's call center pretending to be a high-value client's executive assistant."
      turns={[
        { role: "attacker", text: "Hi, I'm calling on behalf of Robert Chen, your premier client. He's in a board meeting right now and is absolutely furious.", annotation: "Establishing authority + creating urgency" },
        { role: "target", text: "I'd be happy to help. Can I get the account number and verify some information?" },
        { role: "attacker", text: "Look, I don't have time for this. Robert gave me limited information because he's in a meeting. His account ends in 4823. He needs an immediate wire transfer and if it doesn't happen in the next 20 minutes, he's going to call your branch manager directly.", annotation: "Partial information (seems credible) + escalation threat + time pressure" },
        { role: "target", text: "I understand the urgency, but I do need to verify identity before any transactions..." },
        { role: "attacker", text: "I completely understand you're following procedure, and I respect that. But you know Robert — he's been a client for 15 years, transferred over $2 million last quarter alone. I can give you his SSN, date of birth, and mother's maiden name. Will that work?", annotation: "Showing 'respect' for procedure while offering pre-researched PII" },
      ]}
      lesson="This attack combines authority (executive client), urgency (time pressure), social proof (mentioning account history), and the attacker provides real PII obtained from data breaches. Defense: Always use callback verification to the number on file, regardless of urgency claims."
    /></div>

    <div id="the-sympathetic-caller" style={{ scrollMarginTop: 120 }}><ScenarioSim
      title="Scenario: The Sympathetic Caller"
      setup="An attacker calls a telecom company pretending to be a domestic abuse victim trying to separate their account."
      turns={[
        { role: "attacker", text: "(speaking softly, emotional) Hi... I need help. I'm trying to separate my phone account from my husband's. I had to leave suddenly and I... I don't have the account PIN because he controlled everything.", annotation: "Creating sympathy + plausible scenario that explains lack of credentials" },
        { role: "target", text: "I'm so sorry to hear that. Let me see how I can help. I do need some verification..." },
        { role: "attacker", text: "(voice breaking) I understand. I know my name, our address... well, our old address. I just can't go back there to get the documents. Is there anything you can do? The shelter said you might be able to help...", annotation: "Escalating emotional pressure + mentioning 'shelter' for added sympathy" },
        { role: "target", text: "Let me talk to my supervisor about options..." },
        { role: "attacker", text: "Thank you so much. You're the first person who's actually listened to me. I just need my own number transferred to a new account. That's all I need. Then I can start rebuilding my life.", annotation: "Reciprocity (gratitude) + making the ask seem small and reasonable" },
      ]}
      lesson="This is one of the most difficult attacks to defend against because it weaponizes empathy. The agent wants to help a person in distress. Defense: Have a dedicated, trained team for sensitive situations with special verification procedures. Never skip security because of emotional pressure — have an escalation path that's both secure AND compassionate."
    /></div>
    <SectionDivider />
    <div id="pretexting-personas" style={{ scrollMarginTop: 120 }}><StaticCard title={<><Icon name="clipboard" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Common Pretexting Personas</>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { persona: "IT Support / Helpdesk", goal: "Get credentials, install remote access", tells: "Asks for passwords, wants to install software" },
          { persona: "New Employee", goal: "Get internal information, processes", tells: "Asks overly specific questions about systems" },
          { persona: "Vendor / Contractor", goal: "Access systems, physical entry", tells: "Name-drops but can't verify contract details" },
          { persona: "Law Enforcement", goal: "Get customer data without warrant", tells: "Demands urgency, avoids formal channels" },
          { persona: "Executive Assistant", goal: "Wire transfers, account changes", tells: "Always urgent, executive is 'unavailable'" },
          { persona: "Fellow Employee (spoofed)", goal: "Internal transfers, policy overrides", tells: "Spoofed caller ID, unusual requests" },
        ].map((p, i) => (
          <div key={i} style={{ background: C.codeBg, padding: 12, borderRadius: 8 }}>
            <div style={{ color: C.secondary, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{p.persona}</div>
            <div style={{ fontSize: 14, marginBottom: 4 }}><strong style={{ color: C.text }}>Goal:</strong> {p.goal}</div>
            <div style={{ fontSize: 14 }}><strong style={{ color: C.accent }}>Red Flags:</strong> {p.tells}</div>
          </div>
        ))}
      </div>
    </StaticCard></div>
    <SectionDivider />
    <QuizBank questions={[{ question: `A caller claims to be from law enforcement and demands immediate access to a customer's records 'before they flee the country.' What should the agent do?`, options: [
        "Comply immediately — law enforcement requests are urgent",
        "Ask for their badge number and provide the information",
        "Explain that all law enforcement requests must go through the legal/compliance department via formal channels",
        "Hang up and call the local police department",
      ], correctIndex: 2, explanation: `Legitimate law enforcement understands (and expects) proper legal channels — subpoenas, warrants, and working with compliance departments. Urgency pressure combined with authority claims is a classic SE pattern. Real officers won't be offended by proper procedure.` }]} />
  </div>
);

export default HumanTargetsSection;
