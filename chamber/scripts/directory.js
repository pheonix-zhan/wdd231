const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");
const menuButton = document.querySelector("#menuButton");
const navigation = document.querySelector(".navigation");

// ---------- Fetch Members ----------
async function getMembers() {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) throw new Error("Failed to load member data");
        const data = await response.json();
        displayMembers(data);
    } catch (error) {
        console.error("Error loading members:", error);
        membersContainer.innerHTML = "<p>Sorry, we couldn't load the member directory. Please try again later.</p>";
    }
}

// ---------- Display Members ----------
function displayMembers(members) {
    membersContainer.innerHTML = "";

    members.forEach(member => {
        const card = document.createElement("section");
        card.classList.add("member-card");

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} - ${member.description}">
            <h3>${member.name}</h3>
            <p>${member.description}</p>
            <p><strong>Address:</strong> ${member.address}</p>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
        `;

        membersContainer.appendChild(card);
    });
}

// ---------- Grid / List Toggle ----------
gridButton.addEventListener("click", () => {
    membersContainer.classList.add("grid");
    membersContainer.classList.remove("list");
});

listButton.addEventListener("click", () => {
    membersContainer.classList.add("list");
    membersContainer.classList.remove("grid");
});

// ---------- Hamburger Menu Toggle ----------
menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", !isExpanded);
    navigation.classList.toggle("active");
});

// ---------- Footer Dates ----------
document.querySelector("#currentYear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = `Last Modified: ${document.lastModified}`;

// ---------- Run ----------
getMembers();