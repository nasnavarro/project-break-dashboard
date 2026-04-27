import { validateLink, storeLink, removeStoredLinkFromUrl, getStoredLinks, sortStoredLinks } from '../utils/links.js';

const WIDGET_HTML = `
  <div class="links-form">
    <input type="text" id="link-title" class="links-input" placeholder="Título" />
    <input type="url" id="link-url" class="links-input" placeholder="https://..." />
    <button id="link-add-btn" class="links-btn">Añadir enlace</button>
  </div>
  <p class="links-result" id="link-add-result"></p>
  <div class="links-sort">
    <span class="links-sort-label">Ordenación</span>
    <button id="link-sort-az" class="links-sort-btn">AZ ↑</button>
    <button id="link-sort-za" class="links-sort-btn">ZA ↓</button>
  </div>
  <div class="links-list" id="links-list"></div>
`;

export function initLinkWidget(container) {
  container.insertAdjacentHTML('beforeend', WIDGET_HTML);

  const inputTitle  = container.querySelector('#link-title');
  const inputUrl    = container.querySelector('#link-url');
  const addBtn      = container.querySelector('#link-add-btn');
  const message     = container.querySelector('#link-add-result');
  const linksDiv    = container.querySelector('#links-list');

  const createLinkElement = (link) => {
    const item = document.createElement('div');
    item.className = 'links-item';

    const a = document.createElement('a');
    a.className = 'links-item-link';
    a.href = link.url;
    a.textContent = link.title;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'links-item-delete';
    deleteBtn.textContent = '×';

    item.append(a, deleteBtn);
    linksDiv.appendChild(item);
  }

  const renderAll = () => {
    linksDiv.textContent = '';
    getStoredLinks().forEach(createLinkElement);
  }

  const linkExists = (link) => {
    const normalized = new URL(link.url).href;
    return [...linksDiv.querySelectorAll('.links-item-link')].some(a => a.href === normalized);
  }

  const deleteLink = (e) => {
    const item = e.target.closest('.links-item');
    const a = item.querySelector('.links-item-link');
    removeStoredLinkFromUrl(a.href);
    item.remove();
  }

  const addLink = () => {
    const link = { title: inputTitle.value.trim(), url: inputUrl.value.trim() };
    const validation = validateLink(link);

    if (!validation.result) {
      message.className = 'links-result links-result-error';
      message.textContent = validation.error;
    } else if (linkExists(link)) {
      message.className = 'links-result links-result-error';
      message.textContent = 'Este enlace ya está en la lista.';
    } else {
      message.className = 'links-result';
      message.textContent = '';
      storeLink(link);
      createLinkElement(link);
      inputTitle.value = '';
      inputUrl.value = '';
    }
  }

  linksDiv.addEventListener('click', e => {
    if (e.target.closest('.links-item-delete')) deleteLink(e);
  });

  container.querySelector('#link-sort-az').addEventListener('click', () => { sortStoredLinks('az'); renderAll(); });
  container.querySelector('#link-sort-za').addEventListener('click', () => { sortStoredLinks('za'); renderAll(); });

  addBtn.addEventListener('click', addLink);
  inputUrl.addEventListener('keydown', e => { if (e.key === 'Enter') addLink(); });

  renderAll();
}

// Auto-init en cualquier página que tenga el contenedor.
const container = document.getElementById('links-container');
if (container) initLinkWidget(container);
