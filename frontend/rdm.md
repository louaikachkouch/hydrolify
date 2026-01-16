# 🛒 Shopify Clone - MVP

A modern, full-featured Shopify-inspired e-commerce dashboard built with React and Tailwind CSS. This MVP allows users to create an account, manage their online store, handle products, view orders, and preview their storefront.

![React](https://img.shields.io/badge/React-19.x-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### Authentication
- 🔐 User login and registration
- 🔄 Persistent sessions with localStorage
- 🛡️ Protected routes with automatic redirects

### Dashboard
- 📊 Overview stats (sales, orders, products, customers)
- 📈 Sales chart visualization
- 🏆 Top products display
- 📦 Recent orders list

### Products Management (Full CRUD)
- ➕ Add new products with all details
- ✏️ Edit existing products
- 🗑️ Delete products with confirmation
- 🔍 Search and filter products
- 🏷️ Product status management (active/draft/archived)

### Orders
- 📋 Orders list with filtering
- 🔄 Status updates (pending → delivered)
- 👁️ Order detail view
- 📊 Status summary cards

### Store Settings
- 🏪 Store information (name, email, phone, address)
- 🎨 Theme color customization
- 🖼️ Logo upload placeholder
- 🌍 Regional settings (currency, timezone)

### Storefront Preview
- 🛍️ Customer-facing store view
- 🔍 Product search and category filter
- 🛒 Shopping cart functionality
- 📱 Fully responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials
```
Email: demo@shopify.com
Password: demo123
```

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.js    # Main dashboard wrapper with sidebar
│   │   │   └── ProtectedRoute.js     # Route protection HOC
│   │   └── ui/
│   │       ├── Badge.js              # Status badges
│   │       ├── Button.js             # Reusable button component
│   │       ├── Card.js               # Card components
│   │       ├── Input.js              # Form inputs (Input, Select, Textarea)
│   │       ├── Modal.js              # Modal dialog
│   │       ├── Spinner.js            # Loading spinners
│   │       ├── Table.js              # Table components
│   │       └── index.js              # UI components export
│   ├── context/
│   │   ├── AuthContext.js            # Authentication state
│   │   ├── OrdersContext.js          # Orders state
│   │   ├── ProductsContext.js        # Products state
│   │   └── StoreContext.js           # Store settings state
│   ├── data/
│   │   └── mockData.js               # Mock data for products, orders, etc.
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.js              # Login page
│   │   │   └── Register.js           # Registration page
│   │   ├── dashboard/
│   │   │   ├── Dashboard.js          # Main dashboard
│   │   │   ├── Orders.js             # Orders management
│   │   │   ├── Products.js           # Products CRUD
│   │   │   └── Settings.js           # Store settings
│   │   └── storefront/
│   │       └── Storefront.js         # Customer-facing store preview
│   ├── App.js                        # Main app with routing
│   ├── index.js                      # Entry point
│   └── index.css                     # Tailwind CSS + custom styles
├── tailwind.config.js                # Tailwind configuration
├── postcss.config.js                 # PostCSS configuration
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary Blue:** `#2563eb` (and shades 50-900)
- **Secondary Gray:** `#64748b` (and shades 50-900)
- **Background:** `#f9fafb` (gray-50)
- **Cards:** White with subtle shadows

### Typography
- **Font Family:** Inter (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700

### Components
All UI components are reusable and located in `src/components/ui/`:
- Button (primary, secondary, danger, ghost variants)
- Input, Select, Textarea with labels and error states
- Card with header, content, footer sections
- Modal with customizable size
- Badge for status indicators
- Table for data display
- Spinner for loading states

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | Frontend framework |
| React Router 6 | Client-side routing |
| Tailwind CSS 3 | Utility-first styling |
| Heroicons | Icon library |
| React Context | State management |

## 📱 Responsive Design

The application is designed desktop-first with full mobile responsiveness:
- **Desktop:** Full sidebar navigation, multi-column layouts
- **Tablet:** Collapsible sidebar, adapted grid layouts
- **Mobile:** Hamburger menu, single-column layouts, touch-friendly

## 🔮 Future Enhancements

- [ ] Backend API with Node.js/Express
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real authentication with JWT
- [ ] Image upload functionality
- [ ] Payment integration
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- UI design inspired by Shopify Admin
- Icons from [Heroicons](https://heroicons.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
