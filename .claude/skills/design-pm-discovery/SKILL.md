---
name: design-pm-discovery
description: Product manager discovery skill — turns a raw user/product idea into a validated problem statement, target user, success metrics, non-goals, and a research brief before any pixel is drawn. Use whenever the user says things like "I want to build X", "here's a product idea", "help me scope this feature", "what should this product do", "write a PRD", "what are the success metrics for…", or arrives with an idea but no clear problem or KPI. Also use at the start of a full design pass orchestrated by design-orchestrator. Lean into this skill even if the user jumps straight to UI talk — a missing problem statement is the single most common reason designs get redone.
---

# PM Discovery

## Purpose

Stop designs from being built on vibes. Before anything is drawn, convert the user's idea into: a falsifiable problem, a target user, a JTBD, success metrics with instrumentation, explicit non-goals, and the riskiest assumption to validate.

A product team's #1 failure mode is skipping this step because it feels slow. It isn't — it prevents the much slower failure of shipping a feature nobody uses.

## When to use

- User proposes a feature or product idea.
- User asks for a PRD, spec, or "scope".
- User asks "what metrics should I track?"
- User starts with a solution ("we need a leaderboard") — reframe as a problem before designing it.
- First stage of `design-orchestrator`.

## Inputs

- The idea (free text, possibly vague).
- Business context if available: stage, users, constraints, deadlines.
- Any existing research, analytics, or support signals.

If context is missing, **infer explicitly** and mark inferences as `[assumption]`. Do not stall asking for details — produce a first-draft PRD with clearly-flagged assumptions so the user can correct cheaply.

## Process

1. **Restate the idea as a user problem.** Template: *"[User] struggles to [outcome] because [barrier]."* If you can't complete this, the idea isn't ready — say so.
2. **Identify target user + JTBD.** One primary segment. One Jobs-to-be-Done sentence.
3. **Define success metrics (≤ 4).** Pick from:
   - Task success rate
   - Time on task
   - CSAT / NPS
   - Retention (Dn)
   - Conversion / activation
   - One leading business KPI
   Each metric needs an instrumentation note: where it comes from.
4. **List non-goals.** These are mandatory. Non-goals prevent scope creep more than scope documents do.
5. **Enumerate assumptions, rank by risk.** "Users will trust X", "Users check this weekly", "Team can ship by Y".
6. **Pick a validation method for the riskiest one.** Interview, prototype test, analytics cut, fake-door test.
7. **Write the one-page PRD.**

## Output format

Always produce this exact structure:

```
# PRD — <feature>

## Problem
<one-sentence user problem>

## Target user
<segment + JTBD>

## Success metrics
| Metric | Target | Instrumentation |
|---|---|---|
| ...   | ...    | ...             |

## Non-goals
- ...
- ...

## Assumptions (ranked by risk)
1. [R1 — riskiest] ...
2. ...

## Validation plan
<method for R1, timeline, sample>

## Research brief
<3–5 questions for UX Researcher>

## Open questions
<things only the user can answer>
```

## Decisions

- **Cut scope to the riskiest assumption.** If you can't validate R1 cheaply, the rest is speculation.
- **Every feature maps to a metric.** If you can't attach a metric, defer the feature.
- **Prefer leading metrics to trailing.** Activation > MAU, time-to-value > retention, for early-stage work.
- **Never prescribe a UI.** The problem statement must survive five different UIs. If it doesn't, it's actually a UI statement in disguise.

## Constraints

- PRD ≤ 1 page.
- Non-goals section is never empty.
- Metrics are quantitative and measurable.
- No feature without a metric.
- No solution words in the problem statement ("dashboard", "button", "modal") — those belong in UX, not PM.

## Anti-patterns

| Smell | Why it's bad | Fix |
|---|---|---|
| "Users want X" as the problem | Solution disguised as problem | Ask *why* they want X; the barrier is the problem |
| Metrics = "engagement" | Unmeasurable, unfalsifiable | Pick a named event with a threshold |
| No non-goals | Scope will expand | Force at least 2 non-goals |
| "Nice to have" features | Hides prioritization debt | Defer to v2 list or cut |

## Collaboration

- **Produces for:** `design-ux-researcher` (research brief), `design-ux-designer` (constraints + metrics), `design-orchestrator` (gate: problem is falsifiable).
- **Receives from:** user; later, telemetry from `design-frontend-engineer`.
- **Feedback loop:** If telemetry misses targets, reopen discovery — don't patch UI.

## Example (compressed)

> **Idea:** "A dashboard for crypto holders."
>
> **Problem:** Multi-chain holders can't see unified P&L, forcing them to juggle 4+ tools.
>
> **User / JTBD:** Active retail holder, ≥3 chains. "When I check my portfolio, I want to know what changed, what matters, and what to do next."
>
> **Metrics:** Time-to-answer "24h P&L" < 10s (≥90%), reconciliation < 60s, D30 ≥ 35%, alert→action ≥ 20%.
>
> **Non-goals:** Trading execution v1, tax reporting v1, NFTs v1.
>
> **R1:** Users will connect wallets read-only to a third party.

That's the whole PRD. Short, concrete, testable.
