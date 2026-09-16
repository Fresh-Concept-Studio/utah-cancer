(function() {
      var tabs = document.querySelectorAll('.provider-tab');
      var sections = [];
      tabs.forEach(function(tab) { var id = tab.getAttribute('href').replace('#', ''); var el = document.getElementById(id); if (el) sections.push({ id: id, el: el, tab: tab }); });
      window.addEventListener('scroll', function() {
        var scrollPos = window.scrollY + 200; var active = sections[0];
        sections.forEach(function(s) { if (s.el.offsetTop <= scrollPos) active = s; });
        tabs.forEach(function(t) { t.classList.remove('active'); });
        if (active) active.tab.classList.add('active');
      });
      tabs.forEach(function(tab) { tab.addEventListener('click', function(e) {
        e.preventDefault(); var id = tab.getAttribute('href').replace('#', ''); var el = document.getElementById(id);
        if (el) { window.scrollTo({ top: el.offsetTop - 180, behavior: 'smooth' }); }
      }); });
    })();
