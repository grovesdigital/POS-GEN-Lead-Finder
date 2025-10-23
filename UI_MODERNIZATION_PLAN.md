# UI Modernization & Design System Roadmap

This document captures the current state, tactical plan, and long-term roadmap for modernizing the Google Places Query tool UI. It should evolve alongside product priorities and be revisited at each milestone.

---

## Objectives
- Deliver a cohesive, modern visual language that matches a SaaS lead-generation tool.
- Reduce CSS duplication and one-off styles by introducing reusable components.
- Improve accessibility and responsiveness to support desktop and mobile workflows.
- Prepare the codebase for future theming (white label, dark mode) and component reuse.

---

## Phase 1 · Foundation (Before Major Feature Work)

### 1. Establish Design Tokens
- Create `css/tokens.css`.
- Consolidate existing CSS variables (`styles.css:10`) and add:
  - Spacing scale (`--space-1` … `--space-12`).
  - Typography scale (`--font-sm`, `--font-lg`, `--font-heading-1`, etc.).
  - Semantic colors (`--color-surface`, `--color-border-muted`, `--color-accent`, state colors).
  - Shadow & radius tokens (`--shadow-sm`, `--radius-md`, etc.).
- Replace raw pixel / hex usage in the existing CSS with the new tokens.
- Document usage guidelines inline for future contributors.

### 2. Restructure Global Styles
- Split the monolithic `styles.css` into:
  - `css/base.css` – reset, typography, links, default spacing.
  - `css/layouts/shell.css` – shared layout scaffolding.
- Update `<head>` in `index.html` and `results.html` to load CSS in order: tokens → base → components → layout → view-specific overrides.
- Ensure fallback fonts, background color, and base text color come from tokens.

### 3. Create Layout Shell Component
- Define `.page-shell` in `css/layouts/shell.css` with max width, centered gutters, responsive padding.
- Wrap main app sections in both HTML files with `<div class="page-shell">`.
- Convert sticky header / branding math to rely on CSS custom properties (replace `calc(100vh - …)` with `min()`/`max()` patterns).

### 4. Build Button System
- Add `css/components/buttons.css` with:
  - Base `.btn`.
  - Variants `.btn--primary`, `.btn--secondary`, `.btn--outline`, `.btn--ghost`, `.btn--danger`.
  - Size modifiers `.btn--sm`, `.btn--md`, `.btn--lg`.
  - Icon alignment helpers `.btn__icon`.
- Replace legacy classes in HTML (`.btn-primary`, `.btn-footer`, `.btn-view-toggle`, `.btn-generate-ad`, etc.).
- Remove redundant button rules from former `styles.css`.

### 5. Normalize Cards & Panels
- Define `.card`, `.card--elevated`, `.panel`, `.panel--floating`, `.panel--sticky` in `css/components/cards.css`.
- Update:
  - Setup card (`index.html` setup screen).
  - Floating search panel and campaign builder sections.
  - Results cards and table wrappers.
- Remove duplicated shadows / padding from old selectors.

### 6. Unify Form Elements
- Create `css/components/forms.css` with shared classes:
  - `.form-group`, `.form-label`, `.form-help`.
  - `.input`, `.textarea`, `.select`.
  - Checkbox/chip styles & slider styling.
- Update form markup to apply these classes (inputs, sliders, checkboxes, chip tags).
- Move progressive disclosure helpers (`hidden-until-location`) into utilities.

### 7. Standardize Badges & Chips
- Add `css/components/badges.css` with `.badge` and variants `.badge--accent`, `.badge--info`, `.badge--warning`, `.badge--success`, `.badge--metric`.
- Replace bespoke badge styles in headers, setup, selected counts, type tags.

### 8. Replace Emoji Icons
- Select icon strategy (recommend Tabler Icons via inline SVG sprites).
- Include icon assets once in `index.html` and `results.html`.
- Swap emoji spans for `<span class="icon" aria-hidden="true">…</span>` and provide accessible labels.
- Introduce `.icon` helper in `css/components/icons.css`.

### 9. Modernize Typography & Spacing
- Implement fluid type using `clamp()` in `css/base.css`.
- Map headings and body text to the new scale.
- Audit spacing between sections and replace numeric values with spacing tokens.
- Ensure line heights and letter spacing meet accessibility recommendations.

### 10. Responsive Layout Pass
- Rework `@media` queries to target new components.
- Ensure:
  - Floating panel collapses into bottom drawer on small screens.
  - Campaign builder panels stack vertically on tablets.
  - Branding/header sections wrap gracefully without overlapping text.
- Test at 320px, 768px, 1024px, 1440px widths.

### 11. Clean Up Legacy CSS
- After migration, delete obsolete selectors from the old `styles.css`.
- Keep a single entry file (optionally SCSS) that imports modular files for bundling.

### 12. QA & Regression Testing
- Manually walk through:
  - Initial setup screen.
  - Quick search (map open/closed states).
  - Campaign builder toggles.
  - Results table/card view + exports.
- Validate accessibility: color contrast, focus states, keyboard navigation.
- Create a UI testing checklist so regressions are easier to catch.

---

## Phase 2 · Enhancement (While Features Stabilize)

These tasks can run in parallel with feature development once the foundation is in place.

### A. Component Library & Documentation
- Publish Storybook or a lightweight component gallery documenting tokens and components.
- Include usage guidelines: when to use card vs panel, correct button variants, spacing rules.
- Add linting/pre-commit checks for CSS class naming (BEM or utility-first hybrid).

### B. Utility Classes
- Introduce light utility helpers (`.flex`, `.grid`, `.gap-sm`, `.mt-lg`, etc.) sourced from tokens to reduce custom CSS for simple layout tweaks.
- Provide a usage guide to prevent overuse.

### C. Accessibility Enhancements
- Add skip links, aria-live regions for dynamic status updates, and focus-visible styles.
- Audit color contrast with tooling (e.g., axe) and adjust tokens if needed.

### D. Animation & Micro-interactions
- Introduce subtle transition tokens (`--transition-fast`, `--transition-standard`).
- Apply to panel toggles, button hover, and map placeholder state changes.
- Keep animations optional with `prefers-reduced-motion` queries.

### E. Theme Readiness
- Define semantic color tokens (primary, success, warning, neutral) to prepare for future theming (dark mode, partner brand).
- Prototype a minimal dark mode variant to validate token coverage.

---

## Phase 3 · Future-Focused Initiatives (Post-Feature Freeze)

### 1. Design System Packaging
- Consider migrating to SCSS or CSS Modules for better encapsulation.
- Bundle components into a reusable package if multiple apps will use them.
- Automate builds with a pipeline (e.g., Vite + PostCSS).

### 2. Pattern Library Integration
- Sync with Product/Design to align on narrative (tone, iconography, illustrations).
- Expand to include page templates, map overlays, campaign wizard flows.
- Document UX patterns for onboarding, empty states, and error handling.

### 3. Performance & Maintainability
- Audit CSS bundle size; remove unused classes (e.g., PurgeCSS or custom script).
- Add visual regression testing (Chromatic, Percy, or Playwright with diff).
- Integrate lint rules (stylelint) with repo CI.

### 4. Continuous Accessibility
- Schedule periodic audits (quarterly).
- Add automated accessibility tests to pipeline.
- Train team on accessible component usage.

---

## Contribution Checklist
- ✅ Update design tokens first; keep compatibility in mind.
- ✅ Modify HTML templates to adopt new component classes.
- ✅ Remove legacy CSS after confirming replacements.
- ✅ Run manual regression on critical flows.
- ✅ Consider backward compatibility with existing feature branches.

---

## Open Questions & Dependencies
- Icon licensing or chosen library?
- Target browsers and required polyfills?
- Will we migrate to a JS framework (React/Vue) in the future? Plan components accordingly.
- Need product sign-off on visual hierarchy changes (gradients vs neutral backgrounds)?
- Design resource availability for pattern library maintenance?

---

## Next Review
- Reassess this document after major feature milestones or once Phase 1 is complete.
- Track progress via issues/epics aligned to each phase.
- Extend roadmap as branding and product goals evolve.

