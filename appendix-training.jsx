import { C, CodeBlock, TrainingShell, Icon, InfoBox } from './src/components';

const SectionDivider = () => <hr style={{ border: "none", borderTop: "1px solid #040208", margin: "48px 0" }} />;

const toAnchorId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

const SECTIONS = [
  { id: "audio", title: "Audio Tips", icon: "speaker-wave", anchors: [
    { id: "dtmf-table", label: "DTMF Frequency Table" },
    { id: "dtmf", label: "DTMF Tone Generation" },
    { id: "yt-dlp", label: "Extracting Audio (yt-dlp)" },
  ] },
  { id: "voice-glossary", title: "Voice Tool Glossary", icon: "microphone" },
  { id: "cli-glossary", title: "CLI Tool Glossary", icon: "command-line" },
  { id: "project-glossary", title: "Project Tool Glossary", icon: "cpu" },
  { id: "fun-tools", title: "Other Tools", icon: "star" },
  { id: "built-with", title: "Project Credits", icon: "code-bracket" },
  { id: "thank-you", title: "Thank You", icon: "heart" },
];

const AudioSection = () => (
  <div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Audio Tips</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Useful audio techniques for working with telephone systems and voice processing.
    </p>

    <div id="dtmf-table" style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>DTMF Frequency Table</div>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Each key on a telephone keypad produces a unique pair of frequencies — one from the row and one from the column. This dual-tone multi-frequency (DTMF) system is how phones signal digits to the network.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12, overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, textAlign: "center" }}>
        <thead>
          <tr>
            <th style={{ padding: "8px 12px", borderBottom: `2px solid ${C.border}`, color: C.dim, fontWeight: 700 }}></th>
            <th style={{ padding: "8px 12px", borderBottom: `2px solid ${C.border}`, color: C.accent, fontWeight: 700 }}>1209 Hz</th>
            <th style={{ padding: "8px 12px", borderBottom: `2px solid ${C.border}`, color: C.accent, fontWeight: 700 }}>1336 Hz</th>
            <th style={{ padding: "8px 12px", borderBottom: `2px solid ${C.border}`, color: C.accent, fontWeight: 700 }}>1477 Hz</th>
            <th style={{ padding: "8px 12px", borderBottom: `2px solid ${C.border}`, color: C.accent, fontWeight: 700 }}>1633 Hz</th>
          </tr>
        </thead>
        <tbody>
          {[
            { row: "697 Hz", keys: ["1", "2", "3", "A"] },
            { row: "770 Hz", keys: ["4", "5", "6", "B"] },
            { row: "852 Hz", keys: ["7", "8", "9", "C"] },
            { row: "941 Hz", keys: ["*", "0", "#", "D"] },
          ].map(r => (
            <tr key={r.row}>
              <td style={{ padding: "8px 12px", borderBottom: `1px solid ${C.border}`, color: C.accent, fontWeight: 700 }}>{r.row}</td>
              {r.keys.map(k => (
                <td key={k} style={{ padding: "8px 12px", borderBottom: `1px solid ${C.border}`, color: C.text, fontWeight: 600, fontSize: 16 }}>{k}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p style={{ color: C.dim, fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>Keys A–D are defined in the standard but rarely found on consumer phones. They're used in military, amateur radio, and some PBX systems.</p>

    <SectionDivider />

    <div id="dtmf" style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>DTMF Tone Generation</div>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Generate clean DTMF (touch-tone) signals — especially helpful when working with telephone systems, IVR menus, and call center testing.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>Using FFmpeg (CLI)</div>
      <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, margin: "0 0 12px 0" }}>
        Each DTMF digit is two sine waves mixed together. FFmpeg can generate and mix these from the command line.
      </p>
      <CodeBlock language="bash" code={`# Generate a single DTMF digit (e.g. "5" = 770 Hz + 1336 Hz)
# Standard DTMF: 250ms tone
ffmpeg -f lavfi -i "sine=frequency=770:duration=0.25" \\
       -f lavfi -i "sine=frequency=1336:duration=0.25" \\
       -filter_complex amix=inputs=2 -ar 16000 -ac 1 digit5.wav -y \\
  && play digit5.wav`} />
    </div>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>Using Audacity (GUI)</div>
      <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: C.muted, lineHeight: 2 }}>
        <li>Open Audacity</li>
        <li>Generate → DTMF Tones</li>
        <li>Enter the sequence you want (e.g. <code style={{ background: C.codeBg, padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>18005551234</code> for a phone number)</li>
        <li>Set the duration and amplitude, then click OK</li>
        <li>File → Export Audio → save as WAV</li>
      </ol>
    </div>

    <SectionDivider />

    <div id="yt-dlp" style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4, scrollMarginTop: 120 }}>Extracting Audio (yt-dlp)</div>
    <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>Download audio from YouTube and other video platforms — useful for obtaining voice samples from public recordings like conference talks, interviews, and podcasts.</p>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
      <CodeBlock language="bash" code={`# yt-dlp is pre-installed on Call Center Village laptops\ncd ~/callcentervillage/voice-cloning\n\n# Download audio only from a YouTube video\nyt-dlp -x --audio-format wav -o "downloaded.%(ext)s" "https://www.youtube.com/watch?v=EXAMPLE"\n\n# If the output isn't WAV, convert with FFmpeg\nffmpeg -i downloaded.webm -ar 16000 -ac 1 -c:a pcm_s16le sample.wav && play sample.wav\n\n# Download just a specific clip (e.g., 30 seconds starting at 1:05)\nyt-dlp -x --audio-format wav -o "clip.%(ext)s" \\\n  --download-sections "*1:05-1:35" \\\n  "https://www.youtube.com/watch?v=EXAMPLE"\n\n# Full pipeline: download, convert to 16kHz mono WAV, and play\nyt-dlp -x --audio-format wav -o "raw.%(ext)s" "https://www.youtube.com/watch?v=EXAMPLE" && \\\n  ffmpeg -i raw.wav -ar 16000 -ac 1 -c:a pcm_s16le sample.wav && \\\n  play sample.wav`} />
    </div>
    <InfoBox>Only download audio you have the right to use. Public recordings (conference talks, earnings calls, press conferences) are generally fair game for security research, but always check the terms and applicable laws.</InfoBox>
  </div>
);

const voiceTools = [
  { name: "aplay", desc: "ALSA audio player for raw and WAV playback", install: "system package (alsa-utils)",
    installCode: `# === Install aplay ===
sudo apt install -y alsa-utils

# Verify
aplay --version` },
  { name: "audacity", desc: "GUI audio editor for recording, effects, and analysis", install: "system package",
    installCode: `# === Install Audacity ===
sudo apt install -y audacity` },
  { name: "espeak", desc: "Original formant-based speech synthesizer (predecessor to espeak-ng)", install: "system package",
    installCode: `# === Install espeak ===
sudo apt install -y espeak

# Verify
espeak --version` },
  { name: "espeak-ng", desc: "Formant-based text-to-speech synthesizer", install: "system package",
    installCode: `# === Install eSpeak NG ===
sudo apt install -y espeak-ng

# Verify
espeak-ng --version` },
  { name: "festival", desc: "Unit-selection text-to-speech from University of Edinburgh", install: "system package",
    installCode: `# === Install Festival ===
sudo apt install -y festival festvox-kallpc16k

# Verify
festival --version` },
  { name: "ffmpeg", desc: "Audio/video processing and format conversion", install: "system package",
    installCode: `# === Install FFmpeg ===
sudo apt install -y ffmpeg

# Verify
ffmpeg -version` },
  { name: "pipewire", desc: "Modern audio/video server replacing PulseAudio and JACK", install: "system package",
    installCode: `# === Install PipeWire ===
sudo apt install -y pipewire pipewire-alsa pipewire-audio pipewire-pulse

# Verify
pipewire --version` },
  { name: "play", desc: "Audio playback from the command line (part of SoX)", install: "system package (SoX)",
    installCode: `# Installed as part of SoX
sudo apt install -y sox libsox-fmt-all` },
  { name: "praat", desc: "Formant analysis and voice manipulation", install: "system package",
    installCode: `# === Install Praat ===
sudo apt install -y praat

# Verify
praat --version` },
  { name: "rec", desc: "Audio recording from the command line (part of SoX)", install: "system package (SoX)",
    installCode: `# Installed as part of SoX
sudo apt install -y sox libsox-fmt-all` },
  { name: "rubberband", desc: "High-quality pitch shifting that preserves timing", install: "system package (rubberband-cli)",
    installCode: `# === Install RubberBand ===
sudo apt install -y rubberband-cli

# Verify
rubberband --version` },
  { name: "sox", desc: "Audio manipulation, effects, and format conversion", install: "system package",
    installCode: `# === Install SoX ===
# Includes sox, soxi, play, and rec commands

sudo apt install -y sox libsox-fmt-all` },
  { name: "soxi", desc: "Audio file info and statistics (part of SoX)", install: "system package (SoX)",
    installCode: `# Installed as part of SoX
sudo apt install -y sox libsox-fmt-all` },
  { name: "speex", desc: "Open-source audio compression codec designed for speech", install: "system package",
    installCode: `# === Install Speex ===
sudo apt install -y speex

# Verify
speexenc --version` },
  { name: "spek", desc: "Acoustic spectrum analyzer with a GUI spectrogram view", install: "system package",
    installCode: `# === Install Spek ===
sudo apt install -y spek` },
  { name: "text2wave", desc: "Convert text to WAV audio files (part of Festival)", install: "system package (Festival)",
    installCode: `# Installed as part of Festival
sudo apt install -y festival festvox-kallpc16k` },
].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

const cliTools = [
  { name: "sipgrep", desc: "SIP-aware packet capture and filtering tool", install: "system package",
    installCode: `# === Install sipgrep ===
sudo apt install -y sipgrep

# Verify
sipgrep --version` },
  { name: "sip-tester", desc: "SIP traffic generator and testing tool (SIPp)", install: "system package",
    installCode: `# === Install sip-tester (SIPp) ===
sudo apt install -y sip-tester

# Verify
sipp -v` },
  { name: "sipvicious", desc: "SIP auditing toolkit — scanner, enumerator, and password cracker for VoIP systems", install: "system package",
    installCode: `# === Install SIPVicious ===
sudo apt install -y sipvicious

# Verify
svmap --version` },
  { name: "sngrep", desc: "Terminal-based SIP message flow viewer and packet capture tool", install: "system package",
    installCode: `# === Install sngrep ===
sudo apt install -y sngrep

# Verify
sngrep --version` },
  { name: "imgcat", desc: "Display images in the terminal (renders PNG/JPG/GIF inline in supported terminals)", install: "built from source (Go)",
    installCode: `# === Build imgcat from source ===
# Requires Go
sudo apt install -y golang-go

# Build and install in one step
sudo go install github.com/danielgatis/imgcat@latest

# Copy the binary to /usr/local/bin so all users can access it
sudo cp ~/go/bin/imgcat /usr/local/bin/imgcat

# Verify
imgcat --help` },
  { name: "yt-dlp", desc: "Download audio/video from YouTube and other platforms", install: "system package",
    installCode: `# === Install yt-dlp via uv ===
# The apt version is often outdated — uv keeps it current

sudo mkdir -p /opt/yt-dlp
cd /opt/yt-dlp

# Create venv and install with uv
sudo uv venv .venv --python 3.12
sudo uv pip install --python .venv/bin/python3 yt-dlp

# === Create system wrapper ===
sudo tee /usr/local/bin/yt-dlp << 'EOF'
#!/bin/bash
source /opt/yt-dlp/.venv/bin/activate
exec yt-dlp "$@"
EOF
sudo chmod +x /usr/local/bin/yt-dlp

# Verify
yt-dlp --version

# === Update yt-dlp ===
# sudo uv pip install --python /opt/yt-dlp/.venv/bin/python3 --upgrade yt-dlp` },
  { name: "curl", desc: "HTTP client for API requests", install: "system package",
    installCode: `# === Install curl ===
# Usually pre-installed on Ubuntu/Pop!_OS

sudo apt install -y curl

# Verify
curl --version` },
  { name: "jq", desc: "JSON processor for parsing API responses", install: "system package",
    installCode: `# === Install jq ===
sudo apt install -y jq

# Verify
jq --version` },
  { name: "time", desc: "Measure command execution time", install: "system package",
    installCode: `# === Install time ===
sudo apt install -y time` },
  { name: "git", desc: "Version control", install: "system package",
    installCode: `# === Install Git ===
# Usually pre-installed on Ubuntu/Pop!_OS

sudo apt install -y git

# Verify
git --version` },
  { name: "git-lfs", desc: "Git extension for versioning large files (model weights, audio datasets)", install: "system package",
    installCode: `# === Install Git LFS ===
sudo apt install -y git-lfs

# Initialize Git LFS for your user (one-time setup)
git lfs install

# Verify
git lfs version` },
  { name: "podman", desc: "Rootless container runtime (Docker alternative)", install: "system package",
    installCode: `# === Install Podman ===
sudo apt install -y podman

# Verify
podman --version` },
  { name: "podman-compose", desc: "Docker Compose alternative for Podman", install: "system package",
    installCode: `# === Install Podman Compose ===
sudo apt install -y podman-compose

# Verify
podman-compose --version` },
  { name: "golang", desc: "Go programming language compiler and tools", install: "system package",
    installCode: `# === Install Go ===
sudo apt install -y golang-go

# Verify
go version` },
  { name: "nano", desc: "Simple terminal-based text editor", install: "system package",
    installCode: `# === Install nano ===
# Usually pre-installed on Ubuntu/Pop!_OS

sudo apt install -y nano

# Verify
nano --version` },
  { name: "netcat", desc: "TCP/UDP networking utility for reading and writing across connections", install: "system package",
    installCode: `# === Install netcat ===
# Two variants available — OpenBSD version is recommended
sudo apt install -y netcat-openbsd

# Or the traditional version
# sudo apt install -y netcat-traditional

# Verify
nc -h` },
  { name: "ngrep", desc: "Network packet grep — filter and display network traffic by pattern", install: "system package",
    installCode: `# === Install ngrep ===
sudo apt install -y ngrep

# Verify
ngrep -h` },
  { name: "nmap", desc: "Network scanner and security auditing tool", install: "system package",
    installCode: `# === Install nmap ===
sudo apt install -y nmap

# Verify
nmap --version` },
  { name: "pipx", desc: "Install and run Python CLI tools in isolated environments", install: "system package",
    installCode: `# === Install pipx ===
sudo apt install -y pipx

# Verify
pipx --version` },
  { name: "uv", desc: "Fast Python package manager and virtual environment tool from Astral", install: "installer script",
    installCode: `# === Install uv ===
curl -LsSf https://astral.sh/uv/install.sh | sh

# Verify
uv --version` },
].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

const VoiceGlossarySection = () => (
  <div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Voice Tool Glossary</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Audio and voice tools used across the training modules — recording, playback, synthesis, and analysis.
    </p>
    <div style={{ display: "grid", gap: 20 }}>
      {voiceTools.map(t => (
        <div key={t.name} id={`voice-${toAnchorId(t.name)}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", scrollMarginTop: 120 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: t.installCode ? 12 : 0 }}>
            <code style={{ background: C.codeBg, color: C.accent, padding: "2px 8px", borderRadius: 4, fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>{t.name}</code>
            <span style={{ color: C.text, fontSize: 14, flex: 1, minWidth: 200 }}>{t.desc}</span>
            <span style={{ color: C.dim, fontSize: 12, whiteSpace: "nowrap" }}>{t.install}</span>
          </div>
          {t.installCode && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dim, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Installation</div>
              <CodeBlock language="bash" code={t.installCode} />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const CLIGlossarySection = () => (
  <div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>CLI Tool Glossary</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      System CLI tools used across the training modules — voice cloning, voice agents, and social engineering.
    </p>
    <div style={{ display: "grid", gap: 20 }}>
      {cliTools.map(t => (
        <div key={t.name} id={`cli-${toAnchorId(t.name)}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", scrollMarginTop: 120 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: t.installCode ? 12 : 0 }}>
            <code style={{ background: C.codeBg, color: C.accent, padding: "2px 8px", borderRadius: 4, fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>{t.name}</code>
            <span style={{ color: C.text, fontSize: 14, flex: 1, minWidth: 200 }}>{t.desc}</span>
            <span style={{ color: C.dim, fontSize: 12, whiteSpace: "nowrap" }}>{t.install}</span>
          </div>
          {t.installCode && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dim, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Installation</div>
              <CodeBlock language="bash" code={t.installCode} />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const projectTools = {
  "Speech-to-Text": [
    { name: "whisper.cpp", path: "/opt/whisper.cpp", url: "https://github.com/ggml-org/whisper.cpp", desc: "C/C++ port of OpenAI Whisper for fast local speech recognition",
      installCode: `# === Install whisper.cpp to /opt ===
# C++ project — no Python venv needed

# Clone the repository
sudo git clone https://github.com/ggml-org/whisper.cpp /opt/whisper.cpp
cd /opt/whisper.cpp

# Build with CMake
sudo cmake -B build
sudo cmake --build build --config Release -j$(nproc)

# Download models
sudo bash models/download-ggml-model.sh tiny.en
sudo bash models/download-ggml-model.sh base.en
sudo bash models/download-ggml-model.sh small.en

# === Create system wrappers ===
sudo ln -sf /opt/whisper.cpp/build/bin/whisper-cli /usr/local/bin/whisper-cli
sudo ln -sf /opt/whisper.cpp/build/bin/whisper-stream /usr/local/bin/whisper-stream
sudo ln -sf /opt/whisper.cpp/build/bin/whisper-server /usr/local/bin/whisper-server

# Verify
whisper-cli -m /opt/whisper.cpp/models/ggml-tiny.en.bin -f test.wav` },
    { name: "Faster Whisper", path: "/opt/faster-whisper", url: "https://github.com/SYSTRAN/faster-whisper", desc: "CTranslate2-accelerated Whisper inference",
      installCode: `# === Install Faster Whisper to /opt ===
# Python 3.12 · CPU (onnxruntime + ctranslate2)

sudo mkdir -p /opt/faster-whisper
cd /opt/faster-whisper

# Create venv with uv (Python 3.12)
sudo uv venv .venv --python 3.12

# Install faster-whisper and dependencies
sudo uv pip install --python .venv/bin/python3 \\
  faster-whisper==1.2.1 \\
  ctranslate2==4.7.1 \\
  onnxruntime==1.24.3

# Models download automatically on first use to ~/.cache/huggingface

# === Create system wrapper ===
sudo tee /usr/local/bin/faster-whisper << 'EOF'
#!/bin/bash
# Usage: faster-whisper <audio_file> [model_size]
source /opt/faster-whisper/.venv/bin/activate
MODEL=\${2:-base.en}
exec python3 -c "
import sys
from faster_whisper import WhisperModel
model = WhisperModel('$MODEL', device='cpu', compute_type='int8')
segments, info = model.transcribe(sys.argv[1], beam_size=5, vad_filter=True)
for segment in segments:
    print('[%.2fs -> %.2fs] %s' % (segment.start, segment.end, segment.text))
" "$1"
EOF
sudo chmod +x /usr/local/bin/faster-whisper

# Verify
faster-whisper test.wav` },
  ],
  "Language Models": [
    { name: "llama.cpp", path: "/opt/llama.cpp", url: "https://github.com/ggml-org/llama.cpp", desc: "C/C++ LLM inference engine for running local language models",
      installCode: `# === Install llama.cpp to /opt ===
# C++ project — no Python venv needed

# Clone the repository
sudo git clone https://github.com/ggml-org/llama.cpp /opt/llama.cpp
cd /opt/llama.cpp

# Build with CMake
sudo cmake -B build
sudo cmake --build build --config Release -j$(nproc)

# Download a model (example: Llama 3.2 1B quantized)
sudo mkdir -p /opt/llama.cpp/models
# Download GGUF models from Hugging Face, e.g.:
# sudo wget -O /opt/llama.cpp/models/llama-3.2-1b-instruct-q4_k_m.gguf \\
#   "https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf"

# === Create system wrappers ===
sudo ln -sf /opt/llama.cpp/build/bin/llama-cli /usr/local/bin/llama-cli
sudo ln -sf /opt/llama.cpp/build/bin/llama-server /usr/local/bin/llama-server
sudo ln -sf /opt/llama.cpp/build/bin/llama-simple /usr/local/bin/llama-simple
sudo ln -sf /opt/llama.cpp/build/bin/llama-tts /usr/local/bin/llama-tts

# Verify
llama-cli -m /opt/llama.cpp/models/llama-3.2-1b-instruct-q4_k_m.gguf \\
  -cnv -p "You are a helpful assistant."` },
  ],
  "Text-to-Speech": [
    { name: "Piper TTS", path: "/opt/piper", url: "https://github.com/OHF-Voice/piper1-gpl", desc: "Fast local neural text-to-speech",
      installCode: `# === Install Piper TTS to /opt ===
# Python 3.14 · CPU (onnxruntime)

sudo mkdir -p /opt/piper/models
cd /opt/piper

# Create venv with uv (Python 3.14)
sudo uv venv .venv --python 3.14

# Install piper-tts
sudo uv pip install --python .venv/bin/python3 \\
  piper-tts==1.4.1 \\
  onnxruntime==1.24.3

# Download voice models
cd /opt/piper/models
sudo wget https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-en-us-lessac-medium.tar.gz
sudo tar xzf voice-en-us-lessac-medium.tar.gz && sudo rm voice-en-us-lessac-medium.tar.gz

# === Create system wrapper ===
sudo tee /usr/local/bin/piper << 'EOF'
#!/bin/bash
source /opt/piper/.venv/bin/activate
exec piper "$@"
EOF
sudo chmod +x /usr/local/bin/piper

# Verify
echo "Hello from Piper" | piper \\
  --model /opt/piper/models/en_US-lessac-medium.onnx \\
  --output_file test.wav && play test.wav

# Raw audio output for piping
echo "Streaming audio" | piper \\
  --model /opt/piper/models/en_US-lessac-medium.onnx \\
  --output_raw | aplay -r 22050 -f S16_LE` },
    { name: "Kokoro TTS", path: "/opt/kokoro", url: "https://github.com/thewh1teagle/kokoro-onnx", desc: "ONNX-based TTS with expressive voices",
      installCode: `# === Install Kokoro TTS to /opt ===
# Python 3.14 · CPU (onnxruntime)

sudo mkdir -p /opt/kokoro
cd /opt/kokoro

# Create venv with uv (Python 3.14)
sudo uv venv .venv --python 3.14

# Install kokoro-onnx and dependencies
sudo uv pip install --python .venv/bin/python3 \\
  kokoro-onnx==0.5.0 \\
  soundfile==0.13.1 \\
  onnxruntime==1.24.3

# Models download automatically on first run

# === Create system wrapper ===
sudo tee /usr/local/bin/kokoro << 'EOF'
#!/bin/bash
# Usage: echo "text" | kokoro > output.raw
#        echo "text" | kokoro | aplay -r 24000 -f S16_LE
source /opt/kokoro/.venv/bin/activate
exec python3 -c "
import sys, numpy as np
from kokoro_onnx import Kokoro
kokoro = Kokoro('kokoro-v1.0.onnx', 'voices-v1.0.bin')
text = sys.stdin.read().strip()
if not text:
    sys.exit(0)
samples, sr = kokoro.create(text, voice='af_heart', speed=1.0)
raw = (samples * 32767).astype(np.int16).tobytes()
sys.stdout.buffer.write(raw)
" "$@"
EOF
sudo chmod +x /usr/local/bin/kokoro

# Verify
echo "Hello from Kokoro" | kokoro | aplay -r 24000 -f S16_LE` },
    { name: "Kokoro-FastAPI", path: "/opt/kokoro-fastapi", url: "https://github.com/remsky/Kokoro-FastAPI", desc: "OpenAI-compatible API server for Kokoro TTS",
      installCode: `# === Install Kokoro-FastAPI to /opt ===
# Runs via podman-compose (containerized)

sudo git clone https://github.com/remsky/Kokoro-FastAPI /opt/kokoro-fastapi
cd /opt/kokoro-fastapi

# Start with podman-compose (see docker-compose.yml in repo)
sudo podman-compose up -d

# === Create system wrapper ===
sudo tee /usr/local/bin/kokoro-fastapi << 'EOF'
#!/bin/bash
# Usage: kokoro-fastapi start | stop | restart | status
cd /opt/kokoro-fastapi
case "\${1:-start}" in
  start)   sudo podman-compose up -d ;;
  stop)    sudo podman-compose down ;;
  restart) sudo podman-compose restart ;;
  status)  sudo podman-compose ps ;;
esac
EOF
sudo chmod +x /usr/local/bin/kokoro-fastapi

# Verify
curl -s http://localhost:8880/v1/audio/speech \\
  -H "Content-Type: application/json" \\
  -d '{"model":"kokoro","input":"Hello from Kokoro FastAPI","voice":"af_heart"}' \\
  --output test.wav && play test.wav` },
    { name: "Coqui TTS", path: "/opt/coqui-tts", url: "https://github.com/coqui-ai/TTS", desc: "Multi-speaker, multi-lingual TTS toolkit",
      installCode: `# === Install Coqui TTS to /opt ===
# Python 3.11 · CPU-only PyTorch

sudo mkdir -p /opt/coqui-tts
cd /opt/coqui-tts

# Create venv with uv (Python 3.11 — required by Coqui)
sudo uv venv .venv --python 3.11

# Install CPU-only PyTorch first, then Coqui TTS
sudo uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cpu torchaudio==2.5.1+cpu \\
  --extra-index-url https://download.pytorch.org/whl/cpu
sudo uv pip install --python .venv/bin/python3 \\
  tts==0.22.0

# === Create system wrapper ===
sudo tee /usr/local/bin/coqui-tts << 'EOF'
#!/bin/bash
source /opt/coqui-tts/.venv/bin/activate
exec tts "$@"
EOF
sudo chmod +x /usr/local/bin/coqui-tts

# Verify
coqui-tts --text "Hello from Coqui" \\
  --model_name tts_models/en/ljspeech/tacotron2-DDC \\
  --out_path test.wav && play test.wav

# Voice cloning with XTTS v2
coqui-tts --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\
  --text "This is a cloned voice" \\
  --speaker_wav reference.wav \\
  --language_idx en \\
  --out_path cloned.wav` },
    { name: "Spark TTS", path: "/opt/spark-tts", url: "https://github.com/SparkAudio/Spark-TTS", desc: "Voice cloning TTS with natural prosody",
      installCode: `# === Install Spark TTS to /opt ===
# Python 3.12 · CUDA 12.1 PyTorch

# Clone the repository
sudo git clone https://github.com/SparkAudio/Spark-TTS /opt/spark-tts
cd /opt/spark-tts

# Create venv with uv (Python 3.12)
sudo uv venv .venv --python 3.12

# Install CUDA PyTorch first
sudo uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121

# Install project dependencies from requirements.txt
sudo uv pip install --python .venv/bin/python3 -r requirements.txt

# Download pretrained models (follow repo instructions)
# Models go in /opt/spark-tts/pretrained_models/

# === Create system wrapper ===
sudo tee /usr/local/bin/spark-tts << 'EOF'
#!/bin/bash
cd /opt/spark-tts
source .venv/bin/activate
exec python3 spark_tts_cli.py "$@"
EOF
sudo chmod +x /usr/local/bin/spark-tts

# Verify — zero-shot voice cloning
spark-tts --text "Hello from Spark TTS" --device 0 \\
  --save_dir ~/callcentervillage/voice-cloning \\
  --prompt_speech_path reference.wav \\
  --prompt_text "$(cat reference.txt)"` },
    { name: "eSpeak NG", path: "system package", url: "https://github.com/espeak-ng/espeak-ng", desc: "Formant-based multilingual speech synthesizer",
      installCode: `# === Install eSpeak NG (system package) ===

sudo apt install -y espeak-ng

# No wrapper needed — installs directly to system PATH

# Verify
espeak-ng "Hello from eSpeak" --stdout | aplay

# List available voices
espeak-ng --voices` },
    { name: "Festival", path: "system package", url: "http://www.cstr.ed.ac.uk/projects/festival/", desc: "Unit-selection TTS from University of Edinburgh",
      installCode: `# === Install Festival (system package) ===

sudo apt install -y festival festvox-kallpc16k

# No wrapper needed — installs directly to system PATH

# Verify
echo "Hello from Festival" | text2wave -o test.wav && play test.wav

# Interactive mode
echo "Hello" | festival --tts` },
    { name: "Bark", url: "https://github.com/suno-ai/bark", desc: "Transformer-based TTS with non-speech sounds",
      installCode: `# === Install Bark to /opt ===
# Python 3.12 · CUDA PyTorch recommended (large models)

sudo mkdir -p /opt/bark
cd /opt/bark

# Create venv with uv
sudo uv venv .venv --python 3.12

# Install PyTorch (CUDA or CPU)
sudo uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121

# Install Bark from git
sudo uv pip install --python .venv/bin/python3 \\
  git+https://github.com/suno-ai/bark.git scipy

# Pre-download models (~5GB)
sudo .venv/bin/python3 -c "
from bark import preload_models
preload_models()
print('Models downloaded successfully')
"

# === Create system wrapper ===
sudo tee /usr/local/bin/bark-tts << 'EOF'
#!/bin/bash
# Usage: bark-tts "Text to speak" [output.wav]
source /opt/bark/.venv/bin/activate
OUTPUT=\${2:-bark_output.wav}
exec python3 -c "
import sys
from bark import SAMPLE_RATE, generate_audio, preload_models
from scipy.io.wavfile import write as write_wav
preload_models()
audio = generate_audio(sys.argv[1])
write_wav(sys.argv[2], SAMPLE_RATE, audio)
print(f'Saved to {sys.argv[2]}')
" "$1" "$OUTPUT"
EOF
sudo chmod +x /usr/local/bin/bark-tts

# Verify
bark-tts "Hello from Bark [laughs]" test.wav && play test.wav` },
    { name: "Tortoise TTS", url: "https://github.com/neonbjb/tortoise-tts", desc: "High-quality multi-voice TTS with voice cloning",
      installCode: `# === Install Tortoise TTS to /opt ===
# Python 3.11 · CUDA PyTorch recommended

# Clone the repository
sudo git clone https://github.com/neonbjb/tortoise-tts /opt/tortoise-tts
cd /opt/tortoise-tts

# Create venv with uv
sudo uv venv .venv --python 3.11

# Install PyTorch then project
sudo uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121
sudo uv pip install --python .venv/bin/python3 -r requirements.txt
sudo uv pip install --python .venv/bin/python3 -e .

# === Create system wrapper ===
sudo tee /usr/local/bin/tortoise-tts << 'EOF'
#!/bin/bash
cd /opt/tortoise-tts
source .venv/bin/activate
exec python3 tortoise/do_tts.py "$@"
EOF
sudo chmod +x /usr/local/bin/tortoise-tts

# Verify (slow — Tortoise prioritizes quality over speed)
tortoise-tts --text "Hello from Tortoise" --voice random --output_path .
play *_0.wav` },
    { name: "StyleTTS2", url: "https://github.com/yl4579/StyleTTS2", desc: "Style-based TTS with diffusion models",
      installCode: `# === Install StyleTTS2 to /opt ===
# Python 3.11 · CUDA PyTorch recommended

# Clone the repository
sudo git clone https://github.com/yl4579/StyleTTS2 /opt/styletts2
cd /opt/styletts2

# Create venv with uv
sudo uv venv .venv --python 3.11

# Install PyTorch then dependencies
sudo uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121
sudo uv pip install --python .venv/bin/python3 \\
  -r requirements.txt phonemizer scipy

# Download pretrained models (follow repo README)
# Place models in /opt/styletts2/Models/

# === Create system wrapper ===
sudo tee /usr/local/bin/styletts2 << 'EOF'
#!/bin/bash
cd /opt/styletts2
source .venv/bin/activate
exec python3 run_tts.py "$@"
EOF
sudo chmod +x /usr/local/bin/styletts2

# Verify
styletts2 --text "Hello from StyleTTS2" --output test.wav && play test.wav` },
    { name: "MetaVoice", url: "https://github.com/metavoiceio/metavoice-src", desc: "Foundational voice cloning model",
      installCode: `# === Install MetaVoice to /opt ===
# Python 3.11 · CUDA PyTorch recommended

# Clone the repository
sudo git clone https://github.com/metavoiceio/metavoice-src /opt/metavoice
cd /opt/metavoice

# Create venv with uv
sudo uv venv .venv --python 3.11

# Install PyTorch then project
sudo uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121
sudo uv pip install --python .venv/bin/python3 -r requirements.txt
sudo uv pip install --python .venv/bin/python3 -e .

# === Create system wrapper ===
sudo tee /usr/local/bin/metavoice << 'EOF'
#!/bin/bash
cd /opt/metavoice
source .venv/bin/activate
exec python3 -m fam.llm.serve "$@"
EOF
sudo chmod +x /usr/local/bin/metavoice

# Verify — starts the TTS server
metavoice --port 58003` },
    { name: "Qwen3-TTS", path: "/opt/qwen3-tts", url: "https://github.com/QwenLM/Qwen3-TTS", desc: "LLM-based text-to-speech from Alibaba",
      installCode: `# === Install Qwen3-TTS to /opt ===
# Python 3.12 · CUDA 12.1 PyTorch

sudo mkdir -p /opt/qwen3-tts
cd /opt/qwen3-tts

# Create venv with uv (Python 3.12)
sudo uv venv .venv --python 3.12

# Install CUDA PyTorch first
sudo uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 torchvision==0.20.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121

# Install qwen-tts and dependencies
sudo uv pip install --python .venv/bin/python3 \\
  qwen-tts==0.1.1 \\
  transformers==4.57.3 \\
  accelerate==1.12.0 \\
  soundfile==0.13.1 \\
  librosa==0.11.0 \\
  gradio==6.9.0

# Models download from Hugging Face on first use

# === Create system wrapper ===
sudo tee /usr/local/bin/qwen3-tts << 'EOF'
#!/bin/bash
cd /opt/qwen3-tts
source .venv/bin/activate
exec python3 -m qwen_tts "$@"
EOF
sudo chmod +x /usr/local/bin/qwen3-tts

# Verify
qwen3-tts --text "Hello from Qwen TTS" --output test.wav && play test.wav` },
    { name: "F5-TTS", url: "https://github.com/SWivid/F5-TTS", desc: "Flow-matching based zero-shot TTS",
      installCode: `# === Install F5-TTS to /opt ===
# Python 3.12 · CUDA PyTorch recommended

# Clone the repository
sudo git clone https://github.com/SWivid/F5-TTS /opt/f5-tts
cd /opt/f5-tts

# Create venv with uv
sudo uv venv .venv --python 3.12

# Install PyTorch then project
sudo uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121
sudo uv pip install --python .venv/bin/python3 -r requirements.txt
sudo uv pip install --python .venv/bin/python3 -e .

# === Create system wrapper ===
sudo tee /usr/local/bin/f5-tts << 'EOF'
#!/bin/bash
cd /opt/f5-tts
source .venv/bin/activate
exec python3 -m f5_tts.infer "$@"
EOF
sudo chmod +x /usr/local/bin/f5-tts

# Verify — zero-shot cloning
f5-tts --ref_audio reference.wav --ref_text "Reference transcript" \\
  --gen_text "Hello from F5 TTS" --output test.wav && play test.wav` },
    { name: "Chatterbox", url: "https://github.com/resemble-ai/chatterbox", desc: "Open-source voice cloning TTS from Resemble AI",
      installCode: `# === Install Chatterbox to /opt ===
# Python 3.12 · CUDA PyTorch recommended

sudo mkdir -p /opt/chatterbox
cd /opt/chatterbox

# Create venv with uv
sudo uv venv .venv --python 3.12

# Install PyTorch then Chatterbox
sudo uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121
sudo uv pip install --python .venv/bin/python3 chatterbox-tts

# === Create system wrapper ===
sudo tee /usr/local/bin/chatterbox << 'EOF'
#!/bin/bash
# Usage: chatterbox "Text to speak" --ref reference.wav [--output out.wav]
source /opt/chatterbox/.venv/bin/activate
OUTPUT="chatterbox_output.wav"
REF=""
TEXT="$1"; shift
while [[ $# -gt 0 ]]; do
  case $1 in
    --ref) REF="$2"; shift 2 ;;
    --output) OUTPUT="$2"; shift 2 ;;
    *) shift ;;
  esac
done
exec python3 -c "
import torchaudio
from chatterbox.tts import ChatterboxTTS
model = ChatterboxTTS.from_pretrained()
wav = model.generate('$TEXT', audio_prompt_path='$REF' if '$REF' else None)
torchaudio.save('$OUTPUT', wav, model.sr)
print(f'Saved to $OUTPUT')
"
EOF
sudo chmod +x /usr/local/bin/chatterbox

# Verify
chatterbox "Hello from Chatterbox" --ref reference.wav --output test.wav && play test.wav` },
  ],
  "Voice Conversion": [
    { name: "RVC", path: "background service", url: "https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI", desc: "Retrieval-based voice conversion with training support",
      installCode: `# === Install RVC to /opt ===
# Python 3.10 · CUDA 12.1 PyTorch + onnxruntime-gpu

# Clone the repository
sudo git clone https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI /opt/rvc
cd /opt/rvc

# Create venv with uv (Python 3.10 — required by RVC/fairseq)
sudo uv venv .venv --python 3.10

# Install CUDA PyTorch first
sudo uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 torchvision==0.20.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121

# Install project dependencies
sudo uv pip install --python .venv/bin/python3 -r requirements.txt

# Download pretrained models
sudo .venv/bin/python3 tools/download_models.py

# === Create system wrapper ===
sudo tee /usr/local/bin/rvc << 'EOF'
#!/bin/bash
cd /opt/rvc
source .venv/bin/activate
exec python3 infer-web.py "$@"
EOF
sudo chmod +x /usr/local/bin/rvc

# === Create systemd service for background operation ===
sudo tee /etc/systemd/system/rvc.service << 'EOF'
[Unit]
Description=RVC Voice Conversion
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/rvc
ExecStart=/opt/rvc/.venv/bin/python3 infer-web.py --port 7865
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable --now rvc

# Verify — open http://localhost:7865 in your browser` },
    { name: "OpenVoice", path: "/opt/openvoice", url: "https://github.com/myshell-ai/OpenVoice", desc: "Instant voice cloning with tone color transfer",
      installCode: `# === Install OpenVoice to /opt ===
# Python 3.9 · CUDA 12.1 PyTorch + MeloTTS

# Clone the repository
sudo git clone https://github.com/myshell-ai/OpenVoice /opt/openvoice
cd /opt/openvoice

# Create venv with uv (Python 3.9 — required by OpenVoice)
sudo uv venv .venv --python 3.9

# Install CUDA PyTorch first
sudo uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 torchvision==0.20.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121

# Install OpenVoice and MeloTTS
sudo uv pip install --python .venv/bin/python3 -r requirements.txt
sudo uv pip install --python .venv/bin/python3 -e .
sudo uv pip install --python .venv/bin/python3 \\
  git+https://github.com/myshell-ai/MeloTTS.git

# Download checkpoints (V2)
sudo mkdir -p /opt/openvoice/checkpoints
# Follow repo instructions to download checkpoints_v2

# === Create system wrapper ===
sudo tee /usr/local/bin/openvoice << 'EOF'
#!/bin/bash
cd /opt/openvoice
source .venv/bin/activate
exec python3 openvoice_cli.py "$@"
EOF
sudo chmod +x /usr/local/bin/openvoice

# Verify — tone color transfer
openvoice --reference reference.wav \\
  --source source.wav \\
  --output converted.wav && play converted.wav` },
    { name: "FreeVC", url: "https://github.com/OlaWod/FreeVC", desc: "Text-free one-shot voice conversion",
      installCode: `# === Install FreeVC to /opt ===
# Python 3.11 · CUDA PyTorch recommended

# Clone the repository
sudo git clone https://github.com/OlaWod/FreeVC /opt/freevc
cd /opt/freevc

# Create venv with uv
sudo uv venv .venv --python 3.11

# Install PyTorch then dependencies
sudo uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121
sudo uv pip install --python .venv/bin/python3 -r requirements.txt

# Download pretrained models (follow repo README)
# Place checkpoints in /opt/freevc/checkpoints/

# === Create system wrapper ===
sudo tee /usr/local/bin/freevc << 'EOF'
#!/bin/bash
cd /opt/freevc
source .venv/bin/activate
exec python3 convert.py "$@"
EOF
sudo chmod +x /usr/local/bin/freevc

# Verify
freevc --source source.wav --target target_speaker.wav \\
  --output converted.wav && play converted.wav` },
    { name: "DDSP-SVC", url: "https://github.com/yxlllc/DDSP-SVC", desc: "DDSP-based real-time singing voice conversion",
      installCode: `# === Install DDSP-SVC to /opt ===
# Python 3.11 · CUDA PyTorch recommended

# Clone the repository
sudo git clone https://github.com/yxlllc/DDSP-SVC /opt/ddsp-svc
cd /opt/ddsp-svc

# Create venv with uv
sudo uv venv .venv --python 3.11

# Install PyTorch then dependencies
sudo uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121
sudo uv pip install --python .venv/bin/python3 -r requirements.txt

# Download pretrained models (follow repo README)
# Models go in /opt/ddsp-svc/pretrain/

# === Create system wrapper ===
sudo tee /usr/local/bin/ddsp-svc << 'EOF'
#!/bin/bash
cd /opt/ddsp-svc
source .venv/bin/activate
exec python3 main.py "$@"
EOF
sudo chmod +x /usr/local/bin/ddsp-svc

# Verify
ddsp-svc --input source.wav --output converted.wav && play converted.wav` },
  ],
  "Frameworks": [
    { name: "LiveKit", url: "https://github.com/livekit/livekit", desc: "Open-source real-time audio/video infrastructure",
      installCode: `# === Install LiveKit server ===

# Install via official script
curl -sSL https://get.livekit.io | bash

# LiveKit installs to /usr/local/bin/livekit-server — no wrapper needed

# === Install LiveKit Agents SDK (Python) ===
sudo mkdir -p /opt/livekit
cd /opt/livekit

# Create venv with uv
sudo uv venv .venv --python 3.12

sudo uv pip install --python .venv/bin/python3 \\
  livekit-agents \\
  livekit-plugins-openai \\
  livekit-plugins-silero

# === Create wrapper for agent development ===
sudo tee /usr/local/bin/livekit-agent << 'EOF'
#!/bin/bash
source /opt/livekit/.venv/bin/activate
exec python3 "$@"
EOF
sudo chmod +x /usr/local/bin/livekit-agent

# Verify — start dev server
livekit-server --dev` },
  ],
  "Detection": [
    { name: "Resemblyzer", url: "https://github.com/resemble-ai/Resemblyzer", desc: "Speaker verification and voice embedding extraction",
      installCode: `# === Install Resemblyzer to /opt ===
# Python 3.12

sudo mkdir -p /opt/resemblyzer
cd /opt/resemblyzer

# Create venv with uv
sudo uv venv .venv --python 3.12

# Install Resemblyzer
sudo uv pip install --python .venv/bin/python3 resemblyzer

# === Create system wrapper ===
sudo tee /usr/local/bin/resemblyzer << 'EOF'
#!/bin/bash
# Usage: resemblyzer <original.wav> <clone.wav>
# Returns similarity score between two voice samples
source /opt/resemblyzer/.venv/bin/activate
exec python3 -c "
import sys, numpy as np
from resemblyzer import VoiceEncoder, preprocess_wav
from pathlib import Path
enc = VoiceEncoder()
e1 = enc.embed_utterance(preprocess_wav(Path(sys.argv[1])))
e2 = enc.embed_utterance(preprocess_wav(Path(sys.argv[2])))
sim = np.dot(e1, e2)
print(f'Similarity: {sim:.4f}')
if sim > 0.85:
    print('Result: Very high match — likely same speaker')
elif sim > 0.75:
    print('Result: High match — possible same speaker')
else:
    print('Result: Low match — likely different speakers')
" "$@"
EOF
sudo chmod +x /usr/local/bin/resemblyzer

# Verify
resemblyzer original.wav clone.wav` },
    { name: "pgvector", url: "https://github.com/pgvector/pgvector", desc: "Vector similarity search extension for PostgreSQL",
      installCode: `# === Install pgvector ===
# PostgreSQL extension — no Python venv needed

# Install PostgreSQL if not already installed
sudo apt install -y postgresql postgresql-server-dev-all

# Build and install pgvector
sudo git clone https://github.com/pgvector/pgvector /opt/pgvector
cd /opt/pgvector
sudo make
sudo make install

# Enable the extension in PostgreSQL
sudo -u postgres psql -c "CREATE EXTENSION IF NOT EXISTS vector;"

# No wrapper needed — pgvector is a PostgreSQL extension
# Use it in SQL:
#   CREATE TABLE voice_embeddings (
#     id SERIAL PRIMARY KEY,
#     speaker TEXT,
#     embedding vector(256)
#   );
#   SELECT * FROM voice_embeddings
#     ORDER BY embedding <=> '[0.1, 0.2, ...]'
#     LIMIT 5;

# Verify
sudo -u postgres psql -c "SELECT extversion FROM pg_extension WHERE extname = 'vector';"` },
  ],
};

const categoryColors = {
  "Speech-to-Text": "#38b6ff",
  "Language Model": "#cb6ce6",
  "Text-to-Speech": "#5e17eb",
  "Voice Conversion": "#8c52ff",
  "Framework": "#5170ff",
  "Detection": "#38b6ff",
};

// Flatten projectTools into a single array with category tags
const allProjectTools = Object.entries(projectTools).flatMap(([category, tools]) =>
  tools.map(t => ({ ...t, category: category.replace(/s$/, "") }))
).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

const ProjectGlossarySection = () => (
  <div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Project Tool Glossary</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      AI and audio tools used across the training.
      Each tool includes installation instructions for setting up in <code style={{ background: C.codeBg, padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>/opt</code> and
      creating a system wrapper in <code style={{ background: C.codeBg, padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>/usr/local/bin</code>.
    </p>
    <div style={{ display: "grid", gap: 24 }}>
      {allProjectTools.map(t => (
        <div key={t.name} id={`tool-${toAnchorId(t.name)}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 24px 20px", scrollMarginTop: 120 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
            <a href={t.url} target="_blank" rel="noopener noreferrer" style={{ color: C.text, fontSize: 20, fontWeight: 800, textDecoration: "none" }}>
              {t.name} <span style={{ color: C.accent, fontSize: 14 }}>↗</span>
            </a>
            <span style={{
              background: categoryColors[t.category] || C.secondary,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 10px",
              borderRadius: 99,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}>{t.category}</span>
          </div>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px 0" }}>{t.desc}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: t.installCode ? 16 : 0 }}>
            {t.path && (
              <code style={{ background: C.codeBg, color: C.dim, padding: "3px 10px", borderRadius: 6, fontSize: 12 }}>{t.path}</code>
            )}
            {!t.path && (
              <span style={{ color: C.dim, fontSize: 12, fontStyle: "italic" }}>reference only</span>
            )}
          </div>
          {t.installCode && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dim, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Installation & Wrapper</div>
              <CodeBlock language="bash" code={t.installCode} />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const builtWithItems = [
  { name: "React", url: "https://react.dev", note: "UI framework" },
  { name: "Vite", url: "https://vite.dev", note: "Build tool and dev server" },
  { name: "Heroicons", url: "https://heroicons.com", note: "Icon library" },
  { name: "Inter", url: "https://rsms.me/inter", note: "UI font (self-hosted)" },
  { name: "JetBrains Mono", url: "https://www.jetbrains.com/lp/mono/", note: "Code font (self-hosted)" },
  { name: "ESLint", url: "https://eslint.org", note: "Code linting" },
  { name: "Node.js", url: "https://nodejs.org", note: "JavaScript runtime" },
].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

const BuiltWithSection = () => (
  <div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Project Credits</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      This training application is built with the following open-source projects.
    </p>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
      {builtWithItems.map(t => (
        <a key={t.name} id={`bw-${toAnchorId(t.name)}`} href={t.url} target="_blank" rel="noopener noreferrer"
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
          style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px", textDecoration: "none", scrollMarginTop: 120, transition: "border-color 0.2s ease", display: "block" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>
            {t.name} <span style={{ color: C.accent, fontSize: 13 }}>↗</span>
          </div>
          <div style={{ fontSize: 13, color: C.muted }}>{t.note}</div>
        </a>
      ))}
    </div>

    <div id="bw-getting-started" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", marginTop: 24, scrollMarginTop: 120 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 12 }}>Getting Started</div>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px 0" }}>
        Clone this project and run it locally in your browser.
      </p>
      <CodeBlock language="bash" code={`# Clone the repository
git clone https://github.com/CallCenterVillage/voice-training.git
cd voice-training

# Install dependencies
pnpm install

# Start the dev server
pnpm run dev
# Open http://localhost:5173 in your browser

# Or build for production
pnpm run build
pnpm run preview`} />
    </div>
  </div>
);

const funTools = [
  { name: "cmatrix", desc: "Terminal-based Matrix digital rain animation",
    installCode: `# === Install cmatrix ===
sudo apt install -y cmatrix` },
  { name: "cowsay", desc: "Generate ASCII art of a cow with a message",
    installCode: `# === Install cowsay ===
sudo apt install -y cowsay` },
  { name: "ddate", desc: "Convert Gregorian dates to Discordian calendar dates",
    installCode: `# === Install ddate ===
sudo apt install -y ddate` },
  { name: "htop", desc: "Interactive process viewer and system monitor",
    installCode: `# === Install htop ===
sudo apt install -y htop` },
  { name: "lolcat", desc: "Colorize terminal output with rainbow gradients",
    installCode: `# === Install lolcat ===
sudo apt install -y lolcat` },
  { name: "lynx", desc: "Text-based web browser for the terminal",
    installCode: `# === Install lynx ===
sudo apt install -y lynx` },
  { name: "neofetch", desc: "Display system info with ASCII art logo",
    installCode: `# === Install neofetch ===
sudo apt install -y neofetch` },
  { name: "sunshine", desc: "Self-hosted game streaming server (Moonlight-compatible)",
    installCode: `# === Install Sunshine ===
sudo apt install -y sunshine` },
  { name: "moonlight", desc: "Open-source game streaming client (connects to Sunshine)",
    installCode: `# === Install Moonlight ===
sudo snap install moonlight` },
].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

const FunToolsSection = () => (
  <div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Other Tools</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
      Tools that aren't strictly necessary but make the terminal a little more enjoyable.
    </p>
    <div style={{ display: "grid", gap: 20 }}>
      {funTools.map(t => (
        <div key={t.name} id={`fun-${toAnchorId(t.name)}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", scrollMarginTop: 120 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: t.installCode ? 12 : 0 }}>
            <code style={{ background: C.codeBg, color: C.accent, padding: "2px 8px", borderRadius: 4, fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>{t.name}</code>
            <span style={{ color: C.text, fontSize: 14, flex: 1, minWidth: 200 }}>{t.desc}</span>
          </div>
          {t.installCode && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dim, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Installation</div>
              <CodeBlock language="bash" code={t.installCode} />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Set anchors dynamically from data arrays
const sortByLabel = (a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" });
SECTIONS[1].anchors = voiceTools.map(t => ({ id: `voice-${toAnchorId(t.name)}`, label: t.name })).sort(sortByLabel);
SECTIONS[2].anchors = cliTools.map(t => ({ id: `cli-${toAnchorId(t.name)}`, label: t.name })).sort(sortByLabel);
SECTIONS[3].anchors = allProjectTools.map(t => ({ id: `tool-${toAnchorId(t.name)}`, label: t.name })).sort(sortByLabel);
SECTIONS[4].anchors = funTools.map(t => ({ id: `fun-${toAnchorId(t.name)}`, label: t.name }));
SECTIONS[5].anchors = builtWithItems.map(t => ({ id: `bw-${toAnchorId(t.name)}`, label: t.name }));

const ThankYouSection = () => (
  <div>
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Thank You</h2>
    <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 32 }}>
      Call Center Village wouldn't exist without the people who've supported it along the way.
    </p>

    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "32px 32px" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>The Conferences</div>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
          To every conference that gave Call Center Village a chance — and let us come back even after we failed. Thank you for the floor space, the badge access, and the willingness to take a risk on something weird. Every iteration of the village has been better because of the communities that hosted us.
        </p>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "32px 32px" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>The People</div>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
          To everyone who's shared resources, ideas, feedback, and encouragement along the way — you've shaped what this project has become.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {["Jay", "Brendan", "Canis", "DEF CON Dan", "chiefgyk3d", "DC614", "Our families"].map(name => (
            <span key={name} style={{ background: C.codeBg, border: `1px solid ${C.border}`, padding: "4px 12px", borderRadius: 6, fontSize: 13, color: C.text, fontWeight: 600 }}>{name}</span>
          ))}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "32px 32px" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>The Customers</div>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
          To the customers who trusted us enough to let us test on their systems — thank you. The real-world access you provided is what makes this training grounded in reality rather than theory. None of this training would be possible without your willingness to participate.
        </p>
      </div>
    </div>

    <div style={{ textAlign: "center", marginTop: 48, fontSize: 18, fontStyle: "italic", lineHeight: 1.8 }}>
      <span style={{ color: C.muted }}>Thank you so much for your support,</span><br />
      <span style={{ fontSize: 32, fontWeight: 800, fontStyle: "normal", background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Call Center Village</span>
    </div>
  </div>
);

const COMPS = [AudioSection, VoiceGlossarySection, CLIGlossarySection, ProjectGlossarySection, FunToolsSection, BuiltWithSection, ThankYouSection];

export { SECTIONS, COMPS };

export default function AppendixTraining() {
  return <TrainingShell sections={SECTIONS} sectionComponents={COMPS} moduleTitle="Appendix" topOffset={48} />;
}
