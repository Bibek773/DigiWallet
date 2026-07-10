# DiGiWallet

**DiGiWallet** is a Digital Academic Credential Verification System for issuing, storing, sharing, and verifying academic credentials with digital signatures, hashing, public/private key cryptography, and QR-based verification.

## Project Overview

In Nepal, students often need to submit photocopies or scanned copies of academic documents for jobs, internships, higher studies, KYC, and other verification processes. This process is repetitive, time-consuming, and creates the risk of fake or tampered certificates.

DiGiWallet solves this problem by allowing academic institutions to issue digitally signed credentials. Students can store these credentials in a digital wallet and share them through a QR code or verification link. Employers or institutions can instantly verify whether a credential is valid, invalid, tampered, revoked, or not found.

## Main Features

- College registration with automatic key-pair generation
- Student signup and login with JWT authentication
- Role-based access for admin, college, student, and super_admin
- Issuance of digitally signed academic credentials
- QR code and verification link generation for each credential
- Credential verification with valid, invalid signature, tampered, revoked, and not-found states
- Credential revocation for issuer colleges
- Student wallet and dashboard pages in the frontend

## Tech Stack

### Frontend
- React.js
- Vite
- Axios
- React Router
- React Icons
- QR code rendering

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing

### Database
- MongoDB

### Security and Verification
- SHA-256 hashing
- Digital signatures
- Public/private key cryptography
- QR code generation
- Verification link generation
- Tamper and revocation checks

## Repository Structure

```txt
DiGiWallet/
│
├── client/        # React + Vite frontend
├── server/        # Node.js + Express + MongoDB API
├── docs/          # API notes and testing guides
├── README.md
└── readSprint.md  # Sprint-by-sprint work log
```

## Project Status

DiGiWallet is in active development, with the core backend and authentication flows already implemented.

Current progress:

* College, student, auth, credential, and verification modules are in place
* JWT authentication and role-based access control are working
* Credential hashing, signing, QR generation, and revocation are implemented
* Frontend login, registration, privacy, and terms pages are available
* Dashboard and wallet pages exist and are being integrated with the API
* Postman testing notes and API documentation are available in `docs/`

Sprint highlights:

* Sprint 1: college, student, and credential schemas/controllers/routes were created and tested
* Sprint 2: key-pair generation, JWT auth, and protected routes were added
* Sprint 3: login and registration UI were added, along with the first integrated auth flow

## Running Locally

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

The backend runs on port `5000` by default. The frontend uses the Vite dev server.

## Team Members

- [Bibek Ghimire](https://github.com/bibek773)
- [Maheshwar Pant](https://github.com/Maheshwar-Pant)
- [Manisha Oli](https://github.com/Manishaa-Oli)
