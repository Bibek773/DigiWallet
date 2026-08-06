# Credential Index Migration Plan

## Goal

Allow multiple credentials per student while preventing duplicates for the same `registrationNumber`, `semester`, and `credentialType` combination.

## Steps

1. Remove the old unique index on `registrationNumber` from the `credentials` collection.
2. Create a compound unique index on `{ registrationNumber: 1, semester: 1, credentialType: 1 }`.
3. Verify that credential issuance works for different semesters and different credential types for the same student.

## Mongo Shell Commands

```js
// Drop the old unique index
db.credentials.dropIndex("registrationNumber_1")

// Create the new compound unique index
db.credentials.createIndex(
  { registrationNumber: 1, semester: 1, credentialType: 1 },
  { unique: true, name: "registrationNumber_1_semester_1_credentialType_1" }
)
```

## Notes

- If duplicates already exist in the collection, remove or consolidate them before creating the new unique index.
- The application code now requires `credentialType` in issue requests and will return a 400 error if it is missing.