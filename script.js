const searchParams = new URLSearchParams(window.location.search);

const camposfiltros = {
  busca: document.getElementById("busca-termo"),
  tipo: document.getElementById("tipo-filtro"),
  qtd: document.getElementById("quantidade-filtro"),
  de: document.getElementById("de-filtro"),
  ate: document.getElementById("ate-filtro"),
};

function dialogFiltros() {
  const dialogFiltro = document.getElementById("dialog-filtro");
  const exibeFiltros = document.getElementById("filtro");
  const closeFiltros = document.getElementById("close-filtro");

  exibeFiltros.addEventListener("click", (e) => {
    e.preventDefault();
    dialogFiltro.showModal();
  });

  closeFiltros.addEventListener("click", () => {
    dialogFiltro.close();
  });
}

function handleFilters() {
  const botaoAplicarFiltros = document.getElementById("aplicar-filtro");
  const botaoPesquisarBusca = document.getElementById("botao-busca-termo");

  botaoPesquisarBusca.addEventListener("click", (e) => {
    e.preventDefault();

    const buscaDigitada = camposfiltros.busca.value.trim();
    buscaDigitada
      ? searchParams.set("busca", buscaDigitada)
      : searchParams.delete("busca");

    window.location.search = searchParams.toString();
  });

  botaoAplicarFiltros.addEventListener("click", (e) => {
    e.preventDefault();

    const searchParams = new URLSearchParams(window.location.search);
    Object.entries(camposfiltros).forEach(([chave, campo]) => {
      const valor = campo.value.trim();
      valor ? searchParams.set(chave, valor) : searchParams.delete(chave);
    });

    window.location.search = searchParams.toString();
  });
}

function setDefaultQuery() {
  const qtd = searchParams.get("qtd");
  if (!qtd) {
    searchParams.set("qtd", 10);
    window.location.search = searchParams.toString();
  }
}

function setValuesFromUrl() {
  Object.entries(camposfiltros).forEach(([chave, campo]) => {
    const valor = searchParams.get(chave);
    if (valor) campo.value = valor;
  });
}

function setContadorFiltros() {
  const contadorFiltros = document.getElementById("contador-filtros");
  let filtrosAtivos = searchParams.toString().split("&").length;
  contadorFiltros.textContent = searchParams.has("page") ? filtrosAtivos - 1 : filtrosAtivos;
}

function generateUrl() {
  const url = "https://servicodados.ibge.gov.br/api/v3/noticias";
  const params = new URLSearchParams(window.location.search);
  const paramsString = params.toString();
  return paramsString ? `${url}?${paramsString}` : url;
}

function fetchNoticias() {
  const url = generateUrl();

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const noticias = data.items;
      renderNoticias(noticias);
      renderPagination(data.totalPages);
    });
}

function renderNoticias(noticias) {
  const listaNoticias = document.getElementById("lista-noticias");
  noticias.forEach((noticia) => {
    const li = document.createElement("li");
    li.className = "noticia";

    const divWrapper = renderNoticiaResumo(noticia);
    if (noticia.imagens != "") {
      const img = renderImagemNoticia(noticia);
      li.appendChild(img);
    }

    li.appendChild(divWrapper);
    listaNoticias.appendChild(li);
  });
}

function renderNoticiaResumo(noticia) {
  const divWrapper = document.createElement("div");
  divWrapper.className = "wrapper-noticia";

  const h2 = document.createElement("h2");
  h2.textContent = noticia.titulo;

  const p = document.createElement("p");
  p.textContent = noticia.introducao;

  const divEditoraDias = renderEditoraDias(noticia);
  const linkLerMais = renderBotaoLerMais(noticia);

  divWrapper.appendChild(h2);
  divWrapper.appendChild(p);
  divWrapper.appendChild(divEditoraDias);
  divWrapper.appendChild(linkLerMais);

  return divWrapper;
}

function renderBotaoLerMais(noticia) {
  const linkLerMais = document.createElement("a");
  linkLerMais.href = noticia.link;
  linkLerMais.textContent = "Ler mais";
  linkLerMais.target = "_blank";
  linkLerMais.className = "ler-mais";

  return linkLerMais;
}

function renderEditoraDias(noticia) {
  const divEditoraDias = document.createElement("div");
  divEditoraDias.className = "editora-dias";

  const editora = document.createElement("div");
  editora.textContent = "#" + noticia.editorias;

  const diasPassados = document.createElement("div");
  diasPassados.textContent = contarDiasPassados(noticia.data_publicacao);

  divEditoraDias.appendChild(editora);
  divEditoraDias.appendChild(diasPassados);

  return divEditoraDias;
}

function renderImagemNoticia(noticia) {
  const imagemTratada = JSON.parse(noticia.imagens);
  const img = document.createElement("img");
  img.src = `https://agenciadenoticias.ibge.gov.br/${imagemTratada.image_intro}`;
  img.alt = imagemTratada.image_intro_alt;
  img.className = "imagem-noticia";
  return img;
}

function contarDiasPassados(data) {
  const parteData = data.split("T");
  const dataFormatada = parteData[0];
  const dataPublicacao = new Date(dataFormatada);
  const dataAtual = new Date();
  const diferenca = dataAtual - dataPublicacao;
  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));

  const mensagens = {
    0: "Publicado hoje",
    1: "Publicado ontem",
    default: `Publicado ${dias} dias atrás`,
  };

  return mensagens[dias] || mensagens.default;
}

function renderPagination(totalPages) {
  const pagination = document.getElementById("paginacao");
  const selectedPage = searchParams.get("page") || 1;
  const startPage = selectedPage > 5 ? selectedPage - 5 : 1; 
  const endPage = startPage + 9 < totalPages ? startPage + 9 : totalPages;

  renderPreviousPage(pagination, selectedPage);

  for (let i = startPage; i <= endPage; i++) {
    const li = document.createElement("li");
    li.className = "page-item";
    li.textContent = i;
    li.style.display = "inline-block";
    li.addEventListener("click", () => {
      searchParams.set("page", i);
      window.location.search = searchParams.toString();
    });
    if (i == selectedPage) {
      li.id = "selected-page";
    }
    pagination.appendChild(li);
  }

  renderNextPage(pagination, selectedPage);
}

function renderPreviousPage(pagination, selectedPage) {
  const liPrevious = document.createElement("li");
  liPrevious.className = "page-item";
  liPrevious.textContent = "<";
  liPrevious.style.display = "inline-block";
  liPrevious.addEventListener("click", () => {
    searchParams.set("page", selectedPage - 1);
    window.location.search = searchParams.toString();
  });
  pagination.appendChild(liPrevious);
}

function renderNextPage(pagination, selectedPage) {
  const liNext = document.createElement("li");
  liNext.className = "page-item";
  liNext.textContent = ">";
  liNext.style.display = "inline-block";
  liNext.addEventListener("click", () => {
    searchParams.set("page", Number(selectedPage) + 1);
    window.location.search = searchParams.toString();
  });
  pagination.appendChild(liNext);
}

document.addEventListener("DOMContentLoaded", () => {
  setValuesFromUrl();
  setDefaultQuery();
  dialogFiltros();
  handleFilters();
  setContadorFiltros();
  fetchNoticias();
});
