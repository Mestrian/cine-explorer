"use strict"; 

import {dom} from "./dom.js";

const modal = dom.modal;

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
  
  dom.modalTitle.innerText = f.title;
  dom.modalYear.innerText = `(${f.release_date.split("-")[0]})`;
  dom.modalTagline.innerText = f.tagline ? `"${f.tagline}"` : "";
  dom.modalSinopse.innerText = f.overview || "Sinopse não disponível.";
  dom.modalScore.innerText = f.vote_average.toFixed(1);
  posterImg.onload = () => {
    posterImg.style.opacity = "1";
  }
  posterImg.src = `https://image.tmdb.org/t/p/w500${f.poster_path}`;


  const backdropPath = f.backdrop_path || f.poster_path;
  if(backdropPath) {
    modalCard.style.setProperty('--card-bg-img', `url('https://image.tmdb.org/t/p/w300${backdropPath}')`);
    modalCard.style.backgroundColor = 'transparent';
  }

  const percent = f.vote_average * 10;
  dom.modalCircleBar.style.strokeDashoffset = 113.1 - (113.1 * percent) / 100;
  modal.style.display = "flex";
}