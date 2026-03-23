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
    <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>AI Tool Glossary</h2>
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
