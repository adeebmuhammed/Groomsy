# 💈 Groomsy - Barber Booking Platform

Groomsy is a full-stack barber appointment booking platform that connects customers with barbers while providing powerful business management tools for administrators. The platform simplifies appointment scheduling, subscription management, online payments, and business analytics through a modern, responsive web application.

## 🌐 Live Demo

🔗 https://groomsy.online

<img width="1918" height="1018" alt="image" src="https://github.com/user-attachments/assets/77024739-56c0-427a-938d-e1ad79944130" />


---

## 📖 Overview

Groomsy provides three dedicated roles:

- **Customers** – Browse barbers, book appointments, make secure payments, and manage bookings.
- **Barbers** – Register their business, manage subscriptions, configure available slots, and monitor appointments.
- **Administrators** – Moderate the platform, manage discounts, subscriptions, users, and view business analytics.

---

# ✨ Features

## 👤 User Features

- Secure Registration & Login
- JWT Authentication
- Role-Based Access Control
- Profile Management
- Browse Registered Barbers
- View Barber Details
- Appointment Booking
- Online Payment with Razorpay
- Booking History
- Booking Cancellation
- Responsive UI
- Progressive Web App (PWA)

  <img width="1918" height="1017" alt="image" src="https://github.com/user-attachments/assets/2b0efcae-b258-446a-b2e4-66fa8a8428f3" />
  
  <img width="1918" height="1018" alt="image" src="https://github.com/user-attachments/assets/6d0a3880-1c9c-42e9-91a6-ec53dbb32140" />

  <img width="1918" height="1017" alt="image" src="https://github.com/user-attachments/assets/872aed6c-e62f-463a-8e05-95dd3fcd5de6" />

  <img width="1918" height="1017" alt="image" src="https://github.com/user-attachments/assets/b4652ad8-b125-420c-bd15-671b7dde393b" />

  <img width="1918" height="1017" alt="image" src="https://github.com/user-attachments/assets/9b240963-d422-4b6f-b0af-f47eafb87e49" />

  <img width="1918" height="1017" alt="image" src="https://github.com/user-attachments/assets/5f187615-9b04-48de-a4ad-c28a1466a07d" />

  <img width="1918" height="1018" alt="image" src="https://github.com/user-attachments/assets/ad893980-eb76-4033-ab87-b957370e330b" />

  <img width="1918" height="1018" alt="image" src="https://github.com/user-attachments/assets/96bf75c8-8083-4e2a-859d-7bb570935e05" />

  <img width="1918" height="1017" alt="image" src="https://github.com/user-attachments/assets/6a1049cf-a9ce-4321-abcd-a9ac79b4242a" />

  <img width="1918" height="582" alt="image" src="https://github.com/user-attachments/assets/25d75c87-1b31-4b73-af18-b86632058b1d" />

  <img width="1918" height="820" alt="image" src="https://github.com/user-attachments/assets/4fdb18fe-9d29-4c8b-b9ca-b114907f064a" />

  <img width="1918" height="876" alt="image" src="https://github.com/user-attachments/assets/0a889788-37ae-46fe-8cd4-e4ff6603618d" />

  <img width="1918" height="916" alt="image" src="https://github.com/user-attachments/assets/2ee84ca8-237f-472d-b24b-ae97b340377b" />

---

## 💈 Barber Features

- Barber Registration
- Subscription Management
- Profile Management
- Slot Management
- Appointment Management
- Booking History
- Dashboard Overview

---

## 🛠️ Admin Features

- Dashboard Analytics
- User Management
- Barber Approval & Moderation
- Subscription Management
- Discount & Offer Management
- Performance Analytics
- Booking Monitoring
- Revenue Insights

---

# 🏗️ Architecture

The backend follows a **Layered Architecture** with Dependency Injection and Repository Pattern to ensure scalability, maintainability, and clean separation of concerns.

```
Controller
     │
     ▼
Service Layer
     │
     ▼
Repository Layer
     │
     ▼
MongoDB
```

### Design Patterns

- Service-Repository Pattern
- Dependency Injection (DI)
- Layered Architecture
- RESTful API Design

---

# 🔒 Authentication & Security

- JWT Authentication
- Role-Based Authorization
- Password Hashing
- Protected API Routes
- Secure HTTP Cookies
- Input Validation
- Authentication Middleware

---

# 💳 Payment Integration

Integrated **Razorpay** for secure online payments.

Features include:

- Online Appointment Payment
- Payment Verification
- Secure Transaction Handling
- Order Creation
- Payment Status Management

---

# 📱 Progressive Web App (PWA)

Groomsy supports Progressive Web App features including:

- Installable Application
- Improved Performance

---

# 📊 Admin Dashboard

Administrators can monitor platform activities through:

- User Statistics
- Barber Statistics
- Booking Analytics
- Revenue Tracking
- Subscription Reports
- Performance Insights

---

# 🚀 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | AWS EC2 |
| Database | MongoDB |

---

# 🛠️ Tech Stack

### Frontend

- Angular
- TypeScript
- HTML5
- CSS3
- Bootstrap

### Backend

- Node.js
- Express.js
- JWT Authentication

### Database

- MongoDB

### Payment

- Razorpay

### Deployment

- AWS EC2
- Vercel

### Additional Technologies

- Progressive Web App (PWA)
- Service Workers

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/adeebmuhammed/Groomsy.git
```

## Backend

```bash
cd backend
npm install
npm run start
```

## Frontend

```bash
cd frontend
npm install
ng serve
```

---

# 🌍 Environment Variables

Create a `.env` file in the backend directory.

```env
PORT=

MONGODB_URI=

JWT_SECRET=

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=

AWS_ACCESS_KEY=

AWS_SECRET_KEY=
```

---

# 📌 Future Improvements

- Real-time Notifications
- Email Notifications
- SMS Reminders
- Live Chat
- Reviews & Ratings
- Multi-location Barber Shops
- AI-based Appointment Suggestions

---

# 👨‍💻 Author

**Muhammed Adeeb**

GitHub: https://github.com/adeebmuhammed

LinkedIn: https://www.linkedin.com/in/adeebmuhammed

---

# ⭐ Support

If you like this project, consider giving it a **⭐ Star** on GitHub.
