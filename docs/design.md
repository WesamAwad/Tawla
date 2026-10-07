# Tawla — Design System

> Visual identity and UI rules. Source: the **"نظام تصميم Tawla"** board.
> Style: flat and clean · warm grill colours · **Cairo** font · rounded corners 14–24px · Arabic RTL.

---

## 0. Source of truth

The full visual design (all screens, layout, colours, components) is in the **Tawla design file**:

- Link (for humans, needs login): `https://claude.ai/chat/6f2d2fa1-0f30-4aad-8956-af7ee9100114?artifact=7791890e-1829-4a79-a858-1b96bc5c9472`
- HTML export: `docs/design/tawla-design.html` — read it for exact colours, sizes, spacing and text. **Reference only: do not copy its markup into the app**; rebuild each screen with React components and the Tailwind tokens below.

Rules:

1. **The design file wins.** When building a screen, match the matching section in `docs/design/tawla-design.html`.
2. This document holds the **tokens and rules** in text form (colours, font, sizes, components) so code stays consistent.
3. If the design file and this document disagree, follow the design file and update this document in the same PR.
4. Anything the design file doesn't show (empty states, errors, loading) follows the rules below.

## 1. Brand

- **Name:** Tawla — tagline **«منيو المطعم الرقمي»**.
- **Logo:** glossy 3D wordmark "TAWLA" — orange/red "T" and "L", charcoal "A W A", orange swoosh, Arabic tagline underneath.

### Logo files

| File                          | Use                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `public/images/logo.png`      | Full logo with tagline (transparent background) — splash, login page, admin sidebar header |
| `public/images/logo-mark.png` | "T" only, square — favicon, small header on mobile, image placeholder                      |
| `public/favicon.ico`          | Generated from `logo-mark.png`                                                             |

### Logo rules

- **Light backgrounds only** (`surface` or white). The charcoal letters disappear on dark or orange backgrounds — never put the logo on the gradient bar; use `logo-mark` or the text «Tawla» in `ink` there instead.
- Do not stretch, recolour, crop, or add shadows.
- Minimum width: full logo **120px**; below that use `logo-mark`. The tagline is unreadable under ~160px width — on small screens show the full logo without relying on the tagline.
- Clear space around the logo ≥ the height of the "T" stem width.
- Always add `alt="Tawla — منيو المطعم الرقمي"`.
- Keep a compressed copy (≤ 100 KB, WebP or PNG) for the web; keep the original high-res file in `docs/assets/`.
- **Mood:** warm, appetising, fast. Food photos carry the page; the UI stays quiet around them.

## 2. Colours

| Token            | Hex       | Arabic name   | Use                                                 |
| ---------------- | --------- | ------------- | --------------------------------------------------- |
| `primary`        | `#F57C00` | برتقالي أساسي | Main buttons, active tab, focus ring, accents       |
| `primary-strong` | `#E0450B` | أحمر برتقالي  | Gradient start, pressed state, strong highlights    |
| `accent`         | `#FFB300` | كهرماني       | Small highlights, "preparing" status, badges        |
| `ink`            | `#1C1C1C` | فحمي          | Main text, text on orange, dark chips (table badge) |
| `price`          | `#B85400` | نص الأسعار    | Prices on white/cream — 4.9:1 on white              |
| `surface`        | `#FFF8F0` | خلفية الزبون  | App background, soft cards                          |
| `card`           | `#FFFFFF` | —             | Cards, inputs, sheets                               |
| `muted`          | `#6B6B6B` | —             | Secondary text, notes (5.3:1 on white)              |
| `border`         | `#EADFD3` | —             | Card and input borders, dividers                    |
| `success`        | `#1E7B3A` | —             | "Available" switch, "ready" status                  |
| `danger`         | `#C62828` | —             | Errors, delete, "new" status dot                    |
| `danger-soft`    | `#FDECEA` | —             | Delete button and error backgrounds                 |

**Gradient** — `linear-gradient(to left, #E0450B, #F57C00)` (RTL: deep red-orange starts on the right).
Use **only** for the top bar and the main call-to-action button ("أضف للسلة"). Nowhere else.

### Contrast rules (must follow)

- **Text on orange is `ink`, never white.** White on `#F57C00` is only 2.7:1; `ink` is 6.3:1.
- **Prices use `price` (#B85400)**, not `primary` — orange text on white is unreadable.
- Gradient button label: **18px Bold or larger** (counts as large text, ≥ 3:1 on both ends).
- Never use colour alone for meaning: status chips always have a text label, the availability switch always has «متوفر / غير متوفر».

## 3. Typography — Cairo

Load from Google Fonts: weights 400, 700, 800. Body `font-family: "Cairo", system-ui, sans-serif`.

| Token          | Size | Weight        | Example                 | Use                                     |
| -------------- | ---- | ------------- | ----------------------- | --------------------------------------- |
| `text-page`    | 30px | ExtraBold 800 | عنوان الصفحة            | Page title (admin), restaurant name     |
| `text-section` | 20px | ExtraBold 800 | عنوان قسم               | Category headings, card titles in admin |
| `text-title`   | 16px | Bold 700      | اسم الطبق · نص زر       | Product name, button labels             |
| `text-body`    | 15px | Regular 400   | نص الوصف العادي للأطباق | Descriptions, form text                 |
| `text-note`    | 13px | Regular 400   | ملاحظة ثانوية           | Hints, timestamps, helper text          |

Line-height 1.6 for Arabic body text. Numbers (prices, table numbers) use the same font with `tabular-nums`.

## 4. Spacing, radius, sizing

- **Spacing scale:** 8 · 12 · 16 · 24 px (Tailwind `2`, `3`, `4`, `6`). Page gutter 16px on mobile.
- **Radius:** 14px inputs/buttons · 18px cards · 24px sheets and large panels. Chips and badges fully rounded.
- **Touch targets:** at least **44px** high for anything tappable by customers.
- **Admin buttons:** 52–58px high (used on tablets in a busy kitchen).
- **Shadows:** minimal — one soft shadow for cards (`0 1px 3px rgb(28 28 28 / 0.08)`); flat everywhere else.

## 5. Components

### Buttons

| Variant   | Look                                    | Example                |
| --------- | --------------------------------------- | ---------------------- |
| CTA       | Gradient, `ink` text 18px Bold          | أضف للسلة · أرسل الطلب |
| Primary   | Solid `primary`, `ink` text             | زر أساسي · حفظ         |
| Secondary | White, `border` 1px, `ink` text         | زر ثانوي · إلغاء       |
| Danger    | `danger-soft` background, `danger` text | حذف                    |

States: hover darkens 6% · pressed uses `primary-strong` · disabled 40% opacity and `cursor-not-allowed` · loading shows a spinner and blocks double clicks.

### Inputs

- White, 1px `border`, radius 14px, 48px high, label above (`text-title` size 14–16 Bold).
- Focus: 2px `primary` ring.
- **Error:** border `danger`, message below in `danger` 13px — e.g. «هذا الحقل مطلوب».

### Availability switch

Green (`success`) + label **متوفر** / grey + label **غير متوفر**. One tap changes it and saves immediately (optimistic UI, revert on error).

### Table badge

Black pill (`ink` background, white text): **«طاولة 5»**. Shown in the customer header and on every admin order card.

### Price

`price` colour, Bold, currency after the number: **«38 ₪»**.

### Order status chips

| Status      | Label       | Background | Dot / text                        |
| ----------- | ----------- | ---------- | --------------------------------- |
| `new`       | جديد        | `#FDECEA`  | `#C62828`                         |
| `preparing` | قيد التحضير | `#FFF3D6`  | `#8A5A00`                         |
| `ready`     | جاهز        | `#E6F4EA`  | `#1E7B3A`                         |
| `completed` | مكتمل       | `#EEEEEE`  | `#4A4A4A`                         |
| `cancelled` | ملغي        | `#EEEEEE`  | `#6B6B6B` (line-through optional) |

Chip = small dot + label, fully rounded, 13px Bold.

### Product card (customer)

Photo on top (4:3, radius 18px, `object-cover`, lazy) · name `text-title` · two-line description `text-body` `muted` · price + round "+" button at the bottom.
**Unavailable:** greyscale photo, 50% opacity, label «غير متوفر حالياً», "+" button hidden. The card stays visible.

### Category tabs

Horizontal scroll, sticky under the header. Active tab: `primary` background, `ink` text. Inactive: white with border.

### Cart bar

Sticky at the bottom when the cart has items: gradient, «عرض السلة · 3 عناصر · 114 ₪».

### Empty & loading states

- Skeleton blocks (cream `#F3EADF`) while loading, not spinners for whole pages.
- Empty states have one short sentence + one action, e.g. «السلة فارغة — تصفّح المنيو».

## 6. Layout

### Customer (mobile-first, 360px+)

Header (gradient top bar, logo, table badge) → sticky category tabs → product list (1 column; 2 columns ≥ 640px) → sticky cart bar.
Product details open in a **bottom sheet**: large photo, description, add-ons as checkboxes with prices, quantity stepper, CTA.

### Admin (≥ 1024px, works on tablet 768px)

Right-side sidebar (RTL): الرئيسية · الطلبات · المنيو · الطاولات.
Orders board = 4 columns by status (جديد · قيد التحضير · جاهز · مكتمل), newest on top, each card shows table badge, time, items, total, and one big button for the next status.

## 7. RTL rules

- `<html lang="ar" dir="rtl">`.
- Use logical Tailwind utilities: `ms-* me-* ps-* pe-* start-* end-* text-start text-end` — **never** `ml/mr/pl/pr/left/right` for layout.
- Directional icons (arrows, chevrons) flip with `rtl:rotate-180`.
- Numbers use Western digits (0–9) for prices and table numbers — clearer on receipts and for staff.

## 8. Tailwind v4 tokens

Put this in `resources/css/app.css`:

```css
@import "tailwindcss";

@theme {
    --font-sans: "Cairo", system-ui, sans-serif;

    --color-primary: #f57c00;
    --color-primary-strong: #e0450b;
    --color-accent: #ffb300;
    --color-ink: #1c1c1c;
    --color-price: #b85400;
    --color-surface: #fff8f0;
    --color-card: #ffffff;
    --color-muted: #6b6b6b;
    --color-border: #eadfd3;
    --color-success: #1e7b3a;
    --color-danger: #c62828;
    --color-danger-soft: #fdecea;

    --radius-input: 14px;
    --radius-card: 18px;
    --radius-sheet: 24px;

    --text-page: 30px;
    --text-section: 20px;
    --text-title: 16px;
    --text-body: 15px;
    --text-note: 13px;
}

@utility bg-brand-gradient {
    background-image: linear-gradient(to left, #e0450b, #f57c00);
}
```

Map shadcn/ui variables (`--primary`, `--background`, `--destructive`, `--radius`…) to these values so its components inherit the Tawla look.

## 9. Images

- Product photos: real food photos, warm light, 4:3, at least 800×600, under 2 MB, JPG or WebP.
- Missing photo → cream placeholder with the Tawla icon, never a broken image.
- Sample dishes with photos so far: شيش طاووق · كباب حلبي · مشاوي مشكلة. Others still use coloured placeholders until photos arrive.

## 10. Dark mode

Not in the MVP. Tokens are named by role (not by colour) so a dark theme can be added later.
