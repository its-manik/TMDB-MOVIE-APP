"use strict";

import { imageBaseURL } from "./api.js";

export function createMovieCard(movie) {
  const {
    backdrop_path,
    name,
    title,
    first_air_date,
    release_date,
    genre_ids,
    overview,
    poster_path,
    vote_average,
    id,
  } = movie;

  const card = document.createElement("div");
  card.classList.add("movieCard");

  card.innerHTML = `
        
      <figure class="posterBox cardBanner">
      <img src="${imageBaseURL}w342${poster_path}" alt="${name || title}" class="imgCover" loading="lazy">
    </figure>

    <h4 class="title">
    ${title || name}
    </h4>

    <div class="metaList">
      <div class="metaItem">
        <img src="./assets/images/star.png" width="20" height="20" alt="rating" loading="lazy">
        <span class="span">${vote_average.toFixed(1)}</span>
      </div>

      <div class="cardBadge">
        ${first_air_date ? first_air_date.split("-")[0] : release_date.split("-")[0]}
      </div>

    </div>

    <a href="detail.html" class="cardBtn" title="${name || title}" onclick="getMovieDetailsById(${id})"></a>
      `;

      return card
}
