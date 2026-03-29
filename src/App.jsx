import { useState, useEffect } from "react";
import Phase1HorizonGoal from "./phases/Phase1HorizonGoal";
import Phase2Standards from "./phases/Phase2Standards";
import Phase3Evaluation from "./phases/Phase3Evaluation";
import Phase4Break from "./phases/Phase4Break";
import Phase5Inquiry from "./phases/Phase5Inquiry";
import SessionComplete from "./phases/SessionComplete";
import styles from "./App.module.css";

const PHASES = [
  { num: 1, label: "Horizon Goal",          short: "Goal"       },
  { num: 2, label: "Standards of Excellence", short: "Standards" },
  { num: 3, label: "Candidate Evaluation",  short: "Evaluation" },
  { num: 4, label: "The Break",             short: "The Break"  },
  { num: 5, label: "Structured Inquiry",    short: "Inquiry"    },
];

const EMPTY_SESSION = {
  id: null,
  title: "",
  domain: "",
  fundingTrack: "retroactive",
  phase: 1,
  // Phase 1
  horizonGoal: {
    name: "",
    goalText: "",
    description: "",
    criteriaAssessment: {
      describesState: false,
      livingQuality: false,
      rightScale: false,
      evaluable: false,
      survivesCoreQuestion: false,
      notes: "",
    },
  },
  // Phase 2
  standards: {
    name: "",
    criteria: [],
  },
  // Phase 3
  candidates: [],
  // Phase 4
  breakScore: null,
  breakRationale: "",
  // Phase 5
  inquiryQuestions: [],
  // Meta
  status: "draft",
  createdAt: null,
  updatedAt: null,
};

export default function App() {
  const [session, setSession] = useState(EMPTY_SESSION);
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Auto-save to localStorage on every session change
  useEffect(() => {
    if (started && session.id) {
      localStorage.setItem(`da_session_${session.id}`, JSON.stringify(session));
    }
  }, [session, started]);

  function startSession(title, domain, fundingTrack) {
    const newSession = {
      ...EMPTY_SESSION,
      id: crypto.randomUUID(),
      title,
      domain,
      fundingTrack,
      phase: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSession(newSession);
    setStarted(true);
  }

  function updateSession(updates) {
    setSession(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }

  function advancePhase() {
    if (session.phase < 5) {
      updateSession({ phase: session.phase + 1 });
    } else {
      setComplete(true);
    }
  }

  function goToPhase(num) {
    if (num <= session.phase) {
      updateSession({ phase: num });
    }
  }

  function exportSession() {
    const data = JSON.stringify(session, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `da-session-${session.domain}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!started) {
    return <SessionSetup onStart={startSession} />;
  }

  if (complete) {
    return (
      <SessionComplete
        session={session}
        onExport={exportSession}
        onAdvanceStatus={(newStatus) => updateSession({ status: newStatus })}
      />
    );
  }

  return (
    <div className={styles.app}>
      <div className={styles.grain} aria-hidden="true" />

      {/* SITE NAV */}
      <nav className="nk-nav">
        <div className="nk-nav-inner">
          <a href="https://nextus.world/index.html" className="nk-nav-logo">
            <img src="https://nextus.world/logo_nav.png" alt="NextUs" />
          </a>
          <div className="nk-nav-links">
            <a href="https://nextus.world/index.html">Home</a>
            <a href="https://nextus.world/life-os.html">Life OS</a>
            <a href="https://nextus.world/nextus.html" className="active">NextUs</a>
            <a href="https://nextus.world/work-with-nik.html">Work with Nik</a>
            <a href="https://nextus.world/about.html">About</a>
            <a href="https://nextus.world/podcast.html">Podcast</a>
          </div>
          <a href="https://nextus.world/login.html" className="nk-profile-dot" id="nk-profile-dot" title="Sign in" style={{display:'none'}}>→</a>
          <button className="nk-hamburger" aria-label="Menu"
            onClick={(e) => { e.currentTarget.classList.toggle('open'); document.getElementById('nk-mob-da').classList.toggle('open'); }}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>
      <div id="nk-mob-da" className="nk-mobile-menu">
        <a href="https://nextus.world/index.html">Home</a>
        <a href="https://nextus.world/life-os.html">Life OS</a>
        <a href="https://nextus.world/nextus.html">NextUs</a>
        <a href="https://nextus.world/work-with-nik.html">Work with Nik</a>
        <a href="https://nextus.world/about.html">About</a>
        <a href="https://nextus.world/podcast.html">Podcast</a>
        <a href="https://nextus.world/login.html">Sign in →</a>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <p className={styles.eyebrow}>NextUs · Decision Analytics</p>
            <h1 className={styles.sessionTitle}>{session.title}</h1>
            <p className={styles.sessionMeta}>
              {session.domain} · {session.fundingTrack === "retroactive" ? "Retroactive" : "Prospective"} · {session.status}
            </p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.saveBtn} onClick={exportSession}>
              Export →
            </button>
          </div>
        </div>

        {/* Phase nav */}
        <nav className={styles.phaseNav}>
          {PHASES.map(p => (
            <button
              key={p.num}
              className={`${styles.phaseBtn} ${session.phase === p.num ? styles.phaseBtnActive : ""} ${p.num < session.phase ? styles.phaseBtnDone : ""} ${p.num > session.phase ? styles.phaseBtnLocked : ""}`}
              onClick={() => goToPhase(p.num)}
              disabled={p.num > session.phase}
            >
              <span className={styles.phaseNum}>
                {p.num < session.phase ? "✓" : `0${p.num}`}
              </span>
              <span className={styles.phaseLabel}>{p.short}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Phase content */}
      <main className={styles.main}>
        {session.phase === 1 && (
          <Phase1HorizonGoal
            data={session.horizonGoal}
            domain={session.domain}
            onChange={(horizonGoal) => updateSession({ horizonGoal })}
            onAdvance={advancePhase}
          />
        )}
        {session.phase === 2 && (
          <Phase2Standards
            data={session.standards}
            horizonGoal={session.horizonGoal}
            domain={session.domain}
            onChange={(standards) => updateSession({ standards })}
            onAdvance={advancePhase}
          />
        )}
        {session.phase === 3 && (
          <Phase3Evaluation
            candidates={session.candidates}
            standards={session.standards}
            domain={session.domain}
            onChange={(candidates) => updateSession({ candidates })}
            onAdvance={advancePhase}
          />
        )}
        {session.phase === 4 && (
          <Phase4Break
            candidates={session.candidates}
            breakScore={session.breakScore}
            breakRationale={session.breakRationale}
            onChange={(data) => updateSession(data)}
            onAdvance={advancePhase}
          />
        )}
        {session.phase === 5 && (
          <Phase5Inquiry
            candidates={session.candidates}
            breakScore={session.breakScore}
            inquiryQuestions={session.inquiryQuestions}
            domain={session.domain}
            horizonGoal={session.horizonGoal}
            onChange={(inquiryQuestions) => updateSession({ inquiryQuestions })}
            onAdvance={advancePhase}
          />
        )}
      </main>
    </div>
  );
}

// ── SESSION SETUP ──
function SessionSetup({ onStart }) {
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("");
  const [fundingTrack, setFundingTrack] = useState("retroactive");

  const DOMAINS = [
    "Human Being", "Society", "Nature", "Technology",
    "Finance & Economy", "Legacy", "Vision"
  ];

  function handleStart(e) {
    e.preventDefault();
    if (!title.trim() || !domain) return;
    onStart(title.trim(), domain, fundingTrack);
  }

  return (
    <div className={styles.setup}>
      <div className={styles.grain} aria-hidden="true" />

      {/* SITE NAV */}
      <nav className="nk-nav">
        <div className="nk-nav-inner">
          <a href="https://nextus.world/index.html" className="nk-nav-logo">
            <img src="https://nextus.world/logo_nav.png" alt="NextUs" />
          </a>
          <div className="nk-nav-links">
            <a href="https://nextus.world/index.html">Home</a>
            <a href="https://nextus.world/life-os.html">Life OS</a>
            <a href="https://nextus.world/nextus.html" className="active">NextUs</a>
            <a href="https://nextus.world/work-with-nik.html">Work with Nik</a>
            <a href="https://nextus.world/about.html">About</a>
            <a href="https://nextus.world/podcast.html">Podcast</a>
          </div>
          <a href="https://nextus.world/login.html" className="nk-profile-dot" id="nk-profile-dot" title="Sign in" style={{display:'none'}}>→</a>
          <button className="nk-hamburger" aria-label="Menu"
            onClick={(e) => { e.currentTarget.classList.toggle('open'); document.getElementById('nk-mob-da').classList.toggle('open'); }}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>
      <div id="nk-mob-da" className="nk-mobile-menu">
        <a href="https://nextus.world/index.html">Home</a>
        <a href="https://nextus.world/life-os.html">Life OS</a>
        <a href="https://nextus.world/nextus.html">NextUs</a>
        <a href="https://nextus.world/work-with-nik.html">Work with Nik</a>
        <a href="https://nextus.world/about.html">About</a>
        <a href="https://nextus.world/podcast.html">Podcast</a>
        <a href="https://nextus.world/login.html">Sign in →</a>
      </div>

      <div className={styles.setupInner}>
        <p className={styles.eyebrow}>NextUs · Decision Analytics</p>
        <h1 className={styles.setupTitle}>New Session</h1>
        <div className={styles.setupDivider} />
        <p className={styles.setupIntro}>
          Decision Analytics is a process of elimination. It reduces a large field of candidates — solutions, approaches, organisations — to a defensible shortlist using weighted, scored criteria. The model finds the natural statistical break. The break does the eliminating, not a person's opinion.
        </p>

        <form className={styles.setupForm} onSubmit={handleStart}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Session title</label>
            <input
              className={styles.fieldInput}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Nature Domain — Regenerative Agriculture Approaches"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Domain</label>
            <select
              className={styles.fieldInput}
              value={domain}
              onChange={e => setDomain(e.target.value)}
              required
            >
              <option value="">Select domain</option>
              {DOMAINS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Funding track</label>
            <div className={styles.trackRow}>
              {["retroactive", "prospective"].map(t => (
                <label key={t} className={`${styles.trackOption} ${fundingTrack === t ? styles.trackOptionActive : ""}`}>
                  <input
                    type="radio"
                    name="track"
                    value={t}
                    checked={fundingTrack === t}
                    onChange={() => setFundingTrack(t)}
                  />
                  <div>
                    <strong>{t === "retroactive" ? "Retroactive" : "Prospective"}</strong>
                    <span>{t === "retroactive"
                      ? "Reward demonstrated impact — it is easier to agree on what was useful than what will be."
                      : "Fund promising approaches before results exist — stage-appropriate potential."
                    }</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            className={styles.startBtn}
            type="submit"
            disabled={!title.trim() || !domain}
          >
            Begin Session →
          </button>
        </form>
      </div>
    </div>
  );
}
