/**
 * GirlPilates Main Application JavaScript
 * Handles core site functionality
 */

// Language Switcher functionality
document.addEventListener('DOMContentLoaded', () => {
  // Handle all language switchers on the page
  document.querySelectorAll('.lang-switch').forEach((switcher) => {
    const btn = switcher.querySelector('.lang-switch-btn');
    const menu = switcher.querySelector('.lang-switch-menu');
    const arrow = switcher.querySelector('.lang-switch-arrow');

    if (!btn || !menu) return;

    // Toggle menu on button click
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !menu.classList.contains('hidden');

      // Close all other menus first
      document.querySelectorAll('.lang-switch-menu').forEach((m) => {
        m.classList.add('hidden');
      });
      document.querySelectorAll('.lang-switch-arrow').forEach((a) => {
        a.classList.remove('rotate-180');
      });
      document.querySelectorAll('.lang-switch-btn').forEach((b) => {
        b.setAttribute('aria-expanded', 'false');
      });

      // Toggle this menu
      if (!isOpen) {
        menu.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
        if (arrow) arrow.classList.add('rotate-180');
      }
    });
  });

  // Close menus when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.lang-switch-menu').forEach((menu) => {
      menu.classList.add('hidden');
    });
    document.querySelectorAll('.lang-switch-arrow').forEach((arrow) => {
      arrow.classList.remove('rotate-180');
    });
    document.querySelectorAll('.lang-switch-btn').forEach((btn) => {
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.lang-switch-menu').forEach((menu) => {
        menu.classList.add('hidden');
      });
    }
  });
});

// Search functionality
document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-btn');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const closeSearch = document.getElementById('close-search');

  if (searchBtn && searchModal) {
    // Open search
    searchBtn.addEventListener('click', () => {
      searchModal.classList.remove('hidden');
      searchModal.setAttribute('aria-hidden', 'false');
      searchInput?.focus();
      document.body.style.overflow = 'hidden';
    });

    // Close search
    const closeSearchModal = () => {
      searchModal.classList.add('hidden');
      searchModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (searchInput) searchInput.value = '';
      if (searchResults) searchResults.innerHTML = '';
    };

    closeSearch?.addEventListener('click', closeSearchModal);

    // Close on backdrop click
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearchModal();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
        closeSearchModal();
      }
    });

    // Open search with Cmd/Ctrl + K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchBtn.click();
      }
    });
  }

  // Initialize Pagefind search if available
  initPagefindSearch();
});

// Pagefind search integration
async function initPagefindSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchInput || !searchResults) return;

  // Try to load Pagefind
  try {
    const pagefind = await import('/pagefind/pagefind.js');
    await pagefind.init();

    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      const query = e.target.value.trim();

      if (query.length < 2) {
        searchResults.innerHTML = '<p class="p-4 text-gray-500 text-center">Type at least 2 characters to search...</p>';
        return;
      }

      debounceTimer = setTimeout(async () => {
        const results = await pagefind.search(query);

        if (results.results.length === 0) {
          searchResults.innerHTML = '<p class="p-4 text-gray-500 text-center">No results found</p>';
          return;
        }

        const items = await Promise.all(
          results.results.slice(0, 8).map(async (result) => {
            const data = await result.data();
            return `
              <a href="${data.url}" class="block p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <h3 class="font-medium text-gray-900">${data.meta.title || 'Untitled'}</h3>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2">${data.excerpt}</p>
              </a>
            `;
          })
        );

        searchResults.innerHTML = items.join('');
      }, 200);
    });
  } catch (error) {
    // Pagefind not available (probably development mode)
    console.log('Pagefind not available, search disabled');
    searchInput.placeholder = 'Search (available in production)';
  }
}

// Lite YouTube Embed
class LiteYTEmbed extends HTMLElement {
  connectedCallback() {
    this.videoId = this.getAttribute('videoid');
    let playBtnEl = this.querySelector('.lty-playbtn');

    if (!playBtnEl) {
      playBtnEl = document.createElement('button');
      playBtnEl.type = 'button';
      playBtnEl.classList.add('lty-playbtn');
      this.append(playBtnEl);
    }

    if (!playBtnEl.textContent) {
      const playBtnLabelEl = document.createElement('span');
      playBtnLabelEl.className = 'lyt-visually-hidden';
      playBtnLabelEl.textContent = this.getAttribute('playlabel') || 'Play';
      playBtnEl.append(playBtnLabelEl);
    }

    this.addEventListener('pointerover', LiteYTEmbed.warmConnections, { once: true });
    this.addEventListener('click', this.addIframe);
  }

  static warmConnections() {
    if (LiteYTEmbed.preconnected) return;
    LiteYTEmbed.preconnected = true;

    const links = [
      'https://www.youtube-nocookie.com',
      'https://www.google.com',
      'https://googleads.g.doubleclick.net',
      'https://static.doubleclick.net',
    ];

    links.forEach((url) => {
      const linkEl = document.createElement('link');
      linkEl.rel = 'preconnect';
      linkEl.href = url;
      document.head.append(linkEl);
    });
  }

  addIframe() {
    if (this.classList.contains('lyt-activated')) return;
    this.classList.add('lyt-activated');

    const params = new URLSearchParams({
      autoplay: '1',
      playsinline: '1',
      rel: '0',
    });

    const iframeEl = document.createElement('iframe');
    iframeEl.width = 560;
    iframeEl.height = 315;
    iframeEl.title = this.getAttribute('playlabel') || 'Video';
    iframeEl.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    iframeEl.allowFullscreen = true;
    iframeEl.src = `https://www.youtube-nocookie.com/embed/${this.videoId}?${params.toString()}`;
    this.append(iframeEl);

    // Remove play button
    const playBtn = this.querySelector('.lty-playbtn');
    if (playBtn) playBtn.remove();
  }
}

// Register custom element
if (!customElements.get('lite-youtube')) {
  customElements.define('lite-youtube', LiteYTEmbed);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});

// Intersection Observer for animations
const observeElements = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '50px' }
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });
};

if ('IntersectionObserver' in window) {
  observeElements();
}

// Print workout functionality
window.printWorkout = () => {
  window.print();
};

// Copy workout to clipboard
window.copyWorkout = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('Workout copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

console.log('GirlPilates loaded successfully');
