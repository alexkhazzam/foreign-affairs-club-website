const schoolYearSpinner = document.getElementById('school-year-spinner');
const newYearAddedSuccess = document.getElementById('new-year-added-success');
const newYearAddedError = document.getElementById('new-year-added-error');
const removeYearBtns = document.querySelectorAll('.remove-year-btn');
const currentYears = document.getElementById('current-years');
const newYearRemovedSuccess = document.getElementById(
  'new-year-removed-success'
);
const invalidPassword = document.getElementById('invalid-password');
const newYearRemovedError = document.getElementById('new-year-removed-error');
const removeSchoolYearSpinner = document.getElementById(
  'remove-school-year-spinner'
);

const showYearSpinner = () => {
  schoolYearSpinner.style.display = 'block';
};

let mainBtnClicked;

const removeYearBtn = document.getElementById('enter-password-btn');
removeYearBtn.addEventListener('click', () => {
  showConfirmRemovedRecordSpinner();
});

const fetchData = () => {
  removeSchoolYearSpinner.style.display = 'block';

  fetch('/admin/members', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: mainBtnClicked.id }),
  })
    .then(response => {
      if (response.status === 200) {
        newYearRemovedSuccess.style.display = 'block';
        currentYears.removeChild(mainBtnClicked.parentElement);
        document.querySelector('.close').click();
      } else {
        newYearRemovedError.style.display = 'block';
        invalidPassword.style.display = 'block';
      }
    })
    .catch(_e => {
      newYearRemovedError.style.display = 'block';
    })
    .finally(() => {
      removeSchoolYearSpinner.style.display = 'none';
    });
};

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

removeYearBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (newYearRemovedSuccess.style.display === 'block')
      newYearRemovedSuccess.style.display = 'none';

    if (newYearRemovedError.style.display === 'block')
      newYearRemovedError.style.display = 'none';

    mainBtnClicked = btn;
    return;
  });
});
