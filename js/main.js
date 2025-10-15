document.addEventListener("DOMContentLoaded", async function () {
  // Select DOM Items
  const menuBtn = document.querySelector(".menu-btn");
  const menu = document.querySelector(".menu");
  const menuNav = document.querySelector(".menu-nav");
  const menuBranding = document.querySelector(".menu-branding");
  const navItems = document.querySelectorAll(".nav-item");
  const languageToggle = document.querySelector(".language-toggle");
  const langText = document.querySelector(".lang-text");

  // Set Initial State Of Menu
  let showMenu = false;

  // Language configuration
  const languages = {
    fr: {
      code: 'fr',
      label: 'FR',
      ariaLabel: 'Switch language to English'
    },
    en: {
      code: 'en',
      label: 'EN',
      ariaLabel: 'Changer la langue en français'
    }
  };

  // Get saved language or default to French
  let currentLanguage = localStorage.getItem('language') || 'fr';

  // Set initial display
  updateLanguageButton(currentLanguage);

  // Load initial language
  await changeLanguage(currentLanguage);

  // Handle language toggle click
  languageToggle.addEventListener("click", function () {
    // Toggle between languages
    currentLanguage = currentLanguage === 'fr' ? 'en' : 'fr';
    updateLanguageButton(currentLanguage);
    changeLanguage(currentLanguage);
  });

  function updateLanguageButton(lang) {
    const langConfig = languages[lang];
    // Show the OPPOSITE language (the one we'll switch TO)
    const targetLang = lang === 'fr' ? 'en' : 'fr';
    langText.textContent = languages[targetLang].label;
    languageToggle.setAttribute('aria-label', langConfig.ariaLabel);
  }

  menuBtn.addEventListener("click", toggleMenu);

  function toggleMenu() {
    if (!showMenu) {
      languageToggle.style.visibility = "hidden";
      menuBtn.classList.add("close");
      menu.classList.add("show");
      menuNav.classList.add("show");
      menuBranding.classList.add("show");
      navItems.forEach((item) => item.classList.add("show"));

      // Set Menu State
      showMenu = true;
    } else {
      languageToggle.style.visibility = "visible";
      menuBtn.classList.remove("close");
      menu.classList.remove("show");
      menuNav.classList.remove("show");
      menuBranding.classList.remove("show");
      navItems.forEach((item) => item.classList.remove("show"));

      // Set Menu State
      showMenu = false;
    }
  }

  async function changeLanguage(lang) {
    try {
      const langTranslation = await fetchLanguageTranslation(lang);
      updateContent(langTranslation);
      setPreferedLanguage(lang);
      document.documentElement.lang = lang;
    } catch (error) {
      console.error('Error loading language:', error);
    }


  }

  function updateContent(langData) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (element.tagName === 'TITLE') {
        element.textContent = langData[key];
      } else {
        element.innerHTML = langData[key];
      }
    });
  }

  function setPreferedLanguage(lang) {
    localStorage.setItem('language', lang);
  }

  async function fetchLanguageTranslation(lang) {
    const response = await fetch(`translation/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${lang}.json`);
    }
    return response.json();
  }

  const yearElement = document.getElementById("year");
  if (yearElement) {
    const currentDate = new Date().getFullYear();
    yearElement.innerHTML = currentDate;
  }
});
