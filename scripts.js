import { carregarItensDaSacola } from "./js/carregarItensDaSacola.js";
import { imprimirCamisetas } from "./js/imprimirCamisetas.js";
import { imprimirUmDeCadaCategoria } from "./js/imprimirUmDeCadaCategoria.js";
import { imprimirCategoria } from "./js/imprimirCategoria.js";
import { aplicarTraducoes, traducoes } from "./js/i18n.js";

// Dark mode
let tema = localStorage.getItem('tema') || 'light';
// (data-theme already set by inline script in <head> to avoid FOUC)

function atualizarIconeDarkMode() {
  document.querySelectorAll('.dark-mode-btn i').forEach(icon => {
    icon.className = tema === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
  });
}

atualizarIconeDarkMode();

document.querySelectorAll('.dark-mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    tema = tema === 'dark' ? 'light' : 'dark';
    localStorage.setItem('tema', tema);
    document.documentElement.setAttribute('data-theme', tema);
    atualizarIconeDarkMode();
  });
});

function isPaginaSacola() {
  return window.location.pathname.includes("/sacola.html");
}

if (isPaginaSacola()) {
  carregarItensDaSacola();

  const btnFinalizar = document.getElementById('btn-finalizar-compra');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
      const modalEl = document.getElementById('checkoutModal');
      if (modalEl && window.bootstrap) {
        // Clear the cart
        localStorage.removeItem('sacola');
        // Translate modal to current language before showing
        const lang = (localStorage.getItem('localizacao') || 'BR') === 'EUA' ? 'en' : 'pt';
        aplicarTraducoes(lang);
        // Show success modal
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
        // Re-render the (now empty) cart when modal is dismissed via backdrop/keyboard
        modalEl.addEventListener('hidden.bs.modal', () => {
          carregarItensDaSacola();
        }, { once: true });
      }
    });
  }
}

const produtosHTML = document.getElementById("produtos");
const categoriaAtual = produtosHTML ? produtosHTML.dataset.categoria : null;
let localizacaoAtual = localStorage.getItem('localizacao') || "BR";

const langAtual = localizacaoAtual === 'EUA' ? 'en' : 'pt';
aplicarTraducoes(langAtual);

function carregarProdutos(localizacao) {
  if (!produtosHTML) return;
  // Remove previously injected product modals to prevent duplicate IDs on language switch
  document.querySelectorAll('.produto-modal').forEach(el => el.remove());
  while (produtosHTML.firstChild) {
    produtosHTML.removeChild(produtosHTML.firstChild);
  }

  let url = "./json/produtos.json";
  if (localizacao === "EUA") {
    url = "./json/products.json";
  }

  fetch(url)
    .then((response) => response.json())
    .then((produtosJSON) => {
      if (categoriaAtual === "todos") {
        const todosItens = Object.values(produtosJSON.produtos).flat();
        imprimirCategoria(todosItens);
      } else if (categoriaAtual === "camisetas") {
        imprimirCamisetas(produtosJSON.produtos.camisetas);
      } else if (categoriaAtual) {
        imprimirCategoria(produtosJSON.produtos[categoriaAtual]);
      } else {
        imprimirUmDeCadaCategoria(produtosJSON);
      }
    })
    .catch((error) => console.error("Erro ao carregar o arquivo JSON:", error));
}

carregarProdutos(localizacaoAtual);

function atualizarContadorCarrinho() {
  const sacola = JSON.parse(localStorage.getItem("sacola")) || [];
  const total = sacola.reduce((acc, item) => acc + (item.quantidade || 1), 0);
  const el = document.getElementById("carrinho-numero");
  if (el) el.textContent = total;
}

function atualizarContadorFavoritos() {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const el = document.getElementById("favoritos-numero");
  if (el) el.textContent = favoritos.length;
}

const carrinhoIcone = document.querySelector(".bi-cart2");
if (carrinhoIcone) {
  const sacola = JSON.parse(localStorage.getItem("sacola"));
  const quantidadeDeItensNaSacola = sacola ? sacola.reduce((acc, item) => acc + (item.quantidade || 1), 0) : 0;
  const numeroDeItens = document.createElement("span");
  numeroDeItens.id = "carrinho-numero";
  numeroDeItens.textContent = quantidadeDeItensNaSacola;
  carrinhoIcone.appendChild(numeroDeItens);
}

const favoritosIcone = document.getElementById("nav-favoritos-icone");
if (favoritosIcone) {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const numFav = document.createElement("span");
  numFav.id = "favoritos-numero";
  numFav.textContent = favoritos.length;
  favoritosIcone.appendChild(numFav);
}

document.addEventListener('sacola-atualizada', atualizarContadorCarrinho);
document.addEventListener('favoritos-atualizados', atualizarContadorFavoritos);

const inputPesquisa = document.querySelector("#input-pesquisa");
const divSugestoes = document.querySelector("#sugestoes-pesquisa");

// Mapping: display name → page (both languages)
const SUGESTOES = {
  pt: [
    { texto: 'Camisetas', pagina: 'camisetas.html' },
    { texto: 'Calças',    pagina: 'calcas.html' },
    { texto: 'Calçados',  pagina: 'calcados.html' },
    { texto: 'Bolsas',    pagina: 'bolsas.html' },
    { texto: 'Óculos',    pagina: 'oculos.html' },
    { texto: 'Casacos',   pagina: 'casacos.html' },
  ],
  en: [
    { texto: 'T-Shirts',  pagina: 'camisetas.html' },
    { texto: 'Pants',     pagina: 'calcas.html' },
    { texto: 'Footwear',  pagina: 'calcados.html' },
    { texto: 'Bags',      pagina: 'bolsas.html' },
    { texto: 'Eyewear',   pagina: 'oculos.html' },
    { texto: 'Jackets',   pagina: 'casacos.html' },
  ],
};

function getLang() {
  return localizacaoAtual === 'EUA' ? 'en' : 'pt';
}

function mostrarSugestoes(termo) {
  if (!divSugestoes) return;
  const lang = getLang();
  const t = traducoes[lang] || traducoes['pt'];

  if (!termo) {
    divSugestoes.innerHTML = '';
    return;
  }

  const resultados = SUGESTOES[lang].filter(s =>
    s.texto.toLowerCase().includes(termo.toLowerCase())
  );

  if (resultados.length === 0) {
    divSugestoes.innerHTML = `<div class="sugestao sugestao-vazia">${t['search-sem-resultados'] || 'Nenhum resultado.'}</div>`;
  } else {
    divSugestoes.innerHTML = resultados
      .map(s => `<div class="sugestao" data-pagina="${s.pagina}">${s.texto}</div>`)
      .join('');

    divSugestoes.querySelectorAll('.sugestao[data-pagina]').forEach(el => {
      el.addEventListener('click', () => {
        window.location.href = el.dataset.pagina;
      });
    });
  }
}

function navegarPorPesquisa(termo) {
  if (!termo) return;
  const lang = getLang();
  const match = SUGESTOES[lang].find(s =>
    s.texto.toLowerCase().includes(termo.toLowerCase()) ||
    termo.toLowerCase().includes(s.texto.toLowerCase().slice(0, 4))
  );
  if (match) {
    window.location.href = match.pagina;
  } else {
    mostrarSugestoes(termo);
    inputPesquisa?.focus();
  }
}

if (inputPesquisa && divSugestoes) {
  inputPesquisa.addEventListener('input', () => {
    mostrarSugestoes(inputPesquisa.value.trim());
  });

  // Submit: prevent page reload, navigate to category
  const searchForm = inputPesquisa.closest('form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      navegarPorPesquisa(inputPesquisa.value.trim());
    });
  }

  document.addEventListener('click', (e) => {
    if (!inputPesquisa.contains(e.target) && !divSugestoes.contains(e.target)) {
      divSugestoes.innerHTML = '';
    }
  });
}

// Newsletter email validation
const newsletterBtn = document.querySelector('#button-addon2');
const newsletterInput = document.querySelector('.div-novidades input[type="email"]');
if (newsletterBtn && newsletterInput) {
  // Remove Bootstrap's direct modal trigger so we can validate first
  newsletterBtn.removeAttribute('data-bs-toggle');
  newsletterBtn.removeAttribute('data-bs-target');

  newsletterBtn.addEventListener('click', () => {
    const email = newsletterInput.value.trim();
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValido) {
      const lang = getLang();
      const msg = lang === 'en' ? 'Please enter a valid email address.' : 'Digite um e-mail válido.';
      newsletterInput.setCustomValidity(msg);
      newsletterInput.reportValidity();
    } else {
      newsletterInput.setCustomValidity('');
      const modalEl = document.getElementById('emailModal');
      if (modalEl && window.bootstrap) {
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
        newsletterInput.value = '';
      }
    }
  });

  newsletterInput.addEventListener('input', () => {
    newsletterInput.setCustomValidity('');
  });
}

// Locale switcher — works on all pages
document.querySelectorAll('.locale-btn').forEach(btn => {
  if (btn.dataset.locale === localizacaoAtual) btn.classList.add('active');

  btn.addEventListener('click', () => {
    document.querySelectorAll('.locale-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    localizacaoAtual = btn.dataset.locale;
    localStorage.setItem('localizacao', localizacaoAtual);

    const novaLang = localizacaoAtual === 'EUA' ? 'en' : 'pt';
    aplicarTraducoes(novaLang);
    carregarProdutos(localizacaoAtual);
    if (isPaginaSacola()) {
      carregarItensDaSacola();
    }
    document.dispatchEvent(new CustomEvent('locale-changed', { detail: { lang: novaLang } }));
  });
});