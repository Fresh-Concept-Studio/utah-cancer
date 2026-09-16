(function(){
      var filters=Array.prototype.slice.call(document.querySelectorAll('.lp-filter'));
      var sections=Array.prototype.slice.call(document.querySelectorAll('.lp-trial-section'));
      var count=document.getElementById('trial-count');
      filters.forEach(function(button){
        button.addEventListener('click',function(){
          var selected=button.getAttribute('data-filter');
          filters.forEach(function(item){ var active=item===button; item.classList.toggle('is-active',active); item.setAttribute('aria-pressed',active?'true':'false'); });
          var visibleTrials=0;
          sections.forEach(function(section){ var show=selected==='all'||section.getAttribute('data-category')===selected; section.hidden=!show; if(show){ visibleTrials+=section.querySelectorAll('.lp-trial-card').length; } });
          count.textContent=visibleTrials+(visibleTrials===1?' trial':' trials');
        });
      });
    })();
