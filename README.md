# McDonald's Clone - Full Stack E-Commerce Platform

A feature-rich, full-stack web application designed for the HCL Hackathon, mimicking the core functionalities of a modern food delivery and restaurant portal. It features a polished user-facing storefront, a multi-tenant seller architecture, and automated customer notifications.

## 🌟 Key Features

### For Users
* **Dynamic Menu & Search:** Browse products across categories or use the dedicated "All Menu" view. Search is scoped by category for precision.
* **Email Order Receipts:** Automatically receive a professional HTML order confirmation via Gmail upon successful checkout.
* **Real-time Stock Indicators:** Visual badges automatically update to show "Only X left!" for low stock and prevent adding items when "Out of Stock".
* **Premium UI/UX:** Modern single-page application with smooth animations, trust badges, promotional banners, and a footer.

### For Admins / Sellers (Multi-Tenant)
* **Isolated Multi-Tenancy:** Each seller manages their own unique set of categories and products. Sellers only see their own data and revenue.
* **Seller Dashboard:** Real-time metrics showing *seller-specific* Revenue, Orders, Products, and Low Stock alerts.
* **Scoped Order Filtering:** Admins only see order items that belong to them, ensuring privacy and accurate accounting between multiple sellers.
* **Stock Management:** Adjust available inventory quickly from the product list table with an automated audit log (`StockLedger`).

---

## 🏗️ Architecture

This project uses the **MERN** stack (MongoDB, Express, React, Node.js) with standard MVC layered architecture.

### Frontend (`/frontend`)
* **Framework:** React 18, Vite
* **State Management:** Zustand (Handling Cart, Auth, and Roles)
* **Routing:** React Router v6 (Supported by Netlify `_redirects` for SPA refreshes)
* **Styling:** Tailwind CSS + Vanilla CSS (`index.css`) for micro-animations.

### Backend (`/backend`)
* **Database:** MongoDB via Mongoose
* **Auth:** JWT (JSON Web Tokens) with role-based middleware (`adminOnly`).
* **Services:** `emailService.js` using Nodemailer + Gmail for automated notifications.

---

## 🔌 API & Testing

### Documentation
Full API documentation is available in [api_documentation.md](api_documentation.md).

### Postman Collection
A pre-configured Postman collection is included: `PostmanCollection.json`.
1. Import this file into Postman.
2. Set the `baseUrl` variable.
3. Test all flows from Signup to Order Placement.

---

## 🚀 CI / CD & Deployment

* **Deployment:** Pre-configured for deployment on **AWS App Runner** (Backend) and **Netlify** (Frontend).
* **Netlify Routing:** includes `_redirects` and `netlify.toml` to prevent 404 errors on page reloads.
* **Continuous Integration:** GitHub Actions (`.github/workflows/ci.yml`) runs on every push to verify build stability.

## 💻 Running Locally

1. **Clone the repo**
2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file with MONGO_URI, JWT_SECRET, PORT=8080
   # For email: EMAIL_USER and EMAIL_PASS (App Password)
   npm run dev
   ```
3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   # Create a .env.local file with VITE_API_URL=http://localhost:8080/api
   npm run dev
   ```
4. Access at `http://localhost:5173`.

