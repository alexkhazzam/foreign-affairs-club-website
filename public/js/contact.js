const sendEmail = () => {
  const email = document.getElementById('email');
  const name = document.getElementById('name');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  const spinner = document.getElementById('contact-spinner');
  const badWordsAlert = document.getElementById('bad-words-alert');
  const successAlert = document.getElementById('success-alert');
  const errorAlert = document.getElementById('error-alert');

  spinner.style.display = 'block';
  badWordsAlert.style.display = 'none';
  successAlert.style.display = 'none';
  errorAlert.style.display = 'none';

  fetch('/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.value.trim(),
      name: name.value.trim(),
      subject: subject.value.trim(),
      message: message.value.trim(),
    }),
  })
    .then(async data => {
      if (data.status === 200) {
        if ((await data.text()) === 'success') {
          successAlert.style.display = 'block ';
        } else {
          badWordsAlert.style.display = 'block';
        }
      } else {
        errorAlert.style.display = 'block';
      }
    })
    .catch(() => {
      errorAlert.style.display = 'block';
    })
    .finally(() => {
      spinner.style.display = 'none';
      email.value = '';
      name.value = '';
      subject.value = '';
      message.value = '';
    });
};
