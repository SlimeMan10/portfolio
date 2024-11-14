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
    buttonEvents();
  }

  function buttonEvents() {
    const resumeLink = 'https://tinyurl.com/nzpwnmw6';
    const javaLink = 'https://tinyurl.com/4ma4b4ex';
    const htmlLink = 'https://tinyurl.com/2cdttxtx';
    const cssLink = 'https://tinyurl.com/2suk2e2v';
    const jsLink = 'https://tinyurl.com/29rjtyrm';
    const sqlLink = 'https://tinyurl.com/2mkkfkm5';
    const nodeLink = 'https://tinyurl.com/mryd2jj6';
    openPage('resume', resumeLink);
    openPage('javaCard', javaLink);
    openPage('htmlCard', htmlLink);
    openPage('cssCard', cssLink);
    openPage('javascriptCard', jsLink);
    openPage('sqlCard', sqlLink);
    openPage('nodeCard', nodeLink);
  }

  function openPage(itemId, link) {
    id(itemId).addEventListener('click', function() {
      window.open(link, '_blank');
    });
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
    const search = id('search-challenges').value;
    const diff = id('filter-difficulty').value;

    if (search) {  // If there's a search term
      const filteredChallenges = challenges.filter(challenge =>
        challenge.name.toLowerCase().includes(search.toLowerCase())
      );
      createNormalChallenges(filteredChallenges);
    } else if (diff === 'Easy' || diff === 'Medium' || diff === 'Hard') {
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
      let cardNotes = createCardNotes(element);
      challengeCard.addEventListener('click', () => {
        cardDifficulty.classList.toggle('hidden');
        cardTopic.classList.toggle('hidden');
        cardSolution.classList.toggle('hidden');
        cardNotes.classList.toggle('hidden');
      });
      challengeCard.appendChild(cardName);
      challengeCard.appendChild(cardDifficulty);
      challengeCard.appendChild(cardTopic);
      challengeCard.appendChild(cardSolution);
      challengeCard.appendChild(cardNotes);
      id('challenges-container').appendChild(challengeCard);
    });
  }

  function createCardNotes(element) {
    let cardNotes = gen('pre');
    cardNotes.textContent = element.notes;
    cardNotes.classList.add('hidden');
    return cardNotes;
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
      let notes = id('challenge-notes').value;
      const response = await fetch('/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          difficulty: difficulty,
          topic: topic,
          solution: solution,
          notes: notes
        })
      });

      const text = await response.text();
      if (response.ok) {
        id('challenge-name').value = '';
        id('challenge-difficulty').value = 'Easy';
        id('challenge-topic').value = '';
        id('challenge-solution').value = '';
        id('challenge-notes').value = '';
      }
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