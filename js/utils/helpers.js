// Wrapper sobre fetch que lanza un Error descriptivo si el status HTTP no es ok,
// e intenta incluir el body de la respuesta en el mensaje de error.
export async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} - ${res.statusText}${body ? ' | ' + body : ''}`);
  }
  return res.json();
}
