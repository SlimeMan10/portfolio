# Justins Portfolio API Documentation
This API was created for the purpose of tracking my LeetCode problems that I have completed.
I have created a login endpoint that checks if the admin login password is correct so that
I am able to add new challenges or edit them. The API provides endpoints to validate admin
access, retrieve existing challenges, and add/update challenges.

## Password Validation
**Request Format:** "/validate"

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Verifies if the user input matches the admin password (shibaInu!=fox).
If the password is correct, it returns isValid as true which allows access to add/edit challenge
functionality.

**Example Request:**
{
  "password": "shibaInu!=fox"
}

**Example Response:**

```
{
  "isValid": true
}
```

**Error Handling:**
*Fill in an example of the error handling*
Status Code: 400 {
  "isValid": false,
  "message": "Missing password parameter"
}


## Retrieve Challenges
**Request Format:** "/retrieveChallenge"

**Request Type:** Get

**Returned Data Format**: JSON

**Description:**  Returns either all challenges, filtered challenges by difficulty,
or a specific challenge by name. There is a hierarchy where it will return the name
first if given the name, then it will return all challenges with the difficulty specified.
If no difficulty or name specified it will then return all challenges.

**Example Request:** *Fill in example request*
All Challenges: /retrieveChallenge
Specific Challenge: /retrieveChallenge?name=3Sum
By Difficulty: /retrieveChallenge?difficulty=Easy

**Example Response:**
*Fill in example response in the {}*

```
{
  "name": "3Sum",
  "difficulty": "Medium",
  "topic": "Arrays, Two Pointers, Sorting",
  "solution": "class Solution {...}",
  "notes": "This problem shows my progression..."
}
```

**Error Handling:**
*Fill in an example of the error handling*
Status Code: 400 {
  "error": "No challenges found"
}

Status Code: 500 {
  "error": "Error retrieving challenges"
}

##  Add Challenge
**Request Format:** "/add"

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Adds a new challenge or updates an existing challenge with the provided
information. All fields (name, difficulty, topic, solution, notes) are required.

**Example Request:** *Fill in example request*
{
  "name": "3Sum",
  "difficulty": "Medium",
  "topic": "Arrays, Two Pointers, Sorting",
  "solution": "class Solution {...}",
  "notes": "This problem shows my progression..."
}

**Example Response:**
*Fill in example response in the {}*
```
  "Added new challenge"
  or
  "Updated challenge information"
```

**Error Handling:**
*Fill in an example of the error handling*
Status code: 400 = {"Missing required parameters"}
Status code: 500 = {"Something went wrong on the server"}