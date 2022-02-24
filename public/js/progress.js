let cursorMeter = document.getElementById('cursorMeter');

let progressBar = document.getElementById('progressBar');

let totalHeight = document.body.scrollHeight - window.innerHeight;

window.onscroll = function () {
  let progress = (window.pageYOffset / totalHeight) * 100;
  progressBar.style.width = progress + '%';
};
