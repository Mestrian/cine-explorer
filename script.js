"use strict";

const BASE_URL_TMDB = 'https://api.themoviedb.org/3';
const IMG_URL_TMDB = 'https://image.tmdb.org/t/p/w500';
let timerPesquisa; 

const trendingMoviesWrapper = document.querySelector("#trendingMoviesWrapper");
const pesquisa = document.querySelector(".pesquisa");

let trendingMovies = []; 

// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
    carregarFilmes(); 
});

pesquisa.addEventListener("input", (e) => {
    const termoBusca = e.target.value.toLowerCase().trim();
    
    clearTimeout(timerPesquisa);

    timerPesquisa = setTimeout(() => {
        pesquisarFilmes(termoBusca, trendingMovies, "titulo"); 
    }, 350);

});

// CARREGAR DADOS
async function carregarFilmes() {
    try { 
        const resposta = await fetch(`${BASE_URL_TMDB}/trending/movie/week?api_key=${API_KEY_TMDB}&language=pt-BR`);

        if (!resposta.ok) throw new Error("Erro ao conectar com a API");
        
        const dados = await resposta.json(); 

        trendingMovies = dados.results.map(filme => ({
            titulo: filme.title,
            ano: filme.release_date ? filme.release_date.split("-")[0] : "N/A", 
            nota: filme.vote_average ? filme.vote_average.toFixed(1) : "0.0",
            urlImagem: filme.poster_path ? `${IMG_URL_TMDB}${filme.poster_path}` : "https://via.placeholder.com/500x750?text=Sem+Poster",
        }));

        listarFilmes(trendingMovies); 

    } catch (error) {
        console.error("Algo deu errado:", error);
        trendingMoviesWrapper.innerHTML = "<p>Erro ao carregar os filmes</p>";
    }
}

async function pesquisarFilmes(termo){

    if (!termo) {
        listarFilmes(trendingMovies);
        return;
    }

    try {
        const url = `${BASE_URL_TMDB}/search/movie?api_key=${API_KEY_TMDB}&language=pt-BR&query=${termo}`;

        const resposta = await fetch(url);

        if(!resposta.ok) throw new Error('Erro ao se conectar a API'); 
        
        const dados = await resposta.json();
        
        const resultadosDaBusca = dados.results.map(filme=> ({
            titulo: filme.title,
            ano: filme.release_date ? filme.release_date.split("-")[0] : "N/A",
            nota: filme.vote_average ? filme.vote_average.toFixed(1) : "0.0",
            urlImagem: filme.poster_path ? `${IMG_URL_TMDB}${filme.poster_path}` : "https://via.placeholder.com/500x750?text=Sem+Poster"
        }))

        listarFilmes(resultadosDaBusca); 
    }  catch (error) {
        console.log ("Falha na pesquisa: ", error);
    }
}



// FUNÇÕES CORE

function listarFilmes(filmes) {
    trendingMoviesWrapper.innerHTML = "";  
    filmes.forEach(filme => {
        const filmeCard = criarCard(filme);
        trendingMoviesWrapper.append(filmeCard);
    });
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
    }

    filmeCard.innerHTML = `
            <section class="movieDesc">
                <span class="movieName">${filme.titulo}</span>
                <span class="releaseDate">${filme.ano}</span>
            </section>
    `;

    filmeCard.prepend(posterContainer);
    
    return filmeCard;
}