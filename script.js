    const topbar = document.getElementById('topbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const updateHeader = () => topbar.classList.toggle('scrolled', window.scrollY > 18);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Mở menu');
    }));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));
    document.getElementById('year').textContent = new Date().getFullYear();