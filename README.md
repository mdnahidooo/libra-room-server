# LibraRoom – Library Study Room Booking System

LibraRoom is a full-stack web application that allows students and library users to **discover, list, and book study rooms** in an organized and conflict-free way. Users can browse available rooms, filter/search listings, and book time slots while preventing overlapping reservations through advanced booking logic.

The platform also supports **secure JWT authentication with HTTP-only cookies**, role-based room ownership, and a fully responsive UI designed for real-world usability and recruiter appeal.

---

## 🌐 Live URL

👉 https://libra-room-client.vercel.app/  

---

## 🎯 Project Purpose

The purpose of **LibraRoom** is to simplify study room management by:

- Allowing users to book study rooms easily  
- Preventing double bookings using conflict detection  
- Enabling users to list and manage their own rooms  
- Providing a personal dashboard for bookings and listings  
- Ensuring secure authentication and session handling  

---

## 🚀 Technologies Used

- React.js / Next.js (Frontend)  
- Node.js + Express.js (Backend)  
- MongoDB  
- Tailwind CSS  
- HeroUI 
- JSON Web Token (JWT)  
- HTTP-Only Cookies  
- React Hot Toast / Sonner (Notifications)  
- Framer Motion  

---

## ✨ Key Features

### 🏫 Room Management System
- Add, update, and delete study rooms  
- Room ownership validation (only owner can edit/delete)  
- Featured latest rooms on homepage  
- Room details with full information  

### 📅 Smart Booking System
- Book rooms with date & time slots  
- Real-time booking cost calculation  
- Conflict detection to prevent double booking  
- Cancel booking functionality  
- Booking status tracking (confirmed / cancelled)  

### 🔐 Secure Authentication System
- Email/password login and registration  
- Google OAuth login  
- JWT stored in HTTP-only cookies  
- Protected routes for private actions  
- Persistent login on page reload  

---

## 🧩 Main Sections

### 🧭 Navbar
- Logo / Website Name  
- Home, Rooms navigation  
- Login / Register (public view)  
- Add Room, My Listings, My Bookings (private view)  
- Profile dropdown with logout  

### 🏠 Home Page
- Hero section with CTA (“Find Your Perfect Study Room”)  
- Latest 6 rooms from database  
- Room cards with image, capacity, price, and amenities  
- Additional static sections for UI enhancement  

### 🏫 Rooms Page
- Displays all study rooms  
- Search & filter functionality  
- Amenity-based filtering  
- No results empty state  

### 🔍 Room Details Page
- Full room information  
- Booking count tracking  
- Book Now / Login to Book button  
- Edit/Delete options for owner only  

### ➕ Add Room Page
- Form to create new study rooms  
- Amenities selection (checkboxes)  
- Owner automatically assigned  

### 📅 My Bookings Page
- User-specific booking list  
- Status badges (confirmed / cancelled)  
- Cancel booking option with confirmation  

### 🧾 My Listings Page
- Rooms created by logged-in user  
- Edit and delete functionality  

### ⚠️ 404 Page
- Custom not-found page with redirect option  

---

## 🔐 Authentication System

### Login Page
- Email & password login  
- Google OAuth login  
- Error handling with toast messages  
- Redirect after successful login  

### Register Page
- Name, email, photo URL, password  
- Password validation rules:
  - Minimum 6 characters  
  - 1 uppercase, 1 lowercase  
- Google signup support  
- Redirect to login after success  

---

## 📅 Booking System Logic

- Date must be today or future  
- Hour-based time slots (08:00 – 20:00)  
- Minimum 1-hour booking  
- Auto cost calculation based on hourly rate  
- Conflict detection using time overlap rules  
- Successful booking creates record in DB  

---

## 🔑 Security Features

- JWT authentication with HTTP-only cookies  
- authMiddleware protects private routes  
- req.user injected after token verification  
- Logout clears cookie securely  

---

## 🔍 Search & Filter

- Search rooms by name using `$regex`  
- Filter by amenities using `$in`  
- Optional filtering by price and floor  
- Backend optimized query handling  

---

## 📱 Responsive Design

Fully responsive across:

- 💻 Desktop  
- 📱 Mobile  
- 📟 Tablet  

---

## 🛠️ Additional Features

- Loading spinner / skeleton UI during fetch  
- Dynamic page titles per route  
- Toast notifications for all actions  
- Clean error handling system  

---

## 🚀 Challenge Features

### 🔐 Advanced Booking Logic
- Prevent overlapping bookings using MongoDB conditions  
- OR use `$push` and `$pull` for booking tracking  

### 🎨 UI Enhancements (Optional)
- Dark/Light theme toggle (localStorage)  
- Framer Motion animations  

---

## 📂 Route Summary

### Public Routes
- `/` – Home  
- `/rooms` – All Rooms  
- `/login` – Login  
- `/register` – Register  

### Private Routes
- `/add-room`  
- `/rooms/:id`  
- `/my-bookings`  
- `/my-listings`  

---

## 🎯 Project Goal

The goal of **LibraRoom** is to create a smart and secure study room booking system where users can easily discover, book, and manage study rooms without any scheduling conflicts. It aims to simplify room management for both students and room owners while ensuring smooth user experience, secure authentication, and efficient booking operations.

---

## 📬 Submission

- 🌐 **Live Link:** https://libra-room-client.vercel.app/ 
- 🌐 **Live Server Link:** https://libra-room-server.vercel.app/  
- 💻 **Client Repo:** https://github.com/mdnahidooo/libra-room-client 
- 🖥️ **Server Repo:** https://github.com/mdnahidooo/libra-room-server 


---
