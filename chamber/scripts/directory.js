// ==================================================
// GLOBAL NAV
// ==================================================
const menuButton = document.querySelector("#menuButton");
const navigation = document.querySelector(".navigation");

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
        menuButton.setAttribute("aria-expanded", !isExpanded);
        navigation.classList.toggle("active");
    });
}

// ==================================================
// ACTIVE PAGE INDICATOR
// ==================================================
const navLinks = document.querySelectorAll(".navigation a");
const currentPage = window.location.pathname.split("/").pop();

navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("current");
        link.setAttribute("aria-current", "page");
    }
});

// ==================================================
// FOOTER DATES
// ==================================================
const yearSpan = document.querySelector("#currentYear");
const lastModified = document.querySelector("#lastModified");

if (yearSpan) yearSpan.textContent = new Date().getFullYear();
if (lastModified) lastModified.textContent = `Last Modified: ${document.lastModified}`;

// ==================================================
// MEMBERS / SPOTLIGHT VARIABLES
// ==================================================
const membersContainer = document.querySelector("#members"); // Directory page
const spotlightContainer = document.querySelector("#spotlight-container"); // Home page
const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");

// ==================================================
// HELPER: MAP NUMBER TO MEMBERSHIP STRING
// ==================================================
function getMembershipLevel(num) {
    switch(num) {
        case 3: return "Gold";
        case 2: return "Silver";
        case 1: return "Bronze";
        default: return "Member";
    }
}

// ==================================================
// FETCH MEMBERS
// ==================================================
async function getMembers() {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) throw new Error("Failed to load member data");

        const data = await response.json();

        // Display Directory if container exists
        if (membersContainer) displayMembers(data);

        // Display Home page spotlights if container exists
        if (spotlightContainer) loadSpotlights(data);

    } catch (error) {
        console.error("Error loading members:", error);
        if (membersContainer) membersContainer.innerHTML = "<p>Unable to load member directory.</p>";
        if (spotlightContainer) spotlightContainer.innerHTML = "<p>Unable to load member spotlights.</p>";
    }
}

// ==================================================
// DIRECTORY PAGE: DISPLAY MEMBERS
// ==================================================
function displayMembers(members) {
    if (!membersContainer) return;

    membersContainer.innerHTML = "";

    members.forEach(member => {
        const card = document.createElement("section");
        card.classList.add("member-card");

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name}">
            <h3>${member.name}</h3>
            <p>${member.description}</p>
            <p><strong>Address:</strong> ${member.address}</p>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
            <p class="membership">${getMembershipLevel(member.membership)} Member</p>
        `;

        membersContainer.appendChild(card);
    });
}

// ==================================================
// DIRECTORY GRID/LIST TOGGLE
// ==================================================
if (membersContainer && gridButton && listButton) {
    gridButton.addEventListener("click", () => {
        membersContainer.classList.add("grid");
        membersContainer.classList.remove("list");
    });

    listButton.addEventListener("click", () => {
        membersContainer.classList.add("list");
        membersContainer.classList.remove("grid");
    });
}

// ==================================================
// HOME PAGE: SPOTLIGHTS
// ==================================================
function loadSpotlights(members) {
    if (!spotlightContainer) return;

    // Only Gold (3) or Silver (2)
    const qualified = members.filter(m => m.membership === 3 || m.membership === 2);

    // Randomize and pick 2–3 members
    const shuffled = qualified.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    spotlightContainer.innerHTML = "";

    selected.forEach(member => {
        const card = document.createElement("section");
        card.classList.add("spotlight-card");

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} logo">
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <a href="${member.website}" target="_blank">Visit Website</a>
            <p class="membership">${getMembershipLevel(member.membership)} Member</p>
        `;

        spotlightContainer.appendChild(card);
    });
}

// ==================================================
// HOME / DIRECTORY WEATHER (OpenWeatherMap)
// ==================================================
const tempSpan = document.querySelector("#current-temp");
const descSpan = document.querySelector("#weather-desc");
const iconImg = document.querySelector("#weather-icon");
const forecastTemps = document.querySelectorAll(".forecast-temp");

// Replace with your OpenWeatherMap API key
const apiKey = "YOUR_API_KEY";
const lat = 0.3476;   // Kampala
const lon = 32.5825;

async function getWeather() {
    if (!tempSpan || !descSpan) return;

    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch weather");

        const data = await response.json();
        const current = data.list[0];

        tempSpan.textContent = Math.round(current.main.temp);
        descSpan.textContent = current.weather[0].description;

        if (iconImg) {
            const icon = current.weather[0].icon;
            iconImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            iconImg.alt = current.weather[0].description;
        }

        // Fill 3-day forecast
        const forecast = data.list.filter(item => item.dt_txt.includes("12:00:00"));
        forecastTemps.forEach((span, index) => {
            if (forecast[index]) span.textContent = Math.round(forecast[index].main.temp);
        });

    } catch (error) {
        console.error("Weather error:", error);
    }
}
// ==================================================
// FORM TIMESTAMP (APPLICATION FORM)
// ==================================================
const timestampField = document.querySelector("#timestamp");

if (timestampField) {
    timestampField.value = new Date().toISOString();
}

// ==================================================
// MEMBERSHIP LEVEL MODALS (FORM PAGE)
// ==================================================
const modalButtons = document.querySelectorAll("[data-modal]");
const modals = document.querySelectorAll(".modal");
const closeModalButtons = document.querySelectorAll(".close");

modalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modalId = button.dataset.modal;
        const modal = document.getElementById(modalId);

        if (modal) {
            modal.style.display = "block";
            modal.querySelector(".close").focus();
        }
    });
});

closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        button.closest(".modal").style.display = "none";
    });
});

// Close modal when clicking outside content
window.addEventListener("click", event => {
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

// Close modal with ESC key (accessibility)
window.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        modals.forEach(modal => modal.style.display = "none");
    }
});

// The thank you page params
const params = new URLSearchParams(window.location.search);

document.querySelector('#results').innerHTML = `
  <p><strong>First Name:</strong> ${params.get('first')}</p>
  <p><strong>Last Name:</strong> ${params.get('last')}</p>
  <p><strong>Email:</strong> ${params.get('email')}</p>
  <p><strong>Phone:</strong> ${params.get('phone')}</p>
  <p><strong>Organization:</strong> ${params.get('organization')}</p>
  <p><strong>Date Submitted:</strong> ${params.get('timestamp')}</p>
`;

import { places } from "../data/places.mjs";

const container = document.querySelector("#discover-cards");

places.forEach((place, index) => {
  const card = document.createElement("section");
  card.classList.add("card");
  card.style.gridArea = `card${index + 1}`;

  card.innerHTML = `
    <h2>${place.name}</h2>
    <figure>
      <img src="${place.image}" alt="${place.name}" loading="lazy">
    </figure>
    <address>${place.address}</address>
    <p>${place.description}</p>
    <button>Learn More</button>
  `;

  container.appendChild(card);
});


const messageBox = document.querySelector("#visit-message");
const lastVisit = localStorage.getItem("lastVisit");
const now = Date.now();

if (!lastVisit) {
  messageBox.textContent = "Welcome! Let us know if you have any questions.";
} else {
  const diff = now - lastVisit;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days < 1) {
    messageBox.textContent = "Back so soon! Awesome!";
  } else if (days === 1) {
    messageBox.textContent = "You last visited 1 day ago.";
  } else {
    messageBox.textContent = `You last visited ${days} days ago.`;
  }
}

localStorage.setItem("lastVisit", now);


// ==================================================
// RUN
// ==================================================
getMembers();
getWeather();
