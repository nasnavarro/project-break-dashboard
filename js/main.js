// Importamos las funciones necesarias:
// + Inicialización el fondo
// + Menú de navegación
// + Sección del clima
import { initBackground } from './utils/background.js';
import { initNav } from './utils/nav.js';
import { fetchWeatherAPI, resolveImageUrl } from './utils/weather.js';
import { CITIES } from './data/weather_data.js';
// Inicializamos el fondo
initBackground();
// Inicializamos el menú de navegación
initNav();

// Sólo en la página principal, cargamos el clima de la ciudad por defecto y mostramos
// el widget meteorológico adaptado a la home.
if (document.body.dataset.page === 'index') {
  // Obtenemos la ciudad predefinida (la que tenga default: true) para cargar su clima al inicio.
  const defaultCity = CITIES.find(c => c.default);
  if (defaultCity) {
    fetchWeatherAPI(defaultCity.name)
      .then(({ location, current, forecast }) => {
        const section = document.getElementById('section-weather');
        const bgUrl = resolveImageUrl(defaultCity.img_url);
        section.style.backgroundImage = `linear-gradient(rgba(13,17,23,0.75), rgba(13,17,23,0.75)), url('${bgUrl}')`;
        section.style.backgroundSize = 'cover';
        section.style.backgroundPosition = 'center';
        section.innerHTML = `
          <h2 class="dashboard-section-title">Estación Meteorológica</h2>
          <div class="weather-widget">
            <div class="weather-widget-header">
              <img class="weather-widget-icon" src="${current.icon}" alt="${current.description}" />
              <div class="weather-widget-info">
                <p class="weather-widget-city">${location.name}, ${location.country}</p>
                <p class="weather-widget-desc">${current.description}</p>
                <p class="weather-widget-coords">${location.lat}°N ${location.lon}°E</p>
              </div>
            </div>
            <div class="weather-widget-stats">
              <div class="weather-widget-stat">
                <span class="weather-widget-stat-value">${current.temp} °C</span>
                <span class="weather-widget-stat-label">Temperatura</span>
              </div>
              <div class="weather-widget-stat">
                <span class="weather-widget-stat-value">${current.feelsLike} °C</span>
                <span class="weather-widget-stat-label">Sensación</span>
              </div>
              <div class="weather-widget-stat">
                <span class="weather-widget-stat-value">${current.humidity} %</span>
                <span class="weather-widget-stat-label">Humedad</span>
              </div>
              <div class="weather-widget-stat">
                <span class="weather-widget-stat-value">${current.windSpeed} km/h</span>
                <span class="weather-widget-stat-label">Viento</span>
              </div>
              <div class="weather-widget-stat">
                <span class="weather-widget-stat-value">${current.cloudCover} %</span>
                <span class="weather-widget-stat-label">Nubosidad</span>
              </div>
              <div class="weather-widget-stat">
                <span class="weather-widget-stat-value">${forecast.max}° / ${forecast.min}°</span>
                <span class="weather-widget-stat-label">Máx / Mín</span>
              </div>
            </div>
          </div>
        `;
      })
      .catch(err => {
        document.getElementById('section-weather').innerHTML += `
          <p class="weather-error">${err.message}</p>
        `;
      });
  } else {
    document.getElementById('section-weather').innerHTML += `
      <p class="weather-error">No hay ninguna ciudad predefinida configurada.</p>
    `;
  }
}
