import { getTrending, getSearch, getMovieDetails } from "./api.js";
import { listarFilmes, renderizarDetalhes } from "./ui.js";

const trendingMoviesWrapper = document.querySelector("#trendingMoviesWrapper");
const pesquisa = document.querySelector(".pesquisa");
const modal = document.querySelector(".backgroundMovieSelected");

let trendingMovies = [];
let timerPesquisa;

function formatar(f) {
  return {
    id: f.id,
    titulo: f.title,
    ano: f.release_date ? f.release_date.split("-")[0] : "N/A",
    urlImagem: f.poster_path ? `https://image.tmdb.org/t/p/w200${f.poster_path}` : "https://via.placeholder.com/200x300?text=Sem+Poster"
  };
}

async function iniciar() {
  const dados = await getTrending();
  trendingMovies = dados.results.map(formatar);
  listarFilmes(trendingMovies, trendingMoviesWrapper, abrirModal);
}

async function abrirModal(id) {
    const detalhes = await getMovieDetails(id);
    renderizarDetalhes(detalhes);
}

pesquisa.addEventListener("input", (e) => {
  const termo = e.target.value.trim();
  clearTimeout(timerPesquisa);
  timerPesquisa = setTimeout(async () => {
    if (!termo) {
      listarFilmes(trendingMovies, trendingMoviesWrapper, abrirModal);
      return;
    }
    const busca = await getSearch(termo);
    listarFilmes(busca.results.map(formatar), trendingMoviesWrapper, abrirModal);
  }, 300);
});

modal.addEventListener("click", (e) => e.target === modal && (modal.style.display = "none"));

document.addEventListener("DOMContentLoaded", iniciar);