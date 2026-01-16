# Hydrolify Backend

Node.js/Express backend with MongoDB for the Hydrolify e-commerce platform.

## Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hydrolify?retryWrites=true&w=majority

# JWT Secret (use a strong random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=5000

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

### 3. Seed the Database

Populate the database with demo data:

```bash
npm run seed
```

This creates:
- 3 demo users with stores
- Sample products for each store
- Sample orders

### 4. Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The API will be available at `http://localhost:5000`

---

## API Endpoints

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check if API is running |

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user + store | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Stores

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/stores` | Get all active stores | No |
| GET | `/api/stores/slug/:slug` | Get store by slug | No |
| GET | `/api/stores/subdomain/:subdomain` | Get store by subdomain | No |
| GET | `/api/stores/my-store` | Get current user's store | Yes |
| PUT | `/api/stores/my-store` | Update store settings | Yes |
| PUT | `/api/stores/my-store/subdomain` | Update store subdomain | Yes |
| GET | `/api/stores/check-subdomain/:subdomain` | Check subdomain availability | No |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products/store/:storeId` | Get products by store | No |
| GET | `/api/products/store/:storeId/active` | Get active products | No |
| GET | `/api/products/my-products` | Get current user's products | Yes |
| GET | `/api/products/:id` | Get single product | No |
| POST | `/api/products` | Create product | Yes |
| PUT | `/api/products/:id` | Update product | Yes |
| DELETE | `/api/products/:id` | Delete product | Yes |

### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/orders/my-orders` | Get current user's orders | Yes |
| GET | `/api/orders/:id` | Get single order | Yes |
| POST | `/api/orders` | Create order (checkout) | No |
| PUT | `/api/orders/:id/status` | Update order status | Yes |
| PUT | `/api/orders/:id/payment` | Update payment status | Yes |
| GET | `/api/orders/stats/dashboard` | Get dashboard statistics | Yes |

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Making Authenticated Requests

Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Expiration

Tokens expire after 7 days. Users need to login again after expiration.

---

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  storeId: ObjectId (ref: Store)
}
```

### Store
```javascript
{
  slug: String (unique),
  subdomain: String (unique),
  ownerId: ObjectId (ref: User),
  storeName: String,
  storeEmail: String,
  storePhone: String,
  storeAddress: String,
  storeLogo: String,
  themeColor: String,
  currency: String,
  timezone: String,
  description: String,
  isActive: Boolean
}
```

### Product
```javascript
{
  storeId: ObjectId (ref: Store),
  name: String,
  description: String,
  price: Number,
  compareAtPrice: Number,
  inventory: Number,
  category: String,
  status: 'active' | 'draft' | 'archived',
  image: String
}
```

### Order
```javascript
{
  orderId: String (auto-generated),
  storeId: ObjectId (ref: Store),
  customer: { name: String, email: String },
  items: [{ productId, name, quantity, price }],
  total: Number,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed',
  shippingAddress: String
}
```

---

## Demo Accounts

After running `npm run seed`:

| Email | Password | Store |
|-------|----------|-------|
| demo@hydrolify.com | demo123 | Demo Store |
| fashion@hydrolify.com | demo123 | Fashion Boutique |
| tech@hydrolify.com | demo123 | Tech Zone |

---

## Project Structure

```
backend/
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── models/
│   ├── User.js          # User schema
│   ├── Store.js         # Store schema
│   ├── Product.js       # Product schema
│   └── Order.js         # Order schema
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── stores.js        # Store routes
│   ├── products.js      # Product routes
│   └── orders.js        # Order routes
├── seeds/
│   └── seed.js          # Database seeder
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore file
├── package.json         # Dependencies
├── README.md            # This file
└── server.js            # Main server entry point
```

---

## Common Commands

```bash
# Install dependencies
npm install

# Start development server (with nodemon)
npm run dev

# Start production server
npm start

# Seed database with demo data
npm run seed
```

---

## Deployment

### Environment Variables for Production

Make sure to set these in your production environment:

- `MONGODB_URI` - Your production MongoDB connection string
- `JWT_SECRET` - A strong, unique secret key
- `PORT` - Port for the server (usually provided by hosting)
- `FRONTEND_URL` - Your production frontend URL (for CORS)

### Deploying to Railway/Render/Heroku

1. Connect your repository
2. Set environment variables
3. Deploy

The server will automatically use the `PORT` environment variable provided by the hosting platform.

---

## Troubleshooting

### MongoDB Connection Issues

- Verify your connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database user has proper permissions

### CORS Errors

- Make sure `FRONTEND_URL` matches your frontend's URL exactly
- Include the protocol (http:// or https://)

### Authentication Errors

- Check if the JWT token is being sent correctly
- Verify the token hasn't expired
- Ensure `JWT_SECRET` is the same across restarts

---

## License

MIT
