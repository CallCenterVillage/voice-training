// Data only — no JSX. Split out so the appendix section components can be
// code-split: index.jsx needs these lists to build anchor links, but does
// not need the components that render them.
import { C } from "../../../components/colors";

export const cliTools = [
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
# Requires Go (sudo apt install -y golang-go)

# Switch to root for installation
sudo su

go install github.com/danielgatis/imgcat@latest
cp ~/go/bin/imgcat /usr/local/bin/imgcat

# Return to normal user
exit

# Verify
imgcat --help` },
  { name: "yt-dlp", desc: "Download audio/video from YouTube and other platforms", install: "system package",
    installCode: `# === Install yt-dlp via uv ===
# The apt version is often outdated — uv keeps it current

# Switch to root for installation
sudo su

mkdir -p /opt/yt-dlp
cd /opt/yt-dlp

# Create venv and install with uv
uv venv .venv --python 3.12
uv pip install --python .venv/bin/python3 yt-dlp

# === Create system wrapper ===
tee /usr/local/bin/yt-dlp << 'EOF'
#!/bin/bash
source /opt/yt-dlp/.venv/bin/activate
exec yt-dlp "$@"
EOF
chmod +x /usr/local/bin/yt-dlp

# Return to normal user
exit

# Verify
yt-dlp --version

# === Update yt-dlp (run as root) ===
# sudo su
# uv pip install --python /opt/yt-dlp/.venv/bin/python3 --upgrade yt-dlp
# exit` },
  { name: "curl", desc: "HTTP client for API requests", install: "system package",
    installCode: `# === Install curl ===
# Usually pre-installed on Ubuntu/Pop!_OS

sudo apt install -y curl

# Verify
curl --version`,
    note: <>Created and maintained by <a href="https://mastodon.social/@bagder" target="_blank" rel="noopener noreferrer" style={{ color: C.secondary, textDecoration: "none" }}>Daniel Stenberg</a></> },
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
