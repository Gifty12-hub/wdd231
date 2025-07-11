const currentYear = new Date().getFullYear();
const yearElem = document.getElementById("currentyear");
if (yearElem) yearElem.innerHTML = currentYear;

const lastModified = document.lastModified;
const modifiedElem = document.getElementById("lastModified");
if (modifiedElem) modifiedElem.innerHTML = "Last Modified: " + lastModified;

const mainnav = document.querySelector('.navbar');
const hambutton = document.querySelector('#menu');

if (mainnav && hambutton) {
    hambutton.addEventListener('click', () => {
        mainnav.classList.toggle('open');
        hambutton.classList.toggle('open');
    });
}

// Fetch //

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