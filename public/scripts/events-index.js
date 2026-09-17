(function() {
      var filters = document.querySelectorAll('.event-filter');
      var grid = document.getElementById('events-grid');
      var empty = document.getElementById('events-empty');
      filters.forEach(function(btn) {
        btn.addEventListener('click', function() {
          filters.forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          var filter = btn.getAttribute('data-filter');
          var visible = 0;
          grid.querySelectorAll('.event-card').forEach(function(card) {
            var match = filter === 'all' || card.getAttribute('data-cat') === filter;
            card.style.display = match ? '' : 'none';
            if (match) visible++;
          });
          empty.hidden = visible > 0;
        });
      });
    })();
