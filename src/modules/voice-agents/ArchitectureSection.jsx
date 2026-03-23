import { useState } from "react";
import { C, QuizBank, Icon } from "../../components";
import { AnimatedFlow, LatencyMeter, StaticCard, SectionDivider } from "./_helpers";

export default function ArchitectureSection() {
  const [activeNode, setActiveNode] = useState(0);
  const details = [
    { title: "Caller Audio", desc: "Raw audio stream from a phone call or WebRTC connection. Typically 8kHz (PSTN) or 16-48kHz (WebRTC). This is the entry point for the entire pipeline." },
    { title: "VAD (Voice Activity Detection)", desc: "Detects when someone is speaking vs. silence. Critical for turn-taking — knowing when to start and stop listening. Tools: Silero VAD, WebRTC VAD, Cobra VAD." },
    { title: "STT (Speech-to-Text)", desc: "Converts spoken audio to text. This is the agent's 'ears'. Must be fast (streaming) and accurate. Latency here directly impacts response time." },
    { title: "LLM (Language Model)", desc: "The 'brain' of the agent. Processes transcribed text, maintains conversation context, decides what to say, and can call external tools (APIs, databases, etc.)." },
    { title: "TTS (Text-to-Speech)", desc: "Converts the LLM's text response back into audio. The agent's 'voice'. Must stream output as it's generated, not wait for the full response." },
    { title: "Caller Hears Response", desc: "The synthesized audio is streamed back to the caller. Total round-trip latency (audio in → audio out) should be <1 second for natural conversation. Optimal round-trip time is under 500ms." },
  ];
  return (
    <div>
      <h2 id="pipeline-overview" style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Agent Architecture</h2>
      <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
        Most voice agents follow a similar fundamental pipeline. Click each component to learn more.
      </p>

      <AnimatedFlow
        activeNode={activeNode}
        onNodeClick={setActiveNode}
        nodes={[
          { icon: "phone", label: "Caller Audio", latency: "", wire: "PCM" },
          { icon: "speaker-x", label: "VAD", latency: "~20ms", latencyColor: C.accent, wire: "chunks" },
          { icon: "signal", label: "STT", latency: "~200ms", latencyColor: C.accent, wire: "text" },
          { icon: "cpu", label: "LLM", latency: "~300ms", latencyColor: C.tertiary, wire: "text" },
          { icon: "speaker-wave", label: "TTS", latency: "~150ms", latencyColor: C.accent, wire: "audio" },
          { icon: "headphones", label: "Response", latency: "" },
        ]}
      />

      {activeNode >= 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.secondary}44`, borderRadius: 12, padding: 16, marginBottom: 16, transition: "all 0.3s ease" }}>
          <div style={{ color: C.secondary, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{details[activeNode].title}</div>
          <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>{details[activeNode].desc}</div>
        </div>
      )}

      <div id="latency-budget" style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12, marginTop: 20, scrollMarginTop: 120 }}>Latency Budget</div>
      <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
        <LatencyMeter label="VAD Processing" ms={20} />
        <LatencyMeter label="STT (Streaming)" ms={200} />
        <LatencyMeter label="LLM First Token" ms={300} />
        <LatencyMeter label="TTS First Audio" ms={150} />
        <LatencyMeter label="Network / Jitter" ms={80} />
        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>Total Round Trip</span>
          <span style={{ color: C.tertiary, fontWeight: 700, fontSize: 14, fontFamily: "monospace" }}>~750ms</span>
        </div>
        <div style={{ fontSize: 14, color: C.dim, marginTop: 8 }}>
          Target: &lt;1000ms for natural feel. &gt;1500ms feels like talking to someone overseas. &gt;2000ms breaks conversation flow entirely.
        </div>
        <div style={{ fontSize: 14, color: C.dim, marginTop: 8 }}>
          For humans to not notice any real difference in speech latency — where the conversation feels truly indistinguishable from talking to another person — you typically need a total round trip under <strong style={{ color: C.tertiary }}>500ms</strong>.
        </div>
      </div>

      <SectionDivider />
      <div id="turn-taking" style={{ marginTop: 20, scrollMarginTop: 120 }}>
        <StaticCard title={<><Icon name="arrow-path" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Turn-Taking: The Hardest Problem</>}>
          <p>The biggest challenge in voice agents isn't AI quality — it's knowing when to talk and when to listen.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
            {[
              { name: "Endpointing", desc: "Detecting when the caller has finished speaking. Too aggressive = interruptions. Too conservative = awkward pauses." },
              { name: "Barge-in", desc: "Allowing callers to interrupt the agent mid-speech. Essential for natural conversation but tricky to implement correctly." },
              { name: "Backchanneling", desc: "Injecting 'mm-hmm', 'I see', 'right' while the caller speaks. Makes the agent feel alive and attentive." },
              { name: "Silence Handling", desc: "What to do when the caller goes silent? Prompt them? Wait? How long? Each scenario needs different treatment." },
            ].map((t, i) => (
              <div key={i} style={{ background: C.codeBg, padding: 20, borderRadius: 8 }}>
                <div style={{ color: C.secondary, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 14 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </StaticCard>
      </div>

      <SectionDivider />
      <QuizBank questions={[{ question: `What\'s the #1 factor that determines whether a voice agent feels \'natural\'?`, options: ["Voice quality of the TTS", "Accuracy of the STT", "Total round-trip latency", "Size of the LLM"], correctIndex: 2, explanation: `While all components matter, latency is the single biggest factor in perceived naturalness. A mediocre voice with 500ms latency feels more natural than a perfect voice with 2000ms latency. Humans are extremely sensitive to conversational timing.` }, { question: `What is "barge-in" in the context of voice agent turn-taking?`, options: ["The agent speaking over the caller to correct them", "Allowing the caller to interrupt the agent mid-speech", "Injecting filler words like 'mm-hmm' while listening", "Detecting when the caller has finished speaking"], correctIndex: 1, explanation: `Barge-in is the ability for a caller to interrupt the agent while it's still speaking. It's essential for natural conversation — without it, callers are forced to wait for the agent to finish before they can respond, which feels robotic and frustrating.` }]} />
    </div>
  );
}
