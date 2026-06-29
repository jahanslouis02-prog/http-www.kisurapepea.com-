——// Interactive behaviors: keyword reveals, modals, copy-to-clipboard, scroll reveals
document.addEventListener('DOMContentLoaded', function () {
    // Keyword toggles
                            document.querySelectorAll('.keyword').forEach(btn => {
                                  btn.addEventListener('click', (e) => {
                                          const id = btn.getAttribute('data-target');
                                          if (!id) return;
                                          const el = document.getElementById(id);
                                          if (!el) return;
                                          el.classList.toggle('open');
                                          el.scrollIntoView({behavior: 'smooth', block: 'center'});
                                  });
                            });

                            // Copy account number
                            const copyBtn = document.getElementById('copyAccount');
    if (copyBtn) {
          copyBtn.addEventListener('click', async () => {
                  const num = document.getElementById('accountNum').textContent.trim();
                  try {
                            await navigator.clipboard.writeText(num);
                            copyBtn.textContent = 'Copied';
                            setTimeout(()=> copyBtn.textContent = 'Copy', 2000);
                  } catch (err) {
                            copyBtn.textContent = 'Copy failed';
                  }
          });
    }

                            // Modal helpers
                            const backdrop = document.getElementById('modalBackdrop');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');

                            function openModal(html) {
                                  modalContent.innerHTML = html;
                                  backdrop.classList.remove('hidden');
                                  backdrop.setAttribute('aria-hidden','false');
                            }
    function closeModal() {
          backdrop.classList.add('hidden');
          backdrop.setAttribute('aria-hidden','true');
          modalContent.innerHTML = '';
    }
    if (modalClose) modalClose.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

                            const contactBtn = document.getElementById('contactBtn');
    if (contactBtn) contactBtn.addEventListener('click', () => {
          const recipient = 'kisurapepea@gmail.com';
          const subject = 'Meeting request';
          const body = 'Hello Kisura Pepea Initiative,\n\nI would like to request a meeting. Please let me know a suitable time.\n\nBest regards,\n';
          const mailtoLink = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
          window.location.href = mailtoLink;
    });

                            const donateBtn = document.getElementById('donateBtn');
    if (donateBtn) donateBtn.addEventListener('click', () => {
          openModal(`<h3>Bank details</h3>
                <p>Account no: <strong>22510136026</strong></p>
                      <p>Account name: KISURA PEPEA INITIATIVE</p>
                            <p>Bank: NMB — Branch: Mlimani City</p>
                                  <p>Swift: NMIBTZTZXXX</p>
                                        <p class="muted">Click copy on the main page to copy the account number.</p>`);
    });

                            // donateNow button (visible in donation card) should open same modal
                            const donateNow = document.getElementById('donateNow');
    if (donateNow) donateNow.addEventListener('click', () => {
          if (donateBtn) {
                  donateBtn.click();
          } else {
                  openModal(`<h3>Bank details</h3>
                          <p>Account no: <strong>22510136026</strong></p>
                                  <p>Account name: KISURA PEPEA INITIATIVE</p>
                                          <p>Bank: NMB — Branch: Mlimani City</p>
                                                  <p>Swift: NMIBTZTZXXX</p>`);
          }
    });

                            // reveal-on-scroll
                            const obs = new IntersectionObserver((entries) => {
                                  entries.forEach(entry => {
                                          if (entry.isIntersecting) {
                                                    const el = entry.target;
                                                    el.classList.add('revealed');
                                                    // stagger children if requested
                                            if (el.hasAttribute('data-stagger')) {
                                                        const children = Array.from(el.children);
                                                        children.forEach((c, i) => {
                                                                      c.style.transitionDelay = `${i * 90}ms`;
                                                                      c.style.transitionDuration = '480ms';
                                                        });
                                            }
                                                    // once revealed, unobserve
                                            obs.unobserve(el);
                                          }
                                  });
                            }, {threshold: 0.12});
    document.querySelectorAll('.reveal-on-scroll').forEach(el => obs.observe(el));

                            // hero entrance animation
                            requestAnimationFrame(() => {
                                  const hero = document.querySelector('.hero-content');
                                  if (hero) {
                                          hero.style.opacity = 0;
                                          hero.style.transform = 'translateY(8px)';
                                          setTimeout(() => { hero.style.transition = 'opacity 680ms ease, transform 680ms ease'; hero.style.opacity = 1; hero.style.transform = 'none'; }, 120);
                                  }
                            });

                            // parallax background move on scroll
                            const heroEl = document.querySelector('.hero');
    // performant parallax using CSS variable and requestAnimationFrame
                            if (heroEl) {
                                  let ticking = false;
                                  function updateParallax() {
                                          const rect = heroEl.getBoundingClientRect();
                                          const pct = Math.min(Math.max(-rect.top / window.innerHeight, -0.25), 0.25);
                                          const beforeTranslate = pct * 14; // smaller subtle move for ::before
                                    const translateY = pct * 8;
                                          heroEl.style.setProperty('--hero-before-translate', `${beforeTranslate}px`);
                                          heroEl.style.setProperty('transform', `translateY(${translateY}px)`);
                                          ticking = false;
                                  }
                                  window.addEventListener('scroll', () => {
                                          if (!ticking) {
                                                    window.requestAnimationFrame(updateParallax);
                                                    ticking = true;
                                          }
                                  }, { passive: true });
                                  // initial call
      updateParallax();
                            }

                            // give partner items subtle floating animation with staggered random delays
                            document.querySelectorAll('.partner-item').forEach((el, i) => {
                                  el.classList.add('float');
                                  const delay = Math.round(Math.random() * 600) + (i * 120);
                                  el.style.animationDelay = `${delay}ms`;
                            });

                            // Pulse the primary CTA while it's visible to draw attention
                            const ctaObserver = new IntersectionObserver((entries) => {
                                  entries.forEach(en => {
                                          const el = en.target;
                                          if (en.isIntersecting) el.classList.add('pulse'); else el.classList.remove('pulse');
                                  });
                            }, { threshold: 0.45 });
    const donate = document.getElementById('donateNow') || document.getElementById('donateBtn');
    if (donate) ctaObserver.observe(donate);

                            // animate section titles when they appear
                            const titleObserver = new IntersectionObserver((entries) => {
                                  entries.forEach(en => {
                                          if (en.isIntersecting) {
                                                    en.target.classList.add('title-anim');
                                                    titleObserver.unobserve(en.target);
                                          }
                                  });
                            }, { threshold: 0.2 });
    document.querySelectorAll('.section h3').forEach(h => titleObserver.observe(h));
});
