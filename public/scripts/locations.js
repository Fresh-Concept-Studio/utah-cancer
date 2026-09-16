(function() {
      var search = document.getElementById('loc-search');
      var county = document.getElementById('loc-county');
      var countEl = document.getElementById('loc-filter-count');
      var emptyEl = document.getElementById('loc-empty');
      var cards = Array.prototype.slice.call(document.querySelectorAll('.loc-card'));

      // Keep only counties represented by the current locations
      var allCounties = Array.prototype.map.call(county.options, function(o) {
        return { value: o.value, label: o.textContent };
      });

      // Pre-compute searchable haystack for each card
      cards.forEach(function(c) {
        c.dataset.haystack = (c.textContent || '').toLowerCase().replace(/\s+/g, ' ');
      });

      function syncCounties() {
        var present = {};
        cards.forEach(function(c) { present[c.dataset.county] = true; });
        var prev = county.value;
        county.innerHTML = '';
        allCounties.forEach(function(o) {
          if (o.value && !present[o.value]) return;
          var opt = document.createElement('option');
          opt.value = o.value;
          opt.textContent = o.label;
          county.appendChild(opt);
        });
        county.value = present[prev] ? prev : '';
      }

      function update() {
        var q = (search.value || '').trim().toLowerCase();
        var cty = county.value;
        var visible = 0;
        cards.forEach(function(c) {
          var matchCounty = !cty || c.dataset.county === cty;
          var matchText = !q || c.dataset.haystack.indexOf(q) !== -1;
          var show = matchCounty && matchText;
          c.style.display = show ? '' : 'none';
          if (show) visible += 1;
        });
        countEl.textContent = (q || cty) ? visible + ' of ' + cards.length + ' clinics' : '';
        emptyEl.hidden = visible !== 0;
      }

      search.addEventListener('input', update);
      county.addEventListener('change', update);
      syncCounties();
      update();
    })();


window.UCS_GOOGLE_MAPS_KEY = window.UCS_GOOGLE_MAPS_KEY || 'AIzaSyD2zE7aUB6stEv4Jnu8wteS4FzF2MOQnEU';


(function() {
      var locations = JSON.parse(document.getElementById('locations-data').textContent);

      var BRAND = '#5e8b9e';
      var BRAND_DARK = '#00476b';

      function pinIcon() {
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44">'
          + '<defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.25"/></filter></defs>'
          + '<path filter="url(#s)" fill="' + BRAND + '" stroke="' + BRAND_DARK + '" stroke-width="1.5" d="M17 1.5C8.7 1.5 2 8.2 2 16.5c0 11.3 15 25.3 15 25.3s15-14 15-25.3C32 8.2 25.3 1.5 17 1.5z"/>'
          + '<circle cx="17" cy="16.5" r="5.5" fill="#fff"/>'
          + '</svg>';
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
      }

      var map = null;
      var infoWindow = null;
      var iconSpec = null;
      var markers = [];
      var currentRegion = 'utah';

      // Draw the Utah location pins
      function renderRegion(region) {
        if (!map) return;
        markers.forEach(function(m) { m.setMap(null); });
        markers = [];
        infoWindow.close();

        var bounds = new google.maps.LatLngBounds();
        locations.filter(function(loc) { return loc.region === region; }).forEach(function(loc) {
          var pos = { lat: loc.lat, lng: loc.lng };
          var marker = new google.maps.Marker({ position: pos, map: map, title: loc.name, icon: iconSpec });
          marker.addListener('click', function() {
            infoWindow.setContent(
              '<div style="font-family: var(--font-body);color:#00476b;max-width:220px">' +
              '<strong style="font-family:var(--font-heading);font-size:16px;display:block;margin-bottom:4px">' + loc.name + '</strong>' +
              '<span style="font-size:13px;color:#5a6670;display:block;margin-bottom:8px">' + loc.address + '</span>' +
              '<a href="' + loc.url + '" style="color:#5e8b9e;font-size:13px;font-weight:600">View details &rarr;</a>' +
              '</div>'
            );
            infoWindow.open(map, marker);
          });
          markers.push(marker);
          bounds.extend(pos);
        });

        if (!bounds.isEmpty()) map.fitBounds(bounds, 60);
      }

      window.initUCSMap = function initUCSMap() {
        var el = document.getElementById('locations-map');
        if (!el || !window.google || !window.google.maps) return;

        map = new google.maps.Map(el, {
          center: { lat: 40.75, lng: -111.9 },
          zoom: 7,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });

        infoWindow = new google.maps.InfoWindow();
        iconSpec = { url: pinIcon(), scaledSize: new google.maps.Size(34, 44), anchor: new google.maps.Point(17, 42) };

        renderRegion(currentRegion);
      };

      function showFallback() {
        var fb = document.getElementById('locations-map-fallback');
        var map = document.getElementById('locations-map');
        if (fb) fb.hidden = false;
        if (map) map.style.display = 'none';
      }

      var key = window.UCS_GOOGLE_MAPS_KEY;
      if (!key || key === 'YOUR_GOOGLE_' + 'MAPS_API_KEY') {
        showFallback();
        return;
      }

      var s = document.createElement('script');
      s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(key) + '&callback=initUCSMap&v=weekly&loading=async';
      s.async = true;
      s.defer = true;
      s.onerror = showFallback;
      document.head.appendChild(s);
    })();
