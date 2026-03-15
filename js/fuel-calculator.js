// Fuel Savings Calculator for Chiptuning page
(function() {
  'use strict';

  function initFuelCalculator() {
    // Find chiptuning service page container
    var sp = document.getElementById('page-service');
    if (!sp) return;

    // Create calculator HTML
    var calcHTML = '<div id="fuelCalcWrap" class="fuel-calc-wrap" style="display:none;">'
      + '<h3>Kalkulator ustede goriva</h3>'
      + '<p style="font-size:0.78rem;color:var(--dim);margin-bottom:14px;">Izracunajte koliko mozete ustediti sa chiptuningom</p>'
      + '<div class="fuel-calc-grid">'
      + '<div><label>Trenutna potrosnja (L/100km)</label><input type="number" id="fcConsumption" placeholder="7.5" step="0.1" min="1" max="30"></div>'
      + '<div><label>Godisnja kilometraza (km)</label><input type="number" id="fcKm" placeholder="20000" step="1000" min="1000" max="200000"></div>'
      + '<div><label>Cijena goriva (EUR/L)</label><input type="number" id="fcPrice" placeholder="1.60" step="0.01" min="0.5" max="5"></div>'
      + '<div><label>Ocekivano smanjenje (%)</label><input type="number" id="fcReduction" placeholder="10" step="1" min="3" max="20" value="10"></div>'
      + '</div>'
      + '<button onclick="calculateFuelSavings()" style="margin-top:14px;padding:10px 24px;background:var(--blue);color:#fff;border:none;border-radius:10px;cursor:pointer;font-size:0.85rem;transition:background 0.2s;">Izracunaj</button>'
      + '<div id="fuelCalcResult" class="fuel-calc-result" style="display:none;">'
      + '<div class="fc-row"><span>Smanjenje potrosnje</span><span class="fc-val" id="fcResReduction">-</span></div>'
      + '<div class="fc-row"><span>Nova potrosnja</span><span class="fc-val" id="fcResNew">-</span></div>'
      + '<div class="fc-row"><span>Godisnja usteda goriva</span><span class="fc-val" id="fcResLiters">-</span></div>'
      + '<div class="fc-row" style="border-top:1px solid var(--border);padding-top:10px;margin-top:6px;"><span style="font-weight:700;">Godisnja usteda</span><span class="fc-val" style="font-size:1.1rem;" id="fcResSavings">-</span></div>'
      + '<div class="fc-row"><span>ROI period (chiptuning ~300 EUR)</span><span class="fc-val" id="fcResROI">-</span></div>'
      + '</div>'
      + '</div>';

    // Append to service page (will be shown when chiptuning is selected)
    var spBody = sp.querySelector('.sp-body') || sp;
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = calcHTML;
    spBody.appendChild(tempDiv.firstChild);

    // Hook into showService to show/hide calculator
    var origShowService = window.showService;
    if (origShowService) {
      window.showService = function(key) {
        origShowService(key);
        var calc = document.getElementById('fuelCalcWrap');
        if (calc) {
          // Show calculator only on chiptuning page
          calc.style.display = (key === 'chiptuning') ? 'block' : 'none';
        }
      };
    }
  }

  // Global calculate function
  window.calculateFuelSavings = function() {
    var consumption = parseFloat(document.getElementById('fcConsumption').value);
    var km = parseFloat(document.getElementById('fcKm').value);
    var price = parseFloat(document.getElementById('fcPrice').value);
    var reduction = parseFloat(document.getElementById('fcReduction').value);

    if (!consumption || !km || !price || !reduction) {
      alert('Molimo popunite sva polja.');
      return;
    }

    var savedLitersPerKm = consumption * (reduction / 100) / 100;
    var totalSavedLiters = savedLitersPerKm * km;
    var totalSavedEur = totalSavedLiters * price;
    var newConsumption = consumption * (1 - reduction / 100);
    var roiMonths = Math.ceil(300 / (totalSavedEur / 12));

    document.getElementById('fcResReduction').textContent = '-' + reduction + '%';
    document.getElementById('fcResNew').textContent = newConsumption.toFixed(1) + ' L/100km';
    document.getElementById('fcResLiters').textContent = totalSavedLiters.toFixed(0) + ' L';
    document.getElementById('fcResSavings').textContent = totalSavedEur.toFixed(0) + ' EUR';
    document.getElementById('fcResROI').textContent = roiMonths + ' mjeseci';

    document.getElementById('fuelCalcResult').style.display = 'block';
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFuelCalculator);
  } else {
    initFuelCalculator();
  }
})();
