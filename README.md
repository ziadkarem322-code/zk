# Handoff: Category-Switching Photography Portfolio Deck

## Overview

A single-page, full-screen slide deck that presents a freelance photographer's portfolio. Its defining feature is a **client-type switcher**: a glass pill of five buttons that swaps the *entire* deck — copy, imagery, accent colour, background gradient, pricing, client list, case studies — to a different discipline, without changing the slide structure or navigating anywhere.

Five categories: **Fashion**, **Food**, **Product**, **Portrait**, **Estate** (real estate).

The pitch angle differs per category. Fashion / Food / Product / Portrait are positioned as *AI-directed image production* (Midjourney, Freepik/Flux, Gemini Nano Banana, Magnific/Topaz, Photoshop, Seedance). Estate is positioned as *real on-location twilight photography* and is the only category with a video slide that plays a walkthrough cut.

## About the Design Files

The files in this bundle are **design references created in HTML** — a working prototype that shows the intended look, layout, and behaviour. They are **not production code to lift directly**.

The task is to **recreate this design in the target codebase's existing environment** (React, Vue, Svelte, SwiftUI, native — whatever the project uses), following that codebase's established component patterns, styling approach, and asset pipeline. If the project has no environment yet, choose the framework that best fits and implement the design there.

Two specifics worth calling out before you start:

- The prototype is built on a **custom slide-stage web component** (`deck-stage.js`) that scales a fixed 1920×1080 canvas to fit the viewport, and provides keyboard nav, a thumbnail rail, speaker notes, and print-to-PDF. In a real app you will most likely replace this with your own carousel/deck primitive or a library. What matters is the **fixed 1920×1080 design canvas that scales uniformly to fit** — all type sizes and spacings in this document assume that canvas.
- All styling in the prototype is **inline** (a constraint of the authoring environment). Do not treat that as a recommendation — move it into your codebase's normal styling layer (CSS modules, Tailwind, styled-components, etc.).

## Fidelity

**High-fidelity.** Colours, typography, spacing, imagery, and copy are final. Recreate pixel-perfectly using the codebase's existing libraries and patterns. Exact values are listed in [Design Tokens](#design-tokens).

---

## Architecture

One component driven by one data structure. The slide markup is written **once**; every category supplies the same shaped record, and the active category's record fills the slides.

```
PortfolioDeck
├── CategorySwitcher        (fixed overlay, top-right)
└── DeckStage               (1920×1080 canvas, scaled to fit)
    ├── CoverSlide
    ├── IntroductionSlide
    ├── ContentsSlide
    ├── SelectedWorkSlide
    ├── VideoSlide
    ├── ProjectSlide  × 3   (rendered from projects[])
    ├── PackagesSlide
    ├── ClientsSlide
    └── ContactSlide
```

### The category record

Every category object has this shape. Switching category is a single state change — `activeCategory` — and nothing else.

```ts
type Frame = [caption: string, imageSrc: string];

type Project = {
  label: string;        // slide label, e.g. "Desert Vista"
  kicker: string;       // e.g. "Listing — 7301 Desert Vista"
  year: string;         // e.g. "2026"
  title: string;        // display headline, uppercase
  hero: string;         // image src
  desc: string;         // 2–3 sentence case-study paragraph
  frames: Frame[];      // exactly 2, rendered as vertical reels
  delivered: string[];  // 3 pill chips
  notes: string;        // speaker note
};

type Category = {
  short: string;          // switcher button label, e.g. "Estate"
  catName: string;        // full name, e.g. "Real Estate & Architecture"
  discipline?: string;    // cover kicker; defaults to "Independent — AI Image Direction"
  accent: string;         // accent colour (oklch)
  bg: string;             // slide background gradient
  cover: string;          // cover image src
  intro: string;          // intro image src (left reel)
  introWide: string;      // intro image src (right reel)
  tagline: string;        // one sentence, cover bottom-right
  coverSlot: string;      // caption overlaid on the cover image
  bio: string;            // ~55-word intro paragraph
  services: string[];     // 4 items
  kit: string[];          // 4 items (tools / workflow)
  stats: { v: string; k: string }[];    // 4 items
  contents: { n: string; t: string }[]; // 5 items, n = "01".."05"
  gridNote: string;       // Selected Work subhead
  gridSlots: string[];    // 8 captions — only first 3 are rendered
  gridImages: string[];   // 8 image srcs — only first 3 are rendered
  video?: string;         // poster image for the video slide
  videoTitle?: string;
  videoKicker?: string;
  videoDesc?: string;
  videoSpecs?: string[];  // 4 pill chips
  packagesTitle: string;  // e.g. "RATES", "COLLECTIONS", "RATES & SPECS"
  packagesNote: string;
  packages: { tier: string; price: string; unit: string; items: string[] }[]; // 3
  clients: string[];      // 8 names
  quote: string;          // testimonial (rendered wrapped in curly quotes)
  quoteBy: string;
  availability: string;
  contact: { k: string; v: string }[]; // 4 items
  projects: Project[];    // 3
};
```

**Note on `gridSlots` / `gridImages`:** each category defines 8, but the Selected Work slide renders only the **first 3**. The remaining five are kept as a reserve pool (they were part of an earlier 8-tile grid). Either keep the reserve or trim the data to 3 — but do not render more than 3, the layout is built for three vertical reels.

---

## Global Layout Rules

- **Design canvas:** 1920 × 1080 px, fixed. Scaled uniformly to fit the viewport, centred. Full-bleed — no letterboxing chrome, no visible page margins.
- **Slide padding:** `64px 88px` for content-dense slides (Introduction, Selected Work, Video, Project, Packages); `84px 88px` for Contents and Contact; `80px 88px` for Clients. Cover is asymmetric — see below.
- **Column splits:** all two-column slides are exactly `1fr 1fr`. This symmetry is deliberate and was arrived at iteratively; do not reintroduce weighted columns.
- **Every slide** carries the category's `bg` gradient and `#f5f4f2` text, and sets `overflow: hidden`.
- **Photography aspect ratio:** every photo in the deck is a vertical **9:16 reel**. All image boxes use `aspect-ratio: 9/16; height: 100%; width: auto; box-sizing: border-box`. `box-sizing: border-box` is load-bearing — without it the 1px border and padding push the box past its row and overlap the text below.
- **Image treatment:** each photo box is a `background-image` with a bottom-up scrim `linear-gradient(to top, rgba(0,0,0,.45), rgba(0,0,0,0) 45%)` composited over it, a `1px solid rgba(245,244,242,.16)` border, and its caption pinned bottom-left in mono type.
- **Empty-image placeholder:** where no photo is assigned, the box shows `repeating-linear-gradient(135deg, rgba(245,244,242,.07) 0 10px, rgba(245,244,242,0) 10px 20px)`.
- **Minimum type size: 24px.** Nothing on any slide goes below it — that includes captions, kickers, and chip labels. The only exception is the switcher overlay (9px), which is UI chrome, not slide content.

---

## Screens / Views

### 1. Cover

**Purpose:** state who the photographer is, which discipline this deck is about, and the positioning line.

**Layout:** two columns `1fr 1fr`. Left column padding `80px 72px 72px 88px`, `display:flex; flex-direction:column; justify-content:space-between` (three bands: kicker / wordmark / footer). Right column is the full-height cover image, with `border-left: 1px solid rgba(245,244,242,.14)`.

**Components**

| Element | Spec |
|---|---|
| Discipline kicker | Mono 24px, letter-spacing `.22em`, uppercase, `rgba(245,244,242,.6)`. Preceded by a 38×1px accent-coloured rule, `gap: 16px`. Text = `discipline`. |
| Wordmark | Bebas Neue 212px, `line-height: .86`, letter-spacing `.01em`. Reads `PORT` + `FOLIO`, where `FOLIO` is accent-coloured. |
| Meta row | Below wordmark, `margin-top: 26px`. Mono 24px, letter-spacing `.08em`, uppercase, `rgba(245,244,242,.78)`. Three items in a **nowrap** flex row, `gap: 20px`, baseline-aligned: `catName` (nowrap) · flexible 1px rule `rgba(245,244,242,.22)` with `min-width: 40px` · `2026` (nowrap). |
| Photographer name | Bebas Neue 56px, letter-spacing `.06em`, `line-height: 1`. Value: `zk`. |
| Tagline | Barlow 26px, `line-height: 1.45`, `max-width: 440px`, `rgba(245,244,242,.66)`, `text-wrap: pretty`. Sits on the same baseline row as the name, right-aligned within the left column. |
| Cover caption | Overlaid bottom-left on the cover image. Mono 24px, letter-spacing `.12em`, uppercase, `rgba(245,244,242,.78)`, `text-shadow: 0 2px 12px rgba(0,0,0,.8)`. Text = `coverSlot`. |

### 2. Introduction

**Purpose:** the positioning paragraph, the tool stack, and four proof numbers.

**Layout:** two columns `1fr 1fr`, `gap: 56px`, padding `64px 88px`.

- **Left column** (`flex-direction: column`, `gap: 26px`): a fixed-height image row of **two 9:16 reels** side by side (`height: 620px`, `gap: 20px`, `flex: 0 0 auto`, `overflow: hidden`) using `intro` and `introWide`; below it a 2×2 stats grid (`gap: 16px 24px`).
- **Right column** (`justify-content: space-between`): headline, rule, bio; then a two-column list block.

**Components**

| Element | Spec |
|---|---|
| Headline | Bebas Neue 108px, `line-height: .9`. Text: `INTRODUCTION`. |
| Rule | Full-width 1px `rgba(245,244,242,.2)`, margin `18px 0 24px`. |
| Bio | Barlow 30px, `line-height: 1.5`, `max-width: 820px`, `rgba(245,244,242,.82)`, `text-wrap: pretty`. |
| Stat value | Bebas Neue 46px, `line-height: 1`, accent-coloured. |
| Stat key | Mono 24px, letter-spacing `.1em`, uppercase, `rgba(245,244,242,.55)`, `margin-top: 6px`. Each stat cell has `border-top: 1px solid rgba(245,244,242,.2)`, `padding-top: 14px`. |
| List headings | Mono 24px, letter-spacing `.14em`, uppercase, accent-coloured, `margin-bottom: 16px`. Text: `Services` and `Kit & workflow`. |
| List items | Barlow 26px, `rgba(245,244,242,.8)`, `gap: 10px` in a column flex. Two-column grid, `gap: 26px 48px`, `margin-top: 30px`. |

### 3. Contents

**Purpose:** signpost the five sections.

**Layout:** single column, vertically centred, padding `84px 88px`, `gap: 52px`.

| Element | Spec |
|---|---|
| Headline row | `CONTENT` in Bebas Neue 112px `line-height: .9`; then a flexible 1px rule `rgba(245,244,242,.2)`; then `catName` in mono 26px, letter-spacing `.16em`, uppercase, `rgba(245,244,242,.6)`. `gap: 34px`, baseline-aligned. |
| Number cards | 5-column grid, `gap: 34px`. Each has `border-top: 2px solid rgba(245,244,242,.22)`, `padding-top: 22px`. |
| Card number | Bebas Neue 104px, `line-height: .9`, accent-coloured. |
| Card title | Mono 24px, letter-spacing `.1em`, uppercase, `line-height: 1.45`, `rgba(245,244,242,.78)`, `margin-top: 10px`. |

### 4. Selected work

**Purpose:** three photographs, no commentary.

**Layout:** rows `auto 1fr`, `gap: 32px`, padding `64px 88px`.

- **Header row:** left — `Section 01` kicker (mono 24px, letter-spacing `.16em`, uppercase, accent, `margin-bottom: 14px`) above `SELECTED WORK` (Bebas Neue 104px, `line-height: .85`); right — `gridNote` (Barlow 26px, `line-height: 1.45`, `max-width: 520px`, `rgba(245,244,242,.66)`).
- **Image row:** `display: flex; gap: 24px; justify-content: center; align-items: stretch; min-height: 0`. Three 9:16 reels, centred as a group. Captions from `gridSlots[0..2]` in mono 24px, `rgba(245,244,242,.72)`, with `text-shadow: 0 2px 10px rgba(0,0,0,.8)`.

### 5. Video

**Purpose:** present the motion deliverable alongside the stills. Primarily an **Estate** slide, but the structure exists for every category.

**Layout:** two columns `1fr 1fr`, `gap: 48px`, padding `64px 88px`.

- **Left column** (`justify-content: space-between`): kicker row (`videoKicker` in mono 24px letter-spacing `.16em` uppercase accent, followed by a 26×1px accent rule, `gap: 14px`); `videoTitle` in Bebas Neue 96px `line-height: .9`, `margin-top: 12px`; `videoDesc` in Barlow 28px `line-height: 1.45` `rgba(245,244,242,.8)` `margin-top: 24px`. At the bottom: a `Delivery` heading (mono 24px, letter-spacing `.14em`, uppercase, accent) above `videoSpecs` as pill chips.
- **Right column:** a centred 9:16 player box (`aspect-ratio: 9/16; height: 100%; width: auto`), `1px solid rgba(245,244,242,.16)`, `overflow: hidden`, with `video` as its background poster image.

**Behaviour — important:**

- The `<video>` element has native `controls`, `playsinline`, `preload="metadata"`, and `object-fit: cover`.
- When **no video URL is configured**, the `<video>` element must be **hidden entirely** (`display: none`) and its `src` attribute **removed** — not set to `""`. An empty `src` triggers a console error, and a source-less `<video>` still paints its opaque black background over the poster image, hiding it. With the element hidden, the wrapper's background poster shows through.
- With no URL, a hint strip is pinned to the bottom of the box: `Set Tweaks → Video URL to play the cut here` — mono 24px, `rgba(245,244,242,.82)`, `padding: 18px 22px`, over `linear-gradient(to top, rgba(0,0,0,.78), rgba(0,0,0,0))`, `pointer-events: none`. In a real app, replace this with your own empty state.

### 6–8. Project slides (×3)

**Purpose:** three case studies. Rendered by mapping `projects[]`.

**Layout:** two columns `1fr 1fr`, `gap: 48px`, padding `64px 88px`.

- **Left column** (`flex-direction: column`, `gap: 24px`): kicker row, then the hero reel.
  - Kicker row: `kicker` (mono 24px, letter-spacing `.16em`, uppercase, accent) · 26×1px accent rule · `year` (`rgba(245,244,242,.5)`), `gap: 14px`.
  - Title: Bebas Neue 96px, `line-height: .86`, `margin-top: 12px`.
  - Hero: 9:16 reel, `align-self: flex-start`, `padding: 22px`.
- **Right column** (`justify-content: space-between`, `gap: 26px`):
  - `desc` — Barlow 28px, `line-height: 1.45`, `rgba(245,244,242,.8)`, `text-wrap: pretty`.
  - Frame row — `display: flex; gap: 18px; height: 400px; flex: 0 0 auto; overflow: hidden`. Two 9:16 reels from `frames`, captions in mono 24px `rgba(245,244,242,.55)`, `padding: 14px`.
  - `Delivered` heading (mono 24px, letter-spacing `.14em`, uppercase, accent, `margin-bottom: 14px`) above `delivered` as pill chips.

### 9. Packages

**Purpose:** three price tiers with the middle one emphasised.

**Layout:** rows `auto 1fr`, `gap: 34px`, padding `64px 88px`.

- **Header:** left — `How we work together` kicker (mono 24px, letter-spacing `.16em`, uppercase, accent, `margin-bottom: 16px`) above `packagesTitle` (Bebas Neue 96px, `line-height: 1`); right — `packagesNote` (Barlow 26px, `max-width: 520px`, `rgba(245,244,242,.66)`).
- **Cards:** 3-column grid, `gap: 20px`. Each card: `flex-direction: column; justify-content: space-between; gap: 18px; padding: 26px 24px`.
  - Default card: `1px solid rgba(245,244,242,.18)`, transparent background.
  - **Middle card (index 1):** border uses the **accent colour** and background is `rgba(245,244,242,.06)`.
  - `tier` — mono 24px, letter-spacing `.14em`, uppercase, `rgba(245,244,242,.62)`.
  - `price` — Bebas Neue 62px, `line-height: 1`, `margin-top: 8px`.
  - `unit` — Barlow 24px, `rgba(245,244,242,.6)`, `margin-top: 6px`.
  - `items` — Barlow 26px, `line-height: 1.35`, `rgba(245,244,242,.82)`, column flex `gap: 12px`.

### 10. Clients

**Purpose:** logo-wall substitute plus one testimonial.

**Layout:** two columns `1fr 1fr`, `gap: 64px`, `align-items: center`, padding `80px 88px`.

- **Left:** `CLIENTS` in Bebas Neue 96px `line-height: .95` `margin-bottom: 30px`; then a 2-column grid of the 8 names, `gap: 16px 40px`. Each name: mono 26px, letter-spacing `.06em`, uppercase, `rgba(245,244,242,.8)`, `border-bottom: 1px solid rgba(245,244,242,.16)`, `padding-bottom: 12px`.
- **Right:** the quote block — `border-left: 2px solid <accent>`, `padding: 10px 0 10px 40px`. Quote in Barlow 34px, `line-height: 1.34`, `text-wrap: pretty`, wrapped in curly quotes (`“…”`). Attribution below in mono 24px, letter-spacing `.1em`, uppercase, `rgba(245,244,242,.6)`, `margin-top: 26px`.

### 11. Contact

**Purpose:** close on availability and the four contact facts.

**Layout:** single column, `justify-content: space-between`, padding `84px 88px`.

| Element | Spec |
|---|---|
| Top kicker | Mono 26px, letter-spacing `.22em`, uppercase, `rgba(245,244,242,.6)`. Text: `<catName> — booking`. |
| Headline | Bebas Neue 210px, `line-height: 1`. Reads `LET'S` + `SHOOT`, where `SHOOT` is accent-coloured. |
| Availability | Barlow 32px, `line-height: 1.45`, `max-width: 760px`, `rgba(245,244,242,.76)`, `margin-top: 28px`, `text-wrap: pretty`. |
| Contact grid | 4-column grid, `gap: 30px`, `border-top: 1px solid rgba(245,244,242,.2)`, `padding-top: 28px`. Key: mono 24px, letter-spacing `.12em`, uppercase, accent, `margin-bottom: 8px`. Value: Barlow 30px, `rgba(245,244,242,.88)`. |

---

## Category Switcher

The signature interaction. A **liquid-glass pill** fixed at `top: 10px; right: 12px`, `z-index: 9999`, above the deck.

**Container**

```
position: fixed; top: 10px; right: 12px; z-index: 9999;
display: flex; align-items: stretch; gap: 3px; padding: 3px;
box-sizing: border-box; border-radius: 999px;
background: linear-gradient(150deg, rgba(255,255,255,.20), rgba(255,255,255,.05) 42%, rgba(255,255,255,.12));
backdrop-filter: blur(22px) saturate(180%);
-webkit-backdrop-filter: blur(22px) saturate(180%);
box-shadow: inset 0 1px 0 rgba(255,255,255,.45),
            inset 0 -1px 0 rgba(255,255,255,.12),
            0 8px 24px rgba(0,0,0,.32);
border: 1px solid rgba(255,255,255,.14);
role="tablist"  aria-label="Client type"
```

The three-stop diagonal gradient plus the two inset highlight rims are what read as refraction — a flat translucent fill does not. Keep them.

**Buttons** — one per category, label = `short`.

```
appearance: none; cursor: pointer; border: none;
font-family: <mono>; font-size: 9px; letter-spacing: .1em; text-transform: uppercase;
padding: 0 12px; height: 22px; border-radius: 999px;
flex: 0 0 auto; min-width: 0; white-space: nowrap;
display: flex; align-items: center; justify-content: center; line-height: 1;
transition: all .18s ease;
```

| State | Background | Colour | Shadow | Opacity |
|---|---|---|---|---|
| Inactive | `transparent` | `rgba(255,255,255,.68)` | none | `.8` |
| Hover | — | — | — | `1` |
| Active | that category's `accent` | `#101214` | `inset 0 1px 0 rgba(255,255,255,.5), 0 2px 8px rgba(0,0,0,.25)` | `1` |

**Note:** the active button uses **its own category's** accent colour, not the currently-active one — so the pill previews each category's palette.

**Accessibility:** the container is `role="tablist"` with `aria-label="Client type"`. In your implementation add `role="tab"` and `aria-selected` to the buttons and wire arrow-key navigation between them — the prototype does not.

---

## Interactions & Behavior

**Category switch.** Click a switcher button → set `activeCategory` → the whole deck re-renders from that category's record. Slide position is preserved (you stay on the same slide index). No animation on the swap; the accent and background change instantly. This is the only stateful interaction in the design.

**Slide navigation.** Arrow keys / click-through, one slide at a time, no transition between slides beyond the deck primitive's own. In the prototype the stage also supplies a thumbnail rail, speaker notes, and print-to-PDF; treat those as prototype tooling, not product requirements, unless the user asks for them.

**Video playback.** Native controls only. No autoplay, no custom scrubber. `preload="metadata"`.

**Hover states.** Only the switcher buttons have one (opacity → 1). Nothing else in the deck is hoverable — it is a presentation, not an app.

**Responsive behaviour.** None in the conventional sense. The 1920×1080 canvas scales uniformly to fit whatever viewport it is in; it never reflows. If you need a genuinely responsive version, that is a new design problem — the type scale and the 9:16 reel rows assume the fixed canvas.

### Two failure modes to avoid

Both of these were real bugs in the prototype and are easy to reintroduce:

1. **Zero-height stage.** If the deck primitive measures its container before layout settles, it computes a scale of 0 and paints nothing until a resize event arrives. The prototype fixes this by re-dispatching `resize` on a `requestAnimationFrame` loop until the canvas measures non-zero, plus on `load` and `document.fonts.ready`. Whatever primitive you use, make sure it measures after layout and re-measures on font load.
2. **Reel boxes overflowing their row.** The image boxes are content-box by default, so the 1px border and 14–24px padding add on top of `height: 100%` and push the box past its row, overlapping the text beneath. Set `box-sizing: border-box` on every image box.

---

## State Management

Minimal — one variable.

| State | Type | Purpose |
|---|---|---|
| `activeCategory` | `'fashion' \| 'food' \| 'product' \| 'portrait' \| 'estate'` | Which category record fills the deck. Default in the prototype: `estate`. |
| `currentSlide` | `number` | Owned by the deck primitive. Preserved across category switches. |
| `videoUrl` | `string` | Optional override for the video slide's source. Empty → the `<video>` is hidden and the poster shows. |

No data fetching. All content is static and can ship as a typed constant, a CMS payload, or a JSON file — whichever fits the codebase. There is no persistence requirement.

### Image display controls (optional)

The prototype exposes global image-framing controls that apply to **every** photo box at once. They exist so a non-technical user can re-frame the whole deck without editing code. Port them only if that capability is wanted; otherwise bake in the defaults.

| Control | Range | Default | Effect |
|---|---|---|---|
| `imageFit` | `cover` \| `contain` | `cover` | `background-size` keyword when no explicit size is set. |
| `imageZoom` | 100–260% | 100 | Sets `background-size: <n>% auto`. |
| `imageWidth` | 0–400% (0 = auto) | 100 | Explicit `background-size` width. Overrides zoom. |
| `imageHeight` | 0–400% (0 = auto) | 0 | Explicit `background-size` height. Overrides zoom. |
| `imageX` | 0–100% | 43 | `background-position` X. |
| `imageY` | 0–100% | 23 | `background-position` Y. |

Resolution order: if `imageWidth` or `imageHeight` is non-zero → `background-size: <w> <h>`; else if `imageZoom ≠ 100` → `<zoom>% auto`; else → the `imageFit` keyword.

---

## Design Tokens

### Typography

| Role | Family | Usage |
|---|---|---|
| Display | **Bebas Neue** 400 | All headlines and numerals: wordmark 212px, section heads 96–112px, contact headline 210px, stat values 46px, prices 62px, contents numbers 104px, name 56px. |
| Body | **Barlow** 300/400/500/600 | Paragraphs 26–32px, list items 26px, package items 26px, quote 34px, contact values 30px. |
| Mono | **IBM Plex Mono** 400/500 | Every kicker, caption, label, chip, and client name — 24px on slides, 9px in the switcher. Always uppercase with wide letter-spacing (`.06em`–`.22em`). |

Google Fonts: `Bebas+Neue`, `Barlow:wght@300;400;500;600`, `IBM+Plex+Mono:wght@400;500`.

The type system is deliberately three-voiced: **Bebas for scale**, **Barlow for reading**, **mono for metadata**. Keep the roles separate — mono is never used for prose, Barlow never for a kicker.

### Colour

| Token | Value | Use |
|---|---|---|
| Text primary | `#f5f4f2` | All slide text |
| Text 88% | `rgba(245,244,242,.88)` | Contact values |
| Text 82% | `rgba(245,244,242,.82)` | Bio, package items |
| Text 80% | `rgba(245,244,242,.8)` | List items, project copy |
| Text 78% | `rgba(245,244,242,.78)` | Cover meta, contents titles |
| Text 66% | `rgba(245,244,242,.66)` | Tagline, section notes |
| Text 60% | `rgba(245,244,242,.6)` | Kickers, attribution, units |
| Text 55% | `rgba(245,244,242,.55)` | Stat keys, frame captions |
| Hairline | `rgba(245,244,242,.2)` | Rules, contact divider, stat borders |
| Hairline soft | `rgba(245,244,242,.16)` | Image borders, client dividers |
| Card border | `rgba(245,244,242,.18)` | Package cards |
| Card fill (featured) | `rgba(245,244,242,.06)` | Middle package card |
| Chip border | `rgba(245,244,242,.24)` | Delivered / spec pills |
| Page fallback | `#0b0d0f` | Body background behind the stage |
| Active btn text | `#101214` | Switcher active label |

**Per-category accent and background**

| Category | Accent | Background gradient |
|---|---|---|
| Fashion | `oklch(0.74 0.16 32)` — warm red | `linear-gradient(155deg, oklch(0.20 0.012 285) 0%, oklch(0.13 0.010 285) 62%, oklch(0.10 0.008 285) 100%)` |
| Food | *see source* | *see source* |
| Product | `oklch(0.80 0.11 85)` — amber | `linear-gradient(155deg, oklch(0.26 0.030 75) 0%, oklch(0.17 0.024 70) 60%, oklch(0.125 0.018 68) 100%)` |
| Portrait | `oklch(0.74 0.13 330)` — magenta | `linear-gradient(155deg, oklch(0.22 0.030 320) 0%, oklch(0.145 0.024 315) 62%, oklch(0.11 0.018 310) 100%)` |
| Estate | `oklch(0.82 0.10 88)` — warm gold | `linear-gradient(155deg, oklch(0.24 0.038 255) 0%, oklch(0.155 0.030 258) 60%, oklch(0.115 0.022 260) 100%)` |

All accents are defined in **oklch** so they sit at matched perceptual lightness — swapping category changes hue, not brightness. Preserve that if you add categories. Backgrounds are all near-black at three stops on a `155deg` axis, differing only in hue and chroma.

### Spacing & geometry

- **Slide padding:** `64px 88px` (dense) · `80px 88px` (Clients) · `84px 88px` (Contents, Contact) · `80px 72px 72px 88px` (Cover left).
- **Column gaps:** 48px (Video, Project) · 56px (Introduction) · 64px (Clients).
- **Grid gaps:** 20px (packages) · 24px (Selected Work reels) · 18px (project frames) · 34px (contents) · 16px 40px (clients) · 16px 24px (stats) · 26px 48px (services/kit) · 30px (contact).
- **Fixed row heights:** 620px (intro image row) · 400px (project frame row). Both `flex: 0 0 auto` with `overflow: hidden`.
- **Radii:** `999px` (pills and chips only). Everything else is square — no rounded cards anywhere.
- **Borders:** 1px hairlines throughout; `2px` only on the Contents card tops and the quote's left rule.
- **Shadows:** only on the switcher (see above) and text-shadows on image captions. Slides carry no shadows.

---

## Assets

35 photographs in `photos/`, all AI-generated (Midjourney, Freepik/Flux, Gemini) except the Estate set, which is presented as real twilight photography. All are JPEG, longest edge ≤1800px, quality 0.82.

| Category | Files |
|---|---|
| Fashion (8) | `1-pose-estimation-…__22314.jpg`, `a-fullbody-studio-portrait-…__23004.jpg`, `clean-closeup-shot-of-axen-…__23002.jpg`, `enhance__71524.jpg`, `photorealistic-editorial-streetwear-couple-…__66472.jpg`, `medium-shot-tight-crop-…__22312.jpg`, `photorealistic-iphone-topdown-flatlay-…__66476.jpg`, `ultrarealistic-studio-fashion-photo-…__35712.jpg` |
| Food (6) | `food-kahk-tea-close.jpg`, `food-arch-table.jpg`, `food-assorted-plate.jpg`, `food-glass-stand.jpg`, `food-set-wide.jpg`, `food-kahk-pour.jpg` |
| Product (7) | `hy-oil-diagram.jpg`, `hy-cream-circle.jpg`, `hy-ribbons.jpg`, `hy-hand-pump.jpg`, `hy-dropper-skin.jpg`, `hy-set-hearts.jpg`, `hy-cleanse-burst.jpg` |
| Watch/misc (9) | `z-study-desk.jpg`, `z-whisky-macro.jpg`, `z-dial-hero.jpg`, `z-helm.jpg`, `z-dive.jpg`, `z-fireside.jpg`, `z-freedom-sea.jpg`, `z-wrist-denim.jpg`, `z-dial-flat.jpg` |
| Estate (6) | `re-driveway.jpg`, `re-pool-moon.jpg`, `re-bare-tree.jpg`, `re-entry-path.jpg`, `re-palm-court.jpg`, `re-facade-dusk.jpg` |

**No video file is included.** The Video slide's player is wired but unsourced — supply a vertical 9:16 clip and set the video URL.

**No icons, no logos, no SVG illustration.** The design is entirely type, hairlines, and photography. Client names are set as text, not logos — if the real client logos become available, that slide is the place for them.

---

## Copy & Tone

The copy is a deliberate voice and should be preserved if the content is kept:

- **Concrete over adjectival.** "Twenty-two looks in a single day inside a stripped warehouse" — not "stunning fashion imagery."
- **Every case study names a constraint and how it was solved** (heat and wind moved the portrait window; a black scrim tunnel controlled reflections in-camera to save retouch hours; negative space was requested in the prompt so callouts could be typeset later).
- **The AI angle is stated plainly, never hidden.** Fashion/Food/Product/Portrait say outright that the frames are generated and name the tools. Estate says outright that it is shot on location. Do not blur that line.
- **No exclamation marks, no emoji, no superlatives.** Prices are stated flatly. Availability is specific ("Twilight bookings run Sunday to Thursday, two listings per evening. Weather nights rebooked at no charge.").

Contact details are placeholders: `studio@zk.work`, `+20 100 220 4418`, `@zk.imagelab` / `@zk.estates`, Cairo. Replace with real details before any real use.

---

## Files

| File | What it is |
|---|---|
| `Photography Portfolio.dc.html` | **The design reference.** All eleven slide layouts, all five category records, the switcher, and the image-framing logic. Read this for exact values; it is the source of truth for anything this README leaves ambiguous. |
| `deck-stage.js` | The slide-stage component the prototype is built on (1920×1080 scaling, keyboard nav, thumbnail rail, speaker notes, print). Prototype infrastructure — replace with your own deck primitive. |
| `support.js` | Runtime for the prototype's authoring environment. **Not part of the design** — ignore entirely. |
| `photos/` | All 35 photographs. |

Open the HTML file in a browser to see the design running, and use the switcher to compare categories — the differences between them are the point of the design.
