import { C, CodeBlock, QuizBank, Icon, InfoBox, SectionDivider } from "../../components";

const h2 = { fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 };
const intro = { color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 16 };
const link = { color: C.accent, textDecoration: "underline" };
const code = { background: C.codeBg, padding: "2px 6px", borderRadius: 4, fontSize: 12 };

// Brand fills fail AA as text, so map them to their text-safe tints.
const textSafe = c => ({ [C.secondary]: C.secondaryText, [C.highlight]: C.accent, [C.primary]: C.primaryText }[c] ?? c);

// Licenses are shown per model because "open weights" ranges from CC-BY to
// research-only — the difference decides whether a lab can reuse the model.
const ModelCard = ({ name, org, released, license, size, hw, color = C.secondary, warn, sources, children }) => (
  <div style={{ background: C.card, border: `1px solid ${color}33`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: textSafe(color) }}>{name} <span style={{ color: C.dim, fontWeight: 500, fontSize: 13 }}>· {org} · {released}</span></h3>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "10px 0 12px" }}>
      {[license, size, hw].filter(Boolean).map((t, i) => (
        <span key={i} style={{ background: `${color}15`, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px", fontSize: 12, color: textSafe(color) }}>{t}</span>
      ))}
    </div>
    <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: 0 }}>{children}</p>
    {warn && (
      <div style={{ background: `${C.tertiary}15`, border: `1px solid ${C.tertiary}44`, borderRadius: 6, padding: "8px 12px", marginTop: 12, fontSize: 13, color: C.tertiary, display: "flex", alignItems: "flex-start", gap: 8 }}><Icon name="warning" size={14} style={{ flexShrink: 0, marginTop: 2 }} /><span>{warn}</span></div>
    )}
    <div style={{ fontSize: 12, color: C.dim, marginTop: 10 }}>
      Sources:{" "}
      {sources.map(([label, href], i) => (
        <span key={href}>{i > 0 && " · "}<a href={href} target="_blank" rel="noopener noreferrer" style={link}>{label}</a></span>
      ))}
    </div>
  </div>
);

const Table = ({ headers, rows }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {headers.map(h => (
              <th key={h} style={{ padding: 8, textAlign: "left", color: C.secondary, fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.codeBg}` }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: 8, color: j === 0 ? C.text : C.muted, verticalAlign: "top" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Flow = ({ steps, color }) => (
  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center", rowGap: 8 }}>
    {steps.map((step, j) => (
      <div key={j} style={{ display: "flex", alignItems: "center" }}>
        <div style={{ background: `${color}15`, border: `1px solid ${color}44`, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: textSafe(color), whiteSpace: "nowrap" }}>{step}</div>
        {j < steps.length - 1 && <div style={{ padding: "0 8px", color: `${color}88`, fontSize: 16 }}>→</div>}
      </div>
    ))}
  </div>
);

export default function SpeechToSpeechSection() {
  return (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Speech-to-Speech Models</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Everything so far chains three models together: STT turns audio into text, the LLM answers in text, and TTS turns it back into audio.
      A newer class of open-weight models collapses that loop into a single network that listens and speaks directly. Some of them listen while they talk, too.
      This page covers what exists in the open-weight world as of September 2026, what it takes to run each model locally, and why it matters to anyone defending a phone line.
    </p>

    <h2 id="what-is-s2s" style={h2}>What &quot;Voice-to-Voice&quot; Means</h2>
    <p style={intro}>&quot;Voice-to-voice&quot; gets used for three quite different things. Only the first one replaces the pipeline.</p>
    <div style={{ display: "grid", gap: 16, marginBottom: 20 }}>
      {[
        { title: "End-to-end speech models", color: C.secondary, steps: ["Caller Audio", "One Speech Model", "Agent Audio"], desc: "A single model takes audio tokens in and produces audio tokens out, usually with an internal text stream it \"thinks\" in. Tone, hesitation and laughter survive, and there is no STT → TTS handoff to wait on. This page is mostly about these." },
        { title: "Speech-in, text-out models", color: C.highlight, steps: ["Caller Audio", "Audio LLM", "Text", "TTS"], desc: "Models like Ultravox understand audio directly but only answer in text, so you still need a TTS. They remove the STT hop, not the whole loop." },
        { title: "Voice conversion", color: C.tertiary, steps: ["Your Voice", "VC Model", "Target Voice"], desc: <>Tools like RVC, Seed-VC and OpenVoice don&apos;t understand or answer anything. They re-skin one person&apos;s speech so it sounds like another person, in real time. That is the classic live-deepfake vishing tool, covered in <a href="/voice-cloning/local-tools" style={link}>Voice Cloning → Local Tools</a>.</> },
      ].map((a, i) => (
        <div key={i} style={{ background: C.card, border: `1px solid ${a.color}33`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: textSafe(a.color) }}>{a.title}</h3>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: "0 0 14px 0" }}>{a.desc}</p>
          <Flow steps={a.steps} color={a.color} />
        </div>
      ))}
    </div>

    <SectionDivider />
    <h2 id="full-duplex" style={h2}>Full-Duplex Models</h2>
    <p style={intro}>
      Full-duplex models listen and speak at the same time, like a person on a phone call. They can be interrupted mid-sentence, drop in &quot;mm-hm&quot; backchannels, and reply in roughly 200 ms.
      That is faster than most humans, and far below the ~750 ms budget of the cascaded pipeline in <a href="/voice-agents/architecture#latency-budget" style={link}>Agent Architecture</a>.
    </p>

    <ModelCard name="Moshi" org="Kyutai" released="Sep 2024" license="Code MIT (Python) + Apache-2.0 (Rust) · Weights CC-BY 4.0" size="7B" hw="~16 GB VRAM (bf16), less quantized · Mac via MLX"
      sources={[["GitHub", "https://github.com/kyutai-labs/moshi"], ["Paper (arXiv 2410.00037)", "https://arxiv.org/abs/2410.00037"]]}>
      The first open full-duplex speech model, and still the easiest one to run. It models the user&apos;s audio and its own audio as two parallel streams, plus an &quot;inner monologue&quot; text stream.
      Kyutai reports 160 ms theoretical latency and about 200 ms in practice. It ships two fixed voices, Moshiko (male) and Moshika (female), and speaks English only.
      The backbone is small, so expect chatty rather than smart. It is a great demo of <em>how natural</em> a machine can sound, not a capable agent.
    </ModelCard>

    <ModelCard name="Moshika-RL" org="Kyutai" released="Jun 2026" license="Weights CC BY-NC 4.0" size="7B" hw="Same as Moshi" color={C.tertiary}
      warn="Gated, non-commercial weights that the model card limits to research use, and it explicitly forbids impersonating people. Fine for a classroom demo; don't build on it."
      sources={[["Model card", "https://huggingface.co/kyutai/moshika-rl-seamless"], ["Paper (arXiv 2606.11167)", "https://arxiv.org/abs/2606.11167"]]}>
      A reinforcement-learning fine-tune of Moshika aimed at smoother turn-taking, backchannels and interruptions. It is a good illustration that &quot;conversational feel&quot; is now something vendors train for directly.
    </ModelCard>

    <ModelCard name="PersonaPlex-7B" org="NVIDIA" released="Jan 2026" license="Code MIT · Weights NVIDIA Open Model License (gated)" size="7B (Moshi-based)" hw="Tested on A100; CPU offload flag available"
      sources={[["Model card", "https://huggingface.co/nvidia/personaplex-7b-v1"], ["GitHub", "https://github.com/NVIDIA/personaplex"]]}>
      Fine-tuned from Moshiko to take a <strong style={{ color: C.text }}>role prompt</strong> (text) and a <strong style={{ color: C.text }}>voice prompt</strong> (audio), so you can make a full-duplex agent that plays a specific persona.
      &quot;Friendly IT helpdesk&quot; is exactly the kind of persona a vishing crew would want. It ships preset voices and is English only.
      You must accept NVIDIA&apos;s license on Hugging Face before downloading.
    </ModelCard>

    <ModelCard name="MiniCPM-o 4.5" org="OpenBMB" released="2026" license="Apache-2.0 (verify on model card)" size="9B" hw="~11 GB int4 · GGUF / llama.cpp / Ollama builds"
      sources={[["Model card", "https://huggingface.co/openbmb/MiniCPM-o-4_5"]]}>
      An omni model (vision + audio) with full-duplex streaming. It is built from a Whisper encoder, a Qwen3-8B backbone and a CosyVoice2 speech decoder.
      Two things make it notable here: it runs on a single consumer GPU or Apple Silicon, and it can <strong style={{ color: C.text }}>clone a voice from one reference clip</strong> during the conversation. English and Chinese.
    </ModelCard>

    <ModelCard name="NemotronLabs VoiceChat-11B" org="NVIDIA" released="Aug 2026" license="OpenMDW-1.1" size="~11B (Nemotron Nano 9B v2 based)" hw="Data-center GPU (A100 / H100 class)" color={C.highlight}
      sources={[["Model card", "https://huggingface.co/nvidia/NVIDIA-NemotronLabs-VoiceChat-11B"]]}>
      The first open full-duplex model with <strong style={{ color: C.text }}>live tool calling</strong>, meaning it can look something up or take an action while it keeps talking. That closes one of the biggest gaps between speech-native models and pipelines. NVIDIA reports ~450 ms response latency, and the model is English only.
      It needs data-center hardware, so treat it as a preview of where things are going, not a lab tool.
    </ModelCard>

    <SectionDivider />
    <h2 id="turn-based-omni" style={h2}>Turn-Based &quot;Omni&quot; Models</h2>
    <p style={intro}>
      These models take speech in and give speech out in one network, but they take turns like a walkie-talkie rather than overlapping. In exchange they tend to be smarter, more multilingual, and some support function calling.
    </p>

    <ModelCard name="Qwen2.5-Omni (3B / 7B)" org="Alibaba" released="Mar 2025" license="Code Apache-2.0 · 7B weights Apache-2.0 · 3B weights Qwen Research License" size="3B, 7B" hw="3B and int4 builds fit consumer GPUs"
      warn="The 3B checkpoint uses the non-commercial Qwen Research License. Only the 7B weights are Apache-2.0."
      sources={[["GitHub", "https://github.com/QwenLM/Qwen2.5-Omni"], ["Paper (arXiv 2503.20215)", "https://arxiv.org/abs/2503.20215"]]}>
      A &quot;Thinker-Talker&quot; design: the Thinker is an LLM that understands audio, video and text, and the Talker streams speech from its hidden states. It has two fixed voices (Chelsie and Ethan).
      The 3B version is the most practical local omni model for a lab laptop with a mid-range GPU.
    </ModelCard>

    <ModelCard name="Qwen3-Omni-30B-A3B" org="Alibaba" released="Sep 2025" license="Apache-2.0" size="30B MoE (~3B active)" hw="~79 GB+ in BF16 · vLLM recommended"
      sources={[["GitHub", "https://github.com/QwenLM/Qwen3-Omni"], ["Paper (arXiv 2509.17765)", "https://arxiv.org/abs/2509.17765"]]}>
      The most capable open omni model: it understands speech in 19 languages and speaks 10, has native function calling, and reports ~234 ms to first audio packet.
      Because the transcript never exists as a separate step, <strong style={{ color: C.text }}>text-based guardrails that inspect an STT transcript have nothing to inspect</strong>. Keep that in mind for the <a href="/voice-agents/attack-surface" style={link}>Attack Surface</a> section.
      Its successor, Qwen3.5-Omni (2026), is proprietary and API-only and does not meet this course&apos;s open-weight requirement.
    </ModelCard>

    <ModelCard name="Step-Audio 2 mini" org="StepFun" released="Aug 2025" license="Apache-2.0" size="~8B" hw="CUDA GPU, vLLM supported"
      sources={[["GitHub", "https://github.com/stepfun-ai/Step-Audio2"], ["Paper (arXiv 2507.16632)", "https://arxiv.org/abs/2507.16632"]]}>
      End-to-end speech conversation with <strong style={{ color: C.text }}>tool calling</strong> and paralinguistic understanding (emotion, speaking style). It covers English, Chinese, Japanese and more. Only the mini variants are open; the full Step-Audio 2 is API-only.
    </ModelCard>

    <ModelCard name="Also worth knowing" org="various" released="2024–2025" license="Mixed — check each" color={C.highlight}
      warn="GLM-4-Voice's code is Apache-2.0, but its weights use a custom GLM model license. LLaMA-Omni 2 weights are academic-use only."
      sources={[["Fun-Audio-Chat", "https://huggingface.co/FunAudioLLM/Fun-Audio-Chat-8B"], ["Kimi-Audio", "https://github.com/MoonshotAI/Kimi-Audio"], ["GLM-4-Voice", "https://github.com/zai-org/GLM-4-Voice"], ["LLaMA-Omni2", "https://github.com/ictnlp/LLaMA-Omni2"], ["Mini-Omni2", "https://github.com/gpt-omni/mini-omni2"]]}>
      <strong style={{ color: C.text }}>Fun-Audio-Chat-8B</strong> (Alibaba Tongyi, Apache-2.0, ~24 GB) supports speech function calling.
      {" "}<strong style={{ color: C.text }}>Kimi-Audio-7B</strong> (Moonshot) is a strong universal audio model.
      {" "}<strong style={{ color: C.text }}>GLM-4-Voice-9B</strong> (Zhipu) can be told to change emotion, speed and dialect.
      {" "}<strong style={{ color: C.text }}>Mini-Omni2</strong> (MIT, ~0.5B) is tiny enough to read end to end if you want to learn how these models work. Most of this group is Chinese/English-centric.
    </ModelCard>

    <SectionDivider />
    <h2 id="translation" style={h2}>Speech-to-Speech Translation</h2>
    <p style={intro}>
      Translation models keep <em>who</em> is speaking but change the language. For attackers, that removes accent and fluency as a tell: someone who doesn&apos;t speak the target&apos;s language can hold a live call in it, in their own voice.
    </p>

    <ModelCard name="Hibiki / Hibiki-Zero" org="Kyutai" released="Feb 2025 / Feb 2026" license="Code MIT + Apache-2.0 · Hibiki weights CC-BY 4.0 · Hibiki-Zero weights CC BY-NC-SA 4.0" size="1B–3B" hw="Hibiki 1B runs on-device (MLX); Hibiki-Zero ~8–12 GB"
      sources={[["Hibiki", "https://github.com/kyutai-labs/hibiki"], ["Paper (arXiv 2502.03382)", "https://arxiv.org/abs/2502.03382"], ["Hibiki-Zero", "https://github.com/kyutai-labs/hibiki-zero"]]}>
      Simultaneous speech translation that transfers the speaker&apos;s voice. Hibiki translates French to English; Hibiki-Zero adds Spanish, Portuguese and German into English.
    </ModelCard>

    <ModelCard name="SeamlessStreaming / SeamlessExpressive" org="Meta" released="Dec 2023" license="Code MIT · Streaming weights CC BY-NC 4.0 · Expressive under the Seamless License" size="~2B" hw="CUDA GPU" color={C.tertiary}
      warn="Non-commercial weights. SeamlessExpressive is research-only under Meta's custom Seamless License and is released only through an access request form."
      sources={[["GitHub", "https://github.com/facebookresearch/seamless_communication"], ["Paper (arXiv 2312.05187)", "https://arxiv.org/abs/2312.05187"]]}>
      Many-language streaming translation, with an Expressive variant that keeps tone and pacing. Notably, Meta runs Seamless output through a watermarking step, which makes it one of the few open speech models that watermarks at all. Meta's open watermarking research is <a href="https://github.com/facebookresearch/audioseal" target="_blank" rel="noopener noreferrer" style={link}>AudioSeal</a>.
    </ModelCard>

    <SectionDivider />
    <h2 id="modular-loops" style={h2}>Open &quot;Voice Loop&quot; Projects</h2>
    <p style={intro}>
      Not every &quot;speech-to-speech&quot; repo is a single model. These projects are well-tuned cascades. They are worth knowing because they get close to speech-native latency while keeping a swappable LLM and a text transcript.
    </p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 20 }}>
      {[
        { name: "Kyutai Unmute", url: "https://github.com/kyutai-labs/unmute", desc: "Kyutai streaming STT + any vLLM text model + Kyutai TTS. MIT, needs 16 GB+ VRAM. Wraps any LLM with a Moshi-like conversational layer." },
        { name: "HF speech-to-speech", url: "https://github.com/huggingface/speech-to-speech", desc: "Hugging Face's modular Apache-2.0 pipeline: Silero VAD → STT → any OpenAI-compatible LLM → TTS (e.g. Kokoro). Easy to point at your local llama.cpp server." },
        { name: "Sesame CSM-1B", url: "https://github.com/SesameAILabs/csm", desc: "Apache-2.0 conversational speech model: it uses previous turns of audio as context, so replies sound like they belong in the conversation. It cannot generate text, so it still needs an LLM in front." },
      ].map(t => (
        <div key={t.name} style={{ background: C.card, border: `1px solid ${C.accent}33`, borderRadius: 12, padding: 16 }}>
          <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700 }}><a href={t.url} target="_blank" rel="noopener noreferrer" style={{ color: C.accent }}>{t.name}</a></h3>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>{t.desc}</p>
        </div>
      ))}
    </div>

    <SectionDivider />
    <h2 id="comparison" style={h2}>Model Comparison</h2>
    <p style={intro}>A quick reference. Latency figures are the vendors&apos; own claims on their own hardware, and VRAM figures are approximate.</p>
    <Table
      headers={["Model", "Type", "Weights License", "Size", "Duplex", "Custom Voice", "Languages", "Local VRAM", "Latency (claimed)"]}
      rows={[
        ["Moshi", "End-to-end", "CC-BY 4.0", "7B", "Yes", "No (2 presets)", "EN", "~16 GB", "~200 ms"],
        ["PersonaPlex-7B", "End-to-end", "NVIDIA Open Model (gated)", "7B", "Yes", "Voice prompt", "EN", "A100-tested", "~170 ms"],
        ["MiniCPM-o 4.5", "End-to-end omni", "Apache-2.0", "9B", "Yes", "Clone from clip", "EN, ZH", "~11 GB (int4)", "~0.6 s"],
        ["NemotronLabs VoiceChat", "End-to-end + tools", "OpenMDW-1.1", "~11B", "Yes", "—", "EN", "A100 / H100 class", "~450 ms"],
        ["Qwen2.5-Omni", "Turn-based omni", "7B Apache-2.0; 3B research-only", "3B / 7B", "No", "No (2 presets)", "Multilingual", "Consumer GPU (3B)", "—"],
        ["Qwen3-Omni", "Turn-based omni + tools", "Apache-2.0", "30B MoE", "No", "No (presets)", "10 spoken", "~79 GB", "~234 ms"],
        ["Step-Audio 2 mini", "Turn-based + tools", "Apache-2.0", "~8B", "No", "Timbre switching", "EN, ZH, JA +", "Single GPU", "—"],
        ["Hibiki", "Translation", "CC-BY 4.0", "1B / 2B", "Streaming", "Keeps speaker voice", "FR → EN", "On-device (1B)", "—"],
      ]}
    />

    <SectionDivider />
    <h2 id="vs-pipeline" style={h2}>Speech-to-Speech vs. the Pipeline</h2>
    <p style={intro}>Neither approach wins everywhere. For training scenarios where you need scripted, gradable behavior, the cascade is usually still the right choice. Speech-native models shine when the point is realism.</p>
    <Table
      headers={["Factor", "Cascade (STT → LLM → TTS)", "Speech-to-Speech Model"]}
      rows={[
        ["Latency", "~500–1500 ms; needs VAD and endpointing heuristics", "~170–450 ms (full-duplex); natural interruptions"],
        ["Naturalness", "Loses tone and emotion at the text step", "Keeps prosody, laughter, hesitation, backchannels"],
        ["Reasoning", "Use any LLM, any size", "Tied to a 3–9B backbone; weaker at complex tasks"],
        ["Prompt control", "Precise system prompts and scripts", "Role prompts work, but drift is more common"],
        ["Transcript / logging", "Free: STT output is a text log", "Must be reconstructed (the model's inner text, or a separate STT)"],
        ["Guardrails", "Filter text between each stage", "No text boundary to filter in real time"],
        ["Tool use", "Any framework (LiveKit, Pipecat)", "Only a few models (Qwen3-Omni, Step-Audio 2, VoiceChat)"],
        ["Voice choice", "Any TTS, including cloned voices", "Mostly fixed presets; a few support voice prompts"],
        ["Best for", "Scripted scenarios, grading, production", "Realism demos, showing how convincing agents have become"],
      ]}
    />

    <SectionDivider />
    <h2 id="security" style={h2}>Security Implications</h2>
    <p style={intro}>Speech-native models change what defenders can rely on, and what they can inspect.</p>
    <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
      {[
        { title: "The \"robot pause\" tell is gone", desc: "Cascaded bots give themselves away with a half-second gap, talking over you, or ignoring an interruption. Full-duplex models take ~200 ms turns and yield when interrupted. Stop training people to listen for lag." },
        { title: "No transcript to inspect", desc: "Many voice-agent guardrails work on the STT transcript. An end-to-end model never produces one as a separate artifact, so prompt-injection filters and content policies need to work on audio or on the model's internal text stream." },
        { title: "Almost nothing is watermarked", desc: "Meta's Seamless is the exception, not the rule. Kyutai chose not to watermark its TTS because watermarks on open models \"can easily be deactivated\", and in its tests they were stripped just by re-encoding the audio. Instead it restricts cloning to pre-computed voice embeddings." },
        { title: "Cloning barriers are tiny", desc: "MiniCPM-o clones from a single reference clip inside a live conversation. Voice-conversion tools like Seed-VC need 1–30 seconds of audio. A voicemail greeting is enough source material." },
        { title: "Translation removes the accent tell", desc: "Voice-preserving translation like Hibiki lets a caller speak a language they don't know, in their own voice, in near real time." },
      ].map(c => (
        <div key={c.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: C.text }}>{c.title}</h3>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
        </div>
      ))}
    </div>
    <div style={{ background: `${C.tertiary}15`, border: `1px solid ${C.tertiary}44`, borderRadius: 6, padding: "8px 12px", marginBottom: 12, fontSize: 13, color: C.tertiary, display: "flex", alignItems: "flex-start", gap: 8 }}><Icon name="warning" size={14} style={{ flexShrink: 0, marginTop: 2 }} /><span>License traps: &quot;downloadable&quot; is not the same as &quot;usable.&quot; Moshika-RL, Hibiki-Zero, the Qwen2.5-Omni 3B and Seamless are non-commercial. LLaMA-Omni 2 is academic-only. GLM-4-Voice and PersonaPlex use custom vendor licenses. Seed-VC is GPL-3.0. Read the model card before building on any of them.</span></div>
    <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
      If you build a demo agent with any of these, consider stamping its output with <a href="https://github.com/facebookresearch/audioseal" target="_blank" rel="noopener noreferrer" style={link}>AudioSeal</a> (MIT, runs locally), and only use voices from people who have consented.
    </p>

    <SectionDivider />
    <h2 id="getting-started" style={h2}>Try It: Moshi Locally</h2>
    <p style={intro}>
      Moshi is the simplest open full-duplex model to run: one pip package, and a built-in web UI where you can talk to it. It is <strong style={{ color: C.text }}>not</strong> pre-installed on the lab machines. It needs a CUDA GPU with ~16 GB VRAM, or an Apple Silicon Mac using the MLX build.
    </p>
    <InfoBox>
      <strong style={{ color: C.text }}>Privacy Notice</strong>
      <br /><br />The first run downloads the model weights (~15 GB) from Hugging Face. After that, inference is fully local and no audio leaves your machine.
      Set <code style={code}>HF_HUB_OFFLINE=1</code> once the weights are cached to prevent any further network calls.
    </InfoBox>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 24, marginTop: 12 }}>
      <CodeBlock language="bash" code={`# === NVIDIA GPU (PyTorch) ===\nsudo mkdir -p /opt/moshi && sudo chown $USER /opt/moshi\ncd /opt/moshi\nuv venv --python 3.12\nuv pip install -U moshi\n\n# Start the server with the female voice (Moshika)\n# then open http://localhost:8998 and allow microphone access\n.venv/bin/python -m moshi.server --hf-repo kyutai/moshika-pytorch-bf16\n\n# Or the male voice (Moshiko)\n.venv/bin/python -m moshi.server --hf-repo kyutai/moshiko-pytorch-bf16\n\n# === Apple Silicon (MLX, 4-bit quantized) ===\nuv pip install moshi_mlx\n.venv/bin/python -m moshi_mlx.local_web -q 4`} />
    </div>
    <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
      Things to try: interrupt it mid-sentence, say nothing and wait, or talk over it. Compare how it feels with the llama.cpp + Piper demo in <a href="/voice-agents/brain#streaming-latency" style={link}>The LLM Brain</a>.
      Then ask it something factual. You&apos;ll quickly see the trade between fluency and intelligence.
    </p>

    <SectionDivider />
    <div id="knowledge-check" style={{ scrollMarginTop: 120 }}><QuizBank questions={[
      { question: `What does "full-duplex" mean for a speech model like Moshi?`, options: ["It supports two languages", "It can listen and speak at the same time, so it can be interrupted and give backchannels", "It uses two GPUs", "It outputs both audio and a text transcript"], correctIndex: 1, explanation: `Full-duplex models process the caller's audio stream and their own output stream simultaneously. That lets them be interrupted, say "mm-hm" while you talk, and respond in about 200 ms — like a person on a phone call.` },
      { question: `Why can speech-to-speech models weaken text-based guardrails?`, options: ["They are always cloud-hosted", "They encrypt their outputs", "There is no separate STT transcript for a filter to inspect between stages", "They cannot follow system prompts"], correctIndex: 2, explanation: `Cascaded agents produce a transcript at the STT step, and many guardrails inspect that text. An end-to-end model goes straight from audio to audio, so there is no natural text checkpoint to filter.` },
      { question: `You want a fully local agent whose behavior you can script precisely and grade from a transcript. What's usually the better fit?`, options: ["A full-duplex model like Moshi", "A cascaded STT → LLM → TTS pipeline", "A voice conversion tool like RVC", "Seamless translation"], correctIndex: 1, explanation: `The cascade lets you use any LLM with a precise system prompt and gives you a text transcript for free. Speech-native models are more natural but have smaller backbones and are harder to steer and audit.` },
      { question: `Why did Kyutai choose not to watermark its open TTS model?`, options: ["Watermarks are illegal in the EU", "Watermarks on open models are easily removed, so it restricted voice cloning instead", "Watermarking makes audio sound robotic", "It does watermark everything by default"], correctIndex: 1, explanation: `Kyutai argued that a watermark on openly released weights is easy to strip. Instead, it limited cloning to pre-computed voice embeddings. Meta's Seamless is one of the few open speech models that watermarks its output.` },
      { question: `A caller replies instantly, laughs naturally, and stops mid-sentence the moment you interrupt. What can you conclude?`, options: ["It must be a human — bots can't handle interruptions", "Nothing on its own — full-duplex speech models can do all of this in about 200 ms", "It's a cloud bot, since local models are too slow to respond that fast", "It's a voice conversion tool, because those are the only ones that sound natural"], correctIndex: 1, explanation: `Lag, talking over you, and ignoring interruptions used to give away cascaded bots. Open full-duplex models like Moshi and MiniCPM-o take ~200 ms turns and yield when interrupted — on a single local GPU. Conversational smoothness is no longer evidence of a human; verify identity through a separate channel instead.` },
    ]} /></div>
  </div>
  );
}
