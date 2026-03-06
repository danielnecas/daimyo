# ⚔️ Daimyo

Your AI dev team in a browser — brainstorm, architect, ship.

Multi-agent workspace kde AI samurajové brainstormují, navrhují architekturu a reviewují tvůj projekt.

## Agenti

| Agent | Popis |
|-------|-------|
| 💡 Brainstorm | Product discovery, nápady, PRD |
| ⚙️ SW Engineer | Architektura, tech stack, systémový design |
| 🎨 UX Designer | Wireframy, user flows, design systém |
| 📋 Project Manager | Milníky, task breakdown, timeline |
| 🔍 Code Review | QA strategie, best practices, CI/CD |
| 🚀 DevOps | Infrastruktura, deployment, monitoring |
| ➕ Custom | Vytvoř si vlastního agenta s libovolnou rolí |

## Funkce

- **Handoff** — agent vytvoří strukturovaný dokument, který předáš dalšímu
- **Pipeline** — sestav řetězec agentů, výstupy se předávají automaticky
- **Custom agenti** — definuj si vlastní roli, system prompt, ikonu a barvu
- **Skills** — nauč agenty nové znalosti z videí, dokumentů, přednášek

---

## Požadavky

- [Node.js](https://nodejs.org/) 18+
- [Anthropic API klíč](https://console.anthropic.com/)

---

## Lokální spuštění

```bash
git clone https://github.com/TVUJ-USERNAME/daimyo.git
cd daimyo
npm install
npm run dev
```

Otevři http://localhost:3000 a zadej svůj Anthropic API klíč.

---

## Deploy na Vercel

```bash
cd daimyo
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/TVUJ-USERNAME/daimyo.git
git push -u origin main
```

1. Jdi na [vercel.com](https://vercel.com) → **"Add New Project"**
2. Vyber repozitář `daimyo`
3. Framework: **Vite** (detekuje se automaticky)
4. Klikni **"Deploy"**

---

## Bezpečnost

- API klíč se drží **pouze v paměti** prohlížeče
- Klíč se **nikam neukládá** (žádné cookies, localStorage, server)
- Po refreshi stránky je potřeba klíč zadat znovu
- Komunikace přímo mezi prohlížečem a Anthropic API (HTTPS)

---

## Jak to funguje

```
Uživatel → Brainstorm → "shrň to" → PRD
                                       ↓
                             SW Engineer → Architecture
                                       ↓
                             UX Designer → Design Doc
                                       ↓
                             PM → Project Plan
                                       ↓
                             Code Review → QA Report
                                       ↓
                             DevOps → Infrastructure Plan
```

---

## Tech Stack

- **React 18** + **Vite**
- **Anthropic API** (Claude Sonnet 4)
- **Vercel** (hosting)

## Licence

MIT
# daimyo
