import { describe, it, expect } from 'vitest';
import { C } from '../components/colors';

// Calculate relative luminance per WCAG 2.1
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1, hex2) {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Color System', () => {
  it('exports all required color tokens', () => {
    const required = ['primary', 'secondary', 'tertiary', 'accent', 'highlight', 'bg', 'card', 'border', 'text', 'muted', 'dim', 'headerBg', 'codeBg'];
    required.forEach(key => {
      expect(C[key], `Missing color token: ${key}`).toBeTruthy();
      expect(C[key], `${key} should be a hex color`).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it('text color has sufficient contrast against background (WCAG AA)', () => {
    const ratio = contrastRatio(C.text, C.bg);
    expect(ratio, `C.text (${C.text}) vs C.bg (${C.bg}) ratio ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
  });

  it('muted text has sufficient contrast against background (WCAG AA)', () => {
    const ratio = contrastRatio(C.muted, C.bg);
    expect(ratio, `C.muted (${C.muted}) vs C.bg (${C.bg}) ratio ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
  });

  it('dim text has sufficient contrast against background (WCAG AA)', () => {
    const ratio = contrastRatio(C.dim, C.bg);
    expect(ratio, `C.dim (${C.dim}) vs C.bg (${C.bg}) ratio ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
  });

  it('accent color has sufficient contrast against background', () => {
    const ratio = contrastRatio(C.accent, C.bg);
    expect(ratio, `C.accent (${C.accent}) vs C.bg (${C.bg}) ratio ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
  });

  it('text color has sufficient contrast against card background', () => {
    const ratio = contrastRatio(C.text, C.card);
    expect(ratio, `C.text vs C.card ratio ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
  });

  it('muted text has sufficient contrast against card background', () => {
    const ratio = contrastRatio(C.muted, C.card);
    expect(ratio, `C.muted vs C.card ratio ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
  });
});
