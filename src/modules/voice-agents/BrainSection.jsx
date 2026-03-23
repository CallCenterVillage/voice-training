import { C, CodeBlock, QuizBank, Icon, InfoBox } from "../../components";
import { StaticCard, SectionDivider, SystemPromptExplainer } from "./_helpers";

export default function BrainSection() {
  return (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>The LLM Brain</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      The large language model (LLM) — also referred to as generative AI — is the decision-making center. It takes the
      text from the speech-to-text engine, generates a response, and sends it to the text-to-speech engine
      to be spoken back. It can also take actions via tool/function calling.
    </p>

    <div id="local-llms" style={{ scrollMarginTop: 120 }}>
    <StaticCard title={<><Icon name="cpu" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Local LLMs with llama.cpp</>}>
      <p>Run language models entirely on your machine. No API keys, no data leaving your network. The quality and speed of local models will depend on how powerful your machine is — more RAM and a dedicated GPU allow you to run larger, more capable models.</p>
      <CodeBlock language="bash" code={`# llama.cpp is pre-built at /opt/llama.cpp\n\n# Chat with a local LLM in the terminal\n/opt/llama.cpp/build/bin/llama-cli \\\n  -m /opt/llama.cpp/models/Llama-3.2-1B-Instruct-Q4_K_M.gguf \\\n  -cnv -p "You are a helpful assistant."\n\n# Try a smaller model\n/opt/llama.cpp/build/bin/llama-cli \\\n  -m /opt/llama.cpp/models/qwen2.5-0.5b-instruct-q4_k_m.gguf \\\n  -cnv -p "You are a helpful assistant."\n\n# Run with built-in web chat UI (like Ollama)\n/opt/llama.cpp/build/bin/llama-server \\\n  -m /opt/llama.cpp/models/Llama-3.2-1B-Instruct-Q4_K_M.gguf \\\n  --jinja --host 0.0.0.0 --port 8080 -c 0\n# Open http://localhost:8080 in your browser for a full chat interface\n\n# Run as OpenAI-compatible API server (no chat UI)\n/opt/llama.cpp/build/bin/llama-server \\\n  -m /opt/llama.cpp/models/Llama-3.2-1B-Instruct-Q4_K_M.gguf \\\n  --host 0.0.0.0 --port 8080 -c 4096\n# Any framework that works with OpenAI API works with this!\n# Use with Open WebUI, LibreChat, or your own applications`} />
    </StaticCard>
    </div>

    <SectionDivider />
    <h2 id="cloud-llm-providers" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12, scrollMarginTop: 120 }}>Cloud LLM Providers</h2>
    <InfoBox>These companies are not sponsors or affiliated with this training or Call Center Village. They're listed for educational awareness only.<br /><span style={{ color: C.dim, fontStyle: "italic" }}>That being said, if any of you are reading this — Call Center Village is <a href="https://callcentervillage.com/sponsors" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>always looking for sponsors</a>!</span></InfoBox>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
      {[
        { name: "Anthropic", url: "https://anthropic.com", logo: "/images/anthropic-logo.ico", color: C.accent, desc: "Claude model family with strong reasoning. Good for complex decision trees and tool use." },
        { name: "Cerebras", url: "https://cerebras.ai", logo: "/images/cerebras-ai.svg", color: C.highlight, desc: "Ultra-fast cloud inference for open models. Extremely low time-to-first-token." },
        { name: "OpenRouter", url: "https://openrouter.ai", logo: "/images/openrouter-logo.ico", color: C.tertiary, desc: "Unified API gateway for multiple LLM providers. Access hundreds of models through a single endpoint." },
        { name: "OpenAI", url: "https://help.openai.com/en/articles/7232927-how-do-i-cancel-my-chatgpt-subscription", logo: "/images/OpenAI-white-monoblossom.png", color: C.secondary, desc: "GPT model family with native function calling. Fast and affordable options for voice agents.", strikethrough: true },
      ].map((svc, i) => (
        <div key={i} style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <img src={svc.logo} alt={svc.name} style={{ width: 40, height: 40, borderRadius: 8 }} />
            <a href={svc.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 16, fontWeight: 800, color: svc.color, textDecoration: svc.strikethrough ? "line-through" : "none" }}>{svc.name} ↗</a>
          </div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{svc.desc}</div>
        </div>
      ))}
    </div>
    <p style={{ fontSize: 12, color: C.dim, textAlign: "center", marginTop: 16 }}>Have a suggestion for a cloud LLM provider to include here? Email us at <a href="mailto:support@callcentervillage.com" style={{ color: C.accent, textDecoration: "underline" }}>support@callcentervillage.com</a></p>

    <SectionDivider />
    <h2 id="system-prompts" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>System Prompts</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>
      A system prompt is the set of instructions you give to an LLM before it interacts with a user. It defines the model's personality, rules, capabilities, and boundaries — essentially telling it who it is and how to behave. Every LLM-powered application uses one, whether it's a chatbot, a coding assistant, or a voice agent. For voice agents specifically, system prompts need extra considerations because the output is spoken aloud, not read on a screen.
    </p>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>
      Earlier, we used <code style={{ background: `${C.secondary}15`, border: `1px solid ${C.secondary}33`, padding: "2px 8px", borderRadius: 4, fontSize: 13, color: C.text }}>-p "You are a helpful assistant."</code> when chatting with llama.cpp — that's a system prompt too, just an extremely simple one. For a general-purpose chat, that's fine. But for a voice agent handling real calls, you need much more detail: rules about how to speak, what tools are available, guardrails for safety, and instructions for when things go wrong.
    </p>
    <StaticCard title={<><Icon name="wrench" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Example: Voice Agent System Prompt</>}>
      <p>Voice agent system prompts need special considerations compared to text chatbots. Hover over each section to learn why it matters:</p>
      <SystemPromptExplainer />
    </StaticCard>
    <InfoBox>A well-crafted system prompt is one of the most valuable parts of your voice agent — it's what sets your agent apart from everyone else's. Treat system prompts like code: save them, put them in version control, iterate on them, and test changes carefully. A great prompt is the difference between a demo and a product.</InfoBox>
    <p style={{ fontSize: 13, color: C.dim, marginTop: 12 }}>For a deeper dive into voice agent prompting, see the <a href="https://elevenlabs.io/docs/eleven-agents/best-practices/prompting-guide" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>ElevenLabs Prompting Guide</a>.</p>

    <SectionDivider />
    <div id="streaming-latency" style={{ scrollMarginTop: 120 }}>
    <StaticCard title={<><Icon name="bolt" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Streaming: The Key to Low Latency</>}>
      <p>
        The secret to fast voice agents is <strong style={{ color: C.text }}>streaming everywhere</strong>.
        <br /><br />Don't wait for the LLM to finish generating before sending to TTS. Stream token-by-token:
      </p>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 8 }}>With Streaming</div>
      <div style={{ margin: "0 0 16px 0" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 12, color: C.dim }}>
          <span style={{ width: 80 }} />
          {["0ms", "300ms", "600ms", "900ms", "1200ms", "1500ms"].map((t, i) => (
            <span key={i} style={{ flex: 1, textAlign: "center" }}>{t}</span>
          ))}
        </div>
        {[
          { label: "LLM", color: C.accent, segments: [
            { start: 0, width: 8, text: "Sure," },
            { start: 10, width: 8, text: "I can" },
            { start: 20, width: 10, text: "help you" },
            { start: 32, width: 10, text: "with that." },
          ]},
          { label: "TTS", color: C.secondary, segments: [
            { start: 6, width: 8, text: "Sure," },
            { start: 16, width: 8, text: "I can" },
            { start: 26, width: 10, text: "help you" },
            { start: 38, width: 10, text: "with that." },
          ]},
          { label: "Caller hears", color: C.tertiary, segments: [
            { start: 20, width: 18, text: "Sure," },
            { start: 40, width: 18, text: "I can" },
            { start: 60, width: 18, text: "help you" },
            { start: 80, width: 18, text: "with that." },
          ]},
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ width: 80, fontSize: 13, fontWeight: 700, color: row.color, textAlign: "right", flexShrink: 0 }}>{row.label}</span>
            <div style={{ flex: 1, position: "relative", height: 28, background: C.codeBg, borderRadius: 4 }}>
              {row.segments.map((seg, j) => (
                <div key={j} style={{
                  position: "absolute", left: `${seg.start}%`, width: `${seg.width}%`, top: 2, bottom: 2,
                  background: `${row.color}30`, border: `1px solid ${row.color}66`, borderRadius: 4,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 600, color: row.color, fontFamily: "monospace",
                  overflow: "hidden", whiteSpace: "nowrap", padding: "0 4px",
                }}>{seg.text}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p>By streaming token-by-token, the TTS can start generating audio before the LLM has finished its response. This dramatically reduces the time-to-first-token — the caller starts hearing a response in under 500ms, even though the full phrase takes 1-2 seconds to finish saying. Without streaming, the caller would have to wait for the entire LLM response before hearing anything.</p>

      <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "32px 0" }} />

      <div style={{ fontSize: 14, fontWeight: 700, color: C.tertiary, marginTop: 16, marginBottom: 8 }}>Without Streaming</div>
      <div style={{ margin: "0 0 24px 0" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 12, color: C.dim }}>
          <span style={{ width: 80 }} />
          {["0s", "2s", "4s", "6s", "8s", "10s", "12s", "13s"].map((t, i) => (
            <span key={i} style={{ flex: 1, textAlign: "center" }}>{t}</span>
          ))}
        </div>
        {[
          { label: "LLM", color: C.accent, segments: [
            { start: 0, width: 62, text: "Generating full response... (~8s)" },
          ]},
          { label: "TTS", color: C.secondary, segments: [
            { start: 62, width: 15, text: "Synthesize (~2s)" },
          ]},
          { label: "Caller hears", color: C.tertiary, segments: [
            { start: 0, width: 77, text: "Silence... waiting..." },
            { start: 77, width: 23, text: "Full response (~3s)" },
          ]},
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ width: 80, fontSize: 13, fontWeight: 700, color: row.color, textAlign: "right", flexShrink: 0 }}>{row.label}</span>
            <div style={{ flex: 1, position: "relative", height: 28, background: C.codeBg, borderRadius: 4 }}>
              {row.segments.map((seg, j) => (
                <div key={j} style={{
                  position: "absolute", left: `${seg.start}%`, width: `${seg.width}%`, top: 2, bottom: 2,
                  background: seg.text.includes("Silence") ? "transparent" : `${row.color}30`,
                  border: seg.text.includes("Silence") ? "none" : `1px solid ${row.color}66`,
                  borderRadius: 4,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 600, color: seg.text.includes("Silence") ? C.dim : row.color, fontFamily: "monospace",
                  overflow: "hidden", whiteSpace: "nowrap", padding: "0 4px",
                  fontStyle: seg.text.includes("Silence") ? "italic" : "normal",
                }}>{seg.text}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p>Try it yourself — these examples chain an LLM response directly into TTS. Notice how you have to wait for the full LLM generation to complete before you hear anything:</p>
      <CodeBlock language="bash" code={`# LLM → Piper TTS (non-streaming, fast but lower quality)\ntime /opt/llama.cpp/build/bin/llama-simple \\\n  -m /opt/llama.cpp/models/llama-3.2-3b-instruct-q4_k_m.gguf \\\n  -p "Tell me a funny joke not about a chicken" \\\n  2>/dev/null \\\n  | tail -n +2 \\\n  | piper --model /opt/piper/models/en_US-lessac-medium.onnx --output_raw \\\n  | aplay -r 22050 -f S16_LE\n\n# LLM → Kokoro TTS (non-streaming, slower but much higher quality)\ntime /opt/llama.cpp/build/bin/llama-simple \\\n  -m /opt/llama.cpp/models/llama-3.2-3b-instruct-q4_k_m.gguf \\\n  -p "Tell me a funny joke not about a chicken" \\\n  2>/dev/null \\\n  | tail -n +2 \\\n  | kokoro \\\n  | aplay -r 24000 -f S16_LE`} />
      <p>On these laptops, you'll experience a <strong style={{ color: C.tertiary }}>10-13 second delay</strong> of silence before hearing anything — imagine being on a phone call and waiting that long for a response.</p>
      <div style={{ background: `${C.secondary}10`, border: `1px solid ${C.secondary}44`, borderRadius: 10, padding: 16, marginTop: 16, display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ fontSize: 32, flexShrink: 0 }}><Icon name="bolt" size={32} /></div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.secondary, marginBottom: 4 }}>This is exactly the problem LiveKit solves</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>Frameworks like LiveKit handle token-level chunking, sentence boundary detection, and streaming orchestration — turning this painful 13-second delay into sub-second response times. We'll build with it in the next section.</div>
        </div>
      </div>
    </StaticCard>
    </div>

    <SectionDivider />
    <QuizBank questions={[{ question: `Why is streaming token-by-token from the LLM to TTS critical for voice agents?`, options: ["It improves accuracy", "It reduces memory usage", "The time to first audio generation is lower", "It makes the voice sound better"], correctIndex: 2, explanation: `Streaming is the key to low latency. By sending tokens to TTS as they're generated (instead of waiting for the full response), the caller starts hearing audio while the LLM is still thinking. This overlapping pipeline is why total latency can be lower than the individual components sum.` }, { question: `Why should a voice agent system prompt include a "Guardrails" section?`, options: ["It makes the prompt longer which improves quality", "Models are tuned to pay extra attention to guardrail instructions, and it centralizes non-negotiable rules for easier auditing", "It's required by the Anthropic API", "Guardrails only matter for text chatbots, not voice agents"], correctIndex: 1, explanation: `A dedicated Guardrails section centralizes all non-negotiable rules — like never guessing information or always verifying identity before sharing account details. Models are tuned to pay extra attention to this heading, and having all compliance rules in one place makes them easier to audit and update.` }, { question: `What is the main tradeoff between running a local LLM versus using a cloud LLM provider?`, options: ["Local LLMs are always faster", "Cloud LLMs are free to use", "Local LLMs keep data private but are limited by your hardware; cloud LLMs are faster but your data leaves your network", "There is no meaningful difference"], correctIndex: 2, explanation: `Running locally with llama.cpp means no data leaves your machine — full privacy. But you're limited by your CPU/GPU, so larger models run slowly. Cloud providers like Anthropic or OpenRouter offer faster inference and bigger models, but your conversation data is sent to their servers.` }]} />
  </div>
  );
}
