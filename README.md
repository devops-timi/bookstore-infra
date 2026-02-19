# 📚 Folio — Curated Bookstore

A full-stack bookstore application with a literary editorial aesthetic.

## Tech Stack
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Reverse Proxy**: Nginx

---

## Project Structure

```
bookstore/
├── frontend/
│   ├── index.html           # Main SPA shell
│   ├── css/
│   │   └── styles.css       # All styles (variables, layout, components)
│   └── js/
│       ├── books.js         # Static book data (mirrors DB)
│       └── app.js           # UI logic, cart, modals, routing
│
├── backend/
│   ├── server.js            # Express entry point
│   ├── package.json
│   ├── .env.example         # Copy to .env and fill in values
│   ├── config/
│   │   └── db.js            # MySQL connection pool
│   ├── controllers/
│   │   ├── booksController.js
│   │   └── ordersController.js
│   └── routes/
│       ├── books.js         # GET /api/books, GET /api/books/:id
│       └── orders.js        # POST /api/orders, GET /api/orders/:id
│
├── database/
│   └── schema.sql           # CREATE TABLE + seed data
│
└── nginx/
    └── folio.conf           # Nginx reverse proxy config
```

---

## Quick Start

### 1. Database Setup

```bash
# Create DB and seed data
mysql -u root -p < database/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env         # Edit DB credentials
npm install
npm start                    # Production
# or
npm run dev                  # Development (nodemon)
```

### 3. Open in browser

```
http://localhost:3000
```

### 4. Nginx (Production)

```bash
sudo cp nginx/folio.conf /etc/nginx/sites-available/folio
sudo ln -s /etc/nginx/sites-available/folio /etc/nginx/sites-enabled/
# Edit server_name and SSL cert paths in folio.conf
sudo nginx -t && sudo systemctl reload nginx
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/books` | List all books |
| GET | `/api/books?category=nyt` | Filter by category |
| GET | `/api/books/:id` | Single book details |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/:id` | Get order details |

### POST `/api/orders` body
```json
{
  "items": [
    { "bookId": 1, "qty": 2 },
    { "bookId": 5, "qty": 1 }
  ]
}
```

---

## Features

- 📂 **Sidebar navigation** — collapsible, with 6 book categories
- 🖼️ **Gallery view** — grid or list toggle
- 📖 **Product modal** — details, genre, year, stock, add to cart
- 🛒 **Live cart** — qty controls, real-time total, persistent until checkout
- ✅ **Checkout** — server-side order + stock management, confirmation modal
- 📱 **Responsive** — mobile sidebar overlay, 2-column grid on small screens