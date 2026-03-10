import { useState } from "react";
import { C } from "./colors";
import { BeakerIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon, TrophyIcon } from "@heroicons/react/24/outline";

const QuizBank = ({ questions }) => {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]); // { questionIdx, selectedIdx, correct }
  const [completed, setCompleted] = useState(false);

  const q = questions[qIdx];
  const score = answers.filter(a => a.correct).length;

  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setAnswers(prev => [...prev, { questionIdx: qIdx, selectedIdx: i, correct: i === q.correctIndex }]);
  };

  const nextQ = () => {
    if (qIdx + 1 >= questions.length) {
      setCompleted(true);
    } else {
      setSelected(null);
      setQIdx(qIdx + 1);
    }
  };

  const reset = () => { setSelected(null); setQIdx(0); setAnswers([]); setCompleted(false); };

  if (completed) {
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    return (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <TrophyIcon style={{ width: 22, height: 22, color: pct === 100 ? "#FFD700" : C.accent }} aria-hidden="true" />
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>
            {pct === 100 ? "Perfect Score!" : pct >= 66 ? "Nice Work!" : "Keep Learning!"}
          </div>
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: C.accent, marginBottom: 4 }}>{score}/{total}</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>{pct}% correct</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {questions.map((question, qi) => {
            const answer = answers[qi];
            const wasCorrect = answer?.correct;
            return (
              <div key={qi} style={{ background: C.codeBg, borderRadius: 8, padding: 14, border: `1px solid ${wasCorrect ? `${C.secondary}44` : "#ef444444"}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  {wasCorrect
                    ? <CheckCircleIcon style={{ width: 18, height: 18, color: "#22c55e", flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
                    : <XCircleIcon style={{ width: 18, height: 18, color: "#ef4444", flexShrink: 0, marginTop: 1 }} aria-hidden="true" />}
                  <div style={{ fontSize: 14, color: C.text, lineHeight: 1.5 }}>{question.question}</div>
                </div>
                {!wasCorrect && (
                  <div style={{ fontSize: 13, color: "#ef4444", marginBottom: 4, marginLeft: 26 }}>
                    Your answer: {question.options[answer?.selectedIdx]}
                  </div>
                )}
                <div style={{ fontSize: 13, color: wasCorrect ? C.accent : C.muted, marginLeft: 26 }}>
                  {wasCorrect ? "Correct" : `Answer: ${question.options[question.correctIndex]}`} — {question.explanation}
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={reset} style={{ background: `${C.primary}20`, border: `1px solid ${C.primary}66`, borderRadius: 8, padding: "10px 20px", color: C.accent, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowPathIcon style={{ width: 14, height: 14 }} aria-hidden="true" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 6 }}><BeakerIcon style={{ width: 16, height: 16 }} aria-hidden="true" /> Question {qIdx + 1} / {questions.length}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {answers.length > 0 && <span style={{ fontSize: 14, color: C.accent, fontWeight: 700, background: `${C.accent}15`, padding: "6px 10px", borderRadius: 4 }}>Score: {score}/{answers.length}</span>}
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
          <button onClick={nextQ} style={{ marginTop: 10, background: `${C.primary}20`, border: `1px solid ${C.primary}66`, borderRadius: 8, padding: "8px 16px", color: C.accent, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            {qIdx + 1 >= questions.length ? "View Results" : "Next Question"} <ArrowRightIcon style={{ width: 14, height: 14 }} aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
};

export default QuizBank;
