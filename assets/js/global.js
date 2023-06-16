"use strict";

// Add event on multiple elements
const addEventOnElements = function (elements, eventType, callback) {
  for (const elem of elements) elem.addEventListener(eventType, callback);
};

// Toogle search box in mobile device || small screen
const searchBox = document.querySelector("[search-box]");
const searchTogglers = [...document.querySelectorAll("[search-toggler]")];

addEventOnElements(searchTogglers, "click", function () {
  searchBox.classList.toggle("active");
});

// const ci = document.querySelector(".controlInner");

// ci.addEventListener("wheel", (e) => {
//     if(e.wheelDelta > 0){
//         this.screenLeft -= 500;
//         console.log("hello", this.screenLeft);
//     }else{
//         this.screenLeft += 500;
//     }
//     console.log(e.wheelDelta);
// }, {passive: true})

// set movieId in 'localStorage', you will be able to get any movie details using this movieId

const getMovieDetailsById = (movieId) => {
  window.localStorage.setItem("movieId", String(movieId));
};

const getMovieList = (urlParam, genreName) => {
  window.localStorage.setItem("urlParam", urlParam);
  window.localStorage.setItem("genreName", genreName);
};
