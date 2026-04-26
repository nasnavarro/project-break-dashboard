import { generarContrasena } from '../utils/passwords.js';

const WIDGET_HTML = `
  <p class="passwords-intro">Genera una contraseña segura de entre 12 y 50 caracteres, con al menos una mayúscula, una minúscula, un número y un símbolo.</p>
  <div class="passwords-controls">
    <label class="passwords-label" for="passwords-length">Longitud</label>
    <input type="number" id="passwords-length" class="passwords-input" value="12" min="12" max="50" />
    <button id="passwords-generate-btn" class="passwords-btn">Generar</button>
  </div>
  <div class="passwords-result-row">
    <div class="passwords-result" id="passwords-result"></div>
    <button class="passwords-copy-btn" id="passwords-copy-btn" title="Copiar contraseña" hidden>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
    </button>
    <span class="passwords-copy-feedback" id="passwords-copy-feedback" hidden>¡Copiada en el portapapeles!</span>
  </div>
  <p class="passwords-error" id="passwords-error"></p>
`;

// Función que inicializa el widget de contraseñas en un contenedor.
export function initPasswordWidget(container) {
  container.insertAdjacentHTML('beforeend', WIDGET_HTML);

  const input   = container.querySelector('#passwords-length');
  const btn     = container.querySelector('#passwords-generate-btn');
  const result  = container.querySelector('#passwords-result');
  const error   = container.querySelector('#passwords-error');
  const copyBtn  = container.querySelector('#passwords-copy-btn');
  const feedback = container.querySelector('#passwords-copy-feedback');

  function generate() {
    const longitud = parseInt(input.value, 10);
    error.textContent = '';
    try {
      result.textContent = generarContrasena(longitud);
      copyBtn.hidden = false;
    } catch (e) {
      result.textContent = '';
      copyBtn.hidden = true;
      error.textContent = e.message;
    }
  }

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(result.textContent).then(() => {
      copyBtn.classList.add('passwords-copy-btn--copied');
      feedback.hidden = false;
      setTimeout(() => {
        copyBtn.classList.remove('passwords-copy-btn--copied');
        feedback.hidden = true;
      }, 1500);
    });
  });

  // Se crean los EventListeners del input y el botón (incluyendo Enter).
  btn.addEventListener('click', generate);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });
}

// Si existe el contenedor con id "passwords-container" en la página, inicializa el widget.
const container = document.getElementById('passwords-container');
if (container) initPasswordWidget(container);
