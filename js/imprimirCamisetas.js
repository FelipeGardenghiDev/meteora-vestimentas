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
  return sacola.some(item => item.nome === produto.nome);
}

export function imprimirCamisetas(camisetas) {
  const row = document.querySelector("#produtos");

  const lang = (localStorage.getItem('localizacao') || 'BR') === 'EUA' ? 'en' : 'pt';
  const t = traducoes[lang];

  camisetas.forEach((camiseta) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-xxl-4 pb-4";
    row.appendChild(col);

    const card = document.createElement("div");
    card.className = "card";
    col.appendChild(card);

    const images = `
      <img class="d-block d-md-none" src="${camiseta.imagens.mobile}" alt="${camiseta.nome}">
      <img class="d-none d-md-block d-xl-none" src="${camiseta.imagens.tablet}" alt="${camiseta.nome}">
      <img class="d-none d-xl-block" src="${camiseta.imagens.desktop}" alt="${camiseta.nome}">
    `;

    const cardBody = `
      <div class="card-body">
        <h5 class="card-title fw-bold">${camiseta.nome}</h5>
        <p class="card-text">${camiseta.descricao}</p>
        <p class="fw-bold">${camiseta.preco}</p>
        <button type="button" class="btn btn-primary botao-lilas rounded-0 border-0" data-bs-toggle="modal" data-bs-target="#modal${camiseta.nome.replace(
      /\s+/g,
      "-"
    )}">${t['ver-mais']}</button>
      </div>
    `;

    card.innerHTML = images + cardBody;

    const modalContent = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-header-icon">
            <img src="assets/check-circle.svg">
            <h1 class="modal-title fs-5" id="modalLabel${camiseta.nome.replace(
      /\s+/g,
      "-"
    )}">${t['confira-produto']}</h1>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <img class="modal-imagem" src="${camiseta.imagens.desktop}" alt="${camiseta.nome}">
          <div>
            <div id="mensagem-carrinho-${camiseta.nome.replace(/\s+/g, "-")}"></div>
            <h3>${camiseta.nome}</h3>
            <p class="modal-description">${camiseta.descricao}</p>

            <hr class="divider-principal">

            <p class="modal-price">${camiseta.preco}</p>
            <p class="modal-seller">${t['vendido-por']}</p>

            <hr class="divider-secondary">
            <p><b>${t['cores']}</b></p>
            <form>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="cor-${camiseta.nome.replace(/\s+/g, '-')}" id="cor1-${camiseta.nome.replace(/\s+/g, '-')}">
                <label class="form-check-label" for="cor1-${camiseta.nome.replace(/\s+/g, '-')}">${t['cor-amarelo']}</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="cor-${camiseta.nome.replace(/\s+/g, '-')}" id="cor2-${camiseta.nome.replace(/\s+/g, '-')}">
                <label class="form-check-label" for="cor2-${camiseta.nome.replace(/\s+/g, '-')}">${t['cor-offwhite']}</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="cor-${camiseta.nome.replace(/\s+/g, '-')}" id="cor3-${camiseta.nome.replace(/\s+/g, '-')}">
                <label class="form-check-label" for="cor3-${camiseta.nome.replace(/\s+/g, '-')}">${t['cor-preto']}</label>
              </div>
            </form>

            <hr class="divider-secondary">

            <p><b>${t['tamanho']}</b></p>
            <form>
              <label class="radio-container" for="tam-p-${camiseta.nome.replace(/\s+/g, '-')}">
                <input type="radio" name="tamanho-${camiseta.nome.replace(/\s+/g, '-')}" value="P" id="tam-p-${camiseta.nome.replace(/\s+/g, '-')}"/>
                <span class="checkmark"></span>
                <span class="radio-label">P</span>
              </label>
              <label class="radio-container" for="tam-m-${camiseta.nome.replace(/\s+/g, '-')}">
                <input type="radio" name="tamanho-${camiseta.nome.replace(/\s+/g, '-')}" value="M" id="tam-m-${camiseta.nome.replace(/\s+/g, '-')}"/>
                <span class="checkmark"></span>
                <span class="radio-label">M</span>
              </label>
              <label class="radio-container" for="tam-g-${camiseta.nome.replace(/\s+/g, '-')}">
                <input type="radio" name="tamanho-${camiseta.nome.replace(/\s+/g, '-')}" value="G" id="tam-g-${camiseta.nome.replace(/\s+/g, '-')}"/>
                <span class="checkmark"></span>
                <span class="radio-label">G</span>
              </label>
            </form>
          </div>
        </div>
<div class="modal-footer">
<div id="mensagem-aviso-modal-${camiseta.nome.replace(/\s+/g, "-")}"></div>
<button type="button" class="btn botao-lilas" id="adicionar-btn-${camiseta.nome.replace(/\s+/g, "-")}">${t['adicionar-sacola']}</button>
<button class="btn btn-link p-0" id="adicionar-favorito-${camiseta.nome.replace(/\s+/g, "-")}" aria-label="Favoritar produto" title="Favoritar">
  <i class="bi ${isFavorito(camiseta) ? 'bi-heart-fill' : 'bi-heart'} fs-4" style="color: #9353FF;"></i>
</button>
</div>



      </div>
    `;

    const modal = `
      <div class="modal fade produto-modal" id="modal${camiseta.nome.replace(/\s+/g, "-")}">
        <div class="modal-dialog">
          ${modalContent}
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modal);

    const mensagemDeAviso = document.querySelector(`#mensagem-carrinho-${camiseta.nome.replace(/\s+/g, "-")}`);
    if (verificarItemNoCarrinho(camiseta)) {
      mensagemDeAviso.innerHTML = `<div class='alert alert-warning' role='alert'>${t['ja-no-carrinho']}</div>`;
    }

    const botao = document.querySelector(`#adicionar-btn-${camiseta.nome.replace(/\s+/g, "-")}`);
    botao.addEventListener("click", () => {
      const lang = (localStorage.getItem('localizacao') || 'BR') === 'EUA' ? 'en' : 'pt';
      const tAtual = traducoes[lang];
      const nomeId = camiseta.nome.replace(/\s+/g, '-');
      const corSelecionada = document.querySelector(`input[name="cor-${nomeId}"]:checked`);
      const tamanhoSelecionado = document.querySelector(`input[name="tamanho-${nomeId}"]:checked`);
      if (!corSelecionada || !tamanhoSelecionado) {
        mensagemDeAviso.innerHTML = `<div class='alert alert-danger' role='alert'>${tAtual['selecione-opcoes']}</div>`;
        setTimeout(() => { mensagemDeAviso.innerHTML = ''; }, 3000);
        return;
      }
      adicionarProduto(camiseta);
      mensagemDeAviso.innerHTML = `<div class='alert alert-success' role='alert'>${tAtual['adicionado-sacola']}</div>`;
      setTimeout(() => { mensagemDeAviso.innerHTML = ''; }, 3000);
    });

    const favoritar = document.querySelector(`#adicionar-favorito-${camiseta.nome.replace(/\s+/g, "-")}`);
    const iconeCoracao = favoritar.querySelector('i');
    favoritar.addEventListener("click", () => {
      const adicionado = toggleFavorito(camiseta);
      iconeCoracao.className = `bi ${adicionado ? 'bi-heart-fill' : 'bi-heart'} fs-4`;
      const lang = (localStorage.getItem('localizacao') || 'BR') === 'EUA' ? 'en' : 'pt';
      const tAtual = traducoes[lang];
      mensagemDeAviso.innerHTML = `<div class='alert alert-${adicionado ? 'success' : 'secondary'}' role='alert'>${tAtual[adicionado ? 'favorito-adicionado' : 'favorito-removido']}</div>`;
      setTimeout(() => { mensagemDeAviso.innerHTML = ''; }, 2500);
    });
  });
}
