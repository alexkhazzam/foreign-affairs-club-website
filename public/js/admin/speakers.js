const speakerSpinner = document.getElementById('speaker-spinner');
const newSpeakerAddedSuccess = document.getElementById(
  'new-speaker-added-success'
);
const newSpeakerAddedError = document.getElementById('new-speaker-added-error');
const removeSpeakerBtns = document.querySelectorAll('.remove-speaker-btn');
const currentYears = document.getElementById('current-speakers');
const speakerRemovedSuccess = document.getElementById(
  'speaker-removed-success'
);
const invalidPassword = document.getElementById('invalid-password');
const speakerRemovedError = document.getElementById('speaker-removed-error');
const removeSpeakerSpinner = document.getElementById('remove-speaker-spinner');

const showSpeakerSpinner = () => {
  speakerSpinner.style.display = 'block';
};

const removeSpeakerBtn = document.getElementById('enter-password-btn');
removeSpeakerBtn.addEventListener('click', () => {
  showConfirmRemovedRecordSpinner();
});

let mainBtnClicked;

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

removeSpeakerBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (speakerRemovedSuccess.style.display === 'block')
      speakerRemovedSuccess.style.display = 'none';

    if (speakerRemovedError.style.display === 'block')
      speakerRemovedError.style.display = 'none';

    mainBtnClicked = btn;
    return;
  });
});

const fetchData = () => {
  removeSpeakerSpinner.style.display = 'block';

  fetch('/admin/speakers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: mainBtnClicked.id }),
  })
    .then(response => {
      if (response.status === 200) {
        speakerRemovedSuccess.style.display = 'block';
        currentYears.removeChild(mainBtnClicked.parentElement);
        document.querySelector('.close').click();
      } else {
        speakerRemovedError.style.display = 'block';
      }
    })
    .catch(_e => {
      speakerRemovedError.style.display = 'block';
    })
    .finally(() => {
      removeSpeakerSpinner.style.display = 'none';
    });
};
