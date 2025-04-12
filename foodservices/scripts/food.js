document.addEventListener('DOMContentLoaded', () => {
    initSite();
  });
  
  async function initSite() {
    updateFooter();
    trackVisits();
    setupMenu();
    try {
      const foods = await fetchFoodData();
      renderFoods(foods);
      setupModalEvent(foods);
    } catch (error) {
      console.error('Failed to load food data:', error);
    }
  }
  
  // ✅ Update footer year and last modified date
  function updateFooter() {
    const currentYear = document.getElementById('currentyear');
    const lastModified = document.getElementById('lastModified');
  
    if (currentYear) currentYear.textContent = new Date().getFullYear();
    if (lastModified) lastModified.textContent = `Last Modified: ${document.lastModified}`;
  }
  
  // ✅ localStorage visit tracker
  function trackVisits() {
    let visits = Number(localStorage.getItem('visits')) || 0;
    visits++;
    localStorage.setItem('visits', visits);
    console.log(`This is your visit number ${visits}.`);
  }
  
  // ✅ Menu toggle
  function setupMenu() {
    const menuBtn = document.querySelector('#menu');
    const navBar = document.querySelector('.navbar');
    menuBtn.addEventListener('click', () => {
      navBar.classList.toggle('show');
    });
  }
  
  // ✅ Fetch local JSON data (foods.json)
  async function fetchFoodData() {
    try {
      const response = await fetch('data/foods.json');
      if (!response.ok) throw new Error('Could not fetch food data');
      const data = await response.json();
      return data.foods;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  // ✅ Render 15 food cards with 4+ data points each
  function renderFoods(foods) {
    const section = document.createElement('section');
    section.classList.add('food-grid');
  
    foods.slice(0, 15).forEach(food => {
      const card = document.createElement('div');
      card.classList.add('food-card');
      card.innerHTML = `
        <img src="${food.image}" alt="${food.name}" loading="lazy">
        <h3>${food.name}</h3>
        <p><strong>Origin:</strong> ${food.origin}</p>
        <p><strong>Spice Level:</strong> ${food.spiceLevel}</p>
        <p><strong>Main Ingredient:</strong> ${food.mainIngredient}</p>
        <button class="more-btn" data-id="${food.id}">More Info</button>
      `;
      section.appendChild(card);
    });
  
    document.querySelector('main').appendChild(section);
  }
  
  // ✅ Modal dialog functionality
  function setupModalEvent(foods) {
    document.body.addEventListener('click', (e) => {
      if (e.target.classList.contains('more-btn')) {
        const foodId = parseInt(e.target.dataset.id);
        const food = foods.find(f => f.id === foodId);
        if (food) showModal(food);
      }
  
      if (e.target.classList.contains('modal') || e.target.classList.contains('close-btn')) {
        closeModal();
      }
    });
  }
  
  // ✅ Show modal
  function showModal(food) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-btn">&times;</span>
        <h2>${food.name}</h2>
        <img src="${food.image}" alt="${food.name}">
        <p>${food.description}</p>
      </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
  }
  
  // ✅ Close modal
  function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
    document.body.style.overflow = 'auto';
  }
  