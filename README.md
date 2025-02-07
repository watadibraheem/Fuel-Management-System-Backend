# Fuel Management System - Backend

## 📌 Project Overview
This is the **Node.js backend** for the **Fuel Management System**, built with **Express.js** and **MySQL**.
It allows businesses to submit **Abnormal fuel requests** and manage **admin approvals** efficiently. The backend will integrate with a **React frontend** to provide a full-stack solution.

## 🏗️ Key Features
- **Abnormal Fuel Requests API:** Create, update, delete, and fetch fuel requests.
- **Admin Approval Workflow:** Requests above 200 shekels require admin approval, with status tracking (`auto-approved`, `pending-approval`, `approved`, `rejected`).
- **User Authentication & Authorization:** Secure login system with session management and role-based access control (Admin/User).
- **Role-Based Permissions:** Admins can manage all requests, while users can manage only their own.
- **Approval & Rejection Timestamps:** Tracks when requests are approved or rejected (`approved_at`, `rejected_at`).

## ⚙️ Technologies Used
- **Node.js** (Express.js)
- **MySQL** (`mysql2` package)
- **REST API** structure
- **Singleton Pattern for Database Connection**

## 🚀 Project Roadmap
1. **Path #1** (✅ Done) → Fuel Requests API Implementation.
2. **Path #2** (✅ Done) → User Authentication, Session Handling, and Authorization.
