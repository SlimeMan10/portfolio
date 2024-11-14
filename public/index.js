// index.js
"use strict";
(function() {
  window.addEventListener('load', init);

  /**
   * Initializes the page by setting up event listeners
   */
  function init() {
    // Setup admin login events
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

  /**
   * Sets up button events for all card links
   */
  function buttonEvents() {
    const links = {
      resume: 'https://tinyurl.com/nzpwnmw6',
      javaCard: 'https://tinyurl.com/4ma4b4ex',
      htmlCard: 'https://tinyurl.com/2cdttxtx',
      cssCard: 'https://tinyurl.com/2suk2e2v',
      javascriptCard: 'https://tinyurl.com/29rjtyrm',
      sqlCard: 'https://tinyurl.com/2mkkfkm5',
      nodeCard: 'https://tinyurl.com/mryd2jj6'
    };

    Object.entries(links).forEach(([id, link]) => {
      openPage(id, link);
    });
  }

  /**
   * Adds click event listener to open link in new tab
   * @param {string} itemId - The ID of the element to attach listener to
   * @param {string} link - The URL to open
   */
  function openPage(itemId, link) {
    id(itemId).addEventListener('click', function() {
      window.open(link, '_blank');
    });
  }

  /**
   * Loads challenges from the server
   */
  async function loadChallenges() {
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
        console.error("Error loading challenges");
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  }

  /**
   * Displays filtered challenges based on search and difficulty
   * @param {Array} challenges - Array of challenge objects
   */
  function displayChallenges(challenges) {
    id('challenges-container').innerHTML = '';
    const search = id('search-challenges').value;
    const diff = id('filter-difficulty').value;

    let filteredChallenges = challenges;
    if (search) {
      filteredChallenges = challenges.filter(challenge =>
        challenge.name.toLowerCase().includes(search.toLowerCase()));
    } else if (['Easy', 'Medium', 'Hard'].includes(diff)) {
      filteredChallenges = challenges.filter(challenge =>
        challenge.difficulty === diff);
    }

    createNormalChallenges(filteredChallenges);
  }

  /**
   * Creates and displays challenge cards
   * @param {Array} challenges - Array of challenge objects
   */
  function createNormalChallenges(challenges) {
    challenges.forEach(element => {
      const challengeCard = createChallengeCard();
      const cardElements = {
        name: createCardName(element),
        difficulty: createCardDifficulty(element),
        topic: createCardTopic(element),
        solution: createCardSolution(element),
        notes: createCardNotes(element)
      };

      challengeCard.addEventListener('click', () => {
        Object.values(cardElements).forEach(el => {
          if (el !== cardElements.name) {
            el.classList.toggle('hidden');
          }
        });
      });

      Object.values(cardElements).forEach(el => {
        challengeCard.appendChild(el);
      });

      id('challenges-container').appendChild(challengeCard);
    });
  }

  /**
   * Creates notes element for challenge card
   * @param {Object} element - Challenge object
   * @return {HTMLElement} Notes element
   */
  function createCardNotes(element) {
    const cardNotes = gen('pre');
    cardNotes.textContent = element.notes;
    cardNotes.classList.add('hidden');
    return cardNotes;
  }

  /**
   * Creates challenge card container
   * @return {HTMLElement} Challenge card container
   */
  function createChallengeCard() {
    const challengeCard = gen('div');
    challengeCard.classList.add('challenge-card');
    return challengeCard;
  }

  /**
   * Creates name element for challenge card
   * @param {Object} element - Challenge object
   * @return {HTMLElement} Name element
   */
  function createCardName(element) {
    const cardName = gen('h3');
    cardName.textContent = element.name;
    return cardName;
  }

  /**
   * Creates difficulty element for challenge card
   * @param {Object} element - Challenge object
   * @return {HTMLElement} Difficulty element
   */
  function createCardDifficulty(element) {
    const cardDifficulty = gen('p');
    cardDifficulty.textContent = "Difficulty: " + element.difficulty;
    cardDifficulty.classList.add('hidden');
    return cardDifficulty;
  }

  /**
   * Creates topic element for challenge card
   * @param {Object} element - Challenge object
   * @return {HTMLElement} Topic element
   */
  function createCardTopic(element) {
    const cardTopic = gen('p');
    cardTopic.textContent = "Topics: " + element.topic;
    cardTopic.classList.add('hidden');
    return cardTopic;
  }

  /**
   * Creates solution element for challenge card
   * @param {Object} element - Challenge object
   * @return {HTMLElement} Solution element
   */
  function createCardSolution(element) {
    const cardSolution = gen('pre');
    cardSolution.textContent = element.solution;
    cardSolution.classList.add('hidden');
    return cardSolution;
  }

  /**
   * Validates admin login credentials
   */
  async function validateLogin() {
    try {
      const input = id('admin-password').value;
      const data = {password: input};

      const response = await fetch('/validate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.isValid) {
        id('admin-login').classList.toggle('hidden');
        const addForm = id("add-challenge-form");
        addForm.classList.remove('hidden');
      } else {
        id('admin-password').value = '';
        id('admin-password').textContent = "Try again";
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  /**
   * Adds a new challenge to the server
   */
  async function addNewChallenge() {
    try {
      const challengeData = {
        name: id('challenge-name').value,
        difficulty: id('challenge-difficulty').value,
        topic: id('challenge-topic').value,
        solution: id('challenge-solution').value,
        notes: id('challenge-notes').value
      };

      const response = await fetch('/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(challengeData)
      });

      if (response.ok) {
        // Clear form fields
        ['name', 'topic', 'solution', 'notes'].forEach(field => {
          id(`challenge-${field}`).value = '';
        });
        id('challenge-difficulty').value = 'Easy';
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  /**
   * Helper function to get element by ID
   * @param {string} item - Element ID
   * @return {HTMLElement} Element with matching ID
   */
  function id(item) {
    return document.getElementById(item);
  }

  /**
   * Helper function to create new element
   * @param {string} item - Element tag name
   * @return {HTMLElement} Newly created element
   */
  function gen(item) {
    return document.createElement(item);
  }
})();