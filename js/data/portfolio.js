// Portfolio / Case Studies Data
var portfolioData = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/dgsgohodv/image/upload/w_400,h_250,c_fill,q_auto/v1772801234/Hadzalic_Coding-01_gfzvxw.jpg',
    brand: 'Volkswagen',
    model: 'Golf 7 2.0 TDI',
    year: 2018,
    service: 'chiptuning',
    serviceLabel: 'Chiptuning — ECU Remap',
    results: '+40 KS, +80 Nm, -0.7 L/100km',
    description: 'Stage 1 ECU remapiranje sa optimizacijom mape goriva. Vozilo je dobilo primjetno bolju elasticnost i smanjenu potrosnju na otvorenoj cesti.'
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/dgsgohodv/image/upload/w_400,h_250,c_fill,q_auto/v1772801234/Hadzalic_Coding-01_gfzvxw.jpg',
    brand: 'Audi',
    model: 'A4 B9 2.0 TFSI',
    year: 2020,
    service: 'carplay',
    serviceLabel: 'CarPlay & Android Auto Aktivacija',
    results: 'CarPlay + Android Auto aktivirani',
    description: 'Softverska aktivacija Apple CarPlay i Android Auto na fabrickom MIB2 sistemu bez ikakvih hardverskih izmjena. Proces zavrsen za 45 minuta.'
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/dgsgohodv/image/upload/w_400,h_250,c_fill,q_auto/v1772801234/Hadzalic_Coding-01_gfzvxw.jpg',
    brand: 'BMW',
    model: '320d F30',
    year: 2017,
    service: 'dpf',
    serviceLabel: 'DPF Softversko Rjesenje',
    results: 'DPF + EGR off, -0.9 L/100km',
    description: 'Kompletno softversko rjesenje za DPF i EGR. Eliminisane greske, smanjena potrosnja goriva i poboljsan odziv motora.'
  },
  {
    id: 4,
    image: 'https://res.cloudinary.com/dgsgohodv/image/upload/w_400,h_250,c_fill,q_auto/v1772801234/Hadzalic_Coding-01_gfzvxw.jpg',
    brand: 'Skoda',
    model: 'Octavia RS 2.0 TSI',
    year: 2019,
    service: 'chiptuning',
    serviceLabel: 'Chiptuning — Stage 1',
    results: '+55 KS, +95 Nm',
    description: 'Stage 1 remap sa Pops & Bangs opcijom. Vlasnik zadovoljan dramaticnim poboljsanjem performansi i zvukom ispusta.'
  },
  {
    id: 5,
    image: 'https://res.cloudinary.com/dgsgohodv/image/upload/w_400,h_250,c_fill,q_auto/v1772801234/Hadzalic_Coding-01_gfzvxw.jpg',
    brand: 'Mercedes-Benz',
    model: 'C220d W205',
    year: 2019,
    service: 'navi',
    serviceLabel: 'Azuriranje Navigacije',
    results: 'Mape 2024/2025 instalirane',
    description: 'Azuriranje navigacionih mapa na najnoviju verziju sa svim novim putevima i POI tackama za Srbiju i region.'
  },
  {
    id: 6,
    image: 'https://res.cloudinary.com/dgsgohodv/image/upload/w_400,h_250,c_fill,q_auto/v1772801234/Hadzalic_Coding-01_gfzvxw.jpg',
    brand: 'SEAT',
    model: 'Leon FR 1.4 TSI',
    year: 2021,
    service: 'aktivacija',
    serviceLabel: 'Aktivacija Skrivenih Funkcija',
    results: '12 funkcija aktivirano',
    description: 'Aktivacija skrivenih funkcija: needle sweep, DRL u maglenke, coming home, leaving home, dynamic blinkers i druge VW Group funkcije.'
  }
];

// Portfolio rendering function
function renderPortfolio(filter) {
  var grid = document.getElementById('portfolioGrid');
  if (!grid) return;

  var filtered = filter && filter !== 'all'
    ? portfolioData.filter(function(p) { return p.service === filter; })
    : portfolioData;

  grid.innerHTML = filtered.map(function(p) {
    return '<div class="portfolio-card">'
      + '<img src="' + p.image + '" alt="' + p.brand + ' ' + p.model + '" loading="lazy">'
      + '<div class="portfolio-card-body">'
      + '<h4>' + p.brand + ' ' + p.model + ' (' + p.year + ')</h4>'
      + '<div class="pc-service">' + p.serviceLabel + '</div>'
      + '<div class="pc-results">' + p.results + '</div>'
      + '<div class="pc-desc">' + p.description + '</div>'
      + '</div></div>';
  }).join('');

  // Update active filter button
  document.querySelectorAll('.portfolio-filters button').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === (filter || 'all'));
  });
}

function initPortfolio() {
  var section = document.getElementById('portfolioSection');
  if (!section) return;
  renderPortfolio('all');

  section.querySelectorAll('.portfolio-filters button').forEach(function(btn) {
    btn.addEventListener('click', function() {
      renderPortfolio(this.getAttribute('data-filter'));
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}
