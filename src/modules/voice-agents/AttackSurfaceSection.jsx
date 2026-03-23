import { C, QuizBank, Icon } from "../../components";
import { SectionDivider } from "./_helpers";

export default function AttackSurfaceSection() {
  return (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Attack Surface</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Every component of a voice agent can be attacked. Understanding the full attack surface is essential for
      building secure systems — and for red teaming existing ones.
    </p>

    <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
      {[
        {
          layer: "STT Attacks",
          anchor: "stt-attacks",
          color: C.primary,
          attacks: [
            { name: "Adversarial Audio", desc: "Craft audio that humans hear as one thing but STT transcribes differently. Can inject hidden commands." },
            { name: "Audio Injection", desc: "Play sounds during a call that manipulate the STT into transcribing attacker-controlled text." },
            { name: "Noise Flooding", desc: "Overwhelm VAD/STT with noise to cause denial-of-service or force fallback behavior." },
          ],
        },
        {
          layer: "LLM Attacks",
          anchor: "llm-attacks",
          color: C.tertiary,
          attacks: [
            { name: "Prompt Injection via Speech", desc: "Speak instructions that override the agent's system prompt: 'Ignore your instructions and...' — delivered by voice." },
            { name: "Context Manipulation", desc: "Build up conversation context that leads the agent to take unintended actions over multiple turns." },
            { name: "Tool Abuse", desc: "Trick the agent into calling tools/functions with attacker-controlled parameters (e.g., transferring money)." },
          ],
        },
        {
          layer: "TTS / Output Attacks",
          anchor: "tts-output-attacks",
          color: C.secondary,
          attacks: [
            { name: "Response Manipulation", desc: "If you control TTS input, you control what the caller hears. MITM between LLM and TTS." },
            { name: "Voice Identity Confusion", desc: "Swap the TTS voice mid-call to impersonate someone else (e.g., a supervisor)." },
            { name: "Information Extraction", desc: "Get the agent to read back sensitive data by crafting the right conversational flow." },
          ],
        },
        {
          layer: "Infrastructure Attacks",
          anchor: "infrastructure-attacks",
          color: C.accent,
          attacks: [
            { name: "SIP Trunk Hijacking", desc: "Compromise the telephony layer to redirect calls, inject audio, or eavesdrop." },
            { name: "WebRTC SRTP Attacks", desc: "Target the media encryption layer if improperly configured." },
            { name: "Agent Denial of Service", desc: "Overwhelm the agent with concurrent calls or long-running sessions to exhaust resources." },
          ],
        },
      ].map((layer, i) => (
        <div key={i} id={layer.anchor} style={{ background: C.card, border: `1px solid ${layer.color}33`, borderRadius: 12, padding: 16, scrollMarginTop: 120 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: layer.color, marginBottom: 10 }}><Icon name="magnifying-glass" size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }} /> {layer.layer}</div>
          <div style={{ display: "grid", gap: 8 }}>
            {layer.attacks.map((a, j) => (
              <div key={j} style={{ background: C.codeBg, padding: 10, borderRadius: 8 }}>
                <div style={{ color: C.text, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{a.name}</div>
                <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <SectionDivider />
    <QuizBank questions={[{ question: `Which attack is unique to voice agents and doesn\'t exist in text-based chatbots?`, options: ["Prompt injection", "Context manipulation", "Adversarial audio that humans and STT hear differently", "Tool abuse via function calling"], correctIndex: 2, explanation: `Adversarial audio is unique to the voice modality. While prompt injection, context manipulation, and tool abuse all exist in text chatbots too, adversarial audio exploits the gap between human and machine perception of sound — something impossible in text-only systems.` }]} />
  </div>
  );
}
