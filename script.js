const apiKey = '62e018ca-ae01-4564-b3fd-74b719db1515';
const citySelect = document.getElementById('city-select');
const weatherInfo = document.getElementById('weather-info');

const backgrounds = {
  Clear: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1350&q=80',
  Clouds: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1350&q=80',
  Rain: 'https://images.unsplash.com/photo-1526676039391-2f0b48e5d62e?auto=format&fit=crop&w=1350&q=80',
  Snow: 'https://images.unsplash.com/photo-1608889176537-ef71d7f87d8f?auto=format&fit=crop&w=1350&q=80',
  Thunderstorm: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1350&q=80',
  Mist: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1350&q=80',
  Default: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1350&q=80'
};

function setBackground(condition) {
  const bgUrl = backgrounds[condition] || backgrounds.Default;
  document.body.style.backgroundImage = `url('${bgUrl}')`;
}

function displayWeather(data) {
  const tempC = (data.main.temp - 273.15).toFixed(1);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const condition = data.weather[0].main;
  const cityName = data.name;

  weatherInfo.innerHTML = `
    <h2>${cityName}</h2>
    <p><strong>Temperature:</strong> ${tempC} °C</p>
    <p><strong>Humidity:</strong> ${humidity} %</p>
    <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
    <p><strong>Condition:</strong> ${condition}</p>
  `;

  setBackground(condition);
}

function fetchWeather(city) {
  return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`)
    .then(response => {
      if (!response.ok) throw new Error('City not found');
      return response.json();
    });
}

async function updateCityOptionsWithTemp() {
  const options = citySelect.options;
  for (let i = 0; i < options.length; i++) {
    const city = options[i].value;
    try {
      const data = await fetchWeather(city);
      const tempC = (data.main.temp - 273.15).toFixed(1);
      options[i].text = `${city} (${tempC}°C)`;
    } catch {
      options[i].text = `${city} (N/A)`;
    }
  }
}

let currentCity = localStorage.getItem('preferredCity') || 'Kathmandu';

async function init() {
  await updateCityOptionsWithTemp();

  citySelect.value = currentCity;
  try {
    const data = await fetchWeather(currentCity);
    displayWeather(data);
  } catch (error) {
    weatherInfo.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    setBackground('Default');
  }
}

citySelect.addEventListener('change', async () => {
  const selectedCity = citySelect.value;
  localStorage.setItem('preferredCity', selectedCity);
  weatherInfo.innerHTML = '<p>Loading weather data...</p>';
  try {
    const data = await fetchWeather(selectedCity);
    displayWeather(data);
  } catch (error) {
    weatherInfo.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    setBackground('Default');
  }
});

init();
