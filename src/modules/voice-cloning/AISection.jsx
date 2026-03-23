import { useState } from "react";
import { C, CodeBlock, Icon, InfoBox, QuizBank, StarRating } from '../../components';
import { SectionDivider, PipelineDiagram, VocoderViz, AI_FLOW_DETAILS } from './_helpers';

const AISection = () => {
  const [archIdx, setArchIdx] = useState(0);
  const [flowStep, setFlowStep] = useState(0);
  const archs = [
    { name: "TTS", desc: "Text-to-speech with cloned voice. Learns characteristics from samples, generates from any text.", flow: [{ icon: "document", label: "Text" }, { icon: "variable", label: "Phonemes" }, { icon: "cpu", label: "Voice Model" }, { icon: "chart-bar", label: "Mel Spec" }, { icon: "speaker-wave", label: "Vocoder" }, { icon: "headphones", label: "Audio" }] },
    { name: "Voice Conversion", desc: "Converts one speaker's speech to sound like another, preserving words and emotion.", flow: [{ icon: "microphone", label: "Source" }, { icon: "chart-bar", label: "Features" }, { icon: "arrows-right-left", label: "Embed" }, { icon: "cpu", label: "Convert" }, { icon: "speaker-wave", label: "Vocoder" }, { icon: "headphones", label: "Target" }] },
  ];
  const currentArch = archs[archIdx];
  const flowDetails = AI_FLOW_DETAILS[currentArch.name];
  const activeDetail = flowStep >= 0 && flowStep < flowDetails.length ? flowDetails[flowStep] : null;
  return (<div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>AI Voice Cloning</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>Modern neural networks clone a voice from minutes — or seconds — of audio.</p>

    <h3 id="before-there-was-ai" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Before There Was AI</h3>
    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>Before AI-based TTS, rule-based synthesizers used formant models and pre-recorded phoneme snippets to generate speech. They sound robotic and can't clone voices, but they're lightweight, fast, and require no GPU or training data. These tools are useful as a baseline to compare against AI-generated speech.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>eSpeak NG</div>
            <a href="https://github.com/espeak-ng/espeak-ng" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.accent, textDecoration: "none" }}>GitHub ↗</a>
          </div>
          <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>Formant-based synthesizer supporting 100+ languages. Robotic but extremely fast and runs anywhere.</p>
          <CodeBlock code={'# Preinstalled on Call Center Village laptops\n# sudo apt install espeak-ng\ncd ~/callcentervillage/voice-cloning\n\n# Generate speech to audio file\nespeak-ng "Hello, this is your bank calling" -w output.wav && play output.wav\n\n# Change voice/language (Spanish)\nespeak-ng -v es "Hola, le llama su banco" -w output.wav && play output.wav\n\n# List available voices\nespeak-ng --voices'} language="bash" />
        </div>
        <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Festival</div>
            <a href="http://www.cstr.ed.ac.uk/projects/festival/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.accent, textDecoration: "none" }}>Project Page ↗</a>
          </div>
          <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>Unit-selection synthesizer from University of Edinburgh. Uses pre-recorded speech snippets stitched together — more natural than formant synthesis.</p>
          <CodeBlock code={'# Preinstalled on Call Center Village laptops\n# sudo apt install festival\ncd ~/callcentervillage/voice-cloning\n\n# Save speech to audio file\necho "Hello, this is your bank calling" | text2wave > output.wav && play output.wav\n\n# Play speech interactively\n# Requires audio device\necho "Hello, this is your bank calling" | festival --tts'} language="bash" />
        </div>
      </div>
      <p style={{ fontSize: 12, color: C.dim, lineHeight: 1.6, marginTop: 12, fontStyle: "italic" }}>Compare the output of these tools to the AI-generated TTS example later on this page — the difference in quality is what makes AI voice cloning such a powerful (and dangerous) technology.</p>
    </div>

    <SectionDivider />
    <h3 id="ai-powered-tts-and-voice-conversion" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>AI-Powered TTS and Voice Conversion</h3>
    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>Unlike the rule-based tools above, these use neural networks to generate human-sounding speech — and can clone specific voices.</p>
    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      {archs.map((a, i) => <button key={i} onClick={() => { setArchIdx(i); setFlowStep(0); }} style={{ flex: 1, background: i === archIdx ? `${C.primary}15` : C.card, border: `1px solid ${i === archIdx ? C.secondary : C.border}`, borderRadius: 10, padding: "12px 8px", color: i === archIdx ? C.accent : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, textAlign: "center" }}>{a.name}</button>)}
    </div>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ fontSize: 14, color: C.text, fontWeight: 600, marginBottom: 6 }}>{currentArch.name === "TTS" ? "How TTS Cloning Works" : "How Voice Conversion Differs from TTS"}</div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: "0 0 12px" }}>{
        currentArch.name === "TTS"
          ? "Text-to-speech cloning takes typed text and generates audio that sounds like a specific person. You provide the words, and the AI handles everything else — pronunciation, rhythm, and vocal style. The output is entirely AI-generated; there is no original human recording being modified."
          : "Unlike TTS, voice conversion starts with an actual human recording. Instead of generating speech from text, it takes an existing recording and swaps the speaker's identity while keeping everything else intact — the words, emotion, pacing, and rhythm all stay exactly as they were. Think of it as a real-time voice filter: you speak naturally, and the output sounds like someone else said it. This makes it especially powerful because the natural human speech patterns (hesitations, emphasis, breathing) are preserved, which is much harder to detect as fake."
      }</p>
      <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "16px 0" }} />
      <p style={{ fontSize: 12, color: C.dim, marginBottom: 4 }}>Click a step to learn more:</p>
      <PipelineDiagram steps={currentArch.flow} activeStep={flowStep} onStepClick={i => setFlowStep(flowStep === i ? -1 : i)} />
      {activeDetail && activeDetail.exampleComponent !== "tts-audio" && (
        <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginTop: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 6 }}>{activeDetail.title}</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 10 }}>{activeDetail.detail}</div>
          <div style={{ background: `${C.primary}10`, border: `1px solid ${C.primary}33`, borderRadius: 6, padding: 10 }}>
            <div style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, textAlign: "right" }}>{activeDetail.exampleLabel || "Example"}</div>
            {activeDetail.exampleComponent === "architectures" ? <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "4px 12px" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 4 }}>Autoregressive</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 4 }}>Generates one audio frame at a time, each depending on the previous. High quality but slow — can't skip ahead or parallelize. Like writing a sentence one word at a time.</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.secondary, marginBottom: 4 }}>Non-Autoregressive</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>Generates ALL frames in parallel at once. Much faster — this is how services can process 2 minutes of audio in 2 seconds. The model predicts the entire output simultaneously rather than sequentially.</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.tertiary, marginBottom: 4 }}>Diffusion</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>Starts with random noise and iteratively refines it into speech over many steps. Great quality, slower than non-autoregressive but more flexible.</div>
              </div>
              <div style={{ fontSize: 13, color: C.text, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>The speed difference matters: autoregressive models process audio roughly in real-time (1s of audio ≈ 1s of compute), while non-autoregressive models can be 10-100x faster than real-time.</div>
              <div style={{ fontSize: 12, color: C.dim, marginTop: 8 }}>Further reading: <a href="https://arxiv.org/pdf/2106.15561" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>A Survey on Neural Speech Synthesis (arXiv)</a></div>
            </div> : activeDetail.exampleComponent === "vocoder" ? <VocoderViz /> : activeDetail.exampleComponent === "melspec" ? <div>
              <CodeBlock code={'cd ~/callcentervillage/voice-cloning\n\n# Generate a spectrogram from your audio file\n# SoX produces a linear spectrogram\n# similar to a mel spectrogram, but with an evenly spaced frequency axis\nsox input.wav -n spectrogram -o spectrogram.png\n\n# View the spectrogram in the terminal\nimgcat spectrogram.png'} language="bash" />
              <img src="/images/melspec.png" alt="Mel spectrogram of speech" style={{ width: "100%", borderRadius: 4, border: `1px solid ${C.border}`, marginTop: 10 }} />
              {activeDetail.exampleCaption && <div style={{ fontSize: 11, color: C.dim, marginTop: 6, lineHeight: 1.5, textAlign: "center" }}>{activeDetail.exampleCaption}</div>}
            </div> : <div style={{ fontSize: 13, color: C.text, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{activeDetail.example}</div>}
          </div>
          {activeDetail.footnote && <div style={{ marginTop: 10, fontSize: 12, color: C.dim, lineHeight: 1.6 }}>{activeDetail.footnote}</div>}
        </div>
      )}
      {activeDetail && activeDetail.exampleComponent === "tts-audio" && <>
        <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginTop: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 6 }}>AI-generated TTS</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 10 }}>{activeDetail.detail}</div>
          <div style={{ fontSize: 13, color: C.muted, fontStyle: "italic", marginBottom: 10 }}>"Hello, this is your bank calling about your account."</div>
          <audio controls style={{ width: "100%" }} src="/audio/tts-example.mp3" />
        </div>
        <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginTop: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 6 }}>eSpeak NG (non-AI)</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 10 }}>Same phrase generated by a rule-based synthesizer for comparison.</div>
          <audio controls style={{ width: "100%" }} src="/audio/espeak-compare.wav" />
        </div>
      </>}
    </div>
    <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 16 }}>
      <div style={{ fontSize: 12, color: C.dim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>TTS and Voice Conversion Tool Reference</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {[
          { name: "Coqui TTS", url: "https://github.com/coqui-ai/TTS" },
          { name: "Bark", url: "https://github.com/suno-ai/bark" },
          { name: "Tortoise", url: "https://github.com/neonbjb/tortoise-tts" },
          { name: "Piper", url: "https://github.com/OHF-Voice/piper1-gpl" },
          { name: "StyleTTS2", url: "https://github.com/yl4579/StyleTTS2" },
          { name: "MetaVoice", url: "https://github.com/metavoiceio/metavoice-src" },
          { name: "Qwen3-TTS", url: "https://github.com/QwenLM/Qwen3-TTS" },
          { name: "Spark TTS", url: "https://github.com/SparkAudio/Spark-TTS" },
          { name: "F5-TTS", url: "https://github.com/SWivid/F5-TTS" },
          { name: "Chatterbox", url: "https://github.com/resemble-ai/chatterbox" },
          { name: "RVC", url: "https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI" },
          { name: "FreeVC", url: "https://github.com/OlaWod/FreeVC" },
          { name: "DDSP-SVC", url: "https://github.com/yxlllc/DDSP-SVC" },
          { name: "OpenVoice", url: "https://github.com/myshell-ai/OpenVoice" },
        ].map((t, i) => (
          <a key={i} href={t.url} target="_blank" rel="noopener noreferrer" style={{ background: `${C.primary}15`, border: `1px solid ${C.primary}33`, borderRadius: 6, padding: "3px 10px", fontSize: 12, color: C.accent, fontWeight: 600, textDecoration: "none", transition: "all 0.2s ease" }} onMouseEnter={e => { e.currentTarget.style.background = `${C.primary}30`; }} onMouseLeave={e => { e.currentTarget.style.background = `${C.primary}15`; }}>{t.name} ↗</a>
        ))}
      </div>
      <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "24px 0" }} />
      <div style={{ fontSize: 12, color: C.dim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Quality vs. Effort</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>{["Method", "Audio", "Compute", "Quality", "Real-Time"].map(h => <th key={h} style={{ padding: 8, textAlign: "left", color: C.accent, fontWeight: 700 }}>{h}</th>)}</tr></thead>
        <tbody>{[["eSpeak NG / Festival", "None", "None", 1, "Yes"], ["TTS (zero-shot)", "3-10s", "Medium", 3, "Sometimes"], ["TTS (fine-tuned)", "5-30min", "High", 4, "No"], ["VC (zero-shot)", "3-10s", "Medium", 3, "Yes"], ["VC (fine-tuned / RVC)", "10-30min", "High", 5, "Yes*"], ["Commercial API", "10-30s", "None", 4, "Yes"]].map((row, i) => <tr key={i} onMouseEnter={e => e.currentTarget.style.background = `${C.primary}10`} onMouseLeave={e => e.currentTarget.style.background = "transparent"} style={{ borderBottom: "1px solid #06040c", transition: "background 0.15s ease", cursor: "default" }}>{row.map((cell, j) => <td key={j} style={{ padding: 8, color: j === 0 ? C.text : C.muted }}>{j === 3 ? <StarRating rating={cell} size={14} /> : cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <SectionDivider />
    <div id="speaker-embeddings" style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Speaker Embeddings</div>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Remember the speaker embedding step from voice conversion above? A speaker embedding is typically a 256 to 512 dimension vector that captures what makes a voice unique — a mathematical fingerprint. Here's an example of how they might actually work under the hood.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", fontSize: 15, fontWeight: 600, color: C.text, display: "flex", alignItems: "center" }}><Icon name="fingerprint" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />How Speaker Embeddings Work</div>
      <div style={{ padding: "0 20px 20px", color: C.muted, fontSize: 14, lineHeight: 1.8 }}>
        <div style={{ margin: "12px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Pitch Range", "Formants", "Breathiness", "Vibrato", "Pace", "Nasality", "...256+ dims"].map((d, i) => <span key={i} style={{ background: "#06040c", border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", fontSize: 13, color: i === 6 ? C.dim : C.accent }}>{d}</span>)}
        </div>
        <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginTop: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>What does this actually look like?</div>
          <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.7 }}>A <strong style={{ color: C.text }}>dimension</strong> (dim) is a single measurement of a voice characteristic. A <strong style={{ color: C.text }}>vector</strong> is just a list of these measurements — like a row of numbers that together describe a voice.</p>
          <p style={{ margin: "0 0 12px", fontSize: 13, lineHeight: 1.7 }}>Each dimension is a number (usually between -1 and 1) representing how much of that characteristic the voice has. For example:</p>
          <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap", color: C.text }}>
            <div><span style={{ color: C.dim }}>dim 1 (pitch range):</span>  <span style={{ color: C.accent }}>0.72</span>  <span style={{ color: C.dim }}>← wide pitch variation</span></div>
            <div><span style={{ color: C.dim }}>dim 2 (breathiness):</span>  <span style={{ color: C.accent }}>-0.15</span> <span style={{ color: C.dim }}>← not very breathy</span></div>
            <div><span style={{ color: C.dim }}>dim 3 (nasality):</span>    <span style={{ color: C.accent }}>0.41</span>  <span style={{ color: C.dim }}>← somewhat nasal</span></div>
            <div><span style={{ color: C.dim }}>dim 4 (pace):</span>        <span style={{ color: C.accent }}>-0.63</span> <span style={{ color: C.dim }}>← slower speaker</span></div>
            <div><span style={{ color: C.dim }}>...256 more dimensions</span></div>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 13, lineHeight: 1.7 }}>The full vector — all 256+ numbers together — is the voice's unique fingerprint. In code, it's just an array of numbers:</p>
          <div style={{ background: `${C.primary}10`, border: `1px solid ${C.primary}33`, borderRadius: 6, padding: 10, marginTop: 8, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 12, lineHeight: 1.6, color: C.text, whiteSpace: "pre-wrap" }}>
            <span style={{ color: C.dim }}>// Speaker embedding for "Patrick's voice"</span>{"\n"}
            <span style={{ color: C.accent }}>speaker_vector</span> = [{"\n"}
            {"  "}<span style={{ color: C.text }}>0.72, -0.15, 0.41, -0.63, 0.28, 0.89, -0.44, 0.17,</span>{"\n"}
            {"  "}<span style={{ color: C.text }}>0.55, -0.31, 0.08, 0.93, -0.72, 0.36, -0.19, 0.61,</span>{"\n"}
            {"  "}<span style={{ color: C.dim }}>...  // additional dimensions</span>{"\n"}
            {"  "}<span style={{ color: C.text }}>0.47, -0.05, 0.33, -0.28, 0.14, 0.82, -0.51, 0.69</span>{"\n"}
            ]
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 13, lineHeight: 1.7 }}>Two voices with similar vectors will sound alike. The AI compares and manipulates these vectors to clone a voice.</p>
          <p style={{ margin: "10px 0 0", fontSize: 12, color: C.dim, lineHeight: 1.7 }}>The number of dimensions (256, 512, etc.) is a design choice by the model's creators — not a fixed rule. More dimensions can capture finer details but cost more compute. 256 is common because it's proven to be "enough" for most voice cloning tasks. Also, the individual dimensions don't map neatly to concepts like "breathiness" or "pitch" — the model learns its own abstract representations during training. The labels above are simplified for illustration.</p>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", marginBottom: 8 }}>
            <Icon name="magnifying-glass" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Vector Databases & Voice Lookup
          </div>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 8 }}>These dimensions can be stored and searched in vector databases, which find similar voices by comparing the mathematical distance between embeddings. This is how systems can take an unknown voice and quickly match it against thousands of known voiceprints.</p>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>To learn more about how this works, see <a href="https://en.wikipedia.org/wiki/Nearest_neighbor_search" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>nearest neighbor search</a> and <a href="https://en.wikipedia.org/wiki/Vector_database" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>vector databases</a>.</p>
          <InfoBox>Want to try vector search yourself? <a href="https://github.com/pgvector/pgvector" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>pgvector</a> is a PostgreSQL extension that adds vector similarity search — a great way to get started storing and querying speaker embeddings with a database you may already know.</InfoBox>
        </div>
      </div>
    </div>
    <SectionDivider />
    <QuizBank questions={[
      { question: "Which produces the highest quality voice clone?", options: ["Zero-shot from 5s", "RVC fine-tuned on 20min clean audio", "Pitch shifting with SoX", "Commercial API with 10s"], correctIndex: 1, explanation: "RVC fine-tuned on sufficient clean data produces the highest quality clone." },
      { question: "What is a speaker embedding?", options: ["A hidden microphone", "A numerical vector of unique voice characteristics", "An audio format", "A steganography technique"], correctIndex: 1, explanation: "Speaker embeddings are high-dimensional vectors that mathematically represent what makes a voice unique." },
      { question: "Why is zero-shot cloning considered the biggest threat to phone security?", options: ["It produces perfect quality", "It requires no training and works from a brief voicemail or public clip", "It's undetectable", "It's free"], correctIndex: 1, explanation: "Zero-shot cloning needs just seconds of audio — a voicemail greeting, a YouTube clip, or a conference recording. No training, no GPU, minimal effort." },
      { question: "What is the main limitation of non-AI TTS tools like eSpeak NG and Festival?", options: ["They can't generate speech from text", "They produce robotic-sounding speech and can't clone voices", "They require a GPU to run", "They only support English"], correctIndex: 1, explanation: "Rule-based synthesizers like eSpeak NG and Festival generate speech using formant models or pre-recorded snippets — fast and lightweight, but they sound robotic and have no ability to mimic a specific person's voice." },
    ]} />
  </div>);
};

export default AISection;
