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

#### Working

- test api through postman using url `http://localhost:5000/api/college`
- first register college, i.e. post to this url with important info like `collegeName,collegeCode,email, phoneNumber`
- do `post` method will create database with these information and public key stord in db
- creates `${collegeCode}_v1_private.pem` file where private keys are stored.
### Note: 
##### - Backend automatically creates `.pem` file for each unique college registration

##### - For duplicate college code it shows graceful error message as `college already exists.` which controls duplicate entry of college
