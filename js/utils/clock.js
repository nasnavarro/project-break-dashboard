// Importamos las frases asociadas a los distintos rangos horarios desde el archivo de datos.
import { TIME_MESSAGES } from '../data/clock_data.js';

// Función que obtiene datos en distintos formatos del momento actual. Se puede
// pasar una fecha concreta como argumento, o se usará la fecha actual por defecto.
export const getDateData = (date) =>{
    const now = date || new Date();
    // Obtenemos las horas, minutos y segundos del momento actual.
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    // Ajusta el formato de horas, minutos y segundos a un formato de reloj digital HH:mm:ss.
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    // Obtenemos el día de la semana, el día del mes, el mes y el año.
    const dayOfWeek = now.toLocaleDateString('es-ES', { weekday: 'long' });
    const dayOfMonth = now.getDate();
    const month = now.toLocaleDateString('es-ES', { month: 'long' });
    const year = now.getFullYear();
    // Construimos también la fecha en formato DD/MM/AAAA.
    const formattedDate = `${String(dayOfMonth).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${year}`;

    // Calculamos los minutos desde medianoche para facilitar la comparación con los rangos de tiempo definidos en TIME_MESSAGES.
    const mins_from_midnight = hours * 60 + minutes;
    //Obtenemos la frase correspondiente al momento actual según el rango de tiempo en el que nos encontremos, usando el array TIME_MESSAGES.
    const timeMessage = TIME_MESSAGES.find(msg => mins_from_midnight >= msg.from && mins_from_midnight <= msg.to)?.message ?? '';

    return { hours, minutes, seconds, formattedTime, dayOfWeek, dayOfMonth, month, year, formattedDate, mins_from_midnight, timeMessage };
}

// Modificamos el elemento del DOM sólo si el nuevo valor es diferente al actual, para evitar renderizados innecesarios.
function setIfChanged(id, value) {
  const el = document.getElementById(id);
  if (el && el.textContent !== value) el.textContent = value;
}

// Función que renderiza el reloj digital, la fecha y el mensaje asociado al momento actual en el DOM.
export const renderClock = () => {
    const { formattedTime, dayOfWeek, formattedDate, timeMessage } = getDateData();
    setIfChanged('clock-time', formattedTime);
    setIfChanged('clock-date', dayOfWeek + ', ' + formattedDate);
    setIfChanged('clock-message', timeMessage);
}

// Llamada inicial y actualización cada segundo.
renderClock();
setInterval(renderClock, 1000);