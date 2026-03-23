import { C, CodeBlock, QuizBank, Icon } from "../../components";
import { AnimatedFlow, StaticCard, SectionDivider } from "./_helpers";

export default function LiveKitSection() {
  return (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>LiveKit & Frameworks</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Frameworks handle the hard parts: audio transport, turn-taking, STT/LLM/TTS orchestration,
      and telephony integration. LiveKit Agents is the leading open-source option.
    </p>

    <div id="livekit-agents" style={{ background: C.card, border: `1px solid ${C.secondary}33`, borderRadius: 12, padding: 20, marginBottom: 20, scrollMarginTop: 120 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.secondary, marginBottom: 12 }}>LiveKit Agents</div>
      <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>
        Open-source framework for building real-time voice (and video) AI agents. Handles WebRTC transport,
        audio routing, turn-taking, plugin system for STT/LLM/TTS, and SIP/telephony integration.
      </div>
      <AnimatedFlow nodes={[
        { icon: "phone", label: "SIP/Phone", wire: "SIP trunk" },
        { icon: "globe", label: "LiveKit Server", wire: "WebRTC" },
        { icon: "command-line", label: "Agent Worker", wire: "plugin" },
        { icon: "signal", label: "STT Plugin", wire: "text" },
        { icon: "cpu", label: "LLM Plugin", wire: "text" },
        { icon: "speaker-wave", label: "TTS Plugin" },
      ]} />
      <CodeBlock language="python" code={`# Install LiveKit Agents SDK\npip install livekit-agents livekit-plugins-openai livekit-plugins-silero\n\n# Minimal voice agent with LiveKit (Agents 1.0+ API)\nfrom livekit import agents\nfrom livekit.agents import AgentServer, AgentSession, Agent, room_io\nfrom livekit.plugins import silero\n\nclass Assistant(Agent):\n    def __init__(self):\n        super().__init__(\n            instructions="You are a helpful voice AI assistant. Keep responses concise."\n        )\n\nserver = AgentServer()\n\n@server.rtc_session(agent_name="my-agent")\nasync def my_agent(ctx: agents.JobContext):\n    session = AgentSession(\n        stt="deepgram/nova-3",           # Speech-to-text\n        llm="openai/gpt-4.1-mini",       # Brain\n        tts="cartesia/sonic-3",          # Text-to-speech\n        vad=silero.VAD.load(),           # Voice activity detection\n    )\n    await session.start(room=ctx.room, agent=Assistant())\n    await session.generate_reply(\n        instructions="Greet the user and offer your assistance."\n    )\n\nif __name__ == "__main__":\n    agents.cli.run_app(server)`} />
    </div>

    <SectionDivider />
    <div id="other-frameworks" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20, scrollMarginTop: 120 }}>
      {[
        { name: "Vocode", desc: "Open-source library for building voice agents. Supports multiple STT/LLM/TTS backends. Good Python SDK with telephony support (Twilio, Vonage).", color: C.accent },
        { name: "Pipecat", desc: "Open-source framework from Daily.co. Focuses on real-time AI pipelines. Clean abstractions for STT→LLM→TTS chains. WebRTC native.", color: C.accent },
        { name: "Vapi", desc: "Commercial voice agent platform. Handles infrastructure, telephony, and orchestration. Quick to deploy but less control.", color: C.highlight },
        { name: "Bland.ai", desc: "Commercial platform specifically for phone call agents. Provides phone numbers, handles scaling. Enterprise focused.", color: C.highlight },
      ].map((fw, i) => (
        <div key={i} style={{ background: C.card, border: `1px solid ${fw.color}33`, borderRadius: 12, padding: 14 }}>
          <div style={{ color: fw.color, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{fw.name}</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{fw.desc}</div>
        </div>
      ))}
    </div>

    <SectionDivider />
    <div id="telephony" style={{ scrollMarginTop: 120 }}>
    <StaticCard title={<><Icon name="phone" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Telephony: Connecting to Real Phone Lines</>}>
      <p>To make/receive actual phone calls, voice agents need a SIP trunk or telephony provider:</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        {[
          { name: "Twilio", desc: "Most popular. Provides phone numbers, SIP trunks, and programmable voice API." },
          { name: "Telnyx", desc: "Developer-focused alternative to Twilio. Competitive pricing, SIP trunk support, global coverage." },
          { name: "LiveKit SIP", desc: "LiveKit's built-in SIP connector. Bridges phone calls directly into LiveKit rooms." },
          { name: "FreeSWITCH", desc: "Open-source telephony platform. Self-hosted SIP server. Full control but complex setup." },
        ].map((p, i) => (
          <div key={i} style={{ background: C.codeBg, padding: 10, borderRadius: 8 }}>
            <div style={{ color: C.secondary, fontWeight: 700, fontSize: 14 }}>{p.name}</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>{p.desc}</div>
          </div>
        ))}
      </div>
    </StaticCard>
    </div>

    <SectionDivider />
    <QuizBank questions={[{ question: `What\'s the main advantage of LiveKit over building a custom WebRTC solution?`, options: ["It's the only way to do voice agents", "It handles audio transport, room management, and agent orchestration out of the box", "It's faster than any other framework", "It only works with OpenAI"], correctIndex: 1, explanation: `LiveKit provides the full infrastructure layer — WebRTC media transport, room/session management, AgentSession lifecycle, and SIP/telephony bridging. Building this from scratch would take months. LiveKit works with any STT/LLM/TTS provider, not just OpenAI.` }]} />
  </div>
  );
}
