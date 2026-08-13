import { lazy } from "react";
import TrainingShell from "../../components/TrainingShell";

const SECTIONS = [
  { id: "intro", title: "Welcome", icon: "command-line" },
  { id: "architecture", title: "Agent Architecture", icon: "cube", anchors: [
    { id: "pipeline-overview", label: "Pipeline Overview" },
    { id: "beyond-the-pipeline", label: "Beyond the Pipeline" },
    { id: "latency-budget", label: "Latency Budget" },
    { id: "turn-taking", label: "Turn-Taking & Call Control" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "stt", title: "Speech-to-Text (STT)", icon: "signal", anchors: [
    { id: "local-stt-tools", label: "Local / Open-Source Tools" },
    { id: "commercial-stt", label: "Commercial Cloud Alternatives" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "brain", title: "The LLM Brain", icon: "cpu", anchors: [
    { id: "local-llms", label: "Local LLMs with llama.cpp" },
    { id: "cloud-llm-providers", label: "Cloud LLM Providers" },
    { id: "system-prompts", label: "System Prompts" },
    { id: "streaming-latency", label: "Streaming & Latency" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "tts", title: "Text-to-Speech (TTS)", icon: "speaker-wave", anchors: [
    { id: "local-tts-tools", label: "Local / Open-Source Tools" },
    { id: "commercial-tts", label: "Commercial Cloud Alternatives" },
    { id: "choosing-tts", label: "Choosing TTS for Your Agent" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "livekit", title: "LiveKit & Frameworks", icon: "globe", anchors: [
    { id: "livekit-agents", label: "LiveKit Agents" },
    { id: "other-frameworks", label: "Other Open-Source Frameworks" },
    { id: "commercial-platforms", label: "Commercial Platforms" },
    { id: "telephony", label: "Open-Source Telephony" },
    { id: "telephony-providers", label: "Telephony API Providers" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "building", title: "Building an Agent", icon: "wrench", anchors: [
    { id: "fully-local-agent", label: "Fully Local Agent Stack" },
    { id: "cloud-hybrid-livekit", label: "Cloud-Hybrid with LiveKit" },
    { id: "architecture-decision-matrix", label: "Architecture Decision Matrix" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "attack-surface", title: "Attack Surface", icon: "magnifying-glass", anchors: [
    { id: "stt-attacks", label: "STT Attacks" },
    { id: "llm-attacks", label: "LLM Attacks" },
    { id: "tts-output-attacks", label: "TTS / Output Attacks" },
    { id: "infrastructure-attacks", label: "Infrastructure Attacks" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "lab", title: "Interactive Lab", icon: "beaker" },
];

// Lazy so a visitor to one section does not download every other
// section's prose and diagrams. SECTIONS stays eager — it is just
// metadata, and routing plus the drawer need it up front.
const COMPS = [
  lazy(() => import("./IntroSection")),
  lazy(() => import("./ArchitectureSection")),
  lazy(() => import("./STTSection")),
  lazy(() => import("./BrainSection")),
  lazy(() => import("./TTSSection")),
  lazy(() => import("./LiveKitSection")),
  lazy(() => import("./BuildingSection")),
  lazy(() => import("./AttackSurfaceSection")),
  lazy(() => import("./LabSection")),
];

export { SECTIONS, COMPS };

export default function VoiceAgentsTraining() {
  return <TrainingShell sections={SECTIONS} sectionComponents={COMPS} moduleTitle="Voice Agents" topOffset={56} />;
}
