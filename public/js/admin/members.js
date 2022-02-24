const schoolYearSpinner = document.getElementById('school-year-spinner');
const year = document.getElementById('year');
const officers = document.getElementById('officers');
const members = document.getElementById('members');
const newYearAddedSuccess = document.getElementById('new-year-added-success');
const newYearAddedError = document.getElementById('new-year-added-error');
const removeYearBtns = document.querySelectorAll('.remove-year-btn');
const currentYears = document.getElementById('current-years');
const newYearRemovedSuccess = document.getElementById(
  'new-year-removed-success'
);
const newYearRemovedError = document.getElementById('new-year-removed-error');
const removeSchoolYearSpinner = document.getElementById(
  'remove-school-year-spinner'
);

const submitNewSchoolYearForm = () => {
  schoolYearSpinner.style.display = 'block';

  if (newYearAddedError.style.display === 'block')
    newYearAddedError.style.display = 'none';

  if (newYearAddedSuccess.style.display === 'block')
    newYearAddedSuccess.style.display = 'none';

  fetch('/admin/members', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      year: year.value,
      officers: officers.value,
      members: members.value,
    }),
  })
    .then(response => {
      if (response.status === 200) {
        newYearAddedSuccess.style.display = 'block';
      } else {
        newYearAddedError.style.display = 'block';
      }
    })
    .catch(_e => {
      newYearAddedError.style.display = 'block';
    })
    .finally(() => {
      schoolYearSpinner.style.display = 'none';
      year.value = '';
      officers.value = '';
      members.value = '';
    });
};

removeYearBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (newYearRemovedSuccess.style.display === 'block')
      newYearRemovedSuccess.style.display = 'none';

    if (newYearRemovedError.style.display === 'block')
      newYearRemovedError.style.display = 'none';

    removeSchoolYearSpinner.style.display = 'block';

    setTimeout(() => {
      fetch('/admin/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: btn.id }),
      })
        .then(response => {
          if (response.status === 200) {
            newYearRemovedSuccess.style.display = 'block';
            currentYears.removeChild(btn.parentElement);
          } else {
            newYearRemovedError.style.display = 'block';
          }
        })
        .catch(_e => {
          newYearRemovedError.style.display = 'block';
        })
        .finally(() => {
          removeSchoolYearSpinner.style.display = 'none';
        });
    }, 1000);
  });
});
