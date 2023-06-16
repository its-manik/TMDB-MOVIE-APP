"use strict";

import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page-content]");

sidebar();

const homePageSections = [
  {
    title: "Upcoming Movies",
    path: "/movie/upcoming",
  },
  {
    title: "Tending Movies",
    path: "/trending/movie/week",
  },
  {
    title: "Top Rated Movies",
    path: "/movie/top_rated",
  },
];

const genreList = {
  asString(genreIdList) {
    let newGenreList = [];
    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]);
    }
    return newGenreList.join(", ");
  },
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
  function ({ genres }) {
    for (const { id, name } of genres) {
      genreList[id] = name;
    }
    fetchDataFromServer(
      `https://api.themoviedb.org/3/tv/popular?page=1&api_key=${api_key}`,
      heroBanner
    );
  }
);

const heroBanner = function ({ results: movieList }) {
  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.ariaLabel = "Popular Movies";

  banner.innerHTML = `
    <div class="bannerSlider">

  </div>

  <div class="sliderControl">
    <div class="controlInner">
    </div>
  </div>
    `;

  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {
    const {
      backdrop_path,
      name,
      first_air_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("sliderItem");
    sliderItem.setAttribute("slider-item", "");

    sliderItem.innerHTML = `
        <img
        src="${imageBaseURL}w1280${backdrop_path}"
        alt="${name}"
        class="imgCover"
        loading="${index === 0 ? "eager" : "lazy"}"
      />
      <div class="bannerContent">
        <h2 class="heading">${name}</h2>
        <div class="metaList">
          <div class="metaItem">${first_air_date.split("-")[0]}</div>
          <div class="metaItem cardBadge">${vote_average.toFixed(1)}</div>
        </div>
        <p class="genre">${genreList.asString(genre_ids)}</p>
        <p class="bannerText">${overview}
        </p>

        <a href="./detail.html" class="btn"  onclick="getMovieDetailsById(${id})">
          <img
            src="./assets/images/play_circle.png"
            width="24"
            height="24"
            aria-hidden="true"
            alt="play circle"
          />
          <span class="span">Watch Now</span>
        </a>
      </div>
        `;

    banner.querySelector(".bannerSlider").appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("posterBox", "sliderItem");
    controlItem.setAttribute("slider-control", `${controlItemIndex}`);

    controlItemIndex++;

    controlItem.innerHTML = `
        <img
          src="${imageBaseURL}w154${poster_path}"
          alt="Slide to ${name}"
          loading="lazy"
          draggable="false"
          class="imgCover"
        />
        `;
    banner.querySelector(".controlInner").appendChild(controlItem);
  }

  pageContent.appendChild(banner);

  addHeroSlide();

  // fetch data for home page sections (top rated, upcoming, tending)
  for (const { title, path } of homePageSections) {
    fetchDataFromServer(
      `https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`,
      createMovieList,
      title
    );
  }
};

// Hero slider functionality

const addHeroSlide = () => {
  const sliderItems = document.querySelectorAll("[slider-item");
  const sliderControls = document.querySelectorAll("[slider-control");

  let lastSliderItem = sliderItems[0];
  let lastSliderControl = sliderControls[0];

  lastSliderItem.classList.add("active");
  lastSliderControl.classList.add("active");

  const sliderStart = function () {
    // console.log(this);
    console.log(sliderControls, [...sliderItems]);
    console.log(lastSliderControl, lastSliderItem);
    lastSliderItem.classList.remove("active");
    lastSliderControl.classList.remove("active");

    sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
      "active"
    );
    this.classList.add("active");

    lastSliderControl =
      sliderItems[Number(this.getAttribute("slider-control"))];

    lastSliderItem = this;
  };

  addEventOnElements(sliderControls, "click", sliderStart);
};

const createMovieList = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movieList");
  movieListElem.ariaLabel = `${title}`;

  movieListElem.innerHTML = `
  <div class="titleWrapper">
  <h3 class="titleLarge">${title}</h3>
</div>

<div class="sliderList">
  <div class="sliderInner"></div>
</div>
  `;

  movieList?.forEach((movie) => {
    const movieCard = createMovieCard(movie); //called from movie-card.js
    movieListElem.querySelector(".sliderInner").appendChild(movieCard);
  });

  pageContent.appendChild(movieListElem);
};


search()