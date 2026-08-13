import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SearchModal from '../components/SearchModal';

// Rows are listbox options. Asserting on the ARIA contract rather than on
// inline padding/background keeps these tests from breaking on restyling.
const rowsOf = (c) => [...c.querySelectorAll('[role="option"]')];

const selectedIndex = (c) => rowsOf(c).findIndex(r => r.getAttribute('aria-selected') === 'true');

const renderModal = (props = {}) =>
  render(<SearchModal onClose={vi.fn()} onNavigate={vi.fn()} {...props} />);

// The search index is imported dynamically so it stays out of the initial
// bundle, so every query has to wait for that chunk to resolve.
const search = async (container, value) => {
  const input = container.querySelector('input');
  fireEvent.change(input, { target: { value } });
  await waitFor(() => expect(rowsOf(container).length).toBeGreaterThan(0));
  return input;
};

describe('SearchModal', () => {
  it('shows no results until the query reaches 2 characters', async () => {
    const { container } = renderModal();
    const input = container.querySelector('input');

    fireEvent.change(input, { target: { value: 'v' } });
    expect(rowsOf(container).length).toBe(0);

    await search(container, 'voice');
    expect(rowsOf(container).length).toBeGreaterThan(0);
  });

  it('moves the highlight with the arrow keys', async () => {
    const { container } = renderModal();
    const input = await search(container, 'voice');

    expect(selectedIndex(container)).toBe(0);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(selectedIndex(container)).toBe(1);
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(selectedIndex(container)).toBe(0);
  });

  it('does not move the highlight above the first row', async () => {
    const { container } = renderModal();
    const input = await search(container, 'voice');

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(selectedIndex(container)).toBe(0);
  });

  it('resets the highlight to the first row when the query changes', async () => {
    const { container } = renderModal();
    const input = await search(container, 'voice');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(selectedIndex(container)).toBe(2);

    // A stale highlight can point past the end of a narrowed result set.
    await search(container, 'voice cloning');
    expect(selectedIndex(container)).toBe(0);
  });

  it('navigates to the highlighted result on Enter', async () => {
    const onNavigate = vi.fn();
    const onClose = vi.fn();
    const { container } = renderModal({ onNavigate, onClose });
    const input = await search(container, 'voice');

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
