(function() {
      var filterBtns = document.querySelectorAll('.spec-filter-btn');
      var categories = document.querySelectorAll('.spec-category');
      var searchInput = document.getElementById('spec-search');
      var resultsCount = document.getElementById('spec-results-count');
      var currentFilter = 'all';

      function updateCount() {
        var visible = document.querySelectorAll('.spec-card:not([style*="display: none"])').length;
        resultsCount.textContent = 'Showing ' + visible + ' of 28 cancer types';
      }

      function applyFilters() {
        var query = searchInput.value.toLowerCase().trim();
        categories.forEach(function(cat) {
          var catType = cat.getAttribute('data-category');
          var catCards = cat.querySelectorAll('.spec-card');
          var anyVisible = false;
          catCards.forEach(function(card) {
            var name = (card.getAttribute('data-name') || '').toLowerCase();
            var matchesFilter = currentFilter === 'all' || catType === currentFilter;
            var matchesSearch = !query || name.indexOf(query) !== -1;
            if (matchesFilter && matchesSearch) {
              card.style.display = '';
              anyVisible = true;
            } else {
              card.style.display = 'none';
            }
          });
          cat.style.display = anyVisible ? '' : 'none';
        });
        updateCount();
      }

      filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          filterBtns.forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          currentFilter = btn.getAttribute('data-filter');
          applyFilters();
        });
      });

      searchInput.addEventListener('input', applyFilters);
    })();
