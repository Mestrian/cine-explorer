const moviesWrapper = document.querySelector("#moviesWrapper");

const mockMovies = [
    {
        titulo: "Interestelar",
        ano: 2014,
        nota: 8.7,
        genero: "Ficção Científica",
        urlImagem: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=500"
    },
    {
        titulo: "Batman",
        ano: 2008,
        nota: 9.0,
        genero: "Ação",
        urlImagem: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=500"
    },
    {
        titulo: "O Senhor dos Anéis",
        ano: 2003,
        nota: 9.0,
        genero: "Fantasia",
        urlImagem: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=500"
    },
    {
        titulo: "Toy Story",
        ano: 1995,
        nota: 8.3,
        genero: "Animação",
        urlImagem: "https://images.unsplash.com/photo-1535573386627-b131b8168155?auto=format&fit=crop&q=80&w=500"
    },
    {
        titulo: "Pulp Fiction",
        ano: 1994,
        nota: 8.9,
        genero: "Crime",
        urlImagem: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=500"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    listarFilmes(mockMovies);
})

function listarFilmes(filmes) {
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
                <img src="${filme.urlImagem}" alt="Poster">
            </picture>

            <section class="movieDesc">
                <span class="movieName">${filme.titulo}</span>
                <span class="releaseDate">${filme.ano}</span>
            </section>
    `

    return filmeCard;

}



const intro = function (followers, platform) {

    console.log(

        `${this.name} is a ${this.niche} and he has ${followers} followers on ${platform}.`

    );

};

