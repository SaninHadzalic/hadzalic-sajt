// Web Push Notifications
(function() {
  'use strict';

  function _t(key) { return window._t ? window._t(key) : key; }

  var PUSH_BANNER_DELAY = 15000; // Show banner after 15 seconds

  function initPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    if (Notification.permission === 'granted') {
      registerSW();
      return;
    }
    if (Notification.permission === 'denied') return;
    if (localStorage.getItem('pushDismissed')) return;

    // Show opt-in banner after delay
    setTimeout(showPushBanner, PUSH_BANNER_DELAY);
  }

  function showPushBanner() {
    var banner = document.getElementById('pushBanner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'pushBanner';
      banner.className = 'push-banner';
      banner.innerHTML = '<p data-i18n="pushText">' + _t('pushText') + '</p>'
        + '<div class="push-banner-actions">'
        + '<button class="pb-allow" onclick="allowPush()" data-i18n="pushAllow">' + _t('pushAllow') + '</button>'
        + '<button class="pb-dismiss" onclick="dismissPush()" data-i18n="pushDismiss">' + _t('pushDismiss') + '</button>'
        + '</div>';
      document.body.appendChild(banner);
    }
    setTimeout(function() { banner.classList.add('visible'); }, 100);
  }

  function hidePushBanner() {
    var banner = document.getElementById('pushBanner');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(function() { banner.remove(); }, 300);
    }
  }

  window.allowPush = function() {
    hidePushBanner();
    Notification.requestPermission().then(function(perm) {
      if (perm === 'granted') {
        registerSW();
      }
    });
  };

  window.dismissPush = function() {
    hidePushBanner();
    localStorage.setItem('pushDismissed', '1');
  };

  function registerSW() {
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
      console.log('SW registered:', reg.scope);
    }).catch(function(err) {
      console.warn('SW registration failed:', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPush);
  } else {
    initPush();
  }
})();
