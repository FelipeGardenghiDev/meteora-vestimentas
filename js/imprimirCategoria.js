import { adicionarProdutoAoLocalStorage } from "./adicionarProdutoAoLocalStorage.js";

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
          data-bs-toggle="modal" data-bs-target="#modal-${nomeId}">Ver mais</button>
      </div>
    `;

    card.innerHTML = images + cardBody;

    const gerarHTMLCarrossel = (imagens, nome) => {
      const urlsImagens = [imagens.mobile, imagens.tablet, imagens.desktop];
      return `
        <div id="carrossel-${nome}" class="slideshow-container">
          ${urlsImagens.map((urlImagem, indice) => `
            <div class="meusSlides-${nome} fade">
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
      <div class="modal fade" id="modal-${nomeId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-header-icon">
                <img src="assets/check-circle.svg">
                <h1 class="modal-title fs-5">Confira detalhes sobre o produto</h1>
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
                <p class="modal-seller">Vendido e entregue por Riachuelo</p>
                <hr class="divider-secondary">
                <p><b>Cores</b></p>
                <form>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="cor-${nomeId}" id="cor1-${nomeId}">
                    <label class="form-check-label" for="cor1-${nomeId}">Amarelo</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="cor-${nomeId}" id="cor2-${nomeId}">
                    <label class="form-check-label" for="cor2-${nomeId}">Offwhite</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="cor-${nomeId}" id="cor3-${nomeId}">
                    <label class="form-check-label" for="cor3-${nomeId}">Preto</label>
                  </div>
                </form>
                <hr class="divider-secondary">
                <p><b>Tamanho</b></p>
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
              <button type="button" class="btn botao-lilas" id="adicionar-btn-${nomeId}">Adicionar a sacola</button>
              <svg id="adicionar-favorito-${nomeId}" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"></path></svg>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modal);

    const mensagemDeAviso = document.querySelector(`#mensagem-carrinho-${nomeId}`);
    if (verificarItemNoCarrinho(produto)) {
      mensagemDeAviso.innerHTML = "<div class='alert alert-warning' role='alert'>Este item já está no seu carrinho!</div>";
    }

    const botao = document.querySelector(`#adicionar-btn-${nomeId}`);
    botao.addEventListener("click", () => adicionarProduto(produto));

    const favoritar = document.querySelector(`#adicionar-favorito-${nomeId}`);
    favoritar.addEventListener("click", () => favoritar.classList.toggle("animacao-coracao"));

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

  function elementoEstaNoViewport(elemento) {
    const r = elemento.getBoundingClientRect();
    return (
      r.top >= 0 &&
      r.left >= 0 &&
      r.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      r.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function elementoEstaNaSecaoDosCards(elemento) {
    const secao = document.getElementById("produtos");
    const re = elemento.getBoundingClientRect();
    const rs = secao.getBoundingClientRect();
    return re.top >= rs.top && re.bottom <= rs.bottom;
  }

  function verificarVisibilidadeDosCards() {
    document.querySelectorAll(".card").forEach((card) => {
      if (elementoEstaNaSecaoDosCards(card) && elementoEstaNoViewport(card)) {
        card.classList.add("fade-in");
      }
    });
  }

  verificarVisibilidadeDosCards();
  window.addEventListener("scroll", verificarVisibilidadeDosCards);
}
