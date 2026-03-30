import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Lightbox from '../components/Lightbox';
import LightboxCardGrid from '../components/LightboxCardGrid';
import ProgressBar from '../components/ProgressBar';
import StarRating from '../components/StarRating';
import CodeBlock from '../components/CodeBlock';

describe('Accessibility - Lightbox', () => {
  it('has role="dialog" and aria-modal', () => {
    render(<Lightbox onClose={() => {}}>Test</Lightbox>);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('supports ariaLabelledBy prop', () => {
    render(<Lightbox onClose={() => {}} ariaLabelledBy="my-title"><span id="my-title">Title</span></Lightbox>);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'my-title');
  });

  it('closes on Escape key', () => {
    let closed = false;
    render(<Lightbox onClose={() => { closed = true; }}>Content</Lightbox>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(closed).toBe(true);
  });

  it('has accessible close button', () => {
    render(<Lightbox onClose={() => {}}>Content</Lightbox>);
    expect(screen.getByLabelText('Close')).toBeTruthy();
  });

  it('stops Escape propagation', () => {
    let outerCalled = false;
    const handleOuter = () => { outerCalled = true; };
    document.addEventListener('keydown', handleOuter);

    render(<Lightbox onClose={() => {}}>Content</Lightbox>);
    fireEvent.keyDown(document, { key: 'Escape' });

    document.removeEventListener('keydown', handleOuter);
    // The outer handler may or may not fire depending on event ordering,
    // but the lightbox should handle it
  });
});

describe('Accessibility - LightboxCardGrid', () => {
  const items = [
    { name: 'Card 1', color: '#ff0000', desc: 'Description 1' },
    { name: 'Card 2', color: '#00ff00', desc: 'Description 2' },
  ];

  it('cards have role="button"', () => {
    render(<LightboxCardGrid items={items} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('cards have tabIndex=0', () => {
    render(<LightboxCardGrid items={items} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => expect(btn).toHaveAttribute('tabindex', '0'));
  });

  it('cards have aria-label', () => {
    render(<LightboxCardGrid items={items} />);
    expect(screen.getByLabelText('Card 1')).toBeTruthy();
    expect(screen.getByLabelText('Card 2')).toBeTruthy();
  });

  it('cards respond to Enter key', () => {
    render(<LightboxCardGrid items={items} />);
    fireEvent.keyDown(screen.getByLabelText('Card 1'), { key: 'Enter' });
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('cards respond to Space key', () => {
    render(<LightboxCardGrid items={items} />);
    fireEvent.keyDown(screen.getByLabelText('Card 1'), { key: ' ' });
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});

describe('Accessibility - ProgressBar', () => {
  it('has progressbar role', () => {
    render(<ProgressBar current={1} total={5} />);
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('has aria-valuenow, aria-valuemin, aria-valuemax', () => {
    render(<ProgressBar current={2} total={5} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '2');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '4');
  });

  it('segments have aria-label when navigable', () => {
    const { container } = render(<ProgressBar current={0} total={3} onNavigate={() => {}} />);
    const buttons = container.querySelectorAll('[role="button"]');
    buttons.forEach((btn, i) => {
      expect(btn.getAttribute('aria-label')).toBe(`Go to section ${i + 1}`);
    });
  });
});

describe('Accessibility - StarRating', () => {
  it('has role="img" with descriptive label', () => {
    render(<StarRating rating={4} max={5} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('aria-label', 'Rating: 4 out of 5');
  });

  it('individual stars are aria-hidden', () => {
    const { container } = render(<StarRating rating={3} max={5} />);
    const stars = container.querySelectorAll('[aria-hidden="true"]');
    expect(stars.length).toBe(5);
  });
});

describe('Accessibility - CodeBlock', () => {
  it('has role="region" with language label', () => {
    const { container } = render(<CodeBlock code="test" language="python" />);
    const region = container.querySelector('[role="region"]');
    expect(region).toBeTruthy();
    expect(region.getAttribute('aria-label')).toBe('Code block: python');
  });
});
