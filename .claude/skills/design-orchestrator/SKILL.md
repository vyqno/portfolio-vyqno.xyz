---
name: design-orchestrator
description: Multi-agent design team orchestrator. Runs the PM → Research → UX → UI → Visual → Interaction → Design System → Frontend pipeline to turn a product idea into a shippable, justified design. Use this whenever the user says "design a feature", "design a screen", "design this page", "spec this product", "I want to build X, help me design it", or brings any ambiguous product idea that needs to go from concept to a concrete, implementable design. Also use when the user asks for an end-to-end product design pass, wants competing design critiques, or says things like "think like a design team" / "give me a full design brief". Prefer this over a single design skill whenever the problem is larger than one role (e.g. more than just "pick a color" or "animate this"). Do not use for pure code changes with no design ambiguity.
---

# Design Team Orchestrator

## Purpose

Most real product work fails not because any single role is weak, but because the roles don't pass clean batons. This skill makes Claude simulate a full design team with explicit handoffs, gates, and feedback loops — so the final artifact is justified by research, structured by UX, rendered by UI, systematized by DS, and implementable by FE, rather than hand-waved.

## When to invoke the pipeline

Trigger the full pipeline when any of these are true:

- The user has a product/feature idea but no validated problem.
- The user wants a screen/flow designed, not just a stylistic tweak.
- The problem touches ≥ 3 of: user value, flow, visual, motion, system, code.
- The user asks for an "end-to-end" or "full design" pass.

Skip the pipeline (and hand off to a single skill) when the ask is scoped to one role — "just pick a color", "just animate this", "just wire this button".

## The pipeline

```
[Idea]
  ├─▶ design-pm-discovery           → problem, users, metrics, non-goals
  ├─▶ design-ux-researcher          → personas, JTBD, journey, ranked pains
  ├─▶ design-ux-designer            → flow, IA, lo-fi, state matrix
  ├─▶ design-ui-designer ⇄ design-visual-designer
  │                                 → hi-fi, brand tokens, hierarchy
  ├─▶ design-interaction-designer   → motion spec, prototype
  ├─▶ design-system-architect       → tokens, components, docs
  └─▶ design-frontend-engineer      → production code + a11y report
```

Each arrow is a handoff. Each handoff has a **gate** the upstream artifact must pass before the next role starts.

## Handoff gates

| Handoff | Gate (fail = go back) |
|---|---|
| PM → Researcher | Problem is falsifiable; ≥ 1 success metric defined |
| Researcher → UX | Every insight has ≥ 2 sources |
| UX → UI | Every screen has all states enumerated (empty/loading/error/success/permission) |
| UI → DS | New component proposals have passed "does an existing primitive solve this?" |
| DS → FE | Tokens + a11y notes + RTL + dark-mode covered |
| FE → Ship | WCAG AA, LCP < 2.5s, CLS < 0.1, INP < 200ms |

If a gate fails, return to the upstream role rather than patching downstream. Patching downstream is how design systems accumulate debt.

## Execution pattern

For each invocation:

1. **Classify the ask.** Is this full-pipeline, or a single role? If single, stop and defer to that role's skill.
2. **Run roles in order.** Each role reads its own skill (`design-*`), produces its artifact, and explicitly states which gate it's passing.
3. **Announce role transitions.** Output `── Handing off to <next role> ──` between stages so the user can stop or redirect.
4. **Compress outputs.** Each role's output should be dense and actionable, not narrative. Tables, bullets, concrete specs.
5. **Record assumptions.** Any time a role infers something the user didn't say, mark it `[assumption]` so the user can correct it cheaply.
6. **Close the loop.** End with a **shipping checklist** and a **metrics plan** — what to watch after launch to know whether the design worked.

## Collaboration rules

- **Research outranks opinion.** Any role may cite a PM non-goal or research insight to reject a downstream idea.
- **Design system outranks individual screens.** If a screen needs a new primitive, DS decides whether to add it or compose from existing.
- **Accessibility is a baseline, not a feature.** Every role owns it; FE is the final backstop.
- **Every state is a screen.** If UX hasn't enumerated empty/loading/error/success/permission, UI must push back.

## Output template

When running the full pipeline, structure the final response as:

```
# <Product / Feature> — Design Pass

## 1. Problem (PM)
## 2. Research (UX Researcher)
## 3. Flow & IA (UX Designer)
## 4. Visual Design (UI + Visual Designer)
## 5. Motion (Interaction Designer)
## 6. System Changes (Design System Architect)
## 7. Implementation Notes (Frontend Engineer)
## 8. Shipping Checklist
## 9. Metrics to watch
## 10. Open assumptions
```

## Why this skill exists

A single "design this" prompt without role separation collapses into aesthetic choices with no justification. Splitting into roles forces each decision to earn its place — "we chose this hierarchy because research pain #2 was scanning speed", "we rejected this component because DS already has a primitive". That chain of justification is what makes the design defensible and the code maintainable.

## Related skills

- `design-pm-discovery` — problem + metrics
- `design-ux-researcher` — evidence
- `design-ux-designer` — flow + IA
- `design-ui-designer` — visual hierarchy + tokens
- `design-visual-designer` — brand + aesthetic
- `design-interaction-designer` — motion + feedback
- `design-system-architect` — tokens + components
- `design-frontend-engineer` — production code

For motion implementation in this repo, compose with `gsap-*` skills. For Next.js specifics, read `node_modules/next/dist/docs/` before writing code (see AGENTS.md).
