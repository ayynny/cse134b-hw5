document.addEventListener("DOMContentLoaded", function() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    toggleBtn.style.display = "inline-block";

    let currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    toggleBtn.textContent = (currentTheme === 'light') ? '🌙' : '☀';

    toggleBtn.addEventListener('click', function() {
      currentTheme = (currentTheme === 'light') ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('theme', currentTheme);
      toggleBtn.textContent = (currentTheme === 'light') ? '🌙' : '☀';
    });
  });
