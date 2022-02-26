const removeTripBtns = document.querySelectorAll('.remove-trip-btn');
const currentTrips = document.getElementById('current-trips');
const tripRemovedSuccess = document.getElementById('trip-removed-success');
const tripRemovedError = document.getElementById('trip-removed-error');
const removeTripSpinner = document.getElementById('remove-trip-spinner');
const invalidPassword = document.getElementById('invalid-password');

const showTripSpinner = () => {
  const tripSpinner = document.getElementById('trip-spinner');
  tripSpinner.style.display = 'block';
};

let mainBtnClicked;

const removeTripBtn = document.getElementById('enter-password-btn');
removeTripBtn.addEventListener('click', () => {
  console.log(mainBtnClicked);
  showConfirmRemovedRecordSpinner();
});

const showConfirmRemovedRecordSpinner = () => {
  if (invalidPassword.style.display === 'block')
    invalidPassword.style.display = 'none';
  const spinner = document.getElementById('confirm-remove-record-spinner');
  const password = document.getElementById('password');
  spinner.style.display = 'block';
  fetch('/admin/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: password.value }),
  })
    .then(res => {
      if (res.status === 200) {
        fetchData();
      } else {
        invalidPassword.style.display = 'block';
      }
    })
    .catch(e => {
      console.log(e);
    })
    .finally(() => {
      spinner.style.display = 'none';
      password.value = '';
    });
};

const fetchData = () => {
  removeTripSpinner.style.display = 'block';
  document.querySelector('.close').click();

  fetch('/admin/trips', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ id: mainBtnClicked.id }),
  })
    .then(res => {
      console.log(res.statusText);
      if (res.status === 200) {
        tripRemovedSuccess.style.display = 'block';
        currentTrips.removeChild(mainBtnClicked.parentElement);
      } else {
        tripRemovedError.style.display = 'block';
      }
    })
    .catch(e => {
      tripRemovedError.style.display = 'block';
    })
    .finally(() => {
      removeTripSpinner.style.display = 'none';
    });
};

removeTripBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (tripRemovedSuccess.style.display === 'block')
      tripRemovedSuccess.style.display = 'none';

    if (tripRemovedError.style.display === 'block')
      tripRemovedError.style.display = 'none';

    mainBtnClicked = btn;
    console.log(mainBtnClicked);
    return;
  });
});
