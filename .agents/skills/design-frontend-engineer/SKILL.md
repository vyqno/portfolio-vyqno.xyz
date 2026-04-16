---
name: design-frontend-engineer
description: Frontend design engineer skill — translates design specs (tokens, components, motion) into production Next.js/React code without fidelity loss, with accessibility, performance, and telemetry as first-class constraints. Use whenever the user says "implement this design", "build this component", "code this up", "wire the animation", "ship it", "make this responsive", "dark mode the code", "a11y audit", "fix the a11y", "measure Core Web Vitals", "why is this janky", or asks to convert a Figma/spec into real code in this Next.js front-end. Also use as stage 7 of design-orchestrator. Reach for this whenever design has been specified and code is needed — skipping this skill lets design drift into CSS at 3am.
---

# Frontend Design Engineer

## Purpose

A design is worth only what ships. This skill takes design tokens, component specs, and motion specs and turns them into production-grade Next.js/React code that preserves fidelity, passes accessibility audits, and hits Core Web Vitals targets. It's the last defense against design-code drift.

## When to use

- Design and system are specified, code is next.
- Converting Figma / spec into components.
- Wiring motion from a spec sheet.
- A11y audit or perf tuning.
- Stage 7 of `design-orchestrator`.

## Repo-specific context (important)

This repo's `AGENTS.md` says:
> "This is NOT the Next.js you know. This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices."

**Do not write Next.js code from memory.** Before touching routing, data fetching, caching, metadata, or server/client boundaries, read the relevant doc under `node_modules/next/dist/docs/`. The same applies to deprecation notices surfaced by the tooling.

For animation, compose with the GSAP skills already installed:
- `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-react`, `gsap-utils`, `gsap-performance`, `gsap-frameworks`.

## Inputs

- Hi-fi mocks + state coverage (from UX + UI).
- Motion spec (from Interaction Designer).
- Design tokens + component APIs (from Design System Architect).
- Success metrics + instrumentation plan (from PM Discovery).

## Process

### 1. Map tokens → code

- Emit CSS variables for every token (`--color-bg-surface`, etc.).
- Mirror as a typed TS theme object for ergonomics.
- Never hardcode a value outside the token layer. If you need one, add a token and flag it to DS.

### 2. Build against the component API, not the visual mock

- Consume `design-system-architect` components by their API.
- If the mock can't be built without overriding tokens/styles, the DS is missing something — **file it back**, don't override.

### 3. Implement every state explicitly

For each component/screen:
- **Empty** — real copy + illustration/icon + CTA.
- **Loading** — skeleton or spinner (skeleton for structure, spinner for indeterminate).
- **Partial** — render what succeeded; error per failed region.
- **Error** — with recovery action, not a dead end.
- **Success / default** — the happy path.
- **Permission-denied** — with fix path (re-auth, upgrade, request).
- **Stale** — visible indicator + refresh affordance.

### 4. Accessibility — non-negotiable

- Semantic HTML first. `<button>`, `<nav>`, `<main>`, `<section>`, etc. ARIA only when native semantics can't express intent.
- Keyboard: every interaction reachable; visible focus ring; logical tab order.
- Screen readers: meaningful labels, live regions for dynamic updates (throttled), alt text on informative images.
- Contrast: WCAG AA minimum; verify in both themes.
- Motion: honor `prefers-reduced-motion` at the code level, not via the spec alone.
- Forms: labels bound, error messages associated, autofill-friendly.

### 5. Motion implementation

- Prefer GPU-friendly properties (`transform`, `opacity`).
- Match the spec's duration + easing exactly. Drift starts at "close enough".
- In React, use `gsap-react` (`useGSAP`) with proper cleanup via refs/contexts.
- For scroll-driven, use `gsap-scrolltrigger`. For sequences, `gsap-timeline`.
- Always ship the reduced-motion variant.

### 6. Performance budget

Hit on target devices (mid-tier Android, throttled 4G):
- **LCP** < 2.5s
- **CLS** < 0.1
- **INP** < 200ms
- **TBT** low; split client bundles aggressively.

Default posture:
- Server components by default; client components only where interactivity or state demands it (read the Next.js docs in `node_modules/next/dist/docs/` for the current rules).
- Stream where useful.
- Images: proper sizing, `next/image` (per the current docs).
- Fonts: subset, self-host, `font-display: swap` unless the design demands otherwise.

### 7. Telemetry + instrumentation

Wire the events `design-pm-discovery` requested. Without instrumentation, a shipped feature is untested in production.

### 8. Tests

- Unit: pure logic, token resolution.
- Component: render across states (empty/loading/error/success), keyboard flows.
- Visual regression: critical components in light + dark.
- A11y: automated (axe) + manual keyboard + screen reader spot-check.

## Output format

```
# Implementation — <feature>

## Files touched
<paths + short purpose>

## Tokens / components consumed
<list>

## States implemented
<table by screen: empty | loading | partial | error | success | stale | permission>

## Accessibility report
- Semantics ✓
- Keyboard ✓
- Screen reader ✓
- Contrast ✓
- Reduced motion ✓

## Performance
- LCP: ...
- CLS: ...
- INP: ...
- Notes: ...

## Telemetry wired
<events + payload>

## Drift flagged back to DS
<missing tokens / components / docs>
```

## Decisions

- **Semantic HTML first, ARIA last.**
- **Server first, client where needed.** Consult the in-repo docs before deciding.
- **Tokens are the only source of style values.**
- **Never ship a state you haven't designed.** If DS/UX skipped one, push it back.
- **Performance is a feature.** A slow feature is a broken feature.

## Constraints

- No pixel values outside the token layer.
- Every component keyboard-reachable with a visible focus state.
- Every animation has a reduced-motion variant.
- LCP < 2.5s, CLS < 0.1, INP < 200ms on target devices.
- Before writing Next.js code: read the relevant `node_modules/next/dist/docs/` page.

## Anti-patterns

| Smell | Fix |
|---|---|
| Hardcoded `16px` in a component | Add/consume a spacing token |
| `div` with `onClick` | Use `<button>` |
| Skeleton animating every child | Animate container; children static |
| ARIA everywhere | Replace with semantic HTML where possible |
| Client component by default | Server, unless interactivity demands client |
| Animation written from memory | Implement from the motion spec exactly |
| Next.js code written from training data | Read `node_modules/next/dist/docs/` first |

## Collaboration

- **Consumes from:** all design roles + `design-system-architect`.
- **Reports back:** drift, missing tokens, perf regressions.
- **Closes the loop with:** `design-pm-discovery` (telemetry → metrics → next iteration).

## Example (compressed)

> **Crypto dashboard — implementation notes:**
>
> - Tokens mirrored to CSS vars + TS theme.
> - `AllocationDonut` built with SVG + `prefers-reduced-motion` static fallback.
> - Prices via SSE; stale state shown after 60s silence.
> - Keyboard: each row focusable; Enter drills in; Esc returns.
> - ARIA live region for price updates, throttled to 5s to avoid SR spam.
> - A11y: AA across, focus ring visible, SR reads "+2.3 percent up".
> - Perf: LCP 1.8s, CLS 0.02, INP 140ms on mid-tier Android.
> - Telemetry: time-to-first-answer, alert→action funnel, reconciliation time.
