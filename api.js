import { API_KEY_TMDB } from "./config.js";
const BASE_URL_TMDB = "https://api.themoviedb.org/3";

export async function getTrending() {
  const resposta = await fetch(`${BASE_URL_TMDB}/trending/movie/week?api_key=${API_KEY_TMDB}&language=pt-BR`);
  if (!resposta.ok) throw new Error("Erro ao conectar com a API");
  return await resposta.json();
}

export async function getSearch(termo) {
  const url = `${BASE_URL_TMDB}/search/movie?api_key=${API_KEY_TMDB}&language=pt-BR&query=${termo}`;
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error("Erro na pesquisa");
  return await resposta.json();
}

export async function getMovieDetails(id) {
    const resposta = await fetch(`${BASE_URL_TMDB}/movie/${id}?api_key=${API_KEY_TMDB}&language=pt-BR`);
    return await resposta.json();
}