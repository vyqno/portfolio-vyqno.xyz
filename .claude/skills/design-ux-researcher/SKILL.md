---
name: design-ux-researcher
description: UX research skill — replaces assumptions with evidence using the right mix of qualitative and quantitative methods. Use whenever the user says "talk to users", "run a study", "do user research", "validate this assumption", "write interview questions", "what do users actually want", "build personas", "map the user journey", or hands over a PRD that needs validation. Also use as stage 2 of design-orchestrator, right after design-pm-discovery. Use aggressively whenever a design decision is being made from intuition alone — research is the cheapest way to kill a bad idea before it costs engineering time.
---

# UX Researcher

## Purpose

Design decisions without evidence are expensive guesses. This skill pairs questions to methods, runs synthesis that survives stakeholder scrutiny, and outputs insights that are rank-ordered by frequency × severity — not by whichever quote was loudest.

## When to use

- PM brief arrives with an untested assumption.
- Team is debating a design direction with no data to settle it.
- User asks for personas, journeys, or JTBD statements.
- Usability issues are suspected but not located.
- Stage 2 of `design-orchestrator`.

## Inputs

- Research brief (from `design-pm-discovery`).
- Existing analytics, support tickets, session recordings.
- Access to users (or recruited participants).

## Process

### 1. Pick the method from the question

| Question shape | Method |
|---|---|
| "Why do users…" | Interviews (6–8 per segment) |
| "How many users…" | Survey or analytics cut |
| "Can users accomplish X?" | Moderated usability test (5 users → 80% of issues) |
| "Which version wins?" | A/B or preference test |
| "What does a week look like?" | Diary study |
| "What's happening in the product?" | Session replay + funnel analysis |

Mixing qual + quant is almost always better than one alone: qual explains *why*, quant measures *how much*.

### 2. Build the script

- Open-ended, non-leading questions.
- Tasks before opinions ("show me how you…" > "what would you like?").
- Pilot with 1 user; rewrite what confused them.
- Keep to 45 min; fatigue ruins later sessions.

### 3. Run sessions

- Capture verbatim + behavior, not just opinions.
- Note *what they did*, not just what they said — users mis-report their own behavior.
- Record where permitted; timestamp key moments.

### 4. Synthesize

- Affinity map raw observations → themes.
- Themes → insights (what's true about the user).
- Insights → opportunities (what the product could do).
- Rank opportunities by **frequency × severity**.

### 5. Deliver

- Personas / JTBD.
- Journey map with pain points marked.
- Insight deck: each insight backed by ≥ 2 sources.

## Output format

```
# Research Report — <study name>

## Method
<qual/quant mix, sample, recruitment criteria>

## Key findings (ranked)
1. <insight> — evidence: <source1>, <source2> — severity: H/M/L, frequency: n/N
2. ...

## Persona / JTBD
<one per segment, concrete not archetypal>

## Journey map
<stages → actions → thoughts → pains → opportunities>

## Opportunities (ranked)
1. ...
2. ...

## What we DIDN'T learn
<open questions + recommended next study>

## Quotes (verbatim, anonymized)
```

## Decisions

- **Qual for *why*, quant for *how much*.** Using qual to size a market is a category error.
- **Behavior > stated preference.** Treat "I would use this" as noise unless paired with a behavior.
- **Kill features no pain supports.** If three interviews surface zero pain, the PRD is wrong — send it back.
- **≥ 2 sources per insight.** One loud user is a quote, not an insight.

## Constraints

- No leading questions. ("Don't you think X is frustrating?" → "Walk me through the last time you did this.")
- Report negatives as loudly as positives.
- Anonymize before sharing externally.
- Never promise product changes in sessions.

## Anti-patterns

| Smell | Fix |
|---|---|
| "Users said they want X" as a finding | Reframe as the underlying pain |
| Research that confirms the spec | Pilot should have disconfirmed something |
| 20-question survey | Cut to the 5 that change a decision |
| Personas based on demographics | Use behaviors + JTBD instead |

## Collaboration

- **Receives from:** `design-pm-discovery` (research brief).
- **Produces for:** `design-ux-designer` (personas, pains), `design-pm-discovery` (validates or rejects R1).
- **Ongoing loop:** Validates prototypes from `design-interaction-designer`; reviews telemetry from `design-frontend-engineer`.

## Example (compressed)

> **Study:** 8 interviews with multi-chain crypto holders.
>
> **Top findings:**
> 1. Users conflate "portfolio value" with "P&L" — need both, side-by-side. (7/8, severity H)
> 2. Alert fatigue — want actionable, not informational alerts. (6/8, H)
> 3. Trust depends on read-only + provenance, not brand. (5/8, H)
> 4. Rebalance suggestions ignored unless they show *why*. (5/8, M)
>
> **Opportunities (ranked):** Actionable alerts > dual P&L view > trust primitives > rebalance explanations.
