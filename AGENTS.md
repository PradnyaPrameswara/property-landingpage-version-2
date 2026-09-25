# Von Falk Webflow — Agent Skills

Webflow static export (`index.html`, `about-us.html`, `projects.html`, `services.html`, `team.html`, `blog.html`, `contact.html`, `project/*`, `blog/*`). CSS/JS/images via CDN. MVP: replicate layout with Astro + TypeScript + React + Shadcn UI + Tailwind (no `useEffect`, no legacy, no Radix, use Base UI alternative).

## MVP tech stack + migration workflow

Full contract: `docs/prd-von-falk-deployment.md` (combines `docs/von-falk-replication-reference.md` + `docs/hardening-audit.md`). Sources: `docs/agents/issue-tracker.md`, `docs/agents/domain.md`.

### Tech stack (outlined, in `von-falk-mvp/`)

Astro 7 static + TS strict + React 19 islands (`client:visible`, `useState` only) + Shadcn Base-UI Nova (61 components, 0 Radix) + Tailwind v4 + lucide. Constraints: no `useEffect`, no legacy, no Radix. Commands (in `von-falk-mvp/`): `npm run dev|build|preview|lint|typecheck|format`.

### Duplication migration workflow (phases → structure)

One concern per branch, one PR per phase slice; skill chain per slice: plan → `incremental-implementation` + `tdd` → `code-review` → `verification-before-completion` → commit → PR.

- Phase 0 Freeze + tokens → `src/styles/global.css`, `src/assets/` (14 basenames vendored, deduped).
- Phase 1 Shell → `src/layouts/` (BaseLayout/Navbar/Footer), 14 routes render.
- Phase 2 Pages + CMS → `src/pages/**`, collections (projects 3/blog 3/services 7/team), real copy + alts.
- Phase 3 Islands + motion → `src/components/react/` (POST ContactForm, accordion, facade map), CSS scroll reveals.
- Phase 4 Hardening closure → drop `cmdk`, `output:"static"` + CSP/headers, widened ESLint.
- Phase 5 Deploy → `npm run build`, click-through evidence, antislop gate, PR.

Structure rule: export HTML frozen (never edit); fixes land in `von-falk-mvp/`. Wayfinder map: `.scratch/hardening/`.

## Agent skills

### Issue tracker

Local markdown under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five roles (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. See `docs/agents/domain.md`.

## Installed skills (`.agents/skills/`, 99 dirs, verified with `npx skills list -a opencode`)

| Requested repo | Status | Installed as |
|---|---|---|
| https://github.com/mattpocock/skills | INSTALLED (38) | engineering + productivity + general families (see catalog) |
| https://github.com/addyosmani/agent-skills | INSTALLED (25) | lifecycle skillsBox (see catalog) |
| https://github.com/obra/superpowers | INSTALLED (15) | superpowers methodology (see catalog) |
| https://github.com/JuliusBrussee/caveman | INSTALLED (20) | caveman family (see catalog) |
| https://github.com/anvia-hq/lexa | INSTALLED (1) | `lexa` |
| https://github.com/dmmulroy/ anti-slop | INSTALLED (1) | `install-anti-slop`. UI/copy filter family lives globally at `C:\Users\agung\.agents\skills\antislop*`; use together. |
| https://github.com/justrach/codedb | NOT A SKILL REPO (0) | Code-search tool, no `SKILL.md`. No local install. |
| https://github.com/SilasMarvin/lsp-ai | NOT A SKILL REPO (0) | LSP tool, no `SKILL.md`. No local install. |

Re-install/update with `npx skills add <owner/repo> --all -y -a opencode`. Local `.agents/` is gitignored; restore via `skills-lock.json`.

## Skill catalog — function and when the agent uses it

Rule: check this catalog before starting work; follow the matched skill workflow, including its verification step. Several skills can apply in sequence (define → plan → build → verify → review → ship).

### Start here (routing)

- `using-agent-skills` — maps incoming work to the right skill. Use at session start or whenever unsure which skill applies.
- `using-superpowers` — superpowers bootstrap. Establishes skill lookup before any response.
- `ask-matt` — router over mattpocock skills. Use when unsure which engineering flow fits.
- `context-engineering` — packs the right context (rules files, spec sections) for the task. Use at session start, task switches, or quality drops.

### Define (clarify before code)

- `interview-me` — one-question-at-a-time interview to ~95% intent confidence. Use when the ask is underspecified.
- `grill-me` / `grilling` — relentless interview to sharpen a plan or design. Use to stress-test thinking; `grilling` is the reusable primitive.
- `grill-with-docs` — grilling that also builds `CONTEXT.md` glossary + ADRs. Use when terminology or decisions need recording.
- `idea-refine` — divergent/convergent refinement of vague ideas. Use before planning when options need exploring.
- `spec-driven-development` — writes the spec (objective, commands, structure, style, tests, boundaries) before code. Use for any multi-file change or ambiguous requirement.
- `constraint-driven-development` — records the quality bar in `CONSTRAINTS.md` and watches the diff for a weakened bar. Use when no standards are written down.
- `to-spec` — turns the current conversation into a spec on the tracker. Use after discussion, no interview.
- `to-questionnaire` — turns an unanswerable decision into an async questionnaire. Use when only someone else can decide.
- `domain-modeling` — sharpens `CONTEXT.md` terms + ADRs. Use when naming concepts or resolving terminology.
- `brainstorming` — Socratic design refinement before creative work. Mandatory before features/components/behavior changes under superpowers.
- `research` — investigates against primary sources into a cited repo file. Use when facts outside the working dir are needed.
- `prototype` — throwaway artifact (HTML stub or UI variants) to answer a design question. Use when reacting beats describing.

### Plan

- `planning-and-task-breakdown` — decomposes specs into small verifiable tasks with dependencies. Use with a spec in hand.
- `to-tickets` — publishes tracer-bullet tickets with blocking edges to the tracker. Use to hand off planned work.
- `wayfinder` — charts huge efforts as a map of decision tickets in `.scratch/`. Use when the route needs finding before doing; one ticket per session.
- `writing-plans` — detailed implementation plans (exact paths, code, verification). Use before touching code on multi-step tasks.
- `wizard` — generates a bash wizard for human-only steps (credentials, dashboards,infra). Use when the agent cannot act itself.

### Build

- `incremental-implementation` — thin vertical slices: implement, test, verify, commit. Use for any multi-file change.
- `implement` / `implement-spec` — builds from a spec or tickets (with TDD at seams + review before commit). Use during execution.
- `subagent-driven-development` / `executing-plans` / `dispatching-parallel-agents` — plan execution modes (fresh subagent per task vs inline vs parallel). Use per plan size and independence.
- `frontend-ui-engineering` — production UI (components, responsive, WCAG AA, state). Use for any user-facing interface work.
- `api-and-interface-design` — contract-first interfaces (REST/GraphQL/props/schemas). Use when designing module boundaries or endpoints.
- `source-driven-development` — grounds decisions in official docs with citations. Use when framework correctness matters.
- `doubt-driven-development` — adversarial fresh-context review of non-trivial decisions. Use when stakes are high or code is unfamiliar.
- `test-driven-development` / `tdd` — red-green-refactor. Use before writing any implementation or bugfix code.
- `lean-build` — strict-scope builds with reuse-first and stop conditions. Use for new behavior at risk of overbuilding.
- `safe-refactor` / `surgical-patch` / `migration` — behavior-preserving restructure / narrowest-layer fix / reversible migration with rollback proof. Use per change shape.
- `codebase-design` — deep-module vocabulary (seams, interfaces, testability). Use when placing module boundaries.
- `improve-codebase-architecture` — surveys deepening opportunities as an HTML report + grill. Use periodically on the codebase.
- `lean-build`, `migration`, `safe-refactor`, `surgical-patch` live with caveman family but follow the same trigger rules.
- `lexa` — fast local codebase intelligence (symbols, deps, outlines, patches) via CLI/MCP. Use for explore/search/map/inspect/summarize/audit tasks.
- `cavecrew` — compressed subagent presets (`investigator` locate, `builder` ≤2-file edit, `reviewer` diff audit). Use to save context on locate/fix/verify chains.
- `caveman-explore` — read-only repo orientation with path:line citations. Use for cold starts or failed searches.
- `investigate-first` — evidence-ranked diagnosis before editing. Use for ambiguous failures.

### Verify

- `browser-testing-with-devtools` — live Chrome runtime data (DOM, console, network, perf). Use for anything running in a browser (requires DevTools MCP).
- `debugging-and-error-recovery` / `diagnosing-bugs` / `systematic-debugging` — reproduce → localize → fix → guard loops. Use when tests fail or behavior surprises.
- `verification-before-completion` — runs verification commands before claiming done. Use before every commit/PR claim.
- `verify-and-stop` — proves acceptance without expanding scope. Use for validation-only tasks.
- `diagnosing-superpowers` — diagnoses a misbehaving superpowers session with evidence. Use when the process itself went wrong.

### Review

- `code-review` — two-axis diff review (Standards + Spec) via parallel subagents. Use on branches/PRs/WIP.
- `code-review-and-quality` — five-axis review gate. Use before every merge.
- `requesting-code-review` / `receiving-code-review` — pre-review checklist / rigorous response to feedback. Use around reviews.
- `code-simplification` — reduces complexity preserving behavior. Use when code works but is hard to maintain.
- `security-and-hardening` — OWASP/input/auth/secrets/dependency audit. Use for untrusted data, auth, sessions, third-party integrations, PII.
- `performance-optimization` — measure-first perf work. Use for vitals, load, queries, regressions.
- `deprecation-and-migration` — safe removal/migration of old systems. Use when sunsetting code or moving users/data.
- `caveman-review` — compressed one-line-per-finding diff review. Use for fast PR/diff checks.
- `caveman-evidence-review` — read-only cost/quality evidence review. Use when asked what was found or spent.

### Ship

- `git-workflow-and-versioning` — branching, atomic commits, conflict resolution, releases. Use for every code change (plus Git workflow rules below).
- `using-git-worktrees` — isolated worktree per feature. Use when starting work needing isolation.
- `finishing-a-development-branch` — test verification + merge/PR/keep/discard decision + cleanup. Use when tasks complete.
- `resolving-merge-conflicts` — hunk-by-hunk intent-traced resolution. Use during merge/rebase conflicts.
- `ci-cd-and-automation` — pipelines and quality gates. Use when setting up builds, tests, deploys.
- `documentation-and-adrs` — records the why (ADRs, API docs). Use for architectural decisions and shipped features.
- `observability-and-instrumentation` — logs/metrics/traces/alerts. Use for anything running in production.
- `shipping-and-launch` — pre-launch checklist, rollout, rollback, monitoring. Use before production deploys.
- `caveman-commit` — Conventional Commits message from intent. Use when writing commit messages.
- `caveman-setup` / `caveman-manage` / `caveman-stats` / `caveman-learn` / `caveman-optimize` / `caveman-discover` / `caveman-compress` / `caveman` / `caveman-help` — measurement gateway setup, experiment lifecycle, usage stats, token-cost fixes, workflow discovery, memory compression, terse mode, help. Use per trigger phrase.
- `install-anti-slop` — vendors Oxlint anti-slop plugins. Use when adding/updating lint rules (with global `antislop*` UI/copy filters for interface work).
- `pr` — writes the PR body. Use when opening a pull request.
- `handoff` / `claude-handoff` / `teach` / `retro` / `wait-what` / `to-tickets` — session handoff docs, concept teaching, retrospectives, re-pitch on confusion, ticket publishing. Use per trigger.
- `setup-matt-pocock-skills` — configures tracker/labels/domain docs. Run once per repo (done here).
- `setup-pre-commit` / `setup-ts-deep-modules` / `git-guardrails-claude-code` / `migrate-to-shoehorn` / `scaffold-exercises` / `implement-spec` / `loop-me` / `writing-beats` / `writing-fragments` / `writing-shape` — one-shot project setups and writing/course helpers. Use on explicit request only.

## Git workflow (mandatory for every future branch, commit, PR)

Follow `git-workflow-and-versioning`; these project rules apply on top. Never add a co-author (`Co-authored-by` trailers forbidden).

- Branches: `main` is protected. Name every branch `<type>/<slug>` with kebab-case slug: `feature/`, `fix/`, `docs/`, `chore/`, `refactor/`, `audit/` (e.g. `feature/contact-form-post`, `fix/form-get-leak`). One concern per branch from `main`.
- Commits: Conventional Commits, imperative subject ≤72 chars: `feat|fix|docs|chore|refactor|audit|test|ci` (e.g. `fix: post contact form over https`). Stage only intended files; inspect `git status`, `git diff` before committing. Never commit secrets, `.agents/`, `node_modules/`, or unrelated cleanup.
- Pull requests: title mirrors the commit convention (`feat: ...`). Body must have Summary, Changes, Verification (commands + output), and Screenshots for UI. `git log --oneline -10` + full diff reviewed before opening. One PR per concern; rebase onto `main` before requesting review.
- Never: `--force` pushes to `main`, empty commits, `--no-verify`, amending pushed commits without instruction, or `Co-authored-by` lines.
