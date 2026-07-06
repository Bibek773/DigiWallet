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

#### Working

- test api through postman using url `http://localhost:5000/api/college`
- first register college, i.e. post to this url with important info like `collegeName,collegeCode,email, phoneNumber`
- do `post` method will create database with these information and public key stord in db
- creates `${collegeCode}_v1_private.pem` file where private keys are stored.
### Note: 
##### - Backend automatically creates `.pem` file for each unique college registration

##### - For duplicate college code it shows graceful error message as `college already exists.` which controls duplicate entry of college

## Date: 2083-03-19 to onwards
### Sprint 3

- implemented credential hashing for issued academic records
- implemented digital signature generation and validation
- created verification API to check credential authenticity and status

#### Working

- hash is generated when a credential is issued
- digital signature is attached using the issuer private key
- verification API checks hash, signature, and credential state before returning the result

### Note:
##### - These tasks are part of the credential security flow and support tamper detection during verification
