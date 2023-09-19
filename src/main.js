const api = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },
    params: {
        "api_key": API_KEY
    }
});

async function getTrendingMoviesPreview() {
    const { data } = await api("trending/movie/day");

    const movies = data.results;
    movies.forEach(movie => {
        const trendingPreviewMoviesContainer = document.querySelector("#trendingPreview .trendingPreview-movieList");

        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-container");

        const movieImg = document.createElement("img");
        movieImg.classList.add("movie-img");
        movieImg.setAttribute("alt", movie.title);
        movieImg.setAttribute("src", "https://image.tmdb.org/t/p/w300/" + movie.poster_path);

        movieContainer.appendChild(movieImg);
        trendingPreviewMoviesContainer.appendChild(movieContainer);
    });
}

async function getGenresPreview() {
    const { data } = await api("genre/movie/list");

    const genres = data.genres;
    genres.forEach(genre => {
        const previewGenresContainer = document.querySelector("#categoriesPreview .categoriesPreview-list");

        const genresContainer = document.createElement("div");
        genresContainer.classList.add("category-container");

        const genresTitle = document.createElement("h3");
        genresTitle.classList.add("category-title");
        genresTitle.setAttribute("id", "id" + genre.id);

        const genresTitleText = document.createTextNode(genre.name);
        genresTitle.appendChild(genresTitleText);

        genresContainer.appendChild(genresTitle);
        previewGenresContainer.appendChild(genresContainer);
    });
}

getTrendingMoviesPreview();
getGenresPreview();