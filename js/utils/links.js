// Módulo de lógica pura para el gestor de enlaces.

export const LS_LINKS_KEY = 'my_links';

// Devuelve true si el string es una URL válida con protocolo http o https.
export const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Devuelve {result, error} tras validar título y URL. (link = {title, url}).
export const validateLink = (link) => {
  if (!link.title || !link.url) return { result: false, error: 'Es necesario poner un título y una url para el enlace.' };
  if (!isValidUrl(link.url))    return { result: false, error: 'La url proporcionada no es válida.' };
  return { result: true, error: '' };
}

// Guarda un enlace en localStorage.
export const storeLink = (link) => {
  const ls = localStorage.getItem(LS_LINKS_KEY);
  const links = ls ? JSON.parse(ls) : [];
  links.push(link);
  localStorage.setItem(LS_LINKS_KEY, JSON.stringify(links));
}

// Elimina de localStorage el enlace con la URL indicada (normalizada).
export const removeStoredLinkFromUrl = (url) => {
  const ls = localStorage.getItem(LS_LINKS_KEY);
  if (!ls) return;
  const filtered = JSON.parse(ls).filter(link => new URL(link.url).href !== url);
  localStorage.setItem(LS_LINKS_KEY, JSON.stringify(filtered));
}

// Devuelve los enlaces guardados en localStorage.
export const getStoredLinks = () => {
  const ls = localStorage.getItem(LS_LINKS_KEY);
  return ls ? JSON.parse(ls) : [];
}

// Ordena y persiste los enlaces por título en la dirección indicada ('az' o 'za').
export const sortStoredLinks = (direction) => {
  const sorted = getStoredLinks().sort((a, b) => direction === 'az'
    ? a.title.localeCompare(b.title, 'es', { sensitivity: 'base' })
    : b.title.localeCompare(a.title, 'es', { sensitivity: 'base' })
  );
  localStorage.setItem(LS_LINKS_KEY, JSON.stringify(sorted));
}
