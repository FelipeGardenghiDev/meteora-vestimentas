import { adicionarProdutoAoLocalStorage } from "./adicionarProdutoAoLocalStorage.js";
import { traducoes } from "./i18n.js";
import { isFavorito, toggleFavorito } from "./favoritos.js";

function adicionarProduto(item) {
  adicionarProdutoAoLocalStorage({
    nome: item.nome,
    preco: item.preco,
    descricao: item.descricao,
    imagens: item.imagens
  });
}

function verificarItemNoCarrinho(produto) {
  const sacola = JSON.parse(localStorage.getItem("sacola") || "[]");
  return sacola.some(item => item.nome === produto.nome);
}

export function imprimirCategoria(itens) {
  const row = document.querySelector("#produtos");
  if (!row || !itens || !itens.length) return;

  const lang = (localStorage.getItem('localizacao') || 'BR') === 'EUA' ? 'en' : 'pt';
  const t = traducoes[lang];

  itens.forEach((produto, index) => {
    const nomeId = produto.nome.replace(/\s+/g, "-") + "-" + index;

    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-xxl-4 pb-4";
    row.appendChild(col);

    const card = document.createElement("div");
    card.className = "card card-animado";
    col.appendChild(card);

    const images = `
      <img class="d-block d-md-none" src="${produto.imagens.mobile}" alt="${produto.nome}">
      <img class="d-none d-md-block d-xl-none" src="${produto.imagens.tablet}" alt="${produto.nome}">
      <img class="d-none d-xl-block" src="${produto.imagens.desktop}" alt="${produto.nome}">
    `;

    const cardBody = `
      <div class="card-body">
        <h5 class="card-title fw-bold">${produto.nome}</h5>
        <p class="card-text">${produto.descricao}</p>
        <p class="fw-bold">${produto.preco}</p>
        <button type="button" class="btn btn-primary botao-lilas rounded-0 border-0"
          data-bs-toggle="modal" data-bs-target="#modal-${nomeId}">${t['ver-mais']}</button>
      </div>
    `;

    card.innerHTML = images + cardBody;

    const gerarHTMLCarrossel = (imagens, nome) => {
      const urlsImagens = [imagens.mobile, imagens.tablet, imagens.desktop];
      return `
        <div id="carrossel-${nome}" class="slideshow-container">
          ${urlsImagens.map((urlImagem, indice) => `
            <div class="meusSlides-${nome}">
              <img src="${urlImagem}" alt="imagem ${indice + 1}" style="width: 100%">
            </div>
          `).join("")}
          <a class="anterior" id="anterior-${nome}">&#10094;</a>
          <a class="proxima" id="proxima-${nome}">&#10095;</a>
        </div>
      `;
    };

    const carrossel = gerarHTMLCarrossel(produto.imagens, nomeId);

    const modal = `
      <div class="modal fade produto-modal" id="modal-${nomeId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-header-icon">
                <img src="assets/check-circle.svg">
                <h1 class="modal-title fs-5">${t['confira-produto']}</h1>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ${carrossel}
              <div>
                <div id="mensagem-carrinho-${nomeId}"></div>
                <h3>${produto.nome}</h3>
                <p class="modal-description">${produto.descricao}</p>
                <hr class="divider-principal">
                <p class="modal-price">${produto.preco}</p>
                <p class="modal-seller">${t['vendido-por']}</p>
                <hr class="divider-secondary">
                <p><b>${t['cores']}</b></p>
                <form>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="cor-${nomeId}" id="cor1-${nomeId}">
                    <label class="form-check-label" for="cor1-${nomeId}">${t['cor-amarelo']}</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="cor-${nomeId}" id="cor2-${nomeId}">
                    <label class="form-check-label" for="cor2-${nomeId}">${t['cor-offwhite']}</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="cor-${nomeId}" id="cor3-${nomeId}">
                    <label class="form-check-label" for="cor3-${nomeId}">${t['cor-preto']}</label>
                  </div>
                </form>
                <hr class="divider-secondary">
                <p><b>${t['tamanho']}</b></p>
                <form>
                  <label class="radio-container" for="tam-p-${nomeId}">
                    <input type="radio" name="tamanho-${nomeId}" value="P" id="tam-p-${nomeId}"/>
                    <span class="checkmark"></span>
                    <span class="radio-label">P</span>
                  </label>
                  <label class="radio-container" for="tam-m-${nomeId}">
                    <input type="radio" name="tamanho-${nomeId}" value="M" id="tam-m-${nomeId}"/>
                    <span class="checkmark"></span>
                    <span class="radio-label">M</span>
                  </label>
                  <label class="radio-container" for="tam-g-${nomeId}">
                    <input type="radio" name="tamanho-${nomeId}" value="G" id="tam-g-${nomeId}"/>
                    <span class="checkmark"></span>
                    <span class="radio-label">G</span>
                  </label>
                </form>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn botao-lilas" id="adicionar-btn-${nomeId}">${t['adicionar-sacola']}</button>
              <button class="btn btn-link p-0" id="adicionar-favorito-${nomeId}" aria-label="Favoritar produto" title="Favoritar">
                <i class="bi ${isFavorito(produto) ? 'bi-heart-fill' : 'bi-heart'} fs-4" style="color: #9353FF;"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modal);

    const mensagemDeAviso = document.querySelector(`#mensagem-carrinho-${nomeId}`);
    if (verificarItemNoCarrinho(produto)) {
      mensagemDeAviso.innerHTML = `<div class='alert alert-warning' role='alert'>${t['ja-no-carrinho']}</div>`;
    }

    const botao = document.querySelector(`#adicionar-btn-${nomeId}`);
    botao.addEventListener("click", () => {
      const lang = (localStorage.getItem('localizacao') || 'BR') === 'EUA' ? 'en' : 'pt';
      const tAtual = traducoes[lang];
      const corSelecionada = document.querySelector(`input[name="cor-${nomeId}"]:checked`);
      const tamanhoSelecionado = document.querySelector(`input[name="tamanho-${nomeId}"]:checked`);
      if (!corSelecionada || !tamanhoSelecionado) {
        mensagemDeAviso.innerHTML = `<div class='alert alert-danger' role='alert'>${tAtual['selecione-opcoes']}</div>`;
        setTimeout(() => { mensagemDeAviso.innerHTML = ''; }, 3000);
        return;
      }
      adicionarProduto(produto);
      mensagemDeAviso.innerHTML = `<div class='alert alert-success' role='alert'>${tAtual['adicionado-sacola']}</div>`;
      setTimeout(() => { mensagemDeAviso.innerHTML = ''; }, 3000);
    });

    const favoritar = document.querySelector(`#adicionar-favorito-${nomeId}`);
    const iconeCoracao = favoritar.querySelector('i');
    favoritar.addEventListener("click", () => {
      const adicionado = toggleFavorito(produto);
      iconeCoracao.className = `bi ${adicionado ? 'bi-heart-fill' : 'bi-heart'} fs-4`;
      const lang = (localStorage.getItem('localizacao') || 'BR') === 'EUA' ? 'en' : 'pt';
      const tAtual = traducoes[lang];
      mensagemDeAviso.innerHTML = `<div class='alert alert-${adicionado ? 'success' : 'secondary'}' role='alert'>${tAtual[adicionado ? 'favorito-adicionado' : 'favorito-removido']}</div>`;
      setTimeout(() => { mensagemDeAviso.innerHTML = ''; }, 2500);
    });

    let indiceSlide = 1;
    const mostrarSlides = (numero) => {
      const slides = document.querySelectorAll(`.meusSlides-${nomeId}`);
      if (numero > slides.length) indiceSlide = 1;
      if (numero < 1) indiceSlide = slides.length;
      slides.forEach(slide => slide.style.display = "none");
      slides[indiceSlide - 1].style.display = "block";
    };

    const maisSlides = (n) => mostrarSlides(indiceSlide += n);

    document.getElementById(`anterior-${nomeId}`).onclick = () => maisSlides(-1);
    document.getElementById(`proxima-${nomeId}`).onclick = () => maisSlides(1);

    mostrarSlides(indiceSlide);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".card-animado").forEach(card => observer.observe(card));
}
