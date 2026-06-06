# Alpine Engineering - TourBay Design System

This document captures the design tokens and layout rules extracted from the "TourBay Travel Aggregator" Google Stitch project.

---

## 🎨 Color Palette

The color strategy is **monochromatic-first** to ensure high-resolution photography acts as the primary visual driver, combined with a deep accent color for interactive actions.

| Token | Hex Code | Tailwind Equivalent | Role / Usage |
| :--- | :--- | :--- | :--- |
| **Primary Accent** | `#0047AB` | `bg-[#0047ab]` | Deep Ocean Blue: Critical actions (e.g., Book Now, active filters). |
| **Headlines** | `#09090B` | `text-zinc-950` | Maximum contrast ink-like headings. |
| **Body Text** | `#475569` | `text-slate-600` | Highly readable, low-vibration text. |
| **Secondary Text** | `#64748B` | `text-slate-500` | Metadata and helper labels. |
| **Main Surface** | `#FFFFFF` | `bg-white` | Page and content background. |
| **Subtle Container** | `#F8FAFC` | `bg-slate-50` | Sidebar, input fields, and hover blocks. |
| **Border / Ring** | `#E2E8F0` | `border-slate-200` | Form outline rings (unchecked checkboxes). |

---

## 🔤 Typography

We utilize distinct typefaces to convey a technical yet premium, editorial aesthetic.

| Layer | Font Family | Size | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display-LG** | Hanken Grotesk | `64px` | `600` (Semibold) | `1.1` | `-0.04em` | Main hero titles |
| **Headline-LG** | Hanken Grotesk | `40px` | `600` (Semibold) | `1.2` | `-0.02em` | Section headers |
| **Headline-MD** | Hanken Grotesk | `24px` | `600` (Semibold) | `1.3` | `-0.01em` | Card titles |
| **Body-MD** | Inter | `16px` | `400` (Regular) | `1.6` | `0` | Descriptions and text |
| **Label-SM** | Geist | `12px` | `500` (Medium) | `1` | `0.05em` | Metadata tags and chips |

---

## 📐 Spacing & Layout

- **Central Container:** Max-width of `1200px` for centered desktop layout.
- **Proximity-Based Spacing:** No horizontal dividing lines (`<hr>`) or explicit box borders are used. Separation is achieved through negative space (`gap-6`, `gap-8`, `mb-12`).
- **Aspect Ratio:** Package thumbnails must strictly use `aspect-[4/3]` to prevent layout shift.
- **Responsive Layout:**
  - **Desktop (1200px+):** 12-column grid, 24px gutter.
  - **Mobile (Below 768px):** 4-column layout with 20px page margins.

---

## 🎚️ Elevation & Shadows

Depth is established through layered ambient shadows, avoiding dark strokes.

- **Ambient Shadow System:**
  ```css
  box-shadow: 
    0 1px 2px rgba(9, 9, 11, 0.02),
    0 8px 16px rgba(9, 9, 11, 0.04);
  ```
- **The "Lift" Technique:** Hovering pressable cards lifts them via `hover:scale-[1.02]` combined with a transition to a deeper shadow.
- **Physical Feedback:** Pressing interactive targets fires a `scale-[0.97]` scale reduction.
