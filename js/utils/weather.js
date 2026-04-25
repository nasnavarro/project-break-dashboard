// weather module

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const dayLabel = (dateStr) => DAYS[new Date(dateStr + 'T00:00:00').getDay()];

// Función que obtiene los datos del clima de la API, a partir de un nombre de ciudad.
// Datos necesarios:
// - Ubicación: nombre, país, latitud, longitud
// - Clima actual: temperatura, sensación térmica, precipitaciones, humedad, velocidad del viento (km/h), nubosidad, icono y descripción
// - Pronóstico diario en horas: hora, imagen y temperatura en ºC (máxima y mínima)
const CITY = 'Alcorcón';

async function fetchWeatherAPI() {
  const WEATHER_API_KEY = '89762f57084d4ca89dd164642261704';
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${CITY}&days=1&aqi=no&alerts=no&lang=es`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WeatherAPI HTTP ${res.status}`);
  const data = await res.json();

  console.log(data);

  return {
    location: {
        name: data.location.name,
        country: data.location.country,
        lat: data.location.lat,
        lon: data.location.lon,
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
    hourly: data.forecast.forecastday[0].hour.map(h => ({
      hour:        h.time.split(' ')[1].slice(0, 5),
      temp:        Math.round(h.temp_c),
      icon:        'https:' + h.condition.icon,
      description: h.condition.text,
      rain:        h.chance_of_rain,
    })),
  };
}

// Función que renderiza los datos del clima actual en el DOM
function renderCurrent(current, location, forecast) {
  document.getElementById('weather-icon').src         = current.icon;
  document.getElementById('weather-icon').alt         = current.description;
  document.getElementById('weather-location').textContent    = `${location.name}, ${location.country}`;
  document.getElementById('weather-description').textContent = current.description;
  document.getElementById('weather-temp').textContent     = `${current.temp} °C`;
  document.getElementById('weather-feels').textContent    = `${current.feelsLike} °C`;
  document.getElementById('weather-humidity').textContent = `${current.humidity} %`;
  document.getElementById('weather-wind').textContent     = `${current.windSpeed} km/h`;
  document.getElementById('weather-cloud').textContent    = `${current.cloudCover} %`;
  document.getElementById('weather-temp-max').textContent = `${forecast.max} °C`;
  document.getElementById('weather-temp-min').textContent = `${forecast.min} °C`;
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

fetchWeatherAPI()
  .then(data => {
    renderCurrent(data.current, data.location, data.forecast);
    renderHourly(data.hourly);
  })
  .catch(renderError);

//IDEAS
/*
+ Falta añadir capa de CARGANDO, y luego mostrar los datos en el DOM.
+ Tener una imagen que muestre en algún sitio que cambie en función del tiempo
o de la hora del día (día/noche). Y una imagen de la ciudad seleccionada.
+ Mirar los Weather Maps de la API, para mostrar un mapa con las condiciones meteorológicas.
+ Añadir un botón para seleccionar ciudad, y mostrar el clima de esa ciudad.

*/