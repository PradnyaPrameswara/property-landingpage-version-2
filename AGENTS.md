# Von Falk Webflow — Agent Skills

Webflow static export (`index.html`, `about-us.html`, `projects.html`, `services.html`, `team.html`, `blog.html`, `contact.html`, `project/*`, `blog/*`). CSS/JS/images via CDN. MVP: replicate layout with Astro + TypeScript + React + Shadcn UI + Tailwind (no `useEffect`, no legacy, no Radix, use Base UI alternative).

## Agent skills

### Issue tracker

Local markdown under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five roles (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. See `docs/agents/domain.md`.

## Installed skills (`.agents/skills/`, verified with `npx skills list -a opencode`)

| Requested repo | Status | Installed as |
|---|---|---|
| https://github.com/mattpocock/skills | INSTALLED (38) | `ask-matt`, `code-review`, `codebase-design`, `diagnosing-bugs`, `domain-modeling`, `grill-with-docs`, `implement`, `improve-codebase-architecture`, `prototype`, `research`, `resolving-merge-conflicts`, `setup-matt-pocock-skills`, `tdd`, `to-spec`, `to-tickets`, `triage`, `wayfinder`, `wizard`, `grill-me`, `grilling`, `handoff`, `teach`, `to-questionnaire`, `wait-what`, `writing-for-agents`, + general (12) |
| https://github.com/addyosmani/agent-skills | INSTALLED (25) | `api-and-interface-design`, `browser-testing-with-devtools`, `ci-cd-and-automation`, `code-review-and-quality`, `code-simplification`, `constraint-driven-development`, `context-engineering`, `debugging-and-error-recovery`, `deprecation-and-migration`, `documentation-and-adrs`, `doubt-driven-development`, `frontend-ui-engineering`, `git-workflow-and-versioning`, `idea-refine`, `incremental-implementation`, `interview-me`, `observability-and-instrumentation`, `performance-optimization`, `planning-and-task-breakdown`, `security-and-hardening`, `shipping-and-launch`, `source-driven-development`, `spec-driven-development`, `test-driven-development` (overwritten by superpowers, see below), `using-agent-skills` |
| https://github.com/obra/superpowers | INSTALLED (15) | `brainstorming`, `diagnosing-superpowers`, `dispatching-parallel-agents`, `executing-plans`, `finishing-a-development-branch`, `receiving-code-review`, `requesting-code-review`, `subagent-driven-development`, `systematic-debugging`, `test-driven-development` (wins over addyosmani), `using-git-worktrees`, `using-superpowers`, `verification-before-completion`, `writing-plans`, `writing-skills` |
| https://github.com/JuliusBrussee/caveman | INSTALLED (20) | `cavecrew`, `caveman`, `caveman-commit`, `caveman-compress`, `caveman-discover`, `caveman-evidence-review`, `caveman-explore`, `caveman-help`, `caveman-learn`, `caveman-manage`, `caveman-optimize`, `caveman-review`, `caveman-setup`, `caveman-stats`, `investigate-first`, `lean-build`, `migration`, `safe-refactor`, `surgical-patch`, `verify-and-stop` |
| https://github.com/anvia-hq/lexa | INSTALLED (1) | `lexa` |
| https://github.com/dmmulroy/ anti-slop | INSTALLED (1) | `install-anti-slop`. Note: UI/copy filter family lives globally at `C:\Users\agung\.agents\skills\antislop*` (`antislop`, `antislop-ui`, `antislop-code`, `antislop-copywriting`, `antislop-human`, `antislop-layoutmobile`); use together. |
| https://github.com/justrach/codedb | NOT A SKILL REPO (0) | `npx skills add justrach/codedb` reports "No valid skills found". It is a code-search tool, not agent skills. No local install. |
| https://github.com/SilasMarvin/lsp-ai | NOT A SKILL REPO (0) | `npx skills add SilasMarvin/lsp-ai` reports "No valid skills found". It is an LSP tool, not agent skills. No local install. |

Total local: 99 dirs in `.agents/skills/`. Run `npx skills list -a opencode` to re-verify. Re-install/update with `npx skills add <owner/repo> --all -y -a opencode`.
