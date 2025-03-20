const currentYear = new Date().getFullYear();
document.getElementById("currentyear").innerHTML = currentYear;


const lastModified = document.lastModified; 
document.getElementById("lastModified").innerHTML = "Last Modified: " + lastModified;


const menuButton = document.querySelector('#menu');
const nav = document.querySelector('.navbar');

menuButton.addEventListener('click', ()  => {
    navbar.classList.toggle('open');
    menuButton.classList.toggle('open');
});

    
    // Fetch members
    getMembers();
    
    const memberList = document.getElementById('member-list');
    const toggleButton = document.getElementById('toggle-view');
    
    async function getMembers() {
        try {
            const response = await fetch('data/members.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const members = await response.json();
            displayMembers(members);
        } catch (error) {
            console.error('Error fetching members:', error);
            memberList.innerHTML = '<p>Failed to load members. Please try again later.</p>';
        }
    }
    
    function displayMembers(members) {
        memberList.innerHTML = '';
        const levelMap = { 1: 'Member', 2: 'Silver', 3: 'Gold' };
        members.forEach(member => {
            const card = document.createElement('div');
            card.innerHTML = `
                <h3>${member.name}</h3>
                <img src="${member.image}" alt="${member.name} logo" loading="lazy">
                <p>${member.address}</p>
                <p>Phone: ${member.phone}</p>
                <p>Email: <a href="mailto:${member.email || ''}">${member.email || 'N/A'}</a></p>
                <p>URL: <a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a></p>
                <p>Membership Level: ${levelMap[member.membershipLevel] || 'Unknown'}</p>
                <p>${member.additionalInfo || ''}</p>
            `;
            memberList.appendChild(card);
        });
        memberList.classList.add('grid-view');
        toggleButton.textContent = 'Toggle List View';
    }
    
    toggleButton.addEventListener('click', () => {
        if (memberList.classList.contains('grid-view')) {
            memberList.classList.remove('grid-view');
            memberList.classList.add('list-view');
            toggleButton.textContent = 'Toggle Grid View';
        } else {
            memberList.classList.remove('list-view');
            memberList.classList.add('grid-view');
            toggleButton.textContent = 'Toggle List View';
        }
    });
    
    getMembers();