// global navigation
try {
    const menuButton = document.querySelector("#menuButton");
    const navMenu = document.querySelector(".navigation");

    if (menuButton && navMenu) {
        menuButton.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            menuButton.setAttribute(
                "aria-expanded",
                navMenu.classList.contains("active")
            );
        });
    }

    const navLinks = document.querySelectorAll(".navigation a");
    const currentPage = window.location.pathname.split("/").pop();
    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
} catch (err) {
    console.error("Navigation error:", err);
}

// footer dates
const yearSpan = document.querySelector("#currentYear");
const lastModified = document.querySelector("#lastModified");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();
if (lastModified) lastModified.textContent = `Last Modified: ${document.lastModified}`;

// form timestamps
const timestampField = document.querySelector("#timestamp");
if (timestampField) {
    timestampField.value = new Date().toISOString();
}

// modals join page
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

// Close modal when clicking outside
window.addEventListener("click", event => {
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

// Close modal with ESC
window.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        modals.forEach(modal => modal.style.display = "none");
    }
});

// thank you and sorry page
const params = new URLSearchParams(window.location.search);
const resultsEl = document.querySelector('#results');
if (resultsEl) {
    resultsEl.innerHTML = `
        <p><strong>First Name:</strong> ${params.get('first')}</p>
        <p><strong>Last Name:</strong> ${params.get('last')}</p>
        <p><strong>Email:</strong> ${params.get('email')}</p>
        <p><strong>Phone:</strong> ${params.get('phone')}</p>
        <p><strong>Date Submitted:</strong> ${params.get('timestamp')}</p>
        ${params.get('middle') ? `<p><strong>Middle Name:</strong> ${params.get('middle')}</p>` : ''}
        ${params.get('description') ? `<p><strong>Complaint:</strong> ${params.get('description')}</p>` : ''}
        ${params.get('subscription') ? `<p><strong>Subscription:</strong> ${params.get('subscription')}</p>` : ''}
    `;
}

// order page
import { menu as order } from "../data/order.mjs";

const container = document.querySelector(".order-grid");
if (container && order) {
    container.innerHTML = '';  // Remove hardcoded cards
    order.forEach(item => {
        const card = document.createElement("section");
        card.classList.add("card");
        card.innerHTML = `
            <h2>${item.readers_brew}</h2>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Reader's Roast:</strong> ${item.readers_roast}</p>
            <a href="order-received.html" class="order-btn">Order</a>
        `;
        container.appendChild(card);
    });
}

// visit message
const messageBox = document.querySelector("#visit-message");
const lastVisit = localStorage.getItem("lastVisit");
const now = Date.now();
if (messageBox) {
    if (!lastVisit) {
        messageBox.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const diff = now - lastVisit;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        messageBox.textContent = days < 1
            ? "Back so soon! Awesome!"
            : days === 1
                ? "You last visited 1 day ago."
                : `You last visited ${days} days ago.`;
    }
    localStorage.setItem("lastVisit", now);
}

// weather section
const town = document.querySelector('#town');
const tempSpan = document.querySelector("#temperature");
const descSpan = document.querySelector("#description");
// const forecastContainer = document.querySelector("#forecast-container");
const iconImg = document.querySelector("#weather-icon");

//constants for lat and long
    const lat = 0.31576743048823946; // mutungo ring road
    const lon = 32.646239236943075;
    const apiKey = "90371d4b322a8c670b4954ddcdf72c86";

    const url = `//api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
// grab current weather
    async function apiFetch() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // testing only
      displayResults(data); // uncomment when ready
    } else {
        throw Error(await response.text());
    }
  } catch (error) {
      console.log(error);
  }
}

function displayResults(data){
    console.log('weather')
    town.innerHTML = data.name
    descSpan.innerHTML = data.weather[0].description
    tempSpan.innerHTML = `${data.main.temp} &deg;F`
    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    iconImg.setAttribute('SRC', iconsrc)
    iconImg.setAttribute('alt', data.weather[0].description )



}

apiFetch();


