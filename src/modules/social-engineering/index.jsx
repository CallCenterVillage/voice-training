import { lazy } from "react";
import TrainingShell from "../../components/TrainingShell";

const SECTIONS = [
  { id: "intro", title: "Welcome", icon: "user-group" },
  { id: "psychology", title: "Psychology of SE", icon: "cpu", anchors: [
    { id: "cialdinis-principles", label: "Cialdini's Principles" },
    { id: "cognitive-biases", label: "Cognitive Biases Exploited in SE" },
    { id: "psychology-quiz", label: "Knowledge Check" },
  ] },
  { id: "human-targets", title: "SE Against Humans", icon: "user", anchors: [
    { id: "threat-assessment", label: "Attack Types" },
    { id: "the-angry-executive", label: "The Angry Executive" },
    { id: "the-sympathetic-caller", label: "The Sympathetic Caller" },
    { id: "pretexting-personas", label: "Common Pretexting Personas" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "ai-targets", title: "SE Against AI", icon: "command-line", anchors: [
    { id: "direct-prompt-injection", label: "Direct Prompt Injection" },
    { id: "indirect-contextual-injection", label: "Indirect / Contextual Injection" },
    { id: "tool-function-abuse", label: "Tool / Function Abuse" },
    { id: "persona-hijacking", label: "Persona Hijacking" },
    { id: "information-extraction", label: "Information Extraction" },
    { id: "conversational-dos", label: "Conversational DoS" },
    { id: "jailbreaking-scenario", label: "Jailbreaking a Banking AI" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "call-center", title: "Call Center Scenarios", icon: "phone", anchors: [
    { id: "ai-to-human-handoff", label: "AI-to-Human Handoff Exploit" },
    { id: "multi-channel-attack", label: "Multi-Channel Coordinated Attack" },
    { id: "escalation-ladder", label: "The Escalation Ladder" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "combined", title: "Combined Attacks", icon: "shield-exclamation", anchors: [
    { id: "full-kill-chain", label: "The Full Kill Chain" },
    { id: "human-in-the-loop", label: "Human-in-the-Loop AI Attacks" },
    { id: "attack-scalability", label: "Attack Scalability" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "defense", title: "Defense Playbook", icon: "shield", anchors: [
    { id: "defense-controls", label: "Defense Controls" },
    { id: "verification-protocol", label: "60-Second Verification Protocol" },
    { id: "knowledge-check", label: "Knowledge Check" },
  ] },
  { id: "lab", title: "Escalation Desk CTF", icon: "phone" },
];

// Lazy so a visitor to one section does not download every other
// section's prose and diagrams. SECTIONS stays eager — it is just
// metadata, and routing plus the drawer need it up front.
const COMPS = [
  lazy(() => import("./IntroSection")),
  lazy(() => import("./PsychologySection")),
  lazy(() => import("./HumanTargetsSection")),
  lazy(() => import("./AITargetsSection")),
  lazy(() => import("./CallCenterSection")),
  lazy(() => import("./CombinedSection")),
  lazy(() => import("./DefenseSection")),
  lazy(() => import("./LabSection")),
];

export { SECTIONS, COMPS };

export default function SocialEngineeringTraining() {
  return <TrainingShell sections={SECTIONS} sectionComponents={COMPS} moduleTitle="Social Engineering" topOffset={56} />;
}
