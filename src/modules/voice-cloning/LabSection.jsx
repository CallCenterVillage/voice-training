import { useState } from "react";
import { C, CodeBlock, InfoBox, NextModuleLink } from '../../components';
import { SectionDivider } from './_helpers';

const LabSection = () => {
  const [step, setStep] = useState(0);
  const [scriptOpen, setScriptOpen] = useState(true);
  const exercises = [
    { title: "1: Record & Analyze", desc: "Record yourself reading the script above, then visualize your voice with a spectrogram and review the audio statistics. This gives you a baseline to compare against when you start modifying and cloning your voice in the next steps.", cmd: `# Navigate to working directory\ncd ~/callcentervillage/voice-cloning\n\n# Record yourself reading the script above (~20 seconds)\n# You can also use Audacity: Record → File → Export Audio → save as my_voice.wav\nrec -r 44100 -c 1 -b 16 my_voice.wav trim 0 20\n\n# Generate a spectrogram\nsox my_voice.wav -n spectrogram -o spectrum.png\n\n# View the spectrogram in the terminal\nimgcat spectrum.png\n\n# View audio file info and statistics\nsoxi my_voice.wav && sox my_voice.wav -n stat 2>&1` },
    { title: "2: Voice Modification", desc: <>Now try some of the non-AI voice modification techniques we covered earlier. The commands below are starting points — experiment with the values to hear how they change your voice. Try higher or lower pitch numbers, adjust the frequency cutoffs on the telephone effect, or tweak the vibrato settings on the robot effect. Play each output with <code style={{ background: `${C.primary}20`, border: `1px solid ${C.primary}44`, borderRadius: 4, padding: "1px 5px", fontSize: 12, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: C.accent }}>play filename.wav</code> and compare them to your original recording.</>, cmd: `# Pitch up\nsox my_voice.wav v1_higher.wav pitch 400\n\n# Pitch down\nsox my_voice.wav v2_deeper.wav pitch -300\n\n# Telephone effect\nsox my_voice.wav v3_phone.wav highpass 300 lowpass 3400\n\n# Robot effect\nffmpeg -i my_voice.wav -af "vibrato=f=6:d=0.4" v4_robot.wav` },
    { title: "3: AI Cloning", desc: "Use Coqui TTS or Spark TTS to clone your voice and make it say something fun — have it sing a song, leave a fake voicemail, or say something you'd never actually say. Keep the text short though, as longer phrases take significantly longer to generate on CPU.", cmd: `cd ~/callcentervillage/voice-cloning\n\n# Clone your voice using the recording from Step 1\ncoqui-tts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n    --speaker_wav my_voice.wav --language_idx en \\\n    --text "This is an AI clone of my voice. Pretty wild, right?" \\\n    --out_path clone.wav && play clone.wav\n\n# This may take several minutes on CPU — be patient` },
    { title: "4: Detection", desc: "Now put on your defender hat — use Resemblyzer to measure how similar your AI clone is to the real thing, and compare spectrograms to see what artifacts the AI left behind. Try it against your modified voices too and see which ones fool the similarity check.", cmd: `# === Speaker Similarity (Resemblyzer) ===\n# Compare your original voice against the AI clone\nresemblyzer my_voice.wav clone.wav\n\n# Try it against your modified voices too\nresemblyzer my_voice.wav v1_higher.wav\nresemblyzer my_voice.wav v2_deeper.wav\nresemblyzer my_voice.wav v3_phone.wav\nresemblyzer my_voice.wav v4_robot.wav\n\n# === Visual Detection (Spectrograms) ===\n# Generate spectrograms for your original and cloned voices\nsox my_voice.wav -n spectrogram -o spec_original.png\nsox clone.wav -n spectrogram -o spec_clone.png\n\n# View them side by side in the terminal\nimgcat spec_original.png\nimgcat spec_clone.png\n\n# What to look for:\n# - Metallic shimmer: unnatural energy above 8kHz (vocoder artifacts)\n# - Missing room tone: AI audio often has unnaturally clean silence\n# - Flat pitch contour: AI may lack natural pitch variation\n# - Repeating patterns: look for too-perfect harmonic structure\n\n# === Frequency Statistics ===\n# Compare the stats between original and clone\necho "=== Original ===" && sox my_voice.wav -n stat 2>&1\necho "=== Clone ===" && sox clone.wav -n stat 2>&1` },
  ];
  return (<div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Interactive Lab</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>Put it all together — record your voice, modify it, clone it with AI, then try to detect which is real vs AI vs modified.</p>
    <InfoBox>If you need any help, please find an on-site Call Center Village staff member.</InfoBox>

    <div role="tablist" style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
      {exercises.map((ex, i) => <button key={i} role="tab" aria-selected={i === step} onClick={() => setStep(i)} style={{ background: i === step ? `${C.primary}20` : C.card, border: `1px solid ${i === step ? C.secondary : C.border}`, borderRadius: 8, padding: "10px 16px", color: i === step ? C.accent : C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}>{ex.title}</button>)}
    </div>

    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 24, overflow: "hidden" }}>
      <button onClick={() => setScriptOpen(!scriptOpen)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: 20, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.accent }}>Recording Script</div>
        <span style={{ color: C.dim, fontSize: 14, fontWeight: 600 }}>{scriptOpen ? "Hide ▲" : "Show ▼"}</span>
      </button>
      {scriptOpen && (
        <div style={{ padding: "0 20px 20px" }}>
          <p style={{ fontSize: 13, color: C.dim, marginBottom: 8, marginTop: 0 }}>Read this aloud at a natural pace. It covers all major English phonemes, varied intonation, and different mouth shapes. You'll use this recording throughout the exercises below.</p>
          <div style={{ background: C.codeBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20, fontSize: 17, color: C.text, lineHeight: 2, letterSpacing: 0.2 }}>
            "The quick brown fox jumps gracefully over a lazy dog sleeping beneath the old oak tree. She sells thick, fresh seashells down by the shimmering seashore every Thursday morning. Would you kindly confirm your date of birth and the last four digits of your account number? I wasn't sure if the package arrived yesterday or if it's expected tomorrow — could you please check on that for me? Absolutely, I'd be happy to transfer you to our billing department right away. Thank you so much for your patience, and have a wonderful evening!"
          </div>
          <p style={{ fontSize: 12, color: C.dim, marginTop: 8, marginBottom: 0, fontStyle: "italic" }}>Enunciate each word as clearly as you can for a more expressive voice clone.</p>
        </div>
      )}
    </div>

    <div style={{ background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${C.secondary}33` }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 12 }}>{exercises[step].title}</div>
      {exercises[step].desc && <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 16, marginTop: 0 }}>{exercises[step].desc}</p>}
      <CodeBlock code={exercises[step].cmd} language="bash" />
    </div>
    <SectionDivider />
    <NextModuleLink href="/voice-agents/intro" label="Continue to Voice Agents" />
  </div>);
};

export default LabSection;
