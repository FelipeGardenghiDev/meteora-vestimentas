import { traducoes } from "./i18n.js";

function parsearPreco(preco) {
  return parseFloat(preco.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
}

function formatarTotal(total, locale) {
  if (locale === 'EUA') {
    return '$' + total.toFixed(2);
  }
  return 'R$' + total.toFixed(2).replace('.', ',');
}

function salvarSacola(sacola) {
  localStorage.setItem('sacola', JSON.stringify(sacola));
}

function calcularTotal(sacola) {
  return sacola.reduce((acc, item) => acc + parsearPreco(item.preco) * (item.quantidade || 1), 0);
}

function atualizarTotal(sacola) {
  const locale = localStorage.getItem('localizacao') || 'BR';
  const totalEl = document.getElementById('sacola-total-valor');
  if (totalEl) {
    totalEl.textContent = formatarTotal(calcularTotal(sacola), locale);
  }
  const contador = document.getElementById('carrinho-numero');
  if (contador) {
    contador.textContent = sacola.reduce((acc, item) => acc + (item.quantidade || 1), 0);
  }
}

async function carregarLangMap(locale) {
  const url = locale === 'EUA' ? './json/products.json' : './json/produtos.json';
  try {
    const resp = await fetch(url);
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

export async function carregarItensDaSacola() {
  const locale = localStorage.getItem('localizacao') || 'BR';
  const lang = locale === 'EUA' ? 'en' : 'pt';
  const t = traducoes[lang];

  let sacola = JSON.parse(localStorage.getItem("sacola")) || [];
  const listaSacola = document.getElementById("sacola");
  const secaoTotal = document.getElementById("sacola-total-secao");
  const sacolaVazia = document.getElementById("sacola-vazia");

  if (!listaSacola) return;

  listaSacola.innerHTML = '';

  if (sacola.length === 0) {
    listaSacola.style.display = 'none';
    if (sacolaVazia) sacolaVazia.style.display = 'block';
    if (secaoTotal) secaoTotal.style.display = 'none';
    return;
  }

  listaSacola.style.display = 'block';
  if (sacolaVazia) sacolaVazia.style.display = 'none';
  if (secaoTotal) secaoTotal.style.display = 'flex';

  // Load current-language product data for display
  const langMap = await carregarLangMap(locale);

  sacola.forEach((item) => {
    const stableKey = item?.imagens?.desktop || item?.nome;
    const langInfo = langMap[stableKey] || { nome: item.nome, descricao: item.descricao, preco: item.preco };

    const quantidade = item.quantidade || 1;
    const listItem = document.createElement("li");
    listItem.className = "item-list";
    listItem.dataset.key = stableKey;

    listItem.setAttribute('aria-label', `${langInfo.nome} - ${langInfo.preco}`);

    listItem.innerHTML = `
      <div class="item-list-product">
        <img src="${item.imagens.desktop}" class="preview" alt="${langInfo.nome}">
        <div>
          <h4>${langInfo.nome}</h4>
          <p>${langInfo.descricao}</p>
        </div>
      </div>
      <p class="item-price">${langInfo.preco}</p>
      <div class="item-number">
        <p data-i18n="sacola-quantidade">${t['sacola-quantidade'] || 'Quantidade'}</p>
        <button class="btn-mais" aria-label="Aumentar quantidade">
          <i class="bi bi-plus-lg" aria-hidden="true"></i>
        </button>
        <input type="number" value="${quantidade}" min="1" class="qty-input">
        <button class="btn-menos" aria-label="Diminuir quantidade">
          <i class="bi bi-dash-lg" aria-hidden="true"></i>
        </button>
      </div>
      <button class="delete" aria-label="Remover item">
        <i class="bi bi-trash" aria-hidden="true"></i>
      </button>
    `;

    listaSacola.appendChild(listItem);

    const btnMais = listItem.querySelector(".btn-mais");
    const btnMenos = listItem.querySelector(".btn-menos");
    const qtyInput = listItem.querySelector(".qty-input");

    btnMais.addEventListener("click", () => {
      const idx = sacola.findIndex(i => (i?.imagens?.desktop || i?.nome) === stableKey);
      if (idx !== -1) {
        sacola[idx].quantidade = (sacola[idx].quantidade || 1) + 1;
        qtyInput.value = sacola[idx].quantidade;
        salvarSacola(sacola);
        atualizarTotal(sacola);
      }
    });

    btnMenos.addEventListener("click", () => {
      const idx = sacola.findIndex(i => (i?.imagens?.desktop || i?.nome) === stableKey);
      if (idx !== -1 && (sacola[idx].quantidade || 1) > 1) {
        sacola[idx].quantidade = (sacola[idx].quantidade || 1) - 1;
        qtyInput.value = sacola[idx].quantidade;
        salvarSacola(sacola);
        atualizarTotal(sacola);
      }
    });

    qtyInput.addEventListener("change", () => {
      const val = parseInt(qtyInput.value);
      const idx = sacola.findIndex(i => (i?.imagens?.desktop || i?.nome) === stableKey);
      if (idx !== -1 && val >= 1) {
        sacola[idx].quantidade = val;
        salvarSacola(sacola);
        atualizarTotal(sacola);
      } else {
        qtyInput.value = sacola[idx]?.quantidade || 1;
      }
    });

    listItem.querySelector(".delete").addEventListener("click", () => {
      const langNow = (localStorage.getItem('localizacao') || 'BR') === 'EUA' ? 'en' : 'pt';
      const tNow = traducoes[langNow];
      if (confirm(tNow['confirm-excluir'])) {
        sacola = sacola.filter(i => (i?.imagens?.desktop || i?.nome) !== stableKey);
        salvarSacola(sacola);
        listaSacola.removeChild(listItem);
        atualizarTotal(sacola);
        if (sacola.length === 0) {
          listaSacola.style.display = 'none';
          if (sacolaVazia) sacolaVazia.style.display = 'block';
          if (secaoTotal) secaoTotal.style.display = 'none';
        }
      }
    });
  });

  atualizarTotal(sacola);
}
