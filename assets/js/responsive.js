/* assets/js/responsive.js
   Mobile helpers for Sparflix
   Keep in sync with Bootstrap's lg breakpoint (992px)
*/
(function () {
  'use strict';

  const BREAKPOINT = 992; // < 992px = mobile/tablet behaviour

  // Utility: DOM ready
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  // Debounce helper (resize)
  function debounce(fn, wait = 120) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), wait);
    };
  }

  // Smooth slide helpers
  function slideUp(el, duration = 250) {
    if (!el || el._animating) return;
    el._animating = true;
    el.style.height = el.offsetHeight + 'px';
    el.style.overflow = 'hidden';
    el.style.transitionProperty = 'height, margin, padding';
    el.style.transitionDuration = duration + 'ms';
    requestAnimationFrame(() => {
      el.style.height = 0;
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
      el.style.marginTop = 0;
      el.style.marginBottom = 0;
    });
    setTimeout(() => {
      el.style.display = 'none';
      el.style.removeProperty('height');
      el.style.removeProperty('overflow');
      el.style.removeProperty('transition-property');
      el.style.removeProperty('transition-duration');
      el.style.removeProperty('padding-top');
      el.style.removeProperty('padding-bottom');
      el.style.removeProperty('margin-top');
      el.style.removeProperty('margin-bottom');
      el._animating = false;
    }, duration);
  }

  function slideDown(el, duration = 250) {
    if (!el || el._animating) return;
    el._animating = true;
    el.style.removeProperty('display');
    let display = window.getComputedStyle(el).display;
    if (display === 'none') display = 'block';
    el.style.display = display;
    const height = el.scrollHeight;
    el.style.overflow = 'hidden';
    el.style.height = '0px';
    el.style.transitionProperty = 'height, margin, padding';
    el.style.transitionDuration = duration + 'ms';
    requestAnimationFrame(() => {
      el.style.height = height + 'px';
    });
    setTimeout(() => {
      el.style.removeProperty('height');
      el.style.removeProperty('overflow');
      el.style.removeProperty('transition-property');
      el.style.removeProperty('transition-duration');
      el._animating = false;
    }, duration);
  }

  // Nav menu mobile toggle + overlay
  function setupMobileNav() {
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.getElementById('navmenu') || document.querySelector('.navmenu');
    if (!navToggle || !navMenu) return;

    navToggle.setAttribute('role', 'button');
    navToggle.setAttribute('aria-controls', navMenu.id || 'navmenu');
    navToggle.setAttribute('aria-expanded', 'false');

    let overlay = document.querySelector('.mobile-nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'mobile-nav-overlay';
      document.body.appendChild(overlay);
    }

    function openNav() {
      navMenu.classList.add('navmenu-open');
      document.body.classList.add('nav-open');
      overlay.style.display = 'block';
      navToggle.setAttribute('aria-expanded', 'true');
    }

    function closeNav() {
      navMenu.classList.remove('navmenu-open');
      document.body.classList.remove('nav-open');
      overlay.style.display = 'none';
      navToggle.setAttribute('aria-expanded', 'false');
    }

    navToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('navmenu-open')) closeNav();
      else openNav();
    });

    overlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('navmenu-open')) closeNav();
    });
    navMenu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && window.innerWidth < BREAKPOINT) closeNav();
    });
  }

  // Footer accordion
  function setupFooterAccordion() {
    const footer = document.getElementById('footer');
    if (!footer) return;
    const cols = footer.querySelectorAll('.row > .col-lg-3, .row > .col-md-6');

    cols.forEach((col) => {
      if (col.dataset.footerProcessed) return;
      const h4 = col.querySelector('h4');
      if (!h4) return;

      const parent = h4.parentElement;
      let contentWrap;

      if (parent === col) {
        contentWrap = document.createElement('div');
        contentWrap.className = 'footer-accordion-content';
        const toMove = Array.from(col.children).filter(c => c !== h4 && !c.classList.contains('footer-accordion-content'));
        toMove.forEach(el => contentWrap.appendChild(el));
        col.appendChild(contentWrap);
      } else {
        contentWrap = parent;
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'footer-accordion-btn';
      btn.setAttribute('aria-expanded', 'true');
      btn.innerHTML = h4.innerHTML;
      h4.parentNode.replaceChild(btn, h4);

      col.dataset.footerProcessed = '1';
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        if (expanded) {
          btn.setAttribute('aria-expanded', 'false');
          slideUp(contentWrap, 220);
        } else {
          btn.setAttribute('aria-expanded', 'true');
          slideDown(contentWrap, 220);
        }
      });
    });

    applyFooterResponsive();
  }

  function applyFooterResponsive() {
    const footer = document.getElementById('footer');
    if (!footer) return;
    const isMobile = window.innerWidth < BREAKPOINT;
    const cols = footer.querySelectorAll('[data-footer-processed="1"]');

    cols.forEach((col) => {
      const btn = col.querySelector('.footer-accordion-btn');
      let contentWrap = col.querySelector('.footer-accordion-content');
      if (!contentWrap) {
        const candidates = Array.from(col.children).filter(c => c !== btn && !(c.tagName === 'I'));
        contentWrap = candidates.length ? candidates[0] : null;
      }
      if (!contentWrap || !btn) return;
      if (isMobile) {
        btn.setAttribute('aria-expanded', 'false');
        contentWrap.style.display = 'none';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        contentWrap.style.display = 'block';
      }
    });
  }

  // Social icons mover
  const socialMover = (() => {
    let originalParent = null, originalNext = null, bottomBar = null;
    function createBottomBar() {
      bottomBar = document.createElement('div');
      bottomBar.className = 'mobile-social-bar';
      bottomBar.setAttribute('aria-hidden', 'false');
      document.body.appendChild(bottomBar);
    }
    function moveToBottom() {
      const headerSocial = document.querySelector('.header-social-links');
      if (!headerSocial) return;
      if (!originalParent) {
        originalParent = headerSocial.parentElement;
        originalNext = headerSocial.nextElementSibling;
      }
      if (!bottomBar) createBottomBar();
      bottomBar.appendChild(headerSocial);
      bottomBar.style.display = 'flex';
    }
    function restoreToHeader() {
      const headerSocial = document.querySelector('.mobile-social-bar .header-social-links');
      if (!headerSocial || !originalParent) return;
      if (originalNext) originalParent.insertBefore(headerSocial, originalNext);
      else originalParent.appendChild(headerSocial);
      if (bottomBar) bottomBar.style.display = 'none';
    }
    return { moveToBottom, restoreToHeader };
  })();

  function makeIframesResponsive() {
    document.querySelectorAll('iframe').forEach(iframe => {
      if (iframe.parentElement && iframe.parentElement.classList.contains('responsive-iframe')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'responsive-iframe';
      iframe.parentNode.insertBefore(wrapper, iframe);
      wrapper.appendChild(iframe);
      iframe.removeAttribute('width');
      iframe.removeAttribute('height');
      iframe.style.display = 'block';
    });
  }

  function handleResponsiveChanges() {
    const isMobile = window.innerWidth < BREAKPOINT;
    applyFooterResponsive();
    if (isMobile) socialMover.moveToBottom();
    else socialMover.restoreToHeader();
  }

  // ----------------- Notícias -----------------
  const noticias = [
    { titulo: "Dragon Ball Daima ganha trailer inédito", texto: "O novo trailer de Dragon Ball Daima revelou cenas inéditas, mostrando Goku, Vegeta e outros personagens em versões infantis. A série promete trazer nostalgia e novidades para os fãs, com estreia marcada para outubro de 2024.", imagem: "", atualizado: "há 10 minutos" },
    { titulo: "Akira Toriyama é homenageado no Japão", texto: "Um grande evento em Tóquio homenageou Akira Toriyama, criador de Dragon Ball. A exposição trouxe artes originais, entrevistas inéditas e depoimentos de grandes nomes da indústria de mangás e animes.", imagem: "https://tse4.mm.bing.net/th/id/OIP.FrJfeI43cqYt2s74odjZswAAAA?rs=1&pid=ImgDetMain&o=7&rm=3", atualizado: "há 2 horas" },
    { titulo: "Novo jogo de Dragon Ball anunciado", texto: "A Bandai Namco confirmou o desenvolvimento de um novo jogo de Dragon Ball para consoles de nova geração. O jogo terá gráficos avançados, batalhas épicas e uma história inédita criada em parceria com a Toei Animation.", imagem: "https://tse4.mm.bing.net/th/id/OIP.Iq0hrF5VxlkXZdOAKynFUQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3", atualizado: "há 1 dia" }
  ];

  const noticiasExtras = [
    { titulo: "Dragon Ball Super retorna em 2025", texto: "A Toei Animation confirmou oficialmente o retorno de Dragon Ball Super em 2025 com uma nova saga. A produção promete foco em batalhas épicas e desenvolvimento inédito dos personagens.", imagem: "", atualizado: "há 3 dias" },
    { titulo: "Novo mangá spin-off de Dragon Ball", texto: "Um novo spin-off de Dragon Ball focado nos vilões mais icônicos está em produção. A história explorará as origens e motivações de Freeza, Cell e Majin Buu.", imagem: "", atualizado: "há 5 dias" },
    { titulo: "Coleção especial de figures lançada", texto: "Uma nova coleção premium de action figures de Dragon Ball foi anunciada. Cada figura vem com iluminação especial e detalhes realistas que recriam cenas clássicas do anime.", imagem: "", atualizado: "há 1 semana" }
  ];

  const defaultImg = "assets/img/default-news.png";

  // Inicialização
  ready(() => {
    setupMobileNav();
    setupFooterAccordion();
    makeIframesResponsive();
    handleResponsiveChanges();
    window.addEventListener('resize', debounce(handleResponsiveChanges, 120));

    const container = document.getElementById("news-container");
    const extraContainer = document.getElementById("extra-news-container");
    const modalElement = document.getElementById('newsModal');
    let modal, modalTitle, modalImage, modalMeta, modalContent;
    if (modalElement) {
      modal = new bootstrap.Modal(modalElement);
      modalTitle = document.getElementById('newsModalLabel');
      modalImage = document.getElementById('modalImage');
      modalMeta = document.getElementById('modalMeta');
      modalContent = document.getElementById('modalContent');
    }

    // Renderiza notícias horizontais
    noticias.forEach(noticia => {
      if (!container) return;
      const card = document.createElement('div');
      card.className = 'card mb-4 bg-dark shadow-lg border-0';
      card.style.cursor = 'pointer';

      card.onclick = () => {
        if (!modal) return;
        modalTitle.textContent = noticia.titulo;
        modalImage.src = noticia.imagem || defaultImg;
        modalMeta.textContent = `Última atualização ${noticia.atualizado}`;
        modalContent.innerHTML = `<p>${noticia.texto}</p>`;
        modal.show();
      };

      card.innerHTML = `
      <div class="row p-3">
        <div class="col-md-4">
          <img src="${noticia.imagem || defaultImg}" class="img-fluid rounded-start" alt="${noticia.titulo}">
        </div>
        <div class="col-md-8 p-3">
          <div class="card-body">
            <h3 class="card-title mb-3">${noticia.titulo}</h3>
            <p class="card-text">${noticia.texto.substring(0, 150)}...</p>
            <p class="card-text"><small class="text-body-secondary">Última atualização ${noticia.atualizado}</small></p>
          </div>
        </div>
      </div>`;
      container.appendChild(card);
    });

    // Renderiza notícias verticais extras
    noticiasExtras.forEach(noticia => {
      if (!extraContainer) return;
      const col = document.createElement('div');
      col.className = 'col-lg-4 col-md-6 mb-4';

      const card = document.createElement('div');
      card.className = 'card h-100 bg-dark text-light shadow-lg border-0';
      card.style.cursor = 'pointer';

      card.onclick = () => {
        if (!modal) return;
        modalTitle.textContent = noticia.titulo;
        modalImage.src = noticia.imagem || defaultImg;
        modalMeta.textContent = `Última atualização ${noticia.atualizado}`;
        modalContent.innerHTML = `<p>${noticia.texto}</p>`;
        modal.show();
      };

      card.innerHTML = `
      <img src="${noticia.imagem || defaultImg}" class="card-img-top img-fluid rounded-top" alt="${noticia.titulo}">
      <div class="card-body">
        <h4 class="card-title">${noticia.titulo}</h4>
        <p class="card-text">${noticia.texto.substring(0, 120)}...</p>
      </div>
      <div class="card-footer border-0">
        <small class="text-body-secondary">Última atualização ${noticia.atualizado}</small>
      </div>`;
      col.appendChild(card);
      extraContainer.appendChild(col);
    });
  });
})();
