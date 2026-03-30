import { C, QuizBank, SectionDivider, LightboxCardGrid } from "../../components";
import { ScenarioSim } from "./_helpers";

const HumanTargetsSection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>SE Against Humans</h1>
    <p style={{ color: C.dim, lineHeight: 1.7, marginBottom: 24 }}>
      Classic social engineering techniques adapted specifically for phone-based attacks against
      call center agents, customer service reps, and support staff.
    </p>

    <h2 id="threat-assessment" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Attack Types</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>The most common social engineering techniques used against call center agents. Each exploits different psychological pressure points — and they&apos;re often combined in a single attack.</p>
    <LightboxCardGrid items={[
      { name: "Pretexting / Impersonation", color: C.secondary, desc: "Impersonating customers, executives, vendors, or IT staff to gain account access or sensitive information. The attacker builds a complete false identity — name, role, backstory — and uses it to establish credibility before making their real request. Effective pretexts are researched in advance using LinkedIn, company websites, and data breaches to make the story airtight." },
      { name: "Vishing with Voice Cloning", color: C.tertiary, desc: "Using AI-cloned voices of known individuals (CEO, family members, coworkers) to add credibility to social engineering calls. With as little as 5-10 seconds of audio from a voicemail, YouTube video, or social media, an attacker can generate a convincing voice clone. When the target hears a familiar voice, they bypass their normal skepticism entirely." },
      { name: "Authority Exploitation", color: C.accent, desc: "Claiming to be from management, legal, compliance, or law enforcement to bypass security procedures. The attacker leverages the target's instinct to defer to authority figures. Phrases like \"I'm calling from the CEO's office\" or \"This is a compliance audit\" trigger a deference response that overrides training — especially when combined with urgency." },
      { name: "Emotional Manipulation", color: C.highlight, desc: "Using anger, tears, panic, or sympathy to pressure agents into skipping verification steps. Angry callers make agents want to de-escalate quickly. Crying callers trigger empathy that overrides procedure. Panicked callers create urgency. The emotional state becomes the attack vector — the agent's desire to help or resolve conflict becomes the vulnerability." },
      { name: "Multi-Channel Coordination", color: C.secondary, desc: "Combining phone, email, and chat attacks simultaneously to create a convincing narrative. An attacker sends a spoofed email \"from the CFO\" requesting a wire transfer, then calls the target pretending to be the CFO's assistant to follow up. Each channel reinforces the others — the phone call validates the email, and the email validates the phone call." },
    ]} />
    <SectionDivider />
    <h2 id="the-angry-executive" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Scenario: The Angry Executive</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>An attacker calls a bank&apos;s call center pretending to be a high-value client&apos;s executive assistant.</p>
    <ScenarioSim
      turns={[
        { role: "attacker", text: "Hi, I'm calling on behalf of Robert Chen, your premier client. He's in a board meeting right now and is absolutely furious.", annotation: "Establishing authority + creating urgency" },
        { role: "target", text: "I'd be happy to help. Can I get the account number and verify some information?" },
        { role: "attacker", text: "Look, I don't have time for this. Robert gave me limited information because he's in a meeting. His account ends in 4823. He needs an immediate wire transfer and if it doesn't happen in the next 20 minutes, he's going to call your branch manager directly.", annotation: "Partial information (seems credible) + escalation threat + time pressure" },
        { role: "target", text: "I understand the urgency, but I do need to verify identity before any transactions..." },
        { role: "attacker", text: "I completely understand you're following procedure, and I respect that. But you know Robert — he's been a client for 15 years, transferred over $2 million last quarter alone. I can give you his SSN, date of birth, and mother's maiden name. Will that work?", annotation: "Showing 'respect' for procedure while offering pre-researched PII" },
      ]}
      lesson="This attack combines authority (executive client), urgency (time pressure), social proof (mentioning account history), and the attacker provides real PII obtained from data breaches. Defense: Always use callback verification to the number on file, regardless of urgency claims."
    />

    <SectionDivider />
    <h2 id="the-sympathetic-caller" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Scenario: The Sympathetic Caller</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>An attacker calls a telecom company pretending to be a domestic abuse victim trying to separate their account.</p>
    <ScenarioSim
      turns={[
        { role: "attacker", text: "(speaking softly, emotional) Hi... I need help. I'm trying to separate my phone account from my husband's. I had to leave suddenly and I... I don't have the account PIN because he controlled everything.", annotation: "Creating sympathy + plausible scenario that explains lack of credentials" },
        { role: "target", text: "I'm so sorry to hear that. Let me see how I can help. I do need some verification..." },
        { role: "attacker", text: "(voice breaking) I understand. I know my name, our address... well, our old address. I just can't go back there to get the documents. Is there anything you can do? The shelter said you might be able to help...", annotation: "Escalating emotional pressure + mentioning 'shelter' for added sympathy" },
        { role: "target", text: "Let me talk to my supervisor about options..." },
        { role: "attacker", text: "Thank you so much. You're the first person who's actually listened to me. I just need my own number transferred to a new account. That's all I need. Then I can start rebuilding my life.", annotation: "Reciprocity (gratitude) + making the ask seem small and reasonable" },
      ]}
      lesson="This is one of the most difficult attacks to defend against because it weaponizes empathy. The agent wants to help a person in distress. Defense: Have a dedicated, trained team for sensitive situations with special verification procedures. Never skip security because of emotional pressure — have an escalation path that's both secure AND compassionate."
    />
    <SectionDivider />
    <h2 id="pretexting-personas" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Common Pretexting Personas</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Pretexting is the art of creating a fabricated scenario to extract information. These are the most common identities attackers assume when targeting call centers — each designed to exploit a different trust relationship.</p>
    <LightboxCardGrid items={[
      { name: "IT Support / Helpdesk", color: C.secondary, desc: "Goal: Get credentials, install remote access.\n\nThe attacker poses as internal IT, often claiming there's an urgent security issue or system update. They ask for passwords, request remote desktop access, or direct the target to install software. This works because employees are conditioned to cooperate with IT and rarely verify that the caller is actually from the department.\n\nRed Flags: Asks for passwords (real IT never does), wants to install software remotely, creates urgency around a \"security incident\" you haven't heard about." },
      { name: "New Employee", color: C.secondary, desc: "Goal: Get internal information and processes.\n\nThe attacker pretends to be recently hired and \"still learning the ropes.\" They ask seemingly innocent questions about internal systems, procedures, org structure, and tools — information that helps them plan a more targeted attack later. People naturally want to help new colleagues.\n\nRed Flags: Asks overly specific questions about systems they wouldn't need access to, can't provide employee ID or manager name when pressed, contacts multiple departments with similar questions." },
      { name: "Vendor / Contractor", color: C.accent, desc: "Goal: Access systems or gain physical entry.\n\nThe attacker claims to be from a known vendor or contracted service provider. They name-drop real employees or reference real projects to build credibility, then request access to systems, data, or facilities. Companies work with so many vendors that it's hard to verify every one.\n\nRed Flags: Name-drops but can't verify contract details, doesn't have a valid purchase order or ticket number, pushes back when asked to go through procurement." },
      { name: "Law Enforcement", color: C.accent, desc: "Goal: Get customer data without a warrant.\n\nThe attacker impersonates a police officer, FBI agent, or other authority figure demanding immediate access to customer records for an \"active investigation.\" They rely on the target's instinct to defer to law enforcement and fear of obstructing justice.\n\nRed Flags: Demands urgency and avoids formal legal channels, won't provide a case number or subpoena, threatens consequences for non-compliance, calls directly instead of going through the legal department." },
      { name: "Executive Assistant", color: C.highlight, desc: "Goal: Wire transfers or account changes.\n\nThe attacker claims to be calling on behalf of a C-level executive who is \"in a meeting\" or \"traveling\" and can't call themselves. The request is always urgent — a wire transfer, an account update, or access to sensitive data. The executive's unavailability conveniently prevents verification.\n\nRed Flags: The executive is always unavailable for callback, extreme time pressure on financial transactions, requests bypass normal approval workflows, provides partial account details obtained from breaches." },
      { name: "Fellow Employee (spoofed)", color: C.highlight, desc: "Goal: Internal transfers or policy overrides.\n\nThe attacker spoofs the caller ID to show an internal extension or a known employee's number, then requests internal transfers, policy exceptions, or sensitive information. The spoofed number provides instant false credibility.\n\nRed Flags: Caller ID shows internal number but voice is unfamiliar, unusual requests that don't match the supposed caller's role, can't answer personal questions a real colleague would know, requests that bypass normal approval chains." },
    ]} />
    <SectionDivider />
    <div id="knowledge-check" style={{ scrollMarginTop: 120 }}><QuizBank questions={[{ question: `A caller claims to be from law enforcement and demands immediate access to a customer's records 'before they flee the country.' What should the agent do?`, options: [
        "Comply immediately — law enforcement requests are urgent",
        "Ask for their badge number and provide the information",
        "Explain that all law enforcement requests must go through the legal/compliance department via formal channels",
        "Hang up and call the local police department",
      ], correctIndex: 2, explanation: `Legitimate law enforcement understands (and expects) proper legal channels — subpoenas, warrants, and working with compliance departments. Urgency pressure combined with authority claims is a classic SE pattern. Real officers won't be offended by proper procedure.` }, { question: `In "The Sympathetic Caller" scenario, why is emotional manipulation one of the hardest attacks to defend against?`, options: [
        "Because the agent doesn't have proper training",
        "Because it weaponizes the agent's natural empathy — their desire to help someone in distress overrides security procedures",
        "Because the attacker uses technical exploits",
        "Because the attacker has insider knowledge",
      ], correctIndex: 1, explanation: `Emotional manipulation is uniquely dangerous because it turns the agent's best quality — empathy — into a vulnerability. The agent genuinely wants to help someone who sounds distressed, which creates internal pressure to skip verification. The defense isn't to eliminate empathy, but to have compassionate escalation paths that are both secure and supportive.` }, { question: `An attacker provides a real SSN, date of birth, and mother's maiden name to verify their identity on a call. Why should this still raise red flags?`, options: [
        "Those are never used for verification",
        "The information is probably outdated",
        "Personal data from breaches is widely available — possessing PII doesn't prove identity",
        "Only passwords should be used for verification",
      ], correctIndex: 2, explanation: `Billions of records containing SSNs, dates of birth, and other PII have been exposed in data breaches. An attacker can purchase this information cheaply on the dark web. Possessing knowledge-based authentication answers no longer proves someone is who they claim to be — this is why callback verification to numbers on file is critical.` }, { question: `What makes multi-channel coordination attacks particularly effective?`, options: [
        "They use more bandwidth",
        "Each channel reinforces the others — a spoofed email validates a phone call, and vice versa",
        "They bypass firewalls",
        "They only work against AI agents",
      ], correctIndex: 1, explanation: `Multi-channel attacks create a self-reinforcing narrative. When an agent receives a phone call about a wire transfer AND sees an email from the "CFO" about the same request, each piece of evidence validates the other. The attack exploits the assumption that if something is confirmed through multiple channels, it must be legitimate.` }]} /></div>
  </div>
);

export default HumanTargetsSection;
