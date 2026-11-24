
/* Central cart logic for Luna Bijuteri - robust and consistent across pages
   - stores items in localStorage key 'luna_cart'
   - each item: {id, name, price, img, qty}
   - renders #cartItemsContainer with img, name, price, qty controls and remove button
*/

(function(){
  // helpers
  function readCart(){
    try {
      return JSON.parse(localStorage.getItem('luna_cart') || '[]') || [];
    } catch(e){ return []; }
  }
  function saveCart(cart){
    localStorage.setItem('luna_cart', JSON.stringify(cart));
    renderCart(); updateCartCount();
  }

  window.addToCart = function(item){
    // item: {id, name, price, img, qty}
    if(!item || !item.id) return;
    const cart = readCart();
    const found = cart.find(i => i.id === item.id);
    if(found){
      found.qty = (found.qty || 1) + (item.qty || 1);
    } else {
      cart.push({ id: item.id, name: item.name || 'Ürün', price: Number(item.price)||0, img: item.img || 'images/placeholder.jpg', qty: item.qty || 1 });
    }
    saveCart(cart);
    flash('Sepete eklendi');
  };

  // Remove
  window.removeFromCart = function(id){
    let cart = readCart().filter(i => i.id !== id);
    saveCart(cart);
  };

  window.updateQty = function(id, qty){
    const cart = readCart();
    const it = cart.find(i => i.id === id);
    if(it){
      it.qty = Math.max(1, parseInt(qty) || 1);
      saveCart(cart);
    }
  };

  // Render cart UI into #cartItemsContainer
  window.renderCart = function(){
    const container = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('cartTotal');
    const countEls = document.querySelectorAll('#cartCount, #cartCount2');
    if(!container) return;
    const cart = readCart();
    container.innerHTML = '';
    if(cart.length === 0){
      container.innerHTML = '<div class="empty-msg">Sepetiniz boş. Ürün ekleyin.</div>';
      if(totalEl) totalEl.textContent = '₺0.00';
      countEls.forEach(el => el.textContent = '0');
      return;
    }
    let total = 0;
    let count = 0;
    cart.forEach(item => {
      total += (Number(item.price)||0) * (Number(item.qty)||1);
      count += Number(item.qty)||1;

      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-left">
          <img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.name)}" class="cart-item-img">
          <div class="cart-item-info">
            <h4>${escapeHtml(item.name)}</h4>
            <p>₺${Number(item.price).toFixed(2)}</p>
          </div>
        </div>
        <div class="cart-item-right">
          <div class="qty-wrap">
            <button class="qty-minus" data-id="${escapeHtml(item.id)}">−</button>
            <input type="number" min="1" value="${escapeHtml(item.qty)}" class="cart-qty" data-id="${escapeHtml(item.id)}"/>
            <button class="qty-plus" data-id="${escapeHtml(item.id)}">+</button>
          </div>
          <button class="remove-btn" data-id="${escapeHtml(item.id)}">Çıkar</button>
        </div>
      `;
      container.appendChild(div);
    });

    if(totalEl) totalEl.textContent = '₺' + total.toFixed(2);
    countEls.forEach(el => el.textContent = count);

    // Attach event handlers (delegation could be used, but attach directly for simplicity)
    container.querySelectorAll('.qty-plus').forEach(btn => {
      btn.onclick = function(){
        const id = this.dataset.id;
        const input = container.querySelector('.cart-qty[data-id="'+id+'"]');
        if(input){
          input.value = Number(input.value || 1) + 1;
          updateQty(id, input.value);
        }
      };
    });
    container.querySelectorAll('.qty-minus').forEach(btn => {
      btn.onclick = function(){
        const id = this.dataset.id;
        const input = container.querySelector('.cart-qty[data-id="'+id+'"]');
        if(input){
          input.value = Math.max(1, Number(input.value || 1) - 1);
          updateQty(id, input.value);
        }
      };
    });
    container.querySelectorAll('.cart-qty').forEach(inp => {
      inp.onchange = function(){
        const id = this.dataset.id;
        const val = Math.max(1, parseInt(this.value) || 1);
        this.value = val;
        updateQty(id, val);
      };
    });
    container.querySelectorAll('.remove-btn').forEach(btn => {
      btn.onclick = function(){
        const id = this.dataset.id;
        removeFromCart(id);
      };
    });
  };

  window.updateCartCount = function(){
    const cart = readCart();
    const count = cart.reduce((s,i) => s + (Number(i.qty)||1), 0);
    document.querySelectorAll('#cartCount, #cartCount2').forEach(el => el.textContent = count);
  };

  // Flash message
  function flash(msg){
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.position = 'fixed';
    el.style.right = '18px';
    el.style.bottom = '90px';
    el.style.background = '#b99a6b';
    el.style.color = '#fff';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '10px';
    el.style.zIndex = 9999;
    document.body.appendChild(el);
    setTimeout(()=> el.remove(), 1400);
  }

  function escapeHtml(s){
    if(!s) return '';
    return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
  }

  // Attach handlers for existing add-to-cart buttons on page load
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.add-cart-btn, .addCart, .btn.addCart').forEach(btn=>{
      btn.addEventListener('click', function(e){
        e.preventDefault();
        const id = this.dataset.id || (this.getAttribute('data-id') || (this.closest('.product-card')?.dataset?.id || Date.now().toString()));
        const name = this.dataset.name || this.getAttribute('data-name') || this.closest('.product-card')?.querySelector('h3')?.innerText || document.querySelector('.right-col h1')?.innerText || 'Ürün';
        const price = Number(this.dataset.price || this.getAttribute('data-price') || this.closest('.product-card')?.dataset?.price || document.querySelector('.price')?.innerText.replace(/[^0-9.,]/g,'') || 0);
        const img = this.dataset.img || this.getAttribute('data-img') || this.closest('.product-card')?.querySelector('img')?.src || document.querySelector('.product-detail img')?.src || 'images/placeholder.jpg';
        addToCart({ id: id, name: name, price: price, img: img, qty: 1 });
      });
    });

    // cart open/close controls assumed to exist with ids cartBtn, closeCart, menuBtn etc.
    document.querySelectorAll('#cartBtn, #cartBtn2').forEach(b => b && b.addEventListener('click', function(){ document.querySelectorAll('.cart-panel').forEach(p => p.classList.toggle('open')); }));
    document.querySelectorAll('#closeCart, #closeCart2').forEach(b => b && b.addEventListener('click', function(){ document.querySelectorAll('.cart-panel').forEach(p => p.classList.remove('open')); }));
    document.querySelectorAll('#menuBtn, #menuBtn2').forEach(b => b && b.addEventListener('click', function(){ document.querySelectorAll('.sidebar').forEach(s => s.classList.toggle('open')); }));
    // initial render
    renderCart();
    updateCartCount();
  });

  // Expose for console
  window._cart = { readCart, saveCart, addToCart, removeFromCart, updateQty };

})();
