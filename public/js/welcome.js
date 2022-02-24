const welcomeText = document.getElementById('welcome-text');
const text = 'Great Neck North High School is proud to present...';
const title = document.getElementById('title');

(async () => {
  for (let i = 0; i < text.length + 26; i++) {
    await new Promise(resolve => setTimeout(resolve, 60));
    if (i < text.length) welcomeText.textContent += text.charAt(i);
    if (i === text.length + 25) {
      document.getElementById('welcome-text-wrapper').style.display = 'none';
      title.style.display = 'block';
    }
  }
})();
