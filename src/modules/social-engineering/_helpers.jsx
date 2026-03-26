import { useState } from "react";
import { C, Icon, StaticCard, SectionDivider } from "../../components";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export { StaticCard, SectionDivider };

export const ScenarioSim = ({ title, setup, turns, lesson }) => {
  const [currentTurn, setCurrentTurn] = useState(0);
  const [showLesson, setShowLesson] = useState(false);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.secondary}33`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.secondary, marginBottom: 8 }}><Icon name="user-group" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />{title}</div>
      <div style={{ fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.6, fontStyle: "italic" }}>{setup}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {turns.slice(0, currentTurn + 1).map((turn, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, alignItems: "flex-start",
            flexDirection: turn.role === "attacker" ? "row" : "row-reverse",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
              background: turn.role === "attacker" ? `${C.secondary}20` : turn.role === "agent" ? `${C.highlight}20` : `${C.accent}20`,
            }}>
              {turn.role === "attacker" ? <Icon name="user-group" size={16} /> : turn.role === "agent" ? <Icon name="command-line" size={16} /> : <Icon name="user" size={16} />}
            </div>
            <div style={{
              background: C.codeBg, borderRadius: 10, padding: "10px 14px", maxWidth: "75%",
              border: `1px solid ${turn.role === "attacker" ? `${C.secondary}22` : turn.role === "agent" ? `${C.highlight}22` : `${C.accent}22`}`,
            }}>
              <div style={{ fontSize: 12, color: turn.role === "attacker" ? C.secondary : turn.role === "agent" ? C.highlight : C.accent, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>
                {turn.role === "attacker" ? "Attacker" : turn.role === "agent" ? "AI Agent" : "Human Target"}
              </div>
              <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>{turn.text}</div>
              {turn.annotation && (
                <div style={{ fontSize: 14, color: C.secondary, marginTop: 6, fontStyle: "italic", borderTop: `1px solid ${C.border}`, paddingTop: 6 }}>
                  <Icon name="bolt" size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }} />{turn.annotation}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {currentTurn < turns.length - 1 ? (
          <button onClick={() => setCurrentTurn(currentTurn + 1)} style={{ background: `${C.secondary}20`, border: `1px solid ${C.secondary}44`, borderRadius: 8, padding: "8px 16px", color: C.secondary, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600 }}>
            <Icon name="play" size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }} />Next Turn ({currentTurn + 1}/{turns.length})
          </button>
        ) : (
          <button onClick={() => setShowLesson(!showLesson)} style={{ background: `${C.accent}20`, border: `1px solid ${C.accent}44`, borderRadius: 8, padding: "8px 16px", color: C.accent, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600 }}>
            {showLesson ? "Hide Lesson" : <><Icon name="academic" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />Show Lesson</>}
          </button>
        )}
        {currentTurn > 0 && (
          <button onClick={() => { setCurrentTurn(0); setShowLesson(false); }} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", color: C.dim, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>
            <ArrowPathIcon style={{ width: 14, height: 14 }} aria-hidden="true" /> Replay
          </button>
        )}
      </div>
      {showLesson && (
        <div style={{ marginTop: 12, padding: 12, background: `${C.accent}08`, border: `1px solid ${C.accent}33`, borderRadius: 8, fontSize: 14, color: C.muted, lineHeight: 1.6 }}>
          <Icon name="academic" size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />{lesson}
        </div>
      )}
    </div>
  );
};

export const ThreatMeter = ({ label, level, description }) => {
  const colors = [C.accent, C.highlight, C.accent, C.highlight, C.tertiary];
  const labels = ["Low", "Moderate", "Elevated", "High", "Critical"];
  return (
    <div style={{ background: C.codeBg, borderRadius: 8, padding: 12, marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 14, color: colors[level], fontWeight: 700 }}>{labels[level]}</span>
      </div>
      <div role="progressbar" aria-valuenow={level} aria-valuemin={0} aria-valuemax={4} aria-label={label} style={{ display: "flex", gap: 3, marginBottom: 6 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= level ? colors[level] : C.border }} />
        ))}
      </div>
      <div style={{ fontSize: 14, color: C.dim, lineHeight: 1.5 }}>{description}</div>
    </div>
  );
};
