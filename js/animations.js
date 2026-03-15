// Optimized Floating Particles Canvas
(function() {
  'use strict';
  var animFrameId = null;
  var paused = false;

  function initParticles() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var W, H;
    var particleCount = window.innerWidth < 768 ? 25 : 55;

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
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2
      });
    }

    function drawParticles() {
      if (paused) { animFrameId = null; return; }
      ctx.clearRect(0, 0, W, H);
      particles.forEach(function(p) {
        p.pulse += 0.018;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        var a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));

        particles.forEach(function(p2) {
          var dx = p.x - p2.x, dy = p.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(10,132,255,' + (a * (1 - dist / 120) * 0.25) + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        ctx.beginPath();
        var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, 'rgba(10,132,255,' + a + ')');
        grad.addColorStop(1, 'rgba(0,212,255,0)');
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();
      });
      animFrameId = requestAnimationFrame(drawParticles);
    }

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        paused = true;
        if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
      } else {
        paused = false;
        if (!animFrameId) drawParticles();
      }
    });

    drawParticles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
  } else {
    initParticles();
  }
})();
