import { C, Icon, QuizBank } from "../../components";
import { StaticCard, SectionDivider } from "./_helpers";

const DefenseSection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Defense Playbook</h1>
    <p style={{ color: C.dim, lineHeight: 1.7, marginBottom: 24 }}>
      Comprehensive defense requires protecting both human agents and AI systems simultaneously.
      Here's the complete defensive framework for modern call centers.
    </p>

    <div id="defense-controls" style={{ display: "grid", gap: 12, marginBottom: 20, scrollMarginTop: 120 }}>
      {[
        {
          title: <><Icon name="building" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Organizational Controls</>,
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
          title: <><Icon name="user" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Human Agent Training</>,
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
          title: <><Icon name="command-line" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />AI Agent Hardening</>,
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
          title: <><Icon name="speaker-wave" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Voice & Audio Defenses</>,
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
        <div key={i} style={{ background: C.card, border: `1px solid ${section.color}33`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: section.color, marginBottom: 12 }}>{section.title}</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
            {section.items.map((item, j) => (
              <div key={j} style={{ marginBottom: 4, paddingLeft: 12, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: section.color }}><Icon name="arrow-right" size={12} /></span>
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <SectionDivider />
    <div id="verification-protocol" style={{ scrollMarginTop: 120 }}><StaticCard title={<><Icon name="clipboard" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />The 60-Second Verification Protocol</>}>
      <p>A simple, memorable protocol for any agent receiving a suspicious call:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
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
            <div style={{ fontSize: 14, color: C.text }}>{step.action}</div>
          </div>
        ))}
      </div>
    </StaticCard></div>
    <SectionDivider />
    <QuizBank questions={[{ question: `What's the single most effective defense against voice cloning + social engineering attacks?`, options: [
        "AI-powered deepfake voice detection",
        "Longer verification questionnaires",
        "Callback verification to the number on file — breaking the attacker's channel control",
        "Training agents to detect synthetic voices by ear",
      ], correctIndex: 2, explanation: `Callback verification is the gold standard because it breaks the attacker's control of the communication channel. No matter how perfect the voice clone or how convincing the pretext, if you hang up and call back the known number, the attack fails. AI detection helps but can be fooled; humans can't reliably detect good voice clones by ear.` }]} />
  </div>
);

export default DefenseSection;
