# ShopMate AI Marketplace 🥬🛒

ShopMate AI Marketplace is a high-fidelity, production-ready modern e-commerce application built on React, TypeScript, and Tailwind CSS, fully integrated with Firebase services for real-time synchronization, credentials authentication, and hosting logistics.

The workspace features a multi-portal sandbox environment allowing instant, synchronized side-by-side switching between the **Customer Portal**, **Vendor Portal**, and the **Admin Dashboard**, backed by an automated Firestore database seeding mechanism.

---

## 🚀 Key Modules

### 1. Customer Portal 📱
An immersive, glassmorphic shopping interface built on fluid micro-animations and Apple-style visual guidelines:
- **Authentication**: Phone OTP Verification (`198200` default) and Google authentication using Firebase Auth.
- **Product Catalog**: Dynamic, search-optimized product grid with full-size visual ratios, stock markers, and customer ratings.
- **AI Semantic Search**: An intelligent query analyzer that parses natural shopping inputs (e.g. *"Show organic fruits"* or *"Look for charging cables"*) and maps them dynamically to their respective categories.
- **Horizontal Categories**: Instant tab filtering across fruits, vegetables, dairy, snacks, beverages, and electronics.
- **Shopping Cart**: Frosted glass basket ribbon showing quantity adjustments with stock limitations and total subtotals.
- **Checkout Flow**: confirmation selectors for delivery addresses and payment clients.
- **Razorpay Payments**: Authentic Razorpay Checkout SDK popup integration (`checkout.js`) with dynamic client-side sandbox fallbacks to ensure successful testing.
- **Receipts & Order History**: Print-ready receipt views complete with visual SVG barcodes, pricing breakdowns, and a dedicated Customer Order History portal filtering by logged-in users.

### 2. Vendor Portal 🏪
A unified, responsive retail workspace designed to empower verified shop owners:
- **Authorization**: Persisted brand login selectors mapped to active store entities (`ShopMate Express`, `Blinkit Mart`, `Wellness Express`).
- **Revenue Dashboard**: Real-time sales metrics, processed dispatches count, catalog quantities, and average rating summaries calculated on the fly from active Firestore context arrays.
- **Inventory Manager**: Complete inventory grid with fully validated modal overlay forms to **Add Product** and **Edit Product** listings directly in Firestore.
- **Orders Dispatcher**: Real-time order dispatch management allowing vendors to transition order status variables (`Processing`, `Shopping & Picking`, `Courier Dispatched`, `Delivered`) which propagate instantly to the customer tracking viewport.

### 3. Admin Dashboard 📊
A comprehensive analytical control center for marketplace administrators:
- **Analytics Overview**: Dynamic widgets presenting gross platform sales, active shopper accounts count, completed dispatches, and active database inventory indexes.
- **Product Management**: Database catalog manager with direct Firestore deletion and updating methods.
- **Order Management**: Comprehensive dispatch tracker monitoring all shopper transactions.
- **User Management**: Unified customer ledger tracking order histories, tier classifications, and total expenditures.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | **React 18 + TypeScript** | Strongly typed, reactive component hierarchy |
| **Styling Engine** | **Tailwind CSS** | Premium glassmorphism UI variables and fluid transitions |
| **Database** | **Firebase Firestore** | Real-time synchronization and offline document caching |
| **Authentication** | **Firebase Auth** | Secure SMS phone Verification and Google credentials |
| **Payments SDK** | **Razorpay Web Checkout** | Dynamic `checkout.js` dynamic loader and popup modal |
| **Build System** | **Vite** | Fast Hot-Module Replacement (HMR) bundler |
| **Deployment** | **Netlify** | Continuous deployment via Git pipelines |

---

## 📐 Architecture Diagram

```
                 +-----------------------------------------+
                 |       ShopMate React Sandbox UI         |
                 |  (Customer / Vendor / Admin Portals)    |
                 +-------------------+-----------------+
                                     |
                         [ShopContext Provider]
                                     |
                 +-------------------+-----------------+
                 |       Firebase client SDK Interface  |
                 +-------------------+-----------------+
                                     |
              +----------------------+----------------------+
              |                                             |
    +---------v----------+                       +----------v---------+
    | Firebase Auth      |                       | Firestore DB       |
    | (OTP Verification) |                       | (Real-time Sync)   |
    +--------------------+                       +----------+---------+
                                                            |
                                               +------------+------------+
                                               |                         |
                                        +------v------+           +------v------+
                                        |  /products  |           |   /orders   |
                                        +-------------+           +-------------+
                                        |  /payments  |           |   /users    |
                                        +-------------+           +-------------+
```

---

## ⚡ Installation & Setup

Follow these steps to configure your local development environment:

### 1. Clone the Project
Navigate to the `react-app` directory inside your terminal workspace:
```bash
cd react-app
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the `react-app` directory and define your Firebase and Razorpay credentials:
```env
# Firebase SDK Configuration
VITE_FIREBASE_API_KEY=AIzaSyFakeKey_ShopMateClient_98200
VITE_FIREBASE_AUTH_DOMAIN=shopmateai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=shopmateai
VITE_FIREBASE_STORAGE_BUCKET=shopmateai.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:12345:web:fakeappid

# Razorpay Checkout Public Key
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
```

### 3. Load Node Dependencies
Install all required project packages:
```bash
npm install
```

### 4. Run Development Server
Initialize the Vite hot-reloading development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` to interact with the sandbox.

---

## ☁️ Deployment Steps

To deploy the production build of ShopMate AI Marketplace to Netlify:

### 1. Compile Production Assets
Run the Vite build compiler to generate optimal minified assets:
```bash
npm run build
```
This compiles your modules and places output assets inside the `dist/` directory.

### 2. Configure Netlify Deployments
Deployments are managed dynamically via the `netlify.toml` file in the root:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Deploy via Netlify CLI
Install the Netlify CLI tool locally and deploy the pre-built `dist` folder:
```bash
# Log in to your Netlify dashboard
npx netlify login

# Initialize deployment configuration
npx netlify init

# Settle build assets live on production hosting
npx netlify deploy --prod
```

---

## 🖼️ Screenshots Section

Here is a conceptual walkthrough of the application's premium portal pages:

| Customer Viewport | Vendor Dashboard | Admin Analytics |
| :---: | :---: | :---: |
| ![Customer Hub UI](https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=200) | ![Vendor Panel UI](https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=200) | ![Admin Dashboard UI](https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=200) |

---

## 🔮 Future Enhancements

- **Voice AI Shopping Assistant**: Integrated conversational voice recognition loops to let customers checkout by speaking their grocery lists.
- **Advanced Predictive Inventory**: Machine learning algorithms inside the Admin portal to forecast retail stock shortages based on purchasing histories.
- **Multi-Vendor Payout Splits**: Server-side Node/Express webhook handlers to route dynamic financial splits to respective vendors automatically during Razorpay checkout capture.
- **Logistics Geo-Tracking**: Live map tracking using Google Maps API for customer dispatch tracking.
