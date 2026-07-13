# By manisha description:
## Works done:
## Date: 2083-03-5 to onwards
### Sprint 1
- created college schema, router, controller 
- tested API
## Date: 2083-03-12 to onwards
### Sprint 2

- implemented key pair in college schema
- created `key` folder inside `src` and `keyGenerator.js` inside `utils`
## 2083-03-21
### Sprint 3
- implement login page using external css
- using plain css
- for eye symbol on pw hide or show option we do `npm install react-icons`
  
  `import{FaEye,FaEyeSlash} from "react-icons/fa`

#### Changes made
- created login folder , kept .jsx and .css inside it
- inside services folder, created authService.js file

#### 03-25

#### Works done
- created an entry to student db from postman
- took email and password for login
- changed status to approved manually from mongoDB for now , since we require approved data for login
- used email and pw for login 
   - run both backend and frontend for success
- then see `network`->`fetch`-> `preview` for the data 
  - frontend sent the login request
  - backend received it
  - mongoDB found the user
  - password verification succeeded
  - JWT token was generated
  - user role was returned
- after logging in it will direct to `localhost:3001/{role}/dashboard
- It will direct to the dashboard according to the role responded from backend for that particular login info


### 03-28

- made college dashboard with students, credentials, verification, profile, pending and setting options
- on clicking each component , it directs to individual pages
- Since,superAdmin is still on progress, use `http://localhost:3001/college/dashboard` to visit college dashboard
- datas are manually entered for now , after backend integration datas will be taken from `API`
- works are still remaining to do
#### Working

- test api through postman using url `http://localhost:5000/api/college`
- first register college, i.e. post to this url with important info like `collegeName,collegeCode,email, phoneNumber`
- do `post` method will create database with these information and public key stord in db
- creates `${collegeCode}_v1_private.pem` file where private keys are stored.
### Note: 
##### - Backend automatically creates `.pem` file for each unique college registration

##### - For duplicate college code it shows graceful error message as `college already exists.` which controls duplicate entry of college









## By Maheshwar Pant description:
## Works done :
## Date: 2083-03-5 to onwards
### Sprint 1
- created student schema, router, controller
- tested API's

### Date: 2083-03-14 to onwards
### Sprint 2
- jwt authentication implemented for student login and registration
- role based access control implemented for student, college and admin
- created "dbConnect.js " to connect the app to MongoDB using Mongoose and the MONGODB_URI.
- created "auth.middleware.js" to check for bearer token in request header and verifies the jwt token and attaches req.user to the request object
- created "role.middleware.js" to checks for the role of the user and allows access to certain routes based on the user's role
- created "auth.routes.js" to define auth endpoints for signup, login, protected profile access, and super-admin account creation.
- created "generateToken.js" to generate a JWT token for the user with their ID, role, and expiration.

## Working
-Test auth routes using http://localhost:5000/api/auth
-POST /api/auth/signup registers a student account and saves it as pending
-POST /api/auth/login authenticates student, college, or super_admin and returns a JWT
-GET /api/auth/me returns the logged-in user profile if the JWT is valid
-POST /api/auth/create-account is protected and only super_admin can create college login accounts

### Note
- Signup is public and only creates the student record; JWT is issued on login only
- `Authorization: Bearer <token>` is required for protected routes like `/me` and `/create-account`
- `auth.middleware.js` validates the JWT and attaches the decoded user to `req.user`
- `role.middleware.js` checks `req.user.role` and blocks unauthorized roles with `403`
- Student login also checks `accountStatus` so pending or rejected students cannot login




## By Bibek Ghimire description:
## Works done :
## Date: 2083-03-5 to onwards
### Sprint 1
- created credential schema, router, controller
- tested API's

### Date: 2083-03-14 to onwards
### Sprint 2
- implemented hashing for issued credentials
- implemented digital signature generation using the issuer private key
- created API endpoint for credential verification
