# DiGiWallet

DiGiWallet is a digital academic credential system for issuing, storing, sharing, and verifying academic records with JWT authentication, QR-based verification, hashing, and public/private key signatures.

## Overview

The goal of DiGiWallet is to reduce the manual work involved in sharing academic documents for jobs, internships, higher studies, and identity checks. Colleges can issue digitally signed credentials, students can keep them in a wallet-style dashboard, and verifiers can confirm whether a credential is valid, tampered, revoked, or missing.

The current codebase includes a React + Vite frontend, an Express + MongoDB backend, route-based role protection, and a verification flow for issued credentials.

## Features

- College registration with key-pair generation
- Student signup and login with JWT authentication
- Role-based access for `super_admin`, `admin`, `college`, and `student`
- College dashboard pages for students, credentials, pending requests, profile, and settings
- Digitally signed credential issuance
- QR code and verification link generation
- Public credential verification
- Credential revocation
- Admin dashboard and college account creation flows
- Student wallet and profile entry points in the frontend

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Axios
- React Icons
- jsPDF

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens
- bcryptjs password hashing
- qrcode generation

### Security And Verification

- SHA-256 hashing
- Digital signatures
- Public/private key cryptography
- Credential revocation checks
- QR-based sharing and verification links

## Repository Structure

```txt
DigiWallet/
|-- client/        # React + Vite frontend
|-- server/        # Express + MongoDB backend
|-- docs/          # API and testing notes
|-- readSprint.md  # Sprint log
`-- README.md
```

## Frontend Structure

The frontend entry point is [client/src/main.jsx](client/src/main.jsx) and the route map is defined in [client/src/App.jsx](client/src/App.jsx).

Public routes:

- `/` -> home page
- `/register` -> student registration
- `/login` -> login
- `/terms` -> terms page
- `/privacy` -> privacy page
- `/verify/:credentialId` -> public credential verification page

Student routes:

- `/student/home`
- `/student/mywallet`
- `/student/profile`
- `/student/settings`

College routes:

- `/college/dashboard`
- `/college/students`
- `/college/credentials`
- `/college/pending-requests`
- `/college/verification`
- `/college/profile`
- `/college/settings`

Admin routes:

- `/admin/dashboard`
- `/admin/colleges/create`

The frontend dev server runs on port `3001` and proxies `/api` requests to the backend on port `5000`.

## Backend Structure

The backend entry point is [server/src/server.js](server/src/server.js), which loads environment variables, connects to MongoDB, and starts the Express app from [server/src/app.js](server/src/app.js).

Mounted API routes:

- `/api/health`
- `/api/auth`
- `/api/college`
- `/api/student`
- `/api/credentials`
- `/api/verify`
- `/api/admin`

Key route behavior:

- `POST /api/auth/signup` creates a student account
- `POST /api/auth/login` logs in any role
- `GET /api/auth/me` returns the current user
- `PATCH /api/auth/change-password` updates the password
- `GET /api/verify/:credentialId` verifies a credential publicly
- `POST /api/credentials/issue` issues a credential for a college user
- `PATCH /api/credentials/revoke/:credentialId` revokes a credential
- `GET /api/credentials/mine` returns a student's own credentials
- `GET /api/admin/dashboard` returns admin dashboard data
- `POST /api/admin/colleges` creates a college and login account
- `POST /api/admin/colleges/:id/account` creates a college login account for an existing college

The college router protects all college endpoints with JWT and role checks. The auth and credential flows also enforce role-based access in the controller and middleware layer.

## Environment Variables

Create `server/.env` with at least these values:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3001
SUPER_ADMIN_NAME=Super Admin
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=change-me
```

`PORT` and `JWT_EXPIRES_IN` are optional, but the rest are required for local startup and seeding.

## Local Setup

### Backend

```bash
cd server
npm install
npm run dev
```

Useful backend scripts:

- `npm run dev` starts the API with nodemon
- `npm start` starts the API with node
- `npm run seed:admin` creates the initial super admin account from `server/.env`

### Frontend

```bash
cd client
npm install
npm run dev
```

Useful frontend scripts:

- `npm run dev` starts Vite on port `3001`
- `npm run build` creates a production build
- `npm run preview` previews the build locally

## Current Project Status

The backend is the most complete part of the system. College, student, auth, credential, verification, and admin routes are present, and the verification flow is wired to hash and signature checks.

The frontend includes the main navigation, layout, and route shells for home, auth, college, student, and admin views. Some pages are still placeholders or are not yet wired into the active route map, so the UI is still being integrated with the API layer.

Documentation and test notes live in `docs/`, including Postman-oriented API testing guidance and admin integration notes.

## Notes

- The seed script uses the email normalization fix already present in the codebase, so admin seed data should be entered in lowercase email form.
- The frontend API layer reads bearer tokens from local storage and sends requests to `/api`.
- The backend exposes a simple health check at `GET /api/health`.

## Team Members

- [Bibek Ghimire](https://github.com/bibek773)
- [Maheshwar Pant](https://github.com/Maheshwar-Pant)
- [Manisha Oli](https://github.com/Manishaa-Oli)
