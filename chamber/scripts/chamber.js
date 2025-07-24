// footer //
const currentYear = new Date().getFullYear();
const yearElem = document.getElementById("currentyear");
if (yearElem) yearElem.innerHTML = currentYear;

const lastModified = document.lastModified;
const modifiedElem = document.getElementById("lastModified");
if (modifiedElem) modifiedElem.innerHTML = "Last Modified: " + lastModified;

// header //
const mainnav = document.querySelector('.navbar');
const hambutton = document.querySelector('#menu');

if (mainnav && hambutton) {
    hambutton.addEventListener('click', () => {
        mainnav.classList.toggle('open');
        hambutton.classList.toggle('open');
    });
}

// homppage //
// Weather Section
const apiKey = "a499842758ba240c50082f2826a47dfb"; // <-- Replace with your OpenWeatherMap API key
const city = "Kasoa,GH";

async function getWeather() {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        // Current weather
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();
        document.getElementById('weather-info').innerHTML = `
            <p><strong>${weatherData.weather[0].description}</strong></p>
            <p>Temperature: ${Math.round(weatherData.main.temp)}°C</p>
        `;

        // 3-day forecast (every 24h at 12:00)
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();
        const forecastList = forecastData.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);
        document.getElementById('forecast').innerHTML = `
            <h3>3-Day Forecast</h3>
            <ul>
                ${forecastList.map(item => `
                    <li>
                        ${new Date(item.dt_txt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}: 
                        ${Math.round(item.main.temp)}°C, ${item.weather[0].description}
                    </li>
                `).join('')}
            </ul>
        `;
    } catch (e) {
        document.getElementById('weather-info').innerHTML = "<p>Weather unavailable.</p>";
        document.getElementById('forecast').innerHTML = "";
    }
}
getWeather();

async function fetchMembers() {
    const response = await fetch('data/members.json');
    return await response.json();
}

function getMembershipLevel(level) {
    switch(level) {
        case 3: return 'Gold';
        case 2: return 'Silver';
        default: return 'Member';
    }
}

function getRandomSpotlights(members, count = 2) {
    // Filter gold and silver
    const eligible = members.filter(m => m.membership === 2 || m.membership === 3);
    // Shuffle and pick
    for (let i = eligible.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
    }
    return eligible.slice(0, count);
}

async function renderSpotlights() {
    const members = await fetchMembers();
    const spotlights = getRandomSpotlights(members, 3);
    document.getElementById('spotlight-cards').innerHTML = spotlights.map(member => `
        <div class="spotlight-card">
            <img src="images/${member.image}" alt="${member.name} logo">
            <h3>${member.name}</h3>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <p><strong>Address:</strong> ${member.address}</p>
            <p><a href="${member.website}" target="_blank">${member.website}</a></p>
            <p><strong>Level:</strong> ${getMembershipLevel(member.membership)}</p>
        </div>
    `).join('');
}
renderSpotlights();

// directory //

async function fetchMembers() {
  try {
    const response = await fetch('./data/members.json');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (e) {
    console.error('Fetch error:', e);
    return [];
  }
}

function getMembershipLevel(level) {
  switch(level) {
    case 3: return 'Gold';
    case 2: return 'Silver';
    default: return 'Member';
  }
}

function renderMembers(members, view = 'grid') {
  const container = document.getElementById('members-container');
  container.className = view;
  container.innerHTML = members.map(member => `
    <div class="member-card">
      ${view === 'grid' ? `<img src="images/${member.image}" alt="${member.name} logo">` : ''}
      <h3>${member.name}</h3>
      <p><strong>Address:</strong> ${member.address}</p>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
      <p><strong>Level:</strong> ${getMembershipLevel(member.membership)}</p>
      <p>${member.info}</p>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  let membersData = [];
  document.getElementById('grid-view').addEventListener('click', async () => {
    if (membersData.length === 0) {
      membersData = await fetchMembers();
    }
    renderMembers(membersData, 'grid');
    document.getElementById('grid-view').classList.add('active');
    document.getElementById('list-view').classList.remove('active');
  });

  document.getElementById('list-view').addEventListener('click', async () => {
    if (membersData.length === 0) {
      membersData = await fetchMembers();
    }
    renderMembers(membersData, 'list');
    document.getElementById('list-view').classList.add('active');
    document.getElementById('grid-view').classList.remove('active');
  });
});

// Join //

document.addEventListener('DOMContentLoaded', () => {
    // Set timestamp
    const ts = document.getElementById('timestamp');
    if (ts) ts.value = new Date().toISOString();

    // Modal logic
    document.querySelectorAll('.modal-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = document.querySelector(this.getAttribute('href'));
            if (modal) modal.style.display = 'flex';
            modal.querySelector('.close').focus();
        });
    });
    document.querySelectorAll('.modal .close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                this.closest('.modal').style.display = 'none';
            }
        });
    });
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});

// thank you //
 // Parse URL parameters and display required fields
    const params = new URLSearchParams(window.location.search);
    document.getElementById('cf-firstname').textContent = params.get('firstname') || '';
    document.getElementById('cf-lastname').textContent = params.get('lastname') || '';
    document.getElementById('cf-email').textContent = params.get('email') || '';
    document.getElementById('cf-phone').textContent = params.get('phone') || '';
    document.getElementById('cf-organization').textContent = params.get('organization') || '';
    document.getElementById('cf-timestamp').textContent = params.get('timestamp') 
        ? new Date(params.get('timestamp')).toLocaleString() : '';