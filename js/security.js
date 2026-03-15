// Form Validation & Rate Limiting
(function() {
  'use strict';

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^[\d+\-\s()]{7,15}$/.test(phone);
  }

  function showFieldError(field, message) {
    clearFieldError(field);
    field.style.borderColor = '#ff453a';
    var err = document.createElement('div');
    err.className = 'field-error';
    err.textContent = message;
    err.style.cssText = 'color:#ff453a;font-size:0.75rem;margin-top:4px;';
    field.parentNode.appendChild(err);
  }

  function clearFieldError(field) {
    field.style.borderColor = '';
    var existing = field.parentNode.querySelector('.field-error');
    if (existing) existing.remove();
  }

  function checkRateLimit(formId) {
    var key = 'rateLimit_' + formId;
    var lastSubmit = parseInt(localStorage.getItem(key) || '0');
    var now = Date.now();
    var cooldown = 60000;
    if (now - lastSubmit < cooldown) {
      return { allowed: false, remaining: Math.ceil((cooldown - (now - lastSubmit)) / 1000) };
    }
    return { allowed: true, remaining: 0 };
  }

  function setRateLimit(formId) {
    localStorage.setItem('rateLimit_' + formId, Date.now().toString());
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Blur validation for booking form
    var fields = [
      { id: 'bEmail', validator: isValidEmail, msg: 'Unesite ispravnu email adresu' },
      { id: 'bPhone', validator: isValidPhone, msg: 'Unesite ispravan broj telefona' },
      { id: 'cEmail', validator: isValidEmail, msg: 'Unesite ispravnu email adresu' },
      { id: 'cPhone', validator: isValidPhone, msg: 'Unesite ispravan broj telefona' }
    ];

    fields.forEach(function(f) {
      var el = document.getElementById(f.id);
      if (el) {
        el.addEventListener('blur', function() {
          if (this.value && !f.validator(this.value)) {
            showFieldError(this, f.msg);
          } else {
            clearFieldError(this);
          }
        });
      }
    });

    // Rate limiting on booking send
    var bSendBtn = document.getElementById('bSendEmailBtn');
    if (bSendBtn) {
      bSendBtn.addEventListener('click', function(e) {
        var limit = checkRateLimit('booking');
        if (!limit.allowed) {
          e.stopImmediatePropagation();
          var statEl = document.getElementById('bEmailStatus');
          if (statEl) {
            statEl.style.display = 'block';
            statEl.style.background = 'rgba(255,159,10,0.1)';
            statEl.style.color = '#ff9f0a';
            statEl.textContent = 'Sacekajte ' + limit.remaining + ' sekundi prije ponovnog slanja.';
          }
          return false;
        }
        setRateLimit('booking');
      }, true);
    }

    // Rate limiting on contact send
    var cSubmitBtn = document.getElementById('cSubmitBtn');
    if (cSubmitBtn) {
      cSubmitBtn.addEventListener('click', function(e) {
        var limit = checkRateLimit('contact');
        if (!limit.allowed) {
          e.stopImmediatePropagation();
          var statEl = document.getElementById('cStatus');
          if (statEl) {
            statEl.style.display = 'block';
            statEl.style.background = 'rgba(255,159,10,0.1)';
            statEl.style.color = '#ff9f0a';
            statEl.textContent = 'Sacekajte ' + limit.remaining + ' sekundi prije ponovnog slanja.';
          }
          return false;
        }
        setRateLimit('contact');
      }, true);
    }
  });
})();
