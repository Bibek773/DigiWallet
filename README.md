<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1e3a8a,100:0ea5e9&height=180&section=header&text=DiGiWallet&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Digital%20Academic%20Credentials%2C%20Verified%20Instantly&descAlignY=58&descSize=16" width="100%"/>

<a href="https://digi-wallet-ecru.vercel.app/">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&pause=1500&color=0EA5E9&center=true&vCenter=true&width=520&lines=Issue+%C2%B7+Store+%C2%B7+Share+%C2%B7+Verify+Academic+Credentials;Secured+with+JWT%2C+SHA-256+%26+Digital+Signatures;Built+with+React+%2B+Express+%2B+MongoDB" alt="Typing SVG" />
</a>

<br/><br/>

[![GitHub](https://img.shields.io/badge/GitHub-DigiWallet-181717?style=for-the-badge&logo=github)](https://github.com/bibek773)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-Framework-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://digi-wallet-ecru.vercel.app/)

<br/>

### [**Live Demo → digi-wallet-ecru.vercel.app**](https://digi-wallet-ecru.vercel.app/)

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:0ea5e9,100:1e3a8a&height=2&width=1000" width="100%"/>

</div>

## Overview

DiGiWallet eliminates the manual hassle of sharing academic documents for **jobs, internships, higher studies, and identity checks**. Colleges issue digitally signed credentials, students manage them in a wallet-style dashboard, and verifiers can instantly confirm whether a credential is **valid, tampered, revoked, or missing**.

The system combines a **React + Vite** frontend with an **Express + MongoDB** backend, secured with JWT authentication, role-based access control, and cryptographic credential signing.

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:0ea5e9,100:1e3a8a&height=2&width=1000" width="100%"/>

</div>

## Key Features

| Category | Highlights |
|---|---|
| **Authentication** | JWT-based login for students, colleges, and admins |
| **College Management** | Registration with key-pair generation, student & credential management |
| **Credential Issuance** | Digitally signed academic credentials |
| **QR Verification** | QR code and shareable verification links |
| **Public Verification** | Anyone can verify a credential's authenticity |
| **Revocation** | Colleges can revoke issued credentials |
| **Admin Console** | Dashboard for platform-wide college account management |
| **Student Wallet** | Centralized dashboard to view and manage credentials |

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:0ea5e9,100:1e3a8a&height=2&width=1000" width="100%"/>

</div>

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool & dev server |
| React Router | Client-side routing |
| Axios | API communication |
| React Icons | Iconography |
| jsPDF | PDF generation |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens (JWT) | Authentication |
| bcryptjs | Password hashing |
| QRCode | QR code generation |

### Security
| Mechanism | Purpose |
|---|---|
| SHA-256 Hashing | Credential integrity |
| RSA Digital Signatures | Credential authenticity |
| Public/Private Key Cryptography | College signing keys |
| JWT Authentication | Secure sessions |
| QR-based Verification | Tamper-evident sharing |
| Credential Revocation | Invalidate compromised/expired credentials |

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:0ea5e9,100:1e3a8a&height=2&width=1000" width="100%"/>

</div>

## Architecture

### Frontend Structure

Entry point: `client/src/main.jsx` · Routes defined in: `client/src/App.jsx`

**Public Routes**

| Route | Description |
|---|---|
| `/` | Landing Page |
| `/register` | Student Registration |
| `/login` | Login |
| `/terms` | Terms & Conditions |
| `/privacy` | Privacy Policy |
| `/verify/:credentialId` | Public Credential Verification |

**Role-Based Routes**

| Role | Routes |
|---|---|
| **Student** | `/student/home` · `/student/mywallet` · `/student/profile` · `/student/settings` |
| **College** | `/college/dashboard` · `/college/students` · `/college/credentials` · `/college/pending-requests` · `/college/verification` · `/college/profile` · `/college/settings` |
| **Admin** | `/admin/dashboard` · `/admin/colleges/create` |

### Backend Structure

Entry point: `server/src/server.js` · App initialized in: `server/src/app.js`

**Mounted API Routes**

`/api/health` · `/api/auth` · `/api/college` · `/api/student` · `/api/credentials` · `/api/verify` · `/api/admin`

### API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user |
| `GET` | `/api/auth/me` | Get current user profile |
| `PATCH` | `/api/auth/change-password` | Update password |
| `POST` | `/api/credentials/issue` | Issue a new credential |
| `PATCH` | `/api/credentials/revoke/:credentialId` | Revoke a credential |
| `GET` | `/api/credentials/mine` | Fetch owned credentials |
| `GET` | `/api/verify/:credentialId` | Publicly verify a credential |
| `GET` | `/api/admin/dashboard` | Admin overview data |
| `POST` | `/api/admin/colleges` | Register a new college |
| `POST` | `/api/admin/colleges/:id/account` | Create a college account |

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:0ea5e9,100:1e3a8a&height=2&width=1000" width="100%"/>

</div>

## Major Functionalities

### Student
- Register and log in securely via JWT
- View and manage credentials in a personal wallet dashboard
- Access profile and account settings

### College
- Register with automatic key-pair generation for signing
- Manage students, issue and track credentials
- Handle pending credential requests
- Access college profile and settings

### Admin
- Platform-wide dashboard for oversight
- Create and manage college accounts

### Verification
- Public, no-login verification via credential ID or QR code
- Instantly detect valid, tampered, revoked, or missing credentials

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:0ea5e9,100:1e3a8a&height=2&width=1000" width="100%"/>

</div>

## Security Features

- **SHA-256 hashing** ensures credential data integrity
- **RSA digital signatures** bind credentials to the issuing college
- **Public/private key cryptography** for tamper-proof signing
- **JWT authentication** secures all protected routes
- **QR-based verification** enables fast, reliable checks
- **Revocation system** invalidates credentials when needed

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:0ea5e9,100:1e3a8a&height=2&width=1000" width="100%"/>

</div>

## Repository Structure

```text
DigiWallet/
│
├── client/          # React + Vite frontend
├── server/          # Express + MongoDB backend
├── docs/            # API and testing notes
├── readSprint.md    # Sprint log
└── README.md
```

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:0ea5e9,100:1e3a8a&height=2&width=1000" width="100%"/>

</div>

## Project Status

| Module | Status |
|---|---|
| Backend (Auth, College, Student, Credentials, Verification, Admin) | Fully Integrated |
| Frontend — Landing, Auth, Dashboards, Wallet, Verification | Complete |

The system implements digital credential issuance end-to-end using **SHA-256 hashing**, **RSA digital signatures**, **QR code verification**, a **public verification endpoint**, and **credential revocation**. Additional documentation and API testing notes are available in the `docs/` directory.

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:0ea5e9,100:1e3a8a&height=2&width=1000" width="100%"/>

</div>

## Team Members

| Name | GitHub |
|---|---|
| **Bibek Ghimire** | [@bibek773](https://github.com/bibek773) |
| **Maheshwar Pant** | [@Maheshwar-Pant](https://github.com/Maheshwar-Pant) |
| **Manisha Oli** | [@Manishaa-Oli](https://github.com/Manishaa-Oli) |

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:0ea5e9,100:1e3a8a&height=2&width=1000" width="100%"/>

</div>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1e3a8a,100:0ea5e9&height=110&section=footer" width="100%"/>

**Built for a secure, paperless academic future.**

</div>