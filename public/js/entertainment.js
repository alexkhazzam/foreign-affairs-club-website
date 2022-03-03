const btns = document.querySelectorAll('.entertainment-btn');

let activeInput = document.getElementById('covid');

btns.forEach(btn => {
  btn.addEventListener('click', e => {
    document.getElementById('api-results').innerHTML = '';
    document.getElementById('value-alert').style.display = 'none';
    document.getElementById('not-found').style.display = 'none';
    document.getElementById('api-error').style.display = 'none';
    activeInput.style.display = 'none';
    const input = document.getElementById(e.target.id.split('-')[0]);
    input.style.display = 'block';
    activeInput = input;
  });
});

const fetchCountry = () => {
  const country = document.getElementById('country-data-input');
  const APIResults = document.getElementById('api-results');
  const enterValueAlert = document.getElementById('value-alert');
  const notFoundAlert = document.getElementById('not-found');
  const APIError = document.getElementById('api-error');

  if (APIError.style.display === 'block') {
    APIError.style.display = 'none';
  }

  if (notFoundAlert.style.display === 'block') {
    notFoundAlert.style.display = 'none';
  }

  if (country.value.trim() === '') {
    APIResults.innerHTML = '';
    return (enterValueAlert.style.display = 'block');
  } else {
    enterValueAlert.style.display = 'none';
  }

  fetch(`https://restcountries.com/v3.1/name/${country.value.trim()}`, {
    method: 'GET',
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      if (data.hasOwnProperty('status') && data.status === 404) {
        APIError.style.display = 'block';
      } else {
        console.log(data);
      }
    })
    .catch(e => {
      APIError.style.display = 'block';
    });
};

const fetchCOVID = () => {
  const COVIDSpinner = document.getElementById('covid-spinner');
  const COVIDInput = document.getElementById('covid-country-input');
  const APIResults = document.getElementById('api-results');
  const enterValueAlert = document.getElementById('value-alert');
  const notFoundAlert = document.getElementById('not-found');
  const APIError = document.getElementById('api-error');

  if (APIError.style.display === 'block') {
    APIError.style.display = 'none';
  }

  if (notFoundAlert.style.display === 'block') {
    notFoundAlert.style.display = 'none';
  }

  if (COVIDInput.value.trim() === '') {
    APIResults.innerHTML = '';
    return (enterValueAlert.style.display = 'block');
  } else {
    enterValueAlert.style.display = 'none';
  }

  APIResults.innerHTML = '';
  COVIDSpinner.style.visibility = 'visible';

  fetch(`https://api.covid19api.com/summary`, {
    method: 'GET',
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      const c = data.Countries.find(
        country =>
          country.Country.toUpperCase() ===
          COVIDInput.value.trim().toUpperCase()
      );
      if (!c) {
        notFoundAlert.textContent = `Country not found!`;
        notFoundAlert.style.display = 'block';
      } else {
        Object.entries(c).forEach(([key, value]) => {
          if (key !== 'ID' && key !== 'Slug' && key !== 'Premium') {
            APIResults.innerHTML += `
              <div class="result-wrapper">
                  <p class="result-key">${key}</p>
                  <p>${value}</p>
              </div>
              `;
          }
        });
      }
    })
    .catch(e => {
      APIError.style.display = 'block';
    })
    .finally(() => {
      COVIDInput.value = '';
      COVIDSpinner.style.visibility = 'hidden';
    });
};

const fetchMovies = () => {
  const movie = document.getElementById('movie-input');
  const movieSpinner = document.getElementById('movie-spinner');
  const APIResults = document.getElementById('api-results');
  const enterValueAlert = document.getElementById('value-alert');
  const notFoundAlert = document.getElementById('not-found');
  const APIError = document.getElementById('api-error');

  if (APIError.style.display === 'block') {
    APIError.style.display = 'none';
  }

  if (notFoundAlert.style.display === 'block') {
    notFoundAlert.style.display = 'none';
  }

  if (movie.value.trim() === '') {
    APIResults.innerHTML = '';
    return (enterValueAlert.style.display = 'block');
  } else {
    enterValueAlert.style.display = 'none';
  }

  APIResults.innerHTML = '';
  movieSpinner.style.visibility = 'visible';

  fetch(`https://www.omdbapi.com/?&t=${movie.value.trim()}&apikey=78628677`, {
    method: 'GET',
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      if (!data.hasOwnProperty('Error')) {
        Object.entries(data).forEach(([key, value]) => {
          if (
            key !== 'Ratings' &&
            key !== 'Poster' &&
            key !== 'Response' &&
            key !== 'Production' &&
            key !== 'Website'
          ) {
            APIResults.innerHTML += `
                  <div class="result-wrapper">
                      <p class="result-key">${key}</p>
                      <p>${value}</p>
                  </div>
                  `;
          } else if (key === 'Poster') {
            APIResults.insertAdjacentHTML(
              'afterbegin',
              `
              <div class="movie-image-wrapper">
                <img src=${value} height="350px" width="350"/>
              </div>
              `
            );
          }
        });
      } else {
        notFoundAlert.textContent = `Movie not found!`;
        notFoundAlert.style.display = 'block';
      }
    })
    .catch(e => {
      APIError.style.display = 'block';
    })
    .finally(() => {
      movie.value = '';
      movieSpinner.style.visibility = 'hidden';
    });
};
