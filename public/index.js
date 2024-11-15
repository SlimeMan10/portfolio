// index.js
"use strict";
(function() {
  window.addEventListener('load', init);

  /**
   * Initializes the page by setting up event listeners
   */
  function init() {
    // Check if elements exist before adding listeners
    const showAdminBtn = id('show-admin');
    if (showAdminBtn) {
      showAdminBtn.addEventListener('click', function() {
        const adminLogin = id("admin-login");
        if (adminLogin) {
          adminLogin.classList.toggle('hidden');
          const loginBtn = id('login-btn');
          if (loginBtn) {
            loginBtn.addEventListener('click', validateLogin);
          }
        }
      });
    }
    const addChallenge = id('add-challenge');
    if (addChallenge) {
      addChallenge.addEventListener('click', addNewChallenge);
    }
    const showChallenges = id('show-challenges');
    if (showChallenges) {
      showChallenges.addEventListener('click', loadChallenges);
    }
    buttonEvents();
  }

  /**
   * Sets up button events for all card links
   */
  function buttonEvents() {
    openPage('resume', 'https://tinyurl.com/nzpwnmw6');
    openPage('java-card', 'https://tinyurl.com/4ma4b4ex');
    openPage('html-card', 'https://tinyurl.com/2cdttxtx');
    openPage('css-card', 'https://tinyurl.com/2suk2e2v');
    openPage('javascript-card', 'https://tinyurl.com/29rjtyrm');
    openPage('sql-card', 'https://tinyurl.com/2mkkfkm5');
    openPage('node-card', 'https://tinyurl.com/mryd2jj6');
  }

  /**
   * Adds click event listener to open link in new tab
   * @param {string} itemId - The ID of the element to attach listener to
   * @param {string} link - The URL to open
   */
  function openPage(itemId, link) {
    const element = id(itemId);
    if (element) {
      element.addEventListener('click', function() {
        window.open(link, '_blank');
      });
    }
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
      filteredChallenges = challenges.filter(challenge => {
        const challengeName = challenge.name.toLowerCase();
        const searchTerm = search.toLowerCase();
        return challengeName.includes(searchTerm);
      });
    } else if (['Easy', 'Medium', 'Hard'].includes(diff)) {
      filteredChallenges = challenges.filter(challenge => challenge.difficulty === diff);
    }
    createNormalChallenges(filteredChallenges);
  }

  /**
   * Creates and displays challenge cards
   * @param {Array} challenges - Array of challenge objects
   */
  function createNormalChallenges(challenges) {
    challenges.forEach(element => {
      const challengeCard = gen('div');
      challengeCard.classList.add('challenge-card');
      const header = gen('div');
      header.classList.add('challenge-header');
      const name = createCardName(element);
      header.appendChild(name);
      const content = gen('div');
      content.classList.add('challenge-content');
      content.classList.add('hidden');
      const difficulty = createCardDifficulty(element);
      const topic = createCardTopic(element);
      const solution = createCardSolution(element);
      const notes = createCardNotes(element);
      content.appendChild(difficulty);
      content.appendChild(topic);
      content.appendChild(solution);
      content.appendChild(notes);
      header.addEventListener('click', () => {
        content.classList.toggle('hidden');
        challengeCard.classList.toggle('expanded');
      });
      challengeCard.appendChild(header);
      challengeCard.appendChild(content);
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
    cardNotes.classList.add('challenge-notes');
    return cardNotes;
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
    cardDifficulty.classList.add('challenge-difficulty');
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
    cardTopic.classList.add('challenge-topic');
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
    cardSolution.classList.add('challenge-solution');
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