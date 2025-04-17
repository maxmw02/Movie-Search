let movies;
const movieList = document.querySelector(".movie__list");

async function loadMovies() {
  const loader = document.querySelector('.movies__loading')
  loader.classList.add('display')
  if (!movies) {
    movies = await renderMovies()
  }
  loader.classList.remove('display')
}




async function renderMovies() {
  const searchInput = document.getElementById("search__input").value;
  const res = await fetch(`http://www.omdbapi.com/?apikey=84eb025a&s=${searchInput || ""}`);
  const result = await res.json();
  const data = result.Search;
  movieList.innerHTML = data.map((movie) => movieHtml(movie)).join("");
}

function movieHtml(movie) {
  return `<div class="movie">
              <figure class="movie__img--wrapper">
                <img class="movie__img" src="${movie.Poster}">
              </figure>
              <div class="movie__description">
                <div class="movie__title">${movie.Title}</div>
                <div class="movie__year">${movie.Year}</div>
                <div class="movie__imdbID">imdbID: ${movie.imdbID}</div>
              </div>
            </div>`;
}

// SLIDER

const slider = document.querySelector(".range__slider");
const progress = slider.querySelector(".progress");
const minYearInput = slider.querySelector(".min__year");
const maxYearInput = slider.querySelector(".max__year");
const minInput = slider.querySelector(".min__input");
const maxInput = slider.querySelector(".max__input");

const updateProgress = () => {
  const minValue = parseInt(minInput.value);
  const maxValue = parseInt(maxInput.value);

  const range = maxInput.max - minInput.min;
  const valueRange = maxValue - minValue;
  const width = (valueRange / range) * 100;
  const minOffset = ((minValue - minInput.min) / range) * 100;

  progress.style.width = width + "%";
  progress.style.left = minOffset + "%";

  minYearInput.value = minValue;
  maxYearInput.value = maxValue;
};

const updateRange = (event) => {
  const input = event.target;

  let min = parseInt(minYearInput.value);
  let max = parseInt(maxYearInput.value);

  if (input === minYearInput && min > max) {
    max = min;
    maxYearInput.value = max;
  } else if (input === maxYearInput && max < min) {
    min = max;
    minYearInput.value = min;
  }

  minInput.value = min;
  maxInput.value = max;

  updateProgress();
};

minYearInput.addEventListener("input", updateRange);
maxYearInput.addEventListener("input", updateRange);

minInput.addEventListener("input", () => {
  if (parseInt(minInput.value) >= parseInt(maxInput.value)) {
    maxInput.value = minInput.value;
  }
  updateProgress();
});

maxInput.addEventListener("input", () => {
  if (parseInt(maxInput.value) <= parseInt(minInput.value)) {
    minInput.value = maxInput.value;
  }
  updateProgress();
});

updateProgress();
