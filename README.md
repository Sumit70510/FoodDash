# FoodDash - Online Food Ordering Platform

FoodDash is a **MERN (MongoDB, Express.js, React.js, Node.js) Stack-based** food ordering platform that allows users to browse menus, add items to their cart, place orders, and track their order history. The system includes secure authentication, user profiles, search functionality, and seamless checkout.

---

## 📌 Features

### ✅ User Authentication & Profiles
- **Sign Up/Login** (JWT-based authentication)
- **User Profiles** (Manage personal details, addresses, order history)

### 🍽️ Food Browsing & Search
- **Search for food** based on name or category
- **Dynamic filtering** by cuisine, price, and availability

### 🛒 Cart & Checkout
- **Add to Cart** functionality
- **Secure checkout process** with integrated payment gateway
- **Order tracking**

### 📜 Order History
- View past orders with detailed breakdown
- Reorder previously placed orders

---

## 🛠️ Tech Stack

**Frontend:** React.js, HTML, CSS, TailwindCSS  
**Backend:** Node.js, Express.js, MongoDB  
**Authentication:** JSON Web Tokens (JWT)  
**Database:** MongoDB (Mongoose ORM)  
**State Management:** React Context API  

---

## 🚀 Installation & Setup

### Prerequisites
Make sure you have the following installed:
- **Node.js** (v18+ recommended)
- **MongoDB** (Local or Cloud-based)
- **Git**

### Step 1: Clone the Repository
```sh
$ git clone https://github.com/yourusername/FoodDash.git
$ cd FoodDash
```

### Step 2: Install Dependencies
Backend
```sh
$ cd backend
$ npm install
```
Frontend
```sh
$ cd ../frontend
$ npm install
```
###Step 3: Configure Environment Variables
Create a .env file in the backend root and add:
```sh
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=4000
```
###Step 4: Run the Application
Start Backend Server
```sh
$ cd backend
$ npm start
```
Start Frontend Server
```sh
$ cd frontend
$ npm start
```
The application should now be running at http://localhost:3000.

###📌 API Endpoints
##🔑 Authentication
