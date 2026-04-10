# Meteora Vestimentas 🛍️

Projeto front-end de e-commerce fictício de moda, desenvolvido com fins educacionais e de portfólio.  
Baseado no projeto **Meteora Vestimentas** da [Alura](https://www.alura.com.br), utilizado como base para o ensino de desenvolvimento front-end.

---

## ✨ Funcionalidades

- **Catálogo de produtos** organizado por categorias (camisetas, calças, calçados, bolsas, casacos, óculos)
- **Sistema de busca** funcional com filtragem em tempo real
- **Carrinho de compras** persistente via `localStorage`, com:
  - Adição e remoção de itens
  - Controle de quantidade
  - Cálculo de total
  - Validação de tamanho e cor antes de adicionar
  - Fluxo de finalização de compra com mensagem de confirmação
- **Lista de favoritos** com adição/remoção e confirmação
- **Dark mode** com alternância por botão, persistido entre sessões
- **Internacionalização (i18n)** com suporte a Português (BR) e Inglês (EUA):
  - Todo o conteúdo da interface é traduzido dinamicamente
  - Itens do carrinho e favoritos sempre exibidos no idioma ativo
  - Chave estável por caminho de imagem (sem duplicação entre idiomas)
- **Página de novidades** com banners e destaque de produtos
- **Página de promoções**
- **Página de lojas** com status de abertura dinâmico baseado no horário do sistema
- **FAQ** com acordeão interativo
- **Newsletter** com validação de e-mail
- **Navbar fixa** com menu hambúrguer responsivo
- Layout totalmente **responsivo** (mobile, tablet e desktop)
- **Acessibilidade**: uso de `aria-label`, contraste adequado, navegação por teclado

---

## 🚀 Tecnologias

- HTML5 + CSS3
- JavaScript (ES Modules)
- [Bootstrap 5](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- `localStorage` para persistência de carrinho e favoritos
- `IntersectionObserver` para animações de entrada dos cards

---

## 📁 Estrutura

```
meteora-vestimentas/
├── assets/              # Imagens (banners, categorias, produtos)
├── json/
│   ├── produtos.json    # Dados dos produtos em Português
│   └── products.json    # Dados dos produtos em Inglês
├── js/
│   ├── i18n.js          # Traduções PT/EN
│   ├── favoritos.js     # Lógica de favoritos (localStorage)
│   ├── carregarItensDaSacola.js
│   ├── adicionarProdutoAoLocalStorage.js
│   ├── paginaFavoritos.js
│   └── ...
├── estilos.css          # Estilos principais
├── estilos-sacola.css   # Estilos da página do carrinho
├── scripts.js           # Script principal (dark mode, i18n, busca, etc.)
├── index.html
├── sacola.html
├── favoritos.html
├── faq.html
├── lojas.html
├── novidades.html
├── promocao.html
└── [páginas de categoria].html
```

---

## 🖥️ Como usar

1. Clone o repositório:
   ```bash
   git clone https://github.com/FelipeGardenghiDev/meteora-vestimentas.git
   ```
2. Abra o projeto com uma extensão de servidor local (ex: **Live Server** no VS Code)
3. Acesse `index.html` pelo servidor — **não abra diretamente como arquivo**, pois os módulos JS e as imagens dependem de servidor HTTP

---

## 📌 Observações

- Este é um projeto de portfólio **sem back-end**. Todas as operações (carrinho, favoritos) são armazenadas no `localStorage` do navegador.
- O projeto foi evoluído a partir de três versões do repositório original da Alura, consolidando as melhores partes de cada uma.

---

## 📄 Licença

Projeto de uso educacional e portfólio pessoal, baseado em material da [Alura](https://www.alura.com.br).
