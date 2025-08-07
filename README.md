# Login System and Shopping Cart

A complete authentication and shopping cart system developed in Node.js with a web interface in JavaScript.

## 🚀 Features

### Authentication
- ✅ Login with username and password
- ✅ Account lockout after multiple failed attempts
- ✅ JWT tokens for authentication
- ✅ Password reset
- ✅ Default user: `admim` / `123`

### Shopping Cart
- ✅ Product listing (smartphones and tablets)
- ✅ Add products to cart
- ✅ Remove products from cart
- ✅ Update quantities
- ✅ Clear cart
- ✅ Checkout
- ✅ Stock control

### Web Interface
- ✅ Responsive and modern design
- ✅ Intuitive interface
- ✅ Feedback messages
- ✅ Button to automatically add sample products

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd desafio3
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Access the application:
- **API**: http://localhost:3000
- **Web Interface**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api-docs

## 🔐 How to Use

### 1. Login
- Go to http://localhost:3000
- Use the credentials: **username**: `admim`, **password**: `123`
- Click "Login"

### 2. Add Products to Cart
After logging in, you can:

**Option A - Automatic:**
- Click the "Add Sample Products" button to automatically add a smartphone and a tablet

**Option B - Manual:**
- Browse available products
- Click "Add to Cart" on desired products

### 3. Manage Cart
- View items in the cart
- Adjust quantities using the + and - buttons
- Remove items individually
- Clear the entire cart
- Checkout

## 📁 Project Structure

```
desafio3/
├── data/
│   ├── users.js          # User management
│   └── products.js       # Product and cart management
├── routes/
│   ├── auth.js           # Authentication routes
│   └── products.js       # Product and cart routes
├── public/
│   ├── index.html        # Web interface
│   └── script.js         # Helper scripts
├── server.js             # Main server
├── package.json          # Dependencies
└── README.md             # Documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify` - Verify token

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get specific product

### Cart
- `GET /api/products/cart` - Get cart
- `POST /api/products/cart` - Add item
- `PUT /api/products/cart/:itemId` - Update quantity
- `DELETE /api/products/cart/:itemId` - Remove item
- `DELETE /api/products/cart` - Clear cart
- `POST /api/products/checkout` - Checkout

## 👥 Default Users

| Username | Password | Name |
|----------|----------|------|
| admim    | 123      | User Admim |
| usuario1 | senha123 | Test User 1 |
| admin    | admin456 | Administrator |
| teste    | teste789 | Test User 2 |

## 📱 Available Products

| ID | Name                     | Category | Price      |
|----|--------------------------|----------|------------|
| 1  | Smartphone Galaxy S23    | Phone    | R$ 2,999.99|
| 2  | iPad Pro 11"             | Tablet   | R$ 5,499.99|
| 3  | iPhone 15 Pro            | Phone    | R$ 6,999.99|
| 4  | Samsung Galaxy Tab S9    | Tablet   | R$ 3,999.99|

## 🛡️ Security

- Passwords encrypted with bcrypt
- JWT tokens for authentication
- Rate limiting to prevent attacks
- Account lockout after failed attempts
- Security headers with Helmet
- Configured CORS

## 🎨 Interface

- Responsive design
- Modern gradients
- Smooth animations
- Visual feedback for actions
- Intuitive interface

## 🚀 Available Scripts

```bash
npm start          # Starts the server
npm run dev        # Starts in development mode
```

## 📝 Usage Example

1. **Start the server:**
```bash
npm start
```

2. **Access the application:**
- Open http://localhost:3000 in your browser

3. **Login:**
- Username: `admim`
- Password: `123`

4. **Add products:**
- Click "Add Sample Products" or
- Add products manually

5. **Checkout:**
- Review the cart
- Click "Checkout"

## 🔧 Development

For development, use:
```bash
npm run dev
```

This will start the server with nodemon for automatic restarts.


## 📄 License

MIT License