(() => {
  'use strict';

  const root = document.documentElement;
  const topbar = document.getElementById('topbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  // Give the navigation a quiet elevated state after the page starts scrolling.
  const updateHeader = () => topbar.classList.toggle('scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Mobile navigation.
  const closeMenu = () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Mở menu');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
  });

  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  // Theme preference is saved locally in this browser.
  const savedTheme = localStorage.getItem('vu-portfolio-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    root.dataset.theme = savedTheme;
  }
  const updateThemeButton = () => {
    const isDark = root.dataset.theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Bật giao diện sáng' : 'Bật giao diện tối');
    themeToggle.title = isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối';
  };
  updateThemeButton();
  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('vu-portfolio-theme', root.dataset.theme);
    updateThemeButton();
  });

  // Reveal sections as they enter the viewport, while keeping content visible
  // for browsers that do not support IntersectionObserver.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  // Filter project cards by category.
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-category]');
  const noProjects = document.getElementById('noProjects');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach(item => {
      const isActive = item === button;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    projectCards.forEach(card => {
      const isVisible = filter === 'all' || card.dataset.category === filter;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });
    noProjects.hidden = visibleCount !== 0;
  }));

  // Client-side form validation only. No message is sent or stored.
  contactForm.addEventListener('input', event => {
    event.target.classList.remove('invalid');
    event.target.removeAttribute('aria-invalid');
    if (formStatus.classList.contains('error')) {
      formStatus.textContent = '';
      formStatus.classList.remove('error');
    }
  });

  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = contactForm.elements.name;
    const email = contactForm.elements.email;
    const message = contactForm.elements.message;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidFields = [];

    if (name.value.trim().length < 2) invalidFields.push(name);
    if (!emailPattern.test(email.value.trim())) invalidFields.push(email);
    if (message.value.trim().length < 10) invalidFields.push(message);

    [name, email, message].forEach(field => {
      const isInvalid = invalidFields.includes(field);
      field.classList.toggle('invalid', isInvalid);
      field.setAttribute('aria-invalid', String(isInvalid));
    });

    if (invalidFields.length > 0) {
      formStatus.textContent = 'Vui lòng kiểm tra họ tên, email và lời nhắn (ít nhất 10 ký tự).';
      formStatus.classList.add('error');
      invalidFields[0].focus();
      return;
    }

    formStatus.textContent = 'Thông tin hợp lệ. Form demo chưa gửi hoặc lưu dữ liệu; hãy dùng liên kết Facebook để liên hệ Vũ.';
    formStatus.classList.remove('error');
    contactForm.reset();
    [name, email, message].forEach(field => {
      field.classList.remove('invalid');
      field.setAttribute('aria-invalid', 'false');
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
