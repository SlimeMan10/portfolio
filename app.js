"use strict";
const express = require("express");
const app = express();
const path = require('path');
const multer = require("multer");
const fs = require("fs").promises;

// For parsing JSON
app.use(express.json());
// Set the correct path to your public folder
app.use(express.static('public'));
app.use(multer().none());
app.use(express.urlencoded({ extended: true }))

const PASSWORD = "shibaInu!=fox";

app.post("/validate", function(req, res) {
  const submittedPassword = req.body.password;

  if (!submittedPassword) {
    res.status(400).json({ isValid: false, message: "Missing password parameter" });
  } else {
    res.json({ isValid: submittedPassword === PASSWORD });
  }
});

app.post("/add", async function(req, res) {
  res.type("text");
  let name = req.body.name;
  let difficulty = req.body.difficulty;
  let topic = req.body.topic;
  let solution = req.body.solution;

  if (name && difficulty && topic && solution) {
    try {
      let data = {};
      // If file exists, read it; if not, start with empty object
      if (await fs.access("challenges.json").then(() => true).catch(() => false)) {
        data = JSON.parse(await fs.readFile("challenges.json", "utf8"));
      }

      let challengeExists = data[name];
      let response = challengeExists ? "Updated challenge information" : "Added new challenge";

      data[name] = {
        name,
        difficulty,
        topic,
        solution
      };

      await fs.writeFile("challenges.json", JSON.stringify(data, null, 2));
      res.send(response);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).send("Something went wrong on the server");
    }
  } else {
    res.status(400).send("Missing required parameters");
  }
});

app.get("/retrieveChallenge", async function(req, res) {
  try {
    // Read the challenges data from the JSON file
    let challenges = JSON.parse(await fs.readFile("challenges.json", "utf8"));

    // Check if a specific challenge was requested
    if (req.query.name) {
      // Retrieve the requested challenge
      let requestedChallenge = challenges[req.query.name];
      if (requestedChallenge) {
        res.json(requestedChallenge);
      } else {
        res.status(404).json({ error: "Challenge not found" });
      }
    } else {
      // Return all challenges
      res.json(Object.values(challenges));
    }
  } catch (err) {
    console.error("Error reading challenges:", err);
    res.status(500).json({ error: "Error retrieving challenges" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);