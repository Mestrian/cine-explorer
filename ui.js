"use strict"; 

import {dom} from "./dom.js";
import {subscribe} from "./state.js";

const modal = dom.modal;

subscribe((state)=> {
  listarFilmes(state.items, dom.trendingWrapper);
})

export function listarFilmes(filmes, container) {
  container.innerHTML = "";
  const fragmento = document.createDocumentFragment();
  filmes.forEach((filme) => {
    const card = criarCard(filme);
    fragmento.append(card);
  });
  container.append(fragmento);
}

function criarCard(filme) {
  const filmeCard = document.createElement("article");
  filmeCard.className = "cardContainer";
  filmeCard.setAttribute("data-id", filme.id);

  filmeCard.innerHTML = `
    <picture class="moviePoster imgPlaceholder">
      <img 
        src="${filme.urlImagem}" 
        alt="${filme.titulo}" 
        loading="lazy"
      />
    </picture>
    <section class="movieDesc">
      <span class="movieName">${filme.titulo}</span>
      <span class="releaseDate">${filme.ano}</span>
    </section>
  `;

  const img = filmeCard.querySelector("img");
  img.addEventListener("load", () => {
    img.parentElement.classList.remove("imgPlaceholder");
  }, { once: true });

 
  return filmeCard;
}

export function limparModal(){
  const posterImg = dom.modalPoster; 
  const modalCard = dom.modalCard;

  posterImg.style.opacity = "0"; 
  posterImg.src = ""; 

  dom.modalTitle.innerText = "Carregando...";
  dom.modalYear.innerText = "";
  modalCard.style.setProperty('--card-bg-img', 'none');
  modalCard.style.backgroundColor = '#032541';

  modal.style.display = "flex"
}

export function renderizarDetalhes(f) {
  const modalCard = dom.modalCard;
  const posterImg = dom.modalPoster;

  const titulo = f.title || f.name;
  const data = f.release_date || f.first_air_date;
  const ano = data ? data.split("-")[0] : "N/A";
  const poster = f.poster_path || f.backdrop_path;
  const backdrop = f.backdrop_path || f.poster_path;
  const nota = typeof f.vote_average === "number" ? f.vote_average : 0;

  dom.modalTitle.innerText = titulo;
  dom.modalYear.innerText = `(${ano})`;
  dom.modalTagline.innerText = f.tagline ? `"${f.tagline}"` : "";
  dom.modalSinopse.innerText = f.overview || "Sinopse não disponível.";
  dom.modalScore.innerText = nota.toFixed(1);

  posterImg.style.opacity = "0";
  posterImg.addEventListener(
    "load",
    () => (posterImg.style.opacity = "1"),
    { once: true }
  );

  posterImg.src = poster
    ? `https://image.tmdb.org/t/p/w780${poster}`
    : "https://via.placeholder.com/300x450?text=Sem+Imagem";

  if (backdrop) {
    modalCard.style.setProperty(
      "--card-bg-img",
      `url('https://image.tmdb.org/t/p/w300${backdrop}')`
    );
    modalCard.style.backgroundColor = "transparent";
  }

  const percent = nota * 10;
  dom.modalCircleBar.style.strokeDashoffset =
    113.1 - (113.1 * percent) / 100;
}
