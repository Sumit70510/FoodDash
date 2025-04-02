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
## 📷 Screenshots
![Screenshot (153)](https://github.com/user-attachments/assets/dc369344-9e72-4393-b2f8-d922b551f395)
---
![Screenshot (148)](https://github.com/user-attachments/assets/149058b2-cab6-4e32-b45e-018b10eb8108)
---
![Screenshot (154)](https://github.com/user-attachments/assets/66bb626c-9cb8-4aa1-b429-cb410b915a71)
---
![Screenshot (124)](https://github.com/user-attachments/assets/773972de-21ab-4f6b-9cd7-8403e1c55b74)
---
![Screenshot (139)](https://github.com/user-attachments/assets/716f61d3-90c7-48cb-854c-ef127efe168a)
---
![Screenshot (94)](https://github.com/user-attachments/assets/95af8e65-2ba6-4395-9c7a-0566513536aa)
---
![Screenshot (86)](https://github.com/user-attachments/assets/b82175c1-247e-4c63-bde8-301f69da18cb)
---
![Screenshot (88)](https://github.com/user-attachments/assets/7a0be5fe-73f5-44f6-9647-a7672790e922)
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
$ npm install express mongoose dotenv jsonwebtoken bcryptjs cors
```
Frontend
```sh
$ cd frontend
$ npm install
$ npm install bootstrap react-bootstrap axios react-router-dom
```
### Step 3: Configure Environment Variables
Create a .env file in the backend root and add:
```sh
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=4000
```
### Step 4: Run the Application
Start Backend Server
```sh
$ cd backend
$ npx start
```
Start Frontend Server
```sh
$ cd frontend
$ npm start
```
The application should now be running at http://localhost:3000.

## 📌 API Endpoints
### 🔑 Authentication

| Method	     | Endpoint | Description                    |
|--------------|---------|----------------------------------|
| `POST`       | /api/createuser | Register a new user   |
| `POST`       | /api/loginuser  | Login user            |

### 🍽️ Food & Orders
| Method	| Endpoint	| Description |
|--------------|---------|----------------------------------|
| `GET`	| /api/getFood	 | Fetch available food items |
| `POST`	| /api/addToCart |	Add food item to cart |
| `POST`	| /api/checkout	| Process order checkout |
| `GET` |	/api/myOrders	| Retrieve user order history |


### 📞 Contact
For any queries or contributions, reach out to us at sumit.verma.70510@gmail.com or visit sumit70510@github.com 
