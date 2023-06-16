"use strict";

import { api_key, fetchDataFromServer, imageBaseURL } from "./api.js";

export function sidebar() {
  const genreList = {};

  fetchDataFromServer(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
    function ({ genres }) {
      for (const { id, name } of genres) {
        genreList[id] = name;
      }

      genreLink();
    }
  );

  const sidebarInner = document.createElement("div");
  sidebarInner.classList.add("sidebarInner");

  sidebarInner.innerHTML = `<div class="sidebarList">
      <p class="title">Genre</p>

    </div>

    <div class="sidebarList">
      <p class="title">Language</p>

      <a href="/movie-list.html" class="sidebarLink" menu-close onclick="getMovieList('with_original_language=en', 'English')">English</a>

      <a href="/movie-list.html" class="sidebarLink" menu-close onclick="getMovieList('with_original_language=bn', 'Bangali')">Bangali</a>

      <a href="/movie-list.html" class="sidebarLink" menu-close onclick="getMovieList('with_original_language=hi', 'Hindi')">Hindi</a>

      <a href="/movie-list.html" class="sidebarLink" menu-close>Franch</a>

      <a href="/movie-list.html" class="sidebarLink" menu-close>German</a>

      <a href="/movie-list.html" class="sidebarLink" menu-close>Spanish</a>

      <a href="/movie-list.html" class="sidebarLink" menu-close>Chinese</a>
    </div>

    <div class="sidebarFooter">
      <p class="copyright">
        Copyright 2023 <a href="https://fiverr.com/manik_0">Manik</a>
      </p>

      <img
        src="./assets/images/tmdb-logo.svg"
        alt="the movie databse logo"
        width="130"
        height="17"
      />
    </div>`;

  const genreLink = () => {
    for (const [genreId, genreName] of Object.entries(genreList)) {
      const link = document.createElement("a");
      link.classList.add("sidebarLink");
      link.setAttribute("href", "./movie-list.html");
      link.setAttribute("menu", "");
      link.setAttribute(
        "onclick",
        `getMovieList("with_genres=${genreId}", "${genreName}")`
      );
      link.textContent = genreName;

      sidebarInner.querySelectorAll(".sidebarList")[0].appendChild(link);
    }

    const sidebar = document.querySelector("[sidebar]");
    sidebar.appendChild(sidebarInner);
    toggleSidebar(sidebar);
  };

  const toggleSidebar = (sidebar) => {
    const sidebarBtn = document.querySelector("[menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
    const sidebarClose = document.querySelectorAll("[menu-close]");
    const overlay = document.querySelector("[overlay]");

    addEventOnElements(sidebarTogglers, "click", () => {
      sidebar.classList.toggle("active");
      sidebarBtn.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    addEventOnElements(sidebarClose, "click", () => {
      sidebar.classList.remove("active");
      sidebarBtn.classList.remove("active");
      overlay.classList.remove("active");
    });
  };
}
