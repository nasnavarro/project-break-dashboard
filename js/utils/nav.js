import { NAV_ITEMS } from '../data/nav_items.js';

const DEFAULT_TITLE       = 'Project Break Dashboard Ignacio Navarro';
const DEFAULT_DESCRIPTION = 'Panel personal con reloj, meteorología, contraseñas y enlaces.';

// Función que actualiza el titulo y descripción del head de la página según el item activo
function updatePageMeta(item) {
  const title = item?.title || null;
  document.title = title ? `Project Break Dashboard Ignacio Navarro: ${title}` : DEFAULT_TITLE;
  document.querySelector('meta[name="description"]')?.setAttribute('content', title ?? DEFAULT_DESCRIPTION);
}

// Función que construye el menú de navegación a partir de los datos en NAV_ITEMS
function buildNav() {
  const page = document.body.dataset.page;
  const nav = document.createElement('nav');
  nav.className = 'menu';

  NAV_ITEMS.forEach(item => {
    const a = document.createElement('a');
    a.className = 'menu-item' + (item.id === page ? ' menu-item-active' : '');
    a.href = item.href;
    a.title = item.title;
    a.innerHTML = `<div class="menu-icon" aria-label="${item.title}">${item.icon}</div><span class="menu-label">${item.label}</span>`;
    nav.appendChild(a);
  });

  return nav;
}

// Función que inicializa la navegación: actualiza el meta y construye el menú
export function initNav() {
  const page = document.body.dataset.page;
  const activeItem = NAV_ITEMS.find(item => item.id === page);
  updatePageMeta(activeItem);
  document.body.appendChild(buildNav());
}
