import { useState } from "react";
import { C } from "./colors";
import { BeakerIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon, TrophyIcon } from "@heroicons/react/24/outline";

const shuffleQuestions = (questions) => {
  const mapped = questions.map((q, origIdx) => {
    const indices = q.options.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return {
      ...q,
      _id: origIdx,
      options: indices.map(i => q.options[i]),
      correctIndex: indices.indexOf(q.correctIndex),
    };
  });
  for (let i = mapped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
  }
  return mapped;
};

const quizWrapStyle = {
  background: `radial-gradient(ellipse at 20% 50%, #1a1145 0%, transparent 70%),
               radial-gradient(ellipse at 80% 20%, #0d1a3a 0%, transparent 60%),
               radial-gradient(ellipse at 50% 80%, #15082e 0%, transparent 70%),
               radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.15) 50%, transparent 50%),
               radial-gradient(1px 1px at 30% 65%, rgba(255,255,255,0.12) 50%, transparent 50%),
               radial-gradient(1px 1px at 55% 25%, rgba(255,255,255,0.1) 50%, transparent 50%),
               radial-gradient(1px 1px at 75% 75%, rgba(255,255,255,0.14) 50%, transparent 50%),
               radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.08) 50%, transparent 50%),
               radial-gradient(1px 1px at 45% 90%, rgba(255,255,255,0.1) 50%, transparent 50%),
               radial-gradient(1px 1px at 20% 45%, rgba(255,255,255,0.12) 50%, transparent 50%),
               radial-gradient(1px 1px at 65% 55%, rgba(255,255,255,0.06) 50%, transparent 50%),
               radial-gradient(1.5px 1.5px at 85% 10%, rgba(200,180,255,0.2) 50%, transparent 50%),
               radial-gradient(1.5px 1.5px at 40% 35%, rgba(140,200,255,0.15) 50%, transparent 50%),
               linear-gradient(160deg, #0a0818 0%, #10082a 40%, #0c1028 70%, #08060f 100%)`,
  borderRadius: 16,
  padding: 24,
  marginBottom: 16,
  border: `1px solid ${C.primary}33`,
};

const quizHeadingStyle = {
  fontSize: 15, fontWeight: 700, color: C.accent,
  marginBottom: 14, display: "flex", alignItems: "center", gap: 8,
};

const QuizBank = ({ questions }) => {
  const [shuffled, setShuffled] = useState(() => shuffleQuestions(questions));
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]); // { questionIdx, selectedIdx, correct }
  const [completed, setCompleted] = useState(false);

  const q = shuffled[qIdx];
  const score = answers.filter(a => a.correct).length;

  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setAnswers(prev => [...prev, { questionIdx: qIdx, selectedIdx: i, correct: i === q.correctIndex }]);
  };

  const nextQ = () => {
    if (qIdx + 1 >= shuffled.length) {
      setCompleted(true);
    } else {
      setSelected(null);
      setQIdx(qIdx + 1);
    }
  };

  const reset = () => { setShuffled(shuffleQuestions(questions)); setSelected(null); setQIdx(0); setAnswers([]); setCompleted(false); };

  if (completed) {
    const total = shuffled.length;
    const pct = Math.round((score / total) * 100);
    return (
      <div style={quizWrapStyle}>
      <div style={quizHeadingStyle}><BeakerIcon style={{ width: 18, height: 18 }} aria-hidden="true" /> Check Your Understanding</div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <TrophyIcon style={{ width: 22, height: 22, color: pct === 100 ? "#FFD700" : C.accent }} aria-hidden="true" />
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>
            {pct === 100 ? "Great job!" : pct >= 66 ? "Nice work!" : "Keep learning!"}
          </div>
        </div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>You got {score} out of {total} — review the explanations below.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {shuffled.map((question, qi) => {
            const answer = answers[qi];
            const wasCorrect = answer?.correct;
            return (
              <div key={question._id} style={{ background: C.codeBg, borderRadius: 8, padding: 14, border: `1px solid ${wasCorrect ? `${C.secondary}44` : "#ef444444"}` }}>
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
      </div>
    );
  }

  return (
    <div style={quizWrapStyle}>
    <div style={quizHeadingStyle}><BeakerIcon style={{ width: 18, height: 18 }} aria-hidden="true" /> Check Your Understanding</div>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 6 }}><BeakerIcon style={{ width: 16, height: 16 }} aria-hidden="true" /> Question {qIdx + 1} / {shuffled.length}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {answers.length > 0 && <>
            <span style={{ fontSize: 14, color: C.accent, fontWeight: 700, background: `${C.accent}15`, padding: "6px 10px", borderRadius: 4 }}>{Math.round((score / answers.length) * 100)}%</span>
            <span style={{ fontSize: 14, color: C.muted, fontWeight: 600, background: `${C.border}`, padding: "6px 10px", borderRadius: 4 }}>{score}/{answers.length} correct</span>
          </>}
          <button onClick={reset} aria-label="Reset quiz" style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}><ArrowPathIcon style={{ width: 14, height: 14 }} aria-hidden="true" /> Reset</button>
        </div>
      </div>
      <div style={{ height: 3, borderRadius: 2, background: C.codeBg, marginBottom: 14 }}>
        <div style={{ height: "100%", borderRadius: 2, background: C.accent, width: `${((qIdx + 1) / shuffled.length) * 100}%`, transition: "width 0.3s ease" }} />
      </div>
      <div aria-live="polite" aria-atomic="true" style={{ fontSize: 14, color: C.text, marginBottom: 14, lineHeight: 1.6 }}>{q.question}</div>
      <div role="group" aria-label="Answer options" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIndex, isSelected = i === selected;
          let bg = C.codeBg, border = C.border;
          if (selected !== null) { if (isCorrect) { bg = `${C.primary}15`; border = C.secondary; } else if (isSelected && !isCorrect) { bg = "#ef444415"; border = "#ef4444"; } }
          const showFeedback = selected !== null && isSelected;
          return (
            <button key={i} onClick={() => handleSelect(i)} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: showFeedback ? "10px 14px 14px 14px" : "10px 14px", color: C.text, cursor: selected === null ? "pointer" : "default", textAlign: "left", fontFamily: "inherit", fontSize: 14, transition: "all 0.3s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {selected !== null && isSelected && (
                  isCorrect
                    ? <CheckCircleIcon style={{ width: 18, height: 18, color: "#22c55e", flexShrink: 0 }} aria-hidden="true" />
                    : <XCircleIcon style={{ width: 18, height: 18, color: "#ef4444", flexShrink: 0 }} aria-hidden="true" />
                )}
                {selected !== null && isCorrect && !isSelected && (
                  <CheckCircleIcon style={{ width: 18, height: 18, color: "#22c55e", flexShrink: 0 }} aria-hidden="true" />
                )}
                <span>{opt}</span>
              </div>
              {showFeedback && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${isCorrect ? `${C.secondary}44` : "#ef444444"}`, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                  {!isCorrect && <div style={{ color: "#22c55e", marginBottom: 4 }}>Correct answer: {q.options[q.correctIndex]}</div>}
                  {q.explanation}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <button onClick={nextQ} style={{ marginTop: 10, background: `${C.primary}20`, border: `1px solid ${C.primary}66`, borderRadius: 8, padding: "8px 16px", color: C.accent, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          {qIdx + 1 >= questions.length ? "View Results" : "Next Question"} <ArrowRightIcon style={{ width: 14, height: 14 }} aria-hidden="true" />
        </button>
      )}
    </div>
    </div>
  );
};

export default QuizBank;
