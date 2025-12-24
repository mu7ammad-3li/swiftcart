<div align="center">

# 🛒 SwiftCart

### Modern E-Commerce Platform for Fast, Seamless Shopping

A feature-rich, scalable e-commerce solution built with cutting-edge web technologies. Shop with confidence with real-time inventory, secure authentication, and a beautiful, responsive interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-11.6-orange.svg)](https://firebase.google.com/)

[Live Demo](#) · [Report Bug](https://github.com/mu7ammad-3li/swiftcart/issues) · [Request Feature](https://github.com/mu7ammad-3li/swiftcart/issues)

</div>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Firebase Setup](#firebase-setup)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 Core Features
- **Product Catalog**: Browse products with advanced filtering and search
- **Shopping Cart**: Real-time cart updates with persistent storage
- **User Authentication**: Secure Firebase authentication with email/password
- **Order Management**: Complete order processing and history tracking
- **Payment Integration**: Ready for Stripe/PayPal integration
- **Responsive Design**: Mobile-first design that works on all devices

</td>
<td width="50%">

### 🔒 Security & Performance
- **Firebase App Check**: Bot and abuse protection
- **Form Validation**: Zod schema validation with React Hook Form
- **Real-time Updates**: Live inventory and order status updates
- **Optimized Loading**: Code splitting and lazy loading
- **SEO Friendly**: Optimized meta tags and semantic HTML
- **Fast Development**: Vite for instant HMR and builds

</td>
</tr>
</table>

---

## 🛠 Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### Backend & Services
![Firebase](https://img.shields.io/badge/Firebase-11.6-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![React Query](https://img.shields.io/badge/React_Query-5.56-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)

### UI Components
![Radix UI](https://img.shields.io/badge/Radix_UI-Latest-161618?style=for-the-badge&logo=radixui&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Latest-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

</div>

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Firebase Account** ([Sign Up](https://firebase.google.com/) - Free Spark plan available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mu7ammad-3li/swiftcart.git
cd swiftcart
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# App Check (Optional - for production)
VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN=your-debug-token
```

### Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard

2. **Enable Authentication**
   - Navigate to Authentication > Sign-in method
   - Enable Email/Password authentication

3. **Create Firestore Database**
   - Navigate to Firestore Database
   - Create database in production mode
   - Set up security rules (see `firestore.rules` example)

4. **Enable Firebase Hosting** (optional)
   - Navigate to Hosting
   - Click "Get started" and follow instructions

5. **Get your Firebase config**
   - Project Settings > Your apps > Add web app
   - Copy the config values to your `.env` file

**Example Firestore Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{product} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /orders/{order} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. **Run the development server**
```bash
npm run dev
```

The application will be running at: **http://localhost:5173**

5. **Build for production**
```bash
npm run build
```

---

## 📁 Project Structure

```
swiftcart/
├── 📂 src/                          # Source code
│   ├── 📂 components/               # React components
│   │   ├── 📂 ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── 📂 layout/              # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── 📂 product/             # Product components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── ProductDetail.tsx
│   │   ├── 📂 cart/                # Cart components
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── Checkout.tsx
│   │   └── 📂 auth/                # Authentication components
│   │       ├── LoginForm.tsx
│   │       ├── RegisterForm.tsx
│   │       └── ProtectedRoute.tsx
│   ├── 📂 pages/                   # Page components
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   └── Orders.tsx
│   ├── 📂 lib/                     # Utilities and configurations
│   │   ├── firebase.ts             # Firebase initialization
│   │   ├── api.ts                  # API calls
│   │   └── utils.ts                # Helper functions
│   ├── 📂 hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useProducts.ts
│   ├── 📂 types/                   # TypeScript type definitions
│   │   ├── product.ts
│   │   ├── user.ts
│   │   └── order.ts
│   ├── 📂 contexts/                # React contexts
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── App.tsx                     # Main application component
│   ├── main.tsx                    # Application entry point
│   └── index.css                   # Global styles
├── 📂 public/                      # Static assets
│   ├── images/
│   └── icons/
├── .env                            # Environment variables (create this)
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── firebase.json                   # Firebase configuration
├── package.json                    # Dependencies and scripts
├── vite.config.ts                  # Vite configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

---

## 📜 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code with ESLint
npm run lint

# Deploy to Firebase Hosting
npm run deploy
```

---

## 🌐 Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**
```bash
firebase login
```

3. **Initialize Firebase**
```bash
firebase init hosting
```

4. **Deploy**
```bash
npm run deploy
```

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

### Deploy to Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Deploy**
```bash
netlify deploy --prod
```

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

**Muhammad Ali**

- GitHub: [@mu7ammad-3li](https://github.com/mu7ammad-3li/)
- Email: muhammad.3lii2@gmail.com
- LinkedIn: [linkedin.com/in/muhammad-3lii](https://linkedin.com/in/muhammad-3lii)

**Project Link**: [https://github.com/mu7ammad-3li/swiftcart](https://github.com/mu7ammad-3li/swiftcart)

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Firebase](https://firebase.google.com/) - Backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - Headless UI components
- [React Query](https://tanstack.com/query) - Data fetching and caching
- [React Router](https://reactrouter.com/) - Routing

---

<div align="center">

**Built with ❤️ by [Muhammad Ali](https://github.com/mu7ammad-3li/)**

[⬆ Back to Top](#-swiftcart)

</div>
