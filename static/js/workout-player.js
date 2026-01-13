/**
 * Interactive Workout Player
 * A full-screen workout timer with exercise guidance
 */

class WorkoutPlayer {
  constructor(exercises, options = {}) {
    this.exercises = exercises;
    this.currentIndex = 0;
    this.timeRemaining = 0;
    this.totalTime = 0;
    this.elapsedTime = 0;
    this.isPaused = false;
    this.isRunning = false;
    this.timer = null;
    this.audioEnabled = options.audioEnabled !== false;

    // Calculate total workout time
    this.totalTime = exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);

    // Audio context for beeps
    this.audioContext = null;

    this.init();
  }

  init() {
    this.createPlayerUI();
    this.bindEvents();
  }

  createPlayerUI() {
    const overlay = document.createElement('div');
    overlay.id = 'workout-player-overlay';
    overlay.className = 'fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 z-50 hidden';
    overlay.innerHTML = `
      <div class="h-full flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 bg-black/20">
          <button id="wp-exit" class="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <span class="hidden sm:inline">Exit</span>
          </button>

          <div class="flex items-center gap-4">
            <button id="wp-sound" class="text-white/80 hover:text-white transition-colors" title="Toggle sound">
              <svg id="wp-sound-on" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
              </svg>
              <svg id="wp-sound-off" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="px-4 py-2 bg-black/10">
          <div class="flex items-center gap-3 text-white/60 text-sm mb-2">
            <span id="wp-elapsed">0:00</span>
            <div class="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div id="wp-progress" class="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-300" style="width: 0%"></div>
            </div>
            <span id="wp-total">0:00</span>
          </div>
          <div class="flex justify-center gap-1" id="wp-dots"></div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col items-center justify-center p-6 overflow-hidden">
          <!-- Exercise Type Badge -->
          <div id="wp-type-badge" class="px-4 py-1.5 rounded-full text-sm font-medium mb-4 bg-pink-500/20 text-pink-300">
            Exercise
          </div>

          <!-- Timer Circle -->
          <div class="relative mb-6">
            <svg class="w-48 h-48 sm:w-64 sm:h-64 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>
              <circle id="wp-timer-ring" cx="60" cy="60" r="54" fill="none" stroke="url(#timerGradient)" stroke-width="8" stroke-linecap="round" stroke-dasharray="339.292" stroke-dashoffset="0" class="transition-all duration-1000"/>
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#ec4899"/>
                  <stop offset="100%" stop-color="#a855f7"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span id="wp-time" class="text-5xl sm:text-7xl font-bold tabular-nums">0:00</span>
              <span id="wp-reps" class="text-lg text-white/70 mt-1"></span>
            </div>
          </div>

          <!-- Exercise Name -->
          <h2 id="wp-exercise-name" class="text-2xl sm:text-4xl font-bold text-white text-center mb-4">Exercise Name</h2>

          <!-- Instructions -->
          <div id="wp-instructions" class="max-w-md text-center space-y-2 text-white/80 text-sm sm:text-base max-h-32 overflow-y-auto"></div>

          <!-- Up Next Preview -->
          <div id="wp-next-preview" class="mt-6 text-white/50 text-sm hidden">
            <span>Up next: </span>
            <span id="wp-next-name" class="text-white/70 font-medium"></span>
          </div>
        </div>

        <!-- Controls -->
        <div class="p-6 bg-black/20">
          <div class="flex items-center justify-center gap-4 sm:gap-8">
            <!-- Previous -->
            <button id="wp-prev" class="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Previous">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            <!-- Play/Pause -->
            <button id="wp-play-pause" class="p-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg id="wp-icon-play" class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg id="wp-icon-pause" class="w-10 h-10 hidden" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            </button>

            <!-- Next -->
            <button id="wp-next" class="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Next">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <!-- Skip rest button -->
          <div id="wp-skip-rest" class="hidden mt-4 text-center">
            <button class="text-white/60 hover:text-white text-sm underline transition-colors">Skip Rest →</button>
          </div>
        </div>

        <!-- Completion Screen -->
        <div id="wp-complete" class="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 flex flex-col items-center justify-center p-6 hidden">
          <div class="text-center">
            <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-2">Workout Complete!</h2>
            <p class="text-white/80 text-lg mb-6">Great job! You crushed it! 💪</p>
            <div class="flex flex-wrap justify-center gap-4 mb-8">
              <div class="bg-white/20 rounded-xl px-6 py-3 text-center">
                <div id="wp-stat-time" class="text-2xl font-bold text-white">0:00</div>
                <div class="text-sm text-white/70">Total Time</div>
              </div>
              <div class="bg-white/20 rounded-xl px-6 py-3 text-center">
                <div id="wp-stat-exercises" class="text-2xl font-bold text-white">0</div>
                <div class="text-sm text-white/70">Exercises</div>
              </div>
            </div>
            <div class="flex flex-wrap justify-center gap-4">
              <button id="wp-restart" class="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                Do It Again
              </button>
              <button id="wp-finish" class="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors">
                Finish
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.overlay = overlay;
    this.cacheElements();
    this.renderDots();
    this.updateDisplay();
  }

  cacheElements() {
    this.elements = {
      overlay: document.getElementById('workout-player-overlay'),
      exit: document.getElementById('wp-exit'),
      sound: document.getElementById('wp-sound'),
      soundOn: document.getElementById('wp-sound-on'),
      soundOff: document.getElementById('wp-sound-off'),
      elapsed: document.getElementById('wp-elapsed'),
      total: document.getElementById('wp-total'),
      progress: document.getElementById('wp-progress'),
      dots: document.getElementById('wp-dots'),
      typeBadge: document.getElementById('wp-type-badge'),
      timerRing: document.getElementById('wp-timer-ring'),
      time: document.getElementById('wp-time'),
      reps: document.getElementById('wp-reps'),
      exerciseName: document.getElementById('wp-exercise-name'),
      instructions: document.getElementById('wp-instructions'),
      nextPreview: document.getElementById('wp-next-preview'),
      nextName: document.getElementById('wp-next-name'),
      prev: document.getElementById('wp-prev'),
      next: document.getElementById('wp-next'),
      playPause: document.getElementById('wp-play-pause'),
      iconPlay: document.getElementById('wp-icon-play'),
      iconPause: document.getElementById('wp-icon-pause'),
      skipRest: document.getElementById('wp-skip-rest'),
      complete: document.getElementById('wp-complete'),
      statTime: document.getElementById('wp-stat-time'),
      statExercises: document.getElementById('wp-stat-exercises'),
      restart: document.getElementById('wp-restart'),
      finish: document.getElementById('wp-finish')
    };
  }

  bindEvents() {
    this.elements.exit.addEventListener('click', () => this.close());
    this.elements.sound.addEventListener('click', () => this.toggleSound());
    this.elements.prev.addEventListener('click', () => this.previous());
    this.elements.next.addEventListener('click', () => this.next());
    this.elements.playPause.addEventListener('click', () => this.togglePlayPause());
    this.elements.skipRest.querySelector('button').addEventListener('click', () => this.next());
    this.elements.restart.addEventListener('click', () => this.restart());
    this.elements.finish.addEventListener('click', () => this.close());

    // Keyboard controls
    this.keyHandler = (e) => {
      if (!this.overlay.classList.contains('hidden')) {
        switch(e.code) {
          case 'Space':
            e.preventDefault();
            this.togglePlayPause();
            break;
          case 'ArrowLeft':
            this.previous();
            break;
          case 'ArrowRight':
            this.next();
            break;
          case 'Escape':
            this.close();
            break;
        }
      }
    };
    document.addEventListener('keydown', this.keyHandler);
  }

  renderDots() {
    this.elements.dots.innerHTML = this.exercises.map((ex, i) => `
      <div class="w-2 h-2 rounded-full transition-all duration-300 ${i === this.currentIndex ? 'bg-white w-4' : 'bg-white/30'}" data-index="${i}"></div>
    `).join('');
  }

  updateDots() {
    const dots = this.elements.dots.querySelectorAll('div');
    dots.forEach((dot, i) => {
      if (i < this.currentIndex) {
        dot.className = 'w-2 h-2 rounded-full transition-all duration-300 bg-green-400';
      } else if (i === this.currentIndex) {
        dot.className = 'w-2 h-2 rounded-full transition-all duration-300 bg-white w-4';
      } else {
        dot.className = 'w-2 h-2 rounded-full transition-all duration-300 bg-white/30';
      }
    });
  }

  updateDisplay() {
    const exercise = this.exercises[this.currentIndex];
    if (!exercise) return;

    // Update exercise info
    this.elements.exerciseName.textContent = exercise.name;
    this.timeRemaining = exercise.duration || 30;

    // Type badge
    const typeColors = {
      warmup: 'bg-yellow-500/20 text-yellow-300',
      exercise: 'bg-pink-500/20 text-pink-300',
      rest: 'bg-blue-500/20 text-blue-300',
      cooldown: 'bg-green-500/20 text-green-300'
    };
    const typeNames = {
      warmup: 'Warm Up',
      exercise: 'Exercise',
      rest: 'Rest',
      cooldown: 'Cool Down'
    };
    const type = exercise.type || 'exercise';
    this.elements.typeBadge.className = `px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${typeColors[type] || typeColors.exercise}`;
    this.elements.typeBadge.textContent = typeNames[type] || 'Exercise';

    // Show/hide skip rest button
    this.elements.skipRest.classList.toggle('hidden', type !== 'rest');

    // Reps
    this.elements.reps.textContent = exercise.reps || '';

    // Instructions
    const instructions = exercise.instructions || [];
    this.elements.instructions.innerHTML = instructions.map(inst => `
      <p class="flex items-start gap-2">
        <svg class="w-4 h-4 mt-0.5 text-pink-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span>${inst}</span>
      </p>
    `).join('');

    // Up next preview
    const nextExercise = this.exercises[this.currentIndex + 1];
    if (nextExercise) {
      this.elements.nextPreview.classList.remove('hidden');
      this.elements.nextName.textContent = nextExercise.name;
    } else {
      this.elements.nextPreview.classList.add('hidden');
    }

    // Update timer display
    this.updateTimer();

    // Update navigation buttons
    this.elements.prev.disabled = this.currentIndex === 0;
    this.elements.next.disabled = this.currentIndex === this.exercises.length - 1;

    // Update dots
    this.updateDots();

    // Update totals
    this.elements.total.textContent = this.formatTime(this.totalTime);
  }

  updateTimer() {
    const exercise = this.exercises[this.currentIndex];
    const duration = exercise.duration || 30;
    const progress = 1 - (this.timeRemaining / duration);
    const circumference = 339.292;

    this.elements.time.textContent = this.formatTime(this.timeRemaining);
    this.elements.timerRing.style.strokeDashoffset = circumference * (1 - progress);

    // Update progress bar
    const totalProgress = this.elapsedTime / this.totalTime;
    this.elements.progress.style.width = `${Math.min(totalProgress * 100, 100)}%`;
    this.elements.elapsed.textContent = this.formatTime(Math.floor(this.elapsedTime));
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  start() {
    this.isRunning = true;
    this.isPaused = false;
    this.updatePlayPauseIcon();
    this.tick();
  }

  pause() {
    this.isPaused = true;
    if (this.timer) {
      cancelAnimationFrame(this.timer);
      this.timer = null;
    }
    this.updatePlayPauseIcon();
  }

  resume() {
    this.isPaused = false;
    this.updatePlayPauseIcon();
    this.lastTick = performance.now();
    this.tick();
  }

  togglePlayPause() {
    if (!this.isRunning) {
      this.start();
    } else if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  updatePlayPauseIcon() {
    const showPause = this.isRunning && !this.isPaused;
    this.elements.iconPlay.classList.toggle('hidden', showPause);
    this.elements.iconPause.classList.toggle('hidden', !showPause);
  }

  tick() {
    if (this.isPaused) return;

    const now = performance.now();
    if (!this.lastTick) this.lastTick = now;

    const delta = (now - this.lastTick) / 1000;
    this.lastTick = now;

    this.timeRemaining -= delta;
    this.elapsedTime += delta;

    // Play beeps in last 3 seconds
    if (this.audioEnabled && this.timeRemaining <= 3 && this.timeRemaining > 0) {
      const secondsLeft = Math.ceil(this.timeRemaining);
      if (Math.abs(this.timeRemaining - secondsLeft) < 0.05) {
        this.playBeep(secondsLeft === 1 ? 880 : 440, 0.1);
      }
    }

    if (this.timeRemaining <= 0) {
      this.playBeep(660, 0.3); // End beep
      if (this.currentIndex < this.exercises.length - 1) {
        this.currentIndex++;
        this.updateDisplay();
        this.lastTick = performance.now();
      } else {
        this.showComplete();
        return;
      }
    }

    this.updateTimer();
    this.timer = requestAnimationFrame(() => this.tick());
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      // Recalculate elapsed time
      this.elapsedTime = this.exercises.slice(0, this.currentIndex).reduce((sum, ex) => sum + (ex.duration || 0), 0);
      this.updateDisplay();
      this.lastTick = performance.now();
    }
  }

  next() {
    if (this.currentIndex < this.exercises.length - 1) {
      // Add remaining time to elapsed
      this.elapsedTime += this.timeRemaining;
      this.currentIndex++;
      this.updateDisplay();
      this.lastTick = performance.now();
    }
  }

  toggleSound() {
    this.audioEnabled = !this.audioEnabled;
    this.elements.soundOn.classList.toggle('hidden', !this.audioEnabled);
    this.elements.soundOff.classList.toggle('hidden', this.audioEnabled);
  }

  playBeep(frequency = 440, duration = 0.1) {
    if (!this.audioEnabled) return;

    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      // Audio not supported
    }
  }

  showComplete() {
    this.isRunning = false;
    if (this.timer) {
      cancelAnimationFrame(this.timer);
      this.timer = null;
    }

    this.elements.statTime.textContent = this.formatTime(this.elapsedTime);
    this.elements.statExercises.textContent = this.exercises.filter(ex => ex.type !== 'rest').length;
    this.elements.complete.classList.remove('hidden');

    // Celebration beeps
    this.playBeep(523, 0.15);
    setTimeout(() => this.playBeep(659, 0.15), 150);
    setTimeout(() => this.playBeep(784, 0.3), 300);
  }

  restart() {
    this.currentIndex = 0;
    this.elapsedTime = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.elements.complete.classList.add('hidden');
    this.updateDisplay();
    this.updatePlayPauseIcon();
  }

  open() {
    this.overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this.updateDisplay();
  }

  close() {
    this.overlay.classList.add('hidden');
    document.body.style.overflow = '';
    this.pause();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  destroy() {
    document.removeEventListener('keydown', this.keyHandler);
    this.close();
    this.overlay.remove();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const beginBtn = document.getElementById('begin-workout-btn');
  const exercisesData = document.getElementById('workout-exercises-data');

  if (beginBtn && exercisesData) {
    try {
      const exercises = JSON.parse(exercisesData.textContent);
      if (exercises && exercises.length > 0) {
        const player = new WorkoutPlayer(exercises);
        beginBtn.addEventListener('click', () => player.open());
      }
    } catch (e) {
      console.error('Failed to initialize workout player:', e);
    }
  }
});
