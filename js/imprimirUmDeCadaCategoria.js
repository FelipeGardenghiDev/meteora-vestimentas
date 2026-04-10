import { adicionarProdutoAoLocalStorage } from "./adicionarProdutoAoLocalStorage.js";
import { traducoes } from "./i18n.js";
import { isFavorito, toggleFavorito } from "./favoritos.js";

function adicionarProduto(camiseta) {
  adicionarProdutoAoLocalStorage({
    nome: camiseta.nome,
    preco: camiseta.preco,
    descricao: camiseta.descricao,
    imagens: camiseta.imagens
  });
}

function verificarItemNoCarrinho(produto) {
  const sacola = JSON.parse(localStorage.getItem("sacola") || "[]");
  const nomesDosItensNaSacola = sacola.map(item => item.nome);
  return nomesDosItensNaSacola.includes(produto.nome);
}

export function imprimirUmDeCadaCategoria(produtos) {
  const row = document.querySelector("#produtos");

  const lang = (localStorage.getItem('localizacao') || 'BR') === 'EUA' ? 'en' : 'pt';
  const t = traducoes[lang];

  for (const categoria in produtos.produtos) {
    if (produtos.produtos.hasOwnProperty(categoria)) {
      const produto = produtos.produtos[categoria][0];

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
          <button type="button" class="btn btn-primary botao-lilas rounded-0 border-0" data-bs-toggle="modal" data-bs-target="#modal${categoria}">${t['ver-mais']}</button>
        </div>
      `;

      const gerarHTMLCarrossel = (imagens, nome) => {
        if (typeof imagens !== "object" || Array.isArray(imagens)) {
          console.error("as imagens devem ser enviadas como um objeto");
          return "";
        }
        const urlsImagens = [imagens.mobile, imagens.tablet, imagens.desktop];
        return `
        <div id="carrossel${nome}" class="slideshow-container">
          ${urlsImagens.map((urlImagem, indice) => `
            <div class="meusSlides-${nome}">
            <img src=${urlImagem} alt="imagem ${indice}" style="width: 100%">
            </div>
          `)}
          <a class="anterior" id="anterior-${nome}">&#10094;</a>
          <a class="proxima" id="proxima-${nome}">&#10095;</a>
        </div>
        `;
      };

      card.innerHTML = images + cardBody;

      const carrossel = gerarHTMLCarrossel(produto.imagens, produto.nome.replace(/\s+/g, "-"));

      const modalContent = `
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-header-icon">
              <img src="assets/check-circle.svg">
              <h1 class="modal-title fs-5" id="modalLabel${categoria}">${t['confira-produto']}</h1>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${carrossel}
            <div>
              <div id="mensagem-carrinho-${produto.nome.replace(/\s+/g, "-")}"></div>
              <h3>${produto.nome}</h3>
              <p class="modal-description">${produto.descricao}</p>
              <hr class="divider-principal">
              <p class="modal-price">${produto.preco}</p>
              <p class="modal-seller">${t['vendido-por']}</p>
              <hr class="divider-secondary">
              <p><b>${t['cores']}</b></p>
              <form>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="cor-${categoria}" id="cor1-${categoria}">
                  <label class="form-check-label" for="cor1-${categoria}">${t['cor-amarelo']}</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="cor-${categoria}" id="cor2-${categoria}">
                  <label class="form-check-label" for="cor2-${categoria}">${t['cor-offwhite']}</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="cor-${categoria}" id="cor3-${categoria}">
                  <label class="form-check-label" for="cor3-${categoria}">${t['cor-preto']}</label>
                </div>
              </form>
              <hr class="divider-secondary">
              <p><b>${t['tamanho']}</b></p>
              <form>
                <label class="radio-container" for="tam-p-${categoria}">
                  <input type="radio" name="tamanho-${categoria}" value="P" id="tam-p-${categoria}"/>
                  <span class="checkmark"></span>
                  <span class="radio-label">P</span>
                </label>
                <label class="radio-container" for="tam-m-${categoria}">
                  <input type="radio" name="tamanho-${categoria}" value="M" id="tam-m-${categoria}"/>
                  <span class="checkmark"></span>
                  <span class="radio-label">M</span>
                </label>
                <label class="radio-container" for="tam-g-${categoria}">
                  <input type="radio" name="tamanho-${categoria}" value="G" id="tam-g-${categoria}"/>
                  <span class="checkmark"></span>
                  <span class="radio-label">G</span>
                </label>
              </form>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn botao-lilas" id="adicionar-btn-${produto.nome.replace(/\s+/g, "-")}">${t['adicionar-sacola']}</button>
              <button class="btn btn-link p-0" id="adicionar-favorito-${produto.nome.replace(/\s+/g, "-")}" aria-label="Favoritar produto" title="Favoritar">
                <i class="bi ${isFavorito(produto) ? 'bi-heart-fill' : 'bi-heart'} fs-4" style="color: #9353FF;"></i>
              </button>
          </div>
        </div>
      `;

      const modal = `
        <div class="modal fade produto-modal" id="modal${categoria}" tabindex="-1" aria-labelledby="modalLabel${categoria}" aria-hidden="true">
          <div class="modal-dialog">
            ${modalContent}
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", modal);

      const mensagemDeAviso = document.querySelector(`#mensagem-carrinho-${produto.nome.replace(/\s+/g, "-")}`);
      if (verificarItemNoCarrinho(produto)) {
        mensagemDeAviso.innerHTML = `<div class='alert alert-warning' role='alert'>${t['ja-no-carrinho']}</div>`;
      }

      const botao = document.querySelector(`#adicionar-btn-${produto.nome.replace(/\s+/g, "-")}`);
      botao.addEventListener("click", () => {
        const langAtual = (localStorage.getItem('localizacao') || 'BR') === 'EUA' ? 'en' : 'pt';
        const tAtual = traducoes[langAtual];
        const corSelecionada = document.querySelector(`input[name="cor-${categoria}"]:checked`);
        const tamanhoSelecionado = document.querySelector(`input[name="tamanho-${categoria}"]:checked`);
        if (!corSelecionada || !tamanhoSelecionado) {
          mensagemDeAviso.innerHTML = `<div class='alert alert-danger' role='alert'>${tAtual['selecione-opcoes']}</div>`;
          setTimeout(() => { mensagemDeAviso.innerHTML = ''; }, 3000);
          return;
        }
        adicionarProduto(produto);
        mensagemDeAviso.innerHTML = `<div class='alert alert-success' role='alert'>${tAtual['adicionado-sacola']}</div>`;
        setTimeout(() => { mensagemDeAviso.innerHTML = ''; }, 3000);
      });

      const favoritar = document.querySelector(`#adicionar-favorito-${produto.nome.replace(/\s+/g, "-")}`);
      const iconeCoracao = favoritar.querySelector('i');
      favoritar.addEventListener("click", () => {
        const adicionado = toggleFavorito(produto);
        iconeCoracao.className = `bi ${adicionado ? 'bi-heart-fill' : 'bi-heart'} fs-4`;
        const langAtual = (localStorage.getItem('localizacao') || 'BR') === 'EUA' ? 'en' : 'pt';
        const tAtual = traducoes[langAtual];
        mensagemDeAviso.innerHTML = `<div class='alert alert-${adicionado ? 'success' : 'secondary'}' role='alert'>${tAtual[adicionado ? 'favorito-adicionado' : 'favorito-removido']}</div>`;
        setTimeout(() => { mensagemDeAviso.innerHTML = ''; }, 2500);
      });

      let indiceSlide = 1;
      const mostrarSlides = (numero) => {
        const slides = document.querySelectorAll(`.meusSlides-${produto.nome.replace(/\s+/g, "-")}`);
        if (numero > slides.length) indiceSlide = 1;
        if (numero < 1) indiceSlide = slides.length;
        slides.forEach(slide => slide.style.display = "none");
        slides[indiceSlide - 1].style.display = "block";
      };

      const maisSlides = (numero) => mostrarSlides(indiceSlide += numero);

      document.getElementById(`anterior-${produto.nome.replace(/\s+/g, "-")}`).onclick = () => maisSlides(-1);
      document.getElementById(`proxima-${produto.nome.replace(/\s+/g, "-")}`).onclick = () => maisSlides(1);

      mostrarSlides(indiceSlide);
    }
  }

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
