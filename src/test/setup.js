import '@testing-library/jest-dom';

// Mock window.scrollTo
window.scrollTo = () => {};

// Mock scrollIntoView — not implemented in jsdom
Element.prototype.scrollIntoView = () => {};

// Mock matchMedia — not implemented in jsdom. Defaults to "no match", i.e. desktop.
// Tests that need a mobile viewport override this per-test.
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
});

// Mock history.pushState/replaceState
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;
history.pushState = (...args) => { try { originalPushState.apply(history, args); } catch {} };
history.replaceState = (...args) => { try { originalReplaceState.apply(history, args); } catch {} };

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = MockIntersectionObserver;

// Mock AudioContext for WaveformPlayer
window.AudioContext = class {
  createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { value: 0 } }; }
  createGain() { return { connect() {}, gain: { value: 0 } }; }
  createAnalyser() { return { connect() {}, fftSize: 0, getByteFrequencyData() {} }; }
  get destination() { return {}; }
  close() {}
  decodeAudioData() { return Promise.resolve({}); }
};
