(function() {
  "use strict";

  const body = document.body;
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelectorAll('.navmenu a');
  const dropdownToggles = document.querySelectorAll('.navmenu .dropdown > a');

  // 1️⃣ Scroll - adiciona classe .scrolled
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      body.classList.add('scrolled');
    } else {
      body.classList.remove('scrolled');
    }

    // Scrollspy
    navLinks.forEach(link => {
      if (!link.hash) return;
      const section = document.querySelector(link.hash);
      if (!section) return;
      const pos = window.scrollY + 100;
      if (pos >= section.offsetTop && pos < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // 2️⃣ Mobile nav toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      body.classList.toggle('mobile-nav-active');
      mobileToggle.classList.toggle('active'); // opcional, muda o ícone
    });
  }

  // 3️⃣ Close mobile nav ao clicar em link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active');
        if (mobileToggle) mobileToggle.classList.remove('active');
      }
    });
  });

  // 4️⃣ Dropdown toggle mobile
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', e => {
      if (window.innerWidth < 1200) { // só no mobile
        e.preventDefault();
        const parent = toggle.parentElement;
        parent.classList.toggle('active');
        const dropdown = parent.querySelector('.dropdown-menu');
        if (dropdown) dropdown.classList.toggle('dropdown-active');
      }
    });
  });

})();
