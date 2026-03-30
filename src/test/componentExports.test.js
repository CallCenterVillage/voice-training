import { describe, it, expect } from 'vitest';
import * as components from '../components';

describe('Component Index Exports', () => {
  const expectedExports = [
    'C',
    'ProgressBar',
    'CodeBlock',
    'QuizBank',
    'TrainingShell',
    'Icon',
    'InfoBox',
    'NextModuleLink',
    'StarRating',
    'WaveformPlayer',
    'SectionDivider',
    'Lightbox',
    'StaticCard',
    'LightboxCardGrid',
    'ServiceCardGrid',
  ];

  expectedExports.forEach(name => {
    it(`exports ${name}`, () => {
      expect(components[name], `${name} not exported from components/index.js`).toBeTruthy();
    });
  });

  it('does not export InteractiveCard (removed)', () => {
    expect(components.InteractiveCard).toBeUndefined();
  });

  it('C contains all color tokens', () => {
    const requiredColors = ['primary', 'secondary', 'tertiary', 'accent', 'highlight', 'bg', 'card', 'border', 'text', 'muted', 'dim', 'headerBg', 'codeBg'];
    requiredColors.forEach(key => {
      expect(components.C[key], `C.${key} missing`).toBeTruthy();
    });
  });
});
