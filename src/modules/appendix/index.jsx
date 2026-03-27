import { TrainingShell } from "../../components";
import { toAnchorId } from "./_helpers";
import IntroSection from "./IntroSection";
import CLIGlossarySection, { cliTools } from "./CLIGlossarySection";
import VoiceGlossarySection, { voiceTools } from "./VoiceGlossarySection";
import ProjectGlossarySection, { allProjectTools } from "./ProjectGlossarySection";
import FunToolsSection, { funTools } from "./FunToolsSection";
import AudioSection from "./AudioSection";
import SocialEngineeringResourcesSection, { seResources } from "./SocialEngineeringResourcesSection";
import ResourcesSection, { resources } from "./ResourcesSection";
import BuiltWithSection, { builtWithItems } from "./BuiltWithSection";
import ThankYouSection from "./ThankYouSection";

const sortByLabel = (a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" });

const SECTIONS = [
  { id: "intro", title: "Welcome", icon: "book" },
  { id: "cli-glossary", title: "CLI Tool Glossary", icon: "command-line" },
  { id: "voice-glossary", title: "Voice Tool Glossary", icon: "microphone" },
  { id: "project-glossary", title: "AI Tool Glossary", icon: "cpu" },
  { id: "fun-tools", title: "Other Tools", icon: "star" },
  { id: "audio", title: "Audio Tips", icon: "speaker-wave", anchors: [
    { id: "dtmf-table", label: "DTMF Frequency Table" },
    { id: "dtmf", label: "DTMF Tone Generation" },
    { id: "telephone-tones", label: "Telephone Tones" },
    { id: "yt-dlp", label: "Extracting Audio (yt-dlp)" },
  ] },
  { id: "se-resources", title: "Social Engineering", icon: "magnifying-glass" },
  { id: "resources", title: "Additional Resources", icon: "book" },
  { id: "project-credits", title: "Project Credits", icon: "code-bracket" },
  { id: "thank-you", title: "Thank You", icon: "heart", anchors: [
    { id: "the-conferences", label: "The Conferences" },
    { id: "the-people", label: "The People" },
    { id: "the-customers", label: "The Customers" },
    { id: "the-sponsors", label: "The Sponsors" },
  ] },
];

// Set anchors dynamically from data arrays
SECTIONS[1].anchors = cliTools.map(t => ({ id: `cli-${toAnchorId(t.name)}`, label: t.name })).sort(sortByLabel);
SECTIONS[2].anchors = voiceTools.map(t => ({ id: `voice-${toAnchorId(t.name)}`, label: t.name })).sort(sortByLabel);
SECTIONS[3].anchors = allProjectTools.map(t => ({ id: `tool-${toAnchorId(t.name)}`, label: t.name })).sort(sortByLabel);
SECTIONS[4].anchors = funTools.map(t => ({ id: `fun-${toAnchorId(t.name)}`, label: t.name }));
// SECTIONS[5] = Audio Tips — anchors defined inline
SECTIONS[6].anchors = seResources.map(r => ({ id: `se-${toAnchorId(r.name)}`, label: r.name })).sort(sortByLabel);
SECTIONS[7].anchors = resources.flatMap(g => g.items.map(r => ({ id: `res-${toAnchorId(r.name)}`, label: r.name }))).sort(sortByLabel);
SECTIONS[8].anchors = [
  { id: "bw-ai-disclosure", label: "AI Disclosure" },
  { id: "bw-getting-started", label: "Getting Started" },
  ...builtWithItems.map(t => ({ id: `bw-${toAnchorId(t.name)}`, label: t.name })),
];

const COMPS = [IntroSection, CLIGlossarySection, VoiceGlossarySection, ProjectGlossarySection, FunToolsSection, AudioSection, SocialEngineeringResourcesSection, ResourcesSection, BuiltWithSection, ThankYouSection];

export { SECTIONS, COMPS };

export default function AppendixTraining() {
  return <TrainingShell sections={SECTIONS} sectionComponents={COMPS} moduleTitle="Appendix" topOffset={48} />;
}
