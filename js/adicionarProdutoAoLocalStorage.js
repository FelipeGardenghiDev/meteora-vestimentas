export function adicionarProdutoAoLocalStorage(produto) {
  let sacola = JSON.parse(localStorage.getItem('sacola')) || [];
  const key = produto?.imagens?.desktop || produto?.nome;
  const existente = sacola.find(item => (item?.imagens?.desktop || item?.nome) === key);
  if (existente) {
    existente.quantidade = (existente.quantidade || 1) + 1;
  } else {
    sacola.push({ ...produto, quantidade: 1 });
  }
  localStorage.setItem('sacola', JSON.stringify(sacola));
  document.dispatchEvent(new CustomEvent('sacola-atualizada'));
}
