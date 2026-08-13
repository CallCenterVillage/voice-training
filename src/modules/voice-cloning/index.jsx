import { lazy } from "react";
import TrainingShell from "../../components/TrainingShell";

const SECTIONS = [
  { id: "intro", title: "Welcome", icon: "microphone" },
  { id: "fundamentals", title: "Audio Fundamentals", icon: "chart-bar", anchors: [
    { id: "waveform-explorer", label: "Interactive Waveform Explorer" },
    { id: "voice-characteristics", label: "Key Voice Characteristics" },
    { id: "frequency-spectrum", label: "Frequency Spectrum" },
    { id: "audio-quality-recommendations", label: "Audio Quality Recommendations" },
    { id: "why-these-numbers-matter", label: "Why These Numbers Matter" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "traditional", title: "Non-AI Voice Modification", icon: "adjustments", anchors: [
    { id: "audiomancers-creed", label: "The Audiomancer's Creed" },
    { id: "example-tool-chains", label: "Example Tool Chains" },
    { id: "voice-disguise-recipes", label: "Voice Disguise Recipes" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "ai-cloning", title: "AI Voice Cloning", icon: "cpu", anchors: [
    { id: "before-there-was-ai", label: "Before There Was AI" },
    { id: "ai-powered-tts-and-voice-conversion", label: "AI-Powered TTS and Voice Conversion" },
    { id: "tool-reference", label: "Tool Reference" },
    { id: "speaker-embeddings", label: "Speaker Embeddings" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "local-tools", title: "Local AI Tools", icon: "computer", anchors: [
    { id: "voice-cloning-approaches", label: "Voice Cloning Approaches" },
    { id: "reference-tools", label: "Reference Tools" },
    { id: "supporting-tools", label: "Supporting Tools" },
    { id: "whisper-cpp", label: "whisper.cpp" },
    { id: "llama-cpp", label: "llama.cpp" },
    { id: "putting-it-all-together", label: "Putting It All Together" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "commercial", title: "Commercial Options", icon: "cloud", anchors: [
    { id: "service-providers", label: "Service Providers" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "defense", title: "Detection & Defense", icon: "shield", anchors: [
    { id: "detection-and-defense-tools", label: "Detection & Defense Tools" },
    { id: "technical-detection", label: "Technical Detection" },
    { id: "ai-powered-detection", label: "AI-Powered Detection" },
    { id: "procedural-defense", label: "Procedural Defense" },
    { id: "organizational", label: "Organizational Controls" },
    { id: "spectral-artifacts", label: "Spectral Artifacts" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "lab", title: "Interactive Lab", icon: "beaker" },
];

// Lazy so a visitor to one section does not download every other
// section's prose and diagrams. SECTIONS stays eager — it is just
// metadata, and routing plus the drawer need it up front.
const COMPS = [
  lazy(() => import("./IntroSection")),
  lazy(() => import("./FundamentalsSection")),
  lazy(() => import("./TraditionalSection")),
  lazy(() => import("./AISection")),
  lazy(() => import("./LocalToolsSection")),
  lazy(() => import("./CommercialSection")),
  lazy(() => import("./DefenseSection")),
  lazy(() => import("./LabSection")),
];

export { SECTIONS, COMPS };

export default function VoiceCloningTraining() {
  return <TrainingShell sections={SECTIONS} sectionComponents={COMPS} moduleTitle="Voice Cloning" topOffset={56} />;
}
