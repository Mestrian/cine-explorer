"use strict";

import { API_KEY_TMDB } from "./config.js";


const BASE_URL_TMDB = "https://api.themoviedb.org/3";
const IMG_URL_TMDB = "https://image.tmdb.org/t/p/w200";
let timerPesquisa;

const trendingMoviesWrapper = document.querySelector("#trendingMoviesWrapper");
const pesquisa = document.querySelector(".pesquisa");
const modal = document.querySelector(".backgroundMovieSelected");


let trendingMovies = [];

// INICIAR
document.addEventListener("DOMContentLoaded", () => {
  carregarFilmes();
});

//EVENT LISTENER
pesquisa.addEventListener("input", (e) => {
  const termoBusca = e.target.value.toLowerCase().trim();

  clearTimeout(timerPesquisa);

  timerPesquisa = setTimeout(() => {
    pesquisarFilmes(termoBusca, trendingMovies, "titulo");
  }, 250);
});

modal.addEventListener("click", (event)=> {
  if (event.target == modal) modal.style.display = "none";
})



// CARREGAR DADOS
async function carregarFilmes() {
  if (trendingMovies.length > 0) {
    listarFilmes(trendingMovies);
    return;
  }

  try {
    const resposta = await fetch(
      `${BASE_URL_TMDB}/trending/movie/week?api_key=${API_KEY_TMDB}&language=pt-BR`,
    );

    if (!resposta.ok) throw new Error("Erro ao conectar com a API");

    const dados = await resposta.json();

    trendingMovies = dados.results.map(formatarObjetosFilmes);

    listarFilmes(trendingMovies);

  } catch (error) {
    console.error("Algo deu errado:", error);
    trendingMoviesWrapper.innerHTML = "<p>Erro ao carregar os filmes</p>";
  } finally {
    trendingMoviesWrapper.classList.remove("imgPlaceholder");
  }
}


async function pesquisarFilmes(termo) {
  if (!termo) {
    listarFilmes(trendingMovies);
    return;
  }
  
  try {
    const url = `${BASE_URL_TMDB}/search/movie?api_key=${API_KEY_TMDB}&language=pt-BR&query=${termo}`;
    
    const resposta = await fetch(url);
    
    if (!resposta.ok) throw new Error("Erro ao se conectar a API");
    
    const dados = await resposta.json();
    
    const resultadosDaBusca = dados.results.map(formatarObjetosFilmes);
    
    listarFilmes(resultadosDaBusca);
  } catch (error) {
    console.log("Falha na pesquisa: ", error);
  }
}

//AUXILIAR CARREGAR DADOS

function formatarObjetosFilmes(f){
  return {
    id: f.id,
    titulo: f.title,
    ano: f.release_date ? f.release_date.split("-")[0] : "N/A",
    nota: f.vote_average ? f.vote_average.toFixed(1) : "0.0",
    urlImagem: f.poster_path ? `${IMG_URL_TMDB}${f.poster_path}` : "https://via.placeholder.com/200x300?text=Sem+Imagem"
  }
}


// EDITAR A TELA

function listarFilmes(filmes) {
  trendingMoviesWrapper.innerHTML = "";

  const fragmento = document.createDocumentFragment();

  filmes.forEach((filme) => {
    const filmeCard = criarCard(filme);
    fragmento.append(filmeCard);
  });

  trendingMoviesWrapper.append(fragmento);
}

function criarCard(filme) {
  const filmeCard = document.createElement("article");
  filmeCard.className = "cardContainer";

  const img = new Image();
  img.src = filme.urlImagem;
  img.alt = `Poster de ${filme.titulo}`;

  const posterContainer = document.createElement("picture");
  posterContainer.className = "moviePoster imgPlaceholder";

  img.onload = () => {
    posterContainer.classList.remove("imgPlaceholder");
    posterContainer.appendChild(img);
  };

  filmeCard.innerHTML = `
            <section class="movieDesc">
                <span class="movieName">${filme.titulo}</span>
                <span class="releaseDate">${filme.ano}</span>
            </section>
    `;

  filmeCard.prepend(posterContainer);

  filmeCard.addEventListener("click", ()=> abrirDetalhes(filme.id));

  return filmeCard;
}

//BIGGER CARD

async function abrirDetalhes(id) {
  
  const modalCard = document.querySelector(".biggerMovieCard");

  document.querySelector(".biggerTitle").innerText = "Carregando...";
  document.querySelector("#yearDate").innerText = "";
  document.querySelector(".tagline").innerText = "";
  document.querySelector(".sinopse").innerText = "";
  document.querySelector(".score-number").innerText = "0.0";

  document.querySelector(".biggerMoviePoster img").src = "https://via.placeholder.com/500x750?text=Carregando...";
  
  modalCard.style.setProperty('--card-bg-img', 'none');
  modalCard.style.backgroundColor = '#032541';
  document.querySelector("#circleBar").style.strokeDashoffset = 113.1;

  modal.style.display = "flex";

  try {
    const resposta = await fetch(`${BASE_URL_TMDB}/movie/${id}?api_key=${API_KEY_TMDB}&language=pt-BR`);
    const f = await resposta.json();

    document.querySelector(".biggerTitle").innerText = f.title;
    document.querySelector("#yearDate").innerText = `(${f.release_date.split("-")[0]})`;
    document.querySelector(".tagline").innerText = f.tagline ? `"${f.tagline}"` : "";
    document.querySelector(".sinopse").innerText = f.overview || "Sinopse não disponível.";
    document.querySelector(".score-number").innerText = f.vote_average.toFixed(1);

    document.querySelector(".biggerMoviePoster img").src = `https://image.tmdb.org/t/p/w500${f.poster_path}`;

    const circle = document.querySelector("#circleBar");
        const percent = f.vote_average * 10;
        const offset = 113.1 - (113.1 * percent) / 100;
        circle.style.strokeDashoffset = offset;

    const backdropPath = f.backdrop_path || f.poster_path;

    if(backdropPath){
      const bgUrl = `https://image.tmdb.org/t/p/w1280${backdropPath}`;
      modalCard.style.setProperty('--card-bg-img', `url('${bgUrl}')`);
      modalCard.style.backgroundColor = 'transparent';
    }

    } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
    }

}

