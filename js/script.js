// Theme Swtitcher
const themeSwitchers = document.querySelectorAll('.theme-link');

themeSwitchers.forEach(switcher => {
  switcher.addEventListener('click', (event) => {
    const themeUrl = `css/theme-${event.target.dataset.theme}.css`;

    document.querySelector('[title="theme"]')
      .setAttribute('href', themeUrl);
  });
});