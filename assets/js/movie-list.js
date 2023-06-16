"use strict";

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const genreName = window.localStorage.getItem("genreName");
const urlParam = window.localStorage.getItem("urlParam");
const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

sidebar();

let currentPage = 1;
let totalPage = 0;

fetchDataFromServer(
  `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`,
  function ({ results: movieList, total_pages }) {
    totalPage = total_pages;

    document.title = `${genreName} Movies - NikTv`;

    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movieList", "genreList");
    movieListElem.ariaLabel = `${genreName} Movies`;

    movieListElem.innerHTML = `
    <div class="titleWrapper">
    <h3 class="heading">All ${genreName} Movies</h3>
  </div>

  <div class="gridList">
  </div>

  <button class="btn loadMore" load-more>Load More</button>
    `;

    // add movie card based on fached item

    for (const movie of movieList) {
      const movieCard = createMovieCard(movie);

      movieListElem.querySelector(".gridList").appendChild(movieCard);
    }
    pageContent.appendChild(movieListElem);

    // Load more button functionality

    document
      .querySelector("[load-more]")
      .addEventListener("click", function () {
        if (currentPage >= totalPage) {
          this.style.display = "none";
        }
        this.classList.add("loading");

        currentPage++;

        fetchDataFromServer(
          `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`,
          ({ results: movieList }) => {
            for (const movie of movieList) {
              const movieCard = createMovieCard(movie);
              movieListElem.querySelector(".gridList").appendChild(movieCard);
            }

            this.classList.remove("loading");
          }
        );
      });
  }
);



search()