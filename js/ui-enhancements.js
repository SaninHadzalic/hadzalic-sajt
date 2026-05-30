// UI Enhancements: Dark/Light mode, Scroll-to-top, Breadcrumbs, Page transitions
(function() {
  'use strict';

  function _t(key) { return window._t ? window._t(key) : key; }

  // === 1. DARK/LIGHT MODE TOGGLE ===
  function initThemeToggle() {
    var saved = localStorage.getItem('theme');
    if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');

    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    btn.addEventListener('click', function() {
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // === 2. SCROLL-TO-TOP BUTTON ===
  function initScrollTop() {
    var btn = document.createElement('button');
    btn.id = 'scrollTopBtn';
    btn.innerHTML = '&uarr;';
    btn.title = _t('bcHome');
    document.body.appendChild(btn);

    var scrollTicking = false;
    window.addEventListener('scroll', function() {
      if (!scrollTicking) {
        requestAnimationFrame(function() {
          if (window.scrollY > 300) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === 3. BREADCRUMB NAVIGATION ===
  function updateBreadcrumb(pageId, label) {
    var crumbs = [{ text: _t('bcHome'), action: 'showHome' }];
    if (pageId === 'service') {
      crumbs.push({ text: _t('bcServices'), action: null });
      crumbs.push({ text: label, action: null });
    } else if (pageId === 'info') {
      crumbs.push({ text: 'Info', action: null });
      crumbs.push({ text: label, action: null });
    } else if (pageId === 'booking') {
      crumbs.push({ text: _t('bcBooking'), action: null });
    }

    var containers = document.querySelectorAll('.breadcrumb');
    containers.forEach(function(c) {
      var html = crumbs.map(function(cr, i) {
        var sep = i < crumbs.length - 1 ? '<span class="breadcrumb-sep">/</span>' : '';
        if (cr.action && i < crumbs.length - 1) {
          return '<a onclick="' + cr.action + '()">' + cr.text + '</a>' + sep;
        }
        return '<span>' + cr.text + '</span>' + sep;
      }).join('');
      c.innerHTML = html;
      c.style.display = 'flex';
    });
  }

  function hideBreadcrumb() {
    document.querySelectorAll('.breadcrumb').forEach(function(c) {
      c.style.display = 'none';
    });
  }

  // Hook into existing navigation functions
  function hookNavigation() {
    // Wrap showService
    var origShowService = window.showService;
    if (origShowService) {
      window.showService = function(key) {
        origShowService(key);
        var title = document.getElementById('spTitle');
        updateBreadcrumb('service', title ? title.textContent : key);
      };
    }

    // Wrap showInfoPage
    var origShowInfoPage = window.showInfoPage;
    if (origShowInfoPage) {
      window.showInfoPage = function(key) {
        origShowInfoPage(key);
        var title = document.getElementById('infoTitle');
        updateBreadcrumb('info', title ? title.textContent : key);
      };
    }

    // Wrap showBooking
    var origShowBooking = window.showBooking;
    if (origShowBooking) {
      window.showBooking = function() {
        origShowBooking();
        updateBreadcrumb('booking', _t('bcBooking'));
      };
    }

    // Wrap showHome
    var origShowHome = window.showHome;
    if (origShowHome) {
      window.showHome = function() {
        origShowHome();
        hideBreadcrumb();
      };
    }
  }

  // === 4. ANIMATED PAGE TRANSITIONS ===
  function initPageTransitions() {
    var origShowService = window.showService;
    var origShowInfoPage = window.showInfoPage;
    var origShowBooking = window.showBooking;
    var origShowHome = window.showHome;

    function transitionTo(callback) {
      var activePage = document.querySelector('.page.active');
      if (activePage) {
        activePage.classList.add('page-fade-out');
        setTimeout(function() {
          activePage.classList.remove('page-fade-out');
          callback();
          var newPage = document.querySelector('.page.active');
          if (newPage) {
            newPage.classList.add('page-fade-in');
            setTimeout(function() { newPage.classList.remove('page-fade-in'); }, 300);
          }
        }, 200);
      } else {
        callback();
      }
    }

    if (origShowService) {
      window.showService = function(key) {
        transitionTo(function() { origShowService(key); });
      };
    }
    if (origShowInfoPage) {
      window.showInfoPage = function(key) {
        transitionTo(function() { origShowInfoPage(key); });
      };
    }
    if (origShowBooking) {
      window.showBooking = function() {
        transitionTo(function() { origShowBooking(); });
      };
    }
    if (origShowHome) {
      window.showHome = function() {
        transitionTo(function() { origShowHome(); });
      };
    }
  }

  // === 5. SKELETON LOADING ===
  function showSkeletons() {
    var grid = document.getElementById('servicesGrid');
    if (grid && !grid.children.length) {
      var html = '';
      for (var i = 0; i < 6; i++) {
        html += '<div class="skeleton skeleton-card" style="min-height:80px;"></div>';
      }
      grid.innerHTML = html;
    }
  }

  // === INIT ===
  document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initScrollTop();

    // Insert breadcrumb containers
    ['page-service', 'page-info', 'page-booking'].forEach(function(id) {
      var page = document.getElementById(id);
      if (page) {
        var bc = document.createElement('div');
        bc.className = 'breadcrumb';
        bc.style.display = 'none';
        page.insertBefore(bc, page.firstChild);
      }
    });

    // Small delay to ensure other scripts have loaded
    setTimeout(function() {
      hookNavigation();
      initPageTransitions();
    }, 100);
  });
})();
