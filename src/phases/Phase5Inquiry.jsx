import { useState } from "react";
import styles from "./phase.module.css";

const DEFAULT_QUESTIONS = [
  "What conditions made this approach work — and are those conditions replicable elsewhere?",
  "What does this approach give back to the communities and ecosystems it draws from?",
  "How does this approach hold up across generations — what does the seventh generation inherit from it?",
  "What would need to change for this approach to work at larger scale?",
  "Where has this approach failed or underperformed — and what was learned?",
];

export default function Phase5Inquiry({
  candidates,
  breakScore,
  inquiryQuestions,
  domain,
  horizonGoal,
  onChange,
  onAdvance,
}) {
  const aboveCandidates = candidates.filter(c => c.aboveBreak);

  const [questions, setQuestions] = useState(
    inquiryQuestions.length > 0
      ? inquiryQuestions
      : DEFAULT_QUESTIONS.map(q => ({ id: crypto.randomUUID(), text: q, purpose: "" }))
  );
  const [newQuestion, setNewQuestion] = useState("");

  function updateQuestion(id, field, value) {
    const updated = questions.map(q => q.id === id ? { ...q, [field]: value } : q);
    setQuestions(updated);
    onChange(updated);
  }

  function addQuestion() {
    if (!newQuestion.trim()) return;
    const updated = [...questions, { id: crypto.randomUUID(), text: newQuestion.trim(), purpose: "" }];
    setQuestions(updated);
    onChange(updated);
    setNewQuestion("");
  }

  function removeQuestion(id) {
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    onChange(updated);
  }

  const canAdvance = questions.length >= 3;

  return (
    <div className={styles.phaseWrap}>
      <div className={styles.phaseHeader}>
        <p className={styles.phaseEyebrow}>Layer 5 of 5</p>
        <h2 className={styles.phaseTitle}>Structured Inquiry</h2>
        <div className={styles.phaseDivider} />
        <p className={styles.phaseIntro}>
          For candidates above the break only. Pre-defined questions targeting what the scoring process could not capture — the things that require direct engagement with the approach or its practitioners. Submit these in advance. The model has done the heavy lifting. The inquiry goes deep rather than broad.
        </p>
      </div>

      {/* Candidates above the break */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Candidates above the break — {aboveCandidates.length}</p>
        {aboveCandidates.map(c => (
          <div key={c.id} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            marginBottom: "8px",
            background: "rgba(200,146,42,0.06)",
            border: "1px solid var(--gold-rule)",
            borderRadius: "6px",
          }}>
            <div>
              <p style={{ fontFamily: "var(--serif)", fontSize: "16px", fontWeight: 300, color: "var(--dark)" }}>{c.name}</p>
              <p style={{ fontFamily: "var(--sc)", fontSize: "9px", letterSpacing: "0.10em", color: "var(--meta)", marginTop: "2px" }}>
                {c.location} · Score: {(c.compositeScore || 0).toFixed(2)}
              </p>
            </div>
            {c.url && (
              <a href={c.url} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "var(--sc)",
                fontSize: "9px",
                letterSpacing: "0.12em",
                color: "var(--gold)",
                textDecoration: "none",
              }}>
                Visit →
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Questions */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Inquiry questions</p>
        <div className={styles.warning}>
          <p>These questions are submitted to candidates above the break before direct engagement. They are pre-defined so the conversation can go deep rather than covering ground the scoring already covered.</p>
        </div>

        {questions.map((q, i) => (
          <div key={q.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Question {i + 1}</span>
              <button className={styles.removeBtn} onClick={() => removeQuestion(q.id)}>Remove</button>
            </div>

            <div className={styles.field} style={{ marginBottom: "10px" }}>
              <textarea
                className={styles.fieldTextarea}
                value={q.text}
                onChange={e => updateQuestion(q.id, "text", e.target.value)}
                rows={2}
              />
            </div>

            <div className={styles.field} style={{ marginBottom: 0 }}>
              <label className={styles.fieldLabel}>Why this question (optional)</label>
              <input
                className={styles.fieldInput}
                type="text"
                value={q.purpose}
                onChange={e => updateQuestion(q.id, "purpose", e.target.value)}
                placeholder="What gap in the scoring does this question address?"
                style={{ fontSize: "13px" }}
              />
            </div>
          </div>
        ))}

        {/* Add question */}
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <input
            className={styles.fieldInput}
            type="text"
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            placeholder="Add a question..."
            onKeyDown={e => e.key === "Enter" && addQuestion()}
          />
          <button
            onClick={addQuestion}
            disabled={!newQuestion.trim()}
            style={{
              fontFamily: "var(--sc)",
              fontSize: "10px",
              letterSpacing: "0.12em",
              color: "var(--gold)",
              background: "none",
              border: "1px solid var(--gold-mid)",
              borderRadius: "4px",
              padding: "0 16px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            Add →
          </button>
        </div>
      </div>

      {/* Session summary */}
      <div className={styles.section} style={{ background: "rgba(200,146,42,0.04)", padding: "24px", border: "1px solid var(--gold-rule)", borderRadius: "8px" }}>
        <p className={styles.sectionTitle}>Session Summary</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {[
            { label: "Domain", value: domain },
            { label: "Horizon Goal", value: horizonGoal.name || "Unlabelled" },
            { label: "Candidates evaluated", value: candidates.length },
            { label: "Above the break", value: aboveCandidates.length },
            { label: "Break threshold", value: breakScore?.toFixed(2) || "—" },
            { label: "Inquiry questions", value: questions.length },
          ].map(item => (
            <div key={item.label}>
              <p style={{ fontFamily: "var(--sc)", fontSize: "9px", letterSpacing: "0.14em", color: "var(--meta)", marginBottom: "4px" }}>
                {item.label.toUpperCase()}
              </p>
              <p style={{ fontFamily: "var(--serif)", fontSize: "16px", fontWeight: 300, color: "var(--dark)" }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        className={styles.advanceBtn}
        onClick={onAdvance}
        disabled={!canAdvance}
      >
        {canAdvance
          ? "Complete Session →"
          : "Add at least 3 inquiry questions to complete"}
      </button>
    </div>
  );
}
