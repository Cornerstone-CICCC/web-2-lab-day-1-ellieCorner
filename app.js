const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityNameEl = document.getElementById("cityName");
const temperatureEl = document.getElementById("temperature");
const countryEl = document.getElementById("country");
const timezoneEl = document.getElementById("timezone");
const populationEl = document.getElementById("population");
const forecastEl = document.getElementById("forecast");
const result = document.getElementById("result");

const loading = document.getElementById("loading");

searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (!city) return;

  loading.classList.remove("hidden");

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert("City not found.");
      return;
    }

    const { name, latitude, longitude, country, timezone, population } =
      geoData.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=2`
    );
    const weatherData = await weatherRes.json();
    const current = weatherData.current;
    const daily = weatherData.daily;

    cityNameEl.textContent = name;
    temperatureEl.textContent = `${current.temperature_2m} °C`;
    countryEl.textContent = country;
    timezoneEl.textContent = timezone;
    populationEl.textContent = population ?? "-";
    forecastEl.innerHTML = `Low: ${daily.temperature_2m_min[1]} °C<br>Max: ${daily.temperature_2m_max[1]} °C`;

    const banner = document.querySelector(".banner");
    banner.style.backgroundImage = current.is_day
      ? "url('./images/day.jpg')"
      : "url('./images/night.jpg')";

    const body = document.body;
    body.classList.remove("light", "dark");
    body.classList.add(current.is_day ? "light" : "dark");

    result.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    alert("Error fetching data.");
  } finally {
    loading.classList.add("hidden");
  }
});
