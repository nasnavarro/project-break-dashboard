import { generarContrasena } from '../utils/passwords.js';

const WIDGET_HTML = `
  <p class="passwords-intro">Genera una contraseña segura de entre 12 y 50 caracteres, con al menos una mayúscula, una minúscula, un número y un símbolo.</p>
  <div class="passwords-controls">
    <label class="passwords-label" for="passwords-length">Longitud</label>
    <input type="number" id="passwords-length" class="passwords-input" value="12" min="12" max="50" />
    <button id="passwords-generate-btn" class="passwords-btn">Generar</button>
  </div>
  <div class="passwords-result" id="passwords-result"></div>
  <p class="passwords-error" id="passwords-error"></p>
`;

// Función que inicializa el widget de contraseñas en un contenedor.
export function initPasswordWidget(container) {
  container.insertAdjacentHTML('beforeend', WIDGET_HTML);

  const input  = container.querySelector('#passwords-length');
  const btn    = container.querySelector('#passwords-generate-btn');
  const result = container.querySelector('#passwords-result');
  const error  = container.querySelector('#passwords-error');

  function generate() {
    const longitud = parseInt(input.value, 10);
    error.textContent = '';
    try {
      result.textContent = generarContrasena(longitud);
    } catch (e) {
      result.textContent = '';
      error.textContent = e.message;
    }
  }

  // Se crean los EventListeners del input y el botón (incluyendo Enter).
  btn.addEventListener('click', generate);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });
}

// Si existe el contenedor con id "passwords-container" en la página, inicializa el widget.
const container = document.getElementById('passwords-container');
if (container) initPasswordWidget(container);
