# Healthy — Technical Build Spec for Claude Code

**Purpose of this document:** Build an interactive, responsive frontend prototype of "Healthy" — a real-time queue, capacity, and wait-time management system for a community clinic — based on the approved Figma designs. This is a **prototype**: no authentication, no real backend/database. Data is mocked in-memory for three role personas: **Patient**, **Nurse**, **Doctor**.

Source of truth for visuals: Figma file "Healthy" (`wDUfGU27ygEXwE9KA7Bv3t`), page **"Styled Screens — Desktop (Calm & Reassuring)"**, which contains 9 approved frames (3 roles × 3 breakpoints — Desktop 1440px, Tablet 834px, Mobile 390px).

---

## 1. Build Process — READ THIS FIRST

**Work one screen at a time. Do not proceed to the next screen until I explicitly approve the current one.**

Order of work:
1. Project scaffold + design tokens + shared layout shell (viewport toggle, role switcher) — **wait for approval**
2. Shared component library (Button, Card, Badge, Sidebar/IconRail, TopBar, BottomTabBar, NotificationBanner) — **wait for approval**
3. Patient — Desktop — **wait for approval**
4. Patient — Tablet — **wait for approval**
5. Patient — Mobile — **wait for approval**
6. Nurse — Desktop — **wait for approval**
7. Nurse — Tablet — **wait for approval**
8. Nurse — Mobile — **wait for approval**
9. Doctor — Desktop — **wait for approval**
10. Doctor — Tablet — **wait for approval**
11. Doctor — Mobile — **wait for approval**
12. Cross-role interaction wiring (see Section 7) — **wait for approval**

After each step: show/describe what was built, list any assumptions made, and stop. Do not silently continue to the next numbered item.

---

## 2. Tech Stack

- **React 18 + TypeScript**, bundled with **Vite**
- **Tailwind CSS** for styling, configured with the design tokens in Section 3 (extend the theme rather than using raw hex/px in components)
- **React Router** for navigation between screens
- **React Context + useReducer** for the shared mock data store (no Redux needed — this is a prototype with a small state surface)
- **Google Fonts**: `Inter` (weights 400, 500, 600, 700) and **Material Symbols Rounded** (or Material Icons) loaded via `<link>` in `index.html`, used the same way as Figma — icon glyphs by ligature name (e.g. `<span className="material-symbols-rounded">calendar_today</span>`)
- No backend. All data lives in a single mock store (Section 6) seeded on load.

---

## 3. Design Tokens

Add these to `tailwind.config.ts` under `theme.extend`. Names mirror the Figma variable names so they're traceable back to the design file.

### Colors
```js
colors: {
  bg: {
    canvas: '#F7F8F9',
    surface: '#FFFFFF',
    surfaceAlt: '#EEF0F2',
    primary: '#0E8C8C',
    primaryHover: '#0B7373',
    primarySubtle: '#F0FAFA',
    warning: '#FFF7E8',
    urgent: '#FEF1F1',
    success: '#EEFAF3',
  },
  text: {
    primary: '#1B2126',
    secondary: '#414B54',
    tertiary: '#7C8791',
    onPrimary: '#FFFFFF',
    warning: '#B67819',
    urgent: '#A82C2C',
    success: '#1F7A48',
  },
  border: {
    default: '#DDE1E5',
    strong: '#C3C9CF',
    primary: '#0E8C8C',
  },
  icon: {
    primary: '#0B7373',
    muted: '#7C8791',
  },
  status: {
    urgentSolid: '#D64545',
    warningSolid: '#E8A93A',
    successSolid: '#2FA766',
  },
}
```

### Spacing scale
`xs: 4px · sm: 8px · md: 16px · lg: 24px · xl: 32px · 2xl: 48px`

### Radius scale
`sm: 8px · md: 12px · lg: 20px · full: 999px` (pill/circular)

### Typography (font family: Inter unless noted)
| Style | Weight | Size | Line height | Letter spacing |
|---|---|---|---|---|
| display/lg | Bold | 48px | 56px | -0.5px |
| display/md | Bold | 36px | 44px | -0.3px |
| heading/lg | SemiBold | 28px | 36px | 0 |
| heading/md | SemiBold | 22px | 28px | 0 |
| heading/sm | SemiBold | 18px | 24px | 0 |
| body/lg | Regular | 17px | 26px | 0 |
| body/md | Regular | 15px | 22px | 0 |
| body/sm | Regular | 13px | 18px | 0 |
| label/md | Medium | 14px | 20px | 0.1px |
| label/sm | Medium | 12px | 16px | 0.2px |
| numeral/xl | Bold | 64px | 68px | -1px |

### Elevation (box-shadow)
```css
--elevation-sm: 0 1px 3px rgba(13, 26, 31, 0.08);
--elevation-md: 0 4px 12px rgba(13, 26, 31, 0.10);
--elevation-lg: 0 12px 24px rgba(13, 26, 31, 0.14);
```

### Visual language recap
Calm & reassuring: white rounded cards (radius/lg) on a soft off-white canvas, soft drop shadows instead of hard borders, solid teal pills for primary actions, teal-outline pills for secondary actions, red-outline pills for urgent/priority actions, light-red pill for the patient emergency action, color-coded status badges (green=in room, teal=next up, gray=waiting, red=urgent).

---

## 4. Responsive Strategy — Breakpoints AND a Manual Viewport Switcher

This app must satisfy **two** distinct responsive requirements:

**A. True responsive behavior** — the layout must reflow correctly at real browser widths:
- Mobile: < 640px → matches the 390px mobile designs
- Tablet: 640px–1023px → matches the 834px tablet designs
- Desktop: ≥ 1024px → matches the 1440px desktop designs

**B. A manual "Device Preview" toggle** — independent of actual window size, provide a control (top-right corner of the app shell, always visible) with three buttons: **Desktop / Tablet / Mobile**. Clicking one forces the current screen to render at a fixed simulated viewport width (1440 / 834 / 390px respectively) inside a centered, bordered frame — like a device-preview/Storybook-viewport mode — so I can see any screen at any breakpoint regardless of my actual browser/window size.

Implementation approach: a `ViewportContext` holding `'auto' | 'desktop' | 'tablet' | 'mobile'`. When not `'auto'`, wrap the routed screen in a fixed-width container (`1440px`/`834px`/`390px`) centered on the canvas with a subtle border/shadow representing a device frame, and force Tailwind's responsive classes to resolve as if the container were the viewport (simplest approach: apply the breakpoint's width via inline style on a wrapping div and let CSS container queries — or a simple prop-based layout switch — drive the internal layout rather than relying on `window` media queries when a manual mode is active).

---

## 5. App Shell (build this first)

Persistent across all screens:
- **Top bar** (all breakpoints): "Healthy" wordmark, and a **Role Switcher** dropdown (Patient ▾ / Nurse ▾ / Doctor ▾) that is the *only* way to change roles (no login). Switching role navigates to that role's default screen.
- **Device Preview toggle**: Desktop / Tablet / Mobile buttons, always visible (e.g. fixed top-right), independent of role.
- **Desktop layout**: left sidebar (220px) with nav items (icon + label) — content differs per role, see screen specs.
- **Tablet layout**: left icon-only rail (72px, icons only, no labels).
- **Mobile layout**: no sidebar — top bar only, plus a **bottom tab bar** (icons + labels, 3–5 items depending on role).
- Active nav item is highlighted: background `bg-primarySubtle`, icon/text color `icon-primary` / `text-primary`. Active item = the screen currently being viewed.

---

## 6. Mock Data Model

Single seed file, e.g. `src/mocks/data.ts`. Suggested shape:

```ts
type Role = 'patient' | 'nurse' | 'doctor';

interface QueuePatient {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  queueNumber: string;       // "05", "06"...
  assignedDoctor: string;    // "Dr. Alvarez"
  arrivedAt: string;         // "8:40 AM"
  status: 'in-room' | 'next-up' | 'waiting' | 'urgent';
  checkedInAt?: string;
  activeTherapies?: string[];
  visitHistorySummary?: string;
}

interface Doctor {
  id: string;
  name: string;
  room: string;
  status: 'in-session' | 'on-break';
  backAt?: string;           // if on break
  avgConsultMinutes: number;
}

interface Nurse {
  id: string;
  name: string;
  status: 'on-floor' | 'on-break';
  coveredBy?: string;
}

interface QueueState {
  patients: QueuePatient[];
  doctors: Doctor[];
  nurses: Nurse[];
  currentDoctorCallEvent: { doctorName: string; timestamp: string } | null; // drives the nurse notification banner
}
```

Seed with the exact mock data from the designs (James Okafor, Lucia Fernández, Ahmed Nasser, Emily Zhou, Maria Torres, David Kim; Dr. Alvarez/Chen/Patel; Nurse Diaz/Reyes) so screens visually match what I approved.

> **Known data inconsistency to resolve during build:** In the designs, "Ahmed Nasser" is both assigned to "Dr. Patel" in the Nurse table and shown as "Up Next" for Dr. Alvarez on the Doctor screen. Pick one consistent assignment when wiring real state (recommend: make queue assignment authoritative and derive both views from it).

---

## 7. Cross-Role Interaction to Wire Up

This is the one piece of real interactivity specified so far (from our design sessions) — implement it using the shared mock store so it works live in the prototype, not just as a static screenshot:

**When the Doctor clicks "Call Next Patient":**
1. The next patient in that doctor's queue (status `waiting`) flips to `next-up`.
2. `currentDoctorCallEvent` is set to `{ doctorName, timestamp: 'Just now' }`.
3. On the **Nurse** screen, if `currentDoctorCallEvent` is non-null: show the teal "🔔 [Doctor] is calling the next patient" banner under the header, and highlight the corresponding patient's row/card with the `next-up` badge and light-teal background.
4. This should work whether the Nurse screen is already mounted (live update via context) or navigated to afterward (reads current store state).
5. Provide some way to dismiss/clear the banner (a close icon is enough for the prototype; no auto-timeout needed unless you think it's better — your call, note the choice).

Everything else (drag-to-reorder in the Nurse table, schedule/reschedule flows, form submissions, etc.) can be **non-functional visual affordances** for this pass — build the UI faithfully, wire click handlers that update local/mock state where obviously implied, but full workflows beyond what's specified here are out of scope until we explicitly ask for them.

---

## 8. Shared Component Library

Build these first, generically, before any screen — every screen composes from this set.

| Component | Variants | Notes |
|---|---|---|
| `Button` | `primary` (solid teal pill), `secondary` (teal outline pill), `urgent-outline` (red outline pill), `urgent-solid` (light-red pill, red text) | All fully rounded (`radius-full`), `label/md` text |
| `Card` | default | White surface, `radius-lg`, `elevation-sm`, no border |
| `StatusBadge` | `in-room` (green), `next-up` (teal), `waiting` (gray), `urgent` (red) | Pill, `label/sm` text |
| `IconButton` | default | Circular, `radius-full`, `bg-primarySubtle`, icon `icon-primary` |
| `Sidebar` (desktop) | per-role nav items | White bg, right border, active item highlighted |
| `IconRail` (tablet) | per-role nav icons | Same as Sidebar but icon-only, 72px wide |
| `BottomTabBar` (mobile) | per-role tabs | White bg, top border, active tab in teal |
| `TopBar` (mobile) | — | Wordmark + Role Switcher pill |
| `RoleSwitcher` | — | Pill dropdown, used in desktop/tablet header and mobile top bar |
| `NotificationBanner` | info | Teal-subtle background, icon + message + timestamp, dismissible |
| `DragHandle` | — | Visual only (⋮⋮ icon) on Nurse table rows |

---

## 9. Screen Specs

For every screen below: implement **exactly** the layout, copy, and mock data shown in the corresponding Figma frame on the Styled Screens page. Use the shared components from Section 8. Do not invent new UI patterns — if something is ambiguous, ask me rather than guessing.

### 9.1 Patient — Desktop (1440px)
- Sidebar: My Schedules (active), History of my Health, My Profile
- Header: "Hi, Maria" / "Tuesday, August 18" + Role Switcher top-right
- Queue Status Card: queue number "05", "3 patients ahead of you", "Estimated wait: ~25 min"
- Doctor Location Card: avatar placeholder, "Dr. Alvarez", "Room 3 · Second Floor"
- Action row: **Schedule Appointment** (primary) · **Reschedule** (secondary) ······ **Request Immediate Assistance** (urgent-solid, right-aligned in same row)
- Link: "→ View my visit history & active therapies"

### 9.2 Patient — Tablet (834px)
Same content as Desktop, sidebar collapses to icon-only rail (calendar, history, account icons). Cards remain full-width of the narrower content column.

### 9.3 Patient — Mobile (390px)
Sidebar replaced by TopBar (wordmark + role pill) and BottomTabBar (Schedules / History / Profile). Content stacks full-width, single column, 16px side padding.

### 9.4 Nurse — Desktop (1440px)
- Sidebar: Waiting Room (active), Schedule, Patients, My Breaks (with icon button for Start Break), My Profile
- Header: "Waiting Room" / "Tuesday, August 18 · 9:42 AM" + Role Switcher
- NotificationBanner (conditionally rendered — see Section 7)
- Button row: **+ Register Walk-in** (primary) · **Alert Doctor — Silent** (urgent-outline)
- Stats row: 3 cards — Total Waiting (12), Seen Today (27 of 39), Avg Consult Time (14 min)
- Physician status chips: Dr. Alvarez · Room 3 · In session / Dr. Chen · Room 5 · On break, back 10:05 / Dr. Patel · Room 2 · In session
- Waiting List table: columns `⋮⋮ drag handle | # | Patient | Assigned Doctor | Arrived | Status (badge) | Time in Exam`. Six mock rows (see Section 6 data). Ahmed Nasser row highlighted light-teal with `next-up` badge when the doctor-call event is active.

### 9.5 Nurse — Tablet (834px)
Sidebar → icon rail. Table condenses to columns `# | Patient | Arrived | Status` (drop Assigned Doctor and Time in Exam — acceptable data loss for this breakpoint, not hidden behind horizontal scroll).

### 9.6 Nurse — Mobile (390px)
TopBar + BottomTabBar (Waiting / Schedule / Patients / Breaks / Profile). Stats row becomes 2 cards per row. The table becomes a **stacked list of patient cards** (name + doctor + arrived time on the left, status badge on the right) instead of a grid.

### 9.7 Doctor — Desktop (1440px)
- Sidebar: Patients (list view), Waiting Room (active), My Breaks (icon button for Start Break), My Profile
- Header: "Room 3 · Consultation" / "5 patients waiting" + Role Switcher
- Pre-consult action row (between header and patient card): **Call Nurse** (secondary) · **Flag Priority Triage** (urgent-outline)
- Active Patient Card: avatar, "Maria Torres · #05", age/gender/checked-in time, Active Therapies checklist, Visit History summary
- Clinical Entry card: "Assessment & Therapy" label + textarea placeholder
- **Complete & Save** button (primary) below the entry card
- Right panel "Up Next": header row with **Call Next Patient** button (primary) top-right; 3 queue rows (Ahmed Nasser, Emily Zhou, David Kim — urgent dot); "Staff Coverage" card below (Nurse Diaz on floor / Nurse Reyes on break)

### 9.8 Doctor — Tablet (834px)
Sidebar → icon rail. Right panel no longer sits beside the consultation content — it stacks **below** it as its own full-width white card ("Up Next" + "Staff Coverage" together).

### 9.9 Doctor — Mobile (390px)
TopBar + BottomTabBar (Patients / Waiting / Breaks / Profile). Fully single-column stack: header → pre-consult actions → patient card → clinical entry → Complete & Save → Up Next → Staff Coverage.

---

## 10. Out of Scope (per product requirements — do not build)
- Login / authentication of any kind
- A real database — all data is the in-memory mock store from Section 6
- Real user accounts beyond the 3 mocked personas (Patient/Nurse/Doctor)
- Full scheduling, medical records, or billing workflows beyond what's described above

---

## 11. Definition of Done (per screen)
Before asking me to approve a screen, confirm:
- [ ] Matches the Figma frame's layout, spacing, and copy
- [ ] Uses only components from Section 8 (no one-off styling)
- [ ] Uses design tokens from Section 3 (no hardcoded hex/px values in component code)
- [ ] Renders correctly in both true-responsive mode and the manual Desktop/Tablet/Mobile toggle
- [ ] Role Switcher and nav are functional (navigate correctly)
- [ ] Any interactive element specified in Section 7 actually updates shared state

---

*End of spec. Start with Section 1, Step 1 (project scaffold + tokens + shell), then stop for my review.*
