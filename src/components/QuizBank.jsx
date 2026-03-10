import { useState } from "react";
import { C } from "./colors";
import { BeakerIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

const QuizBank = ({ questions }) => {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const q = questions[qIdx];
  const handleSelect = (i) => { if (selected !== null) return; setSelected(i); setAnswered(a => a + 1); if (i === q.correctIndex) setScore(s => s + 1); };
  const nextQ = () => { setSelected(null); setQIdx((qIdx + 1) % questions.length); };
  const reset = () => { setSelected(null); setQIdx(0); setScore(0); setAnswered(0); };
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 6 }}><BeakerIcon style={{ width: 16, height: 16 }} aria-hidden="true" /> Question {qIdx + 1} / {questions.length}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {answered > 0 && <span style={{ fontSize: 14, color: C.accent, fontWeight: 700, background: `${C.accent}15`, padding: "6px 10px", borderRadius: 4 }}>Score: {score}/{answered}</span>}
          <button onClick={reset} aria-label="Reset quiz" style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}><ArrowPathIcon style={{ width: 14, height: 14 }} aria-hidden="true" /> Reset</button>
        </div>
      </div>
      <div style={{ fontSize: 14, color: C.text, marginBottom: 14, lineHeight: 1.6 }}>{q.question}</div>
      <div role="group" aria-label="Answer options" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIndex, isSelected = i === selected;
          let bg = C.codeBg, border = C.border;
          if (selected !== null) { if (isCorrect) { bg = `${C.primary}15`; border = C.secondary; } else if (isSelected) { bg = "#ef444415"; border = "#ef4444"; } }
          return <button key={i} onClick={() => handleSelect(i)} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "10px 14px", color: C.text, cursor: selected === null ? "pointer" : "default", textAlign: "left", fontFamily: "inherit", fontSize: 14, transition: "all 0.3s ease" }}>{opt}</button>;
        })}
      </div>
      {selected !== null && (
        <>
          <div style={{ marginTop: 12, padding: 12, background: C.codeBg, borderRadius: 8, fontSize: 14, color: C.muted, lineHeight: 1.6, display: "flex", alignItems: "flex-start", gap: 6 }}>
            {selected === q.correctIndex
              ? <CheckCircleIcon style={{ width: 18, height: 18, color: "#22c55e", flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
              : <XCircleIcon style={{ width: 18, height: 18, color: "#ef4444", flexShrink: 0, marginTop: 1 }} aria-hidden="true" />}
            <span>{q.explanation}</span>
          </div>
          {questions.length > 1 && <button onClick={nextQ} style={{ marginTop: 10, background: `${C.primary}20`, border: `1px solid ${C.primary}66`, borderRadius: 8, padding: "8px 16px", color: C.accent, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>Next Question <ArrowRightIcon style={{ width: 14, height: 14 }} aria-hidden="true" /></button>}
        </>
      )}
    </div>
  );
};

export default QuizBank;
