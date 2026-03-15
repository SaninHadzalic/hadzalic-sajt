// Minimalist floating particles — subtle, elegant
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
    var particleCount = window.innerWidth < 768 ? 12 : 28;

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

    function drawParticles() {
      if (paused) { animFrameId = null; return; }
      ctx.clearRect(0, 0, W, H);

      // Draw subtle connection lines (only close pairs)
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            var lineAlpha = (1 - dist / 150) * 0.06;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(10,132,255,' + lineAlpha + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(function(p) {
        p.pulse += 0.01;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        var a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

        ctx.beginPath();
        var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, 'rgba(10,132,255,' + a + ')');
        grad.addColorStop(0.5, 'rgba(0,212,255,' + (a * 0.3) + ')');
        grad.addColorStop(1, 'rgba(0,212,255,0)');
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
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
