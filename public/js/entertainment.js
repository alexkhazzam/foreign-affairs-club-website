const btns = document.querySelectorAll('.entertainment-btn');

let activeInput = document.getElementById('covid');

btns.forEach(btn => {
  btn.addEventListener('click', e => {
    activeInput.style.display = 'none';
    const input = document.getElementById(e.target.id.split('-')[0]);
    input.style.display = 'block';
    activeInput = input;
  });
});

const fetchCountry = country => {
  fetch('https://ajayakv-rest-countries-v1.p.rapidapi.com/rest/v1/all', {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '5cdb349f57msh8bb01b1b9916332p117422jsn5892b9abe38d',
      'x-rapidapi-host': 'ajayakv-rest-countries-v1.p.rapidapi.com',
    },
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(e => {
      console.log(e);
    });
};

const fetchCOVID = () => {
  const APIResults = document.getElementById('api-results');
  const COVIDSpinner = document.getElementById('covid-spinner');
  const COVIDInput = document.getElementById('covid-country-input');

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
        alert('DNE');
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
    .finally(() => {
      COVIDInput.value = '';
      COVIDSpinner.style.visibility = 'hidden';
    });
};

const fetchMovies = () => {
  const movie = document.getElementById('movie-input');
  const movieSpinner = document.getElementById('movie-spinner');
  const APIResults = document.getElementById('api-results');

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
        alert('DNE');
      }
    })
    .finally(() => {
      movie.value = '';
      movieSpinner.style.visibility = 'hidden';
    });
};