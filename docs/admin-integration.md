# Admin Integration Notes

Base URL: `/api`

All admin endpoints require:

```http
Authorization: Bearer <jwt>
```

Allowed roles: `super_admin`, `admin`.

## Dashboard

```http
GET /admin/dashboard
```

Returns only MongoDB-backed data:

```json
{
  "success": true,
  "message": "Admin dashboard data loaded.",
  "data": {
    "users": [],
    "colleges": [],
    "credentials": [],
    "verificationLogs": [],
    "metrics": {
      "totalUsers": 0,
      "activeStudents": 0,
      "colleges": 0,
      "issuedCredentials": 0,
      "verifications": 0
    },
    "recentActivity": []
  }
}
```

## Create College And Login Account

```http
POST /admin/colleges
```

Request:

```json
{
  "collegeName": "College Name",
  "collegeCode": "COL",
  "email": "college@example.edu",
  "phoneNumber": "9800000000",
  "address": "Full address",
  "website": "https://college.example.edu",
  "accreditation": "TU affiliated",
  "establishedYear": 2001,
  "adminName": "College Admin",
  "adminContact": "9811111111",
  "loginEmail": "admin@college.example.edu",
  "initialPassword": "secret123"
}
```

Success:

```json
{
  "success": true,
  "message": "College and college login account created successfully.",
  "data": {
    "college": {},
    "account": {}
  }
}
```

Partial failure:

```json
{
  "success": false,
  "message": "College created, but account creation failed: ...",
  "data": {
    "partialFailure": true,
    "college": {},
    "account": null,
    "retry": {
      "method": "POST",
      "endpoint": "/api/admin/colleges/<collegeId>/account",
      "requiredFields": ["adminName", "adminContact", "loginEmail", "initialPassword"]
    }
  }
}
```

Retry account creation:

```http
POST /admin/colleges/:id/account
```

## Admin Operations

```http
GET /admin/users
PATCH /admin/users/:id
DELETE /admin/users/:id

GET /admin/colleges
PUT /admin/colleges/:id
DELETE /admin/colleges/:id

GET /admin/credentials
PATCH /admin/credentials/:id/revoke
DELETE /admin/credentials/:id

GET /admin/verification-logs
```

Responses use:

```json
{
  "success": true,
  "message": "Operation message.",
  "data": {}
}
```

No admin endpoint returns `Password` or password hashes.

Public signup remains student-only. Requests to create a `college` role through public signup return `400`.
