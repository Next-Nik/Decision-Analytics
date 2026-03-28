import { useState } from "react";
import styles from "./phase.module.css";

const DEFAULT_CRITERIA = [
  {
    id: crypto.randomUUID(),
    name: "Evidence base strength",
    description: "How strong and replicable is the evidence that this approach works?",
    type: "quantitative",
    weight: 20,
    isSeventhGeneration: false,
    isHonorableHarvest: false,
    scoringGuide: "0 = anecdotal only · 5 = moderate evidence, limited replication · 10 = strong RCT or equivalent, replicated",
  },
  {
    id: crypto.randomUUID(),
    name: "Scalability",
    description: "Can this approach work at larger scale without losing effectiveness?",
    type: "quantitative",
    weight: 15,
    isSeventhGeneration: false,
    isHonorableHarvest: false,
    scoringGuide: "0 = works only at original site · 5 = some replication with adaptation · 10 = proven scalable, multiple contexts",
  },
  {
    id: crypto.randomUUID(),
    name: "Cost effectiveness",
    description: "What is the ratio of impact to resources required?",
    type: "quantitative",
    weight: 15,
    isSeventhGeneration: false,
    isHonorableHarvest: false,
    scoringGuide: "0 = extremely resource intensive, low output · 5 = reasonable ratio · 10 = high impact per resource unit",
  },
  {
    id: crypto.randomUUID(),
    name: "Community trust and cultural fit",
    description: "Does this approach work with the grain of the communities it serves?",
    type: "qualitative",
    weight: 15,
    isSeventhGeneration: false,
    isHonorableHarvest: false,
    scoringGuide: "0 = imposed, community resistant · 5 = accepted, some adaptation · 10 = community-owned, deep cultural fit",
  },
  {
    id: crypto.randomUUID(),
    name: "Seventh generation impact",
    description: "Does this approach serve the conditions for flourishing seven generations from now?",
    type: "qualitative",
    weight: 20,
    isSeventhGeneration: true,
    isHonorableHarvest: false,
    scoringGuide: "0 = degrades long-term conditions · 5 = neutral long-term · 10 = actively improves conditions for future generations",
  },
  {
    id: crypto.randomUUID(),
    name: "Reciprocity and give-back",
    description: "Does this approach give back to the communities and ecosystems it draws from?",
    type: "qualitative",
    weight: 15,
    isSeventhGeneration: false,
    isHonorableHarvest: true,
    scoringGuide: "0 = purely extractive · 5 = some reciprocity, informal · 10 = structured reciprocity, community benefit built in",
  },
];

export default function Phase2Standards({ data, horizonGoal, domain, onChange, onAdvance }) {
  const [localData, setLocalData] = useState(() => ({
    name: data.name || `${domain} Standards of Excellence`,
    criteria: data.criteria.length > 0 ? data.criteria : DEFAULT_CRITERIA,
  }));

  function updateName(name) {
    const updated = { ...localData, name };
    setLocalData(updated);
    onChange(updated);
  }

  function updateCriterion(id, field, value) {
    const updated = {
      ...localData,
      criteria: localData.criteria.map(c =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    };
    setLocalData(updated);
    onChange(updated);
  }

  function addCriterion() {
    const newC = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      type: "qualitative",
      weight: 0,
      isSeventhGeneration: false,
      isHonorableHarvest: false,
      scoringGuide: "",
    };
    const updated = { ...localData, criteria: [...localData.criteria, newC] };
    setLocalData(updated);
    onChange(updated);
  }

  function removeCriterion(id) {
    const updated = {
      ...localData,
      criteria: localData.criteria.filter(c => c.id !== id),
    };
    setLocalData(updated);
    onChange(updated);
  }

  const totalWeight = localData.criteria.reduce((sum, c) => sum + Number(c.weight || 0), 0);
  const weightsValid = Math.abs(totalWeight - 100) < 0.1;
  const canAdvance = localData.criteria.length >= 3 && weightsValid;

  return (
    <div className={styles.phaseWrap}>
      <div className={styles.phaseHeader}>
        <p className={styles.phaseEyebrow}>Layer 2 of 5</p>
        <h2 className={styles.phaseTitle}>Standards of Excellence</h2>
        <div className={styles.phaseDivider} />
        <p className={styles.phaseIntro}>
          The evaluation template for this domain. Built collectively by people who understand and care about it. Every criterion that matters to the decision, with a weight reflecting relative importance. Weights must total 100%. This step encodes collective values — what matters most, for this domain, in service of this Horizon Goal.
        </p>
      </div>

      {/* Horizon goal reminder */}
      <div className={styles.warning}>
        <p><strong>Horizon Goal:</strong> {horizonGoal.goalText || "Not yet set — return to Phase 1."}</p>
      </div>

      {/* Standards name */}
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Standards document name</label>
        <input
          className={styles.fieldInput}
          type="text"
          value={localData.name}
          onChange={e => updateName(e.target.value)}
        />
      </div>

      {/* Weight sum indicator */}
      <div className={`${styles.weightSum} ${weightsValid ? styles.weightSumOk : styles.weightSumBad}`}>
        Weights total: {totalWeight.toFixed(1)}% {weightsValid ? "✓ Valid" : `— must equal 100% (${(100 - totalWeight).toFixed(1)}% remaining)`}
      </div>

      {/* Criteria */}
      {localData.criteria.map((criterion, idx) => (
        <div key={criterion.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Criterion {idx + 1}</span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {criterion.isSeventhGeneration && (
                <span style={{ fontSize: "9px", fontFamily: "var(--sc)", letterSpacing: "0.1em", color: "var(--gold)", padding: "2px 8px", border: "1px solid var(--gold-rule)", borderRadius: "40px" }}>
                  7th Generation
                </span>
              )}
              {criterion.isHonorableHarvest && (
                <span style={{ fontSize: "9px", fontFamily: "var(--sc)", letterSpacing: "0.1em", color: "var(--gold)", padding: "2px 8px", border: "1px solid var(--gold-rule)", borderRadius: "40px" }}>
                  Honorable Harvest
                </span>
              )}
              <button className={styles.removeBtn} onClick={() => removeCriterion(criterion.id)}>Remove</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", gap: "12px", marginBottom: "12px" }}>
            <div className={styles.field} style={{ marginBottom: 0 }}>
              <label className={styles.fieldLabel}>Name</label>
              <input
                className={styles.fieldInput}
                type="text"
                value={criterion.name}
                onChange={e => updateCriterion(criterion.id, "name", e.target.value)}
                placeholder="Criterion name"
              />
            </div>

            <div className={styles.field} style={{ marginBottom: 0 }}>
              <label className={styles.fieldLabel}>Type</label>
              <select
                className={styles.fieldInput}
                value={criterion.type}
                onChange={e => updateCriterion(criterion.id, "type", e.target.value)}
              >
                <option value="quantitative">Quantitative</option>
                <option value="qualitative">Qualitative</option>
              </select>
            </div>

            <div className={styles.field} style={{ marginBottom: 0 }}>
              <label className={styles.fieldLabel}>Weight (%)</label>
              <input
                className={styles.fieldInput}
                type="number"
                min="0"
                max="100"
                value={criterion.weight}
                onChange={e => updateCriterion(criterion.id, "weight", Number(e.target.value))}
              />
            </div>
          </div>

          <div className={styles.field} style={{ marginBottom: "12px" }}>
            <label className={styles.fieldLabel}>Description</label>
            <input
              className={styles.fieldInput}
              type="text"
              value={criterion.description}
              onChange={e => updateCriterion(criterion.id, "description", e.target.value)}
              placeholder="What does this criterion measure?"
            />
          </div>

          <div className={styles.field} style={{ marginBottom: "12px" }}>
            <label className={styles.fieldLabel}>Scoring guide (0 / 5 / 10)</label>
            <input
              className={styles.fieldInput}
              type="text"
              value={criterion.scoringGuide}
              onChange={e => updateCriterion(criterion.id, "scoringGuide", e.target.value)}
              placeholder="What does a 0, 5, and 10 look like for this criterion?"
            />
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={criterion.isSeventhGeneration}
                onChange={e => updateCriterion(criterion.id, "isSeventhGeneration", e.target.checked)}
              />
              <span style={{ fontSize: "11px", fontFamily: "var(--sc)", letterSpacing: "0.10em", color: "var(--meta)" }}>Seventh Generation criterion</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={criterion.isHonorableHarvest}
                onChange={e => updateCriterion(criterion.id, "isHonorableHarvest", e.target.checked)}
              />
              <span style={{ fontSize: "11px", fontFamily: "var(--sc)", letterSpacing: "0.10em", color: "var(--meta)" }}>Honorable Harvest criterion</span>
            </label>
          </div>
        </div>
      ))}

      <button className={styles.addBtn} onClick={addCriterion}>
        + Add criterion
      </button>

      <button
        className={styles.advanceBtn}
        onClick={onAdvance}
        disabled={!canAdvance}
      >
        {canAdvance
          ? "Proceed to Candidate Evaluation →"
          : weightsValid
            ? "Add at least 3 criteria to proceed"
            : "Weights must total 100% to proceed"}
      </button>
    </div>
  );
}
