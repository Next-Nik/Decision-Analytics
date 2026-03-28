import styles from "./phase.module.css";

const CHECKPOINT_STAGES = ["draft", "review", "approved", "published"];

export default function SessionComplete({ session, onExport, onAdvanceStatus }) {
  const aboveCandidates = session.candidates.filter(c => c.aboveBreak);
  const belowCandidates = session.candidates.filter(c => !c.aboveBreak);
  const currentStageIdx = CHECKPOINT_STAGES.indexOf(session.status);
  const nextStage = CHECKPOINT_STAGES[currentStageIdx + 1];

  return (
    <div className={styles.phaseWrap} style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 40px" }}>

      <p className={styles.phaseEyebrow}>NextUs · Decision Analytics</p>
      <h2 className={styles.phaseTitle}>Session Complete</h2>
      <div className={styles.phaseDivider} />

      <p className={styles.phaseIntro}>
        The five-layer process is complete. The outputs below are in <strong>Draft</strong> status. Nothing is published until you advance through the checkpoint stages. Each stage requires explicit sign-off.
      </p>

      {/* Checkpoint stages */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Checkpoint Status</p>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "20px" }}>
          {CHECKPOINT_STAGES.map((stage, i) => (
            <div key={stage} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                padding: "8px 16px",
                borderRadius: "40px",
                fontFamily: "var(--sc)",
                fontSize: "10px",
                letterSpacing: "0.12em",
                border: "1px solid",
                borderColor: i <= currentStageIdx ? "var(--gold-mid)" : "var(--gold-rule)",
                background: i === currentStageIdx ? "rgba(200,146,42,0.12)" : i < currentStageIdx ? "rgba(200,146,42,0.06)" : "white",
                color: i <= currentStageIdx ? "var(--gold)" : "var(--meta)",
              }}>
                {i < currentStageIdx ? "✓ " : ""}{stage}
              </div>
              {i < CHECKPOINT_STAGES.length - 1 && (
                <span style={{ color: "var(--gold-rule)", fontSize: "12px" }}>→</span>
              )}
            </div>
          ))}
        </div>
        {nextStage && (
          <button
            className={styles.advanceBtn}
            style={{ marginTop: 0 }}
            onClick={() => onAdvanceStatus(nextStage)}
          >
            Advance to {nextStage} →
          </button>
        )}
        {!nextStage && (
          <p style={{ fontFamily: "var(--serif)", fontSize: "15px", fontStyle: "italic", color: "var(--gold)" }}>
            This session is published.
          </p>
        )}
      </div>

      {/* Best practices (above break) */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Best Practices — Above the Break</p>
        {aboveCandidates.length === 0 && (
          <p style={{ fontFamily: "var(--serif)", fontSize: "14px", fontStyle: "italic", color: "var(--meta)" }}>
            No candidates above the break.
          </p>
        )}
        {aboveCandidates.map(c => (
          <div key={c.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>{c.name}</span>
              <div className={styles.scoreBadge}>{(c.compositeScore || 0).toFixed(2)}</div>
            </div>
            <p style={{ fontFamily: "var(--serif)", fontSize: "14px", fontWeight: 300, color: "var(--body)", lineHeight: 1.6 }}>
              {c.description}
            </p>
            {c.location && (
              <p style={{ fontFamily: "var(--sc)", fontSize: "9px", letterSpacing: "0.10em", color: "var(--meta)", marginTop: "8px" }}>
                {c.location}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Candidate library (below break) */}
      {belowCandidates.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Candidate Library — Below the Break</p>
          <p style={{ fontFamily: "var(--serif)", fontSize: "13px", fontStyle: "italic", color: "var(--meta)", marginBottom: "16px" }}>
            Below the break is not the bin. It is a record of what was tried and what the conditions were. These candidates may be right for a different context, a different stage, or a different domain.
          </p>
          {belowCandidates.map(c => (
            <div key={c.id} style={{
              padding: "12px 16px",
              marginBottom: "8px",
              border: "1px solid var(--gold-faint)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span style={{ fontFamily: "var(--serif)", fontSize: "14px", fontWeight: 300, color: "var(--meta)" }}>
                {c.name}
              </span>
              <span style={{ fontFamily: "var(--sc)", fontSize: "10px", letterSpacing: "0.10em", color: "var(--meta)" }}>
                {(c.compositeScore || 0).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Structured inquiry */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Structured Inquiry Questions — {session.inquiryQuestions.length}</p>
        {session.inquiryQuestions.map((q, i) => (
          <div key={q.id} style={{ marginBottom: "14px" }}>
            <p style={{ fontFamily: "var(--sc)", fontSize: "9px", letterSpacing: "0.12em", color: "var(--gold)", marginBottom: "4px" }}>
              Q{i + 1}
            </p>
            <p style={{ fontFamily: "var(--serif)", fontSize: "15px", fontWeight: 300, color: "var(--dark)", lineHeight: 1.65 }}>
              {q.text}
            </p>
          </div>
        ))}
      </div>

      {/* Export */}
      <button className={styles.advanceBtn} onClick={onExport}>
        Export session JSON →
      </button>
    </div>
  );
}
