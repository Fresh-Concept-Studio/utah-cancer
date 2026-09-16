(function() {
      function getLastName(card) {
        var nameEl = card.querySelector('.provider-card-name');
        var name = nameEl ? nameEl.textContent.split(',')[0].trim() : '';
        var parts = name.split(/\s+/);
        return parts.length ? parts[parts.length - 1].replace(/["']/g, '').toLowerCase() : '';
      }

      document.querySelectorAll('.providers-grid').forEach(function(grid) {
        Array.from(grid.querySelectorAll('.provider-card'))
          .sort(function(a, b) {
            var byPriority = Number(b.dataset.sortPriority || 0) - Number(a.dataset.sortPriority || 0);
            if (byPriority !== 0) return byPriority;
            var byLastName = getLastName(a).localeCompare(getLastName(b));
            if (byLastName !== 0) return byLastName;
            return a.textContent.localeCompare(b.textContent);
          })
          .forEach(function(card) { grid.appendChild(card); });
      });

      var filterBtns = document.querySelectorAll('.spec-filter-btn');
      var categories = document.querySelectorAll('.provider-category');
      var cards = document.querySelectorAll('.provider-card');
      var searchInput = document.getElementById('spec-search');
      var resultsCount = document.getElementById('spec-results-count');
      var totalProviders = cards.length;
      var currentFilter = 'all';

      function updateCount() {
        var visible = document.querySelectorAll('.provider-card:not([style*="display: none"])').length;
        resultsCount.textContent = 'Showing ' + visible + ' of ' + totalProviders + ' providers';
      }

      function applyFilters() {
        var query = searchInput.value.toLowerCase().trim();
        categories.forEach(function(cat) {
          var catType = cat.getAttribute('data-category');
          var catCards = cat.querySelectorAll('.provider-card');
          var anyVisible = false;
          catCards.forEach(function(card) {
            var nameEl = card.querySelector('.provider-card-name');
            var name = nameEl ? nameEl.textContent.toLowerCase() : '';
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
