// Módulo de generación de enlaces
const linkTitle = document.getElementById('link-title');
const linkUrl = document.getElementById('link-url');
const linkAddBtn = document.getElementById('link-add-btn');
const linkAddMessage = document.getElementById('link-add-result');
const linksDiv = document.getElementById('links-list');

// Devuelve true si el string es una URL válida con protocolo http o https.
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Función que procesa el enlace para añadirlo a la lista. (link = {title: title, url: url}).
const validateLink = (link) => {
    let retval = {result: true, error: ''};
    //Validamos en primer lugar que los valores introducidos sean corectos
    if(!link.title || !link.url){
        retval.result = false;
        retval.error = 'Es necesario poner un título y una url para el enlace.';
    }else if(!isValidUrl(link.url)){
        retval.result = false;
        retval.error = 'La url proporcionada no es válida.';
    }
    return retval;
}

// Devuelve true si ya existe un enlace con la misma URL en el contenedor.
// a.href devuelve una url normalizada, por lo que normalizamos tambuén el valor recibido para comparar.
// (link = {title: title, url: url}).
const linkExists = (link) => {
  const normalized = new URL(link.url).href;
  return [...linksDiv.querySelectorAll('.links-item-link')].some(a => a.href === normalized);
}

// Crea y añade al contenedor un elemento visual para el enlace dado. (link = {title: title, url: url}).
const createLinkElement = (link) => {
  const item = document.createElement('div');
  item.className = 'links-item';

  const newlink = document.createElement('a');
  newlink.className = 'links-item-link';
  newlink.href = link.url;
  newlink.textContent = link.title;
  newlink.target = '_blank';
  newlink.rel = 'noopener noreferrer';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'links-item-delete';
  deleteBtn.textContent = '×';

  item.append(newlink, deleteBtn);
  linksDiv.appendChild(item);
}

// Elimina un enlace del DOM.
const deleteLink = (e) => {
  e.target.closest('.links-item').remove();
}

// Función que añade un enlace
const addLink = () => {
    //Si no existe algún elemento de los que debemos utilizar, hacemos una salida limpia.
    if(!linkTitle || !linkUrl || !linkAddMessage || !linksDiv) return false;

    //Guardamos los valores en un objeto, que nos valdrá para el LocalStorage además de para el DOM.
    let link = {title: linkTitle.value, url: linkUrl.value};

    //Verificamos el titulo y la url
    const validate = validateLink(link);
    if(validate.result !== true){
        linkAddMessage.classList.add('links-result-error');
        linkAddMessage.textContent = validate.error;
    } else if (linkExists(link)) {
        linkAddMessage.classList.add('links-result-error');
        linkAddMessage.textContent = 'Este enlace ya está en la lista.';
    } else {
        //Limpiamos el contenedor de mensajes y le quitamos la clase de error.
        linkAddMessage.classList.remove('links-result-error');
        linkAddMessage.textContent = '';
        //Añadimos el enlace al contenedor.
        createLinkElement(link);
        //Añadimos el enlace al LocalStorage.

    }
}

// Delegación de eventos para eliminar enlaces.
linksDiv.addEventListener('click', e => {
  if (e.target.closest('.links-item-delete')) deleteLink(e);
});

// Añadimos una captura de evento para el botón.
linkAddBtn.addEventListener('click', addLink);
linkUrl.addEventListener('keydown', e => { if (e.key === 'Enter') addLink(); });

