const moviesWrapper = document.querySelector("#moviesWrapper");


function testarGrid(qntdFilmes){ 
for(let i = 0; i < 30; i++) {
    movieCard = document.createElement("article");

    movieCard.className = "cardContainer";
    movieCard.innerHTML = `
         <article class="cardContainer">
        <picture id="moviePoster">
            <img src="images/teste.webp" alt="Poster">
        </picture>

        <section class="movieDesc">
            <span id="movieName">A Guerra dos Mundos</span>
            <span id="releaseDate">18 de outubro 1856</span>
        </section>
    </article> `; 

    moviesWrapper.append(movieCard); 
}
}

testarGrid(30);