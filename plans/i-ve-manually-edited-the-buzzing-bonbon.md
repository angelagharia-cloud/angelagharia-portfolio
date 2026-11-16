# Plan: Align BakkenCV Visual Design to Original CV Template

## Context

The user shared their original CV as a PDF reference but it wasn't saved to the filesystem. The visual source of truth is therefore `ServiceDeskCV.tsx` — the CV previously built from their real data. The `BakkenCV.tsx` currently uses slightly different spacing tokens and has coloured skill category labels and project card backgrounds that may deviate from the original design language. The goal is to align `BakkenCV.tsx` closely with `ServiceDeskCV.tsx`'s visual identity while keeping the Bakken & Bæck tailored content, and guarantee the whole thing fits cleanly on exactly 2 A4 pages.

---

## Visual Token Comparison: ServiceDeskCV → BakkenCV

| Token | ServiceDeskCV (original) | BakkenCV (current) | Fix |
|---|---|---|---|
| Page 1 padding | `34px 38px 32px` | `30px 36px 28px` | Keep tighter version — needed for 2-page fit |
| Grid columns | `168px 1fr`, gap `30px` | `162px 1fr`, gap `28px` | Keep tighter — fine |
| Sidebar gap | `20px` | `16px` | Keep tighter |
| `lbl` marginBottom | `10px` | `8px` | Keep tighter |
| `job-title` | `14px 700` | `13.5px 700` | Restore to 14px |
| `job-meta` marginBottom | `7px` | `6px` | Restore to 7px |
| `bullet` font size | `12px` | `11.5px` | Restore to 12px |
| `bullet` line-height | `1.6` | `1.55` | Restore to 1.6 |
| bullet gap | `5px` | `4px` | Restore to 5px |
| job marginBottom | `16px` | `13px` | Restore to 14px |
| Skill category labels | Gray/neutral | **Blue (#2563eb)** — deviation | Change to `color: #374151` neutral |
| Project entries | Plain text, blue proj-cat | **Coloured card backgrounds** | Keep cards — original CV had coloured cards per instructions |

---

## What Needs Changing in `src/app/components/BakkenCV.tsx`

### 1. Restore typography to match ServiceDeskCV
- `job-title`: `13.5px` → `14px`
- `bullet`: `11.5px, 1.55` → `12px, 1.6`
- `job-meta` marginBottom: `6px` → `7px`
- bullet gap: `4px` → `5px`

### 2. Neutralise skill category label colour
- Change the four skill sub-heading labels from `color: #2563eb` (blue) to `color: #374151` (neutral dark) with slightly smaller weight
- The original CV uses blue only for functional accents (the left border bar, proj-cat text), not as a section label colour

### 3. Re-verify 2-page fit with restored sizes
- With bullet font restored to 12px and line-height 1.6, page 1 will be tighter
- Keep job marginBottom at 14px (compromise between 13px and 16px)
- Keep page padding at `30px 36px` (slightly tighter than original's `34px 38px`)
- Campus Collective stays at 2 bullets to keep page 2 from overflowing
- If page 1 still overflows, trim each job to 2 bullets instead of 3

### 4. No structural changes needed
- Page 1: Header → Profile → 2-col [Sidebar: Education + Skills | Main: 3 jobs]
- Page 2: 2-col [Sidebar: Tools + Languages + Interests + Work Rights | Main: 3 project cards + references]
- ContactFooter already hidden for `bakken-cv` page in `App.tsx`

---

## Files to Modify

- `src/app/components/BakkenCV.tsx` — typography token restoration + skill label colour fix

No changes needed to `App.tsx`, `Navigation.tsx`, or any other file.

---

## Verification

1. Open the CV tab in the portfolio
2. Check that typography weight and size matches the general feel of ServiceDeskCV
3. Check skill labels are neutral (not blue)
4. Print / Save as PDF — confirm page 1 ends cleanly before projects section, page 2 has all 3 project cards with no overflow
5. Check no extra content (footer, etc.) appears below the document
