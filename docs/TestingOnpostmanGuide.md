# DiGiWallet Postman Testing Guide

This guide is based on the current code in this repository.

Base URL:

```text
http://localhost:5000/api
```

## What Has Been Done Till Now

Backend completed so far:

- Express backend setup with MongoDB connection.
- Health check API.
- College CRUD API.
- Student/user CRUD API.
- Student signup API.
- Login API with JWT token generation.
- Protected `GET /auth/me` API.
- Protected super admin account creation route for creating college accounts.
- College key pair generation during college creation.
- Private key file saving inside `server/keys`.
- Public key saving inside MongoDB college document.
- Credential issue API with SHA-256 hash, RSA signature, verification link, and QR code data.
- Issued credentials listing API.
- Credential revoke API.
- Public credential verification API.

Frontend completed so far:

- React + Vite frontend setup.
- React Router setup.
- Student registration UI page.
- Placeholder pages for login, admin dashboard, college dashboard, issue credential, issued credentials, student wallet, verify page, and verify result.

Documentation completed so far:

- README project overview.
- Sprint notes in `readSprint.md`.
- API route draft in `docs/api-route.md`.

Not completed / not fully connected yet:

- Frontend API integration is not done yet.
- `client/src/services/api.js` is still TODO.
- `AuthContext` is still TODO.
- Student wallet backend routes are not implemented yet.
- Verification log route is not implemented yet.
- Student approval route is not implemented yet, but account status can currently be updated through the student CRUD route for testing.
- Some routes in `docs/api-route.md` do not match the current backend route names.

## Before Testing

1. Open terminal in the server folder:

```powershell
cd server
npm install
npm run dev
```

2. Make sure `server/.env` has these values:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
SUPER_ADMIN_NAME=Super Admin
SUPER_ADMIN_EMAIL=admin email
SUPER_ADMIN_PASSWORD=admin's password 
```

3. In Postman, create an environment named `DiGiWallet Local`.

Add these variables:

| Variable | Initial Value |
| --- | --- |
| `baseUrl` | `http://localhost:5000/api` |
| `collegeId` | empty |
| `studentId` | empty |
| `superAdminId` | empty |
| `superAdminToken` | empty |
| `collegeAccountId` | empty |
| `collegeAccountToken` | empty |
| `credentialId` | empty |
| `runId` | empty |

4. For requests that create unique data, use this in the Postman **Pre-request Script** tab:

```js
if (!pm.environment.get("runId")) {
  pm.environment.set("runId", Date.now());
}
```

5. For JSON requests, set:

```text
Body -> raw -> JSON
Content-Type: application/json
```

## Recommended Testing Order

Test in this order:

1. Health check.
2. Create college.
3. Get all colleges.
4. Get college by ID.
5. Update college.
6. Try duplicate college.
7. Create super admin test user.
8. Login super admin.
9. Get logged-in profile.
10. Create college login account.
11. Create student through auth signup.
12. Approve student through student update.
13. Login student.
14. Create student through student CRUD.
15. Get all students.
16. Get student by ID.
17. Update student.
18. Issue credential.
19. Get issued credentials.
20. Verify credential.
21. Revoke credential.
22. Verify revoked credential.
23. Try invalid/not-found cases.

## Test 1: Health Check

Method:

```http
GET {{baseUrl}}/health
```

Expected status:

```text
200 OK
```

Expected response:

```json
{
  "status": "DiGiWallet API is running"
}
```


## Test 2: Create College

Primary route:

```http
POST {{baseUrl}}/college
```

Alias route also works because the same router is mounted twice:

```http
POST {{baseUrl}}/admin
```

Body:

```json
{
  "collegeName": "Demo College {{runId}}",
  "collegeCode": "DEMO{{runId}}",
  "email": "demo{{runId}}@college.edu.np",
  "phoneNumber": "9800000000",
  "address": {
    "street": "Main Road",
    "city": "Kathmandu",
    "state": "Bagmati",
    "country": "Nepal",
    "postalCode": "44600"
  },
  "website": "https://demo-college.edu.np",
  "accreditation": "UGC",
  "establishedYear": 2001
}
```

Expected status:

```text
201 Created
```

Important result:

- MongoDB stores the college.
- Backend generates RSA key pair.
- Public key is saved in MongoDB.
- Private key file is saved in `server/keys`.
- `status` defaults to `pending`.


## Test 3: Get All Colleges

Method:

```http
GET {{baseUrl}}/college
```

Expected status:

```text
200 OK
```


## Test 4: Get College By ID

Method:

```http
GET {{baseUrl}}/college/{{collegeId}}
```

Expected status:

```text
200 OK
```


## Test 5: Update College

Method:

```http
PUT {{baseUrl}}/college/{{collegeId}}
```

Body:

```json
{
  "phoneNumber": "9811111111",
  "status": "verified",
  "address": {
    "street": "Updated Road",
    "city": "Kathmandu",
    "state": "Bagmati",
    "country": "Nepal",
    "postalCode": "44600"
  }
}
```

Expected status:

```text
200 OK
```


## Test 6: Duplicate College Error

Method:

```http
POST {{baseUrl}}/college
```

Use the same `collegeCode` or `email` from Test 2.

Expected status:

```text
400 Bad Request
```

Expected response message:

```text
College already exists.
```


## Test 7: Seed Super Admin Test User

Run this once from the server folder:

```powershell
npm run seed:admin
```

Expected result:

```text
Super admin created successfully.
```

If the account already exists, the script exits without creating a duplicate.


## Test 8: Login Super Admin

Method:

```http
POST {{baseUrl}}/auth/login
```

Body:

```json
{
  "Email": "admin@digiwallet.test",
  "Password": "password123"
}
```

Expected status:

```text
200 OK
```


## Test 9: Get Logged-In User Profile

Method:

```http
GET {{baseUrl}}/auth/me
```

Headers:

```text
Authorization: Bearer {{superAdminToken}}
```

Expected status:

```text
200 OK
```


## Test 10: Get Profile Without Token

Method:

```http
GET {{baseUrl}}/auth/me
```

Do not send Authorization header.

Expected status:

```text
401 Unauthorized
```


## Test 11: Create College Login Account

Only a logged-in `super_admin` can use this route.

Method:

```http
POST {{baseUrl}}/auth/create-account
```

Headers:

```text
Authorization: Bearer {{superAdminToken}}
```

Body:

```json
{
  "Name": "Demo College Admin",
  "Email": "collegeadmin{{runId}}@digiwallet.test",
  "Password": "password123",
  "role": "college",
  "College_Id": "{{collegeId}}"
}
```

Expected status:

```text
201 Created
```


## Test 12: Login College Account

Method:

```http
POST {{baseUrl}}/auth/login
```

Body:

```json
{
  "Email": "collegeadmin{{runId}}@digiwallet.test",
  "Password": "password123"
}
```

Expected status:

```text
200 OK
```


## Test 13: Student Signup

Method:

```http
POST {{baseUrl}}/auth/signup
```

Body:

```json
{
  "Name": "Student One",
  "Email": "student{{runId}}@digiwallet.test",
  "Password": "password123",
  "College_Id": "{{collegeId}}",
  "Faculty": "Science and Technology",
  "RegistrationNumber": "REG-{{runId}}",
  "RollNo": "ROLL-{{runId}}",
  "DOB": "2002-01-15"
}
```

Expected status:

```text
201 Created
```

Important result:

- Student account is created with `role: student`.
- Student account status is `pending`.
- Pending student cannot login until approved.


## Test 14: Pending Student Login Should Fail

Method:

```http
POST {{baseUrl}}/auth/login
```

Body:

```json
{
  "Email": "student{{runId}}@digiwallet.test",
  "Password": "password123"
}
```

Expected status:

```text
403 Forbidden
```


## Test 15: Approve Student For Testing

There is no dedicated approval route yet. For now, use the student update route.

Method:

```http
PUT {{baseUrl}}/student/{{studentId}}
```

Body:

```json
{
  "accountStatus": "approved"
}
```

Expected status:

```text
200 OK
```


## Test 16: Login Approved Student

Method:

```http
POST {{baseUrl}}/auth/login
```

Body:

```json
{
  "Email": "student{{runId}}@digiwallet.test",
  "Password": "password123"
}
```

Expected status:

```text
200 OK
```


## Test 17: Login With Wrong Password

Method:

```http
POST {{baseUrl}}/auth/login
```

Body:

```json
{
  "Email": "student{{runId}}@digiwallet.test",
  "Password": "wrong-password"
}
```

Expected status:

```text
401 Unauthorized
```


## Test 18: Create Student Through Student CRUD

This is a direct CRUD route. It is different from public signup because it accepts the `role` field directly.

Method:

```http
POST {{baseUrl}}/student
```

Body:

```json
{
  "Name": "CRUD Student",
  "Email": "crudstudent{{runId}}@digiwallet.test",
  "Password": "password123",
  "role": "student",
  "College_Id": "{{collegeId}}",
  "Faculty": "Science and Technology",
  "RegistrationNumber": "CRUD-REG-{{runId}}",
  "RollNo": "CRUD-ROLL-{{runId}}",
  "DOB": "2002-03-20",
  "accountStatus": "approved"
}
```

Expected status:

```text
201 Created
```


## Test 19: Get All Students

Method:

```http
GET {{baseUrl}}/student
```

Expected status:

```text
200 OK
```


## Test 20: Get Student By ID

Method:

```http
GET {{baseUrl}}/student/{{studentId}}
```

Expected status:

```text
200 OK
```


## Test 21: Update Student

Method:

```http
PUT {{baseUrl}}/student/{{studentId}}
```

Body:

```json
{
  "Faculty": "Engineering",
  "RollNo": "UPDATED-ROLL-{{runId}}"
}
```

Expected status:

```text
200 OK
```


## Test 22: Issue Credential

Method:

```http
POST {{baseUrl}}/credentials/issue
```

Body:

```json
{
  "issuerCollegeId": "{{collegeId}}",
  "studentName": "Student One",
  "examRoll": "{{runId}}",
  "registrationNumber": "PU-BCT-{{runId}}",
  "semester": "fifth",
  "level": "Bachelor",
  "faculty": "Science and Technology",
  "program": "Computer",
  "CGPA": 3.75
}
```

Allowed `semester` values:

```text
first, second, third, fourth, fifth, sixth, seventh, eighth
```

Allowed `program` values:

```text
Computer, Civil, Electrical, IT
```

Expected status:

```text
201 Created
```

Important result:

- `credentialData` snapshot is created.
- SHA-256 `dataHash` is created.
- Credential is signed using the college private key.
- `verificationLink` is generated.
- `qrCodeData` is generated.
- Credential ID is saved for later tests.


## Test 23: Issue Credential With Missing Fields

Method:

```http
POST {{baseUrl}}/credentials/issue
```

Body:

```json
{
  "issuerCollegeId": "{{collegeId}}",
  "studentName": "Student One"
}
```

Expected status:

```text
400 Bad Request
```


## Test 24: Get Issued Credentials

Get credentials for one college:

```http
GET {{baseUrl}}/credentials/issued?issuerCollegeId={{collegeId}}
```

Get all credentials:

```http
GET {{baseUrl}}/credentials/issued
```

Expected status:

```text
200 OK
```


## Test 25: Verify Valid Credential

Method:

```http
GET {{baseUrl}}/verify/{{credentialId}}
```

Expected status:

```text
200 OK
```

Expected result:

```text
valid
```


## Test 26: Revoke Credential

Method:

```http
PATCH {{baseUrl}}/credentials/revoke/{{credentialId}}
```

Body:

```json
{
  "issuerCollegeId": "{{collegeId}}"
}
```

Expected status:

```text
200 OK
```


## Test 27: Verify Revoked Credential

Method:

```http
GET {{baseUrl}}/verify/{{credentialId}}
```

Expected status:

```text
200 OK
```

Expected result:

```text
revoked
```


## Test 28: Revoke Already Revoked Credential

Method:

```http
PATCH {{baseUrl}}/credentials/revoke/{{credentialId}}
```

Body:

```json
{
  "issuerCollegeId": "{{collegeId}}"
}
```

Expected status:

```text
409 Conflict
```


## Test 29: Verify Invalid Credential ID

Method:

```http
GET {{baseUrl}}/verify/123
```

Expected status:

```text
404 Not Found
```

Expected result:

```text
not_found
```


## Test 30: Get College With Invalid ID

Method:

```http
GET {{baseUrl}}/college/123
```

Expected status:

```text
500 Internal Server Error
```

Current note:

- The controller currently sends `500` for invalid MongoDB ObjectId format.
- A better future behavior would be `400 Bad Request`.


## Test 31: Delete Student

Only run this after all student login/update tests are finished.

Method:

```http
DELETE {{baseUrl}}/student/{{studentId}}
```

Expected status:

```text
200 OK
```


## Test 32: Delete College

Only run this when credential tests are finished. If you delete the college before verification, credential signature verification will not have the issuer public key.

Method:

```http
DELETE {{baseUrl}}/college/{{collegeId}}
```

Expected status:

```text
200 OK
```


## Current Route Summary

| Area | Method | URL | Status |
| --- | --- | --- | --- |
| Health | GET | `/api/health` | Implemented |
| College | POST | `/api/college` | Implemented |
| College | GET | `/api/college` | Implemented |
| College | GET | `/api/college/:id` | Implemented |
| College | PUT | `/api/college/:id` | Implemented |
| College | DELETE | `/api/college/:id` | Implemented |
| College alias | POST/GET/PUT/DELETE | `/api/admin` and `/api/admin/:id` | Implemented as alias to college CRUD |
| Student CRUD | POST | `/api/student` | Implemented |
| Student CRUD | GET | `/api/student` | Implemented |
| Student CRUD | GET | `/api/student/:id` | Implemented |
| Student CRUD | PUT | `/api/student/:id` | Implemented |
| Student CRUD | DELETE | `/api/student/:id` | Implemented |
| Auth | POST | `/api/auth/signup` | Implemented |
| Auth | POST | `/api/auth/login` | Implemented |
| Auth | POST | `/api/auth/create-account` | Implemented, protected |
| Auth | GET | `/api/auth/me` | Implemented, protected |
| Credentials | POST | `/api/credentials/issue` | Implemented |
| Credentials | GET | `/api/credentials/issued` | Implemented |
| Credentials | PATCH | `/api/credentials/revoke/:credentialId` | Implemented |
| Verify | GET | `/api/verify/:credentialId` | Implemented |
| Student wallet | GET | `/api/student-name/wallet` | Not implemented |
| Student credential details | GET | `/api/student-name/credentials/:credentialId` | Not implemented |
| Verification logs | GET | `/api/admin/verification-logs` | Not implemented |

## Common Problems While Testing

### Server says MONGODB_URI is not set

Fix `server/.env` and restart the server.

### Login says token invalid

Check that:

- `JWT_SECRET` exists in `server/.env`.
- The token is copied without extra spaces.
- Header is exactly `Authorization: Bearer {{superAdminToken}}`.

### Credential issue says private key not found

This happens when the college exists in MongoDB but its private key file is missing from `server/keys`.

Fix:

1. Create a fresh college through `POST /api/college`.
2. Use the new `collegeId`.
3. Issue credential again.

### Duplicate credential error

`examRoll` and `registrationNumber` are unique. Use a new `runId` or manually change both values.

### Student cannot login

Students created through `/auth/signup` start with:

```text
accountStatus = pending
```

Approve them for testing with:

```http
PUT {{baseUrl}}/student/{{studentId}}
```

Body:

```json
{
  "accountStatus": "approved"
}
```
