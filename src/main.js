// Data

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
    language: "es",
  },
});

function likedMoviesList() {
  const item = localStorage.getItem("liked_movies");

  let movies = item ? JSON.parse(item) : {};

  return movies;
}

function likeMovie(movie) {
  const likedMovies = likedMoviesList();

  const getMovie = likedMovies[movie.id];

  likedMovies[movie.id] = getMovie ? undefined : movie;

  localStorage.setItem("liked_movies", JSON.stringify(likedMovies));
}

// Utils

const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", url);
    }
  });
});

function createMovies(
  movies,
  container,
  { lazyLoad = false, clean = true } = {}
) {
  if (clean) container.innerHTML = "";

  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      lazyLoad ? "data-img" : "src",
      `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
    );
    movieImg.addEventListener("click", () => {
      location.hash = "movie=" + movie.id;
    });
    movieImg.addEventListener("error", () => {
      movieImg.setAttribute("src", `../image/defaultImg.svg`);
    });

    const movieBtn = document.createElement("button");
    movieBtn.classList.add("movie-btn");
    likedMoviesList()[movie.id] && movieBtn.classList.add("movie-btn--liked");
    movieBtn.addEventListener("click", () => {
      movieBtn.classList.toggle("movie-btn--liked");
      likeMovie(movie);
      getLikedMovies();
      getTrendingMoviesPreview();
    });

    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }

    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);
    container.appendChild(movieContainer);
  });
}

function createGenre(genres, container) {
  container.innerHTML = "";

  genres.forEach((genre) => {
    const genresContainer = document.createElement("div");
    genresContainer.classList.add("category-container");

    const genresTitle = document.createElement("h3");
    genresTitle.classList.add("category-title");
    genresTitle.setAttribute("id", "id" + genre.id);
    genresTitle.addEventListener(
      "click",
      () => (location.hash = `genre=${genre.id}-${genre.name}`)
    );

    const genresTitleText = document.createTextNode(genre.name);
    genresTitle.appendChild(genresTitleText);

    genresContainer.appendChild(genresTitle);
    container.appendChild(genresContainer);
  });
}

// Call to API

async function getTrendingMoviesPreview() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;

  createMovies(movies, trendingMoviesPreviewList, { lazyLoad: true });
}

async function getGenresPreview() {
  const { data } = await api("genre/movie/list");
  const genres = data.genres;

  createGenre(genres, categoriesPreviewList);
}

async function getMoviesByGenre(id) {
  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection, { lazyLoad: true });
}

function getPaginatedMoviesByGenre(id) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const pageIsMax = page < maxPage;

    if (scrollIsBottom && pageIsMax) {
      page++;
      const { data } = await api("discover/movie", {
        params: {
          with_genres: id,
          page,
        },
      });
      const movies = data.results;

      createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    }
  };
}

async function getMoviesBySearch(query) {
  const { data } = await api("search/movie", {
    params: {
      query,
    },
  });
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection, { lazyLoad: true });
}

function getPaginatedMoviesBySearch(query) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const pageIsMax = page < maxPage;

    if (scrollIsBottom && pageIsMax) {
      page++;
      const { data } = await api("search/movie", {
        params: {
          query,
          page,
        },
      });
      const movies = data.results;

      createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    }
  };
}

async function getTrendingMovies() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection, { lazyLoad: true, clean: true });
}

async function getPaginatedTrendingMovies() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
  const pageIsMax = page < maxPage;

  if (scrollIsBottom && pageIsMax) {
    page++;
    const { data } = await api("trending/movie/day", {
      params: {
        page,
      },
    });
    const movies = data.results;

    createMovies(movies, genericSection, { lazyLoad: true, clean: false });
  }
}

async function getMovieById(id) {
  const { data: movie } = await api("movie/" + id);

  const movieImgUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  headerSection.style.background = `
        linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.35) 19.27%,
            rgba(0, 0, 0, 0) 29.17%
        ),
        url(${movieImgUrl})
    `;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average.toFixed(1);

  createGenre(movie.genres, movieDetailCategoriesList);

  getSimilarMoviesById(id);
}

async function getSimilarMoviesById(id) {
  const { data } = await api(`/movie/${id}/similar`);
  const movies = data.results;

  createMovies(movies, relatedMoviesContainer, { lazyLoad: true });

  relatedMoviesContainer.scrollTo(0, 0);
}

function getLikedMovies() {
  const likedMovies = likedMoviesList();
  const moviesArray = Object.values(likedMovies);

  createMovies(moviesArray, likedMoviesListArticle, {
    lazyLoad: true,
    clean: true,
  });
}
