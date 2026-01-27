"use strict";

import { getTrending, getSearch, getMovieDetails } from "./api.js";
import { listarFilmes, renderizarDetalhes, limparModal } from "./ui.js";
import {dom} from "./dom.js"; 

const trendingMoviesWrapper = dom.trendingWrapper;
const pesquisa = dom.searchInput; 
const modal = dom.modal;

let trendingMovies = [];
let timerPesquisa;

function formatar(f) {
  return {
    id: f.id,
    titulo: f.title,
    ano: f.release_date ? f.release_date.split("-")[0] : "N/A",
    urlImagem: f.poster_path ? `https://image.tmdb.org/t/p/w300${f.poster_path}` : "https://via.placeholder.com/200x300?text=Sem+Poster"
  };
}

async function iniciar() {
  const dados = await getTrending();
  if (dados) {
    trendingMovies = dados.results.map(formatar);
    listarFilmes(trendingMovies, trendingMoviesWrapper);
  }
}

async function abrirModal(id) {
    limparModal();
    const detalhes = await getMovieDetails(id);
    renderizarDetalhes(detalhes);
}

pesquisa.addEventListener("input", (e) => {
  const termo = e.target.value.trim();
  clearTimeout(timerPesquisa);

  timerPesquisa = setTimeout(async () => {
    if (!termo) {
      listarFilmes(trendingMovies, trendingMoviesWrapper);
      return;
    }
    const busca = await getSearch(termo);
    if (busca) {
        listarFilmes(busca.results.map(formatar), trendingMoviesWrapper);

        busca.results = null;
    }
  }, 300);
});

modal.addEventListener("click", (e) => e.target === modal && (modal.style.display = "none"));

trendingMoviesWrapper.addEventListener("click", (event) => {
  const card = event.target.closest(".cardContainer");

  if (card) {
    const filmeId = card.getAttribute("data-id");
    abrirModal(filmeId);
  }
});

document.addEventListener("DOMContentLoaded", iniciar);

console.log(window.__mutationObserverInstances || "O navegador não expõe diretamente, mas verifique o Heap Snapshot");