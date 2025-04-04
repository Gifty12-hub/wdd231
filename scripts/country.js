// select HTML elements in the document
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

const myKey = '64b95409da670752838f49b076a726e6'
const myLat = '49.75'
const myLong = '6.64'
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&units=metric&appid=${myKey}`;

async function apiFetch() {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log(data); 
        displayResults(data); 
      } else {
          throw Error(await response.text());
      }
    } catch (error) {
        console.log('Error:',error);
    }
  }
  
 

  function displayResults(data) {
    currentTemp.innerHTML = `${data.main.temp} °C`;
    const description = data.weather[0].description;
    captionDesc.textContent = description.charAt(0).toUpperCase() + description.slice(1);

    const iconSrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.setAttribute('src', iconSrc);
    weatherIcon.setAttribute('alt', description);
    
  } 
  apiFetch();