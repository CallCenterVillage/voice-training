import { C, QuizBank } from "../../components";
import { allQuizQuestions } from "../../quizData";

const QuizPage = ({ onBack }) => (
  <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 24px 120px" }}>
      <button onClick={onBack} style={{
        background: "none", border: `1px solid ${C.border}`, borderRadius: 8,
        padding: "8px 16px", color: C.muted, cursor: "pointer", fontFamily: "inherit",
        fontSize: 14, marginBottom: 24, display: "flex", alignItems: "center", gap: 6,
      }}>
        ← Back to Training
      </button>

      <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>Knowledge Test</h1>
      <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 8 }}>
        All {allQuizQuestions.length} questions from across the training — randomized. Test your understanding of voice cloning, voice agents, and social engineering.
      </p>
      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
        {[
          { label: "Voice Cloning", count: allQuizQuestions.filter(q => q.module === "Voice Cloning").length, color: C.accent },
          { label: "Voice Agents", count: allQuizQuestions.filter(q => q.module === "Voice Agents").length, color: C.secondary },
          { label: "Social Engineering", count: allQuizQuestions.filter(q => q.module === "Social Engineering").length, color: C.tertiary },
        ].map(m => (
          <div key={m.label} style={{ background: `${m.color}10`, border: `1px solid ${m.color}33`, borderRadius: 6, padding: "4px 12px", fontSize: 13, color: m.color, fontWeight: 600 }}>
            {m.label}: {m.count}
          </div>
        ))}
      </div>

      <QuizBank questions={allQuizQuestions} />
    </div>
  </div>
);

export default QuizPage;
