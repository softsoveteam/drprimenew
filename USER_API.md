# API Doctor Prime — User Side API

Public and authenticated **user** endpoints.

| | |
|---|---|
| **Base URL** | `http://localhost:8000/api` |
| **Content-Type** | `application/json` |
| **Accept** | `application/json` |
| **Auth header** | `Authorization: Bearer {token}` (protected routes only) |

---

## Response envelope

### Success

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error message",
  "errors": {}
}
```

### Pagination (list endpoints)

| Query | Description | Default | Max |
|-------|-------------|---------|-----|
| `page` | Page number | `1` | — |
| `per_page` | Items per page | `15` | `100` |

---

## 1. Authentication

### 1.1 Register

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/user/register` |
| **Auth** | No |

**Request body**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | Yes | max 255 |
| `email` | string | Yes | email, unique |
| `password` | string | Yes | confirmed, Password::defaults() |
| `password_confirmation` | string | Yes | must match `password` |
| `guest_token` | string | No | 16–64 chars. Merges guest cart into the new user. Also accepted via `X-Guest-Token` header. |

**Example request**

```http
POST /api/user/register
Content-Type: application/json
```

```json
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "password": "password123",
  "password_confirmation": "password123",
  "guest_token": "a1b2c3d4e5f6789012345678abcdef01"
}
```

**Example response `201`**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@gmail.com",
      "role": "user",
      "is_active": true,
      "created_at": "2026-09-15T04:00:00.000000Z",
      "updated_at": "2026-09-15T04:00:00.000000Z"
    },
    "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "cart": {
      "items": [],
      "summary": {
        "item_count": 0,
        "unique_items": 0,
        "subtotal": "0.00",
        "currency": "USD"
      }
    }
  }
}
```

---

### 1.2 Login

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/user/login` |
| **Auth** | No |

**Request body**

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |
| `guest_token` | string | No — merges guest cart. Or send `X-Guest-Token`. |

**Example request**

```http
POST /api/user/login
Content-Type: application/json
```

```json
{
  "email": "john@gmail.com",
  "password": "password123",
  "guest_token": "a1b2c3d4e5f6789012345678abcdef01"
}
```

**Example response `200`**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@gmail.com",
      "role": "user",
      "is_active": true,
      "created_at": "2026-09-15T04:00:00.000000Z",
      "updated_at": "2026-09-15T04:00:00.000000Z"
    },
    "token": "2|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

**Errors**

| Status | Message |
|--------|---------|
| `401` | Invalid credentials. |
| `403` | Account is inactive. |
| `403` | Please use admin login. |

---

### 1.3 Get profile

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/user/me` |
| **Auth** | Yes |

**Example request**

```http
GET /api/user/me
Authorization: Bearer {token}
Accept: application/json
```

**Example response `200`**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@gmail.com",
      "role": "user",
      "is_active": true,
      "created_at": "2026-09-15T04:00:00.000000Z",
      "updated_at": "2026-09-15T04:00:00.000000Z"
    }
  }
}
```

---

### 1.4 Logout

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/user/logout` |
| **Auth** | Yes |

**Example request**

```http
POST /api/user/logout
Authorization: Bearer {token}
Accept: application/json
```

**Example response `200`**

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

---

## 2. Articles (public)

Only **published** articles (and scheduled articles whose time has passed) are returned. List omits `content`; detail includes full HTML.

### 2.1 List articles

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/articles` |
| **Auth** | No |

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search title, short_description, focus_keyword |
| `page` | integer | Page number |
| `per_page` | integer | Items per page (default 15) |

**Example request**

```http
GET /api/articles?search=health&page=1&per_page=10
Accept: application/json
```

**Example response `200`**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "user_id": 1,
        "title": "Understanding Private Healthcare in 2026",
        "slug": "understanding-private-healthcare-in-2026",
        "short_description": "A practical guide to private healthcare options.",
        "seo_title": "Private Healthcare Guide 2026",
        "seo_description": "Learn how private healthcare works in 2026.",
        "focus_keyword": "private healthcare",
        "status": "published",
        "scheduled_at": null,
        "published_at": "2026-08-31T07:00:00.000000Z",
        "created_at": "2026-08-31T07:00:00.000000Z",
        "updated_at": "2026-08-31T07:00:00.000000Z"
      }
    ],
    "first_page_url": "http://localhost:8000/api/articles?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost:8000/api/articles?page=1",
    "links": [],
    "next_page_url": null,
    "path": "http://localhost:8000/api/articles",
    "per_page": 10,
    "prev_page_url": null,
    "to": 1,
    "total": 1
  }
}
```

> `content` is **not** included in the list response.

---

### 2.2 Get article by slug

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/articles/{slug}` |
| **Auth** | No |

**Example request**

```http
GET /api/articles/understanding-private-healthcare-in-2026
Accept: application/json
```

**Example response `200`**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "article": {
      "id": 1,
      "user_id": 1,
      "title": "Understanding Private Healthcare in 2026",
      "slug": "understanding-private-healthcare-in-2026",
      "short_description": "A practical guide to private healthcare options.",
      "content": "<h2>Private Healthcare Overview</h2><p>Full article HTML content...</p>",
      "seo_title": "Private Healthcare Guide 2026",
      "seo_description": "Learn how private healthcare works in 2026.",
      "focus_keyword": "private healthcare",
      "status": "published",
      "scheduled_at": null,
      "published_at": "2026-08-31T07:00:00.000000Z",
      "created_at": "2026-08-31T07:00:00.000000Z",
      "updated_at": "2026-08-31T07:00:00.000000Z"
    }
  }
}
```

**Errors**

| Status | When |
|--------|------|
| `404` | Slug not found, draft, or not yet publicly visible |

---

## 3. Areas (public)

Parent/child via `parent_id`:
- `parent_id: null` → parent area
- `parent_id: {id}` → subarea

### 3.1 List areas

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/areas` |
| **Auth** | No |

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| `parent_id` | integer | If set, returns only children of that parent (no nesting) |

**Example request — all parents with children**

```http
GET /api/areas
Accept: application/json
```

**Example response `200`**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "areas": [
      {
        "id": 1,
        "name": "Madrid",
        "parent_id": null,
        "created_at": "2026-08-31T08:00:00.000000Z",
        "updated_at": "2026-08-31T08:00:00.000000Z",
        "children": [
          {
            "id": 2,
            "name": "Sol",
            "parent_id": 1,
            "created_at": "2026-08-31T08:00:00.000000Z",
            "updated_at": "2026-08-31T08:00:00.000000Z"
          }
        ]
      }
    ]
  }
}
```

**Example request — children of one parent**

```http
GET /api/areas?parent_id=1
Accept: application/json
```

**Example response `200`**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "areas": [
      {
        "id": 2,
        "name": "Sol",
        "parent_id": 1,
        "created_at": "2026-08-31T08:00:00.000000Z",
        "updated_at": "2026-08-31T08:00:00.000000Z"
      }
    ]
  }
}
```

---

### 3.2 Get single area

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/areas/{id}` |
| **Auth** | No |

**Example request**

```http
GET /api/areas/1
Accept: application/json
```

**Example response `200`**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "area": {
      "id": 1,
      "name": "Madrid",
      "parent_id": null,
      "created_at": "2026-08-31T08:00:00.000000Z",
      "updated_at": "2026-08-31T08:00:00.000000Z",
      "parent": null,
      "children": [
        {
          "id": 2,
          "name": "Sol",
          "parent_id": 1,
          "created_at": "2026-08-31T08:00:00.000000Z",
          "updated_at": "2026-08-31T08:00:00.000000Z"
        }
      ]
    }
  }
}
```

---

## 4. Contact form (public)

Fields are configured by admin. Only **active** fields are returned and validated on submit.

### 4.1 Get form fields

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/contact-form/fields` |
| **Auth** | No |

**Example request**

```http
GET /api/contact-form/fields
Accept: application/json
```

**Example response `200`**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "fields": [
      {
        "id": 1,
        "label": "Full Name",
        "field_key": "full_name",
        "field_type": "text",
        "options": null,
        "placeholder": "Enter your full name",
        "is_required": true,
        "sort_order": 1,
        "is_active": true,
        "created_at": "2026-08-31T08:00:00.000000Z",
        "updated_at": "2026-08-31T08:00:00.000000Z"
      },
      {
        "id": 2,
        "label": "Email Address",
        "field_key": "email",
        "field_type": "email",
        "options": null,
        "placeholder": "you@example.com",
        "is_required": true,
        "sort_order": 2,
        "is_active": true,
        "created_at": "2026-08-31T08:00:00.000000Z",
        "updated_at": "2026-08-31T08:00:00.000000Z"
      },
      {
        "id": 3,
        "label": "Subject",
        "field_key": "subject",
        "field_type": "select",
        "options": ["General Inquiry", "Support", "Sales"],
        "placeholder": null,
        "is_required": true,
        "sort_order": 3,
        "is_active": true,
        "created_at": "2026-08-31T08:00:00.000000Z",
        "updated_at": "2026-08-31T08:00:00.000000Z"
      }
    ]
  }
}
```

**Supported field types:** `text`, `email`, `textarea`, `number`, `phone`, `select`, `checkbox`, `date`

---

### 4.2 Submit contact form

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/contact-form/submit` |
| **Auth** | No |

Submit values under `fields` using each field’s `field_key`. Validation rules are built dynamically from active fields.

**Example request**

```http
POST /api/contact-form/submit
Content-Type: application/json
```

```json
{
  "fields": {
    "full_name": "John Doe",
    "email": "john@gmail.com",
    "phone": "+447700900000",
    "subject": "Support",
    "message": "I need help with my account."
  }
}
```

**Example response `201`**

```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": {
    "submission": {
      "id": 1,
      "user_id": null,
      "data": {
        "full_name": "John Doe",
        "email": "john@gmail.com",
        "phone": "+447700900000",
        "subject": "Support",
        "message": "I need help with my account."
      },
      "ip_address": "127.0.0.1",
      "created_at": "2026-09-15T04:10:00.000000Z",
      "updated_at": "2026-09-15T04:10:00.000000Z"
    }
  }
}
```

**Errors**

| Status | Message |
|--------|---------|
| `422` | Contact form is not configured yet. |
| `422` | Validation errors for missing/invalid field values |

**Emails on success**
- Admin → `ADMIN_EMAIL` / `mail.admin_address`
- Submitter → confirmation if an `email`-type field value is present

---

## 5. FAQs (public)

Only **active** FAQs are visible. Inactive FAQ show returns `404`.

### 5.1 List FAQs

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/faqs` |
| **Auth** | No |

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search question and answer |
| `page` | integer | Page number |
| `per_page` | integer | Items per page (default 15) |

**Example request**

```http
GET /api/faqs?search=appointment&page=1&per_page=15
Accept: application/json
```

**Example response `200`**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "question": "What is Doctor Prime?",
        "answer": "Doctor Prime is a healthcare platform that helps patients find care.",
        "sort_order": 1,
        "is_active": true,
        "created_at": "2026-08-31T08:00:00.000000Z",
        "updated_at": "2026-08-31T08:00:00.000000Z"
      }
    ],
    "per_page": 15,
    "total": 1
  }
}
```

---

### 5.2 Get single FAQ

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/faqs/{id}` |
| **Auth** | No |

**Example request**

```http
GET /api/faqs/1
Accept: application/json
```

**Example response `200`**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "faq": {
      "id": 1,
      "question": "What is Doctor Prime?",
      "answer": "Doctor Prime is a healthcare platform that helps patients find care.",
      "sort_order": 1,
      "is_active": true,
      "created_at": "2026-08-31T08:00:00.000000Z",
      "updated_at": "2026-08-31T08:00:00.000000Z"
    }
  }
}
```

---

## 6. Products (public)

Catalog lives in the API. Only **active** products are returned. Admin manages stock and price; Amazon FBA can sync into the same table later.

### 6.1 List products

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/products` |
| **Auth** | No |

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Match title, sku, asin |
| `in_stock` | boolean | Only products with `stock_quantity > 0` |
| `page` | integer | Page number |
| `per_page` | integer | Default 15, max 100 |

**Example response `200`**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "sku": "DP-SUPP-001",
        "amazon_sku": "AMZ-SUPP-001",
        "asin": "B0EXAMPLE123",
        "title": "Doctor Prime Supplement",
        "price": "29.99",
        "currency": "USD",
        "stock_quantity": 25,
        "image_url": "https://example.com/product.jpg",
        "amazon_url": "https://www.amazon.com/dp/B0EXAMPLE123",
        "is_active": true,
        "in_stock": true,
        "created_at": "2026-09-23T10:00:00.000000Z",
        "updated_at": "2026-09-23T10:00:00.000000Z"
      }
    ],
    "last_page": 1,
    "total": 1
  }
}
```

### 6.2 Get product

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/products/{id}` |
| **Auth** | No |

Inactive products return `404`.

---

## 7. Cart (guest or authenticated)

Cart rows store `product_id` + `quantity` only. Price and stock come from `products`. Frontend guide: [FRONTEND_CART.md](FRONTEND_CART.md).

| Who | Auth |
|-----|------|
| Guest | Header `X-Guest-Token: {token}` (16–64 chars) |
| Logged in | `Authorization: Bearer {token}` |

If Bearer is present, the **user** cart is used (guest header ignored). Checkout still requires login.

Adding the same `product_id` again **increments quantity**. Stock is validated on add, update, and checkout.

### 7.0 Create guest token

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/cart/guest-token` |
| **Auth** | No |

Returns `{ "guest_token": "..." }`. Store it and send as `X-Guest-Token` on cart calls. Or generate a UUID client-side.

### 7.1 Get cart

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/cart` |
| **Auth** | Bearer **or** `X-Guest-Token` |

**Example response `200`**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": 10,
        "product_id": 1,
        "quantity": 2,
        "line_total": "59.98",
        "product": {
          "id": 1,
          "sku": "DP-SUPP-001",
          "amazon_sku": "AMZ-SUPP-001",
          "asin": "B0EXAMPLE123",
          "title": "Doctor Prime Supplement",
          "price": "29.99",
          "currency": "USD",
          "stock_quantity": 25,
          "image_url": "https://example.com/product.jpg",
          "amazon_url": "https://www.amazon.com/dp/B0EXAMPLE123",
          "is_active": true,
          "in_stock": true
        },
        "created_at": "2026-09-23T10:00:00.000000Z",
        "updated_at": "2026-09-23T10:00:00.000000Z"
      }
    ],
    "summary": {
      "item_count": 2,
      "unique_items": 1,
      "subtotal": "59.98",
      "currency": "USD"
    }
  }
}
```

### 7.2 Add to cart

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/cart` |
| **Auth** | Bearer **or** `X-Guest-Token` |

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `product_id` | integer | Yes | Must exist in `products` |
| `quantity` | integer | No | 1–999, default `1` |

```json
{
  "product_id": 1,
  "quantity": 1
}
```

`201` new row / `200` quantity updated. `422` if inactive or insufficient stock.

### 7.3 Update quantity

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/cart/{id}` |
| **Auth** | Bearer **or** `X-Guest-Token` |

```json
{ "quantity": 3 }
```

### 7.4 Remove item

| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/cart/{id}` |
| **Auth** | Bearer **or** `X-Guest-Token` |

### 7.5 Clear cart

| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/cart` |
| **Auth** | Bearer **or** `X-Guest-Token` |

### 7.6 Merge guest cart into user

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/cart/merge` |
| **Auth** | Yes (Bearer) |

Send `X-Guest-Token` or body `{ "guest_token": "..." }`. Login/register already merge when `guest_token` is provided.
---

## 8. Checkout (authenticated)

Creates a pending order from the cart using **live product prices**, locks `price_at_purchase` on each line, checks stock, and creates a Stripe PaymentIntent. Confirm the card with Stripe.js. Never send a total in the body.

Same cart reuses the pending PaymentIntent. Cart clears and stock decrements only after payment succeeds. When payment succeeds, a PDF invoice is generated, attached to the customer email, and a new-order alert goes to `ADMIN_EMAIL`.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/checkout` |
| **Auth** | Yes |

| Status | When |
|--------|------|
| `422` | Empty cart, inactive/out-of-stock, mixed currency, total under `0.50` |
| `409` | Payment processing or cart already paid |
| `500` | Stripe keys missing |
| `502` | Stripe create failed |

```json
{
  "success": true,
  "message": "Checkout created",
  "data": {
    "order": {
      "id": 1,
      "order_number": "DP-20260923-AB12CD",
      "status": "pending",
      "currency": "USD",
      "subtotal": "59.98",
      "payment_error": null,
      "paid_at": null,
      "items": [
        {
          "id": 1,
          "product_id": 1,
          "sku": "DP-SUPP-001",
          "amazon_sku": "AMZ-SUPP-001",
          "asin": "B0EXAMPLE123",
          "title": "Doctor Prime Supplement",
          "price": "29.99",
          "price_at_purchase": "29.99",
          "currency": "USD",
          "quantity": 2,
          "line_total": "59.98"
        }
      ]
    },
    "payment": {
      "provider": "stripe",
      "publishable_key": "pk_test_...",
      "client_secret": "pi_..._secret_...",
      "payment_intent_id": "pi_..."
    }
  }
}
```

---

## 9. Orders (authenticated)

### 9.1 List orders

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/orders` |
| **Auth** | Yes |

Query: `page`, `per_page`. Status: `pending`, `paid`, `failed`, `canceled`.

### 9.2 Get order

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/orders/{id}` |
| **Auth** | Yes |

While `pending`, syncs with Stripe. If still payable, `payment` includes `client_secret`.

### 9.3 Download invoice

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/orders/{id}/invoice` |
| **Auth** | Yes |

Available after the order is `paid`. Returns `application/pdf`. Order responses include `invoice_number` and `has_invoice`.

```http
GET /api/orders/1/invoice
Authorization: Bearer {token}
Accept: application/pdf
```

---

## Quick reference

| Method | Endpoint | Auth |
|--------|----------|------|
| `POST` | `/user/register` | No |
| `POST` | `/user/login` | No |
| `GET` | `/user/me` | Yes |
| `POST` | `/user/logout` | Yes |
| `GET` | `/products` | No |
| `GET` | `/products/{id}` | No |
| `POST` | `/cart/guest-token` | No |
| `GET` | `/cart` | Bearer or `X-Guest-Token` |
| `POST` | `/cart` | Bearer or `X-Guest-Token` |
| `POST` | `/cart/{id}` | Bearer or `X-Guest-Token` |
| `DELETE` | `/cart/{id}` | Bearer or `X-Guest-Token` |
| `DELETE` | `/cart` | Bearer or `X-Guest-Token` |
| `POST` | `/cart/merge` | Yes |
| `POST` | `/checkout` | Yes |
| `GET` | `/orders` | Yes |
| `GET` | `/orders/{id}` | Yes |
| `GET` | `/orders/{id}/invoice` | Yes |
| `GET` | `/articles` | No |
| `GET` | `/articles/{slug}` | No |
| `GET` | `/areas` | No |
| `GET` | `/areas/{id}` | No |
| `GET` | `/contact-form/fields` | No |
| `POST` | `/contact-form/submit` | No |
| `GET` | `/faqs` | No |
| `GET` | `/faqs/{id}` | No |
