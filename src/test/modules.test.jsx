import { describe, it, expect } from 'vitest';

// Test module structure and exports
describe('Module Exports', () => {
  it('voice-cloning exports SECTIONS and COMPS', async () => {
    const mod = await import('../modules/voice-cloning/index.jsx');
    expect(mod.SECTIONS).toBeInstanceOf(Array);
    expect(mod.COMPS).toBeInstanceOf(Array);
    expect(mod.SECTIONS.length).toBe(mod.COMPS.length);
    expect(mod.SECTIONS.length).toBeGreaterThan(0);
  });

  it('voice-agents exports SECTIONS and COMPS', async () => {
    const mod = await import('../modules/voice-agents/index.jsx');
    expect(mod.SECTIONS).toBeInstanceOf(Array);
    expect(mod.COMPS).toBeInstanceOf(Array);
    expect(mod.SECTIONS.length).toBe(mod.COMPS.length);
  });

  it('social-engineering exports SECTIONS and COMPS', async () => {
    const mod = await import('../modules/social-engineering/index.jsx');
    expect(mod.SECTIONS).toBeInstanceOf(Array);
    expect(mod.COMPS).toBeInstanceOf(Array);
    expect(mod.SECTIONS.length).toBe(mod.COMPS.length);
  });

  it('appendix exports SECTIONS and COMPS', async () => {
    const mod = await import('../modules/appendix/index.jsx');
    expect(mod.SECTIONS).toBeInstanceOf(Array);
    expect(mod.COMPS).toBeInstanceOf(Array);
    expect(mod.SECTIONS.length).toBe(mod.COMPS.length);
  });
});

describe('Module Section Structure', () => {
  it('every section has id and title', async () => {
    const modules = [
      await import('../modules/voice-cloning/index.jsx'),
      await import('../modules/voice-agents/index.jsx'),
      await import('../modules/social-engineering/index.jsx'),
      await import('../modules/appendix/index.jsx'),
    ];

    modules.forEach(mod => {
      mod.SECTIONS.forEach(section => {
        expect(section.id, `Section missing id`).toBeTruthy();
        expect(section.title, `Section ${section.id} missing title`).toBeTruthy();
      });
    });
  });

  // Sections are code-split, so COMPS holds React.lazy objects rather than
  // plain function components.
  it('every section component is a renderable component type', async () => {
    const modules = [
      await import('../modules/voice-cloning/index.jsx'),
      await import('../modules/voice-agents/index.jsx'),
      await import('../modules/social-engineering/index.jsx'),
      await import('../modules/appendix/index.jsx'),
    ];

    const LAZY = Symbol.for('react.lazy');
    modules.forEach(mod => {
      mod.COMPS.forEach((Comp, i) => {
        const ok = typeof Comp === 'function' || (Comp && Comp.$$typeof === LAZY);
        expect(ok, `Component ${i} is neither a function nor a lazy component`).toBe(true);
      });
    });
  });

  it('sections with anchors have valid anchor objects', async () => {
    const modules = [
      await import('../modules/voice-cloning/index.jsx'),
      await import('../modules/voice-agents/index.jsx'),
      await import('../modules/social-engineering/index.jsx'),
      await import('../modules/appendix/index.jsx'),
    ];

    modules.forEach(mod => {
      mod.SECTIONS.forEach(section => {
        if (section.anchors) {
          expect(section.anchors).toBeInstanceOf(Array);
          section.anchors.forEach(anchor => {
            expect(anchor.id, `Anchor in ${section.id} missing id`).toBeTruthy();
            expect(anchor.label, `Anchor ${anchor.id} in ${section.id} missing label`).toBeTruthy();
          });
        }
      });
    });
  });

  it('knowledge-check anchors exist in training modules', async () => {
    const voiceAgents = await import('../modules/voice-agents/index.jsx');
    const socialEng = await import('../modules/social-engineering/index.jsx');

    // Voice agents - check sections that should have knowledge-check
    const vaSectionsWithQuiz = ['stt', 'brain', 'tts', 'livekit', 'building', 'attack-surface'];
    vaSectionsWithQuiz.forEach(sectionId => {
      const section = voiceAgents.SECTIONS.find(s => s.id === sectionId);
      expect(section, `Voice agents section ${sectionId} not found`).toBeTruthy();
      if (section.anchors) {
        const hasKC = section.anchors.some(a => a.id === 'knowledge-check');
        expect(hasKC, `Voice agents ${sectionId} missing knowledge-check anchor`).toBe(true);
      }
    });

    // Social engineering
    const seSectionsWithQuiz = ['human-targets', 'ai-targets', 'call-center', 'combined', 'defense'];
    seSectionsWithQuiz.forEach(sectionId => {
      const section = socialEng.SECTIONS.find(s => s.id === sectionId);
      expect(section, `Social eng section ${sectionId} not found`).toBeTruthy();
      if (section.anchors) {
        const hasKC = section.anchors.some(a => a.id === 'knowledge-check');
        expect(hasKC, `Social eng ${sectionId} missing knowledge-check anchor`).toBe(true);
      }
    });
  });
});
