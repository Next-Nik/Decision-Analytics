import { useState } from "react";
import styles from "./phase.module.css";

export default function Phase3Evaluation({ candidates, standards, domain, onChange, onAdvance }) {
  const [localCandidates, setLocalCandidates] = useState(candidates);
  const [activeCandidate, setActiveCandidate] = useState(null);

  function addCandidate() {
    const newC = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      url: "",
      location: "",
      scores: standards.criteria.map(c => ({
        criterionId: c.id,
        criterionName: c.name,
        score: null,
        notes: "",
      })),
      compositeScore: null,
    };
    const updated = [...localCandidates, newC];
    setLocalCandidates(updated);
    onChange(updated);
    setActiveCandidate(newC.id);
  }

  function updateCandidate(id, field, value) {
    const updated = localCandidates.map(c => c.id === id ? { ...c, [field]: value } : c);
    setLocalCandidates(updated);
    onChange(updated);
  }

  function updateScore(candidateId, criterionId, field, value) {
    const updated = localCandidates.map(c => {
      if (c.id !== candidateId) return c;
      const newScores = c.scores.map(s =>
        s.criterionId === criterionId ? { ...s, [field]: value } : s
      );
      // Recalculate composite
      const composite = newScores.reduce((sum, s) => {
        const criterion = standards.criteria.find(cr => cr.id === s.criterionId);
        const weight = criterion ? Number(criterion.weight) / 100 : 0;
        const score = s.score !== null ? Number(s.score) : 0;
        return sum + score * weight;
      }, 0);
      return { ...c, scores: newScores, compositeScore: Math.round(composite * 100) / 100 };
    });
    setLocalCandidates(updated);
    onChange(updated);
  }

  function removeCandidate(id) {
    const updated = localCandidates.filter(c => c.id !== id);
    setLocalCandidates(updated);
    onChange(updated);
    if (activeCandidate === id) setActiveCandidate(null);
  }

  const canAdvance = localCandidates.length >= 2 &&
    localCandidates.every(c => c.name.trim() && c.compositeScore !== null);

  const sorted = [...localCandidates].sort((a, b) =>
    (b.compositeScore || 0) - (a.compositeScore || 0)
  );

  return (
    <div className={styles.phaseWrap}>
      <div className={styles.phaseHeader}>
        <p className={styles.phaseEyebrow}>Layer 3 of 5</p>
        <h2 className={styles.phaseTitle}>Candidate Evaluation</h2>
        <div className={styles.phaseDivider} />
        <p className={styles.phaseIntro}>
          Every solution, approach, or practice being evaluated runs through the Standards of Excellence. Score each criterion 0–10, multiply by weight, sum for a composite. Every candidate gets one defensible number.
        </p>
      </div>

      {/* Leaderboard */}
      {localCandidates.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Current Rankings</p>
          {sorted.map((c, i) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                marginBottom: "6px",
                border: "1px solid var(--gold-rule)",
                borderRadius: "6px",
                background: activeCandidate === c.id ? "rgba(200,146,42,0.07)" : "white",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => setActiveCandidate(activeCandidate === c.id ? null : c.id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ fontFamily: "var(--sc)", fontSize: "10px", letterSpacing: "0.12em", color: "var(--meta)", minWidth: "20px" }}>
                  {i + 1}
                </span>
                <span style={{ fontFamily: "var(--serif)", fontSize: "16px", fontWeight: 300, color: "var(--dark)" }}>
                  {c.name || "Unnamed candidate"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {c.compositeScore !== null && (
                  <div className={styles.scoreBadge}>{c.compositeScore.toFixed(1)}</div>
                )}
                <button className={styles.removeBtn} onClick={e => { e.stopPropagation(); removeCandidate(c.id); }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active candidate scoring */}
      {localCandidates.map(candidate => (
        activeCandidate === candidate.id && (
          <div key={candidate.id} className={styles.section}>
            <p className={styles.sectionTitle}>Scoring — {candidate.name || "New candidate"}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              <div className={styles.field} style={{ marginBottom: 0 }}>
                <label className={styles.fieldLabel}>Candidate name</label>
                <input
                  className={styles.fieldInput}
                  type="text"
                  value={candidate.name}
                  onChange={e => updateCandidate(candidate.id, "name", e.target.value)}
                  placeholder="Organisation or approach name"
                />
              </div>
              <div className={styles.field} style={{ marginBottom: 0 }}>
                <label className={styles.fieldLabel}>Location / scale</label>
                <input
                  className={styles.fieldInput}
                  type="text"
                  value={candidate.location}
                  onChange={e => updateCandidate(candidate.id, "location", e.target.value)}
                  placeholder="e.g. La Paz, BCS · Local"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Description</label>
              <textarea
                className={styles.fieldTextarea}
                value={candidate.description}
                onChange={e => updateCandidate(candidate.id, "description", e.target.value)}
                placeholder="Brief description of what this candidate does."
                rows={2}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>URL</label>
              <input
                className={styles.fieldInput}
                type="url"
                value={candidate.url}
                onChange={e => updateCandidate(candidate.id, "url", e.target.value)}
                placeholder="https://"
              />
            </div>

            {/* Score each criterion */}
            <p style={{ fontFamily: "var(--sc)", fontSize: "10px", letterSpacing: "0.14em", color: "var(--meta)", marginBottom: "16px" }}>
              CRITERIA SCORES
            </p>

            {candidate.scores.map(scoreEntry => {
              const criterion = standards.criteria.find(c => c.id === scoreEntry.criterionId);
              if (!criterion) return null;
              return (
                <div key={scoreEntry.criterionId} className={styles.card} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "var(--sc)", fontSize: "10px", letterSpacing: "0.12em", color: "var(--dark)", marginBottom: "2px" }}>
                        {criterion.name}
                        {criterion.isSeventhGeneration && <span style={{ marginLeft: "8px", color: "var(--gold)", fontSize: "9px" }}>· 7th Gen</span>}
                        {criterion.isHonorableHarvest && <span style={{ marginLeft: "8px", color: "var(--gold)", fontSize: "9px" }}>· Harvest</span>}
                      </p>
                      <p style={{ fontFamily: "var(--serif)", fontSize: "12px", color: "var(--meta)" }}>{criterion.scoringGuide}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "16px", flexShrink: 0 }}>
                      <span style={{ fontFamily: "var(--sc)", fontSize: "9px", letterSpacing: "0.10em", color: "var(--meta)" }}>Weight: {criterion.weight}%</span>
                      <div className={styles.scoreBadge}>
                        {scoreEntry.score !== null ? scoreEntry.score : "—"}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
                    {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                      <button
                        key={n}
                        onClick={() => updateScore(candidate.id, scoreEntry.criterionId, "score", n)}
                        style={{
                          flex: 1,
                          padding: "6px 0",
                          fontFamily: "var(--sc)",
                          fontSize: "10px",
                          letterSpacing: "0.06em",
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: scoreEntry.score === n ? "var(--gold)" : "var(--gold-rule)",
                          background: scoreEntry.score === n ? "rgba(200,146,42,0.15)" : "white",
                          color: scoreEntry.score === n ? "var(--gold)" : "var(--meta)",
                          borderRadius: "3px",
                          transition: "all 0.15s",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>

                  <input
                    className={styles.fieldInput}
                    type="text"
                    value={scoreEntry.notes}
                    onChange={e => updateScore(candidate.id, scoreEntry.criterionId, "notes", e.target.value)}
                    placeholder="Notes on this score (optional)"
                    style={{ fontSize: "13px" }}
                  />
                </div>
              );
            })}

            {candidate.compositeScore !== null && (
              <div style={{
                padding: "20px 24px",
                background: "rgba(200,146,42,0.06)",
                borderLeft: "2px solid var(--gold)",
                marginTop: "20px",
              }}>
                <p style={{ fontFamily: "var(--sc)", fontSize: "9px", letterSpacing: "0.16em", color: "var(--meta)", marginBottom: "4px" }}>
                  COMPOSITE SCORE
                </p>
                <p style={{ fontFamily: "var(--serif)", fontSize: "36px", fontWeight: 300, color: "var(--dark)" }}>
                  {candidate.compositeScore.toFixed(2)}<span style={{ fontSize: "16px", color: "var(--meta)" }}>/10</span>
                </p>
              </div>
            )}
          </div>
        )
      ))}

      <button className={styles.addBtn} onClick={addCandidate}>
        + Add candidate
      </button>

      <button
        className={styles.advanceBtn}
        onClick={onAdvance}
        disabled={!canAdvance}
      >
        {canAdvance
          ? "Proceed to The Break →"
          : "Score at least 2 candidates fully to proceed"}
      </button>
    </div>
  );
}
