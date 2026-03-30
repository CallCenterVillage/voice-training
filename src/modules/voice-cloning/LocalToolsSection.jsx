import { C, CodeBlock, Icon, InfoBox, QuizBank, StarRating, SectionDivider } from '../../components';
import { ToolComparison } from './_helpers';

const LocalToolsSection = () => (<div>
  <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Local AI Tools</h1>
  <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>Run everything locally — no cloud, no API keys, no data leaving your machine. But before diving into the tools, it helps to understand the different approaches to voice cloning and how they've evolved — each requires different amounts of data, compute, and effort.</p>

  <h2 id="voice-cloning-approaches" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Voice Cloning Approaches</h2>
  <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>
    AI voice cloning has evolved rapidly. Understanding the three main approaches — and how much data each one needs — is key to understanding both the technology and the threat landscape.
  </p>

  <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
    <div style={{ background: C.card, border: `1px solid ${C.accent}33`, borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: C.accent, marginBottom: 8 }}>Fine-Tuning</div>
      <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>
        The original approach. You train (or fine-tune) a model on hours of labeled audio from the target speaker. This produces the highest quality clones but requires significant time, compute, and data. Tools like RVC use this approach — you provide 10-20+ minutes of clean audio and the model learns the speaker's voice characteristics over many training iterations.
      </div>
      <InfoBox>Fine-tuning audio models is a broad topic beyond the scope of this training. To learn more, see the <a href="https://huggingface.co/learn/audio-course" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>Hugging Face Audio Course</a> for a comprehensive introduction to training and fine-tuning audio models.</InfoBox>
    </div>

    <div style={{ background: C.card, border: `1px solid ${C.highlight}33`, borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: C.highlight, marginBottom: 8 }}>One-Shot Cloning</div>
      <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>
        A middle ground. You provide a single audio sample along with its exact text transcription. The model uses both the audio and the aligned text to understand the speaker's voice. Earlier versions of Coqui TTS (v1) and Spark TTS use this approach — you provide both the wav file and a matching transcript.
      </div>
      <CodeBlock code={`# One-shot cloning with Spark TTS\n# Requires both the audio AND its exact transcription\nspark-tts --text "My fellow Americans." --device 0 \\\n    --save_dir ~/callcentervillage/voice-cloning \\\n    --prompt_speech_path /opt/spark-tts/pretrained_models/potus/reference.wav \\\n    --prompt_text "$(cat /opt/spark-tts/pretrained_models/potus/reference.txt)"\n\n# Spark TTS will output the save path, e.g.:\n# Audio saved at: ~/callcentervillage/voice-cloning/<YYYYMMDDHHMMSS>.wav\n# Play it back with:\n# play ~/callcentervillage/voice-cloning/<YYYYMMDDHHMMSS>.wav\n\n# If the text doesn't match the audio exactly, quality suffers`} language="bash" />
    </div>

    <div style={{ background: C.card, border: `1px solid ${C.tertiary}33`, borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: C.tertiary, marginBottom: 8 }}>Zero-Shot Cloning</div>
      <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>
        The current state of the art — and the most dangerous from a security perspective. Just provide a few seconds of audio. No transcript needed, no training required. The model extracts the speaker's voice characteristics directly from the audio and can immediately speak any new text in that voice. This is what Coqui XTTS v2 and most modern commercial services use.
      </div>
      <InfoBox>This command can take several minutes to run on CPU. Be patient — the model is doing a lot of work to clone the voice.</InfoBox>
      <CodeBlock code={`# Zero-shot cloning with Coqui XTTS v2\n# Just provide audio — no transcript, no training\ncd ~/callcentervillage/voice-cloning\n\ncoqui-tts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n    --speaker_wav /opt/coqui-tts/celebrity-voice.wav \\\n    --language_idx en \\\n    --text "I'm entering my cloned era." \\\n    --out_path output.wav && play output.wav`} language="bash" />
      <p style={{ fontSize: 12, color: C.dim, marginTop: 8 }}>Source audio: <a href="https://www.youtube.com/watch?v=9qDW_ZKpvxI&t=55s" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>YouTube</a></p>

    </div>
  </div>

  <SectionDivider />
  <h2 id="reference-tools" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Reference Tools</h2>
  <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>Hands-on tools for voice cloning, conversion, and synthesis — all running locally on your machine.</p>
  <ToolComparison tools={[
    { name: "Coqui TTS", desc: <><span>Open-source TTS with zero-shot cloning via XTTS v2 model. 16+ languages.</span><div style={{ background: `${C.highlight}10`, border: `1px solid ${C.highlight}33`, borderRadius: 8, padding: "10px 14px", marginTop: 8, display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13 }}><Icon name="warning" size={16} style={{ color: C.highlight, flexShrink: 0, marginTop: 2 }} /><span style={{ color: C.muted }}>Coqui AI shut down in 2024. This tool has significant dependency issues and may require manual troubleshooting to install. It's pre-configured on these laptops, but setting it up elsewhere can be painful.</span></div></>, pros: ["Zero-shot", "Multi-language", "Fine-tunable"], cons: ["Coqui shut down", "GPU recommended"], install: `# Preinstalled on Call Center Village laptops\n# Wrapper at /usr/local/bin/coqui-tts → /opt/coqui-tts/.venv/bin/tts\ncd ~/callcentervillage/voice-cloning\n\ncoqui-tts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n    --speaker_wav input.wav --language_idx en \\\n    --text "Somebody once told me, the world is gonna roll me." \\\n    --out_path output.wav && play output.wav` },
    { name: "Piper TTS", desc: "Neural TTS for edge devices. Runs on Raspberry Pi.", pros: ["Runs anywhere", "Super fast", "Many voices"], cons: ["Not zero-shot", "Training needed"], install: `# Preinstalled on Call Center Village laptops\n# pip install piper-tts\ncd ~/callcentervillage/voice-cloning\n\necho "Hello" | piper --model /opt/piper/models/en_US-lessac-medium.onnx --output_file output.wav && play output.wav` },
    { name: "Spark TTS", desc: "Built on Qwen2.5 LLM — zero-shot voice cloning with controllable gender, pitch, and speaking rate. Bilingual (English/Chinese).", pros: ["Zero-shot", "Controllable", "LLM-based"], cons: ["GPU recommended", "Newer project"], install: `# Preinstalled on Call Center Village laptops\n# Wrapper at /usr/local/bin/spark-tts → /opt/spark-tts\ncd ~/callcentervillage/voice-cloning\n\nspark-tts --text "My fellow Americans." --device 0 \\\n    --save_dir ~/callcentervillage/voice-cloning \\\n    --prompt_speech_path /opt/spark-tts/pretrained_models/potus/reference.wav \\\n    --prompt_text "$(cat /opt/spark-tts/pretrained_models/potus/reference.txt)"` },
    { name: "RVC", desc: "Voice conversion. Real-time on consumer GPUs. Huge community.", pros: ["Best VC quality", "Real-time", "Large community"], cons: ["Complex setup", "GPU recommended"], install: `# RVC is running as a background service on these laptops\n# Open the web interface in your browser:\n# http://localhost:7865` },
    { name: "OpenVoice", desc: "Instant cloning with tone/emotion control. MIT license.", pros: ["Fast", "Emotion control", "Lightweight"], cons: ["Best quality in English", "Less natural"], install: `# Preinstalled on Call Center Village laptops\n# Installed at /opt/openvoice\ncd ~/callcentervillage/voice-cloning\n\n# Single file voice conversion\nopenvoice single -i input.wav \\\n    -r /opt/openvoice/reference_voice.wav \\\n    -o cloned_output.wav -d cpu && play cloned_output.wav\n\n# Batch process a folder of audio files\nopenvoice batch -id ./input_folder \\\n    -rf /opt/openvoice/reference_voice.wav \\\n    -od ./output_folder -d cpu` },
  ]} />
    <SectionDivider />
    <h2 id="supporting-tools" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Supporting Tools</h2>
    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>Voice cloning doesn't happen in isolation — you need to understand what was said before you can generate a convincing response. A speech-to-text tool like whisper.cpp lets you transcribe recordings, voicemails, or intercepted audio into text you can work with. A local LLM like llama.cpp takes that transcript and generates contextually appropriate responses — matching tone, vocabulary, and conversation flow — that you can then feed into a TTS or voice conversion tool.</p>
    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 8 }}>Together, these tools close the loop: listen, understand, respond, and speak — all running locally with zero cloud dependency and no API logs. The Call Center Village laptops use whisper.cpp and llama.cpp directly, but there are user-friendly alternatives worth knowing about — <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>Ollama</a>, <a href="https://lmstudio.ai" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>LM Studio</a>, <a href="https://github.com/open-webui/open-webui" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>Open WebUI</a>, <a href="https://github.com/danny-avila/LibreChat" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>LibreChat</a>, <a href="https://jan.ai" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "none" }}>Jan</a> all make it easier to run local models with polished UIs.</p>
    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>See <a href="/appendix/resources" style={{ color: C.accent, textDecoration: "none", fontWeight: 600 }}>Appendix → Additional Resources</a> for details on each.</p>

    <SectionDivider />
    <h2 id="whisper-cpp" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>whisper.cpp</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Local speech-to-text — transcribe audio to text entirely on your machine.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>Powered by OpenAI's Whisper model, compiled to run efficiently on CPU. Transcribe audio files, extract text from recordings for re-synthesis, or analyze call recordings — all offline.</p>
      <CodeBlock language="bash" code={`cd ~/callcentervillage/voice-cloning\n\n# Transcribe an audio file (using the tiny model for speed on i3)\n/opt/whisper.cpp/build/bin/whisper-cli \\\n  -m /opt/whisper.cpp/models/ggml-tiny.en.bin \\\n  -f input.wav\n\n# Transcribe with timestamps\n/opt/whisper.cpp/build/bin/whisper-cli \\\n  -m /opt/whisper.cpp/models/ggml-tiny.en.bin \\\n  -f input.wav -otxt\n\n# Output as SRT subtitles\n/opt/whisper.cpp/build/bin/whisper-cli \\\n  -m /opt/whisper.cpp/models/ggml-tiny.en.bin \\\n  -f input.wav -osrt\n\n# Use the small model for better accuracy (slower)\n/opt/whisper.cpp/build/bin/whisper-cli \\\n  -m /opt/whisper.cpp/models/ggml-small.en.bin \\\n  -f input.wav`} />
      <p style={{ fontSize: 12, color: C.dim, marginTop: 10, marginBottom: 12, lineHeight: 1.6 }}>The <strong style={{ color: C.muted }}>tiny</strong> model is fastest and works well on low-powered hardware. Use <strong style={{ color: C.muted }}>small</strong> for better accuracy if you can wait a bit longer. Models ending in <strong style={{ color: C.muted }}>.en</strong> are English-only and slightly more accurate for English.</p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 32 }}>
        <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>{["Model", "Size", "Memory", "Speed", "Accuracy"].map(h => <th key={h} style={{ padding: 8, textAlign: "left", color: C.accent, fontWeight: 700 }}>{h}</th>)}</tr></thead>
        <tbody>{[
          ["tiny / tiny.en", "75 MB", "~390 MB", 5, 2],
          ["base / base.en", "142 MB", "~500 MB", 4, 3],
          ["small / small.en", "466 MB", "~1.0 GB", 3, 4],
          ["medium / medium.en", "1.5 GB", "~2.6 GB", 2, 4],
          ["large-v3", "3.1 GB", "~4.7 GB", 1, 5],
        ].map((row, i) => <tr key={i} onMouseEnter={e => e.currentTarget.style.background = `${C.primary}10`} onMouseLeave={e => e.currentTarget.style.background = "transparent"} style={{ borderBottom: "1px solid #06040c", transition: "background 0.15s ease" }}>
          {row.map((cell, j) => <td key={j} style={{ padding: 8, color: j === 0 ? C.text : C.muted, fontSize: j >= 3 ? 16 : 13 }}>
            {j >= 3 ? <StarRating rating={cell} /> : cell}
          </td>)}
        </tr>)}</tbody>
      </table>
      <p style={{ fontSize: 11, color: C.dim, marginTop: 8 }}>For these laptops, <strong style={{ color: C.muted }}>tiny</strong> or <strong style={{ color: C.muted }}>base</strong> are recommended. See all available models at <a href="https://huggingface.co/ggerganov/whisper.cpp" target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>huggingface.co/ggerganov/whisper.cpp</a>.</p>
    </div>

    <SectionDivider />
    <h2 id="llama-cpp" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, marginTop: 24, scrollMarginTop: 120 }}>llama.cpp</h2>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Run large language models locally — generate scripts and dialogue without the cloud.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>Generate realistic call scripts, social engineering dialogue, or conversational responses — all without sending data to the cloud. Perfect for generating text that a cloned voice can speak.</p>
      <CodeBlock language="bash" code={`cd ~/callcentervillage/voice-cloning\n\n# Generate a simple response (using a small quantized model for i3)\n/opt/llama.cpp/build/bin/llama-cli \\\n    -m /opt/llama.cpp/models/tinyllama-1.1b-chat.Q4_K_M.gguf \\\n    -p "Write a short phone script where a bank employee asks a customer to verify their identity." \\\n    -n 150\n\n# Interactive chat mode\n/opt/llama.cpp/build/bin/llama-cli \\\n    -m /opt/llama.cpp/models/tinyllama-1.1b-chat.Q4_K_M.gguf \\\n    --interactive \\\n    -p "You are a call center agent. Respond naturally to the customer."\n\n# Generate text and save to file (for feeding into TTS)\n/opt/llama.cpp/build/bin/llama-cli \\\n    -m /opt/llama.cpp/models/tinyllama-1.1b-chat.Q4_K_M.gguf \\\n    -p "Write a convincing voicemail message from a bank about suspicious activity." \\\n    -n 100 > script.txt`} />
      <p style={{ fontSize: 12, color: C.dim, marginTop: 10, lineHeight: 1.6 }}>Smaller quantized models (Q4_K_M) run best on limited hardware. The output won't match GPT-4, but it's enough to generate realistic scripts entirely offline.</p>
    </div>

    <SectionDivider />
    <h2 id="putting-it-all-together" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Putting It All Together</h2>
    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>These tools chain together to build fully local voice cloning pipelines — no internet connection required. Here are two realistic scenarios:</p>

    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, marginBottom: 6 }}>Scenario A: Clone a voice and put words in their mouth</div>
      <p style={{ fontSize: 12, color: C.dim, marginBottom: 8 }}>You have a voice sample of someone. Generate a script and make it sound like they said it.</p>
      <CodeBlock language="bash" code={`cd ~/callcentervillage/voice-cloning\n\n# 1. Record or obtain a voice sample of the target\n# (You can also use Audacity to record)\nrec -r 44100 -c 1 target_voice.wav trim 0 20\n\n# 2. Generate a script with llama.cpp\n/opt/llama.cpp/build/bin/llama-cli \\\n    -m /opt/llama.cpp/models/tinyllama-1.1b-chat.Q4_K_M.gguf \\\n    -p "Write a short voicemail about a package delivery." \\\n    -n 80 > script.txt\n\n# 3. Clone the voice with the generated script\ntts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n    --speaker_wav target_voice.wav \\\n    --language_idx en \\\n    --text "$(cat script.txt)" \\\n    --out_path cloned_output.wav`} />
    </div>

    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12, marginTop: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, marginBottom: 6 }}>Scenario B: Intercept, understand, and respond as someone</div>
      <p style={{ fontSize: 12, color: C.dim, marginBottom: 8 }}>You have a recording of a conversation. Transcribe it, generate a contextual follow-up, and deliver it in the original speaker's voice.</p>
      <CodeBlock language="bash" code={`cd ~/callcentervillage/voice-cloning\n\n# 1. Transcribe the recording to understand what was said\n/opt/whisper.cpp/build/bin/whisper-cli \\\n    -m /opt/whisper.cpp/models/ggml-tiny.en.bin \\\n    -f recorded_call.wav \\\n    -otxt\n\n# 2. Feed the transcription to llama.cpp for a contextual response\n/opt/llama.cpp/build/bin/llama-cli \\\n    -m /opt/llama.cpp/models/tinyllama-1.1b-chat.Q4_K_M.gguf \\\n    -p "The caller said: $(cat recorded_call.wav.txt). Write a convincing follow-up response as if you are the same person calling back." \\\n    -n 100 > response.txt\n\n# 3. Synthesize the response in the original speaker's voice\ntts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n    --speaker_wav recorded_call.wav \\\n    --language_idx en \\\n    --text "$(cat response.txt)" \\\n    --out_path cloned_response.wav`} />
    </div>

  <SectionDivider />
  <div id="knowledge-check" style={{ scrollMarginTop: 120 }}>
    <QuizBank questions={[
      { question: "You need to demo voice cloning at a conference in 5 minutes. What's your best bet?", options: ["Train an RVC model", "Use Coqui TTS zero-shot", "Fine-tune Piper TTS", "Build a custom model from scratch"], correctIndex: 1, explanation: "Coqui TTS zero-shot only needs a few seconds of reference audio and no training — you can go from sample to clone in under a minute." },
      { question: "You need to transcribe an intercepted phone call, generate a convincing follow-up response, and create a recording in the caller's voice. Which three tools would you use?", options: ["whisper.cpp, llama.cpp, Coqui TTS", "whisper.cpp, Piper TTS, OpenVoice", "llama.cpp, RVC, Piper TTS", "Coqui TTS, OpenVoice, RVC"], correctIndex: 0, explanation: "whisper.cpp transcribes the call so you understand what was said and can feed it into llama.cpp to generate a convincing follow-up response. Coqui TTS then synthesizes it in the original caller's cloned voice." },
      { question: "What makes Piper TTS different from Coqui TTS?", options: ["Piper TTS supports zero-shot cloning", "Piper TTS is designed for edge devices and runs on very low-powered hardware", "Piper TTS produces higher quality output", "Piper TTS supports more languages"], correctIndex: 1, explanation: "Piper TTS is built for edge devices — it runs on hardware as small as a Raspberry Pi. However, it requires training data and doesn't support zero-shot cloning like Coqui TTS does." },
      { question: "What is the key difference between RVC and OpenVoice?", options: ["RVC is for TTS, OpenVoice is for voice conversion", "RVC requires fine-tuning with training audio, OpenVoice works zero-shot from a short clip", "OpenVoice produces higher quality clones", "RVC only works on Linux"], correctIndex: 1, explanation: "RVC requires 10-30 minutes of training audio and GPU time for fine-tuning, producing the highest quality clones. Once trained, RVC can run in real-time as a live voice filter. OpenVoice works zero-shot from a brief reference clip — faster to set up, but lower quality." },
      { question: "In a voice cloning attack chain, what role does whisper.cpp play?", options: ["It generates the cloned voice", "It creates the speaker embedding", "It transcribes audio to text for use with an LLM", "It modifies the pitch of the audio"], correctIndex: 2, explanation: "whisper.cpp is a speech-to-text tool. In an attack chain, it transcribes a recorded conversation so the attacker can understand the context — and that transcription can be fed directly into llama.cpp to generate a convincing follow-up response in the same conversation." },
    ]} />
  </div>
</div>);

export default LocalToolsSection;
