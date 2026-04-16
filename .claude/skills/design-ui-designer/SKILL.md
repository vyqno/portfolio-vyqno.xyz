---
name: design-ui-designer
description: UI design skill — translates UX structure into a visually usable, hierarchical, accessible interface using grids, type scales, color roles, spacing tokens, and dark-mode-parallel workflows. Use whenever the user says "design the UI", "make this look good", "give it visual hierarchy", "pick a type scale", "define the color palette", "hi-fi mockup", "dark mode this", "check the contrast", "lay this out", or hands over wireframes that need visual treatment. Also use as stage 4 of design-orchestrator alongside design-visual-designer. Prefer this skill over generic "make it pretty" prompts — aesthetics without a type scale, grid, and contrast discipline are decoration, not design.
---

# UI Designer

## Purpose

Translate UX structure into a visually usable interface. UI without a type scale, grid, or contrast system is just styling. This skill makes every visual decision justified by hierarchy, legibility, and accessibility — in that order.

## When to use

- After `design-ux-designer` produces wireframes and state matrices.
- User asks for hi-fi mocks, color palettes, typography scale, or visual polish.
- Existing UI has hierarchy problems (competing CTAs, muddy contrast, inconsistent spacing).
- Stage 4 of `design-orchestrator`, alongside `design-visual-designer`.

## Inputs

- Lo-fi wireframes + state matrix.
- Brand direction (or `design-visual-designer` output).
- Design system tokens (or intent to propose new ones).

## Process

### 1. Apply the grid

- Web: 12-col, 72/80/96px gutters, 8pt spacing base.
- Mobile: 4-col, 16/20/24px gutters.
- All spacing: multiples of 4 (or 8 for structural).
- Fluid > fixed: use `clamp()` or container queries for scale.

### 2. Establish the type scale

- Modular scale, ratio 1.2 (minor third) to 1.333 (perfect fourth).
- ≤ 6 sizes total: e.g., 12, 14, 16, 20, 28, 40.
- ≤ 2 families: one text, one display (optional).
- Body ≥ 16px on web, ≥ 14pt on mobile.
- Line length 45–75ch; line-height 1.4–1.6 for body, tighter for display.
- Numbers: tabular figures for anything that aligns in columns (prices, metrics).

### 3. Define color roles (not just swatches)

```
color.bg.surface       — primary canvas
color.bg.elevated      — cards, modals
color.fg.primary       — body text
color.fg.secondary     — labels
color.fg.tertiary      — hints
color.border.subtle    — dividers
color.accent           — CTAs, links
color.semantic.success
color.semantic.warning
color.semantic.error
color.semantic.info
```

- Name by role, not by value. `color.fg.primary` survives a rebrand; `grey-900` doesn't.
- Max 3 brand hues + 9-step neutral ramp + 4 semantic.
- Design dark mode *in parallel*, not after. Dark is the primary surface for many products.

### 4. Build visual hierarchy

Hierarchy carriers, in order of strength:

1. **Size** — largest strongest.
2. **Weight** — bold over regular.
3. **Color / luminance** — high contrast over low.
4. **Position** — above-the-fold, left-aligned scan path.
5. **Whitespace** — isolation equals importance.

Use the strongest carrier you need and no more. If size works, don't also color.

### 5. Contrast & accessibility (non-negotiable)

- WCAG AA minimum: 4.5:1 body text, 3:1 large text + UI elements.
- Critical finance/health flows: AAA where feasible.
- Never color as sole carrier — pair with icon, text, or shape.
- Focus states designed, not browser-default.

### 6. Produce hi-fi mocks — every state

For each screen from UX, design the full state inventory. No exceptions.

## Output format

```
# UI — <feature>

## Grid
<cols, gutters, spacing base>

## Type scale
| Role | Family | Size | Weight | LH | Tracking |

## Color tokens
| Token | Light | Dark | Contrast (on bg) |

## Spacing scale
4, 8, 12, 16, 24, 32, 48, 64

## Components proposed (to DS)
| Component | Purpose | Why new? |

## Screens (per state)
<hi-fi link or ASCII layout>

## Accessibility notes
<contrast, focus, semantic color alternatives>
```

## Decisions

- **Contrast before color.** Luminance carries hierarchy in both light and dark mode; hue does not.
- **Whitespace before dividers.** Gestalt grouping is cleaner than line noise.
- **Reuse before invent.** Propose a new component only if no existing primitive composes.
- **Dark mode is primary for finance, tools, and creative surfaces.** Design it first, then derive light.

## Constraints

- ≤ 2 font families, ≤ 6 type sizes.
- ≤ 3 brand hues + neutral ramp + 4 semantic.
- Every text passes WCAG AA.
- No hardcoded pixel values outside the spacing/type scale.
- Every screen has its full state inventory.

## Anti-patterns

| Smell | Fix |
|---|---|
| Competing primary CTAs | One primary per viewport; the rest are secondary |
| Color-only semantic carriers | Add icon or text |
| Dense type scale with 10+ sizes | Collapse to ≤ 6 |
| "Placeholder as label" | Use real labels; placeholders disappear on input |
| Dark mode as inverted light mode | Rebuild from dark up — different contrast rules |

## Collaboration

- **Pairs with:** `design-visual-designer` (brand), `design-interaction-designer` (motion).
- **Consumes from:** `design-system-architect` (tokens + components).
- **Produces for:** `design-system-architect` (new component proposals), `design-frontend-engineer` (specs).

## Example (compressed)

> **Crypto dashboard — UI spec:**
>
> **Grid:** 12-col desktop / 4-col mobile, 8pt base.
> **Type:** Inter Text + Inter Display (numbers tabular). Sizes 12/14/16/20/28/40.
> **Color roles:** brand indigo `#3B3BFF`, accent mint `#00E6A8`, semantic up/down/warn/info, 9-step warm neutral ramp.
> **Hierarchy:** Portfolio value (40 bold) > 24h delta (20 medium + color + arrow) > allocation > alerts.
> **Contrast:** AA across; deltas paired with arrow glyph (not color-only).
> **Dark mode:** primary surface; warm neutrals to reduce eye strain.
> **New components:** `DeltaPill`, `AllocationDonut`, `ChainBadge`. Rejected: `AssetRow` (compose from `ListRow` + `DeltaPill`).
