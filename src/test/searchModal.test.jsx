import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import SearchModal from '../components/SearchModal';

// Result rows are the only pointer-cursor rows with this padding.
const rowsOf = (c) => [...c.querySelectorAll('div')]
  .filter(d => d.style.cursor === 'pointer' && d.style.padding === '10px 20px');

// The highlighted row is the one with a non-transparent background.
const selectedIndex = (c) => rowsOf(c).findIndex(r => r.style.background !== 'transparent');

const renderModal = (props = {}) =>
  render(<SearchModal onClose={vi.fn()} onNavigate={vi.fn()} {...props} />);

describe('SearchModal', () => {
  it('shows no results until the query reaches 2 characters', () => {
    const { container } = renderModal();
    const input = container.querySelector('input');

    fireEvent.change(input, { target: { value: 'v' } });
    expect(rowsOf(container).length).toBe(0);

    fireEvent.change(input, { target: { value: 'voice' } });
    expect(rowsOf(container).length).toBeGreaterThan(0);
  });

  it('moves the highlight with the arrow keys', () => {
    const { container } = renderModal();
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: 'voice' } });

    expect(selectedIndex(container)).toBe(0);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(selectedIndex(container)).toBe(1);
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(selectedIndex(container)).toBe(0);
  });

  it('does not move the highlight above the first row', () => {
    const { container } = renderModal();
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: 'voice' } });

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(selectedIndex(container)).toBe(0);
  });

  it('resets the highlight to the first row when the query changes', () => {
    const { container } = renderModal();
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: 'voice' } });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(selectedIndex(container)).toBe(2);

    // A stale highlight can point past the end of a narrowed result set.
    fireEvent.change(input, { target: { value: 'voice cloning' } });
    expect(selectedIndex(container)).toBe(0);
  });

  it('navigates to the highlighted result on Enter', () => {
    const onNavigate = vi.fn();
    const onClose = vi.fn();
    const { container } = renderModal({ onNavigate, onClose });
    const input = container.querySelector('input');

    fireEvent.change(input, { target: { value: 'voice' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    const { container } = renderModal({ onClose });
    fireEvent.keyDown(container.querySelector('input'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
