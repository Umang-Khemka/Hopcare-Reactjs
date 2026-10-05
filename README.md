# 🏥 HopCare

> A full-stack healthcare management platform for connecting patients and doctors through secure authentication, appointment scheduling, prescriptions, medical history, and reviews.

HopCare provides separate experiences for **Patients** and **Doctors**, with role-based access control and a backend-driven approach to protecting healthcare data and enforcing scheduling rules.

## ✨ Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* JWT stored in secure HTTP cookies
* Patient / Doctor role-based access control
* Protected frontend routes
* Backend authentication middleware
* Backend role authorization middleware
* Resource ownership validation

### 📅 Appointment Management

**Patients can:**

* Browse available doctors
* View available appointment slots
* Book appointments
* Reschedule appointments
* Cancel appointments
* View appointment history

**Doctors can:**

* View all appointments
* Manage appointment status
* Reschedule appointments
* View patient history
* Manage their availability through the scheduling interface

Appointment states are managed on the backend:

```text
Booked ──────► Completed
   │
   └──────────► Cancelled
```

The database also uses a compound unique index on doctor, date, time, and status to prevent multiple active bookings for the same slot.

### 💊 Prescriptions

Doctors can:

* Create prescriptions
* Update prescriptions
* Delete prescriptions
* View prescription history
* Access patient prescription history

Patients can:

* View prescriptions associated with their appointments
* Access their prescription history

### 📋 Patient History

Doctors can access patient history associated with their appointments, while patients can access their own appointment and prescription history.

### ⭐ Reviews

Patients can:

* Create reviews
* Update reviews
* Delete reviews

Doctors can view reviews associated with their profile.

HopCare also prevents duplicate reviews for the same appointment using a MongoDB compound unique index.

### 👤 Profile Management

**Patients**

* View profile
* Update personal information
* Manage healthcare-related profile data

**Doctors**

* View profile
* Update license number
* Update specialization
* Update experience
* Update consultation fees

---

## 🛠️ Tech Stack

### Frontend

* **React 19**
* **React Router**
* **Zustand**
* **Tailwind CSS**
* **Axios**
* **FullCalendar**
* **React Day Picker**
* **Lucide React**
* **React Hot Toast**
* **Vite**

### Backend

* **Node.js**
* **Express 5**
* **MongoDB**
* **Mongoose**
* **JWT**
* **bcrypt / Argon2**
* **Cookie Parser**
* **CORS**
* **dotenv**

---

## 🏗️ Architecture

HopCare follows a client-server architecture with a REST API backend.

```text
┌─────────────────────────────────────────┐
│               React Client              │
│                                         │
│  Pages · Components · Zustand · Axios   │
└───────────────────┬─────────────────────┘
                    │
                    │ REST API
                    ▼
┌─────────────────────────────────────────┐
│              Express Server             │
│                                         │
│  Routes → Middleware → Controllers      │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│                 MongoDB                 │
│                                         │
│  Users · Patients · Doctors             │
│  Appointments · Prescriptions · Reviews │
└─────────────────────────────────────────┘
```

### Backend Structure

The backend separates responsibilities across:

```text
Routes
   ↓
Middleware
   ↓
Controllers
   ↓
Models
   ↓
MongoDB
```

* **Routes** define API endpoints.
* **Middleware** handles authentication and role authorization.
* **Controllers** contain application/business logic.
* **Models** define MongoDB schemas and indexes.
* **lib** contains shared backend infrastructure such as database connection logic.

---

## 🔒 Security & Authorization

Security is enforced on both the frontend and backend.

### Authentication Flow

```text
User
 │
 │ Login
 ▼
Express API
 │
 │ Verify credentials
 ▼
JWT generated
 │
 │ HTTP Cookie
 ▼
Browser
 │
 │ Request + Cookie
 ▼
Authentication Middleware
 │
 │ Verify JWT
 ▼
Load User
 │
 ▼
Role Authorization
 │
 ▼
Controller
```

The backend reads the JWT from the request cookie and verifies it before allowing access to protected resources.

### Role-Based Authorization

Routes are protected according to user roles.

```text
                 ┌──────────────┐
                 │ Authenticated│
                 │     User     │
                 └──────┬───────┘
                        │
                 ┌──────▼───────┐
                 │   User Role  │
                 └──────┬───────┘
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
         Patient                 Doctor
             │                     │
       Patient APIs          Doctor APIs
```

The backend does not rely solely on frontend route protection. Every protected API request is authenticated and checked against the required role.

---

## 🧠 Data Ownership

Authentication alone is not enough to protect healthcare resources.

HopCare uses the authenticated user's identity to determine which patient or doctor record can be accessed or modified.

For example:

```text
JWT
 │
 ▼
Authenticated User
 │
 ▼
Patient / Doctor Profile
 │
 ▼
Owned Resources
 │
 ├── Appointments
 ├── Prescriptions
 ├── Reviews
 └── Medical History
```

This prevents users from simply modifying resource IDs in API requests to access another user's data.

---

## 📅 Preventing Appointment Conflicts

Appointment availability is enforced at the database level.

The `Appointment` model uses a compound unique index:

```text
doctorId + date + time + status
```

with the uniqueness constraint applied to active `booked` appointments.

This provides a second layer of protection against conflicting bookings beyond normal application-level validation.

---

## ⭐ Preventing Duplicate Reviews

Reviews use a compound unique index:

```text
appointmentId + patientId
```

This prevents a patient from creating multiple reviews for the same appointment.

---

## 📁 Project Structure

```text
Hopcare-Reactjs/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── PatientPages/
│   │   │   └── DoctorPages/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── package.json
└── README.md
```

---

## 🔌 API Structure

The API is versioned under:

```text
/api/v1
```

### Authentication

```text
POST /api/v1/users/register
POST /api/v1/users/login
POST /api/v1/users/logout
GET  /api/v1/users/check
```

### Patient

```text
GET  /api/v1/patient/allDoctors
GET  /api/v1/patient/slots
GET  /api/v1/patient/profile
PUT  /api/v1/patient/update-profile

POST /api/v1/patient/appointment
PUT  /api/v1/patient/:appointmentId
PUT  /api/v1/patient/reschedule/:appointmentId

GET  /api/v1/patient/history
GET  /api/v1/patient/prescription/appointment/:appointmentId
```

### Doctor

```text
GET    /api/v1/doctor/my-profile
PUT    /api/v1/doctor/doc-profile

GET    /api/v1/doctor/all-appointments

PUT    /api/v1/doctor/change-status/:appointmentId
PUT    /api/v1/doctor/reschedule/:appointmentId

GET    /api/v1/doctor/all-prescriptions
GET    /api/v1/doctor/prescription/history/:patientId

POST   /api/v1/doctor/prescription
PUT    /api/v1/doctor/prescription/:prescriptionId
DELETE /api/v1/doctor/prescription/:prescriptionId
```

### Reviews

```text
POST   /api/v1/review/new-review
PUT    /api/v1/review/update-review/:reviewId
DELETE /api/v1/review/delete-review/:reviewId
GET    /api/v1/review/all-reviews
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js
* npm
* MongoDB

### 1. Clone the repository

```bash
git clone https://github.com/Umang-Khemka/Hopcare-Reactjs.git

cd Hopcare-Reactjs
```

### 2. Configure environment variables

Create a `.env` file inside the `backend` directory:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 3. Install dependencies

From the project root:

```bash
npm run build
```

The root build script installs dependencies for both applications and builds the React frontend.

---

## 💻 Development

### Start the backend

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:8000
```

### Start the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

The Vite development server runs on:

```text
http://localhost:5173
```

The frontend API clients automatically use the development backend:

```text
http://localhost:8000/api/v1
```

---

## 🚢 Production

The root project contains a production-oriented build setup.

```bash
npm run build
npm start
```

The build process:

```text
npm run build
      │
      ├── Install backend dependencies
      │
      ├── Install frontend dependencies
      │
      └── Build React application
                  │
                  ▼
             frontend/dist
```

When `NODE_ENV=production`, Express serves the generated React application from `frontend/dist`.

This allows the frontend and backend to be deployed as a single application.

---

## 📸 Screenshots

### Landing Page

<img width="1772" height="872" alt="image" src="https://github.com/user-attachments/assets/0dba0c23-04cb-4ae4-a04c-27993e743353" />


### Patient Dashboard

<img width="1897" height="901" alt="image" src="https://github.com/user-attachments/assets/f29bca95-08e6-43ad-bf78-aa4c3ed59ca9" />


### Doctor Dashboard

<img width="1892" height="901" alt="image" src="https://github.com/user-attachments/assets/7c9f5f78-4416-4f6a-a6bd-f7739e6fe48c" />


### Appointment Scheduling

<img width="1820" height="816" alt="image" src="https://github.com/user-attachments/assets/2c2e7372-61ff-47b9-902d-7d6071222f37" />


### Prescription Management

<img width="1895" height="903" alt="image" src="https://github.com/user-attachments/assets/fdcf65fa-7058-4b7d-bfdf-19db31b31a74" />


---

## 🧩 Key Engineering Decisions

### Backend as the Source of Truth

The frontend provides the user interface, but critical business rules are enforced by the backend.

This includes:

* Authentication
* Role authorization
* Appointment validation
* Appointment state transitions
* Resource ownership
* Prescription access
* Review ownership

### Database-Level Constraints

MongoDB indexes are used alongside application-level validation to protect important invariants such as appointment conflicts and duplicate reviews.

### Role-Aware Frontend

The frontend uses:

* `ProtectedRoute`
* `RoleBasedRoute`
* `RoleRedirect`

to provide role-specific navigation and prevent unauthorized pages from being rendered.

### Zustand State Management

Zustand stores are used to manage authentication, patient, doctor, appointment, prescription, and review-related client state without relying on excessive prop drilling.

---

## 📚 What This Project Demonstrates

HopCare was built to explore practical full-stack engineering concepts including:

* REST API design
* JWT authentication
* Cookie-based authentication
* Role-based authorization
* Resource ownership
* MongoDB schema design
* Database indexes and constraints
* Appointment state management
* Scheduling conflict prevention
* React routing
* Global state management with Zustand
* MVC-style backend organization
* Production frontend/backend integration

---

## 🔮 Future Improvements

Potential improvements include:

* Real-time appointment notifications
* Email/SMS appointment reminders
* Doctor availability configuration
* Online/video consultations
* Payment integration
* Audit logging for sensitive healthcare operations
* Automated appointment reminders
* CI/CD pipeline
* Improved production CORS configuration
* Automated testing for critical appointment and authorization flows

---

## 👨‍💻 Author

**Umang Khemka**

Full-Stack Developer · Computer Science Student

* GitHub: [@Umang-Khemka](https://github.com/Umang-Khemka)

---

⭐ If you found HopCare useful or interesting, consider giving the repository a star.
