// Global navigation
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

// Active page indicators
const navLinks = document.querySelectorAll(".navigation a");
const currentPage = window.location.pathname.split("/").pop();

navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
    }
});

// Footer last modified
const yearSpan = document.querySelector("#currentYear");
const lastModified = document.querySelector("#lastModified");

if (yearSpan) yearSpan.textContent = new Date().getFullYear();
if (lastModified) lastModified.textContent = `Last Modified: ${document.lastModified}`;

// Timestamp for forms
const timestampField = document.querySelector("#timestamp");

if (timestampField) {
    timestampField.value = new Date().toISOString();
}

// Modals for join page
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

// Results for thank you/sorry pages
const params = new URLSearchParams(window.location.search);

if (document.querySelector('#results')) {
    document.querySelector('#results').innerHTML = `
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

// Order page 
import { menu as order } from "../data/order.mjs";

const container = document.querySelector(".order-grid");

if (container && order) {
    container.innerHTML = '';  // Clear existing hardcoded cards to avoid duplication
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

// Visit message 
const messageBox = document.querySelector("#visit-message");
const lastVisit = localStorage.getItem("lastVisit");
const now = Date.now();

if (messageBox) {
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
}
//weather and Api
const tempSpan = document.querySelector("#temperature");
const descSpan = document.querySelector("#conditions");
const windSpan = document.querySelector("#wind-speed");
const chillSpan = document.querySelector("#wind-chill");
const forecastContainer = document.querySelector("#forecast-container");

async function getWeather() {
    if (!tempSpan || !descSpan) return;

    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch weather");

        const data = await response.json();

        const current = data.list[0];

        tempSpan.textContent = `${Math.round(current.main.temp)}°C`;
        descSpan.textContent = current.weather[0].description;

        if (windSpan) {
            windSpan.textContent = `${current.wind.speed} m/s`;
        }

        if (chillSpan) {
            chillSpan.textContent = "N/A";
        }

        if (iconImg) {
            const icon = current.weather[0].icon;
            iconImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            iconImg.alt = current.weather[0].description;
        }

        // 3-Day Forecast
        if (forecastContainer) {
            forecastContainer.innerHTML = "";

            const forecast = data.list.filter(item =>
                item.dt_txt.includes("12:00:00")
            ).slice(0, 3);

            forecast.forEach(day => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <p><strong>${new Date(day.dt_txt).toLocaleDateString()}</strong></p>
                    <p>${Math.round(day.main.temp)}°C</p>
                `;
                forecastContainer.appendChild(div);
            });
        }

    } catch (error) {
        console.error("Weather error:", error);
    }
}




getWeather();