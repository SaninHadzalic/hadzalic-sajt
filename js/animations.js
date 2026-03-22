// Minimalist floating particles — subtle, elegant, performance-optimized
(function() {
  'use strict';
  var animFrameId = null;
  var paused = false;
  var heroVisible = true;

  function initParticles() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var W, H;
    var particleCount = window.innerWidth < 768 ? 6 : 14;

    function resizeCanvas() {
      var hero = document.getElementById('home-hero');
      W = canvas.width = hero ? hero.offsetWidth : window.innerWidth;
      H = canvas.height = hero ? hero.offsetHeight : window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1,
        alpha: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2
      });
    }

    // Pre-calculate connection distance squared (avoid sqrt in loop)
    var maxDist = 150;
    var maxDistSq = maxDist * maxDist;
    var lastFrameTime = 0;
    var frameInterval = 33; // ~30fps

    function drawParticles(timestamp) {
      if (paused || !heroVisible) { animFrameId = null; return; }
      if (timestamp - lastFrameTime < frameInterval) {
        animFrameId = requestAnimationFrame(drawParticles);
        return;
      }
      lastFrameTime = timestamp;
      ctx.clearRect(0, 0, W, H);

      // Draw subtle connection lines (optimized — skip sqrt)
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            var lineAlpha = (1 - Math.sqrt(distSq) / maxDist) * 0.06;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(10,132,255,' + lineAlpha + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles (simple circles, no gradient per frame)
      particles.forEach(function(p) {
        p.pulse += 0.01;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        var a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

        // Simple filled circle instead of radialGradient (much faster)
        ctx.beginPath();
        ctx.fillStyle = 'rgba(10,132,255,' + a + ')';
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Outer glow — single larger circle with low alpha
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0,212,255,' + (a * 0.15) + ')';
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(drawParticles);
    }

    function startAnim() {
      if (!animFrameId && !paused && heroVisible) drawParticles();
    }

    function stopAnim() {
      if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
    }

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        paused = true;
        stopAnim();
      } else {
        paused = false;
        startAnim();
      }
    });

    // Pause when hero is not visible (scrolled away)
    if ('IntersectionObserver' in window) {
      var heroEl = document.getElementById('home-hero');
      if (heroEl) {
        var heroObs = new IntersectionObserver(function(entries) {
          heroVisible = entries[0].isIntersecting;
          if (heroVisible) startAnim();
          else stopAnim();
        }, { threshold: 0 });
        heroObs.observe(heroEl);
      }
    }

    drawParticles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
  } else {
    initParticles();
  }
})();
