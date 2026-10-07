# Tawla — Conventions

> Rules everyone (humans and AI assistants) follows when writing code for Tawla.
> If code and this file disagree, fix one of them in the same pull request.

---

## 1. General principles

1. **Server is the source of truth** — prices, totals, availability and status are decided in Laravel, never trusted from the browser.
2. **Thin controllers, logic in Actions** — `app/Actions/*` hold business rules; controllers validate, call, respond.
3. **One feature = one doc** — write `docs/features/NNN-name.md` before coding; keep it after merging.
4. **Small, finished steps** — each PR does one thing and leaves the app working.
5. **Arabic UI, English code** — identifiers, comments, commits and docs in English; everything the user sees in Arabic.

## 2. Naming

### Backend (PHP / Laravel)
| Thing | Convention | Example |
|---|---|---|
| Model | Singular PascalCase | `Product`, `RestaurantTable`, `OrderItem` |
| Table | Plural snake_case | `products`, `restaurant_tables`, `order_items` |
| Foreign key | `{singular}_id` | `category_id`, `restaurant_table_id` |
| Pivot / child snapshot columns | descriptive snake_case | `product_name`, `unit_price` |
| Boolean column | `is_` / `has_` | `is_available`, `is_active` |
| Timestamp column | `_at` | `status_changed_at` |
| Money column | integer **agorot**, no suffix | `price`, `total`, `line_total` |
| Controller | `{Model}Controller` in `Customer/` or `Admin/` | `Admin\ProductController` |
| Form Request | `{Verb}{Model}Request` | `StoreProductRequest`, `UpdateOrderStatusRequest` |
| Action | Verb + noun, `handle()` method | `PlaceOrder`, `ChangeOrderStatus` |
| Enum | Singular PascalCase, string-backed | `OrderStatus::Preparing` (`'preparing'`) |
| Route name | dotted, plural resource | `admin.products.index`, `orders.show` |
| Migration | Laravel default | `create_products_table` |
| Test | `{Feature}Test.php` with Pest `it()` | `PlaceOrderTest.php` |

Style: PSR-12 via **Laravel Pint** (`./vendor/bin/pint`). Use typed properties, return types, and `readonly` where possible.

### Frontend (React / TypeScript)
| Thing | Convention | Example |
|---|---|---|
| File names | kebab-case | `product-card.tsx`, `cart-store.ts` |
| Components | PascalCase export | `export function ProductCard()` |
| Pages | `resources/js/pages/{area}/{name}.tsx` | `pages/customer/menu.tsx` |
| Hooks | `use` + camelCase | `useCart`, `useOrderTokens` |
| Types | PascalCase, no `I` prefix | `Product`, `Order`, `OrderStatus` |
| Props type | `{Component}Props` | `ProductCardProps` |
| Constants | UPPER_SNAKE_CASE | `POLL_INTERVAL_MS` |
| UI strings | `lang/ar.ts`, keyed in English | `t.cart.empty` → «السلة فارغة» |

Rules:
- `strict` TypeScript; **no `any`**. Model types live in `resources/js/types/models.ts` and mirror the Laravel resource shape.
- Use the route helper the starter kit ships — never hard-code URLs.
- Use Inertia `<Link>` / `router` for navigation, `useForm` for forms.
- Tailwind classes only (no inline `style` except dynamic values). Use design tokens (`bg-primary`, `text-price`), never raw hex.
- Logical spacing only: `ms/me/ps/pe/start/end` (RTL).
- Format money only through `lib/money.ts` → `formatPrice(3800) // "38 ₪"`.

## 3. Data passed to the frontend

- Pass only what the page needs. Use API Resources or `->only()` / `->select()`; never send whole models with hidden fields.
- Prices are sent as integer agorot plus formatted string when convenient.
- Dates as ISO 8601 strings; format in the UI (`ar` locale, 24h time «14:05»).

## 4. Business rules

### Money
- Stored and calculated as integers (agorot). `unit_price = product.price + Σ selected option prices`; `line_total = unit_price × quantity`; `total = Σ line_total`.
- No tax or service charge in the MVP.

### Order status transitions
```
new ──► preparing ──► ready ──► completed
 │          │
 └──────────┴──► cancelled
```
- No moving backwards. `completed` and `cancelled` are final.
- Only `completed` orders count in stats and sales.

### Availability
- An unavailable product (or its category inactive) is shown disabled and **cannot** be ordered — enforced on the server too.
- An unavailable add-on is hidden from the product sheet.

### Limits
- Quantity per line: **1–20**. Lines per order: **1–30**. Note: **≤ 255** chars.
- Product name ≤ 100, description ≤ 500, price 0 – 100,000 ₪ (stored ≤ 10,000,000 agorot).
- Image: jpg/jpeg/png/webp, ≤ 2 MB.
- Order placement throttle: 5 per minute per session + IP.

## 5. Edge cases every feature must handle

**Customer**
- [ ] Opening `/menu` without scanning a table → friendly page «امسح رمز QR على طاولتك».
- [ ] Invalid or deactivated `qr_token` → same friendly page, never a 404 stack trace.
- [ ] Customer scans a **different table** → session table switches; the cart is per table (`tawla-cart-{tableId}`).
- [ ] Product becomes unavailable **while in the cart** → cart marks it, blocks sending, server returns an error naming the item.
- [ ] Price changes between adding to cart and sending → server price wins; cart page shows the updated total before sending.
- [ ] Product or add-on deleted while in the cart → removed from cart with a message.
- [ ] Empty cart → send button disabled; server also rejects empty `items`.
- [ ] Add-on that does not belong to the product (tampered request) → 422.
- [ ] Double tap on «أرسل الطلب» → button disabled while processing; only one order created.
- [ ] Page refresh mid-order → cart survives (persisted); status page found again from stored token.
- [ ] Rate limit hit → message «حاولت كثيراً، انتظر دقيقة».
- [ ] Slow network / offline → loading state, error toast, nothing lost.
- [ ] Missing product image → placeholder, not a broken icon.
- [ ] Very long Arabic names/descriptions → truncated with ellipsis, layout does not break at 360px.

**Admin**
- [ ] Deleting a category that has products → blocked with message, or products must be moved first.
- [ ] Deleting a product that appears in past orders → soft delete; past orders still show the snapshot name and price.
- [ ] Editing a price never changes existing orders or stats.
- [ ] Two admins change the same order at once → the second invalid transition is rejected with a clear message.
- [ ] Invalid status transition (e.g. `completed` → `new`) → 422.
- [ ] Duplicate table number → validation error.
- [ ] Regenerating a table's QR token invalidates the old printed code — confirm before doing it.
- [ ] Session expired → redirected to login, then back to the page.
- [ ] Stats with zero completed orders today → show 0, not an error.
- [ ] Upload of a wrong file type or > 2 MB → field error «الصورة يجب أن تكون JPG أو PNG أو WebP وبحجم أقل من 2MB».

## 6. Validation & errors

- Every write goes through a Form Request. Error messages in Arabic (`lang/ar/validation.php` + custom `attributes`).
- Show field errors under the field; show general errors as a toast.
- Never expose stack traces or SQL to users; log them.
- Flash messages: `success` / `error` only, short Arabic sentences («تم الحفظ», «تعذّر الحفظ، حاول مرة أخرى»).

## 7. Testing (Pest)

Must have feature tests for:
- Placing an order: happy path, unavailable product, tampered price/option, missing table, empty cart, throttle.
- Status transitions: allowed and rejected.
- Admin routes require login; customers cannot reach `/admin`.
- Stats count only completed orders of today.

Run before every PR: `php artisan test` · `./vendor/bin/pint --test` · `npm run lint` · `npm run types` (tsc).

## 8. Git & teamwork

- **Branches:** `main` is always deployable. Work on `feature/NNN-short-name`, `fix/short-name`, `docs/short-name`.
- **Commits:** Conventional Commits in English — `feat: add product availability toggle`, `fix: block unavailable items at checkout`, `docs: add feature 004 spec`.
- **Pull requests:** one feature per PR, link the Trello card and the `docs/features` file, include a screenshot for UI changes, the other teammate reviews before merge.
- **Never commit:** `.env`, `vendor/`, `node_modules/`, `public/storage`, uploaded images.
- **Trello flow:** To Do → Doing → Review → Done. The assignee moves the card to Review; the reviewer moves it to Done after merge.

## 9. Feature doc template

`docs/features/NNN-short-name.md`

```md
# NNN — Feature name
Status: planned | in progress | done
User story: #
Owner:

## Goal
## Screens / UI (reference design.md components)
## Routes & controllers
## Database changes
## Business rules
## Edge cases (copy relevant items from convention.md §5)
## Done checklist
- [ ] Works on 360px mobile, RTL
- [ ] Validation + Arabic messages
- [ ] Pest tests pass
- [ ] Pint / lint / types clean
```

Planned feature files: `001-qr-table-entry` · `002-menu-browsing` · `003-cart-and-addons` · `004-place-order` · `005-admin-auth` · `006-menu-management` · `007-availability-toggle` · `008-orders-board` · `009-order-status-page` · `010-dashboard-stats` · `011-tables-and-qr`.

## 10. Working with AI assistants

When asking an AI to write code, give it `product.md`, `architecture.md`, `convention.md`, `design.md` and the relevant `docs/features/NNN-*.md`. Ask it to follow these files and to list any rule it had to break.
