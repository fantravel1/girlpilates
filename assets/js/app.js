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
  // Update keyboard shortcut hint based on user's OS
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  document.querySelectorAll('[data-key-hint]').forEach((el) => {
    el.textContent = isMac ? '⌘' : 'Ctrl';
  });

  const searchTriggerDesktop = document.getElementById('search-trigger-desktop');
  const searchTriggerMobile = document.getElementById('search-trigger-mobile');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchResultsList = document.getElementById('search-results-list');
  const searchInitial = document.getElementById('search-initial');
  const searchNoResults = document.getElementById('search-no-results');
  const searchLoading = document.getElementById('search-loading');
  const closeSearch = document.getElementById('close-search');

  let selectedIndex = -1;
  let currentResults = [];

  if (searchModal) {
    // Open search from triggers
    const openSearch = () => {
      searchModal.classList.remove('hidden');
      // Trigger animation
      requestAnimationFrame(() => {
        searchModal.classList.add('active');
      });
      searchModal.setAttribute('aria-hidden', 'false');
      searchInput?.focus();
      document.body.style.overflow = 'hidden';
      resetSearchState();
    };

    searchTriggerDesktop?.addEventListener('click', openSearch);
    searchTriggerMobile?.addEventListener('click', openSearch);

    // Close search
    const closeSearchModal = () => {
      searchModal.classList.remove('active');
      setTimeout(() => {
        searchModal.classList.add('hidden');
      }, 200);
      searchModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (searchInput) searchInput.value = '';
      resetSearchState();
    };

    closeSearch?.addEventListener('click', closeSearchModal);

    // Close on backdrop click
    searchModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('search-backdrop')) closeSearchModal();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        closeSearchModal();
      }
    });

    // Open search with Cmd/Ctrl + K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    });

    // Keyboard navigation for results
    searchInput?.addEventListener('keydown', (e) => {
      if (!currentResults.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, currentResults.length - 1);
        updateSelectedResult();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        updateSelectedResult();
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const selectedItem = searchResultsList?.querySelector('.search-result-item.selected');
        if (selectedItem) {
          window.location.href = selectedItem.getAttribute('href');
        }
      }
    });

    // Handle search suggestions
    document.querySelectorAll('.search-suggestion').forEach((btn) => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        if (searchInput && query) {
          searchInput.value = query;
          searchInput.dispatchEvent(new Event('input'));
        }
      });
    });
  }

  function resetSearchState() {
    selectedIndex = -1;
    currentResults = [];
    if (searchInitial) searchInitial.classList.remove('hidden');
    if (searchResultsList) {
      searchResultsList.classList.add('hidden');
      searchResultsList.innerHTML = '';
    }
    if (searchNoResults) searchNoResults.classList.add('hidden');
  }

  function updateSelectedResult() {
    const items = searchResultsList?.querySelectorAll('.search-result-item');
    items?.forEach((item, i) => {
      item.classList.toggle('selected', i === selectedIndex);
    });

    // Scroll selected into view
    const selected = searchResultsList?.querySelector('.search-result-item.selected');
    selected?.scrollIntoView({ block: 'nearest' });
  }

  // Initialize Pagefind search if available
  initPagefindSearch();
});

// Pagefind search integration with metadata priority
async function initPagefindSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResultsList = document.getElementById('search-results-list');
  const searchInitial = document.getElementById('search-initial');
  const searchNoResults = document.getElementById('search-no-results');
  const searchLoading = document.getElementById('search-loading');

  if (!searchInput || !searchResultsList) return;

  // Try to load Pagefind
  try {
    const pagefind = await import('/pagefind/pagefind.js');
    await pagefind.init();

    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      const query = e.target.value.trim();

      if (query.length < 2) {
        searchInitial?.classList.remove('hidden');
        searchResultsList.classList.add('hidden');
        searchNoResults?.classList.add('hidden');
        window.currentResults = [];
        return;
      }

      searchLoading?.classList.remove('hidden');

      debounceTimer = setTimeout(async () => {
        const results = await pagefind.search(query);
        searchLoading?.classList.add('hidden');

        if (results.results.length === 0) {
          searchInitial?.classList.add('hidden');
          searchResultsList.classList.add('hidden');
          searchNoResults?.classList.remove('hidden');
          window.currentResults = [];
          return;
        }

        // Get full data for results and sort by metadata match
        const fullResults = await Promise.all(
          results.results.slice(0, 12).map(async (result) => {
            const data = await result.data();
            return {
              ...data,
              score: result.score,
              metadataMatch: calculateMetadataMatch(data, query)
            };
          })
        );

        // Sort by metadata match first, then by pagefind score
        fullResults.sort((a, b) => {
          if (b.metadataMatch !== a.metadataMatch) {
            return b.metadataMatch - a.metadataMatch;
          }
          return b.score - a.score;
        });

        window.currentResults = fullResults;
        window.selectedIndex = -1;

        const items = fullResults.map((data, index) => {
          const type = getContentType(data.url);
          const icon = getTypeIcon(type);

          return `
            <a href="${data.url}" class="search-result-item" data-index="${index}">
              <div class="search-result-icon type-${type}">
                ${icon}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="search-result-type badge-${type}">${type}</span>
                </div>
                <h3 class="font-medium text-gray-900 truncate">${data.meta?.title || 'Untitled'}</h3>
                <p class="text-sm text-gray-500 line-clamp-2 mt-0.5">${data.excerpt}</p>
              </div>
              <svg class="w-5 h-5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          `;
        });

        searchInitial?.classList.add('hidden');
        searchNoResults?.classList.add('hidden');
        searchResultsList.classList.remove('hidden');
        searchResultsList.innerHTML = items.join('');

        // Add hover state handling
        searchResultsList.querySelectorAll('.search-result-item').forEach((item, i) => {
          item.addEventListener('mouseenter', () => {
            window.selectedIndex = i;
            searchResultsList.querySelectorAll('.search-result-item').forEach((el, j) => {
              el.classList.toggle('selected', j === i);
            });
          });
        });
      }, 150);
    });
  } catch (error) {
    // Pagefind not available (probably development mode)
    console.log('Pagefind not available, search disabled');
    searchInput.placeholder = 'Search (available in production)';
  }
}

// Calculate how well metadata matches the query (higher = better)
function calculateMetadataMatch(data, query) {
  const queryLower = query.toLowerCase();
  const title = (data.meta?.title || '').toLowerCase();
  let score = 0;

  // Exact title match = highest priority
  if (title === queryLower) score += 100;
  // Title starts with query
  else if (title.startsWith(queryLower)) score += 75;
  // Title contains query as word
  else if (title.includes(` ${queryLower}`) || title.includes(`${queryLower} `)) score += 50;
  // Title contains query
  else if (title.includes(queryLower)) score += 25;

  return score;
}

// Determine content type from URL
function getContentType(url) {
  if (!url) return 'other';
  if (url.includes('/exercises/') || url.includes('/ejercicios/')) return 'exercise';
  if (url.includes('/workouts/') || url.includes('/entrenamientos/')) return 'workout';
  if (url.includes('/learn/') || url.includes('/aprender/')) return 'learn';
  if (url.includes('/teachers/') || url.includes('/profesores/')) return 'teacher';
  return 'other';
}

// Get icon for content type
function getTypeIcon(type) {
  const icons = {
    exercise: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>',
    workout: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>',
    learn: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
    teacher: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
    other: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>'
  };
  return icons[type] || icons.other;
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
