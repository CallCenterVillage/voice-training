# Call Center Village — Training Modules

Interactive training platform for voice security topics, built for [Call Center Village](https://callcentervillage.org). Three self-contained training modules covering voice cloning, voice agents, and social engineering.

## Modules

- **Voice Cloning** — Audio fundamentals, traditional voice modification, AI cloning tools (local & commercial), and detection/defense techniques.
- **Voice Agents** — Full-stack voice agent architecture (STT → LLM → TTS), LiveKit framework, building agents, and attack surface analysis.
- **Social Engineering** — Psychology of SE, attacks against humans and AI agents, call center scenarios, combined attack chains, and defense playbooks.

Each module includes interactive components: quizzes, expandable cards, pipeline diagrams, scenario simulations, and hands-on lab exercises.

## Tech Stack

- React 19 + Vite
- Heroicons for iconography
- No external CSS — all inline styles with a shared color system

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  components/       # Shared UI components
    colors.js        # Brand color constants (C object)
    Icon.jsx         # Heroicon wrapper component
    ProgressBar.jsx  # Section progress indicator
    CodeBlock.jsx    # Syntax-highlighted code display
    InteractiveCard.jsx  # Expandable content cards
    QuizBank.jsx     # Multi-question quiz component
    TrainingShell.jsx    # Module layout shell (header, nav, footer)
    index.js         # Barrel exports
  App.jsx            # Module switcher
  main.jsx           # Entry point

voice-cloning-training.jsx       # Voice Cloning module
voice-agents-training.jsx        # Voice Agents module
social-engineering-training.jsx  # Social Engineering module
```

## Build

```bash
npm run build    # Output in dist/
npm run preview  # Preview production build
```
