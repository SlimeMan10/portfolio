Portfolio API Documentation
This API was created for the purpose of tracking my LeetCode problems that I have completed.
I have created a login endpoint that checks if the admin login password is correct so that I am
able to add new challenges or edit them. The API provides endpoints to validate admin access,
retrieve existing challenges, and add/update challenges.


Endpoint 1: Password validation
**Request Format:** "/validate"

**Request Type:** post

**Returned Data Format**: JSON

**Description:**
Verifies if the user input matches the admin password (shibaInu!=fox).
If the password is correct, it returns isValid as true which allows access to add/edit
challenge functionality.


**Example Request:**
{
"password": "shibaInu!=fox"
}

**Example Response:**
```json
{
  "isValid": true
}

**Error Handling:**
{
  "isValid": false,
  "message": "Missing password parameter"
}
Status Code: 400


Endpoint 2: add new challenge card
**Request Format:**
"/add"

**Request Type:**
GET

**Returned Data Format**: JSON

**Description:**
Returns either all challenges. Also if given only a name it will return just that challenge.
There is a heiarchy where it will return the name first if given the name, then it will return
all challenges with the difficulty specified. If not difficulty or name specified it will then
return all challenges


**Example Request:**
All Challenges: /retrieveChallenge
Specific Challenge: /retrieveChallenge?name=3Sum
By Difficulty: /retrieveChallenge?difficulty=Easy


**Example Response:**
```JSON {
  "name": "3Sum",
  "difficulty": "Medium",
  "topic": "Arrays, Two Pointers, Sorting",
  "solution": "class Solution {...}",
  "notes": "This problem shows my progression..."
}
```

**Error Handling:**
400 error {
  "error": "No challenges found"
}

500 error {
  "error": "Error retrieving challenges"
}

Endpoint 3: add challenge
**Request Format:** '/add'

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:**
Adds a new challenge or updates an existing challenge with the provided information.
All fields (name, difficulty, topic, solution, notes) are required.

**Example Request:**
{
  "name": "3Sum",
  "difficulty": "Medium",
  "topic": "Arrays, Two Pointers, Sorting",
  "solution": "class Solution {...}",
  "notes": "This problem shows my progression..."
}

**Example Response:**
{
"Added new challenge"
or
"Updated challenge information"
}


**Error Handling:**
*Fill in an example of the error handling*
400 error {"Missing required parameters"}

500 error {"Something went wrong on the server"}