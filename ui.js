
const modal = document.querySelector(".backgroundMovieSelected");

export function listarFilmes(filmes, container, callbackClique) {
  container.innerHTML = "";
  const fragmento = document.createDocumentFragment();
  filmes.forEach((filme) => {
    const card = criarCard(filme, callbackClique);
    fragmento.append(card);
  });
  container.append(fragmento);
}

function criarCard(filme, callbackClique) {
  const filmeCard = document.createElement("article");
  filmeCard.className = "cardContainer";

  filmeCard.innerHTML = `
      <picture class="moviePoster imgPlaceholder"></picture>
      <section class="movieDesc">
          <span class="movieName">${filme.titulo}</span>
          <span class="releaseDate">${filme.ano}</span>
      </section>`;
  
 
  const img = new Image();
  img.src = filme.urlImagem;
  img.onload = () => {
      const pic = filmeCard.querySelector("picture");
      pic.classList.remove("imgPlaceholder");
      pic.appendChild(img);
  };

  filmeCard.addEventListener("click", () => callbackClique(filme.id));
  return filmeCard;
}

export function renderizarDetalhes(f) {
  const modalCard = document.querySelector(".biggerMovieCard");
  document.querySelector(".biggerTitle").innerText = f.title;
  document.querySelector("#yearDate").innerText = `(${f.release_date.split("-")[0]})`;
  document.querySelector(".tagline").innerText = f.tagline ? `"${f.tagline}"` : "";
  document.querySelector(".sinopse").innerText = f.overview || "Sinopse não disponível.";
  document.querySelector(".score-number").innerText = f.vote_average.toFixed(1);
  document.querySelector(".biggerMoviePoster img").src = `https://image.tmdb.org/t/p/w500${f.poster_path}`;

  const backdropPath = f.backdrop_path || f.poster_path;
  if(backdropPath) {
    modalCard.style.setProperty('--card-bg-img', `url('https://image.tmdb.org/t/p/w1280${backdropPath}')`);
    modalCard.style.backgroundColor = 'transparent';
  }

  const percent = f.vote_average * 10;
  document.querySelector("#circleBar").style.strokeDashoffset = 113.1 - (113.1 * percent) / 100;
  modal.style.display = "flex";
}