/**
 * GirlPilates Exercise Filter
 * Client-side filtering for exercise library
 */

class ExerciseFilter {
  constructor(container, exercises) {
    this.container = container;
    this.exercises = exercises || [];
    this.filters = {
      difficulty: [],
      equipment: [],
      muscles: [],
      search: '',
    };
    this.lang = document.documentElement.lang || 'en';
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Difficulty filters
    document.querySelectorAll('[data-filter="difficulty"]').forEach((el) => {
      el.addEventListener('change', (e) => {
        this.updateFilter('difficulty', e.target.value, e.target.checked);
      });
    });

    // Equipment filters
    document.querySelectorAll('[data-filter="equipment"]').forEach((el) => {
      el.addEventListener('change', (e) => {
        this.updateFilter('equipment', e.target.value, e.target.checked);
      });
    });

    // Muscle filters
    document.querySelectorAll('[data-filter="muscles"]').forEach((el) => {
      el.addEventListener('change', (e) => {
        this.updateFilter('muscles', e.target.value, e.target.checked);
      });
    });

    // Search input
    const searchInput = document.getElementById('exercise-search');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.filters.search = e.target.value.toLowerCase().trim();
          this.render();
        }, 200);
      });
    }

    // Clear all filters
    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearFilters());
    }

    // Mobile filter panel toggle
    const filterToggle = document.getElementById('filter-toggle');
    const filterPanel = document.getElementById('filter-panel');
    if (filterToggle && filterPanel) {
      filterToggle.addEventListener('click', () => {
        filterPanel.classList.toggle('open');
      });
    }
  }

  updateFilter(type, value, isChecked) {
    if (isChecked) {
      if (!this.filters[type].includes(value)) {
        this.filters[type].push(value);
      }
    } else {
      this.filters[type] = this.filters[type].filter((v) => v !== value);
    }
    this.render();
    this.updateURL();
  }

  clearFilters() {
    this.filters = {
      difficulty: [],
      equipment: [],
      muscles: [],
      search: '',
    };

    // Uncheck all checkboxes
    document.querySelectorAll('[data-filter]').forEach((el) => {
      if (el.type === 'checkbox') el.checked = false;
    });

    // Clear search input
    const searchInput = document.getElementById('exercise-search');
    if (searchInput) searchInput.value = '';

    this.render();
    this.updateURL();
  }

  getFilteredExercises() {
    return this.exercises.filter((exercise) => {
      // Difficulty filter
      if (this.filters.difficulty.length > 0) {
        if (!this.filters.difficulty.includes(exercise.difficulty)) {
          return false;
        }
      }

      // Equipment filter
      if (this.filters.equipment.length > 0) {
        const hasEquipment = exercise.equipment?.some((eq) =>
          this.filters.equipment.includes(eq)
        );
        if (!hasEquipment) return false;
      }

      // Muscles filter
      if (this.filters.muscles.length > 0) {
        const hasMuscle = exercise.muscles?.some((m) =>
          this.filters.muscles.includes(m)
        );
        if (!hasMuscle) return false;
      }

      // Search filter
      if (this.filters.search) {
        const title = (this.lang === 'es' ? exercise.title_es : exercise.title) || '';
        const desc = (this.lang === 'es' ? exercise.description_es : exercise.description) || '';
        const searchText = `${title} ${desc}`.toLowerCase();
        if (!searchText.includes(this.filters.search)) {
          return false;
        }
      }

      return true;
    });
  }

  render() {
    const filtered = this.getFilteredExercises();
    const countEl = document.getElementById('exercise-count');
    if (countEl) {
      countEl.textContent = filtered.length;
    }

    // If using server-rendered cards, show/hide them
    const cards = this.container?.querySelectorAll('[data-exercise-id]');
    if (cards && cards.length > 0) {
      const filteredIds = new Set(filtered.map((ex) => ex.id));
      cards.forEach((card) => {
        const id = card.dataset.exerciseId;
        card.style.display = filteredIds.has(id) ? '' : 'none';
      });
      return;
    }

    // If rendering dynamically
    if (this.container) {
      this.renderCards(filtered);
    }
  }

  renderCards(exercises) {
    if (exercises.length === 0) {
      this.container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-gray-500">${
            this.lang === 'es'
              ? 'No se encontraron ejercicios. Intenta ajustar los filtros.'
              : 'No exercises found. Try adjusting your filters.'
          }</p>
          <button onclick="window.exerciseFilter?.clearFilters()" class="btn btn-secondary mt-4">
            ${this.lang === 'es' ? 'Limpiar Filtros' : 'Clear Filters'}
          </button>
        </div>
      `;
      return;
    }

    this.container.innerHTML = exercises
      .map((ex) => this.renderCard(ex))
      .join('');
  }

  renderCard(exercise) {
    const title = this.lang === 'es' ? exercise.title_es : exercise.title;
    const desc = this.lang === 'es' ? exercise.description_es : exercise.description;
    const difficultyColors = {
      beginner: 'bg-green-100 text-green-700',
      principiante: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      intermedio: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700',
      avanzado: 'bg-red-100 text-red-700',
    };

    return `
      <article class="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow" data-exercise-id="${exercise.id}">
        <div class="p-5">
          <div class="flex items-start justify-between mb-2">
            <h3 class="font-semibold text-gray-900">${title}</h3>
            <span class="px-2 py-0.5 text-xs rounded ${difficultyColors[exercise.difficulty] || 'bg-gray-100 text-gray-700'}">
              ${exercise.difficulty}
            </span>
          </div>
          <p class="text-sm text-gray-600 line-clamp-2">${desc || ''}</p>
          <div class="flex flex-wrap gap-1 mt-3">
            ${(exercise.muscles || [])
              .slice(0, 3)
              .map((m) => `<span class="px-2 py-0.5 text-xs bg-pink-50 text-pink-700 rounded">${m}</span>`)
              .join('')}
          </div>
        </div>
        <a href="${exercise.url || '#'}" class="block px-5 py-3 bg-gray-50 text-pink-600 text-sm font-medium hover:bg-pink-50 transition-colors">
          ${this.lang === 'es' ? 'Ver Ejercicio →' : 'View Exercise →'}
        </a>
      </article>
    `;
  }

  updateURL() {
    const params = new URLSearchParams();
    if (this.filters.difficulty.length > 0) {
      params.set('difficulty', this.filters.difficulty.join(','));
    }
    if (this.filters.equipment.length > 0) {
      params.set('equipment', this.filters.equipment.join(','));
    }
    if (this.filters.muscles.length > 0) {
      params.set('muscles', this.filters.muscles.join(','));
    }
    if (this.filters.search) {
      params.set('q', this.filters.search);
    }

    const newURL = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', newURL);
  }

  loadFromURL() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('difficulty')) {
      this.filters.difficulty = params.get('difficulty').split(',');
    }
    if (params.has('equipment')) {
      this.filters.equipment = params.get('equipment').split(',');
    }
    if (params.has('muscles')) {
      this.filters.muscles = params.get('muscles').split(',');
    }
    if (params.has('q')) {
      this.filters.search = params.get('q');
      const searchInput = document.getElementById('exercise-search');
      if (searchInput) searchInput.value = this.filters.search;
    }

    // Update checkbox states
    this.filters.difficulty.forEach((v) => {
      const el = document.querySelector(`[data-filter="difficulty"][value="${v}"]`);
      if (el) el.checked = true;
    });
    this.filters.equipment.forEach((v) => {
      const el = document.querySelector(`[data-filter="equipment"][value="${v}"]`);
      if (el) el.checked = true;
    });
    this.filters.muscles.forEach((v) => {
      const el = document.querySelector(`[data-filter="muscles"][value="${v}"]`);
      if (el) el.checked = true;
    });

    this.render();
  }
}

// Initialize filter when DOM is ready
async function initExerciseFilter() {
  const container = document.getElementById('exercise-grid');
  if (!container) return;

  let exercises = [];
  try {
    const response = await fetch('/data/exercises.json');
    const data = await response.json();
    exercises = data.exercises || [];
  } catch (error) {
    console.log('Exercise data not available');
  }

  window.exerciseFilter = new ExerciseFilter(container, exercises);
  window.exerciseFilter.loadFromURL();
  window.exerciseFilter.init();
}

document.addEventListener('DOMContentLoaded', initExerciseFilter);
