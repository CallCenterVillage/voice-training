import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { C } from '../components/colors';
import SectionDivider from '../components/SectionDivider';
import StarRating from '../components/StarRating';
import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';
import Lightbox from '../components/Lightbox';
import LightboxCardGrid from '../components/LightboxCardGrid';
import ServiceCardGrid from '../components/ServiceCardGrid';
import StaticCard from '../components/StaticCard';
import ProgressBar from '../components/ProgressBar';
import QuizBank from '../components/QuizBank';

describe('SectionDivider', () => {
  it('renders an hr element', () => {
    const { container } = render(<SectionDivider />);
    expect(container.querySelector('hr')).toBeTruthy();
  });
});

describe('StarRating', () => {
  it('renders correct number of stars', () => {
    const { container } = render(<StarRating rating={3} max={5} />);
    const stars = container.querySelectorAll('span[aria-hidden="true"]');
    expect(stars.length).toBe(5);
  });

  it('has accessible aria-label', () => {
    render(<StarRating rating={3} max={5} />);
    const el = screen.getByRole('img');
    expect(el).toHaveAttribute('aria-label', 'Rating: 3 out of 5');
  });

  it('shows correct filled vs empty stars', () => {
    const { container } = render(<StarRating rating={2} max={4} />);
    const stars = container.querySelectorAll('span[aria-hidden="true"]');
    expect(stars[0].textContent).toBe('★');
    expect(stars[1].textContent).toBe('★');
    expect(stars[2].textContent).toBe('☆');
    expect(stars[3].textContent).toBe('☆');
  });
});

describe('CodeBlock', () => {
  it('renders code content', () => {
    render(<CodeBlock code="echo hello" language="bash" />);
    expect(screen.getByText(/echo hello/)).toBeTruthy();
  });

  it('shows language label', () => {
    render(<CodeBlock code="print('hi')" language="python" />);
    expect(screen.getByText('python')).toBeTruthy();
  });

  it('has accessible region role', () => {
    const { container } = render(<CodeBlock code="test" language="bash" />);
    const region = container.querySelector('[role="region"]');
    expect(region).toBeTruthy();
    expect(region.getAttribute('aria-label')).toBe('Code block: bash');
  });

  it('highlights bash comments', () => {
    const { container } = render(<CodeBlock code="# this is a comment" language="bash" />);
    const commentSpan = container.querySelector(`span[style*="color"]`);
    expect(commentSpan).toBeTruthy();
  });

  it('highlights python keywords', () => {
    const { container } = render(<CodeBlock code="import os" language="python" />);
    // Should have a colored span for 'import'
    const spans = container.querySelectorAll('span');
    const importSpan = Array.from(spans).find(s => s.textContent === 'import');
    expect(importSpan).toBeTruthy();
  });
});

describe('InfoBox', () => {
  it('renders children', () => {
    render(<InfoBox>Test content</InfoBox>);
    expect(screen.getByText('Test content')).toBeTruthy();
  });
});

describe('Lightbox', () => {
  it('renders with dialog role', () => {
    render(<Lightbox onClose={() => {}}>Content</Lightbox>);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('renders children', () => {
    render(<Lightbox onClose={() => {}}>Test lightbox content</Lightbox>);
    expect(screen.getByText('Test lightbox content')).toBeTruthy();
  });

  it('has close button with aria-label', () => {
    render(<Lightbox onClose={() => {}}>Content</Lightbox>);
    const closeBtn = screen.getByLabelText('Close');
    expect(closeBtn).toBeTruthy();
  });

  it('calls onClose when Escape is pressed', () => {
    let closed = false;
    render(<Lightbox onClose={() => { closed = true; }}>Content</Lightbox>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(closed).toBe(true);
  });

  it('calls onClose when close button clicked', () => {
    let closed = false;
    render(<Lightbox onClose={() => { closed = true; }}>Content</Lightbox>);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(closed).toBe(true);
  });
});

describe('LightboxCardGrid', () => {
  const items = [
    { name: 'Item A', color: '#ff0000', desc: 'Description A' },
    { name: 'Item B', color: '#00ff00', desc: 'Description B' },
  ];

  it('renders all items', () => {
    render(<LightboxCardGrid items={items} />);
    expect(screen.getByText('Item A')).toBeTruthy();
    expect(screen.getByText('Item B')).toBeTruthy();
  });

  it('cards have role=button and are keyboard accessible', () => {
    render(<LightboxCardGrid items={items} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    buttons.forEach(btn => {
      expect(btn).toHaveAttribute('tabindex', '0');
    });
  });

  it('opens lightbox on click', () => {
    render(<LightboxCardGrid items={items} />);
    fireEvent.click(screen.getByLabelText('Item A'));
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('opens lightbox on Enter key', () => {
    render(<LightboxCardGrid items={items} />);
    fireEvent.keyDown(screen.getByLabelText('Item A'), { key: 'Enter' });
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});

describe('ServiceCardGrid', () => {
  const services = [
    { name: 'Service 1', url: 'https://example.com', logo: '/img.png', color: '#fff', desc: 'A service' },
  ];

  it('renders service name and description', () => {
    render(<ServiceCardGrid services={services} />);
    expect(screen.getByText(/Service 1/)).toBeTruthy();
    expect(screen.getByText('A service')).toBeTruthy();
  });

  it('renders external link with noopener noreferrer', () => {
    render(<ServiceCardGrid services={services} />);
    const link = screen.getByText(/Service 1/);
    expect(link.getAttribute('rel')).toContain('noopener');
    expect(link.getAttribute('target')).toBe('_blank');
  });
});

describe('StaticCard', () => {
  it('renders title and children', () => {
    render(<StaticCard title="Test Title">Card body</StaticCard>);
    expect(screen.getByText('Test Title')).toBeTruthy();
    expect(screen.getByText('Card body')).toBeTruthy();
  });
});

describe('ProgressBar', () => {
  it('renders correct number of segments', () => {
    const { container } = render(<ProgressBar current={2} total={5} onNavigate={() => {}} />);
    const buttons = container.querySelectorAll('[role="button"]');
    expect(buttons.length).toBe(5);
  });

  it('segments are keyboard accessible when onNavigate provided', () => {
    const { container } = render(<ProgressBar current={0} total={3} onNavigate={() => {}} />);
    const buttons = container.querySelectorAll('[role="button"]');
    buttons.forEach(btn => {
      expect(btn.getAttribute('tabindex')).toBe('0');
    });
  });

  it('calls onNavigate on click', () => {
    let navigatedTo = null;
    const { container } = render(<ProgressBar current={0} total={3} onNavigate={(i) => { navigatedTo = i; }} />);
    const buttons = container.querySelectorAll('[role="button"]');
    fireEvent.click(buttons[2]);
    expect(navigatedTo).toBe(2);
  });
});

describe('QuizBank', () => {
  const questions = [
    { question: 'What is 2+2?', options: ['3', '4', '5', '6'], correctIndex: 1, explanation: 'Basic math.' },
    { question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin', 'Madrid'], correctIndex: 1, explanation: 'Geography.' },
  ];

  it('renders the first question', () => {
    render(<QuizBank questions={questions} />);
    // One of the two questions should be visible (shuffled)
    const q1 = screen.queryByText('What is 2+2?');
    const q2 = screen.queryByText('What is the capital of France?');
    expect(q1 || q2).toBeTruthy();
  });

  it('shows question counter', () => {
    render(<QuizBank questions={questions} />);
    expect(screen.getByText(/Question 1 \/ 2/)).toBeTruthy();
  });

  it('shows answer options', () => {
    render(<QuizBank questions={questions} />);
    const buttons = screen.getAllByRole('button');
    // Should have at least 4 answer buttons + reset button
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('renders quiz wrapper with heading', () => {
    render(<QuizBank questions={questions} />);
    expect(screen.getByText(/Check Your Understanding/)).toBeTruthy();
  });
});
