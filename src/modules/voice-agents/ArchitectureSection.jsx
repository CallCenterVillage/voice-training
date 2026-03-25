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
      <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Agent Architecture</h1>
      <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
        Most voice agents today follow a similar fundamental pipeline — audio in, transcribe, think, speak, audio out. However, newer architectures are beginning to challenge this model by collapsing or eliminating steps entirely.
      </p>

      <h2 id="pipeline-overview" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12, scrollMarginTop: 120 }}>Pipeline Overview</h2>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>Click each component to learn more about the traditional voice pipeline.</p>

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

      <SectionDivider />
      <h2 id="beyond-the-pipeline" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Beyond the Traditional Pipeline</h2>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
        The STT → LLM → TTS pipeline above is well-understood and widely deployed, but it has inherent limitations — each hop adds latency, and converting between audio and text loses information like tone, emotion, and pacing. A new generation of architectures is emerging that rethinks this from the ground up.
      </p>
      <div style={{ display: "grid", gap: 20, marginBottom: 20 }}>
        {[
          { title: "Speech-Native Models", color: C.secondary, desc: "Models that process audio directly without converting to text in between — audio in, audio out. Some, like GPT-4o's voice mode, expose this as an end-to-end API. Others, like Kyutai's Moshi and Meta's Seamless, are trained from the ground up with audio tokens as a first-class part of their vocabulary alongside text. Either way, the result is the same: vocal nuance (tone, hesitation, laughter) that text transcription throws away is preserved, and latency drops by eliminating separate STT and TTS steps.", steps: ["Audio In", "Speech-Native Model", "Audio Out"] },
          { title: "Streaming Fusion", color: C.accent, desc: "Hybrid approaches that keep the pipeline structure but tightly couple the components. The STT streams partial transcripts to the LLM, which starts generating while the caller is still speaking, and TTS begins synthesizing the first words before the LLM finishes its response. LiveKit, Pipecat, and Vocode use this approach.", steps: ["Audio In", "STT", "LLM", "TTS", "Audio Out"], bidirectional: true },
        ].map((a, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${a.color}33`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: a.color, marginBottom: 6 }}>{a.title}</div>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: "0 0 14px 0" }}>{a.desc}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap", justifyContent: "center" }}>
              {a.steps.map((step, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ background: `${a.color}15`, border: `1px solid ${a.color}44`, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: a.color, whiteSpace: "nowrap" }}>{step}</div>
                  {j < a.steps.length - 1 && (
                    <div style={{ padding: "0 8px", color: `${a.color}88`, fontSize: 16, display: "flex", alignItems: "center" }}>
                      {a.bidirectional ? "⇄" : "→"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p style={{ color: C.dim, fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
        The traditional pipeline isn't going away — it's proven, debuggable, and lets you swap components independently. But as speech-native models mature, expect the lines between STT, LLM, and TTS to keep blurring. The best architecture depends on your constraints: latency requirements, hardware budget, and how much control you need over each stage.
      </p>

      <SectionDivider />
      <h2 id="latency-budget" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, marginTop: 20, scrollMarginTop: 120 }}>Latency Budget</h2>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
        Latency is one of the most important factors in whether a voice agent feels natural or robotic. For a conversation to feel truly indistinguishable from talking to another person, you should shoot for a total round trip under <strong style={{ color: C.tertiary }}>500ms</strong>. Above this threshold, callers begin to notice. Above 1 second, the conversation begins to break down. Managing your latency budget across every component of the pipeline is critical to the caller experience.
      </p>
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
          Target: &lt;500ms for natural feel. &gt;1500ms feels like talking to someone overseas. &gt;2000ms breaks conversation flow entirely.
        </div>
      </div>

      <SectionDivider />
      <h2 id="turn-taking" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Turn-Taking & Call Control</h2>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>One of the trickier problems in voice agents is knowing when to talk, when to listen, and how to keep the conversation on track. Getting this wrong makes even a fast, accurate agent feel unnatural.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { name: "Endpointing", desc: "Detecting when the caller has finished speaking. Too aggressive = interruptions. Too conservative = awkward pauses." },
          { name: "Barge-in", desc: "Allowing callers to interrupt the agent mid-speech. Essential for natural conversation but challenging to implement correctly." },
          { name: "Backchanneling", desc: "Injecting 'mm-hmm', 'I see', 'right' while the caller speaks. Makes the agent feel alive and attentive." },
          { name: "Silence Handling", desc: "What to do when the caller goes silent? Prompt them? Wait? How long? Each scenario needs different treatment." },
          { name: "Call Control", desc: "Keeping the caller on task — redirecting tangents, summarizing to confirm understanding, and guiding the conversation toward resolution without feeling pushy." },
        ].map((t, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.secondary}33`, borderRadius: 12, padding: 20 }}>
            <div style={{ color: C.secondary, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{t.name}</div>
            <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{t.desc}</div>
          </div>
        ))}
      </div>

      <SectionDivider />
      <div id="knowledge-check" style={{ scrollMarginTop: 120 }}><QuizBank questions={[{ question: `What\'s the #1 factor that determines whether a voice agent feels \'natural\'?`, options: ["Voice quality of the TTS", "Accuracy of the STT", "Total round-trip latency", "Size of the LLM"], correctIndex: 2, explanation: `While all components matter, latency is the single biggest factor in perceived naturalness. A mediocre voice with 500ms latency feels more natural than a perfect voice with 2000ms latency. Humans are extremely sensitive to conversational timing.` }, { question: `What is "barge-in" in the context of voice agent turn-taking?`, options: ["The agent speaking over the caller to correct them", "Allowing the caller to interrupt the agent mid-speech", "Injecting filler words like 'mm-hmm' while listening", "Detecting when the caller has finished speaking"], correctIndex: 1, explanation: `Barge-in is the ability for a caller to interrupt the agent while it's still speaking. It's essential for natural conversation — without it, callers are forced to wait for the agent to finish before they can respond, which feels robotic and frustrating.` }]} /></div>
    </div>
  );
}
