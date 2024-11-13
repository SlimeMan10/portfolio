"use strict";
(function() {
  window.addEventListener('load', init);

  function init() {
    //if we want to add to our challenges
    id('show-admin').addEventListener('click', function() {
      id("admin-login").classList.toggle('hidden');
      id('login-btn').addEventListener('click', validateLogin);
    });
    const addChallenge = id('add-challenge');
    if (addChallenge) {
      addChallenge.addEventListener('click', addNewChallenge);
    }
    id('show-challenges').addEventListener('click', loadChallenges);
  }

  async function loadChallenges() {
    //we want to get the info from our POST
    try {
      const response = await fetch("/retrieveChallenge", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const challenges = await response.json();
        console.log(challenges);
        displayChallenges(challenges);
      } else {
        console.error("Error loading challenges")
      }
    } catch(err) {
      console.error("Error: ", err)
    }
  }

  function displayChallenges(challenges) {
    id('challenges-container').innerHTML = '';
    const search = id('search-challenges').value;  // Add .value
    const diff = id('filter-difficulty').value;    // Fix quotes in id

    if (search) {  // If there's a search term
      const filteredChallenges = challenges.filter(challenge =>
        challenge.name.toLowerCase().includes(search.toLowerCase())
      );
      createNormalChallenges(filteredChallenges);
    } else if (diff === 'Easy' || diff === 'Medium' || diff === 'Hard') {  // Add quotes
      const filteredChallenges = challenges.filter(challenge =>
        challenge.difficulty === diff
      );
      createNormalChallenges(filteredChallenges);
    } else {
      createNormalChallenges(challenges);
    }
  }

  function createNormalChallenges(challenges) {
    challenges.forEach(element => {
      let challengeCard = createChallengeCard();
      let cardName = createCardName(element);
      let cardDifficulty = createCardDifficulty(element);
      let cardTopic = createCardTopic(element);
      let cardSolution = createCardSolution(element);
      finalizeCard(challengeCard, cardName, cardDifficulty, cardTopic, cardSolution);
      id('challenges-container').appendChild(challengeCard);
    });
  }

  function createChallengeCard() {
    let challengeCard = gen('div');
    challengeCard.classList.add('challenge-card');
    return challengeCard;
  }

  function createCardName(element) {
    let cardName = gen('h3');
    cardName.textContent = element.name;
    return cardName;
  }

  function createCardDifficulty(element) {
    let cardDifficulty = gen('p');
    cardDifficulty.textContent = "Difficulty: " + element.difficulty;
    cardDifficulty.classList.add('hidden');
    return cardDifficulty;
  }

  function createCardTopic(element) {
    let cardTopic = gen('p');
    cardTopic.textContent = "Topics: " + element.topic;
    cardTopic.classList.add('hidden');
    return cardTopic;
  }

  function createCardSolution(element) {
    let cardSolution = gen('pre');
    cardSolution.textContent = element.solution;
    cardSolution.classList.add('hidden');
    return cardSolution;
  }

  function finalizeCard(challengeCard, cardName, cardDifficulty, cardTopic, cardSolution) {
    challengeCard.addEventListener('click', () => {
      cardDifficulty.classList.toggle('hidden');
      cardTopic.classList.toggle('hidden');
      cardSolution.classList.toggle('hidden');
    });
    challengeCard.appendChild(cardName);
    challengeCard.appendChild(cardDifficulty);
    challengeCard.appendChild(cardTopic);
    challengeCard.appendChild(cardSolution);
    return challengeCard
  }
  /**
   * Validates the admin password by sending it to the server as JSON.
   * The password is sent in the format: { "password": "userInput" }
   */
  async function validateLogin() {
    try {
      // Get password input
      let input = id('admin-password').value;

      // Create the JSON object to send
      const data = {
        password: input
      };

      // Send POST request with JSON data
      const response = await fetch('/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'  // Tell server we're sending JSON
        },
        body: JSON.stringify(data)  // Convert the object to JSON string
      });

      // Parse the JSON response from server
      const result = await response.json();

      if (result.isValid) {
        id('admin-login').classList.toggle('hidden');
        let addForm = id("add-challenge-form")
        addForm.classList.remove('hidden');
      } else {
        id('admin-password').value = '';
        id('admin-password').textContent = "Try again";
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function addNewChallenge() {
    try {
      let name = id('challenge-name').value;
      let difficulty = id('challenge-difficulty').value;
      let topic = id('challenge-topic').value;
      let solution = id('challenge-solution').value;
      const response = await fetch('/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          difficulty: difficulty,
          topic: topic,
          solution: solution
        })
      });

      const text = await response.text();
      if (response.ok) {
        id('challenge-name').value = '';
        id('challenge-difficulty').value = 'Easy';
        id('challenge-topic').value = '';
        id('challenge-solution').value = '';
        console.log(text)
;      }
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  function id(item) {
    return document.getElementById(item);
  }

  function gen(item) {
    return document.createElement(item);
  }
})();