"use strict";

import { getTrending, getSearch, getMovieDetails } from "./api.js";
import { renderizarDetalhes, limparModal } from "./ui.js";
import {dom} from "./dom.js"; 
import {setState, subscribe} from "./state.js";

const trendingMoviesWrapper = dom.trendingWrapper;
const pesquisa = dom.searchInput; 
const modal = dom.modal;

let timerPesquisa;
let lastTerm = "";
let lastSelectedItem = "";
let lastConfig = "";
let lastMode = "";


subscribe((state) => { //ABRIR MODAL INSCRITO
  if(!state.selectedItem) return;
  if(state.selectedItem == lastSelectedItem) return;
  lastSelectedItem = state.selectedItem; 
  abrirModal(state.selectedItem, state.mode);
})

subscribe(async (state) => { //listar os trending na tela
  const config = `${state.mode}-${state.trendingType}`
  
  if(state.searchTerm) return;

  if(config === lastConfig) return;
  lastConfig = config;


  const dados = await getTrending(state.mode, state.trendingType); 
  
  setState({items: dados.results.map(formatar)});

})




subscribe((state) => { //pesquisar
   
  if(state.searchTerm == lastTerm) return;
  lastTerm = state.searchTerm;


  clearTimeout(timerPesquisa);

  timerPesquisa = setTimeout(async () => {
    if (!state.searchTerm) {
      lastConfig = ""; 
      const dados = await getTrending(state.mode, state.trendingType);

      setState({
        items: dados.results.map(formatar)
      });
      return;
    }

    const dados = await getSearch(state.searchTerm, state.mode);
    setState({
      items: dados.results.map(formatar)
    });

  }, 300)
})


function formatar(i) {
  const data = i.release_date || i.first_air_date;
  const imagem = i.poster_path || i.backdrop_path;

  return {
    id: i.id,
    titulo: i.title || i.name,
    ano: data ? data.split("-")[0] : "N/A",
    urlImagem: imagem
      ? `https://image.tmdb.org/t/p/w500${imagem}`
      : "https://via.placeholder.com/200x300?text=Sem+Poster"
  };
}

async function iniciar() {
  const dados = await getTrending("movie", "week");
  if (dados) {
    setState({items: dados.results.map(formatar)});
  }

  setupModo();
  setupTrendingType(); 

}

async function abrirModal(id, mode) {
    limparModal();
    const detalhes = await getMovieDetails(id, mode);
    renderizarDetalhes(detalhes);
}

pesquisa.addEventListener("input", (e) => {
  setState({
    searchTerm: e.target.value.trim()
  });
});

modal.addEventListener("click", (e) => e.target === modal && (modal.style.display = "none"));

trendingMoviesWrapper.addEventListener("click", (event) => {
  const card = event.target.closest(".cardContainer");

  if (card) {
    setState({selectedItem: card.getAttribute("data-id")});
  }
});

/* FUNCOES BOTOES ESTADOS */

function setupModo() {
  dom.modeWrapper.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if(!btn) return;
    setState({mode: btn.dataset.mode})
    dom.modeWrapper.querySelectorAll('button').forEach(b => {
    b.classList.remove("active");
    })
    btn.classList.add("active");
  })

}


function setupTrendingType() {
  dom.trendingToggle.addEventListener("click", e => {
    const btn = e.target.closest("button");

    if(!btn) return;

    setState({trendingType: btn.dataset.type});

    dom.trendingToggle.querySelectorAll("button").forEach(b => {
      b.classList.remove("active");
    });

    btn.classList.add("active"); 

  })
}



document.addEventListener("DOMContentLoaded", iniciar);


