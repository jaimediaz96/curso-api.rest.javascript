let page = 1;
let maxPage;
let infinityScroll;

arrowBtn.addEventListener("click", () => history.back());
searchFormBtn.addEventListener(
  "click",
  () => (location.hash = "search=" + searchFormInput.value.trim())
);
trendingBtn.addEventListener("click", () => (location.hash = "trends"));

window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);
window.addEventListener("scroll", infinityScroll, { passive: false });

// Utils

function smoothscroll() {
  const currentScroll =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScroll > 0) {
    window.requestAnimationFrame(smoothscroll);
    window.scrollTo(0, currentScroll - currentScroll / 5);
  }
}

// Navegation

function navigator() {
  smoothscroll();

  if (infinityScroll) {
    window.removeEventListener("scroll", infinityScroll);
    infinityScroll = undefined;
  }

  if (location.hash.startsWith("#trends")) {
    trendsPage();
  } else if (location.hash.startsWith("#search=")) {
    searchPage();
  } else if (location.hash.startsWith("#movie=")) {
    moviePage();
  } else if (location.hash.startsWith("#genre=")) {
    genrePage();
  } else {
    homePage();
  }

  if (infinityScroll) {
    window.addEventListener("scroll", infinityScroll, { passive: false });
  }
}

function homePage() {
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.add("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.remove("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.remove("inactive");

  trendingPreviewSection.classList.remove("inactive");
  categoriesPreviewSection.classList.remove("inactive");
  genericSection.classList.add("inactive");
  movieDetailSection.classList.add("inactive");

  getTrendingMoviesPreview();
  getGenresPreview();
}

function trendsPage() {
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.add("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  headerCategoryTitle.innerHTML = "Tendencias";

  getTrendingMovies();

  infinityScroll = getPaginatedTrendingMovies;
}

function searchPage() {
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.remove("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  const [_, searchValue] = location.hash.split("=");
  const decodeSearchValue = decodeURI(searchValue);

  headerCategoryTitle.innerHTML = decodeSearchValue;

  getMoviesBySearch(decodeSearchValue);

  infinityScroll = getPaginatedMoviesBySearch(decodeSearchValue);
}

function moviePage() {
  headerSection.classList.add("header-container--long");
  // headerSection.style.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.add("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.add("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.add("inactive");
  movieDetailSection.classList.remove("inactive");

  const [_, movieId] = location.hash.split("=");

  getMovieById(movieId);
}

function genrePage() {
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.add("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  const [_, genreData] = location.hash.split("=");
  const [genreId, genreName] = genreData.split("-");

  const decodeName = decodeURI(genreName);
  headerCategoryTitle.innerHTML = decodeName;

  getMoviesByGenre(genreId);

  infinityScroll = getPaginatedMoviesByGenre(genreId);
}
