import { NAV_ITEMS } from '../data/nav_items.js';

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

export function initNav() {
  document.body.appendChild(buildNav());
}
