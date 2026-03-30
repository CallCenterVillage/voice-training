// Static search index — built at build time by Vite, not at runtime.
// Imports structured data from all modules and flattens into a searchable array.

import { SECTIONS as VC_SECTIONS } from "./modules/voice-cloning";
import { SECTIONS as VA_SECTIONS } from "./modules/voice-agents";
import { SECTIONS as SE_SECTIONS } from "./modules/social-engineering";
import { SECTIONS as AP_SECTIONS } from "./modules/appendix";
import { allQuizQuestions } from "./quizData";
import { resources } from "./modules/appendix/ResourcesSection";
import { seResources } from "./modules/appendix/SocialEngineeringResourcesSection";
import { cliTools } from "./modules/appendix/CLIGlossarySection";
import { voiceTools } from "./modules/appendix/VoiceGlossarySection";
import { allProjectTools } from "./modules/appendix/ProjectGlossarySection";
import { funTools } from "./modules/appendix/FunToolsSection";
import { toAnchorId } from "./modules/appendix/_helpers";

const MODULE_MAP = [
  { slug: "voice-cloning", name: "Voice Cloning", sections: VC_SECTIONS },
  { slug: "voice-agents", name: "Voice Agents", sections: VA_SECTIONS },
  { slug: "social-engineering", name: "Social Engineering", sections: SE_SECTIONS },
  { slug: "appendix", name: "Appendix", sections: AP_SECTIONS },
];

const entries = [];

// 1. Sections and anchors
MODULE_MAP.forEach(mod => {
  mod.sections.forEach((section, sectionIndex) => {
    entries.push({
      text: `${section.title} ${mod.name}`.toLowerCase(),
      label: section.title,
      category: "Section",
      module: mod.name,
      route: { moduleSlug: mod.slug, sectionIndex },
    });

    if (section.anchors) {
      section.anchors.forEach(anchor => {
        if (anchor.id === "knowledge-check") return; // skip generic anchors
        entries.push({
          text: `${anchor.label} ${section.title} ${mod.name}`.toLowerCase(),
          label: anchor.label,
          category: "Section",
          module: mod.name,
          route: { moduleSlug: mod.slug, sectionIndex, anchor: anchor.id },
        });
      });
    }
  });
});

// 2. Quiz questions
allQuizQuestions.forEach(q => {
  entries.push({
    text: `${q.question} ${q.module} ${q.section}`.toLowerCase(),
    label: q.question.length > 80 ? q.question.slice(0, 77) + "..." : q.question,
    category: "Quiz",
    module: q.module,
    route: { moduleSlug: "quiz", sectionIndex: 0 },
  });
});

// 3. Resources
resources.forEach(group => {
  group.items.forEach(r => {
    entries.push({
      text: `${r.name} ${r.desc} ${group.category}`.toLowerCase(),
      label: r.name,
      category: "Resource",
      module: "Appendix",
      route: { moduleSlug: "appendix", sectionIndex: AP_SECTIONS.findIndex(s => s.id === "resources"), anchor: `res-${toAnchorId(r.name)}` },
    });
  });
});

// 4. SE Resources
seResources.forEach(r => {
  entries.push({
    text: `${r.name} ${r.desc}`.toLowerCase(),
    label: r.name,
    category: "Resource",
    module: "Appendix",
    route: { moduleSlug: "appendix", sectionIndex: AP_SECTIONS.findIndex(s => s.id === "se-resources"), anchor: `se-${toAnchorId(r.name)}` },
  });
});

// 5. Tool glossaries
const toolSets = [
  { tools: cliTools, sectionId: "cli-glossary", prefix: "cli" },
  { tools: voiceTools, sectionId: "voice-glossary", prefix: "voice" },
  { tools: allProjectTools, sectionId: "project-glossary", prefix: "tool" },
  { tools: funTools, sectionId: "fun-tools", prefix: "fun" },
];

toolSets.forEach(({ tools, sectionId, prefix }) => {
  const sectionIndex = AP_SECTIONS.findIndex(s => s.id === sectionId);
  tools.forEach(t => {
    entries.push({
      text: `${t.name} ${t.desc || ""}`.toLowerCase(),
      label: t.name,
      category: "Tool",
      module: "Appendix",
      route: { moduleSlug: "appendix", sectionIndex, anchor: `${prefix}-${toAnchorId(t.name)}` },
    });
  });
});

export const SEARCH_INDEX = entries;
