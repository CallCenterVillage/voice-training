import { lazy } from "react";
import TrainingShell from "../../components/TrainingShell";
import { toAnchorId } from "./_helpers";
// Data only. The components that render these lists are lazy below; the lists
// themselves are needed up front to build the "On this page" anchor links.
import { cliTools } from "./data/cliTools";
import { voiceTools } from "./data/voiceTools";
import { allProjectTools } from "./data/projectTools";
import { funTools } from "./data/funTools";
import { seResources } from "./data/seResources";
import { resources } from "./data/resources";
import { builtWithItems } from "./data/builtWithItems";

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
  { id: "bw-license", label: "License" },
  ...builtWithItems.map(t => ({ id: `bw-${toAnchorId(t.name)}`, label: t.name })),
];

const COMPS = [
  lazy(() => import("./IntroSection")),
  lazy(() => import("./CLIGlossarySection")),
  lazy(() => import("./VoiceGlossarySection")),
  lazy(() => import("./ProjectGlossarySection")),
  lazy(() => import("./FunToolsSection")),
  lazy(() => import("./AudioSection")),
  lazy(() => import("./SocialEngineeringResourcesSection")),
  lazy(() => import("./ResourcesSection")),
  lazy(() => import("./BuiltWithSection")),
  lazy(() => import("./ThankYouSection")),
];

export { SECTIONS, COMPS };

export default function AppendixTraining() {
  return <TrainingShell sections={SECTIONS} sectionComponents={COMPS} moduleTitle="Appendix" topOffset={56} />;
}
