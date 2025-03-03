const API_KEY = 'ace34744364ae05fe198acb593ef4ddc'; 
        const BASE_URL = 'https://api.themoviedb.org/3';

        const topRatedButton = document.getElementById('topRatedButton');
        const popularButton = document.getElementById('popularButton');
        const searchButton = document.getElementById('searchButton');

        topRatedButton.addEventListener('click', fetchTopRated);
        popularButton.addEventListener('click', fetchPopular);
        searchButton.addEventListener('click', search);
        const searchInput = document.getElementById('searchQuery');

        searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
        search();
        }
        });


        function showError(message, actionable = false) {
            let errorDiv = document.getElementById('error');
        
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.id = 'error';
                errorDiv.className = 'alert alert-danger text-center';
            }
        
            errorDiv.textContent = actionable
                ? `${message}. Please try again or adjust your input.`
                : `${message}. Something went wrong, please try again later.`;
        
            // Move the error message to the top of the container
            const container = document.querySelector('.container');
            container.insertBefore(errorDiv, container.children[1]); // Places it after the heading
        
            // Make it visible
            errorDiv.classList.remove('d-none');
        }
        
        function clearError() {
            const errorDiv = document.getElementById('error');
            if (errorDiv) {
                errorDiv.classList.add('d-none');
            }
        }
        

        function fetchTopRated() {
            clearError();
            fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`)
                .then(response => response.json())
                .then(data => displayMovies(data.results.slice(0, 10)))
                .catch(error => showError('Failed to fetch top-rated movies', false));
        }

        function fetchPopular() {
            clearError();
            fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
                .then(response => response.json())
                .then(data => displayMovies(data.results.slice(0, 10)))
                .catch(error => showError('Failed to fetch popular movies', false));
        }

        function search() {
            clearError();
            const query = document.getElementById('searchQuery').value.trim();
            if (!query) {
                showError('Please enter a search query', true);
                return;
            }

            fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.results.length === 0) {
                        showError('No results found for your query', true);
                        return;
                    }
                    displaySearchResults(data.results);
                })
                .catch(error => showError('Something went wrong', false));
        }

        function displayMovies(movies) {
            const results = document.getElementById('results');
            results.innerHTML = '';

            movies.forEach(movie => {
                const col = document.createElement('div');
                col.className = 'col-md-4';

                const card = document.createElement('div');
                card.className = 'card h-100';

                const img = document.createElement('img');
                img.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
                img.alt = movie.title;
                img.className = 'card-img-top';

                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';
                cardBody.innerHTML = `<h5 class="card-title">${movie.title}</h5><p class="card-text">Release Date: ${movie.release_date}</p>`;

                card.appendChild(img);
                card.appendChild(cardBody);
                col.appendChild(card);
                results.appendChild(col);
            });
        }

        function displaySearchResults(results) {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            results.forEach(item => {
                const col = document.createElement('div');
                col.className = 'col-md-6';

                const card = document.createElement('div');
                card.className = 'card h-100';

                const img = document.createElement('img');
                img.src = `https://image.tmdb.org/t/p/w200${item.profile_path || item.poster_path}`;
                img.alt = item.name || item.title;
                img.className = 'card-img-top';

                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                if (item.media_type === 'person') {
                    cardBody.innerHTML = `<h5 class="card-title">${item.name}</h5><p class="card-text">Known for: ${item.known_for_department}</p>`;

                    const knownForList = document.createElement('ul');
                    item.known_for.forEach(work => {
                        const li = document.createElement('li');
                        li.textContent = `${work.media_type === 'movie' ? 'Movie' : 'TV'}: ${work.title || work.name}`;
                        knownForList.appendChild(li);
                    });
                    cardBody.appendChild(knownForList);
                } else {
                    cardBody.innerHTML = `<h5 class="card-title">${item.title}</h5><p class="card-text">Release Date: ${item.release_date}</p><p>${item.overview}</p>`;
                }

                card.appendChild(img);
                card.appendChild(cardBody);
                col.appendChild(card);
                resultsDiv.appendChild(col);
            });
        }