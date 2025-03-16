let myJson = [
  {
    "title": "Test Project A",
    "imageWebp": "images/testA.webp",
    "image": "images/testA.jpg",
    "imageAlt": "Screenshot of Project A",
    "description": "Description of Project A.",
    "link": "https://example.com/projectA"
  },
  {
    "title": "Test Project B",
    "imageWebp": "images/testB.webp",
    "image": "images/testB.jpg",
    "imageAlt": "Screenshot of Project B",
    "description": "Description of Project B.",
    "link": "https://example.com/projectB"
  },
  {
    "title": "Test Project C",
    "imageWebp": "images/testC.webp",
    "image": "images/testC.jpg",
    "imageAlt": "Screenshot of Project C",
    "description": "Description of Project C.",
    "link": "https://example.com/projectC"
  },
  {
    "title": "Test Project D",
    "imageWebp": "images/testD.webp",
    "image": "images/testD.jpg",
    "imageAlt": "Screenshot of Project D",
    "description": "Description of Project D.",
    "link": "https://example.com/projectD"
  }
];

class ProjectCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.render();
    }

    set data(value) {
      this._data = value;
      this.render();
    }

    render() {
      if (!this._data) {
        return;
      }
    
      this.shadowRoot.innerHTML = `
        <style>
          .card {
            background: var(--card-bg, #fff);
            border: 1px solid var(--card-border, #ccc);
            padding: var(--card-padding, 1rem);
            margin: var(--card-margin, 1rem);
            box-shadow: var(--card-shadow, 0 2px 5px rgba(0, 0, 0, 0.1));
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          h2 {
            margin-top: 0;
          }
          picture, img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
          }
          p {
            text-align: center;
          }
          a {
            text-decoration: none;
            color: blue;
            margin-top: auto;
          }
        </style>
        <div class="card">
          <h2>${this._data.title}</h2>
          <picture>
            <source srcset="${this._data.imageWebp}" type="image/webp">
            <img src="${this._data.image}" alt="${this._data.imageAlt}">
          </picture>
          <p>${this._data.description}</p>
          <a href="${this._data.link}" target="_blank">Learn More</a>
        </div>
      `;
    }    
}

customElements.define('project-card', ProjectCard);

function populateCards(projects) {
  console.log("Populating this array into cards: " + projects);
  const cardContainer = document.getElementById('cardContainer');
  cardContainer.innerHTML = ''; // Clear existing cards before adding new ones

  projects.forEach(project => {
    const card = document.createElement('project-card'); // Create a new custom element
    card.data = project; // Assign the project data to the card
    cardContainer.appendChild(card); // Append to the container
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // Fetch and store data if localStorage is empty
  let storedData = JSON.parse(localStorage.getItem('projectCards'));
  if (!storedData || storedData.length === 0) {
    console.log("No local data found. Storing predefined JSON...");
    storedData = await fetchAndStoreProjects();
  } else {
    console.log("Loading projects from localStorage...");
  }
});

/**
 * Stores the predefined JSON (myJson) into localStorage.
 */
async function fetchAndStoreProjects() {
  try {
    localStorage.setItem('projectCards', JSON.stringify(myJson)); // Store predefined JSON
    return myJson; // Return JSON data for immediate use
  } catch (error) {
    console.error('Error storing projects:', error);
    return []; // Return empty array in case of an error
  }
}

/**
 * Loads stored card data from localStorage and populates the page.
 */
function localLoad() {
  const projects = JSON.parse(localStorage.getItem('projectCards')) || [];
  populateCards(projects);
}

/**
 * Fetches JSON from jsonbin.io and stores it in localStorage.
 */
async function fetchFromRemote() {
  try {
    const response = await fetch('https://api.jsonbin.io/v3/b/67d75b498561e97a50ed54cf', {
      headers: {
        'X-Master-Key': '$2a$10$MUqNlOE13dzEBWye536KxuajffQb1/ZCHzawrRqrd2kFEItBsJCIy'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json(); // Convert response to JSON
    const data = result.record; // jsonbin.io stores it inside 'record'
    return data; // Return fetched data
  } catch (error) {
    console.error('Error fetching remote JSON:', error);
    return []; // Return empty array in case of an error
  }
}

async function remoteLoad() {
  try {
    const data = await fetchFromRemote(); // Wait for the remote JSON data
    console.log("Fetched remote data:", data);

    if (data.length > 0) {
      populateCards(data); // Populate UI with fetched data
    } else {
      console.warn("No data found in remote JSON.");
    }
  } catch (error) {
    console.error("Error in remoteLoad:", error);
  }
}
