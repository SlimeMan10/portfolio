// app.js
"use strict";
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
    res.status(400).json({isValid: false, message: "Missing password parameter"});
  } else {
    res.json({isValid: submittedPassword === PASSWORD});
  }
});

app.post("/add", async function(req, res) {
  res.type("text");
  const {name, difficulty, topic, solution, notes} = req.body;

  if (name && difficulty && topic && solution && notes) {
    try {
      let data = {};

      // If file exists, read it; if not, start with empty object
      const fileExists = await fs.access("challenges.json")
        .then(() => true)
        .catch(() => false);

      if (fileExists) {
        data = JSON.parse(await fs.readFile("challenges.json", "utf8"));
      }

      const challengeExists = data[name];
      const response = challengeExists ? "Updated challenge information" : "Added new challenge";

      data[name] = {
        name,
        difficulty,
        topic,
        solution,
        notes
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
    const challenges = JSON.parse(await fs.readFile("challenges.json", "utf8"));

    if (req.query.name) {
      const requestedChallenge = challenges[req.query.name];
      if (requestedChallenge) {
        res.json(requestedChallenge);
      } else {
        res.status(404).json({error: "Challenge not found"});
      }
    } else {
      res.json(Object.values(challenges));
    }
  } catch (err) {
    console.error("Error reading challenges:", err);
    res.status(500).json({error: "Error retrieving challenges"});
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);