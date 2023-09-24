const api = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },
    params: {
        "api_key": API_KEY
    }
});

// Utils

function createMovies(movies, container) {
    container.innerHTML = "";

    movies.forEach(movie => {
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-container");

        const movieImg = document.createElement("img");
        movieImg.classList.add("movie-img");
        movieImg.setAttribute("alt", movie.title);
        movieImg.setAttribute("src", "https://image.tmdb.org/t/p/w300/" + movie.poster_path);

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
}

function createGenre(genres, container) {
    container.innerHTML = "";

    genres.forEach(genre => {
        const genresContainer = document.createElement("div");
        genresContainer.classList.add("category-container");

        const genresTitle = document.createElement("h3");
        genresTitle.classList.add("category-title");
        genresTitle.setAttribute("id", "id" + genre.id);
        genresTitle.addEventListener("click", () => location.hash = `genre=${genre.id}-${genre.name}`);

        const genresTitleText = document.createTextNode(genre.name);
        genresTitle.appendChild(genresTitleText);

        genresContainer.appendChild(genresTitle);
        container.appendChild(genresContainer);
    });
}


// Llamados a la API

async function getTrendingMoviesPreview() {
    const { data } = await api("trending/movie/day");
    const movies = data.results;

    createMovies(movies, trendingMoviesPreviewList);
}

async function getGenresPreview() {
    const { data } = await api("genre/movie/list");
    const genres = data.genres;

    createGenre(genres, categoriesPreviewList);
}

async function getMoviesByGenre(id) {
    const { data } = await api("discover/movie", {
        params: {
            with_genres: id
        }
    });
    const movies = data.results;

    createMovies(movies, genericSection);
}

async function getMoviesBySearch(query) {
    const { data } = await api("search/movie", {
        params: {
            query
        }
    });
    const movies = data.results;

    createMovies(movies, genericSection);
}