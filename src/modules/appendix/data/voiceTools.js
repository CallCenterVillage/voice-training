// Data only — no JSX. Split out so the appendix section components can be
// code-split: index.jsx needs these lists to build anchor links, but does
// not need the components that render them.
export const voiceTools = [
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
