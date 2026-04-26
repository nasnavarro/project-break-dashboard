// Importamos las ciudades y los slots horarios desde el archivo de datos.
import { CITIES, TIME_SLOTS } from '../data/weather_data.js';
import { fetchJSON } from './helpers.js';

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const dayLabel = (dateStr) => DAYS[new Date(dateStr + 'T00:00:00').getDay()];

const WEATHER_API_KEY = '89762f57084d4ca89dd164642261704';
const CITY = CITIES.find(c => c.default)?.name ?? CITIES[0]?.name;

// Obtiene los datos del clima actual para la ciudad dada, y devuelve un objeto con la información relevante (temperatura, humedad, viento, etc.)
export async function fetchWeatherAPI(cityName, days = 1) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(cityName)}&days=${days}&aqi=no&alerts=no&lang=es`;
  const data = await fetchJSON(url);

  return {
    location: {
      name:    data.location.name,
      country: data.location.country,
      lat:     data.location.lat,
      lon:     data.location.lon,
    },
    current: {
      temp:        Math.round(data.current.temp_c),
      feelsLike:   Math.round(data.current.feelslike_c),
      humidity:    data.current.humidity,
      windSpeed:   Math.round(data.current.wind_kph),
      cloudCover:  data.current.cloud,
      icon:        'https:' + data.current.condition.icon,
      description: data.current.condition.text,
    },
    forecast: {
      label: dayLabel(data.forecast.forecastday[0].date),
      icon:  'https:' + data.forecast.forecastday[0].day.condition.icon,
      max:   Math.round(data.forecast.forecastday[0].day.maxtemp_c),
      min:   Math.round(data.forecast.forecastday[0].day.mintemp_c),
    },
    forecast7: data.forecast.forecastday.map(day => ({
      label:       dayLabel(day.date),
      icon:        'https:' + day.day.condition.icon,
      description: day.day.condition.text,
      max:         Math.round(day.day.maxtemp_c),
      min:         Math.round(day.day.mintemp_c),
      rain:        day.day.daily_chance_of_rain,
    })),
    hourly: data.forecast.forecastday[0].hour.map(h => ({
      hour:        h.time.split(' ')[1].slice(0, 5),
      temp:        Math.round(h.temp_c),
      icon:        'https:' + h.condition.icon,
      description: h.condition.text,
      rain:        h.chance_of_rain,
    })),
  };
}

// Fución que obtiene los datos del clima para las demás ciudades (excepto la principal), y devuelve un array con los datos de cada ciudad (nombre, temperatura, descripción, etc.)
async function fetchOtherCities() {
  const others = CITIES.filter(c => c.name !== CITY);
  const results = await Promise.allSettled(others.map(c => fetchWeatherAPI(c.name)));
  return results
    .map((r, i) => ({ result: r, cityMeta: others[i] }))
    .filter(({ result }) => result.status === 'fulfilled')
    .map(({ result, cityMeta }) => ({ cityData: result.value, cityMeta }));
}

// Función que renderiza los datos del clima actual en el DOM
function renderCurrent(current, location, forecast) {
  document.getElementById('weather-icon').src                  = current.icon;
  document.getElementById('weather-icon').alt                  = current.description;
  document.getElementById('weather-location').textContent      = `${location.name}, ${location.country}`;
  document.getElementById('weather-description').textContent   = current.description;
  document.getElementById('weather-coords').textContent        = `${location.lat}°N ${location.lon}°E`;
  document.getElementById('weather-temp').textContent          = `${current.temp} °C`;
  document.getElementById('weather-feels').textContent         = `${current.feelsLike} °C`;
  document.getElementById('weather-humidity').textContent      = `${current.humidity} %`;
  document.getElementById('weather-wind').textContent          = `${current.windSpeed} km/h`;
  document.getElementById('weather-cloud').textContent         = `${current.cloudCover} %`;
  document.getElementById('weather-temp-max').textContent      = `${forecast.max} °C`;
  document.getElementById('weather-temp-min').textContent      = `${forecast.min} °C`;
}

// Función que renderiza el pronóstico horario en el DOM
function renderHourly(hourly) {
  const container = document.getElementById('weather-hourly');
  container.innerHTML = hourly.map(h => `
    <div class="weather-hour">
      <span class="weather-hour-time">${h.hour}</span>
      <img src="${h.icon}" alt="${h.description}" />
      <span class="weather-hour-temp">${h.temp} °C</span>
      <span class="weather-hour-rain" style="visibility:${h.rain > 0 ? 'visible' : 'hidden'}">${h.rain}%</span>
    </div>
  `).join('');
}

function renderForecast7(days) {
  const container = document.getElementById('weather-forecast7');
  container.innerHTML = days.map(day => `
    <div class="weather-forecast-day">
      <span class="weather-forecast-label">${day.label}</span>
      <img src="${day.icon}" alt="${day.description}" />
      <span class="weather-forecast-temp">${day.max}° / ${day.min}°</span>
      <span class="weather-forecast-rain" style="visibility:${day.rain > 0 ? 'visible' : 'hidden'}">${day.rain}%</span>
    </div>
  `).join('');
}

// Función que renderiza las demás ciudades en el DOM, mostrando su nombre, temperatura actual, descripción y un botón para cargar su pronóstico al hacer click en él
function renderOtherCities(cities) {
  const container = document.getElementById('weather-cities');
  container.innerHTML = cities.map(({ cityData, cityMeta }) => {
    const url = resolveImageUrl(cityMeta.img_url);
    return `
      <div class="weather-city-card" style="
        background-image: linear-gradient(rgba(13,17,23,0.55), rgba(13,17,23,0.55)), url('${url}');
        background-size: cover;
        background-position: center;
      ">
        <p class="weather-city-name">${cityData.location.name}</p>
        <img src="${cityData.current.icon}" alt="${cityData.current.description}" />
        <p class="weather-city-temp">${cityData.current.temp} °C</p>
        <p class="weather-city-desc">${cityData.current.description}</p>
        <p class="weather-city-minmax">${cityData.forecast.max}° / ${cityData.forecast.min}°</p>
        <button class="weather-city-btn" data-city="${cityMeta.name}">Pronóstico</button>
      </div>
    `;
  }).join('');

  // Añadimos un botón que nos permita cargar el pronóstico de esa ciudad al hacer click en él
  container.addEventListener('click', e => {
    const btn = e.target.closest('.weather-city-btn');
    if (btn) loadCity(btn.dataset.city);
  });
}

// Función que normaliza un string (nombre de ciudad) para compararlo de forma más flexible, eliminando mayúsculas, tildes, espacios extra, etc.
function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Función que compara el nombre de la ciudad introducido por el usuario con el
// nombre de la ciudad devuelto por la API, para evitar errores de búsqueda
// debido a diferencias en mayúsculas, tildes, espacios, etc.
// Devuelve true si el nombre introducido parece coincidir con la ciudad encontrada,
// o false si no hay una coincidencia razonable.
// El api devuelve como Fallback San Marino para búsquedas no encontradas, así que si el nombre introducido no se parece en absoluto a San Marino, asumimos que no se han encontrado resultados válidos.
function looksLikeMatch(query, location) {
  const words = normalize(query).split(/\s+/).filter(w => w.length >= 3);
  if (words.length === 0) return true;
  const haystack = normalize(`${location.name} ${location.region} ${location.country}`);
  return words.some(w => haystack.includes(w));
}

// Función que carga el pronóstico de la ciudad dada, renderiza los datos en el DOM y aplica el fondo correspondiente a esa ciudad
function loadCity(cityName) {
  showLoading(currentContainer);
  showLoading(hourlyContainer);
  showLoading(forecast7Container);
  fetchWeatherAPI(cityName, 7)
    .then(data => {
      hideLoading(currentContainer);
      hideLoading(hourlyContainer);
      hideLoading(forecast7Container);
      if (!looksLikeMatch(cityName, data.location)) {
        document.getElementById('weather-current').innerHTML = `
          <p class="weather-error">
            No se han encontrado resultados para <strong>${cityName}</strong>.
          </p>
        `;
        document.getElementById('weather-hourly').innerHTML = '';
        document.getElementById('weather-forecast7').innerHTML = '';
        return;
      }
      renderCurrent(data.current, data.location, data.forecast);
      renderHourly(data.hourly);
      renderForecast7(data.forecast7);
      applyCityBackground(cityName);
      currentContainer.scrollIntoView({ behavior: 'smooth' });
    })
    .catch(err => {
      hideLoading(currentContainer);
      hideLoading(hourlyContainer);
      hideLoading(forecast7Container);
      document.getElementById('weather-current').innerHTML = `
        <p class="weather-error">
          No se han encontrado resultados para <strong>${cityName}</strong>.<br>
          <span>${err.message}</span>
        </p>
      `;
      document.getElementById('weather-hourly').innerHTML = '';
    });
}

// Función que muestra un overlay de carga en el contenedor dado, para indicar que se están cargando los datos del clima
function showLoading(container) {
  const overlay = document.createElement('div');
  overlay.className = 'weather-loading-overlay';
  overlay.textContent = 'Cargando...';
  container.appendChild(overlay);
}

// Función que oculta el overlay de carga del contenedor dado, una vez que se han cargado los datos del clima
function hideLoading(container) {
  container.querySelector('.weather-loading-overlay')?.remove();
}

// Función que resuelve la URL de la imagen de fondo según el tamaño de pantalla actual (sm, md o lg)
export function resolveImageUrl(img_url) {
  if (window.innerWidth <= 768)  return img_url.size_sm;
  if (window.innerWidth <= 1280) return img_url.size_md;
  return img_url.size_lg;
}

// Función que obtiene el slot horario actual según la hora del día, y devuelve el objeto del slot correspondiente (con su código, nombre y URL de imagen de fondo)
function isHourInSlot(hour, { from, to }) {
  const crossesMidnight = from > to;           // noche: 21:00 → 05:00
  return crossesMidnight
    ? hour >= from || hour <= to               // válido a las 23:00 y también a las 02:00
    : hour >= from && hour <= to;              // rango simple dentro del mismo día
}

// Función que obtiene el slot horario actual según la hora del día, y devuelve el objeto del slot correspondiente (con su código, nombre y URL de imagen de fondo)
function getCurrentSlot() {
  const hour = new Date().getHours();
  return TIME_SLOTS.find(slot => isHourInSlot(hour, slot.hours));
}

// Función que aplica el fondo correspondiente al slot horario actual en el contenedor del pronóstico horario
function applySlotBackground() {
  const slot = getCurrentSlot();
  if (!slot) return;
  const container = document.querySelector('.weather-hourly-container');
  const url = resolveImageUrl(slot.img_url);
  container.style.backgroundImage = `linear-gradient(rgba(13,17,23,0.78), rgba(13,17,23,0.78)), url('${url}')`;
  container.style.backgroundSize = 'cover';
  container.style.backgroundPosition = 'center';
}

// Función que aplica el fondo correspondiente a la ciudad dada en el contenedor del pronóstico actual
function applyCityBackground(cityName) {
  const city = CITIES.find(c => c.name === cityName);
  const container = document.querySelector('.weather-current-container');
  if (!city) {
    container.style.backgroundImage = '';
    return;
  }
  const url = resolveImageUrl(city.img_url);
  container.style.backgroundImage = `linear-gradient(rgba(13,17,23,0.78), rgba(13,17,23,0.78)), url('${url}')`;
  container.style.backgroundSize = 'cover';
  container.style.backgroundPosition = 'center';
}

// Control de errores: función que muestra un mensaje de error en el DOM si no se han podido cargar los datos del clima
function renderError(err) {
  console.error('[weather]', err.message);
  document.getElementById('weather-current').innerHTML = `
    <p class="weather-error">
      No se han podido cargar los datos para <strong>${CITY}</strong>.<br>
      <span>${err.message}</span>
    </p>
  `;
  document.getElementById('weather-hourly').innerHTML = '';
}

// Al cargar la página, obtenemos los datos del clima para la ciudad principal y
// las demás ciudades, y renderizamos toda la información en el DOM.
// Si hay algún error durante la carga de los datos, mostramos un mensaje de
// error en el DOM.
const currentContainer = document.querySelector('.weather-current-container');
const hourlyContainer  = document.querySelector('.weather-hourly-container');
const forecast7Container = document.querySelector('.weather-forecast7-container');
const citiesContainer  = document.querySelector('.weather-cities-container');

if (document.getElementById('weather-current')) {
  const input = document.getElementById('weather-city-input');
  const btn   = document.getElementById('weather-city-search-btn');

  // Función para cargar una ciudad en base a un texto introducido por el usuario.
  function searchCity() {
    const name = input.value.trim();
    if (name) loadCity(name);
  }

  // Event listeners para el botón de búsqueda y la tecla Enter en el input
  btn.addEventListener('click', searchCity);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') searchCity(); });

  if (!CITY) {
    renderError(new Error('No hay ninguna ciudad predefinida configurada.'));
  } else {
    showLoading(currentContainer);
    showLoading(hourlyContainer);
    showLoading(forecast7Container);
    showLoading(citiesContainer);

    Promise.all([fetchWeatherAPI(CITY, 7), fetchOtherCities()])
      .then(([mainData, otherCities]) => {
        hideLoading(currentContainer);
        hideLoading(hourlyContainer);
        hideLoading(forecast7Container);
        hideLoading(citiesContainer);
        renderCurrent(mainData.current, mainData.location, mainData.forecast);
        renderHourly(mainData.hourly);
        renderForecast7(mainData.forecast7);
        applyCityBackground(CITY);
        applySlotBackground();
        renderOtherCities(otherCities);
      })
      .catch(err => {
        hideLoading(currentContainer);
        hideLoading(hourlyContainer);
        hideLoading(forecast7Container);
        hideLoading(citiesContainer);
        renderError(err);
      });
  }
}

//IDEAS
/*
+ Mirar los Weather Maps de la API, para mostrar un mapa con las condiciones meteorológicas.
*/