let movies;

const movieList = document.querySelector(".movie__list");

// Initial page load

document.addEventListener("DOMContentLoaded", () => {
  // Add event listener for the sort select - try different possible IDs

  const sortSelect =
    document.getElementById("sort__by") ||
    document.querySelector(".sort__select");

  if (sortSelect) {
    console.log(
      "Found sort element with ID:",
      sortSelect.id,
      "and value:",
      sortSelect.value
    );

    sortSelect.addEventListener("change", () => {
      console.log("Sort changed to:", sortSelect.value);

      sortMoviesAndDisplay();
    });
  } else {
    console.log("Sort element not found. Looking for any select element...");

    // Try to find any select element as fallback

    const anySelect = document.querySelector("select");

    if (anySelect) {
      console.log("Found select element with ID:", anySelect.id);

      anySelect.addEventListener("change", () => {
        console.log("Select changed to:", anySelect.value);

        sortMoviesAndDisplay();
      });
    }
  }

  // Add search button event listener

  const searchButton = document.getElementById("search__button");

  if (searchButton) {
    searchButton.addEventListener("click", loadMovies);
  }

  // Add search input enter key event listener

  const searchInput = document.getElementById("search__input");

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        loadMovies();
      }
    });
  }

  // Initialize everything

  updateProgress();

  loadMovies();
});

async function loadMovies() {
  const loader = document.querySelector(".movies__loading");

  if (loader) {
    loader.classList.add("display");
  }

  const searchInput = document.getElementById("search__input").value;

  const res = await fetch(
    `http://www.omdbapi.com/?apikey=84eb025a&s=${searchInput || ""}`
  );

  const result = await res.json();

  if (!result.Search) {
    movieList.innerHTML =
      '<div class="no-results">No movies found. Try another search.</div>';

    movies = [];
  } else {
    movies = result.Search;

    sortMoviesAndDisplay();
  }

  if (loader) {
    loader.classList.remove("display");
  }
}

function sortMoviesAndDisplay() {
  if (!movies || !movies.length) return;

  // Create a copy of the movies array to avoid modifying the original

  let sortedMovies = [...movies];

  console.log(
    "Original movies order:",
    sortedMovies.map((m) => m.Title + " (" + m.Year + ")").join(", ")
  );

  // Try to find the sort select element with multiple possible selectors

  const sortSelect =
    document.getElementById("sort__by") ||
    document.querySelector(".sort__select") ||
    document.querySelector("select");

  if (sortSelect) {
    const sortType = sortSelect.value;

    console.log("Sort type selected:", sortType); // Debug log

    // Apply sorting - handle all possible option values

    if (
      sortType === "NEWEST" ||
      sortType === "NEWEST_TO_OLDEST" ||
      sortType === "newest" ||
      sortType === "newest_to_oldest"
    ) {
      console.log("Sorting by newest first");

      sortedMovies.sort((a, b) => {
        const yearA = parseInt(a.Year);

        const yearB = parseInt(b.Year);

        console.log(`Comparing: ${a.Title}(${yearA}) vs ${b.Title}(${yearB})`);

        return yearB - yearA; // newest first
      });
    } else if (
      sortType === "OLDEST" ||
      sortType === "OLDEST_TO_NEWEST" ||
      sortType === "oldest" ||
      sortType === "oldest_to_newest"
    ) {
      console.log("Sorting by oldest first");

      sortedMovies.sort((a, b) => {
        const yearA = parseInt(a.Year);

        const yearB = parseInt(b.Year);

        console.log(`Comparing: ${a.Title}(${yearA}) vs ${b.Title}(${yearB})`);

        return yearA - yearB; // oldest first
      });
    } else if (sortType === "TITLE_ASC" || sortType === "title_asc") {
      sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
    } else if (sortType === "TITLE_DESC" || sortType === "title_desc") {
      sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
    }

    // Debug: Check if sorting worked

    console.log(
      "Sorted movies order:",
      sortedMovies.map((m) => m.Title + " (" + m.Year + ")").join(", ")
    );
  } else {
    console.log("No sort element found!");
  }

  // Apply year range filtering if elements exist

  const minYearElement = document.querySelector(".min__year");

  const maxYearElement = document.querySelector(".max__year");

  if (minYearElement && maxYearElement) {
    const minYear = parseInt(minYearElement.value);

    const maxYear = parseInt(maxYearElement.value);

    sortedMovies = sortedMovies.filter((movie) => {
      const movieYear = parseInt(movie.Year);

      return movieYear >= minYear && movieYear <= maxYear;
    });
  }

  // Display the movies

  movieList.innerHTML = sortedMovies.map((movie) => movieHtml(movie)).join("");
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

  sortMoviesAndDisplay(); // Re-sort and display when year range changes
};

minYearInput.addEventListener("input", updateRange);

maxYearInput.addEventListener("input", updateRange);

minInput.addEventListener("input", () => {
  if (parseInt(minInput.value) >= parseInt(maxInput.value)) {
    maxInput.value = minInput.value;
  }

  updateProgress();

  sortMoviesAndDisplay(); // Re-sort and display when slider changes
});

maxInput.addEventListener("input", () => {
  if (parseInt(maxInput.value) <= parseInt(minInput.value)) {
    minInput.value = maxInput.value;
  }

  updateProgress();

  sortMoviesAndDisplay(); // Re-sort and display when slider changes
});
