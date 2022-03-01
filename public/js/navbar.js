document.querySelectorAll('.nav-link').forEach(navLink => {
  navLink.addEventListener('click', e => {
    document
      .getElementById(e.target.id.split('-')[0])
      .scrollIntoView({ behavior: 'smooth' });
  });
});
