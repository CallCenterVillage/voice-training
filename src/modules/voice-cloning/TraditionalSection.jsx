import { useState } from "react";
import { C, CodeBlock, Icon, QuizBank, SectionDivider } from '../../components';
import { PipelineDiagram, ToolComparison } from './_helpers';

const TraditionalSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  return (<div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Non-AI Voice Modification</h1>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>Long before AI voice cloning, traditional audio tools could alter pitch, tone, and timbre characteristics. These techniques are well-understood and leave detectable signatures — but they're fast, accessible, widely used, and can still be combined with newer AI tools.</p>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 8 }}>We're representing the voice modification pipeline here as six steps, but real-world chains can be longer or shorter depending on the goal. Only <span style={{ fontStyle: "italic" }}>Input</span> and <span style={{ fontStyle: "italic" }}>Output</span> are required — <span style={{ fontStyle: "italic" }}>EQ/Filter</span>, <span style={{ fontStyle: "italic" }}>Pitch Shift</span>, <span style={{ fontStyle: "italic" }}>Formant</span>, and <span style={{ fontStyle: "italic" }}>FX Chain</span> are all optional stages you can mix and match to manipulate the audio.</p>
    <h2 id="audiomancers-creed" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginTop: 20, marginBottom: 8, scrollMarginTop: 120 }}>The Audiomancer's Creed</h2>
    <div style={{ borderLeft: `3px solid ${C.secondary}`, paddingLeft: 16, margin: "0 0 8px 0", fontStyle: "italic", color: C.dim, fontSize: 13, lineHeight: 1.7 }}>"This is my audio-toolkit. There are many like it, but this one is mine."<br />"My audio-toolkit is my best friend. It is my life."<br />"I must master it as I must master my life."<br />"Without me, my audio-toolkit is useless."<br />"Without my audio-toolkit, I am useless."</div>
    <div style={{ fontSize: 12, color: C.dim }}>— <a href="https://en.wikipedia.org/wiki/Soundwave_(Transformers)" target="_blank" rel="noopener noreferrer" style={{ color: C.dim, textDecoration: "underline" }}>Soundwave</a>, probably</div>
    <SectionDivider />
    <h2 id="example-tool-chains" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Example Tool Chains</h2>
    <p style={{ color: C.secondary, lineHeight: 1.7, marginTop: 0, marginBottom: 10, fontSize: 13 }}>Click each step below to see common tools for that stage. All tools referenced are already preinstalled.</p>
    <PipelineDiagram activeStep={activeStep} onStepClick={i => setActiveStep(i)} steps={[{ icon: "microphone", label: "Input" }, { icon: "chart-bar", label: "EQ/Filter" }, { icon: "arrow-path", label: "Pitch Shift" }, { icon: "scale", label: "Formant" }, { icon: "speaker-wave", label: "FX Chain" }, { icon: "headphones", label: "Output" }]} />
    <p style={{ color: C.accent, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{[
      "Record or obtain an audio file and convert it into a format your tool chain can work with. This is the starting point for any voice modification workflow.",
      "Equalization and filtering let you selectively boost, cut, or remove frequency ranges from the audio. In voice modification, this is used to alter the tonal quality of a voice — for example, cutting low frequencies to thin out a deep voice, boosting higher frequencies to add brightness, or bandpass filtering to simulate a phone line. It's also useful for cleaning up recordings by removing rumble, hiss, or background noise before further processing.",
      "Shift the fundamental frequency of the audio up or down. This changes how high or low the voice sounds without necessarily altering the speed or duration of the recording.",
      "Adjust the resonance characteristics that define a voice's identity. Formants are what make a voice sound distinctly male, female, or childlike — independent of pitch.",
      "Layer multiple effects together to create a more convincing or dramatic transformation. This is where you combine reverb, compression, distortion, and other effects into a single processing chain.",
      "Export and finalize your processed audio. Normalize levels, trim silence, and convert to your target format for delivery or further use.",
    ][activeStep]}</p>
    <ToolComparison tools={[
      // Step 0: Input
      [
        { name: "SoX", desc: "Record audio and convert file formats.", pros: ["Records from mic", "Format conversion", "Scriptable"], cons: ["CLI only"], prereq: "Open a console / terminal window, then run:", install: `# Preinstalled on Call Center Village laptops\n# sudo apt install sox libsox-fmt-all\n\n# Navigate to shared working directory\ncd ~/callcentervillage/voice-cloning\n\n# Record from default mic (16kHz mono, stop with Ctrl+C)\nrec -r 16000 -c 1 input.wav\n\n# Convert format\nsox input.wav output.mp3 && play output.mp3` },
        { name: "Audacity", desc: "Record, visualize, and trim audio with a GUI.", pros: ["Visual waveform", "Easy trimming", "Monitor levels"], cons: ["GUI only", "No scripting"], prereq: "Open the Audacity application (GUI):", install: `# Preinstalled on Call Center Village laptops\n# sudo apt install audacity`, guide: [
          { heading: "Configure audio devices", action: "Edit → Preferences → Audio Settings", steps: ["Set Playback Device to your speakers/headphones", "Set Recording Device to your microphone"] },
          { heading: "Record your audio", action: "File → New to create a blank project", steps: ["Click the red Record button (or press R) to start", "Click Stop (or press Space) when finished"] },
          { heading: "Save your recording", action: "File → Export Audio", steps: ["Navigate to `~/callcentervillage/voice-cloning/`", "Save as `input.wav` (WAV 16-bit PCM)"] },
        ], image: "/images/audacity-screenshot.png" },
      ],
      // Step 1: EQ/Filter
      [
        { name: "SoX", desc: "Apply EQ bands, highpass/lowpass filters, and noise reduction.", pros: ["Fast", "Chainable filters", "Scriptable"], cons: ["No visual feedback"], install: `# Use the input.wav you recorded in the Input step\n# Advanced: chain output.wav from previous steps instead of input.wav\ncd ~/callcentervillage/voice-cloning\n\n# Highpass + lowpass (bandpass 300-3400Hz)\nsox input.wav output.wav highpass 300 lowpass 3400 && play output.wav\n\n# Parametric EQ: boost 3kHz by 6dB\nsox input.wav output.wav equalizer 3000 1q 6 && play output.wav\n\n# Cut low rumble\nsox input.wav output.wav highpass 80 && play output.wav` },
        { name: "FFmpeg", desc: "Complex filter graphs for multi-band EQ and filtering.", pros: ["Filter chaining", "Precise control", "Any format"], cons: ["Steep learning curve"], install: `# Use the input.wav you recorded in the Input step\n# Advanced: chain output.wav from previous steps instead of input.wav\ncd ~/callcentervillage/voice-cloning\n\n# Bandpass filter (telephone band)\nffmpeg -i input.wav -af "highpass=f=300,lowpass=f=3400" output.wav && play output.wav\n\n# Multi-band EQ\nffmpeg -i input.wav -af "equalizer=f=300:t=q:w=2:g=-8,equalizer=f=3000:t=q:w=1:g=6" output.wav && play output.wav` },
        { name: "Audacity", desc: "Visual EQ curves and real-time spectrum analysis.", pros: ["Graphic EQ", "Spectrum view", "Preview"], cons: ["GUI only", "No batch"], install: `# Preinstalled on Call Center Village laptops\n# sudo apt install audacity`, guide: [
          { heading: "Open your file", action: "File → Open → `~/callcentervillage/voice-cloning/input.wav`" },
          { heading: "Apply EQ and filters", steps: ["Effect → EQ and Filters → Filter Curve EQ (draw a custom EQ curve)", "Effect → EQ and Filters → High-Pass Filter / Low-Pass Filter", "Analyze → Plot Spectrum (to visualize frequencies before and after)"] },
          { heading: "Save your result", action: "File → Export Audio → save to `~/callcentervillage/voice-cloning/`" },
        ] },
      ],
      // Step 2: Pitch Shift
      [
        { name: "SoX", desc: "Quick pitch shifts in cents (1/100th of a semitone). Simple but no formant preservation.", pros: ["Blazing fast", "Scriptable", "Simple syntax"], cons: ["No formant control", "Artifacts at extremes"], install: `# Use the input.wav you recorded in the Input step\n# Advanced: chain output.wav from previous steps instead of input.wav\ncd ~/callcentervillage/voice-cloning\n\n# Shift pitch up 300 cents (3 semitones)\nsox input.wav output.wav pitch 300 && play output.wav\n\n# Shift pitch down 500 cents\nsox input.wav output.wav pitch -500 && play output.wav\n\n# Speed-based pitch (changes duration too)\nsox input.wav output.wav speed 1.2 && play output.wav` },
        { name: "RubberBand", desc: "High-quality pitch shifting that preserves timing.", pros: ["Best quality", "Preserves duration", "Real-time capable"], cons: ["Pitch/time only"], install: `# Preinstalled on Call Center Village laptops\n# sudo apt install rubberband-cli\n\n# Use the input.wav you recorded in the Input step\n# Advanced: chain output.wav from previous steps instead of input.wav\ncd ~/callcentervillage/voice-cloning\n\n# Shift up 2 semitones (preserves duration)\nrubberband -p 2 input.wav output.wav && play output.wav\n\n# Shift down 3 semitones\nrubberband -p -3 input.wav output.wav && play output.wav` },
        { name: "FFmpeg", desc: "Pitch shifting via the RubberBand filter or asetrate.", pros: ["Integrates with pipelines", "Multiple methods"], cons: ["Verbose syntax"], install: `# Use the input.wav you recorded in the Input step\n# Advanced: chain output.wav from previous steps instead of input.wav\ncd ~/callcentervillage/voice-cloning\n\n# RubberBand pitch shift via FFmpeg\nffmpeg -i input.wav -af "rubberband=pitch=1.2" output.wav && play output.wav\n\n# Crude pitch shift (changes speed too)\nffmpeg -i input.wav -af "asetrate=48000*1.25,aresample=48000" output.wav && play output.wav` },
      ],
      // Step 3: Formant
      [
        { name: "Praat", desc: "The gold standard for formant analysis and manipulation.", pros: ["Precise formant control", "Scientific accuracy", "Scripting"], cons: ["Dated UI", "Learning curve"], guide: [
          { heading: "Open Praat", steps: ["Launch Praat from the menu bar or application launcher", "You may need to move the Praat Picture window — it often hides the Praat Objects window behind it"] },
          { heading: "Load your audio", action: "In the Praat Objects window: Open → Read from file", steps: ["Navigate to `~/callcentervillage/voice-cloning/`", "Select your `input.wav` file"] },
          { heading: "View and analyze", steps: ["With your sound object selected in the Praat Objects window, click View & Edit", "To view formants: Formants menu → Show Formants", "You can also toggle Pulses, Intensity, Pitch, Spectrogram, and Analysis from the menus across the top"] },
          { heading: "Create a manipulation object", steps: ["Back in the Praat Objects window, with your sound selected: Manipulate → To Manipulation", "Use the default values and click OK", "This creates a new object called `Manipulation <your file name>`"] },
          { heading: "Extract and modify components", steps: ["Select the Manipulation object and extract components: Pulses, Pitch Tier, Duration Tier", "Select the extracted component in the Praat Objects window and use the editing tools to make changes to it", "Select both your modified component and the Manipulation object together, then use the Replace option (e.g. Replace Pitch Tier, Replace Duration Tier) to apply your changes back to the manipulation"] },
        ], guideLabel: "Praat", image: "/images/praat-formants-example.png", note: <>Praat is extremely powerful but has a steep learning curve. Use <strong style={{ color: C.text }}>Help</strong> from the menu bar often — the built-in documentation is thorough.</> },
        { name: "SoX", desc: "Approximate formant shifts using EQ bands (limited but fast).", pros: ["Fast", "No extra tools"], cons: ["Not true formant shifting", "Crude approximation"], install: `# Use the input.wav you recorded in the Input step\n# Advanced: chain output.wav from previous steps instead of input.wav\ncd ~/callcentervillage/voice-cloning\n\n# Approximate female formant shift:\n# boost higher formant regions, cut lower ones\nsox input.wav output.wav \\\n  equalizer 250 2q -8 \\\n  equalizer 800 2q 4 \\\n  equalizer 3000 1q 6 && play output.wav` },
      ],
      // Step 4: FX Chain
      [
        { name: "SoX", desc: "Chain multiple effects: reverb, compression, distortion.", pros: ["All-in-one chains", "Scriptable", "Fast"], cons: ["CLI only"], install: `# Use the input.wav you recorded in the Input step\n# Advanced: chain output.wav from previous steps instead of input.wav\ncd ~/callcentervillage/voice-cloning\n\n# Reverb + compression + EQ chain\nsox input.wav output.wav \\\n  gain -6 \\\n  reverb 50 \\\n  compand 0.3,1 6:-70,-60,-20 -5 -90 0.2 \\\n  equalizer 300 2q -8 equalizer 3000 1q 6 \\\n  gain -n -1 && play output.wav\n\n# Telephone effect\nsox input.wav output.wav \\\n  gain -6 \\\n  highpass 300 lowpass 3400 \\\n  compand 0.3,1 6:-70,-60,-20 -5 -90 0.2 \\\n  gain -n -1 && play output.wav` },
        { name: "FFmpeg", desc: "Complex filter graphs for layered effects processing.", pros: ["Filter chaining", "Parallel processing", "Any format"], cons: ["Verbose", "Hard to debug"], install: `# Use the input.wav you recorded in the Input step\n# Advanced: chain output.wav from previous steps instead of input.wav\ncd ~/callcentervillage/voice-cloning\n\n# Chorus + vibrato chain\nffmpeg -i input.wav -af "vibrato=f=8:d=0.5,chorus=0.5:0.9:50:0.4:0.25:2" output.wav && play output.wav\n\n# Tremolo + bandpass\nffmpeg -i input.wav -af "tremolo=f=5:d=0.6,highpass=f=300,lowpass=f=3400" output.wav && play output.wav` },
        { name: "Audacity", desc: "Preview and stack effects with real-time playback.", pros: ["Real-time preview", "Effect stacking", "Visual feedback"], cons: ["GUI only", "No batch"], guide: [
          { heading: "Open your file", action: "File → Open → `~/callcentervillage/voice-cloning/input.wav`" },
          { heading: "Stack effects", steps: ["Effect → Delay and Reverb → Reverb → adjust Room Size, Dampening", "Effect → Volume and Compression → Compressor → set threshold, ratio", "Effect → Distortion and Modulation → Distortion → choose type, amount", "Chain via Effect → Repeat Last Effect (Ctrl+R)"] },
          { heading: "Save your result", action: "File → Export Audio → save to `~/callcentervillage/voice-cloning/`" },
        ] },
      ],
      // Step 5: Output
      [
        { name: "SoX", desc: "Export, normalize, and format final audio.", pros: ["Normalize levels", "Format conversion", "Trim silence"], cons: ["CLI only"], install: `# Use the input.wav you recorded in the Input step\n# Advanced: chain output.wav from previous steps instead of input.wav\ncd ~/callcentervillage/voice-cloning\n\n# Normalize to -1dB\nsox input.wav output.wav gain -n -1 && play output.wav\n\n# Trim leading/trailing silence\nsox input.wav output.wav silence 1 0.1 1% reverse silence 1 0.1 1% reverse && play output.wav\n\n# Convert to 16kHz mono 16-bit PCM WAV\nsox input.wav -r 16000 -c 1 -b 16 output.wav && play output.wav` },
        { name: "FFmpeg", desc: "Export to any format with precise codec control.", pros: ["Any codec", "Metadata control", "Streaming formats"], cons: ["Many options to learn"], install: `# Use the input.wav you recorded in the Input step\n# Advanced: chain output.wav from previous steps instead of input.wav\ncd ~/callcentervillage/voice-cloning\n\n# Export as high-quality MP3\nffmpeg -i input.wav -codec:a libmp3lame -qscale:a 2 output.mp3 && play output.mp3\n\n# Export as Opus (small, high quality)\nffmpeg -i input.wav -codec:a libopus -b:a 128k output.opus && play output.opus\n\n# Normalize volume\nffmpeg -i input.wav -af "loudnorm=I=-16:LRA=11:TP=-1" output.wav && play output.wav` },
        { name: "Audacity", desc: "Final review with visual waveform before export.", pros: ["Visual verification", "Multiple export formats", "Metadata editor"], cons: ["GUI only"], guide: [
          { heading: "Open your file", action: "File → Open → `~/callcentervillage/voice-cloning/input.wav`" },
          { heading: "Review and normalize", steps: ["Effect → Volume and Compression → Normalize", "View → Show Clipping (check for distortion)"] },
          { heading: "Export final audio", steps: ["File → Export Audio → save to `~/callcentervillage/voice-cloning/`", "File → Export Multiple (batch from labels)"] },
        ] },
      ],
    ][activeStep]} />
    <SectionDivider />
    <h2 id="voice-disguise-recipes" style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8, scrollMarginTop: 120 }}>Voice Disguise Recipes</h2>
    <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 14 }}>Here are a few ready-made effect chains to try. You can also pipe tools together (e.g. FFmpeg into SoX) to chain different tools in a single command. Copy them into your terminal, swap in your own audio file, and experiment — tweak the values, stack them differently, or combine techniques. The best way to learn this stuff is to play around and hear what happens.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: C.text, fontSize: 15, fontWeight: 600 }}>
        <Icon name="beaker" size={16} style={{ color: C.tertiary }} />Try It Out
      </div>
      <div style={{ display: "grid", gap: 12, color: C.muted, fontSize: 14, lineHeight: 1.8 }}>
        {[
          { name: "Male → Female (rough)", cmd: "sox input.wav output.wav \\\n  pitch 500 \\\n  equalizer 250 2q -6 \\\n  equalizer 4000 1q 5 \\\n  && play output.wav" },
          { name: "Female → Male (rough)", cmd: "sox input.wav output.wav \\\n  pitch -400 \\\n  equalizer 200 2q 4 \\\n  equalizer 3500 1q -5 \\\n  && play output.wav" },
          { name: "Robot / Anonymizer", cmd: 'ffmpeg -i input.wav \\\n  -af "vibrato=f=12:d=0.8,chorus=0.7:0.9:30:0.6:0.3:3,aecho=0.8:0.6:6:0.5,highpass=f=200,lowpass=f=4000" \\\n  output.wav && play output.wav' },
          { name: "Phone Call Simulation", cmd: "sox input.wav output.wav \\\n  gain -6 \\\n  highpass 300 \\\n  lowpass 3400 \\\n  compand 0.3,1 6:-70,-60,-20 -5 -90 0.2 \\\n  gain -n -1 \\\n  && play output.wav" },
          { name: "Whisper Effect", cmd: 'ffmpeg -i input.wav \\\n  -af "highpass=f=500,lowpass=f=4000,volume=0.4,afftdn=nf=-20" \\\n  output.wav && play output.wav' },
          { name: "Underwater / Muffled", cmd: "sox input.wav output.wav \\\n  lowpass 600 \\\n  reverb 80 \\\n  gain -n -1 \\\n  && play output.wav" },
          { name: "Aged / Gravelly Voice", cmd: "sox input.wav output.wav \\\n  pitch -200 \\\n  overdrive 8 \\\n  equalizer 800 2q 4 \\\n  reverb 20 \\\n  gain -n -1 \\\n  && play output.wav" },
          { name: "Piped: Record → Pitch Shift → Telephone Effect", cmd: "sox input.wav -t wav - pitch 300 \\\n  | sox -t wav - output.wav \\\n  highpass 300 \\\n  lowpass 3400 \\\n  gain -n -1 \\\n  && play output.wav" },
          { name: "Piped: Pitch Up → Reverb → Normalize", cmd: "sox input.wav -t wav - pitch 500 \\\n  | sox -t wav - output.wav \\\n  reverb 40 \\\n  gain -n -1 \\\n  && play output.wav" },
          { name: "Piped: FFmpeg Filter → SoX Post-Processing", cmd: 'ffmpeg -i input.wav \\\n  -af "vibrato=f=6:d=0.3" \\\n  -f s16le -ar 16000 -ac 1 - \\\n  | sox -t raw -r 16000 -e signed -b 16 -c 1 - output.wav \\\n  equalizer 3000 1q 4 \\\n  gain -n -1 \\\n  && play output.wav' },
        ].map((r, i) => <div key={i} style={{ background: "#06040c", padding: 12, borderRadius: 8 }}><div style={{ color: C.tertiary, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{r.name}</div><CodeBlock code={r.cmd} language="bash" /></div>)}
      </div>
    </div>
    <SectionDivider />
    <div id="knowledge-check" style={{ scrollMarginTop: 120 }}>
      <QuizBank questions={[
        { question: "Which tool shifts pitch while preserving the original duration?", options: ["SoX", "RubberBand", "FFmpeg", "Praat"], correctIndex: 1, explanation: "RubberBand uses time-stretching algorithms to shift pitch independently of duration. The SoX speed effect changes both pitch and duration together." },
        { question: "Which tool is BEST for batch processing 1000 audio files?", options: ["Audacity", "SoX", "Praat", "RubberBand"], correctIndex: 1, explanation: "SoX is purpose-built for CLI audio processing — blazing fast and scriptable." },
        { question: "How does a telephone effect help disguise a voice?", options: ["Adds reverb", "Removes frequencies outside 300-3400Hz, destroying identifying harmonics", "Speeds up audio", "Adds masking noise"], correctIndex: 1, explanation: "PSTN bandwidth (300-3400Hz) removes chest resonance and sibilance — key voice identity features." },
      ]} />
    </div>
  </div>);
};

export default TraditionalSection;
