import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { allQuizQuestions } from '../quizData';

describe('App Routing & Navigation', () => {
  beforeEach(() => {
    // Reset URL to default
    window.history.replaceState(null, '', '/voice-cloning/intro');
  });

  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('renders every module in the switcher', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: 'Module switcher' });
    const names = [...nav.querySelectorAll('button')].map(b => b.textContent);
    expect(names).toContain('Voice Cloning');
    expect(names).toContain('Voice Agents');
    expect(names).toContain('Social Engineering');
    expect(names).toContain('Knowledge Test');
    expect(names).toContain('Appendix');
  });

  // These navigate window.location, so they are links marked with aria-current,
  // not tabs. A tablist role would override the nav landmark and imply
  // arrow-key traversal that is not implemented.
  it('marks the active module with aria-current, not a tab role', () => {
    render(<App />);
    expect(screen.queryAllByRole('tab')).toHaveLength(0);

    const nav = screen.getByRole('navigation', { name: 'Module switcher' });
    const current = [...nav.querySelectorAll('[aria-current="page"]')];
    expect(current).toHaveLength(1);
    expect(current[0].textContent).toBe('Voice Cloning');
  });

  it('gives each route its own document title', () => {
    render(<App />);
    expect(document.title).toContain('Call Center Village');
    expect(document.title).toContain('Voice Cloning');
  });

  it('has focus-visible styles injected', () => {
    const { container } = render(<App />);
    const style = container.querySelector('style');
    expect(style).toBeTruthy();
    expect(style.textContent).toContain('focus-visible');
  });

  // QuizPage is code-split, so it arrives after the chunk resolves.
  it('renders quiz page at /quiz route', async () => {
    window.history.replaceState(null, '', '/quiz');
    render(<App />);
    const re = new RegExp(`${allQuizQuestions.length} questions from across the training`);
    expect(await screen.findByText(re)).toBeTruthy();
  });
});
