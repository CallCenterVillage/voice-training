import { C, Icon, InfoBox, NextModuleLink } from "../../components";

const LabSection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Escalation Desk CTF</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Put your social engineering skills to the test with our voice-only Capture the Flag (CTF) security challenge.
    </p>

    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "32px 32px", marginBottom: 24 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 12 }}>
        <Icon name="phone" size={20} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 8, color: C.secondary }} />
        Escalation Desk CTF
      </div>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, margin: "0 0 16px 0" }}>
        The Escalation Desk CTF is a social engineering challenge that uses voice calls exclusively — no keyboards, no terminals, just your phone/headset and your wits. It mixes both AI agents and live operators across multiple escalation tiers.
      </p>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, margin: "0 0 16px 0" }}>
        Start with AI agents to build your confidence and practice your techniques without the pressure of talking to a real person. Once you're comfortable, escalate to live operators and see if you can talk your way through. It's designed to take the social anxiety out of learning social engineering — you can fail against a robot as many times as you need before you're ready for the real thing. Climb the leaderboard, brag to your friends, and maybe even win the Golden Telephone Booth trophy.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { icon: "cpu", label: "AI Agents", desc: "Practice against automated systems — no judgment, unlimited attempts" },
          { icon: "user", label: "Live Operators", desc: "Test your skills against real people when you're ready" },
          { icon: "trending-up", label: "Escalation Tiers", desc: "Work your way up through increasingly difficult challenges" },
          { icon: "shield", label: "Safe Environment", desc: "Authorized testing — learn by doing without real-world consequences" },
        ].map(item => (
          <div key={item.label} style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <Icon name={item.icon} size={14} style={{ color: C.secondary }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{item.label}</span>
            </div>
            <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>
      <InfoBox>The Escalation Desk CTF is available on-site at Call Center Village events. Ask a village coordinator for help getting started or if you have questions about the challenge.</InfoBox>
    </div>
    <NextModuleLink href="/appendix/cli-glossary" label="Continue to the Appendix" />
  </div>
);

export default LabSection;
