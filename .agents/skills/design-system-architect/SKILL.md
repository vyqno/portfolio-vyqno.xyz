---
name: design-system-architect
description: Design system architecture skill — builds and governs the tokenized, composable system that all product surfaces consume. Covers the token layer (color, type, spacing, radius, motion, elevation), component API design, contribution process, deprecation policy, versioning, docs, and adoption metrics. Use whenever the user says "design system", "tokens", "component library", "new component", "rename a token", "deprecate this", "theme this", "dark mode tokens", "how should this component be designed", "should this be a component or a primitive", "contribution guide", or is about to duplicate a styling decision across surfaces. Also use as stage 6 of design-orchestrator. Invoke aggressively — a product that style-drifts by surface is a product with no design system.
---

# Design System Architect

## Purpose

A design system is the memory of a product team's design decisions. Without one, every new surface relitigates color, spacing, and button behavior. This skill encodes decisions once (tokens + components), governs how new ones are added, and deprecates the ones that stopped paying rent.

## When to use

- Starting or auditing a design system.
- New component proposed — decide accept / reject / compose.
- Token sprawl (three grays that do the same thing).
- Theme / dark mode / density tiers.
- Stage 6 of `design-orchestrator`.

## Inputs

- Brand tokens from `design-visual-designer`.
- UI specs + component proposals from `design-ui-designer`.
- Motion tokens from `design-interaction-designer`.
- Adoption telemetry from `design-frontend-engineer`.

## Process

### 1. Layer the system

```
tokens       → primitives      → components       → patterns            → templates
(raw values)  (atoms: Button,   (composed: Card,   (recurring layouts:  (page-level: Dashboard,
              Input, Text)       Table, Modal)      EmptyState, Form)    AuthFlow)
```

Each layer consumes only from the layer(s) above. A component never hardcodes a pixel; it uses a token. A template never bypasses a component to restyle it.

### 2. Name tokens semantically, not literally

| Bad | Good |
|---|---|
| `grey-100` | `color.bg.surface` |
| `blue-500` | `color.accent.default` |
| `16px` | `space.md` |
| `300ms` | `motion.duration.md` |

Semantic names survive rebrands and theme swaps. Literal names don't.

### 3. Token categories (complete set)

- **color** — bg, fg, border, accent, semantic, chart series
- **space** — xs, sm, md, lg, xl, 2xl (4-based scale)
- **radius** — sm, md, lg, full
- **type** — size, weight, lineHeight, tracking, family
- **shadow / elevation** — 0–4 tiers
- **motion** — duration, easing
- **z-index** — named layers (base, sticky, dropdown, modal, toast)

Every token set has **light + dark + density** variants where relevant.

### 4. Component API discipline

- **Composition over configuration.** Prefer `<Card><Card.Header/></Card>` over `<Card hasHeader headerTitle=… />`.
- **Small API surface.** Each prop must answer "does this change what it is, or just how it looks?" — the latter belongs in tokens, not props.
- **Variants are enumerated, not open strings.** `variant="primary" | "secondary"` not `variant: string`.
- **Every component: a11y + RTL + dark mode + reduced-motion by construction.**

### 5. Contribution model

```
proposal (RFC)
   ↓
prototype (in a sandbox)
   ↓
review (design + eng + a11y)
   ↓
release (versioned)
   ↓
adopt (migration path if breaking)
   ↓
deprecate (on schedule, with replacement pointer)
```

### 6. The "accept / reject / compose" test

For every proposed new component:

- **Used ≥ 3 places?** If not, inline primitive.
- **Does an existing primitive compose to this?** If yes, compose.
- **Encodes a repeatable design decision?** If yes, accept.
- **Changes together?** If props cluster into distinct modes, it's probably two components.

### 7. Metrics that matter

- **Adoption rate** — % of new surfaces using DS components.
- **Override rate** — % of instances overriding tokens. High = a token is missing.
- **Component age distribution** — old components with no usage are deprecation candidates.
- **Time-to-ship** for a new surface — DS's ROI signal.

## Output format

```
# DS decision / release — <scope>

## Tokens added / changed
| Token | Value (light) | Value (dark) | Reason |

## Components
| Component | Status | API | Notes |
| XyzCard   | accepted | `<XyzCard><XyzCard.Title/></XyzCard>` | composes ListRow + Badge |
| AssetRow  | rejected | — | solvable via ListRow + DeltaPill |

## Deprecations
| Component | Replace with | Removal version |

## Migration notes
<codemod, search/replace, or manual steps>

## Docs to write
<usage, do/don't, a11y, code snippets>
```

## Decisions

- **Reject aggressively.** Every accepted component is lifetime maintenance.
- **Compose > configure.** Big props bags rot; small APIs age well.
- **No hardcoded values in components.** Ever.
- **Breaking changes ship with a codemod.** If you can't automate it, you haven't finished the change.
- **Overrides signal gaps.** Don't close override escape hatches; fix the token layer they point to.

## Constraints

- All tokens semantic.
- All components: a11y + RTL + dark + reduced-motion.
- All changes versioned.
- Deprecations ≥ one minor cycle before removal.
- Docs ship with every component (purpose, usage, do/don't, a11y, code).

## Anti-patterns

| Smell | Fix |
|---|---|
| Three grays doing the same thing | Merge; alias during migration |
| `variant: string` open prop | Enumerate; make invalid variants unrepresentable |
| Components with 20+ props | Split or compose |
| Dark mode as late re-theme | Design tokens dark-first; light is derivative |
| "Just override the CSS" | That's a missing token; add it |

## Collaboration

- **Consumes from:** `design-ui-designer`, `design-visual-designer`, `design-interaction-designer`.
- **Serves:** `design-frontend-engineer`.
- **Audits:** every surface; overrides become RFCs.

## Example (compressed)

> **Release — Crypto dashboard additions:**
>
> Tokens added:
> - `color.semantic.delta.up` — mint `#00E6A8`
> - `color.semantic.delta.down` — red `#FF4D4F`
> - `color.chart.series.{1..8}` — categorical palette
> - `motion.duration.ticker: 160ms`
> - `motion.easing.financial: cubic-bezier(.2,.8,.2,1)`
>
> Components accepted: `DeltaPill`, `AllocationDonut`, `ChainBadge`.
> Components rejected: `AssetRow` → use `ListRow + DeltaPill`.
> Docs: each ships with screen-reader notes ("reads +2.3 percent up, not just color").
