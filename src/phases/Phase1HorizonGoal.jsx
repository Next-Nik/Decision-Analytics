import { useState } from "react";
import styles from "./phase.module.css";

const FIVE_CRITERIA = [
  {
    key: "describesState",
    label: "Describes a state, not an action",
    hint: "The goal names how the world looks when the work is done — not what steps to take.",
  },
  {
    key: "livingQuality",
    label: "Has a living quality — not a fixed endpoint",
    hint: "Specific enough to evaluate against, alive enough to remain aspirational across generations.",
  },
  {
    key: "rightScale",
    label: "Operates at the right scale",
    hint: "Domain-level goals are civilisational in scope. Subdomain goals serve the domain goal.",
  },
  {
    key: "evaluable",
    label: "Is evaluable — not just inspirational",
    hint: "You can write three criteria that indicate movement toward this goal.",
  },
  {
    key: "survivesCoreQuestion",
    label: "Survives the core question test",
    hint: "It is the clearest possible answer to: if this domain were genuinely thriving, what would be true?",
  },
];

export default function Phase1HorizonGoal({ data, domain, onChange, onAdvance }) {
  const [localData, setLocalData] = useState(data);

  function update(field, value) {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  }

  function updateCriteria(key, value) {
    const updated = {
      ...localData,
      criteriaAssessment: { ...localData.criteriaAssessment, [key]: value },
    };
    setLocalData(updated);
    onChange(updated);
  }

  const allChecked = FIVE_CRITERIA.every(c => localData.criteriaAssessment[c.key]);
  const canAdvance = localData.goalText.trim().length > 20 && allChecked;

  return (
    <div className={styles.phaseWrap}>
      <div className={styles.phaseHeader}>
        <p className={styles.phaseEyebrow}>Layer 1 of 5</p>
        <h2 className={styles.phaseTitle}>Horizon Goal</h2>
        <div className={styles.phaseDivider} />
        <p className={styles.phaseIntro}>
          The fixed reference point. Everything derives from this — criteria, weights, and what constitutes a strong score. When the Horizon Goal is clear and well-formed, the evaluation process is structurally sound. When it is vague, every subsequent layer compensates through politics.
        </p>
      </div>

      {/* Existing or new goal */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>The Goal — {domain}</p>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Goal name / title</label>
          <input
            className={styles.fieldInput}
            type="text"
            value={localData.name}
            onChange={e => update("name", e.target.value)}
            placeholder={`e.g. ${domain} Horizon Goal v2`}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Horizon Goal statement</label>
          <p className={styles.fieldHint}>The answer to: if this domain were genuinely thriving, what would be true?</p>
          <textarea
            className={styles.fieldTextarea}
            value={localData.goalText}
            onChange={e => update("goalText", e.target.value)}
            placeholder="A statement of a desired future state — not a strategy, not a mission statement, not a values statement. What would be true if this domain were thriving?"
            rows={4}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Description (optional)</label>
          <textarea
            className={styles.fieldTextarea}
            value={localData.description}
            onChange={e => update("description", e.target.value)}
            placeholder="Additional context or rationale for this goal statement."
            rows={3}
          />
        </div>
      </div>

      {/* Five qualifying criteria */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>The Five Qualifying Criteria</p>
        <div className={styles.warning}>
          <p>A Horizon Goal must pass all five criteria to function as a stable reference point. If any criterion fails, rewrite the goal before proceeding.</p>
        </div>

        <div className={styles.checklist}>
          {FIVE_CRITERIA.map(criterion => {
            const checked = localData.criteriaAssessment[criterion.key];
            return (
              <div
                key={criterion.key}
                className={`${styles.checkItem} ${checked ? styles.checked : ""}`}
                onClick={() => updateCriteria(criterion.key, !checked)}
              >
                <div className={styles.checkBox}>
                  {checked && <span className={styles.checkMark}>✓</span>}
                </div>
                <div className={styles.checkContent}>
                  <strong>{criterion.label}</strong>
                  <span>{criterion.hint}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.field} style={{ marginTop: "20px" }}>
          <label className={styles.fieldLabel}>Assessment notes</label>
          <textarea
            className={styles.fieldTextarea}
            value={localData.criteriaAssessment.notes}
            onChange={e => updateCriteria("notes", e.target.value)}
            placeholder="Any notes on why this goal passes or fails the criteria — and what was adjusted."
            rows={3}
          />
        </div>
      </div>

      <button
        className={styles.advanceBtn}
        onClick={onAdvance}
        disabled={!canAdvance}
      >
        {canAdvance
          ? "Proceed to Standards of Excellence →"
          : "Complete the Horizon Goal and check all five criteria to proceed"}
      </button>
    </div>
  );
}
