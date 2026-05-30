// Fuel Savings Calculator for Chiptuning page
(function() {
  'use strict';

  function _t(key) { return window._t ? window._t(key) : key; }

  function initFuelCalculator() {
    var sp = document.getElementById('page-service');
    if (!sp) return;

    var calcHTML = ''
      + '<div id="fuelCalcWrap" class="fuel-calc-wrap" style="display:none;">'
      + '  <div class="fc-header">'
      + '    <div class="fc-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>'
      + '    <div>'
      + '      <h3 class="fc-title" data-i18n="fcTitle">' + _t('fcTitle') + '</h3>'
      + '      <p class="fc-subtitle" data-i18n="fcSubtitle">' + _t('fcSubtitle') + '</p>'
      + '    </div>'
      + '  </div>'
      + '  <div class="fc-inputs">'
      + '    <div class="fc-input-group">'
      + '      <label class="fc-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 22V8l9-6 9 6v14"/><path d="M9 22V12h6v10"/></svg> <span data-i18n="fcConsumption">' + _t('fcConsumption') + '</span></label>'
      + '      <div class="fc-input-wrap"><input type="number" id="fcConsumption" placeholder="7.5" step="0.1" min="1" max="30"><span class="fc-unit">L/100km</span></div>'
      + '    </div>'
      + '    <div class="fc-input-group">'
      + '      <label class="fc-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg> <span data-i18n="fcKm">' + _t('fcKm') + '</span></label>'
      + '      <div class="fc-input-wrap"><input type="number" id="fcKm" placeholder="20000" step="1000" min="1000" max="200000"><span class="fc-unit">km</span></div>'
      + '    </div>'
      + '    <div class="fc-input-group">'
      + '      <label class="fc-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6"/><path d="M12 16h.01"/></svg> <span data-i18n="fcPrice">' + _t('fcPrice') + '</span></label>'
      + '      <div class="fc-input-wrap"><input type="number" id="fcPrice" placeholder="199" step="1" min="50" max="500"><span class="fc-unit">RSD/L</span></div>'
      + '    </div>'
      + '    <div class="fc-input-group">'
      + '      <label class="fc-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> <span data-i18n="fcEngine">' + _t('fcEngine') + '</span></label>'
      + '      <div class="fc-input-wrap"><select id="fcEngineType" class="fc-select"><option value="dizel">' + _t('fcDiesel') + '</option><option value="benzin">' + _t('fcPetrol') + '</option><option value="turbo-benzin">' + _t('fcTurboPetrol') + '</option></select></div>'
      + '    </div>'
      + '  </div>'
      + '  <button class="fc-calc-btn" onclick="calculateFuelSavings()">'
      + '    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="12" y1="10" x2="14" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="12" y1="14" x2="14" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="14" y2="18"/><line x1="16" y1="18" x2="16" y2="18"/></svg>'
      + '    <span data-i18n="fcCalculate">' + _t('fcCalculate') + '</span>'
      + '  </button>'
      + '  <div id="fuelCalcResult" class="fc-results" style="display:none;">'
      + '    <div class="fc-results-grid">'
      + '      <div class="fc-stat-card">'
      + '        <div class="fc-stat-icon fc-stat-green"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 15l6-6 6 6"/></svg></div>'
      + '        <div class="fc-stat-value" id="fcResReduction">-</div>'
      + '        <div class="fc-stat-label" data-i18n="fcReduction">' + _t('fcReduction') + '</div>'
      + '      </div>'
      + '      <div class="fc-stat-card">'
      + '        <div class="fc-stat-icon fc-stat-blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg></div>'
      + '        <div class="fc-stat-value" id="fcResNew">-</div>'
      + '        <div class="fc-stat-label" data-i18n="fcNewConsumption">' + _t('fcNewConsumption') + '</div>'
      + '      </div>'
      + '      <div class="fc-stat-card">'
      + '        <div class="fc-stat-icon fc-stat-orange"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg></div>'
      + '        <div class="fc-stat-value" id="fcResLiters">-</div>'
      + '        <div class="fc-stat-label" data-i18n="fcFuelSaved">' + _t('fcFuelSaved') + '</div>'
      + '      </div>'
      + '    </div>'
      + '    <div class="fc-highlight">'
      + '      <div class="fc-highlight-main">'
      + '        <span class="fc-highlight-label" data-i18n="fcAnnualSavings">' + _t('fcAnnualSavings') + '</span>'
      + '        <span class="fc-highlight-value" id="fcResSavings">-</span>'
      + '      </div>'
      + '      <div class="fc-highlight-sub">'
      + '        <span data-i18n="fcRoi">' + _t('fcRoi') + '</span>'
      + '        <span class="fc-highlight-roi" id="fcResROI">-</span>'
      + '      </div>'
      + '    </div>'
      + '  </div>'
      + '</div>';

    var spBody = sp.querySelector('.sp-body') || sp;
    // Insert before the CTA bar so it's more visible
    var ctaBar = spBody.querySelector('.sp-cta-bar');
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = calcHTML;
    if (ctaBar) {
      ctaBar.parentNode.insertBefore(tempDiv.firstChild, ctaBar);
    } else {
      spBody.appendChild(tempDiv.firstChild);
    }

    var origShowService = window.showService;
    if (origShowService) {
      window.showService = function(key) {
        origShowService(key);
        var calc = document.getElementById('fuelCalcWrap');
        if (calc) {
          calc.style.display = (key === 'chiptuning') ? 'block' : 'none';
        }
      };
    }
  }

  window.calculateFuelSavings = function() {
    var consumption = parseFloat(document.getElementById('fcConsumption').value);
    var km = parseFloat(document.getElementById('fcKm').value);
    var price = parseFloat(document.getElementById('fcPrice').value);
    var engineType = document.getElementById('fcEngineType').value;

    // Reduction based on engine type (realistic chiptuning averages)
    var reductionMap = { 'dizel': 12, 'benzin': 7, 'turbo-benzin': 10 };
    var reduction = reductionMap[engineType] || 10;

    if (!consumption || !km || !price) {
      alert(_t('fcFillAll'));
      return;
    }

    var savedLitersPerKm = consumption * (reduction / 100) / 100;
    var totalSavedLiters = savedLitersPerKm * km;
    var totalSavedRsd = totalSavedLiters * price;
    var newConsumption = consumption * (1 - reduction / 100);
    var roiMonths = Math.ceil(35000 / (totalSavedRsd / 12));

    document.getElementById('fcResReduction').textContent = '-' + reduction + '%';
    document.getElementById('fcResNew').textContent = newConsumption.toFixed(1) + ' L/100km';
    document.getElementById('fcResLiters').textContent = totalSavedLiters.toFixed(0) + ' L';
    document.getElementById('fcResSavings').textContent = totalSavedRsd.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' RSD';
    document.getElementById('fcResROI').textContent = roiMonths + ' ' + _t('fcMonths');

    var result = document.getElementById('fuelCalcResult');
    result.style.display = 'block';
    result.scrollIntoView({behavior:'smooth', block:'nearest'});
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFuelCalculator);
  } else {
    initFuelCalculator();
  }
})();
