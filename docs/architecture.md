# Tawla — Architecture

> How the system is built. Read `product.md` first for the what and why.

---

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| Backend | **Laravel 12+** (PHP 8.2+) | Controllers, Form Requests, Eloquent, Policies |
| Frontend | **React 19 + TypeScript** | Pages rendered through Inertia |
| Glue | **Inertia.js 2** | One monolith: no separate REST API, no CORS, no tokens |
| Styling | **Tailwind CSS v4** | Design tokens in `resources/css/app.css` (`@theme`) — see `design.md` |
| UI kit | **shadcn/ui** (ships with the starter kit) | Restyled with Tawla tokens |
| Client state | **Zustand** (+ `persist`) | Cart only. Everything else comes from Inertia props |
| Database | **MySQL 8** | |
| Auth | **Laravel React Starter Kit** auth | Admin only; public registration disabled |
| Images | Laravel Storage, `public` disk | `php artisan storage:link` |
| QR codes | `simplesoftwareio/simple-qrcode` | SVG per table |
| Live updates | Inertia `usePoll` (5 s) | Laravel Reverb later (Could have) |
| Tests | **Pest** | Feature tests for critical paths |
| Code style | Laravel Pint · ESLint · Prettier | Run before every commit |

Starting point: `laravel new tawla` → choose **React** starter kit → **Pest**.

## 2. High-level picture

```
 Customer phone                         Admin laptop / tablet
 ┌──────────────┐                       ┌──────────────────┐
 │ Scan QR      │                       │ Login            │
 │ /t/{token}   │                       │ /admin/...       │
 └──────┬───────┘                       └────────┬─────────┘
        │ Inertia (HTML first load, JSON after)  │
        ▼                                        ▼
 ┌─────────────────────────────────────────────────────────┐
 │ Laravel                                                 │
 │  routes/web.php ─► Controllers ─► Actions ─► Models     │
 │                    Form Requests   (business logic)     │
 │                    Policies / Middleware                │
 └──────────────────────────┬──────────────────────────────┘
                            ▼
                     MySQL  +  storage/app/public (images)
```

- **Controllers stay thin**: validate (Form Request) → call an Action → return `Inertia::render()` or `redirect()`.
- **Business logic lives in `app/Actions`** (e.g. `PlaceOrder`, `ChangeOrderStatus`). Easy to test, reused by any controller.
- **Prices are always computed on the server.** The client sends only IDs and quantities.

## 3. Folder structure

```
tawla/
├── app/
│   ├── Actions/
│   │   ├── PlaceOrder.php
│   │   └── ChangeOrderStatus.php
│   ├── Enums/
│   │   └── OrderStatus.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Customer/        # MenuController, TableEntryController, OrderController
│   │   │   └── Admin/           # DashboardController, CategoryController, ProductController,
│   │   │                        # ProductOptionController, TableController, OrderController
│   │   ├── Middleware/
│   │   │   ├── EnsureTableSelected.php
│   │   │   └── HandleInertiaRequests.php   # shared props
│   │   └── Requests/
│   │       ├── Customer/StoreOrderRequest.php
│   │       └── Admin/…Request.php
│   ├── Models/                  # Category, Product, ProductOption, RestaurantTable,
│   │                            # Order, OrderItem, OrderItemOption, User
│   └── Support/Money.php        # format agorot → "38 ₪"
├── database/
│   ├── migrations/
│   ├── factories/
│   └── seeders/                 # MenuSeeder uses the sample menu in product.md
├── resources/
│   ├── css/app.css              # Tailwind + @theme tokens
│   └── js/
│       ├── pages/
│       │   ├── customer/        # menu.tsx, cart.tsx, order-status.tsx, invalid-table.tsx
│       │   └── admin/           # dashboard.tsx, orders/index.tsx, products/{index,form}.tsx …
│       ├── components/
│       │   ├── ui/              # shadcn primitives (restyled)
│       │   ├── customer/        # product-card.tsx, category-tabs.tsx, cart-bar.tsx …
│       │   └── admin/           # status-badge.tsx, availability-switch.tsx …
│       ├── layouts/             # customer-layout.tsx, admin-layout.tsx
│       ├── stores/cart-store.ts # Zustand
│       ├── lib/                 # money.ts, utils.ts
│       ├── lang/ar.ts           # all UI strings
│       └── types/               # models.ts, index.d.ts (shared props)
├── routes/web.php
├── tests/Feature/
└── docs/
    ├── product.md
    ├── architecture.md
    ├── convention.md
    ├── design.md
    └── features/                # one file per feature, never deleted
        └── 001-qr-table-entry.md …
```

## 4. Database

Money is stored as **integer agorot** (`3800` = `38.00 ₪`) to avoid float errors.

```
users                 id, name, email, password, timestamps

categories            id, name, sort_order (int), is_active (bool),
                      timestamps, deleted_at

products              id, category_id → categories, name, description (text, null),
                      price (unsigned int, agorot), image_path (null),
                      is_available (bool, default true), sort_order,
                      timestamps, deleted_at

product_options       id, product_id → products, name, price (unsigned int, default 0),
                      is_available (bool), sort_order, timestamps, deleted_at

restaurant_tables     id, number (unsigned smallint, unique), qr_token (char 32, unique),
                      is_active (bool), timestamps

orders                id, restaurant_table_id → restaurant_tables,
                      public_token (char 32, unique),
                      status (string, OrderStatus enum, index),
                      note (string 255, null), total (unsigned int),
                      status_changed_at, timestamps

order_items           id, order_id → orders (cascade), product_id → products (null on delete),
                      product_name (snapshot), unit_price (snapshot), quantity (tinyint),
                      line_total, timestamps

order_item_options    id, order_item_id → order_items (cascade),
                      product_option_id → product_options (null on delete),
                      option_name (snapshot), price (snapshot), timestamps
```

**Why snapshots?** `order_items` copies the product name and price at order time, so old orders and stats never change when the menu is edited or an item is deleted.

**Soft deletes** on `categories`, `products`, `product_options` — past orders keep their references.

**Indexes:** `orders(status, created_at)`, `products(category_id, sort_order)`.

Relations: Category hasMany Product · Product hasMany ProductOption · RestaurantTable hasMany Order · Order hasMany OrderItem · OrderItem hasMany OrderItemOption.

## 5. Routes

### Customer (no auth)

| Method | URI | Name | Purpose |
|---|---|---|---|
| GET | `/t/{qr_token}` | `table.enter` | Validate table, put `table_id` in session, redirect to menu |
| GET | `/menu` | `menu` | Categories + available products (needs table in session) |
| GET | `/cart` | `cart` | Cart review + note + send |
| POST | `/orders` | `orders.store` | Place order — `throttle:orders` (5 / minute per session+IP) |
| GET | `/orders/{order:public_token}` | `orders.show` | Order confirmation + status (polled) |

The QR encodes `https://<domain>/t/{qr_token}`. The token is random, so table URLs can't be guessed by changing a number.

### Admin (`auth`, prefix `/admin`, name `admin.`)

| Method | URI | Purpose |
|---|---|---|
| GET | `/admin` | Dashboard: today's orders, sales, top products |
| GET | `/admin/orders` | Orders board by status (polled) |
| PATCH | `/admin/orders/{order}/status` | Change status |
| resource | `/admin/categories` | CRUD + sort |
| resource | `/admin/products` | CRUD + image upload |
| PATCH | `/admin/products/{product}/availability` | Toggle available |
| resource | `/admin/products/{product}/options` | Add-on CRUD (shallow) |
| resource | `/admin/tables` | CRUD |
| GET | `/admin/tables/{table}/qr` | Download QR (SVG) |

Registration routes from the starter kit are **removed**. The admin user is created by a seeder / `php artisan make:admin`.

## 6. Key flows

### Place order (`PlaceOrder` action)
1. `StoreOrderRequest` validates: `items` (1–30), each `product_id` exists, `quantity` 1–20, `option_ids` belong to that product, `note` ≤ 255.
2. Table comes from the **session**, never from the request body. Missing or inactive table → 422.
3. Inside `DB::transaction()`:
   - Load products + options fresh from the DB.
   - Reject any product/option that is unavailable or soft-deleted → validation error naming the item.
   - Compute `unit_price = product.price + Σ option.price`, `line_total`, `total` **on the server**.
   - Create `order` (status `new`, random `public_token`), items, options with snapshots.
4. Redirect to `orders.show` with the token. The client stores the token in `localStorage` to find the order again.

### Status change (`ChangeOrderStatus` action)
- Allowed transitions are defined on the `OrderStatus` enum (`canTransitionTo()`).
- Invalid transition → 422. Sets `status_changed_at`.

### Live updates
- `admin/orders` and `orders.show` use Inertia `usePoll(5000, { only: ['orders'] })`.
- Later: replace polling with Laravel Reverb broadcasting `OrderPlaced` / `OrderStatusChanged` — controllers and actions stay the same.

## 7. Frontend state

| Data | Where it lives |
|---|---|
| Menu, orders, stats, auth user | Inertia page props (server is the source of truth) |
| Cart | Zustand store, persisted to `localStorage` under `tawla-cart-{tableId}` |
| Last order tokens | `localStorage` `tawla-orders` |
| Form state | Inertia `useForm` |

Shared props (via `HandleInertiaRequests`): `auth.user`, `table` (`{ id, number } | null`), `flash` (`success` / `error`).

The cart stores only `productId`, `optionIds`, `quantity`, and display copies of name/price. On the cart page, prices are re-checked against fresh props; the server total is final.

## 8. Security

- Admin routes behind `auth` middleware; registration disabled.
- All input validated with Form Requests; CSRF handled by Laravel + Inertia.
- Prices and totals computed only on the server.
- `throttle:orders` rate limit on order placement.
- Image uploads: `image|mimes:jpg,jpeg,png,webp|max:2048`, stored with a generated name.
- Order status page only reachable with the secret `public_token`; responses never include other orders.
- `.env` never committed; `APP_DEBUG=false` in production.

## 9. Performance

- Menu query: one eager-loaded query (`categories.with('products.options')`), only active + not deleted.
- Images: `loading="lazy"`, fixed aspect ratio to avoid layout shift, max upload 2 MB (resize to 800px later if needed).
- Dashboard stats computed with aggregate queries on `completed` orders of today only.

## 10. Environments & setup

```bash
git clone https://github.com/WesamAwad/Tawla.git && cd Tawla
composer install && npm install
cp .env.example .env && php artisan key:generate
# set DB_* in .env (MySQL)
php artisan migrate --seed
php artisan storage:link
composer run dev      # Laravel server + Vite together
```

Default seeded admin (local only): `admin@tawla.test` / `password`.

## 11. Docs workflow

- `docs/features/NNN-short-name.md` — one file per feature before coding it (goal, user story #, screens, routes, DB changes, edge cases, done checklist). Files are **kept**, not deleted, so they become the project history.
- When a decision in this file changes, update this file in the same pull request.
