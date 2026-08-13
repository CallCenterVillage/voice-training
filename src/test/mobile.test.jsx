import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TrainingShell from '../components/TrainingShell';
import App from '../App';

const realMatchMedia = window.matchMedia;

// Only width queries answer to the viewport; prefers-reduced-motion must stay false.
const setViewport = ({ mobile }) => {
  window.matchMedia = (query) => ({
    matches: mobile && query.includes('max-width'),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
};

const SECTIONS = [
  { id: 'one', title: 'Section One' },
  { id: 'two', title: 'Section Two' },
];
const COMPS = [() => <div>content one</div>, () => <div>content two</div>];

const renderShell = (props = {}) =>
  render(
    <TrainingShell
      sections={SECTIONS}
      sectionComponents={COMPS}
      moduleTitle="Test Module"
      topOffset={48}
      currentSection={0}
      onNavigate={vi.fn()}
      {...props}
    />
  );

const drawer = () => document.getElementById('sections-drawer');
const isDrawerOpen = () => drawer().style.transform === 'translateX(0)';

afterEach(() => { window.matchMedia = realMatchMedia; });

describe('TrainingShell — mobile', () => {
  beforeEach(() => setViewport({ mobile: true }));

  it('starts with the drawer closed', () => {
    renderShell();
    expect(isDrawerOpen()).toBe(false);
  });

  it('overlays rather than pushing content when open', () => {
    const { container } = renderShell();
    fireEvent.click(screen.getByLabelText('Sections menu'));
    expect(isDrawerOpen()).toBe(true);

    // No element may reserve a 260px gutter — that is what crushed content to ~115px.
    const pushed = [...container.querySelectorAll('div')]
      .filter(d => d.style.marginRight && d.style.marginRight !== '0px');
    expect(pushed).toHaveLength(0);
  });

  it('closes the drawer after choosing a section', () => {
    const onNavigate = vi.fn();
    renderShell({ onNavigate });
    fireEvent.click(screen.getByLabelText('Sections menu'));
    expect(isDrawerOpen()).toBe(true);

    fireEvent.click(screen.getByText('Section Two'));
    expect(onNavigate).toHaveBeenCalledWith(1);
    expect(isDrawerOpen()).toBe(false);
  });

  it('closes the drawer when the scrim is tapped', () => {
    renderShell();
    fireEvent.click(screen.getByLabelText('Sections menu'));
    const scrim = document.querySelector('[aria-hidden="true"][style*="position: fixed"]');
    expect(scrim).toBeTruthy();
    fireEvent.click(scrim);
    expect(isDrawerOpen()).toBe(false);
  });

  it('drops the wordmark but keeps the module title', () => {
    renderShell();
    expect(screen.queryByText('CALL CENTER VILLAGE')).toBeNull();
    expect(screen.getByText('Test Module')).toBeTruthy();
  });
});

describe('TrainingShell — desktop', () => {
  beforeEach(() => setViewport({ mobile: false }));

  it('starts with the drawer open and pushes content', () => {
    const { container } = renderShell();
    expect(isDrawerOpen()).toBe(true);
    const pushed = [...container.querySelectorAll('div')]
      .filter(d => d.style.marginRight === '260px');
    expect(pushed.length).toBeGreaterThan(0);
  });

  it('keeps the wordmark', () => {
    renderShell();
    expect(screen.getByText('CALL CENTER VILLAGE')).toBeTruthy();
  });

  it('has no scrim', () => {
    renderShell();
    expect(document.querySelector('[aria-hidden="true"][style*="rgba(0, 0, 0, 0.5)"]')).toBeNull();
  });
});

describe('App nav — mobile', () => {
  beforeEach(() => {
    setViewport({ mobile: true });
    window.history.replaceState(null, '', '/voice-cloning/intro');
  });

  it('keeps every module reachable, including Appendix', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: 'Module switcher' });
    const labels = [...nav.querySelectorAll('button')].map(t => t.textContent);
    expect(labels).toContain('Voice Cloning');
    expect(labels).toContain('Voice Agents');
    expect(labels).toContain('Social Engineering');
    expect(labels).toContain('Knowledge Test');
    expect(labels).toContain('Appendix');
  });

  it('does not take the search cluster out of flow', () => {
    const { container } = render(<App />);
    const nav = container.querySelector('nav[aria-label="Module switcher"]');
    const absolute = [...nav.querySelectorAll('div')]
      .filter(d => d.style.position === 'absolute');
    expect(absolute).toHaveLength(0);
  });

  it('collapses the search button to an icon', () => {
    render(<App />);
    const search = screen.getByLabelText('Search');
    expect(search.textContent).toBe('');
    expect(search.style.minWidth).not.toBe('160px');
  });
});
