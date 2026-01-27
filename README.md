# Learning Management System (LMS)
[Live Link](https://lms-r2sm.onrender.com)

## Technology Stack & Tools Documentation

This document provides a **complete and structured overview** of the technologies, libraries, and tools used in the development of my **Learning Management System (LMS)** project.  
The project follows a **modern MERN-based architecture** with secure authentication, role-based access, media handling, and payment integration.

---

## 1. Project Overview

The LMS is a full-stack web application that allows:

- **Teachers/Instructors** to create and manage paid courses
- **Students/Learners** to browse, purchase, and consume course content
- Secure authentication and authorization
- Video-based learning with progress tracking
- Online payments for paid courses

---

## 2. Backend Technologies (Server)

### 2.1 Runtime & Framework
- **Node.js**
  - JavaScript runtime for server-side development

- **Express.js**
  - REST API framework
  - Handles routing, middleware, authentication, and request handling

- **ES Modules**
  - Uses modern `import / export` syntax (`type: module`)

---

### 2.2 Database & ORM
- **MongoDB**
  - NoSQL database for flexible and scalable data storage

- **Mongoose**
  - Object Data Modeling (ODM)
  - Schema definition and data validation
  - Relationship handling between users, courses, and payments

---

### 2.3 Authentication & Security
- **bcryptjs**
  - Password hashing and verification

- **JSON Web Tokens (JWT)**
  - Token-based authentication
  - Stateless session management

- **cookie-parser**
  - Secure handling of authentication tokens via cookies

- **cors**
  - Enables cross-origin requests between frontend and backend

- **dotenv**
  - Environment variable management
  - Stores secrets such as database URI, JWT secret, and Stripe keys

---

### 2.4 File Upload & Media Storage
- **multer**
  - Handles file uploads from the client
  - Used for course thumbnails, videos, and resources

- **Cloudinary**
  - Cloud-based media storage
  - Optimized image and video delivery
  - Scalable media hosting solution

---

### 2.5 Payment Integration
- **Stripe**
  - Secure payment gateway
  - Handles paid course purchases
  - Ensures safe transaction processing

---

### 2.6 Development Tools
- **nodemon**
  - Automatically restarts the server on file changes
  - Improves development workflow

---

## 3. Frontend Technologies (Client)

### 3.1 Core Framework & Build Tool
- **React (v18)**
  - Component-based UI development
  - Single Page Application (SPA)

- **Vite**
  - Fast development server
  - Optimized production builds

- **React Router DOM**
  - Client-side routing
  - Separate routes for students and teachers

---

### 3.2 State Management
- **Redux Toolkit**
  - Global state management
  - Handles authentication state, user data, and UI state

- **RTK Query**
  - Server-state management and API handling
  - Used for:
    - Fetching courses
    - Fetching enrolled courses
    - Dashboard data
    - Mutations such as login, registration, course creation, and purchases
  - Features:
    - Automatic caching
    - Cache invalidation
    - Built-in loading and error handling
    - Reduced boilerplate compared to traditional Redux + Thunks

- **react-redux**
  - React bindings for Redux

---

### 3.3 API Communication
- **Axios**
  - HTTP client for backend communication
  - Used alongside RTK Query for specific API scenarios

---

### 3.4 UI, Styling & Design
- **Tailwind CSS**
  - Utility-first CSS framework
  - Responsive and modern UI design

- **tailwindcss-animate**
  - Smooth UI animations

- **Radix UI**
  - Accessible, unstyled UI primitives:
    - Dialogs
    - Dropdowns
    - Tabs
    - Select
    - Progress bars
    - Switches
    - Avatars

- **class-variance-authority (CVA)**
  - Variant-based component styling

- **clsx**
  - Conditional class name handling

- **lucide-react**
  - Modern SVG icon library

- **next-themes**
  - Dark mode and light mode support

---

### 3.5 Learning & Content Features
- **react-player**
  - Video playback for course lessons

- **react-quill**
  - Rich text editor
  - Used for:
    - Course descriptions
    - Lesson content
    - Instructor notes

- **recharts**
  - Data visualization
  - Displays progress, analytics, and dashboards

- **sonner**
  - Toast notifications
  - Displays success, error, and warning messages

---

### 3.6 Code Quality & Tooling
- **ESLint**
  - Enforces coding standards
  - Improves code consistency

- **PostCSS**
  - CSS processing

- **Autoprefixer**
  - Ensures cross-browser CSS compatibility

---

## 4. Core LMS Functionalities

### 4.1 Authentication & Authorization
- Student and Teacher registration/login
- JWT-based authentication
- Role-based access control

---

### 4.2 Teacher Features
- Course creation and management
- Upload videos and learning resources
- Set course pricing
- Manage own published courses
- Rich text content editing

---

### 4.3 Student Features
- Browse available courses
- Purchase paid courses
- Access enrolled content
- Watch video lessons
- Track learning progress

---

### 4.4 Payment System
- Stripe integration for paid courses
- Secure checkout flow
- Automatic access after successful payment

---

### 4.5 Media Management
- Secure uploads using Multer
- Cloudinary for scalable media hosting
- Optimized streaming and delivery

---

### 4.6 User Experience Enhancements
- Dark / Light mode
- Responsive design
- Toast notifications
- Smooth UI animations

---

## 5. Architecture Summary

| Layer        | Technology |
|-------------|------------|
| Frontend    | React, Vite, Tailwind CSS |
| State       | Redux Toolkit, RTK Query |
| Backend     | Node.js, Express |
| Database    | MongoDB |
| Auth        | JWT, Cookies |
| Media       | Multer, Cloudinary |
| Payments    | Stripe |

---

## 6. Conclusion

This LMS project uses a **scalable, modern MERN stack architecture** with strong focus on:
- Security
- Performance
- Maintainability
- Real-world production practices

The use of **Redux Toolkit with RTK Query**, **Cloudinary**, and **Stripe** makes the application robust, efficient, and industry-ready.