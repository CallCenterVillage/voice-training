import { useState } from "react";
import { C } from "./components";
import VoiceCloning from "../voice-cloning-training.jsx";
import VoiceAgents from "../voice-agents-training.jsx";
import SocialEngineering from "../social-engineering-training.jsx";

const modules = [
  { name: "Voice Cloning", component: VoiceCloning },
  { name: "Voice Agents", component: VoiceAgents },
  { name: "Social Engineering", component: SocialEngineering },
];

export default function App() {
  const [active, setActive] = useState(0);
  const Module = modules[active].component;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <nav aria-label="Module switcher" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
        background: `${C.bg}ee`, borderBottom: `1px solid ${C.border}`,
        padding: "8px 16px", display: "flex", gap: 8, justifyContent: "center",
        backdropFilter: "blur(10px)",
      }} role="tablist">
        {modules.map((m, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            role="tab"
            aria-selected={i === active}
            style={{
              background: i === active ? C.primary : "transparent",
              border: `1px solid ${i === active ? C.primary : C.border}`,
              borderRadius: 6, padding: "8px 20px",
              color: i === active ? "#fff" : C.muted,
              cursor: "pointer", fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
              fontSize: 14, fontWeight: 600,
            }}
          >
            {m.name}
          </button>
        ))}
      </nav>
      <main style={{ paddingTop: 48 }}>
        <Module />
      </main>
    </div>
  );
}
