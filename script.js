"use strict";

const API_KEY_TMDB = 'f46adc27deffeca0de3547f864540d22'; 
const BASE_URL_TMDB = 'https://api.themoviedb.org/3';
const IMG_URL_TMDB = 'https://image.tmdb.org/t/p/w500';

const moviesWrapper = document.querySelector("#moviesWrapper");
const pesquisa = document.querySelector(".pesquisa");

let mockMovies = []; 

// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
    carregarFilmes(); 
});

pesquisa.addEventListener("input", (e) => {
    const termoBusca = e.target.value.toLowerCase().trim(); 
    filtrar(termoBusca, mockMovies, "titulo"); 
});

// CARREGAR DADOS
async function carregarFilmes() {
    try { 
        const resposta = await fetch(`${BASE_URL_TMDB}/trending/movie/week?api_key=${API_KEY_TMDB}&language=pt-BR`);

        if (!resposta.ok) throw new Error("Erro ao conectar com a API");
        
        const dados = await resposta.json(); 

        mockMovies = dados.results.map(filme => ({
            titulo: filme.title,
            ano: filme.release_date ? filme.release_date.split("-")[0] : "N/A", 
            nota: filme.vote_average ? filme.vote_average.toFixed(1) : "0.0",
            urlImagem: filme.poster_path ? `${IMG_URL_TMDB}${filme.poster_path}` : "https://via.placeholder.com/500x750?text=Sem+Poster",
        }));

        listarFilmes(mockMovies); 

    } catch (error) {
        console.error("Algo deu errado:", error);
        moviesWrapper.innerHTML = "<p>Erro ao carregar os filmes</p>";
    }
}

// FUNÇÕES CORE
function filtrar(filtro, alvo, termo) { 
    const Filtrados = alvo.filter(filme => {
        return filme[termo].toLowerCase().includes(filtro);
    });
    listarFilmes(Filtrados); 
}

function listarFilmes(filmes) {
    moviesWrapper.innerHTML = "";  
    filmes.forEach(filme => {
        const filmeCard = criarCard(filme);
        moviesWrapper.append(filmeCard);
    });
}

function criarCard(filme) {
    const filmeCard = document.createElement("article");
    filmeCard.className = "cardContainer";

    filmeCard.innerHTML = `
            <picture class="moviePoster">
                <img src="${filme.urlImagem}" alt="Poster de ${filme.titulo}" loading="lazy">
            </picture>

            <section class="movieDesc">
                <span class="movieName">${filme.titulo}</span>
                <span class="releaseDate">${filme.ano}</span>
            </section>
    `;
    return filmeCard;
}