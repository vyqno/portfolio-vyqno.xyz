---
name: design-interaction-designer
description: Interaction and motion design skill — designs state transitions, micro-interactions, feedback, and choreographed motion with attention to duration, easing, purpose, reduced-motion, and on-device feel. Use whenever the user says "add motion", "animate this", "design the transition", "make it feel responsive", "micro-interaction", "easing curve", "hover / press / drag behavior", "prefers-reduced-motion", "scroll-driven animation", "choreograph the page", or asks how a component should *feel*. Also use as stage 5 of design-orchestrator. Prefer this over generic "add some animations" — motion without a purpose statement is noise, and noise ages a product fast.
---

# Interaction Designer

## Purpose

Motion is the shortest path between user intent and system causality. Good motion explains *what just happened* in under 300ms; bad motion decorates. This skill assigns every animation a purpose, a duration, an easing, and a reduced-motion fallback — then hands a specification that `design-frontend-engineer` can implement without drift.

## When to use

- After UI mocks exist and need behavior defined.
- User asks for animations, transitions, easing, or "how it feels".
- Accessibility review flags missing `prefers-reduced-motion`.
- Scroll-driven or choreographed page sequences.
- Stage 5 of `design-orchestrator`.

## Inputs

- Hi-fi screens from `design-ui-designer`.
- State matrices from `design-ux-designer`.
- Component inventory from `design-system-architect`.

## Process

### 1. Map state transitions

Per component, list every transition:
- default → hover → active → focus → disabled
- enter → exit
- loading → success | error
- selected ↔ unselected

Each transition is a candidate for motion, not a mandate.

### 2. Assign a motion role per animation

- **Informative** — shows status (loading, saving, synced).
- **Orienting** — shows spatial relationship (route change, modal origin, list reorder).
- **Emotional** — celebration, delight; use sparingly.
- **Causal** — confirms "I did that" (press, select, submit).

Every animation needs a role. If you can't assign one, cut it.

### 3. Choose duration + easing

| Purpose | Duration | Easing |
|---|---|---|
| Hover feedback | 80–120ms | ease-out |
| Press / tap | 80ms | ease-out |
| Enter (fade/slide in) | 200–260ms | ease-out |
| Exit | 160–200ms | ease-in |
| Route transition | 240–320ms | custom curve |
| Ticker / value update | 150–220ms | ease-out |
| Page-scale choreography | 400–800ms | custom curve |

Rules:
- Utility motion stays < 300ms.
- Emotional/brand motion can go longer but needs a clear payoff.
- Prefer transforms (`translate`, `scale`, `opacity`) over layout-driven animation.

### 4. Design for `prefers-reduced-motion`

For every animation, define the reduced variant:
- Cross-fade instead of slide.
- Static replacement instead of morph.
- Instant state change where motion was informative-only.

Never disable the information — only the motion that carried it.

### 5. Prototype on-device

Figma timing lies. Test on a mid-tier Android, slow laptop, and screen reader flow. Adjust durations from observation, not opinion.

### 6. Hand off a motion spec

Every entry: *trigger → target → property → duration → easing → reduced-motion fallback → purpose*.

## Output format

```
# Motion spec — <feature>

## Motion tokens
| Token | Value |
| motion.duration.xs | 80ms |
| motion.duration.sm | 160ms |
| motion.duration.md | 240ms |
| motion.easing.standard | cubic-bezier(.2,.8,.2,1) |
| motion.easing.emphasized | cubic-bezier(.2,.0,0,1) |

## Component transitions
| Component | Trigger | Property | Duration | Easing | Reduced | Purpose |

## Choreographed sequences
<optional — for landing / onboarding / page transitions>

## Accessibility
- prefers-reduced-motion handled for every spec above
- No motion > 400ms on utility flows
- No parallax on mobile
- Focus order preserved across transitions
```

## Decisions

- **Motion must clarify causality.** If it doesn't, delete it.
- **Reduced motion is a first-class spec, not a "nice to have".**
- **Prefer GPU-friendly properties.** `transform` and `opacity` only, where possible.
- **Consistency over novelty.** Reuse durations + easings across the product.
- **One emotional moment per flow.** Too many celebrations = no celebrations.

## Constraints

- No animation without a purpose statement.
- No motion > 400ms on utility flows.
- Every animation has a reduced-motion fallback.
- No parallax on mobile (a11y + perf).
- Never animate a color alone to signal state change — pair with shape/icon.

## Anti-patterns

| Smell | Fix |
|---|---|
| "Smooth" without a number | Pick duration + easing explicitly |
| Animated skeleton loaders on every pixel | Animate container only; static children |
| Auto-playing hero video | Respect reduced motion; provide poster |
| Motion as decoration in dense UI | Cut it; dashboards die by motion |
| Scroll-jacking | Avoid; break only for deliberate storytelling |

## Collaboration

- **Receives from:** `design-ui-designer`, `design-ux-designer`.
- **Produces for:** `design-system-architect` (motion tokens), `design-frontend-engineer` (implementation spec).
- **In this repo:** implementation typically uses GSAP — compose with `gsap-core`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-react` when writing the code.
- **Feedback loop:** FE reports FPS / jank → adjust durations and properties.

## Example (compressed)

> **Crypto dashboard — motion spec excerpt:**
>
> | Component | Trigger | Property | Duration | Easing | Reduced | Purpose |
> | Price ticker | value change | `opacity`+`y` 4px | 160ms | ease-out | fade only | informative |
> | Donut segment | hover | `scale` 1→1.04 | 150ms | ease-out | no-op | causal |
> | Alert card | appear | `opacity`+`y` 8px | 250ms | standard | fade | orienting |
> | Route | navigate | cross-fade | 180ms | standard | instant | orienting |
>
> Tested on device — ticker lowered from 200ms → 160ms after user testing.
