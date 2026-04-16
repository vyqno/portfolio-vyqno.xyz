---
name: design-visual-designer
description: Visual design and brand skill — owns the emotional signal of a product through color, type personality, illustration style, iconography, imagery direction, and aesthetic coherence. Use whenever the user says "pick a brand direction", "mood board this", "make it feel [premium / playful / serious]", "design the logo direction", "style this illustration set", "choose an aesthetic", "what's the visual tone", "make it on-brand", or is choosing between stylistic directions. Also use as stage 4 of design-orchestrator in parallel with design-ui-designer. Reach for this skill whenever the conversation shifts from "does it work" to "does it feel right" — trend-chasing without a brand voice produces designs that look dated in 18 months.
---

# Visual Designer

## Purpose

A product's emotional signal — brand voice, aesthetic direction, illustration and iconography — must be intentional. Left to drift, it becomes whichever reference the team saw most recently. This skill locks the aesthetic axes, pressure-tests them at the smallest and largest surfaces, and feeds brand tokens back into the design system.

## When to use

- Early brand direction / aesthetic choice.
- Icon set or illustration system needed.
- Imagery / photography direction.
- Existing product feels incoherent or "off-brand".
- Stage 4 of `design-orchestrator`, alongside `design-ui-designer`.

## Inputs

- Brand brief (voice, audience, market).
- Competitive / category references.
- Existing brand assets if any.

## Process

### 1. Define the aesthetic axes

Pick one position on each axis. Commit before moving on.

- Warm ↔ Cold
- Formal ↔ Playful
- Dense ↔ Airy
- Vintage ↔ Futuristic
- Humanist ↔ Geometric
- Saturated ↔ Desaturated

Axes become a sentence: *"Warm, airy, humanist, slightly playful."* This sentence decides 90% of downstream choices.

### 2. Build the mood board

- 15–25 references spanning: products, print, film, architecture, not just competitors.
- Sort into: *feels right*, *almost*, *wrong but interesting*.
- Narrow to 3 "north star" references.
- Extract the common attributes — that's your direction.

### 3. Color: emotional palette

- Anchor hue (brand).
- Supporting hue(s) (accent).
- Neutral temperature (warm / cool / true).
- Saturation strategy (high-sat accents over muted neutrals is a safe pattern).
- Validate in light + dark — neutrals should feel different but consistent.

### 4. Type: personality

- Display face carries voice more than anything else.
- Pair with a text face that shares x-height and feels quieter.
- Avoid 3+ families. Variable fonts handle range with one file.
- Test at 12px, 40px, and 200px — different failure modes.

### 5. Iconography

- Single grid: 24/20/16 px with shared keylines.
- One stroke weight across the set.
- Optical correction at small sizes (16px needs its own drawing, not a scale-down).
- Filled vs outline chosen per context, not mixed inside a region.

### 6. Illustration & imagery

- Style rules: palette subset, line weight, composition, figure treatment.
- Imagery direction: photography style, color treatment, subject rules.
- Cultural and a11y review: diverse representation, no stereotypes, readable contrast.

### 7. Pressure-test

Every style survives:
- Favicon (16px) — does it read?
- Hero section (full viewport) — does it feel like the brand?
- Grayscale — does the hierarchy hold without color?
- Dark mode — does the temperature still feel right?

## Output format

```
# Visual direction — <brand>

## Aesthetic axes
<one sentence>

## Mood board
<3 north stars + attribute extraction>

## Color
| Role | Hex | Use |
| Brand | ... | primary surfaces, CTAs |
| Accent | ... | highlights, interactive states |
| Neutral | ... | text, surfaces |
| Semantic | ... | status |

## Typography
<display + text family, voice, fallback stack>

## Iconography
<grid, stroke, style, examples>

## Illustration
<style rules, palette subset, composition>

## Imagery
<photo direction, treatment, subject rules>

## Brand tokens (for DS)
<map to design-system-architect tokens>
```

## Decisions

- **Brand voice > trend.** Trends age; voice compounds.
- **Asset style must survive grayscale and 16px.** Two failure modes that catch most weak choices.
- **Aesthetic never beats legibility.** If the type choice hurts reading, the type choice loses.
- **Imagery passes cultural review.** If you don't have the context, get it before shipping.

## Constraints

- Icons on a single grid with one stroke weight.
- ≤ 2 font families.
- ≤ 3 brand hues.
- Every asset readable at its smallest target size.
- No color-only semantic signals.

## Anti-patterns

| Smell | Fix |
|---|---|
| Palette picked from a trend post | Pick from the aesthetic axes + audience |
| Icon set mixing stroke weights | Normalize on one; redraw outliers |
| Illustrations ignoring skin/gender diversity | Expand reference set; redraw |
| "Premium" = black + gold with no reason | Derive from audience/market, not reflex |
| Different x-heights in paired fonts | Repair or replace |

## Collaboration

- **Pairs with:** `design-ui-designer` (applies tokens).
- **Produces for:** `design-system-architect` (brand tokens).
- **Feedback loop:** `design-ux-researcher` validates perception with target users.

## Example (compressed)

> **Crypto dashboard — visual direction:**
>
> **Axes:** "Serious but modern. Dense, cool, geometric, slightly futuristic."
>
> **Mood:** Bloomberg Terminal × Linear × Things 3.
>
> **Color:** deep indigo brand, electric mint accent, warm-tinted neutrals (reduce eye strain on long dashboards), standard up/down semantics with glyphs.
>
> **Type:** Inter Display for numerics (tabular), Inter Text for UI. One family, two optical sizes.
>
> **Icons:** 20px grid, 1.5px stroke, outline by default, filled when selected.
>
> **Imagery:** abstract data viz only; no stock photography.
