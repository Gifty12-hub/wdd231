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

// Helper: get random items from array
function getRandomItems(arr, n) {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

// Featured Innovations
const featuredContainer = document.getElementById('featured-container');
async function loadFeaturedInnovations() {
    try {
        // Make sure your file name matches your data file!
        const response = await fetch('data/innovation.json');
        if (!response.ok) throw new Error('Failed to load data');
        const data = await response.json();

        const featured = getRandomItems(data, 4);
        featuredContainer.innerHTML = '';
        featured.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>${item.description.substring(0, 80)}...</p>
                    <a href="innovations.html" class="btn">Learn More</a>
                </div>
            `;
            featuredContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching featured innovations:', error);
        if (featuredContainer)
            featuredContainer.innerHTML = `<p>Unable to load featured innovations at this time.</p>`;
    }
}
if (featuredContainer) loadFeaturedInnovations();

// Main Innovations Section
const innovationsContainer = document.querySelector('#innovationsContainer');
const countryFilter = document.querySelector('#countryFilter');
const typeFilter = document.querySelector('#typeFilter');
const modal = document.querySelector('#innovationModal');
const modalDetails = document.querySelector('#modalDetails');
const closeBtn = document.querySelector('.close-btn');
const yearSpan = document.querySelector('#year');
const menuToggle = document.querySelector('#menu-toggle');
const navLinks = document.querySelector('#nav-links');

if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// Mobile menu
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
}

let innovationsData = [];
let likedInnovations = JSON.parse(localStorage.getItem('likedInnovations')) || [];

// Fetch and display all innovations
async function loadInnovations() {
    if (!innovationsContainer) return;
    try {
        const res = await fetch('data/innovation.json');
        if (!res.ok) throw new Error('Failed to fetch data');
        innovationsData = await res.json();

        populateFilters();
        displayInnovations(innovationsData);
    } catch (error) {
        console.error(error);
        innovationsContainer.innerHTML = '<p>Error loading innovations.</p>';
    }
}

// Populate filter dropdowns
function populateFilters() {
    if (!countryFilter || !typeFilter) return;
    countryFilter.innerHTML = '<option value="all">All Countries</option>';
    typeFilter.innerHTML = '<option value="all">All Types</option>';

    const countries = [...new Set(innovationsData.map(item => item.country))];
    const types = [...new Set(innovationsData.map(item => item.type))];

    countries.forEach(country => {
        const opt = document.createElement('option');
        opt.value = country;
        opt.textContent = country;
        countryFilter.appendChild(opt);
    });

    types.forEach(type => {
        const opt = document.createElement('option');
        opt.value = type;
        opt.textContent = type;
        typeFilter.appendChild(opt);
    });
}

// Display innovations as cards
function displayInnovations(list) {
    if (!innovationsContainer) return;
    innovationsContainer.innerHTML = '';
    list.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="card-content">
                <h3>${item.name}</h3>
                <p>${item.description.substring(0, 80)}...</p>
                <button class="btn" data-id="${item.id}">View Details</button>
                <button class="like-btn ${likedInnovations.includes(item.id) ? 'liked' : ''}" data-id="${item.id}">
                    ${likedInnovations.includes(item.id) ? 'Unlike' : 'Like'}
                </button>
            </div>
        `;
        innovationsContainer.appendChild(card);
    });
}


// Filter event listeners
if (countryFilter) countryFilter.addEventListener('change', applyFilters);
if (typeFilter) typeFilter.addEventListener('change', applyFilters);

function applyFilters() {
    if (!countryFilter || !typeFilter) return;
    const countryVal = countryFilter.value;
    const typeVal = typeFilter.value;

    let filtered = innovationsData;
    if (countryVal !== 'all') {
        filtered = filtered.filter(item => item.country === countryVal);
    }
    if (typeVal !== 'all') {
        filtered = filtered.filter(item => item.type === typeVal);
    }

    displayInnovations(filtered);
}

// Handle modal open/close
if (innovationsContainer) {
    innovationsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn') && e.target.dataset.id) {
            const id = parseInt(e.target.dataset.id);
            const item = innovationsData.find(i => i.id === id);
            openModal(item);
        }

        if (e.target.classList.contains('like-btn')) {
            const id = parseInt(e.target.dataset.id);
            toggleLike(id);
            applyFilters();
        }
    });
}

function openModal(item) {
    if (!modal || !modalDetails) return;
    modalDetails.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h2>${item.name}</h2>
        <p><strong>Inventor:</strong> ${item.inventor}</p>
        <p><strong>Country:</strong> ${item.country}</p>
        <p><strong>Year:</strong> ${item.year}</p>
        <p><strong>Type:</strong> ${item.type}</p>
        <p>${item.description}</p>
        <p><strong>Impact:</strong> ${item.impact}</p>
        ${item.video ? `<iframe width="100%" height="315" src="${item.video}" frameborder="0" allowfullscreen></iframe>` : ''}
    `;
    modal.style.display = 'block';
}

if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// Like button logic
function toggleLike(id) {
    if (likedInnovations.includes(id)) {
        likedInnovations = likedInnovations.filter(likeId => likeId !== id);
    } else {
        likedInnovations.push(id);
    }
    localStorage.setItem('likedInnovations', JSON.stringify(likedInnovations));
}

// Load on page start
loadInnovations();

// about//
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();
    let status = document.getElementById("formStatus");

    if (name === "" || email === "" || message === "") {
        status.textContent = "Please fill out all fields.";
        status.style.color = "red";
        return;
    }

    if (!validateEmail(email)) {
        status.textContent = "Please enter a valid email address.";
        status.style.color = "red";
        return;
    }

    // Here you could send data to your server (AJAX or Fetch)
    status.textContent = "Your message has been sent successfully!";
    status.style.color = "green";

    // Reset form
    document.getElementById("contactForm").reset();
});

function validateEmail(email) {
    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
