---
name: design-ux-designer
description: UX design skill — takes validated problems and research insights and turns them into user flows, information architecture, low-fidelity wireframes, and an explicit state inventory per screen. Use whenever the user says "design the flow", "how should this work", "map the user journey", "what screens do we need", "sketch this out", "wireframe this", "what's the IA", "what should the navigation look like", or "what are the empty/loading/error states". Also use as stage 3 of design-orchestrator. Invoke whenever the request is about structure and behavior rather than visual polish — bad flows survive any amount of UI work, so this skill earns its place early.
---

# UX Designer

## Purpose

Turn the *what* (problem + insights) into the *how* (flow + structure) before anyone argues about color. A well-structured flow with ugly wireframes beats a beautiful UI on a broken flow every time.

## When to use

- After `design-pm-discovery` + `design-ux-researcher` produce a problem and pains.
- User asks for flows, sitemaps, IA, or wireframes.
- Existing product has usability issues rooted in structure (not styling).
- Stage 3 of `design-orchestrator`.

## Inputs

- PRD + success metrics.
- Research insights and journey map.
- Existing IA and design system component inventory (if any).

## Process

### 1. Map the user flow

- Start from the entry point that matters to the metric.
- Happy path first, in ≤ 3 steps if humanly possible.
- Add ≥ 2 critical error/edge branches (auth failed, data stale, partial load).
- Every step earns its place — if you can cut it without hurting the metric, cut it.

### 2. Design the IA

- Flat beats deep. 2 levels of hierarchy is usually enough.
- Labels are user-language, not product-language. ("Activity" > "Event stream".)
- Navigation structure reflects primary tasks, not org chart.
- No page should be > 3 clicks from the entry point.

### 3. Wireframe (lo-fi)

- Greyscale, grid-aligned, no typefaces chosen yet.
- Focus on layout hierarchy, content regions, and action affordance.
- One primary CTA per viewport.
- Use whitespace and grouping (Gestalt) before borders.

### 4. Enumerate states per screen (mandatory)

For every screen, enumerate:
- **Empty** — first use, no data yet.
- **Loading** — skeleton or progress.
- **Partial** — some data loaded, some failed.
- **Error** — with recovery action.
- **Success / default** — the happy path.
- **Permission-denied** — when auth or scope blocks access.
- **Stale** — data exists but is old.
- **Offline** (if network-sensitive).

If any of these is missing, the design is incomplete. Push back on downstream work until they exist.

### 5. Heuristic pass

Before handoff, run Nielsen's 10 on the flow:
- Visibility of system status ✓/✗
- Match with real world ✓/✗
- User control and freedom ✓/✗
- Consistency and standards ✓/✗
- Error prevention ✓/✗
- Recognition over recall ✓/✗
- Flexibility and efficiency ✓/✗
- Aesthetic and minimalist design ✓/✗
- Help users recover from errors ✓/✗
- Help and documentation ✓/✗

### 6. Annotate and hand off

Each screen ships with: purpose, primary action, state list, edge-case notes, data dependencies.

## Output format

```
# UX — <feature>

## User flow
<mermaid or ascii diagram, happy path + branches>

## Information architecture
- Section
  - Page (primary action)
  - Page
- Section
  - Page

## Screens
### <Screen name>
Purpose: ...
Primary action: ...
States: empty | loading | partial | error | success | stale | permission
Edge cases: ...
Data dependencies: ...
Annotations:
- (region A) ...
- (region B) ...

## Heuristic check
| Heuristic | ✓/✗ | Note |
```

## Decisions

- **Fewer steps beats fewer fields.** Collapsing steps creates trapped state; collapsing fields is pure win.
- **Recognition over recall.** Defaults, suggestions, autocomplete, recent items.
- **Progressive disclosure when >7±2 options.** Miller's law is real.
- **Design error recovery, not error prevention.** Users will err; the flow must survive it.

## Constraints

- Happy path ≤ 3 steps when possible; justify any 4+.
- Every screen has its full state list.
- One primary CTA per viewport.
- No new navigation pattern without a reason that survives "why not use the existing one?"

## Anti-patterns

| Smell | Fix |
|---|---|
| Happy path only | Add at least 2 error branches |
| IA as org chart | Re-label by user tasks |
| Modal inside modal | Rework flow; stacked modals are a smell |
| Hamburger on desktop for primary nav | Use visible top nav |
| "We'll figure out the empty state later" | Design it now or the screen is incomplete |

## Collaboration

- **Receives from:** `design-pm-discovery`, `design-ux-researcher`.
- **Produces for:** `design-ui-designer` (structure), `design-interaction-designer` (states), `design-system-architect` (patterns).
- **Feedback loop:** Usability tests with `design-ux-researcher` can reopen flow changes.

## Example (compressed)

> **Flow (crypto dashboard):**
> 1. Connect wallet (read-only scope screen) →
> 2. Dashboard (value, 24h delta, allocation, alerts) →
> 3. Asset drill-in (holdings, chain split, P&L, suggested action)
>
> **IA:** Dashboard · Assets · Alerts · Activity · Settings
>
> **States per screen:** empty (no wallet), loading (fetching prices), stale (>60s), partial (chain RPC failed), error (retry + partial shown), success.
