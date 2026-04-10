import { carregarItensDaSacola } from "./js/carregarItensDaSacola.js";
import { imprimirCamisetas } from "./js/imprimirCamisetas.js";
import { imprimirUmDeCadaCategoria } from "./js/imprimirUmDeCadaCategoria.js";
import { imprimirCategoria } from "./js/imprimirCategoria.js";

function isPaginaSacola() {
  return window.location.pathname.includes("/sacola.html");
}

if (isPaginaSacola()) {
  carregarItensDaSacola();
}

const produtosHTML = document.getElementById("produtos");
const categoriaAtual = produtosHTML ? produtosHTML.dataset.categoria : null;
let localizacaoAtual = "BR";

function carregarProdutos(localizacao) {
  if (!produtosHTML) return;
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

const carrinhoIcone = document.querySelector(".bi-cart2");
if (carrinhoIcone) {
  const sacola = JSON.parse(localStorage.getItem("sacola"));
  const quantidadeDeItensNaSacola = sacola ? sacola.length : 0;
  const numeroDeItens = document.createElement("span");
  numeroDeItens.id = "carrinho-numero";
  numeroDeItens.textContent = quantidadeDeItensNaSacola;
  carrinhoIcone.appendChild(numeroDeItens);
}

const inputPesquisa = document.querySelector("#input-pesquisa");
const divSugestoes = document.querySelector("#sugestoes-pesquisa");

if (inputPesquisa && divSugestoes) {
  inputPesquisa.addEventListener("input", () => {
    const termoPesquisa = inputPesquisa.value.trim();
    if (termoPesquisa) {
      const sugestoes = ["Camiseta", "Calça", "Calçado", "Bolsa", "Óculos", "Casaco"];
      const sugestoesHTML = sugestoes
        .filter(sugestao => sugestao.toLowerCase().includes(termoPesquisa.toLowerCase()))
        .map(sugestao => `<div class="sugestao">${sugestao}</div>`)
        .join("");
      divSugestoes.innerHTML = sugestoesHTML;
    } else {
      divSugestoes.innerHTML = "";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const containerSelecionarPersonalizado = document.querySelector(".container-selecionar-personalizado");
  if (!containerSelecionarPersonalizado) return;

  const opcaoSelecionada = document.querySelector(".opcao-selecionada");
  const containerOpcoes = containerSelecionarPersonalizado.querySelector(".container-opcoes");
  const opcoes = containerOpcoes.querySelectorAll(".opcao");

  const alternarOpcoes = () => {
    if (containerOpcoes.classList.contains("abrir")) {
      containerOpcoes.classList.remove("abrir");
      containerSelecionarPersonalizado.classList.remove("abrir");
    } else {
      containerOpcoes.classList.add("abrir");
      containerSelecionarPersonalizado.classList.add("abrir");
      containerOpcoes.style.height = containerOpcoes.scrollHeight + "px";
    }
  };

  opcaoSelecionada.addEventListener("click", alternarOpcoes);

  opcoes.forEach(opcao => {
    opcao.addEventListener("click", (evento) => {
      opcaoSelecionada.textContent = evento.target.textContent;
      opcaoSelecionada.dataset.value = evento.target.dataset.value;
      containerOpcoes.classList.remove("abrir");
      containerSelecionarPersonalizado.classList.remove("abrir");
      containerOpcoes.style.height = 0;
      localizacaoAtual = evento.target.dataset.value;
      carregarProdutos(localizacaoAtual);
    });
  });
});