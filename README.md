# E-Commerce Clone - MERN Stack

A modern, full-featured e-commerce application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) with a design inspired by Flipkart.

## Features

### User Features
- **Modern UI/UX**: Clean, responsive design with the specified color theme (#fdfdfd, #a3a3a3, #404040, #000000)
- **Product Dashboard**: Browse products with search, filter, and sort functionality
- **Product Cards**: Display product information with images, price, category, new badges, and action buttons
- **User Authentication**: Secure login/register system with JWT tokens
- **Shopping Cart**: Add/remove items, update quantities, and manage cart
- **Wishlist**: Save products for later purchase
- **Product Details**: View detailed product information with multiple images, sizes, colors
- **Checkout Process**: Complete purchase flow with size/color selection
- **Payment Integration**: Secure payment processing
- **Order Management**: Track orders, view history, and request returns
- **User Profile**: Manage personal information and preferences

### Admin Features
- **Admin Dashboard**: Overview of sales, orders, and inventory
- **Product Management**: Full CRUD operations for products
- **Order Management**: Process orders, update status, and track shipments
- **User Management**: View and manage user accounts
- **Inventory Control**: Mark products as sold, manage stock levels

### Technical Features
- **Responsive Design**: Mobile-first approach with modern UI
- **Search & Filter**: Advanced product search with multiple filter options
- **Real-time Updates**: Live cart and wishlist updates
- **Image Gallery**: Multiple product images with thumbnail navigation
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling and user feedback
- **Security**: JWT authentication, password hashing, and input sanitization

## Tech Stack

### Frontend
- **React.js**: Modern UI framework
- **React Router**: Client-side routing
- **React Icons**: Icon library
- **React Toastify**: Toast notifications
- **Axios**: HTTP client for API calls
- **CSS3**: Custom styling with CSS variables

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Multer**: File upload handling
- **Stripe**: Payment processing
- **Nodemailer**: Email functionality

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. **Start the backend server:**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd my-e-commerce
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **For production build:**
   ```bash
   npm run build
   ```

### Database Setup

1. **Install MongoDB** (if using local database)
2. **Create database:**
   ```bash
   mongosh
   use ecommerce
   ```

3. **Seed data** (optional):
   - Create sample products, categories, and users
   - Use the provided API endpoints to add test data

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/:id/reviews` - Add product review

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/add` - Add to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist
- `DELETE /api/wishlist/clear` - Clear wishlist

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin)
- `POST /api/orders/:id/return` - Request return
- `POST /api/orders/:id/cancel` - Cancel order

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/products/:id/sold` - Mark product as sold

## Project Structure

```
my-e-commerce/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Wishlist.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── wishlist.js
│   │   ├── orders.js
│   │   ├── payment.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   ├── products/
│   │   │   ├── ProductCard.js
│   │   │   ├── FilterSidebar.js
│   │   │   └── SortDropdown.js
│   │   └── auth/
│   │       ├── ProtectedRoute.js
│   │       └── AdminRoute.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   ├── CartContext.js
│   │   └── WishlistContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── ProductDetail.js
│   │   ├── Cart.js
│   │   ├── Wishlist.js
│   │   ├── Checkout.js
│   │   ├── Payment.js
│   │   ├── Orders.js
│   │   ├── OrderDetail.js
│   │   ├── Profile.js
│   │   └── admin/
│   │       ├── AdminDashboard.js
│   │       ├── AdminProducts.js
│   │       ├── AdminOrders.js
│   │       ├── AdminUsers.js
│   │       ├── AddProduct.js
│   │       └── EditProduct.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## Usage

### For Users
1. **Browse Products**: Visit the home page to see all products
2. **Search & Filter**: Use the search bar and filters to find specific products
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Manage Cart**: View cart, update quantities, or remove items
5. **Checkout**: Proceed to checkout with size/color selection
6. **Payment**: Complete payment using secure payment methods
7. **Track Orders**: View order history and track shipments

### For Admins
1. **Access Admin Panel**: Login with admin credentials
2. **Manage Products**: Add, edit, or delete products
3. **Process Orders**: Update order status and track shipments
4. **View Analytics**: Monitor sales and user activity
5. **Manage Users**: View and manage user accounts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository.

## Future Enhancements

- [ ] Real-time chat support
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced payment methods
- [ ] Social media integration
- [ ] Advanced search with AI
- [ ] Product recommendations
- [ ] Email marketing integration
- [ ] Advanced inventory management
