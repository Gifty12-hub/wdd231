const cardsContainer = document.getElementById("cards");
const filterButtons = document.querySelectorAll("nav button");

let prophets = [];

async function fetchProphets() {
    try {
        const response = await fetch("https://brotherblazzard.github.io/canvas-content/latter-day-prophets.json");
        const data = await response.json();
        prophets = data.prophets;
        displayProphets(prophets);
    } catch (error) {
        console.error("Error fetching prophet data:", error);
    }
}

function displayProphets(filteredProphets) {
    cardsContainer.innerHTML = ""; // Clear previous content

    filteredProphets.forEach((prophet, index) => {
        const card = document.createElement("section");
        const name = document.createElement("h2");
        const birth = document.createElement("p");
        const children = document.createElement("p");
        const tenure = document.createElement("p");
        const age = document.createElement("p");
        const image = document.createElement("img");

        name.textContent = `${prophet.name} ${prophet.lastname}`;
        birth.textContent = `Born: ${prophet.birthplace}, ${prophet.birthdate}`;
        children.textContent = `Children: ${prophet.numofchildren}`;
        tenure.textContent = `Presidency: ${prophet.length} years`;

        image.src = prophet.imageurl;
        image.alt = `Portrait of ${prophet.name} ${prophet.lastname}`;
        image.loading = "lazy";
        image.width = 200;
        image.height = 250;

        card.appendChild(name);
        card.appendChild(birth);
        card.appendChild(children);
        card.appendChild(tenure);
        card.appendChild(age);
        card.appendChild(image);
        cardsContainer.appendChild(card);
    });
}

function filterProphets(criteria) {
    let filtered = prophets;
    const usStates = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
        "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
        "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
        "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
        "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
        "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
        "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ];

    switch (criteria) {
        case "idaho":
            filtered = prophets.filter(p => p.birthplace.includes("Utah"));
            break;
        case "nonus":
            filtered = prophets.filter(p => {
                let birthLocation = p.birthplace.split(", ").pop();
                return !usStates.includes(birthLocation);
            });
            break;
        case "old":
            filtered = prophets.filter(p => {
                let birthYear = parseInt(p.birthdate.split("-")[0]);
                let deathYear = parseInt(p.death) || new Date().getFullYear();
                return (deathYear - birthYear) >= 95;
            });
            break;
        case "childl":
            filtered = prophets.filter(p => parseInt(p.numofchildren) >= 10);
            break;
        case "ten":
            filtered = prophets.filter(p => parseInt(p.length) >= 15);
            break;
        default:
            filtered = prophets;
    }
    displayProphets(filtered);
}

// Event listeners for filter buttons
filterButtons.forEach(button => {
    button.addEventListener("click", function () {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        filterProphets(this.id);
    });
});

// Load prophets on page load
fetchProphets();
