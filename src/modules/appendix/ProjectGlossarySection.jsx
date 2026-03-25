import { C, CodeBlock } from '../../components';
import { toAnchorId } from './_helpers';

const projectTools = {
  "Speech-to-Text": [
    { name: "whisper.cpp", path: "/opt/whisper.cpp", url: "https://github.com/ggml-org/whisper.cpp", desc: "C/C++ port of OpenAI Whisper for fast local speech recognition",
      installCode: `# === Install whisper.cpp to /opt ===
# C++ project — no Python venv needed

# Switch to root for installation
sudo su

# Clone the repository
git clone https://github.com/ggml-org/whisper.cpp /opt/whisper.cpp
cd /opt/whisper.cpp

# Build with CMake
cmake -B build
cmake --build build --config Release -j$(nproc)

# Download models
bash models/download-ggml-model.sh tiny.en
bash models/download-ggml-model.sh base.en
bash models/download-ggml-model.sh small.en

# === Create system wrappers ===
ln -sf /opt/whisper.cpp/build/bin/whisper-cli /usr/local/bin/whisper-cli
ln -sf /opt/whisper.cpp/build/bin/whisper-stream /usr/local/bin/whisper-stream
ln -sf /opt/whisper.cpp/build/bin/whisper-server /usr/local/bin/whisper-server

# Return to normal user
exit

# Verify
whisper-cli -m /opt/whisper.cpp/models/ggml-tiny.en.bin -f test.wav` },
    { name: "Faster Whisper", path: "/opt/faster-whisper", url: "https://github.com/SYSTRAN/faster-whisper", desc: "CTranslate2-accelerated Whisper inference",
      installCode: `# === Install Faster Whisper to /opt ===
# Python 3.12 · CPU (onnxruntime + ctranslate2)

# Switch to root for installation
sudo su

mkdir -p /opt/faster-whisper
cd /opt/faster-whisper

# Create venv with uv (Python 3.12)
uv venv .venv --python 3.12

# Install faster-whisper and dependencies
uv pip install --python .venv/bin/python3 \\
  faster-whisper==1.2.1 \\
  ctranslate2==4.7.1 \\
  onnxruntime==1.24.3

# Models download automatically on first use to ~/.cache/huggingface

# === Create system wrapper ===
tee /usr/local/bin/faster-whisper << 'EOF'
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
chmod +x /usr/local/bin/faster-whisper

# Return to normal user
exit

# Verify
faster-whisper test.wav` },
  ],
  "Language Models": [
    { name: "llama.cpp", path: "/opt/llama.cpp", url: "https://github.com/ggml-org/llama.cpp", desc: "C/C++ LLM inference engine for running local language models",
      installCode: `# === Install llama.cpp to /opt ===
# C++ project — no Python venv needed

# Switch to root for installation
sudo su

# Clone the repository
git clone https://github.com/ggml-org/llama.cpp /opt/llama.cpp
cd /opt/llama.cpp

# Build with CMake
cmake -B build
cmake --build build --config Release -j$(nproc)

# Download a model (example: Llama 3.2 1B quantized)
mkdir -p /opt/llama.cpp/models
# Download GGUF models from Hugging Face, e.g.:
# sudo wget -O /opt/llama.cpp/models/llama-3.2-1b-instruct-q4_k_m.gguf \\
#   "https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf"

# === Create system wrappers ===
ln -sf /opt/llama.cpp/build/bin/llama-cli /usr/local/bin/llama-cli
ln -sf /opt/llama.cpp/build/bin/llama-server /usr/local/bin/llama-server
ln -sf /opt/llama.cpp/build/bin/llama-simple /usr/local/bin/llama-simple
ln -sf /opt/llama.cpp/build/bin/llama-tts /usr/local/bin/llama-tts

# Return to normal user
exit

# Verify
llama-cli -m /opt/llama.cpp/models/llama-3.2-1b-instruct-q4_k_m.gguf \\
  -cnv -p "You are a helpful assistant."` },
    { name: "Ollama", url: "https://ollama.com", desc: "One-command local LLM runner — download and run models with a single CLI command" },
    { name: "LM Studio", url: "https://lmstudio.ai", desc: "Desktop app for running local LLMs with a chat UI and built-in model browser" },
    { name: "Open WebUI", url: "https://github.com/open-webui/open-webui", desc: "Self-hosted ChatGPT-style interface that works with Ollama, llama.cpp, and other backends" },
    { name: "LibreChat", url: "https://github.com/danny-avila/LibreChat", desc: "Open-source chat interface supporting local and cloud AI providers with plugin support" },
    { name: "Jan", url: "https://jan.ai", desc: "Offline-first desktop app for running local models with a clean UI" },
  ],
  "Text-to-Speech": [
    { name: "Piper TTS", path: "/opt/piper", url: "https://github.com/OHF-Voice/piper1-gpl", desc: "Fast local neural text-to-speech",
      installCode: `# === Install Piper TTS to /opt ===
# Python 3.14 · CPU (onnxruntime)

# Switch to root for installation
sudo su

mkdir -p /opt/piper/models
cd /opt/piper

# Create venv with uv (Python 3.14)
uv venv .venv --python 3.14

# Install piper-tts
uv pip install --python .venv/bin/python3 \\
  piper-tts==1.4.1 \\
  onnxruntime==1.24.3

# Download voice models
cd /opt/piper/models
sudo wget https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-en-us-lessac-medium.tar.gz
sudo tar xzf voice-en-us-lessac-medium.tar.gz && sudo rm voice-en-us-lessac-medium.tar.gz

# === Create system wrapper ===
tee /usr/local/bin/piper << 'EOF'
#!/bin/bash
source /opt/piper/.venv/bin/activate
exec piper "$@"
EOF
chmod +x /usr/local/bin/piper

# Return to normal user
exit

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

# Switch to root for installation
sudo su

mkdir -p /opt/kokoro
cd /opt/kokoro

# Create venv with uv (Python 3.14)
uv venv .venv --python 3.14

# Install kokoro-onnx and dependencies
uv pip install --python .venv/bin/python3 \\
  kokoro-onnx==0.5.0 \\
  soundfile==0.13.1 \\
  onnxruntime==1.24.3

# Models download automatically on first run

# === Create system wrapper ===
tee /usr/local/bin/kokoro << 'EOF'
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
chmod +x /usr/local/bin/kokoro

# Return to normal user
exit

# Verify
echo "Hello from Kokoro" | kokoro | aplay -r 24000 -f S16_LE` },
    { name: "Kokoro-FastAPI", path: "/opt/kokoro-fastapi", url: "https://github.com/remsky/Kokoro-FastAPI", desc: "OpenAI-compatible API server for Kokoro TTS",
      installCode: `# === Install Kokoro-FastAPI to /opt ===
# Runs via podman-compose (containerized)

# Switch to root for installation
sudo su

git clone https://github.com/remsky/Kokoro-FastAPI /opt/kokoro-fastapi
cd /opt/kokoro-fastapi

# Start with podman-compose (see docker-compose.yml in repo)
sudo podman-compose up -d

# === Create system wrapper ===
tee /usr/local/bin/kokoro-fastapi << 'EOF'
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
chmod +x /usr/local/bin/kokoro-fastapi

# Return to normal user
exit

# Verify
curl -s http://localhost:8880/v1/audio/speech \\
  -H "Content-Type: application/json" \\
  -d '{"model":"kokoro","input":"Hello from Kokoro FastAPI","voice":"af_heart"}' \\
  --output test.wav && play test.wav` },
    { name: "Coqui TTS", path: "/opt/coqui-tts", url: "https://github.com/coqui-ai/TTS", desc: "Multi-speaker, multi-lingual TTS toolkit",
      installCode: `# === Install Coqui TTS to /opt ===
# Python 3.11 · CPU-only PyTorch

# Switch to root for installation
sudo su

mkdir -p /opt/coqui-tts
cd /opt/coqui-tts

# Create venv with uv (Python 3.11 — required by Coqui)
uv venv .venv --python 3.11

# Install CPU-only PyTorch first, then Coqui TTS
uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cpu torchaudio==2.5.1+cpu \\
  --extra-index-url https://download.pytorch.org/whl/cpu
uv pip install --python .venv/bin/python3 \\
  tts==0.22.0

# === Create system wrapper ===
tee /usr/local/bin/coqui-tts << 'EOF'
#!/bin/bash
source /opt/coqui-tts/.venv/bin/activate
exec tts "$@"
EOF
chmod +x /usr/local/bin/coqui-tts

# Return to normal user
exit

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

# Switch to root for installation
sudo su

# Clone the repository
git clone https://github.com/SparkAudio/Spark-TTS /opt/spark-tts
cd /opt/spark-tts

# Create venv with uv (Python 3.12)
uv venv .venv --python 3.12

# Install CUDA PyTorch first
uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121

# Install project dependencies from requirements.txt
uv pip install --python .venv/bin/python3 -r requirements.txt

# Download pretrained models (follow repo instructions)
# Models go in /opt/spark-tts/pretrained_models/

# === Create system wrapper ===
tee /usr/local/bin/spark-tts << 'EOF'
#!/bin/bash
cd /opt/spark-tts
source .venv/bin/activate
exec python3 spark_tts_cli.py "$@"
EOF
chmod +x /usr/local/bin/spark-tts

# Return to normal user
exit

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

# Switch to root for installation
sudo su

mkdir -p /opt/bark
cd /opt/bark

# Create venv with uv
uv venv .venv --python 3.12

# Install PyTorch (CUDA or CPU)
uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121

# Install Bark from git
uv pip install --python .venv/bin/python3 \\
  git+https://github.com/suno-ai/bark.git scipy

# Pre-download models (~5GB)
# Bark's checkpoints use numpy types blocked by PyTorch 2.6+ weights_only default
# We monkey-patch torch.load to force weights_only=False
.venv/bin/python3 -c "
import torch
_original_load = torch.load
torch.load = lambda *args, **kwargs: _original_load(*args, **{**kwargs, 'weights_only': False})
from bark import preload_models
preload_models()
print('Models downloaded successfully')
"

# === Create system wrapper ===
tee /usr/local/bin/bark-tts << 'EOF'
#!/bin/bash
# Usage: bark-tts "Text to speak" [output.wav]
OUTPUT=\${2:-bark_output.wav}
exec /opt/bark/.venv/bin/python3 -c "
import sys, torch
_original_load = torch.load
torch.load = lambda *args, **kwargs: _original_load(*args, **{**kwargs, 'weights_only': False})
from bark import SAMPLE_RATE, generate_audio, preload_models
from scipy.io.wavfile import write as write_wav
preload_models()
audio = generate_audio(sys.argv[1])
write_wav(sys.argv[2], SAMPLE_RATE, audio)
print(f'Saved to {sys.argv[2]}')
" "$1" "$OUTPUT"
EOF
chmod +x /usr/local/bin/bark-tts

# Return to normal user
exit

# Verify
bark-tts "Hello from Bark [laughs]" test.wav && play test.wav` },
    { name: "Tortoise TTS", url: "https://github.com/neonbjb/tortoise-tts", desc: "High-quality multi-voice TTS with voice cloning",
      installCode: `# === Install Tortoise TTS to /opt ===
# Python 3.11 · CUDA PyTorch recommended

# Switch to root for installation
sudo su

# Clone the repository
git clone https://github.com/neonbjb/tortoise-tts /opt/tortoise-tts
cd /opt/tortoise-tts

# Create venv with uv
uv venv .venv --python 3.11

# Install PyTorch then project
uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121
uv pip install --python .venv/bin/python3 -r requirements.txt
uv pip install --python .venv/bin/python3 -e .

# === Create system wrapper ===
tee /usr/local/bin/tortoise-tts << 'EOF'
#!/bin/bash
cd /opt/tortoise-tts
source .venv/bin/activate
exec python3 tortoise/do_tts.py "$@"
EOF
chmod +x /usr/local/bin/tortoise-tts

# Return to normal user
exit

# Verify (slow — Tortoise prioritizes quality over speed)
tortoise-tts --text "Hello from Tortoise" --voice random --output_path .
play *_0.wav` },
    { name: "StyleTTS2", url: "https://github.com/yl4579/StyleTTS2", desc: "Style-based TTS with diffusion models",
      installCode: `# === Install StyleTTS2 to /opt ===
# Python 3.11 · CUDA PyTorch recommended

# Switch to root for installation
sudo su

# Clone the repository
git clone https://github.com/yl4579/StyleTTS2 /opt/styletts2
cd /opt/styletts2

# Create venv with uv
uv venv .venv --python 3.11

# Install PyTorch then dependencies
uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121
uv pip install --python .venv/bin/python3 \\
  -r requirements.txt phonemizer scipy

# Download pretrained models (follow repo README)
# Place models in /opt/styletts2/Models/

# === Create system wrapper ===
tee /usr/local/bin/styletts2 << 'EOF'
#!/bin/bash
cd /opt/styletts2
source .venv/bin/activate
exec python3 run_tts.py "$@"
EOF
chmod +x /usr/local/bin/styletts2

# Return to normal user
exit

# Verify
styletts2 --text "Hello from StyleTTS2" --output test.wav && play test.wav` },
    { name: "MetaVoice", url: "https://github.com/metavoiceio/metavoice-src", desc: "Foundational voice cloning model",
      installCode: `# === Install MetaVoice to /opt ===
# Python 3.11 · CUDA PyTorch recommended

# Switch to root for installation
sudo su

# Clone the repository
git clone https://github.com/metavoiceio/metavoice-src /opt/metavoice
cd /opt/metavoice

# Create venv with uv
uv venv .venv --python 3.11

# Install PyTorch then project
uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121
uv pip install --python .venv/bin/python3 -r requirements.txt
uv pip install --python .venv/bin/python3 -e .

# === Create system wrapper ===
tee /usr/local/bin/metavoice << 'EOF'
#!/bin/bash
cd /opt/metavoice
source .venv/bin/activate
exec python3 -m fam.llm.serve "$@"
EOF
chmod +x /usr/local/bin/metavoice

# Return to normal user
exit

# Verify — starts the TTS server
metavoice --port 58003` },
    { name: "Qwen3-TTS", path: "/opt/qwen3-tts", url: "https://github.com/QwenLM/Qwen3-TTS", desc: "LLM-based text-to-speech from Alibaba",
      installCode: `# === Install Qwen3-TTS to /opt ===
# Python 3.12 · CUDA 12.1 PyTorch

# Switch to root for installation
sudo su

mkdir -p /opt/qwen3-tts
cd /opt/qwen3-tts

# Create venv with uv (Python 3.12)
uv venv .venv --python 3.12

# Install CUDA PyTorch first
uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 torchvision==0.20.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121

# Install qwen-tts and dependencies
uv pip install --python .venv/bin/python3 \\
  qwen-tts==0.1.1 \\
  transformers==4.57.3 \\
  accelerate==1.12.0 \\
  soundfile==0.13.1 \\
  librosa==0.11.0 \\
  gradio==6.9.0

# Models download from Hugging Face on first use

# === Create system wrapper ===
tee /usr/local/bin/qwen3-tts << 'EOF'
#!/bin/bash
cd /opt/qwen3-tts
source .venv/bin/activate
exec python3 -m qwen_tts "$@"
EOF
chmod +x /usr/local/bin/qwen3-tts

# Return to normal user
exit

# Verify
qwen3-tts --text "Hello from Qwen TTS" --output test.wav && play test.wav` },
    { name: "F5-TTS", url: "https://github.com/SWivid/F5-TTS", desc: "Flow-matching based zero-shot TTS",
      installCode: `# === Install F5-TTS to /opt ===
# Python 3.12 · CUDA PyTorch recommended

# Switch to root for installation
sudo su

# Clone the repository
git clone https://github.com/SWivid/F5-TTS /opt/f5-tts
cd /opt/f5-tts

# Create venv with uv
uv venv .venv --python 3.12

# Install PyTorch then project
uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121
uv pip install --python .venv/bin/python3 -r requirements.txt
uv pip install --python .venv/bin/python3 -e .

# === Create system wrapper ===
tee /usr/local/bin/f5-tts << 'EOF'
#!/bin/bash
cd /opt/f5-tts
source .venv/bin/activate
exec python3 -m f5_tts.infer "$@"
EOF
chmod +x /usr/local/bin/f5-tts

# Return to normal user
exit

# Verify — zero-shot cloning
f5-tts --ref_audio reference.wav --ref_text "Reference transcript" \\
  --gen_text "Hello from F5 TTS" --output test.wav && play test.wav` },
    { name: "Chatterbox", url: "https://github.com/resemble-ai/chatterbox", desc: "Open-source voice cloning TTS from Resemble AI",
      installCode: `# === Install Chatterbox to /opt ===
# Python 3.12 · CUDA PyTorch recommended

# Switch to root for installation
sudo su

mkdir -p /opt/chatterbox
cd /opt/chatterbox

# Create venv with uv
uv venv .venv --python 3.12

# Install PyTorch then Chatterbox
uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121
uv pip install --python .venv/bin/python3 chatterbox-tts

# === Create system wrapper ===
tee /usr/local/bin/chatterbox << 'EOF'
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
chmod +x /usr/local/bin/chatterbox

# Return to normal user
exit

# Verify
chatterbox "Hello from Chatterbox" --ref reference.wav --output test.wav && play test.wav` },
  ],
  "Voice Conversion": [
    { name: "RVC", path: "background service", url: "https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI", desc: "Retrieval-based voice conversion with training support",
      installCode: `# === Install RVC to /opt ===
# Python 3.10 · CUDA 12.1 PyTorch + onnxruntime-gpu

# Switch to root for installation
sudo su

# Clone the repository
git clone https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI /opt/rvc
cd /opt/rvc

# Create venv with uv (Python 3.10 — required by RVC/fairseq)
uv venv .venv --python 3.10

# Install CUDA PyTorch first
uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 torchvision==0.20.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121

# Install project dependencies
uv pip install --python .venv/bin/python3 -r requirements.txt

# Download pretrained models
.venv/bin/python3 tools/download_models.py

# === Create system wrapper ===
tee /usr/local/bin/rvc << 'EOF'
#!/bin/bash
cd /opt/rvc
source .venv/bin/activate
exec python3 infer-web.py "$@"
EOF
chmod +x /usr/local/bin/rvc

# === Create systemd service for background operation ===
tee /etc/systemd/system/rvc.service << 'EOF'
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
systemctl daemon-reload
systemctl enable --now rvc

# Return to normal user
exit

# Verify — open http://localhost:7865 in your browser` },
    { name: "OpenVoice", path: "/opt/openvoice", url: "https://github.com/myshell-ai/OpenVoice", desc: "Instant voice cloning with tone color transfer",
      installCode: `# === Install OpenVoice to /opt ===
# Python 3.9 · CUDA 12.1 PyTorch + MeloTTS

# Switch to root for installation
sudo su

# Clone the repository
git clone https://github.com/myshell-ai/OpenVoice /opt/openvoice
cd /opt/openvoice

# Create venv with uv (Python 3.9 — required by OpenVoice)
uv venv .venv --python 3.9

# Install CUDA PyTorch first
uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 torchvision==0.20.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121

# Install OpenVoice and MeloTTS
uv pip install --python .venv/bin/python3 -r requirements.txt
uv pip install --python .venv/bin/python3 -e .
uv pip install --python .venv/bin/python3 \\
  git+https://github.com/myshell-ai/MeloTTS.git

# Download checkpoints (V2)
mkdir -p /opt/openvoice/checkpoints
# Follow repo instructions to download checkpoints_v2

# === Create system wrapper ===
tee /usr/local/bin/openvoice << 'EOF'
#!/bin/bash
cd /opt/openvoice
source .venv/bin/activate
exec python3 openvoice_cli.py "$@"
EOF
chmod +x /usr/local/bin/openvoice

# Return to normal user
exit

# Verify — tone color transfer
openvoice --reference reference.wav \\
  --source source.wav \\
  --output converted.wav && play converted.wav` },
    { name: "FreeVC", url: "https://github.com/OlaWod/FreeVC", desc: "Text-free one-shot voice conversion",
      installCode: `# === Install FreeVC to /opt ===
# Python 3.11 · CUDA PyTorch recommended

# Switch to root for installation
sudo su

# Clone the repository
git clone https://github.com/OlaWod/FreeVC /opt/freevc
cd /opt/freevc

# Create venv with uv
uv venv .venv --python 3.11

# Install PyTorch then dependencies
uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121
uv pip install --python .venv/bin/python3 -r requirements.txt

# Download pretrained models (follow repo README)
# Place checkpoints in /opt/freevc/checkpoints/

# === Create system wrapper ===
tee /usr/local/bin/freevc << 'EOF'
#!/bin/bash
cd /opt/freevc
source .venv/bin/activate
exec python3 convert.py "$@"
EOF
chmod +x /usr/local/bin/freevc

# Return to normal user
exit

# Verify
freevc --source source.wav --target target_speaker.wav \\
  --output converted.wav && play converted.wav` },
    { name: "DDSP-SVC", url: "https://github.com/yxlllc/DDSP-SVC", desc: "DDSP-based real-time singing voice conversion",
      installCode: `# === Install DDSP-SVC to /opt ===
# Python 3.11 · CUDA PyTorch recommended

# Switch to root for installation
sudo su

# Clone the repository
git clone https://github.com/yxlllc/DDSP-SVC /opt/ddsp-svc
cd /opt/ddsp-svc

# Create venv with uv
uv venv .venv --python 3.11

# Install PyTorch then dependencies
uv pip install --python .venv/bin/python3 \\
  torch==2.5.1+cu121 torchaudio==2.5.1+cu121 \\
  --extra-index-url https://download.pytorch.org/whl/cu121
uv pip install --python .venv/bin/python3 -r requirements.txt

# Download pretrained models (follow repo README)
# Models go in /opt/ddsp-svc/pretrain/

# === Create system wrapper ===
tee /usr/local/bin/ddsp-svc << 'EOF'
#!/bin/bash
cd /opt/ddsp-svc
source .venv/bin/activate
exec python3 main.py "$@"
EOF
chmod +x /usr/local/bin/ddsp-svc

# Return to normal user
exit

# Verify
ddsp-svc --input source.wav --output converted.wav && play converted.wav` },
  ],
  "Frameworks": [
    { name: "GPT-4o Voice Mode", url: "https://platform.openai.com/docs/guides/audio", desc: "OpenAI's speech-native multimodal model — processes audio directly without separate STT/TTS steps" },
    { name: "Moshi", url: "https://github.com/kyutai-labs/moshi", desc: "Open-source speech-native model from Kyutai — trained on audio tokens alongside text for real-time spoken dialogue" },
    { name: "Seamless", url: "https://github.com/facebookresearch/seamless_communication", desc: "Meta's family of speech-to-speech models for multilingual translation and communication" },
    { name: "Pipecat", url: "https://github.com/pipecat-ai/pipecat", desc: "Open-source framework from Daily.co for building real-time voice AI pipelines — WebRTC native with clean STT/LLM/TTS abstractions" },
    { name: "Vocode", url: "https://github.com/vocodedev/vocode-core", desc: "Open-source library for building voice agents with multiple STT/LLM/TTS backends and telephony support (Twilio, Vonage)" },
    { name: "LiveKit", url: "https://github.com/livekit/livekit", desc: "Open-source real-time audio/video infrastructure",
      installCode: `# === Install LiveKit server ===

# Switch to root for installation
sudo su

# Install via official script
curl -sSL https://get.livekit.io | bash

# LiveKit installs to /usr/local/bin/livekit-server — no wrapper needed

# === Install LiveKit Agents SDK (Python) ===
mkdir -p /opt/livekit
cd /opt/livekit

# Create venv with uv
uv venv .venv --python 3.12

uv pip install --python .venv/bin/python3 \\
  livekit-agents \\
  livekit-plugins-openai \\
  livekit-plugins-silero

# === Create wrapper for agent development ===
tee /usr/local/bin/livekit-agent << 'EOF'
#!/bin/bash
source /opt/livekit/.venv/bin/activate
exec python3 "$@"
EOF
chmod +x /usr/local/bin/livekit-agent

# Return to normal user
exit

# Verify — start dev server
livekit-server --dev` },
  ],
  "Detection": [
    { name: "Resemblyzer", url: "https://github.com/resemble-ai/Resemblyzer", desc: "Speaker verification and voice embedding extraction",
      installCode: `# === Install Resemblyzer to /opt ===
# Python 3.12

# Switch to root for installation
sudo su

mkdir -p /opt/resemblyzer
cd /opt/resemblyzer

# Create venv with uv
uv venv .venv --python 3.12

# Install Resemblyzer
# webrtcvad is broken on Python 3.12+ — use webrtcvad-wheels instead
uv pip install --python .venv/bin/python3 resemblyzer webrtcvad-wheels

# === Create system wrapper ===
tee /usr/local/bin/resemblyzer << 'EOF'
#!/bin/bash
# Usage: resemblyzer <original.wav> <clone.wav>
# Returns similarity score between two voice samples
exec /opt/resemblyzer/.venv/bin/python3 -c "
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
chmod +x /usr/local/bin/resemblyzer

# Return to normal user
exit

# Verify
resemblyzer original.wav clone.wav` },
    { name: "librosa", path: "/opt/librosa-tools", url: "https://github.com/librosa/librosa", desc: "Python audio analysis library with spectrogram comparison, MFCC similarity scoring, spectral artifact detection, and batch analysis",
      installCode: `# === Install librosa toolkit to /opt ===
# Python 3.12

# Switch to root for installation
sudo su

mkdir -p /opt/librosa-tools/scripts
cd /opt/librosa-tools

# Initialize uv project (directory name becomes project name, avoids conflict with librosa package)
uv init --python 3.12
uv add librosa matplotlib soundfile numpy scipy

# === Script 1: compare_spectrograms.py ===
cat > /opt/librosa-tools/scripts/compare_spectrograms.py << 'PYEOF'
# /// script
# requires-python = ">=3.12"
# dependencies = ["librosa", "matplotlib", "soundfile", "numpy"]
# ///
"""
Side-by-side mel-spectrogram comparison of two audio files.
AI-generated audio often shows unnaturally smooth or repeating patterns.

Usage: voice-spectrogram <reference.wav> <suspect.wav> [output.png]
"""
import sys
import librosa
import librosa.display
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

def main():
    if len(sys.argv) < 3:
        print("Usage: voice-spectrogram <reference.wav> <suspect.wav> [output.png]")
        sys.exit(1)

    file_real = sys.argv[1]
    file_suspect = sys.argv[2]
    output_path = sys.argv[3] if len(sys.argv) > 3 else "spectrogram_comparison.png"

    print(f"Loading reference: {file_real}")
    y_real, sr = librosa.load(file_real, sr=16000)
    print(f"Loading suspect:   {file_suspect}")
    y_suspect, _ = librosa.load(file_suspect, sr=16000)

    mel_real = librosa.power_to_db(
        librosa.feature.melspectrogram(y=y_real, sr=sr, n_mels=128), ref=np.max
    )
    mel_suspect = librosa.power_to_db(
        librosa.feature.melspectrogram(y=y_suspect, sr=sr, n_mels=128), ref=np.max
    )

    fig, axes = plt.subplots(1, 2, figsize=(16, 5))
    librosa.display.specshow(mel_real, sr=sr, x_axis="time", y_axis="mel", ax=axes[0])
    axes[0].set_title("Reference (Known Real)")
    librosa.display.specshow(mel_suspect, sr=sr, x_axis="time", y_axis="mel", ax=axes[1])
    axes[1].set_title("Suspect Audio")
    plt.tight_layout()
    plt.savefig(output_path, dpi=150)
    plt.close()
    print(f"Saved: {output_path}")

if __name__ == "__main__":
    main()
PYEOF

# === Script 2: similarity_score.py ===
cat > /opt/librosa-tools/scripts/similarity_score.py << 'PYEOF'
# /// script
# requires-python = ">=3.12"
# dependencies = ["librosa", "soundfile", "numpy", "scipy"]
# ///
"""
MFCC cosine similarity between two audio files.
Returns a score from 0.0 (completely different) to 1.0 (identical).
Same-speaker comparisons below ~0.75 are suspicious.

Usage: voice-similarity <file_a.wav> <file_b.wav>
"""
import sys
import librosa
import numpy as np
from scipy.spatial.distance import cosine

def main():
    if len(sys.argv) < 3:
        print("Usage: voice-similarity <file_a.wav> <file_b.wav>")
        sys.exit(1)

    file_a, file_b = sys.argv[1], sys.argv[2]
    n_mfcc = 20

    y_a, sr = librosa.load(file_a, sr=16000)
    y_b, _ = librosa.load(file_b, sr=16000)

    mfcc_a = librosa.feature.mfcc(y=y_a, sr=sr, n_mfcc=n_mfcc)
    mfcc_b = librosa.feature.mfcc(y=y_b, sr=sr, n_mfcc=n_mfcc)

    mean_a = np.mean(mfcc_a, axis=1)
    mean_b = np.mean(mfcc_b, axis=1)

    similarity = 1 - cosine(mean_a, mean_b)

    print(f"File A:      {file_a}")
    print(f"File B:      {file_b}")
    print(f"Similarity:  {similarity:.4f}")
    print()
    if similarity >= 0.90:
        print("RESULT: High similarity — likely same speaker, likely authentic")
    elif similarity >= 0.75:
        print("RESULT: Moderate similarity — possibly same speaker")
    else:
        print("RESULT: Low similarity — SUSPICIOUS, possible voice fake or different speaker")

if __name__ == "__main__":
    main()
PYEOF

# === Script 3: artifact_scan.py ===
cat > /opt/librosa-tools/scripts/artifact_scan.py << 'PYEOF'
# /// script
# requires-python = ">=3.12"
# dependencies = ["librosa", "soundfile", "numpy"]
# ///
"""
Scan a single audio file for spectral anomalies common in AI-generated speech:
- Unnaturally low spectral variance (too smooth/uniform)
- Missing or artificial high-frequency content
- Unusual spectral rolloff or flatness

Usage: voice-artifact-scan <audio_file.wav>
"""
import sys
import librosa
import numpy as np

def main():
    if len(sys.argv) < 2:
        print("Usage: voice-artifact-scan <audio_file.wav>")
        sys.exit(1)

    audio_file = sys.argv[1]
    y, sr = librosa.load(audio_file, sr=16000)

    centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr, roll_percent=0.85)[0]
    flatness = librosa.feature.spectral_flatness(y=y)[0]
    zcr = librosa.feature.zero_crossing_rate(y)[0]
    bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)[0]

    print(f"File: {audio_file}")
    print(f"Duration: {len(y)/sr:.2f}s")
    print()
    print("--- Spectral Features ---")
    print(f"  Centroid mean:     {np.mean(centroid):.2f} Hz")
    print(f"  Centroid std:      {np.std(centroid):.2f}")
    print(f"  Rolloff mean:      {np.mean(rolloff):.2f} Hz")
    print(f"  Flatness mean:     {np.mean(flatness):.5f}")
    print(f"  Flatness std:      {np.std(flatness):.5f}")
    print(f"  ZCR mean:          {np.mean(zcr):.5f}")
    print(f"  Bandwidth std:     {np.std(bandwidth):.2f}")
    print()

    flags = []
    if np.std(flatness) < 0.02:
        flags.append("Low spectral flatness variance — signal is unnaturally uniform")
    if np.std(centroid) < 100:
        flags.append("Low spectral centroid variance — pitch is unnaturally stable")
    if np.mean(rolloff) < 2000:
        flags.append("Low spectral rolloff — missing high-frequency content")
    if np.std(bandwidth) < 200:
        flags.append("Low bandwidth variance — spectrum is unusually consistent")

    if flags:
        print("--- FLAGS ---")
        for f in flags:
            print(f"  ⚠  {f}")
        print()
        print("VERDICT: SUSPICIOUS — review manually")
    else:
        print("VERDICT: No obvious synthetic artifacts detected")

if __name__ == "__main__":
    main()
PYEOF

# === Script 4: batch_analyze.py ===
cat > /opt/librosa-tools/scripts/batch_analyze.py << 'PYEOF'
# /// script
# requires-python = ">=3.12"
# dependencies = ["librosa", "soundfile", "numpy"]
# ///
"""
Batch-analyze a folder of audio files and output a CSV report
with spectral features and heuristic flags.

Usage: voice-batch-analyze <folder> [output.csv]
"""
import sys
import os
import csv
import librosa
import numpy as np
from pathlib import Path

AUDIO_EXTS = {".wav", ".mp3", ".flac", ".ogg", ".m4a"}

def main():
    if len(sys.argv) < 2:
        print("Usage: voice-batch-analyze <folder> [output.csv]")
        sys.exit(1)

    input_folder = sys.argv[1]
    output_csv = sys.argv[2] if len(sys.argv) > 2 else "voice_analysis_report.csv"

    files = sorted(
        f for f in Path(input_folder).iterdir()
        if f.suffix.lower() in AUDIO_EXTS
    )

    if not files:
        print(f"No audio files found in {input_folder}")
        sys.exit(1)

    print(f"Analyzing {len(files)} files in {input_folder}...")

    rows = []
    for i, filepath in enumerate(files, 1):
        try:
            y, sr = librosa.load(str(filepath), sr=16000)
            centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
            flatness = librosa.feature.spectral_flatness(y=y)[0]
            rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]

            suspicious = (np.std(flatness) < 0.02) or (np.std(centroid) < 100)

            row = {
                "filename": filepath.name,
                "duration_sec": round(len(y) / sr, 2),
                "centroid_mean": round(np.mean(centroid), 2),
                "centroid_std": round(np.std(centroid), 2),
                "flatness_mean": round(np.mean(flatness), 5),
                "flatness_std": round(np.std(flatness), 5),
                "rolloff_mean": round(np.mean(rolloff), 2),
                "flagged": "YES" if suspicious else "no",
            }
            rows.append(row)
            status = "⚠ FLAGGED" if suspicious else "  ok"
            print(f"  [{i}/{len(files)}] {status}  {filepath.name}")

        except Exception as e:
            rows.append({"filename": filepath.name, "flagged": f"ERROR: {e}"})
            print(f"  [{i}/{len(files)}]  ERROR   {filepath.name}: {e}")

    if rows:
        fieldnames = list(rows[0].keys())
        with open(output_csv, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)

    flagged_count = sum(1 for r in rows if r.get("flagged") == "YES")
    print(f"\\nDone. {flagged_count}/{len(rows)} flagged. Report: {output_csv}")

if __name__ == "__main__":
    main()
PYEOF

# === Wrapper 1: voice-spectrogram ===
tee /usr/local/bin/voice-spectrogram > /dev/null << 'EOF'
#!/usr/bin/env bash
exec uv run --project /opt/librosa-tools \\
    python /opt/librosa-tools/scripts/compare_spectrograms.py "$@"
EOF

# === Wrapper 2: voice-similarity ===
tee /usr/local/bin/voice-similarity > /dev/null << 'EOF'
#!/usr/bin/env bash
exec uv run --project /opt/librosa-tools \\
    python /opt/librosa-tools/scripts/similarity_score.py "$@"
EOF

# === Wrapper 3: voice-artifact-scan ===
tee /usr/local/bin/voice-artifact-scan > /dev/null << 'EOF'
#!/usr/bin/env bash
exec uv run --project /opt/librosa-tools \\
    python /opt/librosa-tools/scripts/artifact_scan.py "$@"
EOF

# === Wrapper 4: voice-batch-analyze ===
tee /usr/local/bin/voice-batch-analyze > /dev/null << 'EOF'
#!/usr/bin/env bash
exec uv run --project /opt/librosa-tools \\
    python /opt/librosa-tools/scripts/batch_analyze.py "$@"
EOF

chmod +x /usr/local/bin/voice-spectrogram \\
         /usr/local/bin/voice-similarity \\
         /usr/local/bin/voice-artifact-scan \\
         /usr/local/bin/voice-batch-analyze

# Return to normal user
exit

# Verify
voice-spectrogram reference.wav suspect.wav output.png
voice-similarity known_caller.wav incoming_call.wav
voice-artifact-scan suspect_call.wav
voice-batch-analyze /path/to/recordings/ results.csv` },
    { name: "WeDefense", path: "/opt/wedefense", url: "https://github.com/zlin0/wedefense", desc: "Open-source toolkit for fake audio detection and localization — supports training, evaluation, and deployment of anti-spoofing models",
      installCode: `# === Install WeDefense to /opt ===
# Python 3.12

# Switch to root for installation
sudo su

# Clone directly into /opt/wedefense
git clone https://github.com/zlin0/wedefense.git /opt/wedefense
cd /opt/wedefense

# Create uv-managed venv
uv venv --python 3.12

# Install build deps first (visdom needs old setuptools + wheel, hdbscan needs cython)
uv pip install "setuptools<70" wheel cython

# Install dependencies (skip strict version pins from requirements.txt to avoid conflicts)
# --no-build-isolation so visdom can find setuptools/wheel in the venv
uv pip install --no-build-isolation \\
  fire kaldiio numpy PyYAML scipy tableprint torchnet tqdm \\
  scikit-learn matplotlib h5py lmdb onnxruntime soundfile \\
  pypeln silero-vad s3prl hdbscan umap-learn whisper pandas \\
  wandb ttach opencv-python

# Install the project itself
uv pip install -e .

# === Data prep script ===
mkdir -p /opt/wedefense/scripts

cat > /opt/wedefense/scripts/prep_callcenter_data.py << 'PYEOF'
"""
Prepare call center audio into WeDefense's expected Kaldi-style format.

Expected input structure:
    <data_dir>/
    ├── real/     # Known authentic call recordings
    └── fake/     # Known AI-generated / cloned recordings

Creates wav.scp and utt2label files for WeDefense.

Usage: voice-wedefense prep <data_dir> <output_dir>
"""
import os
import sys
from pathlib import Path

AUDIO_EXTS = {".wav", ".flac", ".mp3", ".ogg"}

def prep(data_dir, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    scp_path = os.path.join(output_dir, "wav.scp")
    label_path = os.path.join(output_dir, "utt2label")

    count = 0
    with open(scp_path, "w") as scp, open(label_path, "w") as labels:
        for label_dir, label in [("real", "bonafide"), ("fake", "spoof")]:
            folder = Path(data_dir) / label_dir
            if not folder.is_dir():
                print(f"  Skipping {folder} (not found)")
                continue
            for f in sorted(folder.iterdir()):
                if f.suffix.lower() in AUDIO_EXTS:
                    utt_id = f.stem
                    scp.write(f"{utt_id} {f.resolve()}\\n")
                    labels.write(f"{utt_id} {label}\\n")
                    count += 1

    print(f"Wrote {count} entries to {scp_path} and {label_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: voice-wedefense prep <data_dir> <output_dir>")
        sys.exit(1)
    prep(sys.argv[1], sys.argv[2])
PYEOF

# === Call center YAML config ===
mkdir -p /opt/wedefense/egs/callcenter/conf

cat > /opt/wedefense/egs/callcenter/conf/ssl_aasist_callcenter.yaml << 'YAMLEOF'
# WeDefense config tuned for telephone-quality recordings (G.711, AMR codecs)

model:
  name: ssl_aasist
  ssl_model: wav2vec2-base
  freeze_ssl: true

data:
  train_scp: data/train/wav.scp
  dev_scp: data/dev/wav.scp
  eval_scp: data/eval/wav.scp
  sample_rate: 16000
  max_len: 64000          # 4 seconds at 16kHz

training:
  batch_size: 16
  num_epochs: 20
  lr: 0.0001
  device: cpu             # Change to cuda for GPU laptops

augmentation:
  speed_perturb: true
  codec_augment: true     # Critical for phone call audio
  rawboost: false

scoring:
  calibrate: true
YAMLEOF

# === Create system wrapper ===
tee /usr/local/bin/voice-wedefense > /dev/null << 'EOF'
#!/usr/bin/env bash
#
# System-wide wrapper for WeDefense fake audio detection toolkit.
#
# Usage:
#   voice-wedefense prep <data_dir> <output_dir>
#   voice-wedefense train <config.yaml>
#   voice-wedefense eval <config.yaml>
#   voice-wedefense demo
#
set -euo pipefail

WD_ROOT="/opt/wedefense"

case "\${1:-help}" in
    prep)
        shift
        uv run --project "\${WD_ROOT}" python "\${WD_ROOT}/scripts/prep_callcenter_data.py" "$@"
        ;;
    train)
        shift
        config="\${1:?Error: provide a YAML config file}"
        cd "\${WD_ROOT}"
        if [ -d "egs/callcenter/detection" ]; then
            cd egs/callcenter/detection
        elif [ -d "egs/asvspoof2019/detection" ]; then
            cd egs/asvspoof2019/detection
        else
            echo "No recipe directory found under egs/"
            exit 1
        fi
        uv run --project "\${WD_ROOT}" bash run.sh --stage 1 --stop_stage 1 --conf "\${config}"
        ;;
    eval)
        shift
        config="\${1:?Error: provide a YAML config file}"
        cd "\${WD_ROOT}"
        if [ -d "egs/callcenter/detection" ]; then
            cd egs/callcenter/detection
        elif [ -d "egs/asvspoof2019/detection" ]; then
            cd egs/asvspoof2019/detection
        else
            echo "No recipe directory found under egs/"
            exit 1
        fi
        uv run --project "\${WD_ROOT}" bash run.sh --stage 2 --stop_stage 3 --conf "\${config}"
        ;;
    demo)
        echo "Starting WeDefense demo UI..."
        uv run --project "\${WD_ROOT}" pip install gradio 2>/dev/null
        cd "\${WD_ROOT}"
        if [ -f "app.py" ]; then
            uv run --project "\${WD_ROOT}" python app.py
        else
            echo "No local app.py found. Use the hosted demo at:"
            echo "  https://huggingface.co/spaces/wedefense/fake_audio_detection_demo"
        fi
        ;;
    help|--help|-h|"")
        cat << USAGE
voice-wedefense — System wrapper for WeDefense fake audio detection toolkit

Commands:
  prep   <data_dir> <output_dir>   Convert folder of real/fake audio to SCP format
  train  <config.yaml>             Train a detection model
  eval   <config.yaml>             Evaluate / score with trained model
  demo                             Launch local Gradio web UI (if available)

Data prep expects:
  <data_dir>/real/   — authentic call recordings (.wav/.flac/.mp3)
  <data_dir>/fake/   — known AI-generated recordings

Examples:
  voice-wedefense prep ./training_calls ./data/train
  voice-wedefense train conf/ssl_aasist_callcenter.yaml
  voice-wedefense eval conf/ssl_aasist_callcenter.yaml

Config: /opt/wedefense/egs/callcenter/conf/ssl_aasist_callcenter.yaml
Repo:   https://github.com/zlin0/wedefense
USAGE
        ;;
    *)
        echo "Unknown command: $1 (try: voice-wedefense help)"
        exit 1
        ;;
esac
EOF

chmod +x /usr/local/bin/voice-wedefense

# Return to normal user
exit

# Verify installation
voice-wedefense help

# === Usage ===
# You provide your own labeled audio samples:
#   my_samples/
#   ├── real/    ← known authentic call recordings (.wav/.flac/.mp3)
#   └── fake/    ← known AI-generated / cloned recordings
#
# 1. Prep data into Kaldi-style format
# voice-wedefense prep ./my_samples ./wedefense_data/train
#
# 2. Train a detection model
# voice-wedefense train /opt/wedefense/egs/callcenter/conf/ssl_aasist_callcenter.yaml
#
# 3. Evaluate
# voice-wedefense eval /opt/wedefense/egs/callcenter/conf/ssl_aasist_callcenter.yaml` },
    { name: "FakeVoiceFinder", path: "/opt/fakevoicefinder", url: "https://github.com/DEEP-CGPS/FakeVoiceFinder", desc: "Framework for synthetic and deepfake audio detection using spectral transforms (mel, log, DWT, CQT) with real/fake probability scoring",
      installCode: `# === Install FakeVoiceFinder to /opt ===
# Python 3.12

# Switch to root for installation
sudo su

# Clone directly into /opt/fakevoicefinder
git clone https://github.com/DEEP-CGPS/FakeVoiceFinder.git /opt/fakevoicefinder
cd /opt/fakevoicefinder

# Create uv-managed venv
uv venv --python 3.12
uv pip install -r requirements.txt

# PyTorch — CPU-only for laptops without NVIDIA GPU
uv pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# If the laptops HAVE NVIDIA GPUs instead:
# uv pip install torch torchvision --index-url https://download.pytorch.org/whl/cu126

# Install the project
uv pip install -e .

# === CLI inference script ===
mkdir -p /opt/fakevoicefinder/scripts

cat > /opt/fakevoicefinder/scripts/cli_inference.py << 'PYEOF'
"""
CLI interface for FakeVoiceFinder inference.

Scores one or more audio files and reports real/fake probability.

Usage:
  voice-fakefinder score <audio_file> --checkpoint <model.pth> [--transform mel]
  voice-fakefinder batch <folder> --checkpoint <model.pth> [--output results.csv]
  voice-fakefinder compare-transforms <audio_file>
"""
import sys
import os

# Add project root so we can import fakevoicefinder
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import argparse
import csv
import torch
import librosa
import numpy as np
from pathlib import Path

AUDIO_EXTS = {".wav", ".mp3", ".flac", ".ogg", ".m4a"}


def score_single(audio_path, checkpoint_path, model_name="resnet18",
                 transform_type="mel", sample_rate=16000, duration=4.0):
    """Score a single audio file. Returns dict with real/fake probabilities."""
    from fakevoicefinder.transformations import get_transform
    from fakevoicefinder.models import get_model

    y, sr = librosa.load(audio_path, sr=sample_rate)

    target_len = int(sample_rate * duration)
    if len(y) < target_len:
        y = np.pad(y, (0, target_len - len(y)))
    else:
        y = y[:target_len]

    transform = get_transform(transform_type)
    spectrogram = transform(y, sr)

    x = torch.FloatTensor(spectrogram).unsqueeze(0).unsqueeze(0)

    model = get_model(model_name, num_classes=2)
    checkpoint = torch.load(checkpoint_path, map_location="cpu", weights_only=True)
    model.load_state_dict(checkpoint.get("model_state_dict", checkpoint))
    model.eval()

    with torch.no_grad():
        logits = model(x)
        probs = torch.softmax(logits, dim=1).numpy()[0]

    return {
        "real_prob": round(float(probs[0]) * 100, 2),
        "fake_prob": round(float(probs[1]) * 100, 2),
        "verdict": "LIKELY REAL" if probs[0] > probs[1] else "LIKELY FAKE",
    }


def compare_transforms(audio_path, sample_rate=16000, duration=4.0):
    """Generate side-by-side visualizations of all 4 spectral transforms."""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from fakevoicefinder.transformations import get_transform

    y, _ = librosa.load(audio_path, sr=sample_rate)
    target_len = int(sample_rate * duration)
    if len(y) < target_len:
        y = np.pad(y, (0, target_len - len(y)))
    else:
        y = y[:target_len]

    transforms = {
        "Mel Spectrogram": "mel",
        "Log Spectrogram": "log",
        "Scalogram (DWT)": "dwt",
        "Constant-Q Transform": "cqt",
    }

    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    for ax, (title, t_type) in zip(axes.flat, transforms.items()):
        try:
            transform = get_transform(t_type)
            spec = transform(y, sample_rate)
            ax.imshow(spec, aspect="auto", origin="lower", cmap="magma")
            ax.set_title(title)
        except Exception as e:
            ax.set_title(f"{title} (error: {e})")

    output_path = Path(audio_path).stem + "_transforms.png"
    plt.suptitle(f"Spectral Representations: {Path(audio_path).name}", fontsize=14)
    plt.tight_layout()
    plt.savefig(output_path, dpi=150)
    plt.close()
    print(f"Saved: {output_path}")


def main():
    parser = argparse.ArgumentParser(
        prog="voice-fakefinder",
        description="FakeVoiceFinder — AI voice deepfake detection CLI"
    )
    sub = parser.add_subparsers(dest="command")

    # score
    p_score = sub.add_parser("score", help="Score a single audio file")
    p_score.add_argument("audio_file")
    p_score.add_argument("--checkpoint", required=True, help="Path to model .pth checkpoint")
    p_score.add_argument("--model", default="resnet18", help="Model architecture (default: resnet18)")
    p_score.add_argument("--transform", default="mel", choices=["mel", "log", "dwt", "cqt"])

    # batch
    p_batch = sub.add_parser("batch", help="Score all audio files in a folder")
    p_batch.add_argument("folder")
    p_batch.add_argument("--checkpoint", required=True)
    p_batch.add_argument("--model", default="resnet18")
    p_batch.add_argument("--transform", default="mel", choices=["mel", "log", "dwt", "cqt"])
    p_batch.add_argument("--output", default="fakefinder_results.csv")

    # compare-transforms
    p_ct = sub.add_parser("compare-transforms", help="Visualize all 4 spectral transforms")
    p_ct.add_argument("audio_file")

    args = parser.parse_args()

    if args.command == "score":
        result = score_single(
            args.audio_file, args.checkpoint,
            model_name=args.model, transform_type=args.transform
        )
        print(f"File:    {args.audio_file}")
        print(f"Real:    {result['real_prob']}%")
        print(f"Fake:    {result['fake_prob']}%")
        print(f"Verdict: {result['verdict']}")

    elif args.command == "batch":
        files = sorted(
            f for f in Path(args.folder).iterdir()
            if f.suffix.lower() in AUDIO_EXTS
        )
        if not files:
            print(f"No audio files in {args.folder}")
            sys.exit(1)

        print(f"Scoring {len(files)} files...")
        results = []
        for i, fp in enumerate(files, 1):
            try:
                r = score_single(
                    str(fp), args.checkpoint,
                    model_name=args.model, transform_type=args.transform
                )
                r["filename"] = fp.name
                results.append(r)
                print(f"  [{i}/{len(files)}] {r['verdict']:12s}  "
                      f"R={r['real_prob']:5.1f}%  F={r['fake_prob']:5.1f}%  {fp.name}")
            except Exception as e:
                results.append({"filename": fp.name, "verdict": f"ERROR: {e}"})
                print(f"  [{i}/{len(files)}] ERROR  {fp.name}: {e}")

        with open(args.output, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=["filename", "real_prob", "fake_prob", "verdict"])
            w.writeheader()
            w.writerows(results)
        print(f"\\nResults saved: {args.output}")

    elif args.command == "compare-transforms":
        compare_transforms(args.audio_file)

    else:
        parser.print_help()

if __name__ == "__main__":
    main()
PYEOF

# === Create system wrapper ===
tee /usr/local/bin/voice-fakefinder > /dev/null << 'EOF'
#!/usr/bin/env bash
#
# System-wide wrapper for FakeVoiceFinder.
#
# Usage:
#   voice-fakefinder score <file.wav> --checkpoint <model.pth>
#   voice-fakefinder batch <folder/> --checkpoint <model.pth> [--output results.csv]
#   voice-fakefinder compare-transforms <file.wav>
#
set -euo pipefail
uv run --project /opt/fakevoicefinder \\
    python /opt/fakevoicefinder/scripts/cli_inference.py "$@"
EOF

chmod +x /usr/local/bin/voice-fakefinder

# Return to normal user
exit

# Verify
voice-fakefinder score suspect_call.wav \\
    --checkpoint /opt/fakevoicefinder/models/resnet18_mel_best.pth` },
    { name: "pgvector", url: "https://github.com/pgvector/pgvector", desc: "Vector similarity search extension for PostgreSQL",
      installCode: `# === Install pgvector ===
# PostgreSQL extension — no Python venv needed

# Switch to root for installation
sudo su

# Install PostgreSQL if not already installed
apt install -y postgresql postgresql-server-dev-all

# Build and install pgvector
git clone https://github.com/pgvector/pgvector /opt/pgvector
cd /opt/pgvector
make
make install

# Enable the extension in PostgreSQL
su -c "psql -c \\"CREATE EXTENSION IF NOT EXISTS vector;\\"" postgres

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
# Return to normal user
exit

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
export const allProjectTools = Object.entries(projectTools).flatMap(([category, tools]) =>
  tools.map(t => ({ ...t, category: category.replace(/s$/, "") }))
).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

const ProjectGlossarySection = () => (
  <div>
    <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>AI Tool Glossary</h1>
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

export default ProjectGlossarySection;
