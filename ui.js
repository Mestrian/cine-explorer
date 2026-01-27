const modal = document.querySelector(".backgroundMovieSelected");

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
  const modal = document.querySelector(".backgroundMovieSelected");
  const posterImg = document.querySelector(".biggerMoviePoster img");
  const modalCard = document.querySelector(".biggerMovieCard");

  // Esconde a imagem antiga IMEDIATAMENTE
  posterImg.style.opacity = "0"; 
  posterImg.src = ""; // Esvazia o src

  // Limpa textos e fundo
  document.querySelector(".biggerTitle").innerText = "Carregando...";
  document.querySelector("#yearDate").innerText = "";
  modalCard.style.setProperty('--card-bg-img', 'none');
  modalCard.style.backgroundColor = '#032541';

  modal.style.display = "flex"
}

export function renderizarDetalhes(f) {
  const modalCard = document.querySelector(".biggerMovieCard");
  const posterImg = document.querySelector(".biggerMoviePoster img");
  
  document.querySelector(".biggerTitle").innerText = f.title;
  document.querySelector("#yearDate").innerText = `(${f.release_date.split("-")[0]})`;
  document.querySelector(".tagline").innerText = f.tagline ? `"${f.tagline}"` : "";
  document.querySelector(".sinopse").innerText = f.overview || "Sinopse não disponível.";
  document.querySelector(".score-number").innerText = f.vote_average.toFixed(1);
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
  document.querySelector("#circleBar").style.strokeDashoffset = 113.1 - (113.1 * percent) / 100;
  modal.style.display = "flex";
}