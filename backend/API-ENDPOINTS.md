ENDPOINTS

___

**CHALLENGES**

```
POST api/challenges # Create a challenge

GET api/challenges/{id} # Details for a single challenge

PUT api/challenges/{id}

DELETE /api/challenges/{id}

# List of all challenges. Possible filter & sort
GET api/challenges?category=sports&difficulty=medium&sort=likes

# List of all challenges connected to a user
GET api/challenges/{id}

# List of all challenges connected to a user with a specific type of connection
GET api/challenges/{id}/{connection-type}


POST /api/challenges/{id}/like // like

DELETE /api/challenges/{id}/like // remove like

```

___

**USERS**

```
POST api/users # Create a user (Sign Up)

GET api/users/{id} # Details for user

GET api/users/{id}/stats

UPDATE api/users/{id}/stats

PATCH api/users/{id}/stats
```

---

**SUBMISSIONS**

````
# Create submission for a challenge
POST api/challenges/{id}/submissions

# Lists all submissions for a challenge
GET api/challenges/{id}/submissions

# Details for a specific submission
GET api/submissions/{id}

# Challenge authour accepts or rejects submission
PUT/PATCH api/challenges/{id}/submissions{id}
````

---

**COMMENTS**

````
# Post a comment under a challenge
POST api/challenges/{id}/comments

# Read all comments under a challenge
GET api/challenges/{id}/comments
````