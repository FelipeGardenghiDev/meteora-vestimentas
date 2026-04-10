import { getFavoritos, toggleFavorito } from './favoritos.js';
import { traducoes } from './i18n.js';
import { adicionarProdutoAoLocalStorage } from './adicionarProdutoAoLocalStorage.js';

async function getLangData() {
  const locale = localStorage.getItem('localizacao') || 'BR';
  const jsonUrl = locale === 'EUA' ? './json/products.json' : './json/produtos.json';
  try {
    const resp = await fetch(jsonUrl);
    const data = await resp.json();
    const map = {};
    Object.values(data.produtos).flat().forEach(p => {
      if (p.imagens && p.imagens.desktop) {
        map[p.imagens.desktop] = { nome: p.nome, descricao: p.descricao, preco: p.preco };
      }
    });
    return map;
  } catch (e) {
    return {};
  }
}

async function renderFavoritos() {
  const lang = (localStorage.getItem('localizacao') || 'BR') === 'EUA' ? 'en' : 'pt';
  const t = traducoes[lang];
  const favoritos = getFavoritos();
  const lista = document.getElementById('favoritos-lista');
  const vazio = document.getElementById('favoritos-vazio');

  if (!lista || !vazio) return;

  lista.innerHTML = '';

  if (favoritos.length === 0) {
    vazio.style.display = 'block';
    lista.style.display = 'none';
    return;
  }

  vazio.style.display = 'none';
  lista.style.display = '';

  const langMap = await getLangData();

  favoritos.forEach(produto => {
    if (!produto || !produto.imagens) return;

    // Look up current-language data using stable image path key
    const key = produto.imagens.desktop;
    const info = langMap[key] || { nome: produto.nome, descricao: produto.descricao, preco: produto.preco };

    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 card-animado fade-in">
        <img src="${produto.imagens.desktop}" class="card-img-top" alt="${info.nome || ''}" style="object-fit:cover;max-height:260px;">
        <div class="card-body">
          <h5 class="card-title fw-bold">${info.nome || ''}</h5>
          <p class="card-text">${info.descricao || ''}</p>
          <p class="fw-bold">${info.preco || ''}</p>
        </div>
        <div class="card-footer d-flex gap-2">
          <button class="btn botao-lilas flex-grow-1 btn-add-cart">
            ${t['favoritos-adicionar'] || t['adicionar-sacola']}
          </button>
          <button class="btn btn-link p-0 btn-remove-fav" aria-label="${t['favoritos-remover'] || 'Remover dos favoritos'}" title="${t['favoritos-remover'] || 'Remover dos favoritos'}">
            <i class="bi bi-heart-fill fs-4" style="color: #9353FF;"></i>
          </button>
        </div>
      </div>
    `;
    lista.appendChild(col);

    col.querySelector('.btn-add-cart').addEventListener('click', () => {
      adicionarProdutoAoLocalStorage(produto);
    });

    col.querySelector('.btn-remove-fav').addEventListener('click', () => {
      const langNow = (localStorage.getItem('localizacao') || 'BR') === 'EUA' ? 'en' : 'pt';
      const tNow = traducoes[langNow];
      if (confirm(tNow['confirm-favorito-remover'])) {
        toggleFavorito(produto);
        renderFavoritos();
      }
    });
  });
}

document.addEventListener('locale-changed', renderFavoritos);

// Modules are deferred; DOM is ready by the time this runs
renderFavoritos();
