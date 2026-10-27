document.addEventListener("DOMContentLoaded", () => {

    // URL de base de l'API OCMovies (serveur lancé en local)
    const API_URL = "http://localhost:8000/api/v1/titles/";
    // Nombre de films affichés par catégorie
    const MOVIES_PER_PAGE = 6;

    // ----------------------------
    // Appels à l'API
    // ----------------------------

    async function fetchJson(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return response.json();
    }

    async function fetchMovieDetails(movieId) {
        try {
            return await fetchJson(`${API_URL}${movieId}`);
        } catch (error) {
            console.error("Erreur lors de la récupération du film :", error);
            alert("Impossible de récupérer les détails du film.");
        }
    }

    // ----------------------------
    // Gestion du modal
    // ----------------------------

    const modalWindow = document.getElementById("modal_window");
    const closeModalBtn = document.getElementById("close_modal");
    const closeModalSpan = document.querySelector(".close");
    const modalImg = document.getElementById("imgfilm");

    async function openModal(movieId) {
        const movie = await fetchMovieDetails(movieId);
        if (!movie) return;

        document.getElementById("modal_title").innerText = movie.title || "Titre inconnu";
        document.getElementById("modal_year").innerText = movie.year || "Année inconnue";
        document.getElementById("modal_genre").innerText = movie.genres ? movie.genres.join(", ") : "Genres inconnus";
        document.getElementById("modal_duration").innerText = movie.duration ? `${movie.duration} min` : "Durée inconnue";
        document.getElementById("modal_score").innerText = movie.imdb_score || "Score inconnu";
        document.getElementById("modal_director").innerText = movie.directors ? movie.directors.join(", ") : "Réalisateur inconnu";
        document.getElementById("modal_description").innerText = movie.description || "Description non disponible";
        document.getElementById("modal_cast").innerText = movie.actors ? movie.actors.join(", ") : "Casting inconnu";

        modalImg.src = "";
        modalImg.src = movie.image_url;
        modalImg.alt = movie.title || "";

        modalWindow.style.display = "flex";
        modalWindow.classList.add("fade-in");
    }

    function closeModal() {
        modalWindow.classList.remove("fade-in");
        modalWindow.classList.add("fade-out");
        setTimeout(() => {
            modalWindow.style.display = "none";
            modalWindow.classList.remove("fade-out");
        }, 300);
    }

    // Un seul écouteur pour toute la page : ouverture et fermeture du modal
    document.body.addEventListener("click", (event) => {
        const target = event.target;
        const movieId = target.dataset.id;

        // Ouvrir le modal si on clique sur l'image d'un film ou sur un bouton "Details"
        if (movieId && (target.tagName === "IMG" || target.classList.contains("details-btn"))) {
            openModal(movieId);
        }

        // Fermer le modal si on clique en dehors ou sur les éléments de fermeture
        if (target === modalWindow || target === closeModalBtn || target === closeModalSpan) {
            closeModal();
        }
    });

    // ----------------------------
    // Affichage des films
    // ----------------------------

    function addHoverEffect(img) {
        img.addEventListener("mouseover", () => {
            img.style.transform = "scale(1.1)";
            img.style.transition = "0.3s ease-in-out";
        });
        img.addEventListener("mouseout", () => {
            img.style.transform = "scale(1)";
        });
    }

    function createMovieImage(movie) {
        const img = document.createElement("img");
        img.src = movie.image_url;
        img.alt = movie.title;
        img.dataset.id = movie.id;
        addHoverEffect(img);
        return img;
    }

    function displayMovies(movies, container) {
        container.innerHTML = "";
        movies.forEach(movie => container.appendChild(createMovieImage(movie)));
    }

    function displayEmptyMessage(container) {
        container.innerHTML = "";
        const message = document.createElement("p");
        message.classList.add("empty-message");
        message.textContent = "Aucun film disponible pour cette catégorie.";
        container.appendChild(message);
    }

    // ----------------------------
    // Carrousels par genre
    // ----------------------------

    // Crée un carrousel de MOVIES_PER_PAGE films pour un conteneur et ses deux boutons.
    // L'API gère la pagination (page_size) et indique s'il existe une page précédente/suivante.
    function createCarousel(container, prevBtn, nextBtn) {
        let genre = null;
        let currentPage = 1;
        let lastRequest = 0;

        async function loadPage(page) {
            const requestId = ++lastRequest;
            const url = `${API_URL}?genre=${encodeURIComponent(genre)}&page_size=${MOVIES_PER_PAGE}&page=${page}`;
            try {
                const data = await fetchJson(url);
                // Ignorer une réponse arrivée après une requête plus récente
                if (requestId !== lastRequest) return;

                currentPage = page;
                if (data.results.length === 0) {
                    displayEmptyMessage(container);
                } else {
                    displayMovies(data.results, container);
                }
                prevBtn.disabled = !data.previous;
                nextBtn.disabled = !data.next;
            } catch (error) {
                console.error(`Erreur lors de la récupération des films (${genre}) :`, error);
            }
        }

        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) loadPage(currentPage - 1);
        });
        nextBtn.addEventListener("click", () => loadPage(currentPage + 1));

        return {
            show(newGenre) {
                genre = newGenre;
                loadPage(1);
            }
        };
    }

    // Catégories fixes
    createCarousel(
        document.getElementById("sci-fi_movies"),
        document.getElementById("prev-sci-fi"),
        document.getElementById("next-sci-fi")
    ).show("Sci-Fi");

    createCarousel(
        document.getElementById("comedy_movies"),
        document.getElementById("prev-comedy"),
        document.getElementById("next-comedy")
    ).show("Comedy");

    // Catégorie choisie dans la liste déroulante
    const genreSelect = document.getElementById("genre_select");
    const selectedCategoryTitle = document.getElementById("selected-category-title");
    const selectedCarousel = createCarousel(
        document.getElementById("list_film"),
        document.getElementById("prev-selected"),
        document.getElementById("next-selected")
    );

    function showSelectedGenre() {
        selectedCategoryTitle.textContent = genreSelect.value;
        selectedCarousel.show(genreSelect.value);
    }

    genreSelect.addEventListener("change", showSelectedGenre);
    showSelectedGenre();

    // ----------------------------
    // Meilleur film et Top Films
    // ----------------------------

    function displayBestMovie(bestMovie) {
        const movieImg = document.querySelector(".best-movie .movie-card img");
        movieImg.src = bestMovie.image_url;
        movieImg.alt = bestMovie.title;

        document.querySelector(".best-movie .movie-card h3").textContent = bestMovie.title;
        document.querySelector(".best-movie .movie-card button.details-btn").dataset.id = bestMovie.id;

        // La description complète n'est disponible que sur l'endpoint de détail du film
        const movieDescription = document.querySelector(".best-movie .movie-card p");
        fetchJson(`${API_URL}${bestMovie.id}`)
            .then(movieDetail => {
                movieDescription.textContent = movieDetail.description || "Description non disponible";
            })
            .catch(error => console.error("Erreur lors de la récupération de la description :", error));
    }

    // Une seule requête pour les deux sections : le 1er film est le meilleur,
    // les suivants forment le Top Films (aucun doublon possible entre les deux).
    // Le nombre de votes départage les films ayant la même note.
    async function loadBestAndTopMovies() {
        try {
            const data = await fetchJson(`${API_URL}?sort_by=-imdb_score,-votes&page_size=${MOVIES_PER_PAGE + 1}`);
            const [bestMovie, ...topMovies] = data.results;
            if (bestMovie) displayBestMovie(bestMovie);
            displayMovies(topMovies, document.getElementById("top_movies"));
        } catch (error) {
            console.error("Erreur lors de la récupération du meilleur film et des Top Films :", error);
        }
    }

    loadBestAndTopMovies();
});
