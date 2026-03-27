import { C, CodeBlock, QuizBank, Icon, InfoBox, SectionDivider, LightboxCardGrid } from "../../components";
import { AnimatedFlow } from "./_helpers";

const OS_FRAMEWORKS = [
  { name: "Vocode", desc: "Open-source library for building voice agents. Supports multiple STT/LLM/TTS backends. Good Python SDK with telephony support (Twilio, Vonage).", color: C.accent },
  { name: "Pipecat", desc: "Open-source framework from Daily.co. Focuses on real-time AI pipelines. Clean abstractions for STT→LLM→TTS chains. WebRTC native.", color: C.accent },
];

const COMMERCIAL_PLATFORMS = [
  { name: "Vapi", desc: "Commercial voice agent platform. Handles infrastructure, telephony, and orchestration. Quick to deploy but less control over the underlying stack.", color: C.highlight },
  { name: "Bland.ai", desc: "Commercial platform specifically for phone call agents. Provides phone numbers, handles scaling. Enterprise focused.", color: C.highlight },
  { name: "ElevenLabs Conversational AI", desc: "End-to-end voice agent platform from ElevenLabs. Combines their industry-leading TTS with built-in STT, LLM orchestration, and telephony — all managed.", color: C.highlight },
  { name: "Retell AI", desc: "Voice agent platform focused on production deployments. Handles orchestration, latency optimization, and telephony integration out of the box.", color: C.highlight },
  { name: "Voiceflow", desc: "Conversation design platform for building and deploying voice and chat agents. Visual builder with integrations for telephony and messaging channels.", color: C.highlight },
];

export default function LiveKitSection() {
  return (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>LiveKit & Frameworks</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Frameworks handle the hard parts: audio transport, turn-taking, STT/LLM/TTS orchestration,
      and telephony integration. LiveKit Agents is one of the leading open-source options.
    </p>

    <h2 id="livekit-agents" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>LiveKit Agents</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
      Open-source framework for building real-time voice (and video) AI agents. Handles WebRTC transport,
      audio routing, turn-taking, plugin system for STT/LLM/TTS, and SIP/telephony integration.
    </p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <AnimatedFlow nodes={[
        { icon: "phone", label: "SIP/Phone" },
        { icon: "globe", label: "LiveKit Server" },
        { icon: "command-line", label: "Agent Worker" },
        { icon: "signal", label: "STT Plugin" },
        { icon: "cpu", label: "LLM Plugin" },
        { icon: "speaker-wave", label: "TTS Plugin" },
      ]} />
      <CodeBlock language="python" code={`# Install LiveKit Agents SDK\npip install livekit-agents livekit-plugins-openai livekit-plugins-silero\n\n# Minimal voice agent with LiveKit (Agents 1.0+ API)\nfrom livekit import agents\nfrom livekit.agents import AgentServer, AgentSession, Agent, room_io\nfrom livekit.plugins import silero\n\nclass Assistant(Agent):\n    def __init__(self):\n        super().__init__(\n            instructions="You are a helpful voice AI assistant. Keep responses concise."\n        )\n\nserver = AgentServer()\n\n@server.rtc_session(agent_name="my-agent")\nasync def my_agent(ctx: agents.JobContext):\n    session = AgentSession(\n        stt="deepgram/nova-3",           # Speech-to-text\n        llm="openai/gpt-4.1-mini",       # Brain\n        tts="cartesia/sonic-3",          # Text-to-speech\n        vad=silero.VAD.load(),           # Voice activity detection\n    )\n    await session.start(room=ctx.room, agent=Assistant())\n    await session.generate_reply(\n        instructions="Greet the user and offer your assistance."\n    )\n\nif __name__ == "__main__":\n    agents.cli.run_app(server)`} />
    </div>

    <SectionDivider />
    <h2 id="other-frameworks" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Other Open-Source Frameworks</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>LiveKit isn&apos;t the only open-source option. These frameworks offer similar capabilities with different tradeoffs around architecture and ecosystem.</p>
    <LightboxCardGrid items={OS_FRAMEWORKS} />
    <p style={{ fontSize: 12, color: C.dim, textAlign: "center", marginTop: 16 }}>Have a suggestion for a framework to include here? Email us at <a href="mailto:support@callcentervillage.com" style={{ color: C.accent, textDecoration: "underline" }}>support@callcentervillage.com</a></p>

    <SectionDivider />
    <h2 id="commercial-platforms" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Commercial Voice Agent Platforms</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Managed platforms that handle infrastructure, orchestration, and telephony for you. Faster to deploy but less control over the underlying stack.</p>
    <InfoBox>These companies are not sponsors or affiliated with this training or Call Center Village. They're listed for educational awareness only.<br /><span style={{ color: C.dim, fontStyle: "italic" }}>That being said, if any of you are reading this — Call Center Village is <a href="https://callcentervillage.com/sponsors" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>always looking for sponsors</a>!</span></InfoBox>
    <LightboxCardGrid items={COMMERCIAL_PLATFORMS} />
    <p style={{ fontSize: 12, color: C.dim, textAlign: "center", marginTop: 16 }}>Have a suggestion for a platform to include here? Email us at <a href="mailto:support@callcentervillage.com" style={{ color: C.accent, textDecoration: "underline" }}>support@callcentervillage.com</a></p>

    <SectionDivider />
    <h2 id="telephony" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Telephony: Open-Source Infrastructure</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Self-hosted telephony infrastructure for full control over your voice pipeline. These tools handle SIP signaling, media routing, and call management — all running on your own servers.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { name: "LiveKit SIP", desc: "LiveKit's built-in SIP connector. Bridges phone calls directly into LiveKit rooms." },
          { name: "FreeSWITCH", desc: "Open-source telephony platform. Self-hosted SIP server. Full control but complex setup." },
          { name: "Asterisk", desc: "The original open-source PBX. Mature, widely deployed, huge community. Powers many call centers and IVR systems." },
          { name: "Kamailio", desc: "High-performance open-source SIP proxy and server. Handles routing, load balancing, and SIP signaling at scale." },
          { name: "RTPEngine", desc: "Open-source media proxy for RTP traffic. Often paired with Kamailio to handle audio/video relay, transcoding, and NAT traversal." },
          { name: "OpenSIPS", desc: "Open-source SIP server focused on speed and flexibility. Used for large-scale VoIP routing, load balancing, and fraud detection." },
        ].map((p, i) => (
          <div key={i} style={{ background: C.codeBg, padding: 16, borderRadius: 8 }}>
            <div style={{ color: C.secondary, fontWeight: 700, fontSize: 14 }}>{p.name}</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
    <p style={{ fontSize: 12, color: C.dim, textAlign: "center", marginTop: 16 }}>Have a suggestion for a telephony tool to include here? Email us at <a href="mailto:support@callcentervillage.com" style={{ color: C.accent, textDecoration: "underline" }}>support@callcentervillage.com</a></p>

    <SectionDivider />
    <h2 id="telephony-providers" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Telephony API Providers</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Cloud services that provide phone numbers, SIP trunks, and programmable voice APIs. These handle the carrier side so you don&apos;t have to manage your own telecom infrastructure.</p>
    <InfoBox>These companies are not sponsors or affiliated with this training or Call Center Village. They're listed for educational awareness only.<br /><span style={{ color: C.dim, fontStyle: "italic" }}>That being said, if any of you are reading this — Call Center Village is <a href="https://callcentervillage.com/sponsors" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>always looking for sponsors</a>!</span></InfoBox>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { name: "Twilio", desc: "Most popular. Provides phone numbers, SIP trunks, and programmable voice API. Huge ecosystem and documentation." },
          { name: "Telnyx", desc: "Developer-focused alternative to Twilio. Competitive pricing, SIP trunk support, global coverage." },
          { name: "Plivo", desc: "Cloud communications platform with voice and SMS APIs. Competitive pricing and global carrier network." },
          { name: "Vonage", desc: "Programmable voice and SIP trunking APIs. Strong international coverage and WebRTC support." },
          { name: "Bandwidth", desc: "Direct carrier with APIs. Owns its own network infrastructure, which can mean lower latency and better pricing at scale." },
          { name: "SignalWire", desc: "Founded by the creators of FreeSWITCH. Cloud telephony with a developer-friendly API and strong open-source roots." },
        ].map((p, i) => (
          <div key={i} style={{ background: C.codeBg, padding: 16, borderRadius: 8 }}>
            <div style={{ color: C.secondary, fontWeight: 700, fontSize: 14 }}>{p.name}</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
    <p style={{ fontSize: 12, color: C.dim, textAlign: "center", marginTop: 16 }}>Have a suggestion for a telephony provider to include here? Email us at <a href="mailto:support@callcentervillage.com" style={{ color: C.accent, textDecoration: "underline" }}>support@callcentervillage.com</a></p>

    <SectionDivider />
    <div id="knowledge-check" style={{ scrollMarginTop: 120 }}><QuizBank questions={[{ question: `What\'s the main advantage of LiveKit over building a custom WebRTC solution?`, options: ["It's the only way to do voice agents", "It handles audio transport, room management, and agent orchestration out of the box", "It's faster than any other framework", "It only works with OpenAI"], correctIndex: 1, explanation: `LiveKit provides the full infrastructure layer — WebRTC media transport, room/session management, AgentSession lifecycle, and SIP/telephony bridging. Building this from scratch would take months. LiveKit works with any STT/LLM/TTS provider, not just OpenAI.` }]} /></div>
  </div>
  );
}
