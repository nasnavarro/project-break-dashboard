// Módulo de generación de contraseñas

// Definimos los caracteres que se pueden usar en la contraseña, agrupados por tipo para facilitar su selección.
const MAYUSCULAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MINUSCULAS = "abcdefghijklmnopqrstuvwxyz";
const NUMEROS = "0123456789";
const SIMBOLOS = "!@#$%^&*()-_=+";

// Genera una contraseña aleatoria con al menos una mayúscula, minúscula, número y símbolo.
// Lanza un Error si la longitud está fuera del rango permitido (12–50).
function generarContrasena(longitud = 12) {
  if (isNaN(longitud) || longitud < 12 || longitud > 50) {
    throw new Error(`Longitud no válida: debe estar entre 12 y 50 (recibido: ${longitud}).`);
  }

  const mayuscula = MAYUSCULAS[Math.floor(Math.random() * MAYUSCULAS.length)];
  const minuscula = MINUSCULAS[Math.floor(Math.random() * MINUSCULAS.length)];
  const numero    = NUMEROS[Math.floor(Math.random() * NUMEROS.length)];
  const simbolo   = SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)];

  const todos = MAYUSCULAS + MINUSCULAS + NUMEROS + SIMBOLOS;
  let password = mayuscula + minuscula + numero + simbolo;

  const restantes = longitud - password.length;
  for (let i = 0; i < restantes; i++) {
    password += todos[Math.floor(Math.random() * todos.length)];
  }

  return password;
}

// Si encuentra el elemento del widget añadimos la funcionalidad a la página.
if (document.getElementById('passwords-result')) {
  const input  = document.getElementById('passwords-length');
  const btn    = document.getElementById('passwords-generate-btn');
  const result = document.getElementById('passwords-result');
  const error  = document.getElementById('passwords-error');

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

  btn.addEventListener('click', generate);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });
}