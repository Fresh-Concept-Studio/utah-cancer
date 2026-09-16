(function() {
      var track = document.querySelector('.specialties-carousel .carousel-track');
      var cards = Array.from(track.querySelectorAll('.specialty-card'));
      var prevBtn = document.querySelector('.specialties-section .carousel-btn--prev');
      var nextBtn = document.querySelector('.specialties-section .carousel-btn--next');
      var gap = 20;
      var currentOffset = 0;
      var isTransitioning = false;

      // Clone all cards and append to create seamless loop
      var totalOriginal = cards.length;
      cards.forEach(function(card) {
        var clone = card.cloneNode(true);
        track.appendChild(clone);
      });
      // Also prepend clones for reverse scrolling
      for (var i = totalOriginal - 1; i >= 0; i--) {
        var clone = cards[i].cloneNode(true);
        track.insertBefore(clone, track.firstChild);
      }

      function getCardWidth() {
        return track.querySelector('.specialty-card').offsetWidth + gap;
      }

      // Start position: offset by the prepended clones
      function init() {
        var cardW = getCardWidth();
        currentOffset = totalOriginal * cardW;
        track.style.transition = 'none';
        track.style.transform = 'translateX(-' + currentOffset + 'px)';
      }

      init();
      window.addEventListener('resize', init);

      function slide(direction) {
        if (isTransitioning) return;
        isTransitioning = true;
        var cardW = getCardWidth();
        currentOffset += direction * cardW;
        track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        track.style.transform = 'translateX(-' + currentOffset + 'px)';
      }

      track.addEventListener('transitionend', function() {
        var cardW = getCardWidth();
        var totalW = totalOriginal * cardW;
        // If scrolled past the end clones, jump back
        if (currentOffset >= totalW * 2) {
          currentOffset -= totalW;
          track.style.transition = 'none';
          track.style.transform = 'translateX(-' + currentOffset + 'px)';
        }
        // If scrolled before the start clones, jump forward
        if (currentOffset <= 0) {
          currentOffset += totalW;
          track.style.transition = 'none';
          track.style.transform = 'translateX(-' + currentOffset + 'px)';
        }
        isTransitioning = false;
      });

      prevBtn.addEventListener('click', function() { slide(-1); });
      nextBtn.addEventListener('click', function() { slide(1); });
    })();


(function() {
      var slides = document.querySelectorAll('#stories-carousel .story-slide');
      var dotsWrap = document.getElementById('stories-dots');
      if (!slides.length || !dotsWrap) return;
      var current = 0;

      slides.forEach(function(_, i) {
        var dot = document.createElement('button');
        dot.className = 'stories-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to story ' + (i + 1));
        dot.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
        dot.addEventListener('click', function() { goTo(i); });
        dotsWrap.appendChild(dot);
      });
      var dots = dotsWrap.querySelectorAll('.stories-dot');

      function goTo(i) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        dots[current].setAttribute('aria-pressed', 'false');
        current = (i + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
        dots[current].setAttribute('aria-pressed', 'true');
      }

      document.getElementById('story-prev').addEventListener('click', function() { goTo(current - 1); });
      document.getElementById('story-next').addEventListener('click', function() { goTo(current + 1); });
    })();


(function() {
      var track = document.getElementById('testimonials-track');
      if (!track) return;
      var cards = track.querySelectorAll('.testimonial-card');
      var prevBtn = document.getElementById('testimonial-prev');
      var nextBtn = document.getElementById('testimonial-next');
      var indicatorsContainer = document.getElementById('testimonial-indicators');
      var current = 0;

      function getVisible() {
        var w = window.innerWidth;
        if (w <= 640) return 1;
        if (w <= 1024) return 2;
        return 3;
      }

      function pageCount() {
        return Math.max(1, cards.length - getVisible() + 1);
      }

      function clampCurrent() {
        var max = pageCount() - 1;
        if (current > max) current = max;
        if (current < 0) current = 0;
      }

      function buildIndicators() {
        indicatorsContainer.innerHTML = '';
        var n = pageCount();
        for (var i = 0; i < n; i++) {
          (function(i) {
            var dot = document.createElement('button');
            dot.className = 'testimonial-indicator' + (i === current ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to page ' + (i + 1));
            dot.addEventListener('click', function() { goTo(i); });
            indicatorsContainer.appendChild(dot);
          })(i);
        }
      }

      function updateIndicators() {
        var dots = indicatorsContainer.querySelectorAll('.testimonial-indicator');
        for (var i = 0; i < dots.length; i++) {
          if (i === current) dots[i].classList.add('active');
          else dots[i].classList.remove('active');
        }
      }

      function applyTransform() {
        if (!cards.length) return;
        var first = cards[0];
        var styles = window.getComputedStyle(track);
        var gap = parseFloat(styles.columnGap || styles.gap || 0);
        var step = first.getBoundingClientRect().width + gap;
        track.style.transform = 'translateX(' + (-current * step) + 'px)';
      }

      function goTo(i) {
        current = i;
        clampCurrent();
        applyTransform();
        updateIndicators();
      }

      prevBtn.addEventListener('click', function() {
        var n = pageCount();
        current = (current - 1 + n) % n;
        applyTransform();
        updateIndicators();
      });
      nextBtn.addEventListener('click', function() {
        var n = pageCount();
        current = (current + 1) % n;
        applyTransform();
        updateIndicators();
      });

      var resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          buildIndicators();
          clampCurrent();
          applyTransform();
          updateIndicators();
        }, 100);
      });

      buildIndicators();
      applyTransform();
    })();
