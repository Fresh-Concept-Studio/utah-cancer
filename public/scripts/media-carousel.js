(function() {
      var carousels = document.querySelectorAll('.media-carousel');
      carousels.forEach(function(carousel) {
        var track = carousel.querySelector('.media-carousel-track');
        var prev = carousel.querySelector('.media-carousel-btn--prev');
        var next = carousel.querySelector('.media-carousel-btn--next');
        if (!track) return;
        function step(dir) {
          var card = track.querySelector('.media-card');
          var amt = card ? card.getBoundingClientRect().width + 24 : 320;
          track.scrollBy({ left: dir * amt, behavior: 'smooth' });
        }
        if (prev) prev.addEventListener('click', function() { step(-1); });
        if (next) next.addEventListener('click', function() { step(1); });
      });
    })();
