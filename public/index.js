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
      const search = id('search-challenges').value;
      const diff = id('filter-difficulty').value;
      let response;
      if (search) {
        let name = "?name=" + search;
        response = await fetchChallenges(name);
      } else if (diff) {
        let difficulty = "?difficulty=" + diff;
        response = await fetchChallenges(difficulty);
      } else {
        response = await fetchChallenges("");
      }
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
   * Fetches challenges from the server based on filter type
   * @param {string} type - Query parameter for filtering challenges
   * @returns {Promise<Response>} The fetch response
   */
  async function fetchChallenges(type) {
    const response = await fetch("/retrieveChallenge" + type, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  }

  /**
   * Displays filtered challenges based on search and difficulty
   * @param {Array} challenges - Array of challenge objects
   */
  function displayChallenges(challenges) {
    id('challenges-container').innerHTML = '';
    createChallenges(challenges);
  }

  /**
   * Creates and displays challenge cards
   * @param {Array} challenges - Array of challenge objects
   */
  function createChallenges(challenges) {
    const challengesArray = Array.isArray(challenges) ? challenges : [challenges];
    challengesArray.forEach(element => {
      const challengeCard = createChallengeCard();
      const header = createHeader(element);
      const content = createContent();
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
   * Creates a new challenge card container
   * @return {HTMLElement} The challenge card container element
   */
  function createChallengeCard() {
    const challengeCard = gen('div');
    challengeCard.classList.add('challenge-card');
    return challengeCard;
  }

  /**
   * Creates the header section of a challenge card
   * @param {Object} element - Challenge data object
   * @return {HTMLElement} The header element
   */
  function createHeader(element) {
    const header = gen('div');
    header.classList.add('challenge-header');
    const name = createCardName(element);
    header.appendChild(name);
    return header;
  }

  /**
   * Creates the content section of a challenge card
   * @return {HTMLElement} The content container element
   */
  function createContent() {
    const content = gen('div');
    content.classList.add('challenge-content');
    content.classList.add('hidden');
    return content;
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
        id('challenge-content').classList.toggle('hidden');
        id('admin-password').value = '';
        id('admin-login').classList.toggle('hidden');
      } else {
        id('admin-password').value = '';
        id('admin-password').placeholder = "Try again";
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