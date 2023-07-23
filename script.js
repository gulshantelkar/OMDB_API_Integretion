        
        
async function fetchMovies(pageNumber, searchQuery = '') {
    const apiKey = '78103468'; 
    const moviesPerPage = 10;
    const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchQuery}&type=movie&page=${pageNumber}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.Search && data.Search.length > 0) {
            const movieListContainer = document.getElementById('movieList');
            movieListContainer.innerHTML = '';

            data.Search.forEach((movie) => {
                const row = document.createElement('tr');

                const moviePosterCell = document.createElement('td');
                const moviePoster = document.createElement('img');
                moviePoster.classList.add('movie-poster');
                moviePoster.src = movie.Poster !== 'N/A' ? movie.Poster : 'default-poster.jpg';
                moviePosterCell.appendChild(moviePoster);

                const movieTitleCell = document.createElement('td');
    const movieTitleLink = document.createElement('a');
    movieTitleLink.textContent = movie.Title;
    movieTitleLink.href = 'javascript:void(0)'; 
    movieTitleLink.addEventListener('click', () => openModal(movie.imdbID));
    movieTitleCell.appendChild(movieTitleLink);

                const ratingCell = document.createElement('td');
                const ratingInput = document.createElement('input');
                ratingInput.style.display = "block";
                ratingInput.style.margin = "auto";
                ratingInput.type = 'number';
                ratingInput.min = 1;
                ratingInput.max = 10;
                ratingInput.step = 0.1;
                ratingInput.value = getRatingFromLocalStorage(movie.imdbID) || '';
                ratingInput.id = `rating_${movie.imdbID}`; 
                ratingInput.setAttribute("movieId", movie.imdbID);
             

                const editRatingButton = document.createElement('button');
                
                editRatingButton.classList.add("editcommentbtn")
                editRatingButton.innerText = "Submit";
                editRatingButton.setAttribute("movieId", movie.imdbID);
                editRatingButton.addEventListener("click", submitRating);

                ratingCell.appendChild(ratingInput);
                ratingCell.appendChild(editRatingButton);

                const commentCell = document.createElement('td');
                const commentInput = document.createElement('textarea');
                commentInput.style.display = "block";
                commentInput.style.margin = "auto";
                commentInput.rows = 2;
                commentInput.cols = 25;
                commentInput.value = getCommentFromLocalStorage(movie.imdbID) || '';
                commentInput.id = `comment_${movie.imdbID}`; 
                commentInput.setAttribute("movieId", movie.imdbID);
            
                
                const editCommentButton = document.createElement('button');
                editCommentButton.classList.add("editcommentbtn");
                editCommentButton.innerText = "Submit";
                editCommentButton.setAttribute("movieId", movie.imdbID);
                editCommentButton.addEventListener("click", submitComment);
              
                commentCell.appendChild(commentInput);
                commentCell.appendChild(editCommentButton);  

                row.appendChild(moviePosterCell);
                row.appendChild(movieTitleCell);
                row.appendChild(ratingCell);
                row.appendChild(commentCell);

                movieListContainer.appendChild(row);
            });

            const totalPages = Math.ceil(data.totalResults / moviesPerPage);
            updatePaginationButtons(pageNumber, totalPages);
        
        } else {
            console.log('No movies found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function updatePaginationButtons(currentPage, totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

   
    const maxPages = 10;
    const startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(totalPages, startPage + maxPages - 1);

 
    if (currentPage > 1) {
        const backButton = createPaginationButton(currentPage - 1, 'Back');
        paginationContainer.appendChild(backButton);
    }

   
    for (let i = startPage; i <= endPage; i++) {
        const button = createPaginationButton(i, i);
        if (i === currentPage) {
            button.classList.add('active');
        }
        paginationContainer.appendChild(button);
    }

    if (currentPage < totalPages) {
        const nextButton = createPaginationButton(currentPage + 1, 'Next');
        paginationContainer.appendChild(nextButton);
    }
}
function createPaginationButton(pageNumber, text) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', () => fetchMovies(pageNumber, searchInput.value));
    return button;
}

function searchMovies() {
    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput.value.trim();
    if (searchQuery !== '') {
        fetchMovies(1, searchQuery);
    } else {

        fetchMovies(1);
    }
}

async function openModal(movieID) {
    const apiKey = '78103468'; 
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalPoster = document.getElementById('modalPoster');
    const modalYear = document.getElementById('modalYear');
    const modalGenre = document.getElementById('modalGenre');
    const modalDirector = document.getElementById('modalDirector');
    const modalPlot = document.getElementById('modalPlot');
 

    const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieID}`;
    try {
        const response = await fetch(apiUrl);
        const movie = await response.json();

        modalTitle.textContent = movie.Title;
        modalPoster.src = movie.Poster !== 'N/A' ? movie.Poster : 'default-poster.jpg';
        modalYear.textContent = movie.Year;
        modalGenre.textContent = movie.Genre;
        modalDirector.textContent = movie.Director;
        modalPlot.textContent = movie.Plot;

       

        modal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function editRatingButtonClick(e){
    console.log('click');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function submitRating(e) {
    const movieId = e.target.getAttribute("movieId");
    const inputField = document.getElementById(`rating_${movieId}`);
    let value = parseFloat(inputField.value);
    if (isNaN(value) || value < 1) {
        value = 1;
    } else if (value > 10) {
        value = 10;
    }
    inputField.value = value;
    saveRating(movieId, value);
   
}

function submitComment(e) {
    const movieId = e.target.getAttribute("movieId");
    const inputField = document.getElementById(`comment_${movieId}`);
    const value = inputField.value;
 
    saveComment(movieId, value);
}

function saveRating(movieID, rating) {
   
    localStorage.setItem(movieID + '_rating', rating);
}

function getRatingFromLocalStorage(movieID) {
    
    return localStorage.getItem(movieID + '_rating');
}

function saveComment(movieID, comment) {
  
    localStorage.setItem(movieID + '_comment', comment);
}

function getCommentFromLocalStorage(movieID) {
 
    return localStorage.getItem(movieID + '_comment');
}

fetchMovies(1); 
