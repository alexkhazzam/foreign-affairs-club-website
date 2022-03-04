const showResourceSpinner = () => {
  document.getElementById('resource-spinner').style.display = 'block';
};

const removeResourceBtns = document.querySelectorAll('.remove-resource-btn');
const currentResources = document.getElementById('current-resources');
const newResourceRemovedSuccess = document.getElementById(
  'new-resource-removed-success'
);
const invalidPassword = document.getElementById('invalid-password');
const newResourceRemovedError = document.getElementById(
  'new-resource-removed-error'
);
const removeResourceSpinner = document.getElementById(
  'remove-resource-spinner'
);

let mainBtnClicked;

const removeYearBtn = document.getElementById('enter-password-btn');
removeYearBtn.addEventListener('click', () => {
  showConfirmRemovedRecordSpinner();
});

const fetchData = () => {
  removeResourceSpinner.style.display = 'block';

  fetch('/admin/resources', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: mainBtnClicked.id }),
  })
    .then(response => {
      if (response.status === 200) {
        newResourceRemovedSuccess.style.display = 'block';
        currentResources.removeChild(mainBtnClicked.parentElement);
        document.querySelector('.close').click();
      } else {
        newResourceRemovedError.style.display = 'block';
        invalidPassword.style.display = 'block';
      }
    })
    .catch(_e => {
      newResourceRemovedError.style.display = 'block';
    })
    .finally(() => {
      removeResourceSpinner.style.display = 'none';
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

removeResourceBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (newResourceRemovedSuccess.style.display === 'block')
      newResourceRemovedSuccess.style.display = 'none';

    if (newResourceRemovedError.style.display === 'block')
      newResourceRemovedError.style.display = 'none';

    mainBtnClicked = btn;
    return;
  });
});
