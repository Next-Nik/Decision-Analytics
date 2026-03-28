import { useState, useEffect } from "react";
import styles from "./phase.module.css";

export default function Phase4Break({ candidates, breakScore, breakRationale, onChange, onAdvance }) {
  const sorted = [...candidates].sort((a, b) =>
    (b.compositeScore || 0) - (a.compositeScore || 0)
  );

  const scores = sorted.map(c => c.compositeScore || 0);

  // Auto-detect natural break — find largest gap between adjacent scores
  const suggestedBreak = (() => {
    if (scores.length < 2) return null;
    let maxGap = 0;
    let breakAt = null;
    for (let i = 0; i < scores.length - 1; i++) {
      const gap = scores[i] - scores[i + 1];
      if (gap > maxGap) {
        maxGap = gap;
        breakAt = (scores[i] + scores[i + 1]) / 2;
      }
    }
    return breakAt ? Math.round(breakAt * 100) / 100 : null;
  })();

  const [localBreak, setLocalBreak] = useState(breakScore || suggestedBreak || "");
  const [localRationale, setLocalRationale] = useState(breakRationale || "");

  useEffect(() => {
    if (suggestedBreak && !breakScore) {
      setLocalBreak(suggestedBreak);
    }
  }, [suggestedBreak, breakScore]);

  function update(br, rat) {
    setLocalBreak(br);
    setLocalRationale(rat);
    onChange({
      breakScore: Number(br),
      breakRationale: rat,
      candidates: candidates.map(c => ({
        ...c,
        aboveBreak: (c.compositeScore || 0) >= Number(br),
      })),
    });
  }

  const aboveBreak = sorted.filter(c => (c.compositeScore || 0) >= Number(localBreak));
  const belowBreak = sorted.filter(c => (c.compositeScore || 0) < Number(localBreak));
  const canAdvance = localBreak !== "" && localRationale.trim().length > 10 && aboveBreak.length > 0;

  return (
    <div className={styles.phaseWrap}>
      <div className={styles.phaseHeader}>
        <p className={styles.phaseEyebrow}>Layer 4 of 5</p>
        <h2 className={styles.phaseTitle}>The Break</h2>
        <div className={styles.phaseDivider} />
        <p className={styles.phaseIntro}>
          The core mechanic. Find the natural statistical gap — the point where scores cluster above and below with visible space between them. The break does the eliminating. Candidates below it are removed by the data, not by someone's judgment. This is what makes the process defensible.
        </p>
      </div>

      {/* Score visualisation */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>All candidate scores</p>

        <div style={{ position: "relative", marginBottom: "32px" }}>
          {sorted.map((c, i) => {
            const isAbove = localBreak !== "" && (c.compositeScore || 0) >= Number(localBreak);
            const pct = ((c.compositeScore || 0) / 10) * 100;
            return (
              <div key={c.id} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "200px", flexShrink: 0 }}>
                    <p style={{
                      fontFamily: "var(--serif)",
                      fontSize: "14px",
                      fontWeight: 300,
                      color: isAbove ? "var(--dark)" : "var(--meta)",
                      lineHeight: 1.3,
                      textDecoration: localBreak !== "" && !isAbove ? "line-through" : "none",
                    }}>
                      {c.name}
                    </p>
                    <p style={{ fontFamily: "var(--sc)", fontSize: "9px", letterSpacing: "0.10em", color: "var(--meta)" }}>
                      {c.location}
                    </p>
                  </div>

                  <div style={{ flex: 1, position: "relative" }}>
                    <div style={{
                      height: "8px",
                      background: "rgba(200,146,42,0.10)",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: isAbove ? "var(--gold)" : "var(--meta)",
                        opacity: isAbove ? 1 : 0.4,
                        borderRadius: "4px",
                        transition: "width 0.6s ease, background 0.3s, opacity 0.3s",
                      }} />
                    </div>
                  </div>

                  <div className={styles.scoreBadge} style={{
                    background: isAbove ? "rgba(200,146,42,0.12)" : "rgba(122,122,114,0.08)",
                    borderColor: isAbove ? "var(--gold-mid)" : "var(--gold-rule)",
                    color: isAbove ? "var(--dark)" : "var(--meta)",
                  }}>
                    {(c.compositeScore || 0).toFixed(1)}
                  </div>
                </div>

                {/* Break line indicator */}
                {localBreak !== "" && i < sorted.length - 1 &&
                  (c.compositeScore || 0) >= Number(localBreak) &&
                  (sorted[i + 1]?.compositeScore || 0) < Number(localBreak) && (
                  <div style={{
                    margin: "10px 0 10px 212px",
                    borderTop: "2px dashed var(--gold)",
                    position: "relative",
                  }}>
                    <span style={{
                      position: "absolute",
                      right: "52px",
                      top: "-10px",
                      background: "var(--bg)",
                      padding: "0 8px",
                      fontFamily: "var(--sc)",
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      color: "var(--gold)",
                    }}>
                      THE BREAK — {localBreak}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Break controls */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Set the break</p>

        {suggestedBreak && (
          <div className={styles.warning}>
            <p>Suggested break: <strong>{suggestedBreak}</strong> — largest gap is between scores {scores.find(s => s >= suggestedBreak)?.toFixed(2)} and {scores.find(s => s < suggestedBreak)?.toFixed(2)}. You may adjust this.</p>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Break score threshold</label>
          <input
            className={styles.fieldInput}
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={localBreak}
            onChange={e => update(e.target.value, localRationale)}
            placeholder="e.g. 6.5"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Rationale for this break point</label>
          <textarea
            className={styles.fieldTextarea}
            value={localRationale}
            onChange={e => update(localBreak, e.target.value)}
            placeholder="Why does the break fall here? What natural gap does it identify? Who agreed on this threshold and on what basis?"
            rows={4}
          />
        </div>
      </div>

      {/* Summary */}
      {localBreak !== "" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
          <div style={{ padding: "20px", background: "rgba(74,124,89,0.06)", border: "1px solid rgba(74,124,89,0.2)", borderRadius: "8px" }}>
            <p style={{ fontFamily: "var(--sc)", fontSize: "9px", letterSpacing: "0.14em", color: "#4A7C59", marginBottom: "8px" }}>ABOVE THE BREAK</p>
            {aboveBreak.map(c => (
              <p key={c.id} style={{ fontFamily: "var(--serif)", fontSize: "14px", fontWeight: 300, color: "var(--dark)", marginBottom: "4px" }}>
                {c.name} <span style={{ color: "var(--meta)", fontSize: "12px" }}>({(c.compositeScore || 0).toFixed(2)})</span>
              </p>
            ))}
          </div>
          <div style={{ padding: "20px", background: "rgba(122,122,114,0.04)", border: "1px solid var(--gold-rule)", borderRadius: "8px" }}>
            <p style={{ fontFamily: "var(--sc)", fontSize: "9px", letterSpacing: "0.14em", color: "var(--meta)", marginBottom: "8px" }}>BELOW THE BREAK</p>
            {belowBreak.map(c => (
              <p key={c.id} style={{ fontFamily: "var(--serif)", fontSize: "14px", fontWeight: 300, color: "var(--meta)", marginBottom: "4px", textDecoration: "line-through" }}>
                {c.name} <span style={{ fontSize: "12px" }}>({(c.compositeScore || 0).toFixed(2)})</span>
              </p>
            ))}
          </div>
        </div>
      )}

      <button
        className={styles.advanceBtn}
        onClick={onAdvance}
        disabled={!canAdvance}
      >
        {canAdvance
          ? "Proceed to Structured Inquiry →"
          : "Set the break score and add rationale to proceed"}
      </button>
    </div>
  );
}
