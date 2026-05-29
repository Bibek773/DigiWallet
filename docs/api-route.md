# API Routes Documentation


Base URL:

```text
http://localhost:5000/api
```

---

## 1. Authentication Routes
To handle user registration, login and profile accesss

###  Register User
POST /auth/register

- Registers a new user in the system.

**Access** -> Public

**Request Body**
```json
{
  "name": "Bibek Ghimire",
  "email": "bibek@example.com",
  "password": "password123",
  "conform password": "password123",
  "age": "21",
  "college": "cosmos"
}
```

**Success Resposnse** 
```json
{
    "success": true,
    "message": "User registrated successfully"

}
```
---

## Login User

```http
POST /auth/login
```

### Description

Logs in a user and returns a JWT token.

### Access

Public

### Request Body

```json
{
  "email": "bibek@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Bibek Ghimire",
    "email": "bibek@example.com",
    "role": "student"
  }
}
```

---

## 1.3 Get Logged-in User Profile

```http
GET /auth/me
```

### Description

Returns the currently logged-in user profile.

### Access

Protected

### Headers

```http
Authorization: Bearer jwt_token_here
```

### Success Response

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "Bibek Ghimire",
    "email": "bibek@example.com",
    "role": "student"
  }
}
```

---

# 2. Admin Routes

These routes are used by the admin to manage colleges, users, and system records.

## 2.1 Add College

```http
POST /admin/colleges/create-invite
```

### Description

create invitation to add college into the system

### Access

Admin only

### Request Body

```json
{
  "collegeName": "Cosmos College of Management and Technology",
  "email": "cosmos@cosmoscollege.edu.np",
  "address": "Sitapaila, Ktm",
  "publicKey": "college_public_key_here"
}
```

### Success Response

```json
{
  "success": true,
  "message": "College added successfully"
}
```

---

## 2.2 Get All Colleges

```http
GET /admin/colleges
```

### Description

Returns the list of registered colleges.

### Access

Admin only

### Success Response

```json
{
  "success": true,
  "colleges": []
}
```

---

## 2.3 Get All Users

```http
GET /admin/users
```

### Description

Returns all users registered in the system.

### Access

Admin only

### Success Response

```json
{
  "success": true,
  "users": []
}
```

---

# 3. College / Issuer Routes

These routes are used by colleges to issue and manage credentials.

## 3.1 Issue Credential

```http
POST /credentials/issue
```

### Description

Allows an authorized college to issue a digitally signed academic credential to a student.

### Access

College only

### Request Body

```json
{
  "studentName": "Bibek Ghimire",
  "studentEmail": "bibek@example.com",
  "registrationNumber": "PU-BCT-230309",
  "degree": "Bachelor of Engineering in Computer Engineering",
  "faculty": "Science and Technology",
  "batch": "2023",
  "passedYear": "2027",
  "gpa": "3.00"
}
```

### Backend Process

```txt
1. Validate credential data
2. Create structured credential JSON
3. Generate SHA-256 hash
4. Sign hash using college private key
5. Store credential data, hash, and signature
6. Generate QR verification link
7. Assign credential to student wallet
```

### Success Response

```json
{
  "success": true,
  "message": "Credential issued successfully",
  "credential": {
    "id": "credential_id",
    "studentName": "Bibek Ghimire",
    "degree": "Bachelor of Engineering in Computer Engineering",
    "status": "valid",
    "verificationLink": "http://localhost:5173/verify/credential_id"
  }
}
```

---

## 3.2 Get Issued Credentials

```http
GET /credentials/issued
```

### Description

Returns all credentials issued by the logged-in college.

### Access

College only

### Success Response

```json
{
  "success": true,
  "credentials": []
}
```

---

## 3.3 Revoke Credential

```http
PATCH /credentials/revoke/:credentialId
```

### Description

Revokes a previously issued credential.

### Access

College or Admin

### Request Body

```json
{
  "reason": "Incorrect Details"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Credential revoked successfully"
}
```

---

# 4. Student Routes

These routes are used by students to view and share credentials.

## 4.1 Get Student Wallet

```http
GET /student-name/wallet
```

### Description

Returns all credentials issued to the logged-in student.

### Access

Student only

### Success Response

```json
{
  "success": true,
  "credentials": [
    {
      "id": "credential_id",
      "degree": "Bachelor of Engineering in Computer Engineering",
      "issuer": "Cosmos College of Management and Technology",
      "status": "valid",
      "verificationLink": "http://localhost:5173/verify/credential_id"
    }
  ]
}
```

---

## 4.2 Get Credential Details

```http
GET /student-name/credentials/:credentialId
```

### Description

Returns details of a specific credential owned by the student.

### Access

Student only

### Success Response

```json
{
  "success": true,
  "credential": {
    "studentName": "Bibek Ghimire",
    "degree": "Bachelor of Engineering in Computer Engineering",
    "faculty": "Science and Technology",
    "issuer": "Cosmos College of Management and Technology",
    "status": "valid",
    "verificationLink": "http://localhost:5173/verify/credential_id"
  }
}
```

---

# 5. Verifier Routes

These routes are used by employers or institutions to verify credentials.

## 5.1 Verify Credential

```http
GET /verify/:credentialId
```

### Description

Verifies whether a credential is valid, invalid, tampered, revoked, or not found.

### Access

Public

### Backend Process

```txt
1. Get credential by credentialId
2. Get issuer public key
3. Recreate hash from credential data
4. Verify digital signature using public key
5. Check credential status
6. Return verification result
```

### Success Response: Valid Credential

```json
{
  "success": true,
  "result": "valid",
  "message": "Credential is valid",
  "credential": {
    "studentName": "Bibek Ghimire",
    "degree": "Bachelor of Engineering in Computer Engineering",
    "issuer": "Cosmos College of Management and Technology",
    "issuedAt": "2026-05-01"
  }
}
```

### Response: Revoked Credential

```json
{
  "success": false,
  "result": "revoked",
  "message": "Credential was issued but has been revoked"
}
```

### Response: Invalid or Tampered Credential

```json
{
  "success": false,
  "result": "tampered",
  "message": "Credential data has been modified or signature verification failed"
}
```

### Response: Not Found

```json
{
  "success": false,
  "result": "not_found",
  "message": "Credential not found"
}
```

---

# 6. Verification Log Routes

These routes are used to track verification activity.

## 6.1 Get Verification Logs

```http
GET /admin/verification-logs
```

### Description

Returns credential verification logs.

### Access

Admin only

### Success Response

```json
{
  "success": true,
  "logs": [
    {
      "credentialId": "credential_id",
      "result": "valid",
      "verifiedAt": "2026-05-01T10:30:00Z",
      "verifierIP": "127.0.0.1"
    }
  ]
}
```

---

# 7. Suggested Route Summary

| Method | Route                                | Access        | Purpose                 |
| ------ | ------------------------------------ | ------------- | ----------------------- |
| POST   | `/auth/register`                     | Public        | Register user           |
| POST   | `/auth/login`                        | Public        | Login user              |
| GET    | `/auth/me`                           | Protected     | Get logged-in user      |
| POST   | `/admin/colleges`                    | Admin         | Add college             |
| GET    | `/admin/colleges`                    | Admin         | View colleges           |
| GET    | `/admin/users`                       | Admin         | View users              |
| POST   | `/credentials/issue`                 | College       | Issue credential        |
| GET    | `/credentials/issued`                | College       | View issued credentials |
| PATCH  | `/credentials/revoke/:credentialId`  | College/Admin | Revoke credential       |
| GET    | `/student-name/wallet`                    | Student       | View student wallet     |
| GET    | `/student-name/credentials/:credentialId` | Student       | View credential details |
| GET    | `/verify/:credentialId`              | Public        | Verify credential       |
| GET    | `/admin/verification-logs`           | Admin         | View verification logs  |

---

# 8. Common Status Codes

| Status Code | Meaning                       |
| ----------- | ----------------------------- |
| 200         | Request successful            |
| 201         | Resource created successfully |
| 400         | Bad request or invalid input  |
| 401         | Unauthorized user             |
| 403         | Forbidden access              |
| 404         | Resource not found            |
| 500         | Server error                  |

---

# 9. Verification Result Types

| Result      | Meaning                                   |
| ----------- | ----------------------------------------- |
| `valid`     | Credential is authentic and active        |
| `invalid`   | Credential could not be verified          |
| `tampered`  | Credential data was changed               |
| `revoked`   | Credential was issued but later cancelled |
| `not_found` | Credential does not exist                 |

---
