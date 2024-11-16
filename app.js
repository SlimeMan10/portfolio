/**
 * Justin Hernandez Tovalin
 * Section: AJ
 * This is a Node.js web service that manages LeetCode challenges. It provides endpoints
 * to validate admin access, add/update challenges, and retrieve challenges with
 * filtering capabilities. The service uses file operations to persist data.
 */

"use strict";

const express = require("express");
const multer = require("multer");
const fs = require("fs").promises;

// Constants
const SERVER_ERROR = 500;
const USER_ERROR = 400;
const PORT_NUMBER = 8000;
const PORT = process.env.PORT || PORT_NUMBER;
const PASSWORD = "shibaInu!=fox";

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(multer().none());
app.use(express.urlencoded({extended: true}));

/**
 * Validates admin password for accessing protected features
 * Returns JSON indicating if provided password is valid
 */
app.post("/validate", function(req, res) {
  const submittedPassword = req.body.password;
  if (!submittedPassword) {
    res.status(USER_ERROR).json({isValid: false, message: "Missing password parameter"});
  } else {
    res.json({isValid: submittedPassword === PASSWORD});
  }
});

/**
 * Adds or updates a challenge in the database
 * Requires all challenge fields in the request body
 * Returns plain text indicating success or failure
 */
app.post("/add", async function(req, res) {
  res.type("text");
  let {name, difficulty, topic, solution, notes} = req.body;
  if (name && difficulty && topic && solution && notes) {
    try {
      const data = await readChallengesFile();
      const challengeExists = data[name];
      const response = challengeExists ? "Updated challenge information" : "Added new challenge";
      writeData(data, name, difficulty, topic, solution, notes);
      await fs.writeFile("challenges.json", JSON.stringify(data, null, 2));
      res.send(response);
    } catch (err) {
      console.error("Error:", err);
      res.status(SERVER_ERROR).send("Something went wrong on the server");
    }
  } else {
    res.status(USER_ERROR).send("Missing required parameters");
  }
});

/**
 * Retrieves challenges based on query parameters
 * Can filter by name or difficulty, or return all challenges
 */
app.get("/retrieveChallenge", async function(req, res) {
  try {
    const challenges = await readChallengesFile();
    const value = determineValue(req, challenges);
    return res.json(value);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(USER_ERROR).json({error: "No challenges found"});
    }
    console.error("Error reading challenges:", err);
    return res.status(SERVER_ERROR).json({error: "Error retrieving challenges"});
  }
});

/**
 * Reads and parses the challenges file
 * @returns {Promise<Object>} The challenges data object
 */
async function readChallengesFile() {
  try {
    const fileExists = await fs.access("challenges.json")
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      const data = await fs.readFile("challenges.json", "utf8");
      return JSON.parse(data);
    }
    return {};
  } catch (err) {
    throw err;
  }
}

/**
 * Writes challenge data to the data object
 * @param {Object} data - The data object to write to
 * @param {string} name - Challenge name
 * @param {string} difficulty - Challenge difficulty
 * @param {string} topic - Challenge topic
 * @param {string} solution - Challenge solution
 * @param {string} notes - Challenge notes
 */
function writeData(data, name, difficulty, topic, solution, notes) {
  data[name] = {
    "name": name,
    "difficulty": difficulty,
    "topic": topic,
    "solution": solution,
    "notes": notes
  };
}

/**
 * Determines what value to return based on query parameters
 * @param {Object} req - Express request object
 * @param {Object} challenges - Challenges data object
 * @returns {Array|Object} Filtered challenges or single challenge
 */
function determineValue(req, challenges) {
  let value;
  if (req.query.name) {
    const challenge = challenges[req.query.name];
    if (!challenge) {
      return [];
    }
    value = challenge;
  } else if (req.query.difficulty) {
    const filtered = intermediateStep(challenges, req)
    value = filtered;
  } else {
    value = Object.values(challenges);
  }
  return value;
}

/**
* Filters challenges array by applying difficulty filter
* @param {Object} challenges - Challenges data object
* @param {Object} req - Express request object
* @returns {Array} Filtered array of challenges
*/
function intermediateStep(challenges, req) {
  return Object.values(challenges).filter(challenge => filterByDifficulty(challenge, req));
 }

 /**
 * Checks if challenge matches requested difficulty
 * @param {Object} challenge - Individual challenge object
 * @param {Object} req - Express request object
 * @returns {boolean} True if difficulty matches, false otherwise
 */
 function filterByDifficulty(challenge, req) {
  return challenge.difficulty === req.query.difficulty;
 }

app.listen(PORT);