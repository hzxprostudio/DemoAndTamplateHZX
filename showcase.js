(function(){
  // Filter
  document.querySelectorAll('.f-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.f-btn').forEach(function(b){ b.classList.remove('active') });
      btn.classList.add('active');
      var f = btn.dataset.filter;
      document.querySelectorAll('.card').forEach(function(card){
        card.classList.toggle('hidden', f !== 'all' && card.dataset.cat !== f);
      });
    });
  });

  // Fallback: if screenshot img fails, show gradient + emoji
  document.querySelectorAll('.card-thumb img').forEach(function(img){
    img.addEventListener('error', function(){
      var thumb = img.closest('.card-thumb');
      thumb.classList.add('no-img');
      thumb.style.background = thumb.dataset.gradient || '#1a1a2e';
      img.style.display = 'none';
      var emoji = document.createElement('div');
      emoji.className = 'thumb-emoji';
      emoji.textContent = thumb.dataset.emoji || '🖥️';
      var cat = document.createElement('div');
      cat.className = 'thumb-cat';
      cat.textContent = thumb.dataset.cat || '';
      thumb.appendChild(emoji);
      thumb.appendChild(cat);
    });
  });
})();
