const speakerSpinner = document.getElementById('speaker-spinner');
const speakerName = document.getElementById('speaker-name');
const speakerDescription = document.getElementById('description');
const speakerDate = document.getElementById('date');
const newSpeakerAddedSuccess = document.getElementById(
  'new-speaker-added-success'
);
const newSpeakerAddedError = document.getElementById('new-speaker-added-error');

const submitNewGuestSpeaker = () => {
  speakerSpinner.style.display = 'block';

  if (newSpeakerAddedError.style.display === 'block')
    newSpeakerAddedError.style.display = 'none';

  if (newSpeakerAddedSuccess.style.display === 'block')
    newSpeakerAddedSuccess.style.display = 'none';

  fetch('/admin/speakers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date: speakerDate.value.trim(),
      name: speakerName.value.trim(),
      description: speakerDescription.value.trim(),
    }),
  })
    .then(response => {
      if (response.status === 200) {
        newSpeakerAddedSuccess.style.display = 'block';
      } else newSpeakerAddedError.style.display = 'block';
    })
    .catch(_e => {
      newSpeakerAddedError.style.display = 'block';
    })
    .finally(() => {
      speakerSpinner.style.display = 'none';
      speakerName.value = '';
      speakerDescription.value = '';
    });
};

const removeSpeakerBtns = document.querySelectorAll('.remove-speaker-btn');
const currentYears = document.getElementById('current-speakers');
const speakerRemovedSuccess = document.getElementById(
  'speaker-removed-success'
);
const speakerRemovedError = document.getElementById('speaker-removed-error');
const removeSpeakerSpinner = document.getElementById('remove-speaker-spinner');

removeSpeakerBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (speakerRemovedSuccess.style.display === 'block')
      speakerRemovedSuccess.style.display = 'none';

    if (speakerRemovedError.style.display === 'block')
      speakerRemovedError.style.display = 'none';

    removeSpeakerSpinner.style.display = 'block';

    setTimeout(() => {
      fetch('/admin/speakers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: btn.id }),
      })
        .then(response => {
          if (response.status === 200) {
            speakerRemovedSuccess.style.display = 'block';
            currentYears.removeChild(btn.parentElement);
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
    }, 1000);
  });
});
