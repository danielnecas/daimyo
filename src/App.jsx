import { useState, useRef, useEffect, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════
   DAIMYO — Multi-Agent Workspace
   ═══════════════════════════════════════════════════════ */

const DEFAULT_AGENTS = [
  {
    id: "brainstorm",
    name: "Brainstorm",
    icon: "💡",
    color: "#F59E0B",
    description: "Kreativní partner pro nápady a product discovery",
    systemPrompt: `Jsi kreativní product brainstorming agent. Pomáháš prozkoumat a definovat nápady na aplikace/produkty.

Tvůj proces:
1. Ptej se na klíčové otázky (cílovka, problém, hodnota, konkurence)
2. Navrhuj možnosti a alternativy
3. Pomoz definovat MVP scope
4. Challenguj předpoklady

Když uživatel řekne "shrň to", "hotovo", "předej dál" nebo podobně, vytvoř STRUKTUROVANÝ VÝSTUP:

---HANDOFF_START---
# Product Requirements Document

## Název projektu
[název]

## Problém
[jaký problém řešíme]

## Cílová skupina
[pro koho to je]

## Klíčové funkce (MVP)
- [funkce 1]
- [funkce 2]

## User stories
- Jako [role] chci [akce] abych [důvod]

## Omezení a požadavky
[technické/business omezení]
---HANDOFF_END---

Piš česky, stručně ale precizně.`
  },
  {
    id: "engineer",
    name: "SW Engineer",
    icon: "⚙️",
    color: "#3B82F6",
    description: "Architekt — tech stack, struktura, systémový design",
    systemPrompt: `Jsi senior software engineer (15+ let). Navrhuješ architektury, tech stacky a systémový design. Jsi pragmatik.

Tvůj postup:
1. ANALÝZA — zhodnoť vstup, identifikuj nejasnosti
2. ARCHITEKTURA — high-level návrh (monolith/microservices, frontend/backend)
3. TECH STACK — konkrétní technologie + odůvodnění + alternativy
4. STRUKTURA — adresářová struktura projektu
5. DATA MODEL — entity a vztahy
6. PRIORITIZACE — co první, co později

Když uživatel řekne "shrň to" nebo "předej dál", vytvoř:

---HANDOFF_START---
# Technical Architecture Document

## Tech Stack
[vybrané technologie]

## Architektura
[popis architektury]

## Struktura projektu
[adresářová struktura]

## Data Model
[entity]

## API Endpointy
[hlavní endpointy]

## Deployment
[jak nasadit]
---HANDOFF_END---

Piš česky. Buď konkrétní — názvy knihoven, frameworků.`
  },
  {
    id: "ux",
    name: "UX Designer",
    icon: "🎨",
    color: "#EC4899",
    description: "UX/UI design, wireframy, user flows, design systém",
    systemPrompt: `Jsi senior UX/UI designer s 12+ lety zkušeností. Navrhuješ uživatelské rozhraní a zážitek.

Tvůj postup:
1. Analyzuj požadavky a cílovou skupinu
2. Navrhni user flow (hlavní cesty uživatele)
3. Popiš wireframe klíčových obrazovek (textově, strukturovaně)
4. Doporuč design systém (barvy, typografie, spacing)
5. Identifikuj UX problémy a navrhni řešení
6. Mysli na accessibility a responsive design

Když uživatel řekne "shrň to" nebo "předej dál":

---HANDOFF_START---
# UX/UI Design Document

## User Flows
[hlavní cesty]

## Klíčové obrazovky
[wireframe popis]

## Design System
[barvy, fonty, komponenty]

## Interakční vzory
[jak se appka chová]
---HANDOFF_END---

Piš česky. Buď vizuální — popisuj layouty konkrétně.`
  },
  {
    id: "pm",
    name: "Project Manager",
    icon: "📋",
    color: "#10B981",
    description: "Plánování, milníky, task breakdown, rizika",
    systemPrompt: `Jsi zkušený technický project manager. Plánuješ projekty, rozděluješ práci, identifikuješ rizika.

Tvůj postup:
1. Analyzuj scope projektu
2. Rozděl na milníky a fáze
3. Vytvoř task breakdown (konkrétní úkoly)
4. Odhadni časovou náročnost
5. Identifikuj rizika a závislosti
6. Navrhni team composition

Když uživatel řekne "shrň to" nebo "předej dál":

---HANDOFF_START---
# Project Plan

## Milníky
[fáze a milníky s časy]

## Task Breakdown
[konkrétní úkoly]

## Timeline
[harmonogram]

## Rizika
[rizika a mitigace]

## Team
[potřebné role]
---HANDOFF_END---

Piš česky. Buď realistický s odhady.`
  },
  {
    id: "codereview",
    name: "Code Review",
    icon: "🔍",
    color: "#8B5CF6",
    description: "Code review, QA strategie, testování, best practices",
    systemPrompt: `Jsi senior code reviewer a QA architect. Kontroluješ kvalitu kódu a navrhuješ testovací strategie.

Tvůj postup:
1. Analyzuj kód nebo technický návrh
2. Identifikuj problémy (bezpečnost, výkon, čitelnost, maintainability)
3. Navrhni testovací strategii (unit, integration, e2e)
4. Doporuč best practices a coding standards
5. Navrhni CI/CD pipeline pro kvalitu

Když uživatel řekne "shrň to":

---HANDOFF_START---
# Code Review & QA Report

## Nalezené problémy
[issues]

## Testovací strategie
[typy testů, coverage]

## Doporučení
[best practices]

## CI/CD
[pipeline návrh]
---HANDOFF_END---

Piš česky. Buď konstruktivní.`
  },
  {
    id: "devops",
    name: "DevOps",
    icon: "🚀",
    color: "#F97316",
    description: "Infrastruktura, CI/CD, deployment, monitoring",
    systemPrompt: `Jsi senior DevOps engineer a SRE. Navrhuješ infrastrukturu, CI/CD pipeline a monitoring.

Tvůj postup:
1. Analyzuj požadavky na infrastrukturu
2. Navrhni hosting/cloud strategii
3. Vytvoř CI/CD pipeline
4. Nastav monitoring a alerting
5. Řeš bezpečnost a škálovatelnost
6. Doporuč IaC nástroje

Když uživatel řekne "shrň to":

---HANDOFF_START---
# DevOps & Infrastructure Plan

## Hosting
[kde a jak]

## CI/CD Pipeline
[stages]

## Monitoring
[nástroje a metriky]

## Security
[opatření]

## Scaling
[strategie]
---HANDOFF_END---

Piš česky. Uváděj konkrétní nástroje a služby.`
  }
];

const MODEL = "claude-sonnet-4-20250514";

/* ─── Helpers ─── */
const extractHandoff = (text) => {
  const m = text.match(/---HANDOFF_START---([\s\S]*?)---HANDOFF_END---/);
  return m ? m[1].trim() : null;
};

const renderMd = (text, color) => {
  const clean = text.replace(/---HANDOFF_START---/g, "").replace(/---HANDOFF_END---/g, "");
  return clean.split("\n").map((line, i) => {
    if (line.startsWith("# ")) return <h1 key={i} style={{ fontSize: 17, fontWeight: 800, margin: "14px 0 6px", letterSpacing: "-0.02em" }}>{line.slice(2)}</h1>;
    if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: 14, fontWeight: 700, margin: "12px 0 4px", opacity: 0.9 }}>{line.slice(3)}</h2>;
    if (line.startsWith("### ")) return <h3 key={i} style={{ fontSize: 13, fontWeight: 700, margin: "10px 0 3px" }}>{line.slice(4)}</h3>;
    if (line.startsWith("- ")) return <div key={i} style={{ paddingLeft: 14, position: "relative", margin: "2px 0", lineHeight: 1.5 }}><span style={{ position: "absolute", left: 3, color, fontWeight: 700 }}>•</span>{line.slice(2)}</div>;
    if (line.startsWith("```")) return <code key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, background: "rgba(0,0,0,0.3)", padding: "1px 6px", borderRadius: 4, display: "inline-block" }}>{line.slice(3)}</code>;
    if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
    return <p key={i} style={{ margin: "2px 0", lineHeight: 1.55 }}>{line}</p>;
  });
};

/* ─── API Key Screen ─── */
function ApiKeyScreen({ onSubmit }) {
  const [key, setKey] = useState("");
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");

  const testAndSubmit = async () => {
    if (!key.startsWith("sk-ant-")) {
      setError("Klíč by měl začínat na sk-ant-...");
      return;
    }
    setTesting(true);
    setError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 10,
          messages: [{ role: "user", content: "test" }]
        })
      });
      if (res.ok) {
        onSubmit(key);
      } else {
        const data = await res.json();
        setError(data.error?.message || "Neplatný API klíč");
      }
    } catch (e) {
      setError("Nepodařilo se připojit k API. Zkontroluj připojení k internetu.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', -apple-system, sans-serif", background: "#0c0c14", color: "#e2e8f0" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ width: 420, padding: 36, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 8, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Daimyo</h1>
        <p style={{ fontSize: 14, opacity: 0.5, marginBottom: 32, lineHeight: 1.5 }}>Tvůj tým AI samurajů.<br />Potřebuješ Anthropic API klíč pro připojení.</p>

        <div style={{ textAlign: "left", marginBottom: 8 }}>
          <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.4 }}>API Klíč</label>
        </div>
        <input
          type="password"
          value={key}
          onChange={e => { setKey(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && testAndSubmit()}
          placeholder="sk-ant-..."
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: error ? "1px solid #EF4444" : "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#e2e8f0", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", outline: "none", boxSizing: "border-box", marginBottom: 8 }}
        />

        {error && <div style={{ fontSize: 12, color: "#EF4444", marginBottom: 8, textAlign: "left" }}>{error}</div>}

        <button
          onClick={testAndSubmit}
          disabled={!key || testing}
          style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: !key || testing ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: !key || testing ? "#555" : "#fff", fontWeight: 700, fontSize: 14, cursor: !key || testing ? "not-allowed" : "pointer", fontFamily: "inherit", marginTop: 8 }}
        >
          {testing ? "Ověřuji..." : "Připojit se"}
        </button>

        <div style={{ marginTop: 24, padding: 16, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", textAlign: "left" }}>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.4, marginBottom: 8 }}>JAK ZÍSKAT KLÍČ</div>
          <ol style={{ fontSize: 12, opacity: 0.5, lineHeight: 1.8, paddingLeft: 16, margin: 0 }}>
            <li>Jdi na <strong style={{ opacity: 1, color: "#3B82F6" }}>console.anthropic.com</strong></li>
            <li>Vytvoř účet nebo se přihlas</li>
            <li>Settings → API Keys → Create Key</li>
            <li>Dobij kredit (min. $5)</li>
          </ol>
        </div>

        <div style={{ marginTop: 16, fontSize: 11, opacity: 0.25 }}>
          🔒 Klíč se drží pouze v paměti prohlížeče. Nikam se neukládá ani neodesílá mimo Anthropic API.
        </div>
      </div>
    </div>
  );
}

/* ─── Create Agent Modal ─── */
function CreateAgentModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🤖");
  const [desc, setDesc] = useState("");
  const [prompt, setPrompt] = useState("");
  const [color, setColor] = useState("#6366F1");

  const colors = ["#6366F1", "#EF4444", "#14B8A6", "#F59E0B", "#EC4899", "#8B5CF6", "#3B82F6", "#10B981"];
  const icons = ["🤖", "🧠", "📊", "🛡️", "💬", "📝", "🔧", "🎯", "🏗️", "📐", "🔬", "💻"];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, animation: "fadeIn 0.2s ease" }}>
      <div style={{ background: "#1a1a2e", borderRadius: 16, padding: 28, width: 440, maxHeight: "85vh", overflowY: "auto", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 48px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.03em" }}>Nový Agent</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 20 }}>×</button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.5, display: "block", marginBottom: 6 }}>Ikona</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {icons.map(ic => (
              <button key={ic} onClick={() => setIcon(ic)} style={{ width: 36, height: 36, borderRadius: 8, border: icon === ic ? `2px solid ${color}` : "1px solid rgba(255,255,255,0.08)", background: icon === ic ? `${color}22` : "rgba(255,255,255,0.03)", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{ic}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.5, display: "block", marginBottom: 6 }}>Barva</label>
          <div style={{ display: "flex", gap: 6 }}>
            {colors.map(c => (
              <button key={c} onClick={() => setColor(c)} style={{ width: 28, height: 28, borderRadius: "50%", border: color === c ? "2px solid white" : "2px solid transparent", background: c, cursor: "pointer" }} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.5, display: "block", marginBottom: 6 }}>Název agenta</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="např. Security Auditor" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.5, display: "block", marginBottom: 6 }}>Popis (krátký)</label>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Co tento agent dělá..." style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.5, display: "block", marginBottom: 6 }}>System Prompt</label>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={"Detailní instrukce pro agenta...\n\nTip: Na konci přidej blok ---HANDOFF_START--- / ---HANDOFF_END--- pro předávání mezi agenty."} rows={8} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#e2e8f0", fontSize: 12.5, fontFamily: "'JetBrains Mono', monospace", outline: "none", resize: "vertical", lineHeight: 1.5, boxSizing: "border-box" }} />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#888", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Zrušit</button>
          <button onClick={() => { if (name && prompt) onCreate({ id: `custom_${Date.now()}`, name, icon, color, description: desc || "Custom agent", systemPrompt: prompt }); }} disabled={!name || !prompt} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: name && prompt ? color : "rgba(255,255,255,0.06)", color: name && prompt ? "#fff" : "#555", fontWeight: 700, fontSize: 13, cursor: name && prompt ? "pointer" : "not-allowed", fontFamily: "inherit" }}>Vytvořit</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Pipeline Modal ─── */
function PipelineModal({ agents, onClose, onStart, pipelineSteps, setPipelineSteps }) {
  const addStep = (agentId) => { if (pipelineSteps.length < 6) setPipelineSteps([...pipelineSteps, agentId]); };
  const removeStep = (idx) => setPipelineSteps(pipelineSteps.filter((_, i) => i !== idx));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, animation: "fadeIn 0.2s ease" }}>
      <div style={{ background: "#1a1a2e", borderRadius: 16, padding: 28, width: 480, border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 48px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>🔗 Pipeline Workflow</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 20 }}>×</button>
        </div>

        <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 16 }}>Sestav pipeline — výstup každého agenta se automaticky předá dalšímu. Klikni na agenta pro přidání.</div>

        <div style={{ minHeight: 56, background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 12, marginBottom: 16, border: "1px dashed rgba(255,255,255,0.08)" }}>
          {pipelineSteps.length === 0 ? (
            <div style={{ textAlign: "center", opacity: 0.3, fontSize: 12, padding: 8 }}>Přidej agenty kliknutím níže</div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {pipelineSteps.map((stepId, idx) => {
                const a = agents.find(ag => ag.id === stepId);
                return (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8, background: `${a.color}22`, border: `1px solid ${a.color}44`, fontSize: 12, fontWeight: 600, color: a.color }}>
                      {a.icon} {a.name}
                      <button onClick={() => removeStep(idx)} style={{ background: "none", border: "none", color: a.color, cursor: "pointer", fontSize: 14, padding: 0, marginLeft: 2, opacity: 0.6 }}>×</button>
                    </div>
                    {idx < pipelineSteps.length - 1 && <span style={{ opacity: 0.3, fontSize: 11 }}>→</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
          {agents.map(a => (
            <button key={a.id} onClick={() => addStep(a.id)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#ccc", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>{a.icon} {a.name}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#888", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Zrušit</button>
          <button onClick={onStart} disabled={pipelineSteps.length < 2} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: pipelineSteps.length >= 2 ? "linear-gradient(135deg, #3B82F6, #8B5CF6)" : "rgba(255,255,255,0.06)", color: pipelineSteps.length >= 2 ? "#fff" : "#555", fontWeight: 700, fontSize: 13, cursor: pipelineSteps.length >= 2 ? "pointer" : "not-allowed", fontFamily: "inherit" }}>Aktivovat pipeline</button>
        </div>
      </div>
    </div>
  );
}

/* ═══ MAIN APP ═══ */
function AgentWorkspace({ apiKey, onLogout }) {
  const [agents, setAgents] = useState(DEFAULT_AGENTS);
  const [activeAgentId, setActiveAgentId] = useState("brainstorm");
  const [conversations, setConversations] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showPipeline, setShowPipeline] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState([]);
  const [pipelineActive, setPipelineActive] = useState(false);
  const [pipelineCurrentIdx, setPipelineCurrentIdx] = useState(0);
  const [handoffData, setHandoffData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeAgent = useMemo(() => agents.find(a => a.id === activeAgentId), [agents, activeAgentId]);
  const currentConvo = conversations[activeAgentId] || [];

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conversations, activeAgentId]);
  useEffect(() => { inputRef.current?.focus(); }, [activeAgentId]);

  const getInitMsg = useCallback((agent) => ({
    role: "assistant",
    content: `Ahoj! Jsem **${agent.name}** ${agent.icon}. ${agent.description}. Jak ti můžu pomoct?`
  }), []);

  const updateConvo = useCallback((agentId, msgs) => {
    setConversations(prev => ({ ...prev, [agentId]: msgs }));
  }, []);

  const callAgent = useCallback(async (agentId, msgs) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return "Agent nenalezen.";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 2048,
          system: agent.systemPrompt,
          messages: msgs.map(m => ({ role: m.role, content: m.content }))
        })
      });
      if (!res.ok) {
        const err = await res.json();
        return `❌ API Error: ${err.error?.message || res.status}`;
      }
      const data = await res.json();
      return data.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "Prázdná odpověď.";
    } catch (e) {
      return `❌ Chyba: ${e.message}`;
    }
  }, [agents, apiKey]);

  const sendMessage = useCallback(async (overrideAgentId, overrideMsgs) => {
    const agentId = overrideAgentId || activeAgentId;
    let msgs;

    if (overrideMsgs) {
      msgs = overrideMsgs;
      updateConvo(agentId, msgs);
    } else {
      const prev = conversations[agentId] || [getInitMsg(agents.find(a => a.id === agentId))];
      msgs = [...prev, { role: "user", content: input }];
      updateConvo(agentId, msgs);
      setInput("");
    }

    setLoading(true);
    const reply = await callAgent(agentId, msgs);
    const newMsgs = [...msgs, { role: "assistant", content: reply }];
    updateConvo(agentId, newMsgs);

    const extracted = extractHandoff(reply);
    if (extracted) {
      setHandoffData(prev => ({ ...prev, [agentId]: extracted }));

      if (pipelineActive) {
        const currentStepIdx = pipelineSteps.indexOf(agentId);
        if (currentStepIdx >= 0 && currentStepIdx < pipelineSteps.length - 1) {
          const nextAgentId = pipelineSteps[currentStepIdx + 1];
          const nextAgent = agents.find(a => a.id === nextAgentId);
          setPipelineCurrentIdx(currentStepIdx + 1);
          setActiveAgentId(nextAgentId);

          const handoffMsgs = [
            getInitMsg(nextAgent),
            { role: "user", content: `Tady je výstup od agenta "${agents.find(a => a.id === agentId).name}". Analyzuj a pokračuj ve své roli.\n\n${extracted}` }
          ];
          setLoading(false);
          await sendMessage(nextAgentId, handoffMsgs);
          return;
        } else if (currentStepIdx === pipelineSteps.length - 1) {
          setPipelineActive(false);
        }
      }
    }

    setLoading(false);
  }, [activeAgentId, conversations, input, agents, callAgent, updateConvo, getInitMsg, pipelineActive, pipelineSteps]);

  const handleManualHandoff = useCallback((fromAgentId, toAgentId) => {
    const data = handoffData[fromAgentId];
    if (!data) return;
    const toAgent = agents.find(a => a.id === toAgentId);
    const fromAgent = agents.find(a => a.id === fromAgentId);
    setActiveAgentId(toAgentId);
    const msgs = [
      getInitMsg(toAgent),
      { role: "user", content: `Výstup od agenta "${fromAgent.name}":\n\n${data}` }
    ];
    updateConvo(toAgentId, msgs);
    setLoading(true);
    callAgent(toAgentId, msgs).then(reply => {
      updateConvo(toAgentId, [...msgs, { role: "assistant", content: reply }]);
      setLoading(false);
    });
  }, [handoffData, agents, getInitMsg, updateConvo, callAgent]);

  const handleSubmit = () => {
    if (!input.trim() || loading) return;
    if (!conversations[activeAgentId]?.length) {
      updateConvo(activeAgentId, [getInitMsg(activeAgent)]);
      setTimeout(() => sendMessage(), 50);
    } else {
      sendMessage();
    }
  };

  const startPipeline = () => { setShowPipeline(false); setPipelineActive(true); setPipelineCurrentIdx(0); setActiveAgentId(pipelineSteps[0]); };
  const clearConvo = (agentId) => { setConversations(prev => { const n = { ...prev }; delete n[agentId]; return n; }); setHandoffData(prev => { const n = { ...prev }; delete n[agentId]; return n; }); };

  const deleteAgent = (agentId) => {
    if (DEFAULT_AGENTS.find(a => a.id === agentId)) return;
    setAgents(prev => prev.filter(a => a.id !== agentId));
    clearConvo(agentId);
    if (activeAgentId === agentId) setActiveAgentId("brainstorm");
  };

  return (
    <div style={{ height: "100vh", display: "flex", fontFamily: "'DM Sans', -apple-system, sans-serif", background: "#0c0c14", color: "#e2e8f0" }}>

      {/* ─── Sidebar ─── */}
      <div style={{ width: sidebarOpen ? 260 : 52, minWidth: sidebarOpen ? 260 : 52, borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", background: "rgba(12,12,20,0.98)", transition: "all 0.25s ease", overflow: "hidden" }}>
        <div style={{ padding: sidebarOpen ? "14px 14px 10px" : "14px 8px 10px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, fontSize: 18, color: "#e2e8f0", flexShrink: 0 }}>{sidebarOpen ? "◀" : "▶"}</button>
          {sidebarOpen && <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.04em", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Daimyo</span>}
        </div>

        {sidebarOpen && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.3, padding: "8px 8px 6px" }}>Agenti</div>
              {agents.map(a => {
                const isActive = activeAgentId === a.id;
                const hasConvo = (conversations[a.id] || []).length > 0;
                const hasHandoff = !!handoffData[a.id];
                const isCustom = !DEFAULT_AGENTS.find(d => d.id === a.id);
                return (
                  <div key={a.id} onClick={() => setActiveAgentId(a.id)} style={{ padding: "8px 10px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginBottom: 2, transition: "all 0.15s", background: isActive ? `${a.color}15` : "transparent", border: isActive ? `1px solid ${a.color}30` : "1px solid transparent" }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{a.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: isActive ? a.color : "#ccc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                      <div style={{ fontSize: 10, opacity: 0.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.description}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                      {hasHandoff && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B98188" }} title="Handoff ready" />}
                      {hasConvo && <span style={{ width: 5, height: 5, borderRadius: "50%", background: a.color, opacity: 0.5 }} />}
                      {isCustom && <button onClick={e => { e.stopPropagation(); deleteAgent(a.id); }} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 12, padding: "0 2px" }}>×</button>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: "8px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", flexDirection: "column", gap: 4 }}>
              <button onClick={() => setShowCreate(true)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.12)", background: "transparent", color: "#888", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>+ Nový agent</button>
              <button onClick={() => setShowPipeline(true)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: "#888", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>🔗 Pipeline</button>
              <button onClick={onLogout} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)", background: "transparent", color: "#555", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Odpojit API klíč</button>
            </div>
          </>
        )}
      </div>

      {/* ─── Main ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 12, background: "rgba(12,12,20,0.95)" }}>
          <span style={{ fontSize: 22 }}>{activeAgent?.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: activeAgent?.color }}>{activeAgent?.name}</div>
            <div style={{ fontSize: 11, opacity: 0.4 }}>{activeAgent?.description}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
            {handoffData[activeAgentId] && (
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 10, opacity: 0.4, marginRight: 4 }}>Předat →</span>
                {agents.filter(a => a.id !== activeAgentId).slice(0, 4).map(a => (
                  <button key={a.id} onClick={() => handleManualHandoff(activeAgentId, a.id)} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${a.color}44`, background: `${a.color}11`, color: a.color, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 3 }}>{a.icon} {a.name}</button>
                ))}
              </div>
            )}
            {currentConvo.length > 0 && (
              <button onClick={() => clearConvo(activeAgentId)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#666", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Vyčistit</button>
            )}
          </div>
        </div>

        {/* Pipeline bar */}
        {pipelineActive && (
          <div style={{ padding: "8px 20px", background: "linear-gradient(90deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
            <span style={{ fontWeight: 700, opacity: 0.6 }}>🔗 Pipeline:</span>
            {pipelineSteps.map((stepId, idx) => {
              const a = agents.find(ag => ag.id === stepId);
              const isCurrent = idx === pipelineCurrentIdx;
              const isDone = idx < pipelineCurrentIdx;
              return (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, background: isCurrent ? `${a.color}33` : isDone ? `${a.color}15` : "rgba(255,255,255,0.03)", color: isCurrent ? a.color : isDone ? a.color : "#555", fontWeight: isCurrent ? 700 : 500, fontSize: 11, border: isCurrent ? `1px solid ${a.color}55` : "1px solid transparent" }}>{isDone ? "✓ " : ""}{a.icon} {a.name}</span>
                  {idx < pipelineSteps.length - 1 && <span style={{ opacity: 0.3 }}>→</span>}
                </div>
              );
            })}
            <button onClick={() => { setPipelineActive(false); setPipelineSteps([]); }} style={{ marginLeft: "auto", background: "none", border: "none", color: "#666", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Zrušit</button>
          </div>
        )}

        {/* Chat */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {(currentConvo.length === 0 ? [getInitMsg(activeAgent)] : currentConvo).map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div key={`${activeAgentId}-${i}`} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", animation: "fadeIn 0.25s ease" }}>
                <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: isUser ? "12px 12px 3px 12px" : "12px 12px 12px 3px", background: isUser ? "rgba(255,255,255,0.07)" : `${activeAgent.color}0D`, border: isUser ? "1px solid rgba(255,255,255,0.06)" : `1px solid ${activeAgent.color}1A`, fontSize: 13, lineHeight: 1.5 }}>
                  {!isUser && <div style={{ fontSize: 10, fontWeight: 700, color: activeAgent.color, marginBottom: 3, opacity: 0.8 }}>{activeAgent.icon} {activeAgent.name}</div>}
                  <div>{renderMd(msg.content, activeAgent.color)}</div>
                </div>
              </div>
            );
          })}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start", animation: "fadeIn 0.3s" }}>
              <div style={{ padding: "10px 16px", borderRadius: "12px 12px 12px 3px", background: `${activeAgent.color}0D`, border: `1px solid ${activeAgent.color}1A`, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 3 }}>{[0, 1, 2].map(j => <div key={j} style={{ width: 5, height: 5, borderRadius: "50%", background: activeAgent.color, animation: `pulse 1.2s ease-in-out ${j * 0.2}s infinite` }} />)}</div>
                <span style={{ fontSize: 11, opacity: 0.4 }}>{activeAgent.name} přemýšlí...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "10px 20px 14px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(12,12,20,0.95)" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }} placeholder={`Zpráva pro ${activeAgent?.name}...`} disabled={loading} rows={2} style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: `1px solid ${activeAgent?.color}28`, background: "rgba(255,255,255,0.03)", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none", lineHeight: 1.5 }} />
            <button onClick={handleSubmit} disabled={!input.trim() || loading} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: !input.trim() || loading ? "rgba(255,255,255,0.04)" : activeAgent?.color, color: !input.trim() || loading ? "#444" : "#fff", fontWeight: 700, fontSize: 13, cursor: !input.trim() || loading ? "not-allowed" : "pointer", fontFamily: "inherit", height: 42 }}>Odeslat</button>
          </div>
          <div style={{ marginTop: 6, fontSize: 10.5, opacity: 0.25, textAlign: "center" }}>Enter = odeslat · Shift+Enter = nový řádek · "shrň to" = vytvoří handoff dokument</div>
        </div>
      </div>

      {showCreate && <CreateAgentModal onClose={() => setShowCreate(false)} onCreate={(a) => { setAgents(prev => [...prev, a]); setShowCreate(false); }} />}
      {showPipeline && <PipelineModal agents={agents} onClose={() => setShowPipeline(false)} onStart={startPipeline} pipelineSteps={pipelineSteps} setPipelineSteps={setPipelineSteps} />}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 0.9; transform: scale(1.15); } }
        textarea:focus { border-color: ${activeAgent?.color}55 !important; background: rgba(255,255,255,0.05) !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

/* ═══ ROOT ═══ */
export default function App() {
  const [apiKey, setApiKey] = useState(null);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      {apiKey ? (
        <AgentWorkspace apiKey={apiKey} onLogout={() => setApiKey(null)} />
      ) : (
        <ApiKeyScreen onSubmit={setApiKey} />
      )}
    </>
  );
}
