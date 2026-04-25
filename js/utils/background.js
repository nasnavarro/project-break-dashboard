import { images } from '../data/images.js';

//Definimos el intervalo de cambio de fondo en milisegundos.
const INTERVAL = 15000;

// Función que obtiene en función de la página actual, el
// conjunto de imágenes a usar como fondo. La home cargará cualquier imagen,
// mientras que el resto de páginas cargarán solo las imágenes de su categoría.
function getImages() {
  const page = document.body.dataset.page;
  if (page === 'index') return images;
  return images.filter(img => img.category === page);
}

// Función  para desordenar las imágenes y que no se repitan siempre en el mismo.
// Se utiliza un algoritmo de Fisher-Yates para mezclar el array, que está menos
// sesgado que un sort con random.
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

//  Función que inicializa el cambio de fondo
export function initBackground() {
  const background_images = shuffle(getImages());
  if (!background_images.length) return;

  console.log(`Imágenes de fondo cargadas (${background_images.length}):`, background_images);

  let current = 0;

  // Función que aplica la imagen de fondo actual al body,
  // y añade un overlay para mejorar la legibilidad del contenido.
  const changeBackground = (url) => {
    document.body.style.backgroundImage = `var(--overlay), url('${url}')`;
  };

  //Inicializamos el fondo con el primer fondo de la lista para la carga inicial.
  changeBackground(background_images[current].url);

  // Cambia la imagen de fondo cada INTERVAL milisegundos.
  setInterval(() => {
    current = (current + 1) % background_images.length;
    changeBackground(background_images[current].url);
  }, INTERVAL);
}
