🛡️ GuardianLink

**GuardianLink** is a full-stack web application that connects people who need help with volunteers who can assist them.  
Users can create help requests, while volunteers can claim and complete those requests through a role-based dashboard.

The platform demonstrates secure authentication, REST API design, and a clean React dashboard.

---

# 🚀 Features

✅ **JWT Authentication**  
Secure login and registration using JSON Web Tokens.

👥 **Role-Based Access Control**  
Separate dashboards for **Users** and **Volunteers**.

📌 **Help Request Management**
- Users can create help requests
- Volunteers can claim requests
- Volunteers can mark requests as completed

🔄 **Request Status Tracking**
- OPEN → IN_PROGRESS → COMPLETED


📊 **Dashboard Interface**
- Request statistics
- Request filtering
- Volunteer assignment view

📱 **Responsive UI**
Mobile-friendly dashboard built with React.

---

# 🛠️ Tech Stack

### Backend
- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- MySQL

### Frontend
- React.js
- Fetch API
- CSS

---

# 🏗️ Architecture

The backend follows a **layered architecture** for clean separation of concerns.


Controller → Service → Repository → Database


### Request Flow

1️⃣ User interacts with **React UI**  
2️⃣ React sends request to **Spring Boot REST API**  
3️⃣ Controller processes the request  
4️⃣ Service contains business logic  
5️⃣ Repository interacts with **MySQL database**

All secured routes are protected using **JWT authentication via Spring Security filters**.

---

# ⚙️ Core Functional Flow

### 👤 User Flow
1. Register / Login
2. Create help request
3. Track request status

### 🙋 Volunteer Flow
1. Login as volunteer
2. View available requests
3. Claim a request
4. Mark request as completed

---

# 🔗 API Overview

| Method | Endpoint | Description |
|------|------|------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and receive JWT |
| GET | `/requests` | View all requests |
| GET | `/requests/my` | View user's requests |
| GET | `/requests/assigned` | View volunteer assigned requests |
| POST | `/requests` | Create new help request |
| PUT | `/requests/{id}/claim` | Volunteer claims request |
| PUT | `/requests/{id}/complete` | Mark request completed |
| DELETE | `/requests/{id}` | Delete request |

---

# ▶️ Running the Project

### 1️⃣ Start Backend

bash
cd backend
mvn spring-boot:run
Backend runs on:
http://localhost:8081

### 2️⃣ Start Frontend
cd frontend
npm install
npm start
Frontend runs on:
http://localhost:3000