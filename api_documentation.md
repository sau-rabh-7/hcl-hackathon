# McDonald's Hackathon API Documentation

This document lists all the API endpoints available in the backend and provides instructions for testing them with Postman.

## Base URL
`http://localhost:8080/api` (Local Development)
`https://tbbd2kigze.ap-south-1.awsapprunner.com/api` (Production/AWS)

## Authentication
Most protected routes require a `Bearer <token>` header. Get this token by logging in.

### Auth Endpoints
- **POST `/auth/signup`**: Register a new user or admin.
  - Body: `{ "name", "email", "password", "role" }` (role can be 'User' or 'Admin')
- **POST `/auth/login`**: Login to get a JWT token.
  - Body: `{ "email", "password" }`

### Category Endpoints
- **GET `/categories`**: Get all categories (Public).
- **GET `/categories/admin/all`**: Get categories belonging to the logged-in admin.
- **POST `/categories`**: Create a new category (Admin only).
  - Body: `{ "name", "description", "logoUrl" }`
- **PUT `/categories/:id`**: Update a category (Admin only/Owner only).
- **DELETE `/categories/:id`**: Delete a category (Admin only/Owner only).

### Product Endpoints
- **GET `/products`**: Get all products (Public, paginated).
- **GET `/products/admin/all`**: Get products belonging to the logged-in admin with revenue stats.
- **GET `/products/search?q=query`**: Search products by title or description.
- **POST `/products`**: Create a new product (Admin only).
  - Body: `{ "categoryId", "title", "description", "cost", "stockQuantity", "imageUrl", "isCombo", "addons": [] }`
- **PUT `/products/:id`**: Update a product (Admin only/Owner only).
- **DELETE `/products/:id`**: Delete a product (Admin only/Owner only).
- **PUT `/products/:id/stock`**: Update product stock.
  - Body: `{ "changeAmount", "reason" }`

### Order Endpoints
- **POST `/orders/place`**: Place a mock order.
  - Body: `{ "items": [ { "productId", "quantity", "priceAtPurchase" } ], "totalAmount" }`
- **GET `/orders/history`**: Get order history for the logged-in user.
- **GET `/orders/admin/all`**: Get orders containing the logged-in admin's products.

## Postman Collection
I have created a `PostmanCollection.json` file in the root directory. You can import this file into Postman to start testing immediately.

1. Open Postman.
2. Click **Import**.
3. Select the `PostmanCollection.json` file from the project folder.
4. Set the `baseUrl` variable in the collection variables if needed.
