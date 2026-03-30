import { C, Icon, QuizBank, SectionDivider } from "../../components";

const DefenseSection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Defense Playbook</h1>
    <p style={{ color: C.dim, lineHeight: 1.7, marginBottom: 24 }}>
      Comprehensive defense requires protecting both human agents and AI systems simultaneously.
      Here&apos;s the complete defensive framework for modern call centers.
    </p>

    <h2 id="defense-controls" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Defense Controls</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>A layered defense that covers organizational policy, human training, AI hardening, and audio-level detection. No single layer is sufficient — attackers will find the gap.</p>
    <div style={{ display: "grid", gap: 20, marginBottom: 20 }}>
      {[
        {
          title: "Organizational Controls",
          color: C.highlight,
          items: [
            "Mandatory callback verification for all financial transactions and account changes",
            "Dual authorization for high-value actions (two agents must approve)",
            "Regular SE testing / red team exercises (at least quarterly)",
            "Clear escalation paths that don't bypass security (even for 'executives')",
            "Incident reporting culture — reward reporting, never punish agents who were targeted",
            "Dedicated fraud team with authority to investigate and block in real-time",
          ],
        },
        {
          title: "Human Agent Training",
          color: C.accent,
          items: [
            "Recognize urgency/authority pressure patterns and know it's OK to slow down",
            "Never skip verification regardless of who the caller claims to be",
            "Verify through independent channels (not the channel the caller provides)",
            "Document unusual requests even if they seem resolved",
            "Practice phrases: 'I understand the urgency, and to protect your account...'",
            "Understand that attackers may use real PII from data breaches",
          ],
        },
        {
          title: "AI Agent Hardening",
          color: C.tertiary,
          items: [
            "Robust system prompts with explicit injection defenses and boundary definitions",
            "Input sanitization — filter known injection patterns from STT output",
            "Output monitoring — detect when AI responses contain sensitive data or deviate from policy",
            "Tool-call guardrails — validate all parameters, require confirmation for sensitive actions",
            "Conversation limits — max turns, max duration, automatic escalation triggers",
            "Separate AI from sensitive operations — AI handles conversation, humans authorize actions",
          ],
        },
        {
          title: "Voice & Audio Defenses",
          color: C.secondary,
          items: [
            "Deploy voice deepfake detection on incoming calls (spectral analysis, artifact detection)",
            "Voice biometrics with liveness checks (not just voiceprint matching)",
            "Audio watermark detection for known commercial cloning services",
            "Background noise analysis — synthetic audio often lacks natural ambience",
            "Multi-factor: voice alone should never be the sole authentication factor",
          ],
        },
      ].map((section, i) => (
        <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: section.color, marginBottom: 12 }}>{section.title}</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
            {section.items.map((item, j) => (
              <div key={j} style={{ marginBottom: 6, paddingLeft: 20, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, top: 3, color: section.color }}><Icon name="arrow-right" size={12} /></span>
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <SectionDivider />
    <h2 id="verification-protocol" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>The 60-Second Verification Protocol</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>A simple, memorable protocol for any agent receiving a suspicious call.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { time: "0-10s", action: "PAUSE — \"Let me verify your identity to protect your account.\"", color: C.accent },
          { time: "10-20s", action: "VERIFY — Use established verification questions. Don't accept info the caller offers.", color: C.accent },
          { time: "20-40s", action: "VALIDATE — If anything feels off, initiate callback: \"I'll call you right back at the number we have on file.\"", color: C.highlight },
          { time: "40-60s", action: "DOCUMENT — Log the interaction details regardless of outcome. Report if suspicious.", color: C.tertiary },
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ background: `${step.color}15`, border: `1px solid ${step.color}44`, borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 700, color: step.color, fontFamily: "monospace", flexShrink: 0 }}>
              {step.time}
            </div>
            <div style={{ fontSize: 14, color: C.text }}><strong style={{ color: step.color }}>{step.action.split(" — ")[0]}</strong> — {step.action.split(" — ")[1]}</div>
          </div>
        ))}
      </div>
    </div>

    <SectionDivider />
    <div id="knowledge-check" style={{ scrollMarginTop: 120 }}><QuizBank questions={[{ question: `What's the single most effective defense against voice cloning + social engineering attacks?`, options: [
        "AI-powered deepfake voice detection",
        "Longer verification questionnaires",
        "Callback verification to the number on file — breaking the attacker's channel control",
        "Training agents to detect synthetic voices by ear",
      ], correctIndex: 2, explanation: `Callback verification is the gold standard because it breaks the attacker's control of the communication channel. No matter how perfect the voice clone or how convincing the pretext, if you hang up and call back the known number, the attack fails. AI detection helps but can be fooled; humans can't reliably detect good voice clones by ear.` }, { question: `Why should organizations reward agents who report suspicious calls, even if the call turns out to be legitimate?`, options: [
        "To waste company time",
        "Because punishing false positives discourages reporting, and one unreported real attack can cause more damage than a thousand false alarms",
        "Because every call is suspicious",
        "To meet compliance quotas",
      ], correctIndex: 1, explanation: `A culture that punishes false positives creates a culture of silence. Agents who fear being reprimanded for "overreacting" will stop reporting — and the one real attack they don't report could result in a major breach. The cost of investigating a false alarm is trivial compared to the cost of a successful social engineering attack.` }, { question: `In the 60-second verification protocol, why is the VALIDATE step (initiating a callback) so important?`, options: [
        "It gives the agent time to look up the answer",
        "It breaks the attacker's control of the communication channel — they can't intercept a call to a number they don't control",
        "It's required by law",
        "It lets the agent transfer to a supervisor",
      ], correctIndex: 1, explanation: `The callback is the critical defensive move because it transfers the conversation to a channel the attacker doesn't control. The attacker can spoof their outbound caller ID, clone a voice, and provide real PII — but they can't intercept an incoming call to the real customer's phone number. This single step defeats most social engineering attacks.` }]} /></div>
  </div>
);

export default DefenseSection;
