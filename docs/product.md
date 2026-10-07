# Tawla — Product

> **Tawla (طاولة)** — منيو المطعم الرقمي.
> A QR-based digital menu and ordering system for a single restaurant.
> Read this file first: it explains **what** we are building and **why**. The other docs explain **how**.

---

## 1. One-line summary

A customer scans the QR code on their table, browses the menu on their phone, and sends an order straight to an admin dashboard where the restaurant tracks it until it is served. No app install, no customer account.

## 2. The problem

| Who | Pain today |
|---|---|
| Customer | Waits for the waiter to bring the menu and again to take the order; can order an item that has run out; verbal orders cause mistakes in quantity and add-ons. |
| Kitchen / waiter | Peak-time pressure, handwritten tickets, lost or misheard orders. |
| Restaurant owner | Printed menu is expensive to update; no data on order counts or best-selling items. |

**Problem statement:** Restaurant customers suffer long waits and order mistakes because they depend on a static paper menu and orders relayed by hand, which leads to a poor experience, slower service and lost sales.

## 3. The solution

- **Customer side (mobile-first web):** menu grouped by category with photo, description and price → cart with quantity and add-ons → send order → see order status.
- **Admin side (desktop / tablet):** manage categories, products, add-ons, prices, images and availability; manage orders by status; simple daily stats; manage tables and print their QR codes.
- **Each table has its own QR code**, so every order is linked to its table automatically.

## 4. Users

| | Primary: Customer | Secondary: Owner / Manager |
|---|---|---|
| Age | 16–55 | 25–50 |
| Tech level | Medium — uses a phone, knows QR | Low to medium — needs a simple, clear dashboard |
| Device | Phone (360px and up) | Laptop or tablet |
| Account | **None** (guest, identified by table) | Email + password |

Kitchen and cashier staff use the orders screen today through the admin account. A separate low-permission role may come later.

## 5. User stories

| # | Story | Priority | Acceptance criteria |
|---|---|---|---|
| 1 | As a customer I want to scan the table QR to open the menu so I can order without installing an app or waiting. | High | Scanning opens the menu; the table number is stored automatically and shown on screen; the customer never types it. |
| 2 | As a customer I want to browse categories and see each dish's photo, description and price so I can choose with confidence. | High | Categories appear as tabs; each product shows image, name, description, price; unavailable products are shown disabled. |
| 3 | As a customer I want to add a dish to the cart with quantity and add-ons so I order exactly what I want. | High | Total updates instantly on quantity/add-on change; any cart line can be edited or removed. |
| 4 | As a customer I want to send my order and see its status so I know when it is ready. | High | After sending, a confirmation with the order number appears; the status (جديد / قيد التحضير / جاهز / مكتمل) is visible and refreshes on its own. |
| 5 | As an owner I want to create, edit and delete categories, products, add-ons, prices and images so the menu stays up to date. | High | Changes are visible to customers right after saving; name, price and category are validated. |
| 6 | As an owner I want to mark a product available / unavailable so customers can't order sold-out items. | High | One toggle changes availability; customers cannot add an unavailable product to the cart, and the server rejects it too. |
| 7 | As an owner I want to see new orders and change their status so the kitchen stays organised. | High | New orders appear with table number and details; status moves only forward: new → preparing → ready → completed. |
| 8 | As an owner I want to see order counts and sales so I can follow the restaurant's performance. | Medium | Dashboard shows today's order count, today's sales and top products — **completed orders only**. |

## 6. Main flows

### Customer (happy path)
1. Scan QR on the table.
2. Menu opens with the table number set.
3. Browse categories, pick a product.
4. **Decision — is it available?** No → it is disabled, pick another. Yes → continue.
5. Choose quantity and add-ons, add to cart. ("Add more" returns to the menu without losing the cart.)
6. Review cart, optionally add a note (e.g. "بدون بصل"), send the order.
7. See the confirmation and status page.
8. Order shows in the admin dashboard; kitchen updates the status.
9. Order is ready and served to the table.

### Admin
1. Log in to the dashboard.
2. Open Orders — new orders on top with the table number.
3. Open an order → move it to **قيد التحضير**.
4. When done → **جاهز**, then **مكتمل** after it is served.
5. When an item runs out → open the menu and toggle it to **غير متوفر**.

## 7. Order statuses

| Value | Arabic label | Meaning | Who sets it |
|---|---|---|---|
| `new` | جديد | Just placed by the customer | System |
| `preparing` | قيد التحضير | Kitchen started it | Admin |
| `ready` | جاهز | Ready to serve | Admin |
| `completed` | مكتمل | Served; counts in stats | Admin |
| `cancelled` | ملغي | Cancelled by the restaurant (only from `new` or `preparing`) | Admin |

Transitions only move forward (plus cancel). See `convention.md` → Business rules.

## 8. MVP scope (MoSCoW)

**Must have (no launch without these)**
QR per table · browse categories & products · cart with quantity & add-ons · place order · admin login · menu CRUD with images · availability toggle · orders board with status changes.

**Should have (v2 if time is short)**
Customer order-status page · simple stats · table management + QR generation in the dashboard · order note ("بدون بصل").

**Could have**
Menu search · sound alert on new order · real-time updates with Laravel Reverb · Arabic/English UI · "call waiter" button.

**Won't have (out of scope now)**
Online payment (customers pay at the cashier) · delivery / ordering from outside the restaurant · native mobile app · multiple branches or restaurants · loyalty points.

## 9. Product decisions (already made)

| Topic | Decision |
|---|---|
| Restaurants | One restaurant per installation. |
| Customer identity | No account. Table is taken from the QR; each order gets a secret `public_token` used for its status page. |
| Orders per table | A table can send **several separate orders** (e.g. a second round of drinks). No "open bill" in the MVP. |
| Currency | Israeli shekel, shown as `38 ₪`. |
| Tax / service charge | None in the MVP. Total = sum of lines. |
| Payment | At the cashier, outside the system. |
| Language | Arabic only, RTL. Strings are kept in one place so English can be added later. |
| Order updates | Polling every 5 seconds in the MVP; Laravel Reverb later. |

## 10. Sample menu (for seeders and demos)

| Category | Products |
|---|---|
| مشاوي | شيش طاووق · كباب حلبي · مشاوي مشكلة · ريش غنم · أجنحة الدجاج · كفتة بالطحينة |
| أطباق رئيسية | منسف |
| مقبلات وسلطات | حمص · فتوش |
| مشروبات | ليموناضة |
| حلويات | كنافة |

Example add-ons: خبز إضافي · ثومية · بطاطا · لبن.

## 11. Success metrics

- Menu page loads in **≤ 3 s** on a mid-range phone over 4G.
- A product can be added to the cart in **≤ 2 taps** from the menu.
- A new order shows on the admin board within **≤ 5 s**.
- Owner can change a price and see it live in **< 30 s** without help.

## 12. Glossary

| English (code) | Arabic (UI) |
|---|---|
| Category | قسم |
| Product | وجبة / طبق |
| Product option (add-on) | إضافة |
| Restaurant table | طاولة |
| Cart | السلة |
| Order | طلب |
| Order item | عنصر الطلب |
| Available / Unavailable | متوفر / غير متوفر |

## 13. Team

Wesam Awad · Mohammed Zamlat — tasks tracked on the Trello board **Tawla**.
