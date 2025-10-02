// Preloader
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if(preloader){
    preloader.classList.add('hidden');
    setTimeout(()=> preloader.remove(), 500); // remove do DOM depois da animação
  }
});


(function(){

  const body = document.body;
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelectorAll('.navmenu a');
  const dropdownToggles = document.querySelectorAll('.navmenu .dropdown > a');

  // 1️⃣ Scroll - .scrolled + scrollspy
  window.addEventListener('scroll', () => {
    if(window.scrollY > 50) body.classList.add('scrolled');
    else body.classList.remove('scrolled');

    navLinks.forEach(link=>{
      if(!link.hash) return;
      const section = document.querySelector(link.hash);
      if(!section) return;
      const pos = window.scrollY + 100;
      if(pos >= section.offsetTop && pos < section.offsetTop+section.offsetHeight){
        navLinks.forEach(l=>l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // 2️⃣ Mobile toggle
  if(mobileToggle){
    mobileToggle.addEventListener('click', ()=> body.classList.toggle('mobile-nav-active'));
  }

  // 3️⃣ Close mobile nav on click link
  navLinks.forEach(link=>{
    link.addEventListener('click', ()=>{
      if(body.classList.contains('mobile-nav-active')){
        body.classList.remove('mobile-nav-active');
      }
    });
  });

  // 4️⃣ Dropdown mobile
  dropdownToggles.forEach(toggle=>{
    toggle.addEventListener('click', e=>{
      if(window.innerWidth < 1200){
        e.preventDefault();
        const parent = toggle.parentElement;
        parent.classList.toggle('active');
      }
    });
  });
})();
