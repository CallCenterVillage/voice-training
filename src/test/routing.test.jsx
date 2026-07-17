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

  it('renders module navigation tabs', () => {
    render(<App />);
    const tabs = screen.getAllByRole('tab');
    const tabNames = tabs.map(t => t.textContent);
    expect(tabNames).toContain('Voice Cloning');
    expect(tabNames).toContain('Voice Agents');
    expect(tabNames).toContain('Social Engineering');
    expect(tabNames).toContain('Knowledge Test');
    expect(tabNames).toContain('Appendix');
  });

  it('has navigation with tablist role', () => {
    render(<App />);
    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeTruthy();
  });

  it('has focus-visible styles injected', () => {
    const { container } = render(<App />);
    const style = container.querySelector('style');
    expect(style).toBeTruthy();
    expect(style.textContent).toContain('focus-visible');
  });

  it('renders quiz page at /quiz route', () => {
    window.history.replaceState(null, '', '/quiz');
    render(<App />);
    const re = new RegExp(`${allQuizQuestions.length} questions from across the training`);
    expect(screen.getByText(re)).toBeTruthy();
  });
});
