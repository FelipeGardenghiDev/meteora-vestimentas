const FAVORITOS_KEY = 'favoritos';

export function getFavoritos() {
  return JSON.parse(localStorage.getItem(FAVORITOS_KEY)) || [];
}

function getKey(produto) {
  return produto?.imagens?.desktop || produto?.nome || '';
}

export function isFavorito(produto) {
  const key = getKey(produto);
  return getFavoritos().some(f => getKey(f) === key);
}

export function toggleFavorito(produto) {
  let favoritos = getFavoritos();
  const key = getKey(produto);
  const idx = favoritos.findIndex(f => getKey(f) === key);
  if (idx !== -1) {
    favoritos.splice(idx, 1);
  } else {
    favoritos.push(produto);
  }
  localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
  document.dispatchEvent(new CustomEvent('favoritos-atualizados'));
  return idx === -1; // true = added, false = removed
}
