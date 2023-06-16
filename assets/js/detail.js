"use strict";

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";

const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

sidebar();

const getGenres = function (genreList) {
  const newGenreList = [];

  for (const { name } of genreList) newGenreList.push(name);

  return newGenreList.join(", ");
};

const getCasts = function (castList) {
  const newCastList = [];

  for (let i = 0, len = castList.length; i < len && i < 10; i++) {
    const { name } = castList[i];
    newCastList.push(name);
  }
  return newCastList.join(", ");
};

const getDirectors = function (crewList) {
  const directors = crewList.filter(({ job }) => job === "Director");

  const directorsList = [];
  for (const { name } of directors) directorsList.push(name);

  return directorsList.join(", ");
};

// returns only trailers and teasers as arry
const filterVideos = function (vidoeList) {
  return vidoeList.filter(
    ({ type, site }) =>
      (type === "Trailer" || type === "Teaser") && site === "YouTube"
  );
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=videos,casts,images,releases`,
  function (movie) {
    const {
      backdrop_path,
      id,
      poster_path,
      title,
      release_date,
      releases: {
        countries: [{ certification }],
      },
      runtime,
      vote_average,
      genres,
      overview,
      casts: { cast, crew },
      videos: { results: videos },
    } = movie;

    document.title = `${title} - NikTv`;

    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movieDetail");

    movieDetail.innerHTML = `
    <div
    class="backdropImage"
    style="background-image: url('${imageBaseURL}${"w1280" || "original"}${
      backdrop_path || poster_path
    }')"
  ></div>

  <figure class="posterBox moviePoster">
    <img
      src="${imageBaseURL}w342${poster_path}"
      alt="${title}" class="imgCover"
    />
  </figure>

  <div class="detailBox">

    <div class="detailContent">
      <h1 class="heading">
        ${title}
      </h1>

        <div class="metaList">
          <div class="metaItem">
            <img
              src="./assets/images/star.png"
              alt="rating"
              width="20"
              height="20"
            />

            <span class="span">${vote_average.toFixed(1)}</span>
          </div>

          <div class="separator"></div>

          <div class="metaItem">${runtime}m</div>

          <div class="seperator"></div>

          <div class="metaItem">${release_date.split("-")[0]}</div>
          <div class="metaItem cardBadge">${certification}</div>
        </div>

        <p class="genre">${getGenres(genres)}</p>

        <p class="overview">${overview}
        </p>

        <ul class="detailList">
          <div class="listItem">
            <p class="listName">Starring</p>
            <p>${getCasts(cast)}
            </p>
          </div>

          <div class="listItem">
            <p class="listName">Directed By</p>
            <p>${getDirectors(crew)}</p>
          </div>
        </ul>
    </div>

    <div class="titleWrapper">
      <h3 class="titleLarge">Trailers and Clips</h3>
    </div>

    <div class="sliderList">
      <div class="sliderInner"></div>
    </div>

  </div>
    `;

    for (const { key, name } of filterVideos(videos)) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("videoCard");

      videoCard.innerHTML = `
            <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0" frameborder="0" allowfullscreen="1" title="${name}" class="imgCover" loading="lazy"></iframe>
        `;

      movieDetail.querySelector(".sliderInner").appendChild(videoCard);
    }

    pageContent.appendChild(movieDetail);

    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`,
      addSuggestedMovies
    );
  }
);

const addSuggestedMovies = function ({ results: movieList }) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movieList");
  movieListElem.ariaLabel = `You May Also Like`;

  movieListElem.innerHTML = `
    <div class="titleWrapper">
    <h3 class="titleLarge">You May Also Like</h3>
  </div>
  
  <div class="sliderList">
    <div class="sliderInner"></div>
  </div>
    `;

  console.log(movieList);

  movieList?.forEach((movie) => {
    const movieCard = createMovieCard(movie); //called from movie-card.js
    movieListElem.querySelector(".sliderInner").appendChild(movieCard);
  });

  pageContent.appendChild(movieListElem);
};
