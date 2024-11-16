// app.js
"use strict";
const serverError = 500;
const userError = 400;
const numPort = 8000;
const express = require("express");
const app = express();
const multer = require("multer");
const fs = require("fs").promises;

// For parsing JSON
app.use(express.json());

// Set the correct path to your public folder
app.use(express.static('public'));
app.use(multer().none());
app.use(express.urlencoded({extended: true}));

const PASSWORD = "shibaInu!=fox";

app.post("/validate", function(req, res) {
  const submittedPassword = req.body.password;
  if (!submittedPassword) {
    res.status(userError).json({isValid: false, message: "Missing password parameter"});
  } else {
    res.json({isValid: submittedPassword === PASSWORD});
  }
});

app.post("/add", async function(req, res) {
  res.type("text");
  let {name, difficulty, topic, solution, notes} = req.body;
  if (name && difficulty && topic && solution && notes) {
    try {
      let data = {};
      const fileExists = await fs.access("challenges.json")
        .then(() => true)
        .catch(() => false);
      if (fileExists) {
        data = JSON.parse(await fs.readFile("challenges.json", "utf8"));
      }
      let challengeExists = data[name];
      let response = challengeExists ? "Updated challenge information" : "Added new challenge";
      writeData(data, name, difficulty, topic, solution, notes);
      await fs.writeFile("challenges.json", JSON.stringify(data, null, 2));
      res.send(response);
    } catch (err) {
      console.error("Error:", err);
      res.status(serverError).send("Something went wrong on the server");
    }
  } else {
    res.status(userError).send("Missing required parameters");
  }
});

app.get("/retrieveChallenge", async function(req, res) {
  try {
    const challenges = JSON.parse(await fs.readFile("challenges.json", "utf8"));
    const value = determineValue(req, challenges);
    return res.json(value);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(userError).json({error: "No challenges found"});
    }
    console.error("Error reading challenges:", err);
    return res.status(serverError).json({error: "Error retrieving challenges"});
  }
});

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
    name,
    difficulty,
    topic,
    solution,
    notes
  };
}

/**
 * Determines what value to return based on query parameters
 * @param {Object} req - Express request object
 * @param {Object} challenges - Challenges data object
 * @returns {Array|Object} Filtered challenges or single challenge
 */
function determineValue(req, challenges) {
  if (req.query.name) {
    const challenge = challenges[req.query.name];
    if (!challenge) {
      return [];
    }
    value = challenge;
  } else if (req.query.difficulty) {
    const filteredChallenges = Object.values(challenges).filter(challenge =>
      challenge.difficulty === req.query.difficulty
    );
    value = filteredChallenges;
  } else {
    value = Object.values(challenges);
  }
  return value;
}

const PORT = process.env.PORT || numPort;
app.listen(PORT);