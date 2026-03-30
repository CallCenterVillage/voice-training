import { describe, it, expect } from 'vitest';
import { allQuizQuestions, getModuleQuestions, getSectionQuestions } from '../quizData';

describe('Quiz Data Integrity', () => {
  it('has questions', () => {
    expect(allQuizQuestions.length).toBeGreaterThan(50);
  });

  it('every question has required fields', () => {
    allQuizQuestions.forEach((q, i) => {
      expect(q.question, `Q${i + 1} missing question`).toBeTruthy();
      expect(q.options, `Q${i + 1} missing options`).toBeInstanceOf(Array);
      expect(q.options.length, `Q${i + 1} should have 4 options`).toBe(4);
      expect(q.correctIndex, `Q${i + 1} missing correctIndex`).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex, `Q${i + 1} correctIndex out of range`).toBeLessThan(q.options.length);
      expect(q.explanation, `Q${i + 1} missing explanation`).toBeTruthy();
      expect(q.module, `Q${i + 1} missing module`).toBeTruthy();
      expect(q.section, `Q${i + 1} missing section`).toBeTruthy();
    });
  });

  it('has no duplicate questions', () => {
    const seen = new Set();
    allQuizQuestions.forEach((q, i) => {
      expect(seen.has(q.question), `Q${i + 1} is a duplicate: "${q.question.slice(0, 50)}"`).toBe(false);
      seen.add(q.question);
    });
  });

  it('has no empty option strings', () => {
    allQuizQuestions.forEach((q, i) => {
      q.options.forEach((opt, j) => {
        expect(opt.trim().length, `Q${i + 1} option ${j} is empty`).toBeGreaterThan(0);
      });
    });
  });

  it('longest answer is correct less than 40% of the time', () => {
    let longestCorrect = 0;
    allQuizQuestions.forEach(q => {
      const lengths = q.options.map(o => o.length);
      const maxLen = Math.max(...lengths);
      if (lengths.indexOf(maxLen) === q.correctIndex) longestCorrect++;
    });
    const pct = longestCorrect / allQuizQuestions.length;
    expect(pct).toBeLessThan(0.4);
  });

  it('covers all three modules', () => {
    const modules = new Set(allQuizQuestions.map(q => q.module));
    expect(modules.has('Voice Cloning')).toBe(true);
    expect(modules.has('Voice Agents')).toBe(true);
    expect(modules.has('Social Engineering')).toBe(true);
  });

  it('getModuleQuestions returns correct subsets', () => {
    const vc = getModuleQuestions('Voice Cloning');
    const va = getModuleQuestions('Voice Agents');
    const se = getModuleQuestions('Social Engineering');

    expect(vc.length).toBeGreaterThan(0);
    expect(va.length).toBeGreaterThan(0);
    expect(se.length).toBeGreaterThan(0);
    expect(vc.length + va.length + se.length).toBe(allQuizQuestions.length);

    vc.forEach(q => expect(q.module).toBe('Voice Cloning'));
    va.forEach(q => expect(q.module).toBe('Voice Agents'));
    se.forEach(q => expect(q.module).toBe('Social Engineering'));
  });

  it('getSectionQuestions returns correct subsets', () => {
    const fundamentals = getSectionQuestions('Voice Cloning', 'Fundamentals');
    expect(fundamentals.length).toBeGreaterThan(0);
    fundamentals.forEach(q => {
      expect(q.module).toBe('Voice Cloning');
      expect(q.section).toBe('Fundamentals');
    });
  });

  it('every module has at least 3 sections with questions', () => {
    ['Voice Cloning', 'Voice Agents', 'Social Engineering'].forEach(mod => {
      const sections = new Set(getModuleQuestions(mod).map(q => q.section));
      expect(sections.size, `${mod} should have at least 3 sections`).toBeGreaterThanOrEqual(3);
    });
  });
});
