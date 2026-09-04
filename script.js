document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('click', () => {
      faqItems.forEach((other) => {
        const panel = other.nextElementSibling;
        const isActive = other === item;
        other.classList.toggle('active', isActive);
        other.setAttribute('aria-expanded', String(isActive));
        if (panel && panel.classList.contains('faq-panel')) {
          panel.style.maxHeight = isActive ? `${panel.scrollHeight}px` : '0';
        }
      });
    });
  });

  document.querySelectorAll('.faq-panel').forEach((panel) => {
    if (panel.previousElementSibling?.classList.contains('active')) {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    }
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const header = document.querySelector('.site-header');
  const updateHeaderState = () => {
    if (!header) return;
    const scrolled = window.scrollY > 24;
    header.classList.toggle('scrolled', scrolled);
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState);

  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  const overlay = document.getElementById('mobile-menu-overlay');
  const closeMenuButton = document.getElementById('mobile-menu-close');
  const openMenu = () => {
    if (!overlay) {
      if (!nav || !toggle) return;
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('show');
      return;
    }

    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  };

  const closeMenu = () => {
    if (!overlay) {
      if (!nav || !toggle) return;
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('show');
      return;
    }

    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  const toggleMenu = (event) => {
    if (event?.target && event.target.closest('.mobile-menu-inner')) return;
    if (overlay?.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  if (toggle) {
    toggle.addEventListener('click', toggleMenu);
  }
  if (closeMenuButton) {
    closeMenuButton.addEventListener('click', closeMenu);
  }
  if (overlay) {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) toggleMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && overlay.classList.contains('active')) {
        toggleMenu();
      }
    });
  }

  // Mark current nav link for accessibility + hover badge
  const markCurrentNav = () => {
    const links = document.querySelectorAll('.site-nav a');
    const path = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach((a) => {
      const href = a.getAttribute('href') || '';
      const name = href.split('/').pop();
      if (name === path) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  };
  markCurrentNav();

  const initCartButtons = () => {
    document.querySelectorAll('.icon-btn[aria-label="Cart"]').forEach((btn) => {
      if (!btn.querySelector('.cart-badge')) {
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.setAttribute('aria-hidden', 'true');
        btn.appendChild(badge);
      }
    });
  };
  initCartButtons();

  const initLenis = () => {
    if (typeof Lenis === 'undefined') return null;
    const lenis = new Lenis({
      duration: 1.3,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: true,
      direction: 'vertical'
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return lenis;
  };

  const initGSAP = (lenis) => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
          return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        }
      });

      lenis.on('scroll', ScrollTrigger.update);
      ScrollTrigger.addEventListener('refresh', () => lenis.update());
    }

    gsap.to(['.hero', '.page-hero.has-bg'], {
      backgroundSize: '100%',
      duration: 8,
      ease: 'none'
    });

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTimeline
      .to('.hero', { '--hero-overlay': 0.35, duration: 0.6 }, 0)
      .from('.hero-text p, .page-hero .hero-content p, .page-hero .eyebrow', { opacity: 0, y: 30, duration: 0.8, stagger: 0.06 }, 0.25)
      .from('.hero-text h1, .page-hero .hero-content h1', { opacity: 0, y: 50, duration: 1.0 }, 0.45)
      .from('.hero-text .btn, .page-hero .hero-actions .btn', { opacity: 0, scale: 0.96, duration: 0.8, stagger: 0.08 }, 0.9);

    const sectionReveal = (selector, config = {}) => {
      document.querySelectorAll(selector).forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 60,
          duration: 0.8,
          ease: 'power3.out',
          ...config
        });
      });
    };

    sectionReveal('.featured-categories');
    sectionReveal('.collection-banner');
    sectionReveal('.best-sellers');
    sectionReveal('.editorial-banner');
    sectionReveal('.featured-collections');
    sectionReveal('.new-arrivals');
    sectionReveal('.inspiration-gallery');
    sectionReveal('.brand-story');
    sectionReveal('.trust-section');
    sectionReveal('.newsletter');
    sectionReveal('.about-us');
    sectionReveal('.contact-overview');
    sectionReveal('.contact-cards-grid');
    sectionReveal('.showroom-grid');
    sectionReveal('.contact-form-section');
    sectionReveal('.site-footer');

    gsap.from('.category-card', {
      scrollTrigger: {
        trigger: '.category-grid',
        start: 'top 75%'
      },
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out'
    });

    document.querySelectorAll('.collection-banner, .featured-collections, .feature-story, .feature-alt').forEach((section) => {
      const leftImage = section.querySelector('.banner-image, .feature-image') || section.querySelector('.collection-card--left .collection-card-copy');
      const rightCopy = section.querySelector('.banner-copy, .feature-copy, .collection-card--right .collection-card-copy');
      if (leftImage) {
        gsap.from(leftImage, {
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
          x: section.classList.contains('feature-alt') ? 80 : -80,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out'
        });
      }
      if (rightCopy) {
        gsap.from(rightCopy, {
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
          x: section.classList.contains('feature-alt') ? -80 : 80,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out'
        });
      }
    });

    gsap.from('.hero-scroll, .scroll-indicator, .hero-actions', {
      scrollTrigger: {
        trigger: '.hero, .page-hero',
        start: 'top top'
      },
      opacity: 0,
      y: 20,
      duration: 0.9,
      ease: 'power3.out'
    });

    gsap.from('.page-hero.about-hero .hero-content, .contact-hero .hero-content', {
      scrollTrigger: {
        trigger: '.page-hero.about-hero, .contact-hero',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 60,
      duration: 0.9,
      ease: 'power3.out'
    });

    gsap.from('.testimonial-card, .material-card, .team-card, .timeline-point, .office-info-card, .showroom-image, .map-card', {
      scrollTrigger: {
        trigger: '.testimonial-card, .material-card, .team-card, .timeline-point, .office-info-card, .showroom-image, .map-card',
        start: 'top 90%'
      },
      y: 40,
      opacity: 0,
      stagger: 0.08,
      duration: 0.9,
      ease: 'power3.out'
    });

    if (lenis) ScrollTrigger.refresh();
  };

  const initProductInteractions = () => {
    const mainImage = document.getElementById('product-main-image');
    const thumbs = document.querySelectorAll('.gallery-thumbs .thumb');
    if (mainImage && thumbs.length) {
      thumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => {
          thumbs.forEach((item) => item.classList.remove('active'));
          thumb.classList.add('active');
          mainImage.src = thumb.dataset.src;
          const img = thumb.querySelector('img');
          if (img) mainImage.alt = img.alt;
        });
      });
    }

    document.querySelectorAll('.option-list').forEach((group) => {
      group.addEventListener('click', (event) => {
        const button = event.target.closest('.option');
        if (!button) return;
        group.querySelectorAll('.option').forEach((option) => option.classList.remove('active'));
        button.classList.add('active');
      });
    });

    const quantityInput = document.querySelector('.quantity-controls input');
    document.querySelectorAll('.quantity-btn').forEach((button) => {
      button.addEventListener('click', () => {
        if (!quantityInput) return;
        let value = parseInt(quantityInput.value, 10) || 1;
        if (button.dataset.action === 'increase') value += 1;
        if (button.dataset.action === 'decrease') value = Math.max(1, value - 1);
        quantityInput.value = value;
      });
    });

    const tabs = document.querySelectorAll('.tabs-nav .tab');
    const panes = document.querySelectorAll('.tab-pane');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((item) => item.classList.remove('active'));
        tab.classList.add('active');
        panes.forEach((pane) => {
          pane.classList.toggle('active', pane.id === tab.dataset.tab);
        });
      });
    });

  };

  const initCollectionInteractions = () => {
    const pills = document.querySelectorAll('.category-pill');
    const cards = Array.from(document.querySelectorAll('.product-card'));
    const searchInput = document.getElementById('collection-search');
    const clearFilters = document.querySelector('.clear-filters');
    const sortSelect = document.getElementById('sort');
    const availabilitySelect = document.getElementById('availability');

    const getCardInfo = (card) => ({
      category: card.querySelector('.collection')?.textContent?.trim() || '',
      title: card.querySelector('.title')?.textContent?.trim().toLowerCase() || '',
      description: card.querySelector('.card-description')?.textContent?.trim().toLowerCase() || '',
      price: parseInt(card.querySelector('.price')?.textContent.replace(/[^0-9]/g, ''), 10) || 0
    });

    const setActiveCategory = (activeCategory) => {
      pills.forEach((pill) => {
        pill.classList.toggle('active', pill.textContent.trim() === activeCategory);
      });
    };

    const sortCards = (method) => {
      if (!cards.length) return;
      const sorted = [...cards].sort((a, b) => {
        const aInfo = getCardInfo(a);
        const bInfo = getCardInfo(b);
        if (method === 'Price: low to high') return aInfo.price - bInfo.price;
        if (method === 'Price: high to low') return bInfo.price - aInfo.price;
        return aInfo.title.localeCompare(bInfo.title, undefined, { sensitivity: 'base' });
      });
      const grid = document.querySelector('.product-grid');
      if (grid) sorted.forEach((card) => grid.appendChild(card));
    };

    const applyFilters = (category = 'All') => {
      const query = (searchInput?.value || '').trim().toLowerCase();
      cards.forEach((card) => {
        const info = getCardInfo(card);
        const matchesCategory = category === 'All' || info.category === category;
        const matchesSearch = !query || info.title.includes(query) || info.description.includes(query) || info.category.toLowerCase().includes(query);
        card.style.display = matchesCategory && matchesSearch ? 'grid' : 'none';
      });
      if (sortSelect) sortCards(sortSelect.value);
    };

    const initialCategory = (() => {
      const requested = new URLSearchParams(window.location.search).get('category') || 'All';
      const normalized = requested.trim();
      const match = Array.from(pills).find((pill) => pill.textContent.trim().toLowerCase() === normalized.toLowerCase());
      return match ? match.textContent.trim() : 'All';
    })();

    setActiveCategory(initialCategory);
    applyFilters(initialCategory);

    pills.forEach((pill) => {
      pill.addEventListener('click', (event) => {
        event.preventDefault();
        const category = pill.textContent.trim();
        setActiveCategory(category);
        applyFilters(category);
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', () => applyFilters(document.querySelector('.category-pill.active')?.textContent.trim() || 'All'));
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', () => applyFilters(document.querySelector('.category-pill.active')?.textContent.trim() || 'All'));
    }

    if (clearFilters) {
      clearFilters.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'Featured';
        if (availabilitySelect) availabilitySelect.value = 'In stock';
        setActiveCategory('All');
        applyFilters('All');
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
  };

  const favoritesKey = 'oak-and-ash-favorites';

  function getFavorites() {
    try {
      const parsed = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) => item && (item.id || item.title)).map((item) => {
        if (typeof item === 'string') return { id: item, title: item, price: 0, image: '', collection: '', description: '' };
        return {
          id: item.id || item.title || '',
          title: item.title || 'Untitled item',
          price: Number(item.price) || 0,
          image: item.image || '',
          collection: item.collection || '',
          description: item.description || ''
        };
      });
    } catch (error) {
      return [];
    }
  }

  function saveFavorites(favorites) {
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
  }

  function buildFavoriteItem(card, addToCartButton) {
    const title = card?.querySelector('.title')?.textContent?.trim() || addToCartButton?.dataset.title || 'Untitled item';
    const description = card?.querySelector('.card-description')?.textContent?.trim() || '';
    const collection = card?.querySelector('.collection')?.textContent?.trim() || addToCartButton?.dataset.collection || '';
    const image = card?.querySelector('img')?.getAttribute('src') || addToCartButton?.dataset.image || '';
    const priceSource = card?.querySelector('.price')?.textContent?.trim() || addToCartButton?.dataset.price || '0';
    const price = Number(addToCartButton?.dataset.price || priceSource.replace(/[^0-9]/g, '') || 0);
    const id = addToCartButton?.dataset.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    return { id, title, price, image, collection, description };
  }

  function renderFavoritesPage() {
    const container = document.getElementById('favorites-list');
    const countEl = document.getElementById('favorites-count');
    const emptyEl = document.getElementById('favorites-empty');
    if (!container) return;

    const favorites = getFavorites();
    if (countEl) countEl.textContent = String(favorites.length);

    if (!favorites.length) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    container.innerHTML = '';

    favorites.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'favorites-card';
      card.innerHTML = `
        <div class="favorites-card-image">
          ${item.image ? `<img src="${item.image}" alt="${item.title}">` : '<div class="favorites-card-placeholder">Featured piece</div>'}
        </div>
        <div class="favorites-card-content">
          <div class="favorites-card-meta">
            <span class="favorites-chip">${item.collection || 'Featured'}</span>
            <h3>${item.title}</h3>
            <p>${item.description || 'A timeless statement piece for a refined interior.'}</p>
          </div>
          <div class="favorites-card-footer">
            <strong>${formatCurrency(item.price)}</strong>
            <div class="favorites-actions">
              <button type="button" class="btn btn-primary js-add-to-cart" data-id="${item.id}" data-title="${item.title}" data-price="${item.price}" data-image="${item.image || ''}">Add to cart</button>
              <button type="button" class="btn btn-ghost favorites-remove" data-id="${item.id}">Remove</button>
            </div>
          </div>
        </div>`;
      container.appendChild(card);
    });
  }

  const initProductCardActions = () => {
    const updateFavoriteButtons = () => {
      const favorites = new Set(getFavorites().map((item) => item.id));
      document.querySelectorAll('.product-card .wishlist').forEach((button) => {
        const card = button.closest('.product-card');
        const addToCartButton = card?.querySelector('.js-add-to-cart');
        const productId = button.dataset.favoriteId || addToCartButton?.dataset.id || card?.dataset.favoriteId || '';
        const title = card?.querySelector('.title')?.textContent?.trim() || 'this item';
        const isFavorite = productId ? favorites.has(productId) : false;

        button.classList.toggle('active', isFavorite);
        button.setAttribute('aria-pressed', String(isFavorite));
        button.innerHTML = isFavorite ? '♥' : '♡';
        button.setAttribute('aria-label', isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`);
        button.setAttribute('title', isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`);
      });
    };

    document.querySelectorAll('.product-card .wishlist').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const card = button.closest('.product-card');
        const addToCartButton = card?.querySelector('.js-add-to-cart');
        const favoriteItem = buildFavoriteItem(card, addToCartButton);
        const favorites = getFavorites();
        const existingIndex = favorites.findIndex((item) => item.id === favoriteItem.id);

        if (existingIndex >= 0) {
          favorites.splice(existingIndex, 1);
          showToast(`${favoriteItem.title} removed from favorites`);
        } else {
          favorites.unshift(favoriteItem);
          showToast(`${favoriteItem.title} added to favorites`);
        }

        saveFavorites(favorites);
        updateFavoriteButtons();
        renderFavoritesPage();
      });
    });

    document.querySelectorAll('.product-card .quick-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const card = button.closest('.product-card');
        const addToCartButton = card?.querySelector('.js-add-to-cart');
        if (addToCartButton) {
          addToCartButton.click();
          return;
        }

        const title = card?.querySelector('.title')?.textContent?.trim() || 'Selected item';
        const image = card?.querySelector('img')?.getAttribute('src') || '';
        const price = Number(card?.querySelector('.price')?.textContent?.replace(/[^0-9]/g, '') || 0);
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        CartStore.add({ id, title, price, image, qty: 1 });
      });
    });

    updateFavoriteButtons();
    renderFavoritesPage();
  };

  initProductCardActions();

  document.querySelectorAll('.icon-btn[aria-label="Wishlist"]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'favorites.html';
    });
  });

  document.querySelectorAll('a').forEach((link) => {
    const label = (link.textContent || '').trim().toLowerCase();
    if (label === 'wishlist' || link.getAttribute('aria-label')?.toLowerCase() === 'wishlist') {
      link.setAttribute('href', 'favorites.html');
    }
  });

  // --- Cart store and mini cart UI ---
  const CartStore = {
    items: JSON.parse(localStorage.getItem('cart') || '[]'),
    save() { localStorage.setItem('cart', JSON.stringify(this.items)); },
    subtotal() { return this.items.reduce((s, i) => s + (i.price * i.qty), 0); },
    count() { return this.items.reduce((s, i) => s + i.qty, 0); },
    add(item) {
      const existing = this.items.find(x => x.id === item.id);
      if (existing) existing.qty = (existing.qty || 0) + (item.qty || 1);
      else this.items.push({ ...item, qty: item.qty || 1 });
      this.save();
      renderMiniCart();
      renderCartPage();
      showToast(item.title + ' added to cart');
      updateCartCount();
    },
    updateQty(id, qty) {
      const it = this.items.find(x => x.id === id);
      if (!it) return;
      it.qty = qty;
      if (it.qty <= 0) this.remove(id);
      this.save();
      renderMiniCart();
      renderCartPage();
      updateCartCount();
    },
    remove(id) {
      this.items = this.items.filter(x => x.id !== id);
      this.save();
      renderMiniCart();
      renderCartPage();
      updateCartCount();
    }
  };

  function formatCurrency(n) { return '₦' + Number(n).toLocaleString('en-NG'); }

  function getCartImage(item) {
    const imageFallbacks = {
      'oak-lounge-chair': 'IMAGES/lounge oak chair.jpg',
      'red-lamp': 'IMAGES/red lamp.jpg',
      'field-sideboard': 'IMAGES/sideboard.jpg',
      'roxy-dining-set': 'IMAGES/Roxy Dining Set.jpg'
    };
    if (imageFallbacks[item.id]) return imageFallbacks[item.id];
    return item.image || '';
  }

  function renderMiniCart() {
    const container = document.getElementById('mini-cart-items');
    const countEl = document.getElementById('mini-cart-count');
    const subtotalEl = document.getElementById('mini-cart-subtotal');
    if (!container) return;
    container.innerHTML = '';
    if (!CartStore.items.length) {
      container.innerHTML = '<div style="padding:1.5rem;color:#6b6b6b">Your cart is empty</div>';
    } else {
      CartStore.items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'mini-cart-item';
        div.innerHTML = `
          <img src="${getCartImage(item)}" alt="${item.title}">
          <div class="item-info">
            <div class="item-meta">
              <strong>${item.title}</strong>
              <span class="item-price">${formatCurrency(item.price)}</span>
            </div>
            <div class="item-actions">
              <div class="quantity-controls">
                <button class="qty-decrease" data-id="${item.id}" aria-label="Decrease quantity of ${item.title}">−</button>
                <span class="item-qty">${item.qty}</span>
                <button class="qty-increase" data-id="${item.id}" aria-label="Increase quantity of ${item.title}">+</button>
              </div>
              <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
          </div>
          <div class="item-total">${formatCurrency(item.price * item.qty)}</div>`;
        container.appendChild(div);
      });
    }
    if (countEl) countEl.textContent = CartStore.count();
    if (subtotalEl) subtotalEl.textContent = formatCurrency(CartStore.subtotal());
  }

  function openMiniCart() {
    const wrapper = document.getElementById('mini-cart');
    if (!wrapper) return;
    wrapper.classList.add('active');
    wrapper.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeMiniCart() {
    const wrapper = document.getElementById('mini-cart');
    if (!wrapper) return;
    wrapper.classList.remove('active');
    wrapper.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  // Delegated handlers for mini cart controls
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'clear-cart') {
      CartStore.items = [];
      CartStore.save();
      renderMiniCart();
      renderCartPage();
      updateCartCount();
      showToast('Cart cleared');
      return;
    }
    if (e.target.matches('.qty-increase')) {
      const id = e.target.dataset.id; const it = CartStore.items.find(x => x.id === id); if (it) CartStore.updateQty(id, it.qty + 1);
    }
    if (e.target.matches('.qty-decrease')) {
      const id = e.target.dataset.id; const it = CartStore.items.find(x => x.id === id); if (it) CartStore.updateQty(id, Math.max(0, it.qty - 1));
    }
    if (e.target.matches('.remove-item')) { const id = e.target.dataset.id; CartStore.remove(id); }
    if (e.target.matches('.save-for-later')) { e.preventDefault(); const id = e.target.dataset.id; showToast('Saved for later'); }
    if (e.target.closest('.favorites-remove')) {
      const button = e.target.closest('.favorites-remove');
      const favorites = getFavorites().filter((item) => item.id !== button.dataset.id);
      saveFavorites(favorites);
      renderFavoritesPage();
      initProductCardActions();
      showToast('Removed from favorites');
    }
  });

  function showToast(text) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = text; document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2200);
  }

  function updateCartCount() {
    const count = CartStore.count();
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
    document.querySelectorAll('.cart-badge').forEach((badge) => {
      badge.textContent = count;
      badge.classList.toggle('visible', count > 0);
    });
  }

  // Wire add-to-cart buttons on page
  document.addEventListener('click', (event) => {
    const btn = event.target.closest('.js-add-to-cart');
    if (!btn) return;
    const id = btn.dataset.id; const title = btn.dataset.title; const price = parseInt(btn.dataset.price, 10) || 0; const image = btn.dataset.image || '';
    const qtyInput = document.querySelector('.quantity-controls input'); const qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
    CartStore.add({ id, title, price, image, qty });
  });

  // Buy now -> add + go to cart
  document.querySelectorAll('.js-buy-now').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id; const title = btn.dataset.title; const price = parseInt(btn.dataset.price, 10) || 0; const image = btn.dataset.image || '';
      const qtyInput = document.querySelector('.quantity-controls input'); const qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
      CartStore.add({ id, title, price, image, qty });
      window.location.href = 'cart.html';
    });
  });

  // header cart icon opens mini cart
  document.querySelectorAll('.icon-btn[aria-label="Cart"]').forEach((btn) => btn.addEventListener('click', () => {
    window.location.href = 'cart.html';
  }));

  const miniClose = document.getElementById('mini-cart-close'); if (miniClose) miniClose.addEventListener('click', closeMiniCart);
  const miniBackdrop = document.getElementById('mini-cart-backdrop'); if (miniBackdrop) miniBackdrop.addEventListener('click', closeMiniCart);

  // initial render
  renderMiniCart();
  updateCartCount();
  // --- Cart page rendering and checkout flow ---
  function renderCartPage() {
    const cartContainer = document.getElementById('cart-page-items') || document.getElementById('cart-items');
    const cartList = document.getElementById('cart-list');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    if (!cartContainer) return;
    // header/title is in HTML now; render list
    if (!CartStore.items.length) {
      if (cartList) cartList.innerHTML = '<div class="empty-message">Your cart is empty.</div>';
      if (summarySubtotal) summarySubtotal.textContent = formatCurrency(0);
      if (summaryTotal) summaryTotal.textContent = formatCurrency(0);
      return;
    }
    if (!cartList) return;
    cartList.innerHTML = '';
    CartStore.items.forEach(item => {
      const card = document.createElement('div'); card.className = 'cart-card';
      card.innerHTML = `
        <img src="${getCartImage(item)}" alt="${item.title}">
        <div class="meta">
          <div class="title">${item.title}</div>
          <div class="meta-row">
            <div class="muted">${item.collection||''}</div>
            <div class="muted">${item.variant||''}</div>
          </div>
          <div style="margin-top:.5rem;font-weight:700">${formatCurrency(item.price)}</div>
          <div class="small-actions">
            <a href="#" class="save-for-later" data-id="${item.id}">♡ Save for later</a>
            <a href="#" class="remove-item" data-id="${item.id}">Remove</a>
          </div>
        </div>
        <div class="actions">
          <div class="quantity-controls" role="group" aria-label="Quantity selector">
            <button class="qty-decrease" data-id="${item.id}" aria-label="Decrease">−</button>
            <span aria-live="polite">${item.qty}</span>
            <button class="qty-increase" data-id="${item.id}" aria-label="Increase">+</button>
          </div>
          <div style="margin-top:.5rem;font-weight:700">${formatCurrency(item.price * item.qty)}</div>
        </div>`;
      cartList.appendChild(card);
    });
    const subtotal = CartStore.subtotal();
    if (summarySubtotal) summarySubtotal.textContent = formatCurrency(subtotal);
    if (summaryTotal) summaryTotal.textContent = formatCurrency(subtotal);
    // update mobile footer if present
    const mfTotal = document.querySelector('.mobile-cart-footer .total'); if (mfTotal) mfTotal.textContent = formatCurrency(subtotal);
  }

  

  // Promo code (simple example)
  function applyPromo(code) {
    if (!code) return 0;
    // example promo: SAVE10 => 10% off
    if (code.trim().toUpperCase() === 'SAVE10') return Math.round(CartStore.subtotal() * 0.1);
    return 0;
  }

  // Cart page controls (delegated earlier handlers already support qty/remove)
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'apply-promo') {
      const code = document.getElementById('promo-code')?.value || '';
      const discount = applyPromo(code);
      const subtotalEl = document.getElementById('summary-subtotal');
      const totalEl = document.getElementById('summary-total');
      if (subtotalEl) {
        const sub = CartStore.subtotal();
        subtotalEl.textContent = formatCurrency(sub - discount);
      }
      if (totalEl) totalEl.textContent = formatCurrency(CartStore.subtotal() - discount);
    }
  });

  // Checkout page rendering
  function renderCheckoutSummary() {
    const checkoutItems = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');
    const discountEl = document.getElementById('checkout-discount');
    if (!checkoutItems) return;
    checkoutItems.innerHTML = '';
    if (!CartStore.items.length) {
      checkoutItems.innerHTML = '<div style="color:#6b6b6b;padding:.75rem 0">No items in cart</div>';
    }
    CartStore.items.forEach(i => {
      const row = document.createElement('div'); row.className = 'order-item';
      row.innerHTML = `
        <img src="${i.image}" alt="${i.title}">
        <div class="meta"><div style="font-weight:700">${i.title}</div><div style="color:#6b6b6b;font-size:.95rem">${i.variant||''}</div><div style="margin-top:.35rem;color:#6b6b6b">Qty ${i.qty}</div></div>
        <div style="min-width:92px;text-align:right;font-weight:700">${formatCurrency(i.price * i.qty)}</div>
      `;
      checkoutItems.appendChild(row);
    });
    const subtotal = CartStore.subtotal();
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal - (typeof currentDiscount !== 'undefined' ? currentDiscount : 0));
    if (discountEl) discountEl.textContent = '-' + formatCurrency(currentDiscount || 0);
    if (totalEl) totalEl.textContent = formatCurrency(subtotal - (currentDiscount || 0));
  }

  // Handle checkout submission + autosave, shipping, promo, mobile footer
  const checkoutForm = document.getElementById('checkout-form');
  let currentDiscount = 0;

  function debounce(fn, wait = 250) {
    let t;
    return function(...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); };
  }

  function saveCheckoutDraft() {
    if (!checkoutForm) return;
    const data = Object.fromEntries(new FormData(checkoutForm).entries());
    data._shipping = document.querySelector('input[name="delivery"]:checked')?.value || 'standard';
    data._promo = document.getElementById('promo-code')?.value || '';
    localStorage.setItem('checkoutDraft', JSON.stringify(data));
  }

  function restoreCheckoutDraft() {
    try {
      const raw = localStorage.getItem('checkoutDraft');
      if (!raw || !checkoutForm) return;
      const data = JSON.parse(raw);
      Object.keys(data).forEach(k => {
        const el = checkoutForm.querySelector(`[name="${k}"]`);
        if (!el) return;
        if (el.type === 'radio' || el.type === 'checkbox') return;
        el.value = data[k];
      });
      // radio
      if (data._shipping) {
        const r = document.querySelector(`input[name="delivery"][value="${data._shipping}"]`);
        if (r) r.checked = true;
      }
      if (data._promo) {
        const pc = document.getElementById('promo-code'); if (pc) pc.value = data._promo;
      }
    } catch(e) {
      // ignore
    }
  }

  function updateTotals() {
    const subtotal = CartStore.subtotal();
    const shippingVal = document.querySelector('input[name="delivery"]:checked')?.dataset?.price || '0';
    const shipping = parseInt(shippingVal, 10) || 0;
    const total = subtotal - currentDiscount + shipping;
    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const totalEl = document.getElementById('checkout-total');
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal - currentDiscount);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : formatCurrency(shipping);
    if (totalEl) totalEl.textContent = formatCurrency(total);
    // mobile footer if present
    const mfTotal = document.querySelector('.mobile-checkout-footer .total'); if (mfTotal) mfTotal.textContent = formatCurrency(total);
    // refresh checkout items & discount display
    renderCheckoutSummary();
  }

  function applyPromoCodeNow() {
    const code = document.getElementById('promo-code')?.value || '';
    const discount = applyPromo(code);
    currentDiscount = discount;
    updateTotals();
    saveCheckoutDraft();
    showToast(discount ? 'Promo applied' : 'Invalid promo code');
  }

  if (checkoutForm) {
    renderCheckoutSummary();
    restoreCheckoutDraft();
    // wire inputs to autosave and simple inline validation
    checkoutForm.querySelectorAll('input,select,textarea').forEach((el) => {
      el.addEventListener('input', debounce(() => { saveCheckoutDraft(); updateTotals(); }, 300));
      el.addEventListener('blur', () => {
        if (el.required && !el.value) {
          el.style.borderColor = '#d9534f';
        } else {
          el.style.borderColor = '';
        }
      });
    });

    // shipping change
    document.addEventListener('change', (ev) => {
      if (ev.target && ev.target.name === 'delivery') {
        updateTotals(); saveCheckoutDraft();
      }
      if (ev.target && ev.target.id === 'apply-promo') {
        applyPromoCodeNow();
      }
    });

    // promo apply button
    const promoBtn = document.getElementById('apply-promo');
    if (promoBtn) promoBtn.addEventListener('click', (e) => { e.preventDefault(); applyPromoCodeNow(); });

    // Place order handler
    checkoutForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const form = ev.target;
      const data = Object.fromEntries(new FormData(form).entries());
      // inline required check
      const required = Array.from(form.querySelectorAll('[required]'));
      const invalid = required.filter(i => !i.value.trim());
      if (invalid.length) { invalid[0].focus(); showToast('Please complete required fields'); return; }
      // create order
      const shipping = document.querySelector('input[name="delivery"]:checked')?.dataset?.price || '0';
      const shippingCost = parseInt(shipping, 10) || 0;
      const order = {
        id: 'ORD' + Date.now().toString(36).toUpperCase(),
        items: CartStore.items,
        subtotal: CartStore.subtotal(),
        discount: currentDiscount,
        shipping: shippingCost,
        total: CartStore.subtotal() - currentDiscount + shippingCost,
        customer: data
      };
      sessionStorage.setItem('latestOrder', JSON.stringify(order));
      // clear cart + draft
      CartStore.items = [];
      CartStore.save();
      localStorage.removeItem('checkoutDraft');
      renderMiniCart();
      updateCartCount();
      // show processing micro-state then redirect
      showToast('Processing payment...');
      setTimeout(() => { window.location.href = 'order-confirmation.html'; }, 900);
    });

  // =========================================================
// MOBILE CHECKOUT FOOTER
// CHECKOUT PAGE ONLY
// =========================================================

function ensureMobileFooter() {
  // Never create this outside checkout.html
 


  document.body.appendChild(footer);

  footer.querySelector('.place-order').addEventListener('click', () => {
    const submitButton =
      checkoutForm?.querySelector('.place-order[type="submit"]') ||
      checkoutForm?.querySelector('[type="submit"]');

    if (submitButton) {
      submitButton.click();
    }
  });
}

function removeMobileFooter() {
  const footer = document.querySelector('.mobile-checkout-footer');

  if (footer && !document.body.classList.contains('checkout-page')) {
    footer.remove();
  }
}

if (document.body.classList.contains('checkout-page')) {
  if (window.innerWidth <= 900) {
    ensureMobileFooter();
  }

  window.addEventListener('resize', debounce(() => {
    if (document.body.classList.contains('checkout-page')) {
      if (window.innerWidth <= 900) {
        ensureMobileFooter();
      } else {
        removeMobileFooter();
      }
    }
  }, 300));
} else {
  removeMobileFooter();
}
    // initial totals
    currentDiscount = applyPromo(document.getElementById('promo-code')?.value || '');
    updateTotals();

    // billing address toggle
    const sameBilling = document.getElementById('same-as-shipping');
    const billingFields = document.getElementById('billing-fields');
    if (sameBilling && billingFields) {
      sameBilling.addEventListener('change', () => {
        billingFields.style.display = sameBilling.checked ? 'none' : 'block';
      });
    }

    // progress tracker: update active step based on focused section
    const progressSteps = document.querySelectorAll('.progress-step');
    function setActiveStep(n) {
      progressSteps.forEach(s => { s.classList.toggle('active', s.dataset.step === String(n)); s.classList.toggle('completed', Number(s.dataset.step) < n); });
    }
    if (checkoutForm) {
      checkoutForm.addEventListener('focusin', (e) => {
        const sec = e.target.closest('.checkout-section');
        if (!sec || !sec.dataset.step) return;
        setActiveStep(Number(sec.dataset.step));
      });
    }
  }

  // Render confirmation page
  function renderOrderConfirmation() {
    const el = document.getElementById('order-confirmation');
    if (!el) return;
    let order = null;
    try { order = JSON.parse(sessionStorage.getItem('latestOrder') || 'null'); } catch(e) { order = null; }
    if (!order) {
      el.innerHTML = '<p>No recent order found.</p>';
      return;
    }
    const numEl = document.getElementById('order-number');
    const summaryEl = document.getElementById('order-summary');
    if (numEl) numEl.textContent = 'Order ' + order.id;
    if (summaryEl) {
      summaryEl.innerHTML = `
        <p>Estimated delivery: 3–7 business days</p>
        <p style="margin-top:1rem">Subtotal: ${formatCurrency(order.subtotal)}</p>
        <p>Total: ${formatCurrency(order.total)}</p>
      `;
    }
    // remove latestOrder from session to avoid duplicate
    sessionStorage.removeItem('latestOrder');
  }

  // run page-specific renders
  renderCartPage();
  ensureMobileCartFooter();
  window.addEventListener('resize', debounce(() => {
    // ensure mobile footer presence when small
    if (window.innerWidth <= 900) ensureMobileCartFooter();
    else {
      const mf = document.querySelector('.mobile-cart-footer'); if (mf) mf.remove();
    }
  }, 250));
  renderCheckoutSummary();
  renderOrderConfirmation();

  // Recommendations carousel
  function initRecommendations() {
    document.querySelectorAll('.recommendations').forEach(section => {
      const track = section.querySelector('.recommendations-track');
      const prev = section.querySelector('.rec-prev');
      const next = section.querySelector('.rec-next');
      if (!track) return;

      const updateButtons = () => {
        if (!prev || !next) return;
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth - 2;
      };

      // compute scroll amount (card width + gap)
      const getScrollAmount = () => {
        const card = track.querySelector('.rec-card');
        if (!card) return track.clientWidth * 0.8;
        const style = getComputedStyle(card);
        const mr = parseFloat(style.marginRight) || 24;
        return Math.round(card.getBoundingClientRect().width + mr);
      };

      if (prev) prev.addEventListener('click', () => {
        const amt = getScrollAmount();
        track.scrollBy({ left: -amt, behavior: 'smooth' });
        setTimeout(updateButtons, 300);
      });
      if (next) next.addEventListener('click', () => {
        const amt = getScrollAmount();
        track.scrollBy({ left: amt, behavior: 'smooth' });
        setTimeout(updateButtons, 300);
      });

      // If GSAP is loaded and screen is wide, create a seamless marquee animation
      if (typeof gsap !== 'undefined' && window.innerWidth > 900) {
        // build marquee: wrap existing cards into an inner container and clone it
        const cards = Array.from(track.children);
        if (cards.length) {
          const inner = document.createElement('div'); inner.className = 'marquee-inner';
          inner.style.display = 'flex'; inner.style.gap = '24px';
          // move cards into inner
          while (track.firstChild) inner.appendChild(track.firstChild);
          // append two copies for seamless loop
          track.appendChild(inner);
          const clone = inner.cloneNode(true);
          track.appendChild(clone);
          track.style.overflow = 'hidden';
          track.style.display = 'flex';
          track.style.flexWrap = 'nowrap';

          // wait for layout then measure
          requestAnimationFrame(() => {
            const width = inner.getBoundingClientRect().width;
            const speed = 80; // px per second
            const duration = Math.max(8, width / speed);
            const tween = gsap.to(inner, { x: -width, duration, ease: 'linear', repeat: -1 });

            // pause on hover/focus
            track.addEventListener('mouseenter', () => tween.pause());
            track.addEventListener('mouseleave', () => tween.play());
            track.addEventListener('focusin', () => tween.pause());
            track.addEventListener('focusout', () => tween.play());
            document.addEventListener('visibilitychange', () => { document.hidden ? tween.pause() : tween.play(); });
          });
        }
      } else {
        // fallback: arrow controls + autoplay
        track.addEventListener('scroll', debounce(updateButtons, 80));
        // initial state
        updateButtons();

        // autoplay: auto-scroll the track every few seconds, loop to start
        let autoplayTimer = null;
        const startAutoplay = () => {
          if (autoplayTimer) return;
          if (window.innerWidth <= 700) return; // disable on small screens
          const amt = getScrollAmount();
          autoplayTimer = setInterval(() => {
            if (Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth - 2) {
              track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
              track.scrollBy({ left: amt, behavior: 'smooth' });
            }
          }, 3500);
        };
        const stopAutoplay = () => { if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } };

        track.addEventListener('mouseenter', stopAutoplay);
        track.addEventListener('mouseleave', startAutoplay);
        track.addEventListener('focusin', stopAutoplay);
        track.addEventListener('focusout', startAutoplay);
        document.addEventListener('visibilitychange', () => { document.hidden ? stopAutoplay() : startAutoplay(); });

        // start autoplay when visible
        startAutoplay();
      }
    });
  }
  initRecommendations();

  const lenis = initLenis();
  initGSAP(lenis);
  initProductInteractions();
  initCollectionInteractions();
});
