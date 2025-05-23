document.addEventListener("DOMContentLoaded", () => {
    // Set footer dynamic content
    document.getElementById("currentyear").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = `Last Modified: ${document.lastModified}`;

    // Navigation menu toggle
    const hamButton = document.getElementById("menu");
    const navigation = document.querySelector(".navbar");
    hamButton.addEventListener("click", () => {
        navigation.classList.toggle("open");
        hamButton.classList.toggle("open");
    });

    // Fetch and display members
    fetch("data/members.json")
        .then(response => response.json())
        .then(members => {
            displayMembers(members);
            displaySpotlight(members);
        });

    // Toggle grid/list view
    const toggleButton = document.getElementById("toggle-view");
    const memberList = document.getElementById("member-list");
    toggleButton.addEventListener("click", () => {
        memberList.classList.toggle("grid-view");
        memberList.classList.toggle("list-view");
        toggleButton.textContent = memberList.classList.contains("grid-view") ? "List View" : "Grid View";
    });

    // Fetch and display weather
    fetchWeather();
});

// Function to display members in directory
function displayMembers(members) {
    const memberList = document.getElementById("member-list");
    memberList.innerHTML = "";
    members.forEach(member => {
        const div = document.createElement("div");
        div.classList.add("member-card");
        div.innerHTML = `
            <h3>${member.name}</h3>
            <img src="${member.image}" alt="${member.name} logo" loading="lazy">
            <p>${member.address}</p>
            <p>Phone: ${member.phone}</p>
            <p><a href="${member.website}" target="_blank">${member.website}</a></p>
            <p>Membership Level: ${member.membership_level}</p>
            <p>${member.description}</p>
        `;
        memberList.appendChild(div);
    });
}


function getRandomMembers(memberList, count) {
    const shuffled = memberList.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

const spotlightContainer = document.getElementById("spotlight-list");
spotlightContainer.innerHTML = "";

const filteredMembers = members.filter(member => member.membership_level === "Gold" || member.membership_level === "Silver");
const selectedMembers = getRandomMembers(filteredMembers, Math.floor(Math.random() * 2) + 2);

selectedMembers.forEach(member => {
    const memberCard = document.createElement("div");
    memberCard.classList.add("spotlight-card");
    memberCard.innerHTML = `
        <img src="${member.image}" alt="${member.name}">
        <h3>${member.name}</h3>
        <p>${member.description}</p>
        <p><strong>Address:</strong> ${member.address}</p>
        <p><strong>Phone:</strong> ${member.phone}</p>
        <a href="${member.website}" target="_blank">Visit Website</a>
    `;
    spotlightContainer.appendChild(memberCard);
});


document.addEventListener("DOMContentLoaded", () => {
    const currentTemp = document.querySelector("#current-temp");
    const weatherIcon = document.querySelector("#weather-icon");
    const weatherCaption = document.querySelector("figcaption");
    const forecastList = document.querySelector("#forecast-list");

    const apiKey = "6617ad94b410255f843d41506d52b0d5";
    const lat = "5.53";
    const lon = "-0.43";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    async function fetchWeather() {
        try {
            const weatherResponse = await fetch(weatherUrl);
            if (!weatherResponse.ok) throw new Error("Failed to fetch weather data");
            const weatherData = await weatherResponse.json();
            displayCurrentWeather(weatherData);

            const forecastResponse = await fetch(forecastUrl);
            if (!forecastResponse.ok) throw new Error("Failed to fetch forecast data");
            const forecastData = await forecastResponse.json();
            displayForecast(forecastData);
        } catch (error) {
            console.error("Weather API Error:", error);
            currentTemp.textContent = "N/A";
            weatherCaption.textContent = "Weather data unavailable";
            forecastList.innerHTML = "<li>Error loading forecast</li>";
        }
    }

    function displayCurrentWeather(data) {
        currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
        
        if (data.weather && data.weather[0]) {
            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            weatherIcon.alt = data.weather[0].description;
            weatherCaption.textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
        } else {
            weatherIcon.style.display = "none"; // Hide the image if data is missing
            weatherCaption.textContent = "Weather data unavailable";
        }
    }
    

    function displayForecast(data) {
        forecastList.innerHTML = "";
        const today = new Date().getDate();
        const seenDays = new Set([today]);
        const forecasts = [];

        for (const entry of data.list) {
            const entryDate = new Date(entry.dt * 1000);
            const entryDay = entryDate.getDate();
            if (!seenDays.has(entryDay) && forecasts.length < 3) {
                forecasts.push({
                    day: entryDate.toLocaleDateString("en-US", { weekday: "long" }),
                    temp: Math.round(entry.main.temp),
                    icon: entry.weather[0].icon,
                    desc: entry.weather[0].description
                });
                seenDays.add(entryDay);
            }
            if (forecasts.length === 3) break;
        }

        forecasts.forEach(f => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${f.day}: ${f.temp}°C</span>
                <img src="https://openweathermap.org/img/wn/${f.icon}.png" alt="${f.desc}" width="30">
            `;
            forecastList.appendChild(li);
        });
    }

    fetchWeather();
});

const discoverGrid = document.getElementById("discover-grid");
    if (discoverGrid) {
        fetchDiscoverData();
    }
    const visitText = document.getElementById("visit-text");
    if (visitText) {
        displayVisitMessage();
    }
 const timestampField = document.getElementById("timestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    // Modal functionality
    const modalLinks = document.querySelectorAll(".modal-link");
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close");

    modalLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const modalId = link.getAttribute("href").substring(1);
            const modal = document.getElementById(modalId);
            if (modal) modal.style.display = "block";
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal");
            if (modal) modal.style.display = "none";
        });
    });

    window.addEventListener("click", (e) => {
        modals.forEach(modal => {
            if (e.target === modal) modal.style.display = "none";
        });
    });

// Display form data on thank you page
if (window.location.pathname.includes("thankyou.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById("display-firstname").textContent = `${urlParams.get("firstname") || "N/A"}`;
    document.getElementById("display-lastname").textContent = `${urlParams.get("lastname") || "N/A"}`;
    document.getElementById("display-email").textContent = `${urlParams.get("email") || "N/A"}`;
    document.getElementById("display-phone").textContent = `${urlParams.get("phone") || "N/A"}`;
    document.getElementById("display-businessname").textContent = `${urlParams.get("businessname") || "N/A"}`;
    document.getElementById("display-timestamp").textContent = `${urlParams.get("timestamp") || "N/A"}`;
}
  
});
// Discover 
const places = [
    {
        "title": "Kasoa Market",
        "address": "Kasoa, Central Region, Ghana",
        "description": "A bustling market with local goods and fresh produce.",
        "image": "images/j1.webp"
    },
    {
        "title": "West Hills Mall",
        "address": "Accra-Cape Coast Road, Weija",
        "description": "A modern shopping destination close to Kasoa.",
        "image": "images/j2.webp"
    },
    {
        "title": "Boti Falls",
        "address": "Eastern Region, Ghana",
        "description": "A twin waterfall attraction perfect for nature lovers.",
        "image": "images/j3.webp"
    },
    {
        "title": "Bojo Beach",
        "address": "Bortianor, Accra",
        "description": "Scenic beach with clean sands and peaceful waters.",
        "image": "images/j4.webp"
    },
    {
        "title": "Shai Hills Reserve",
        "address": "Greater Accra Region",
        "description": "A nature reserve with hiking trails and wildlife.",
        "image": "images/j5.webp"
    },
    {
        "title": "Makola Market",
        "address": "Accra, Ghana",
        "description": "One of Ghana’s largest and most vibrant markets.",
        "image": "images/j5.webp"
    },
    {
        "title": "Kakum National Park",
        "address": "Central Region, Ghana",
        "description": "Famous for its canopy walkway and rainforest tours.",
        "image": "images/j7.webp"
    },
    {
        "title": "Jamestown Lighthouse",
        "address": "Jamestown, Accra",
        "description": "A historic lighthouse with panoramic city views.",
        "image": "images/j8.webp"
    }
];

const cardsContainer = document.getElementById('cards-container');

        places.forEach(place => {
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <img src="${place.image}" alt="${place.title}">
                <div class="card-content">
                    <h3 class="card-title">${place.title}</h3>
                    <p class="card-address">${place.address}</p>
                    <p class="card-description">${place.description}</p>
                </div>
            `;

            cardsContainer.appendChild(card);
        });

