/**
 * Gorgeous Interactive Workout Player
 * A beautiful full-screen workout timer with exercise guidance,
 * step-by-step instructions, video links, and smooth animations
 */

class WorkoutPlayer {
  constructor(exercises, options = {}) {
    this.exercises = exercises;
    this.workoutTitle = options.workoutTitle || 'Workout';
    this.workoutDescription = options.workoutDescription || '';
    this.followAlongVideo = options.followAlongVideo || null;
    this.relatedVideos = options.relatedVideos || [];
    this.currentIndex = 0;
    this.timeRemaining = 0;
    this.totalTime = 0;
    this.elapsedTime = 0;
    this.isPaused = false;
    this.isRunning = false;
    this.timer = null;
    this.audioEnabled = options.audioEnabled !== false;
    this.showingOverview = true;

    // Calculate total workout time
    this.totalTime = exercises.reduce((sum, ex) => sum + (ex.duration || 30), 0);

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
    overlay.className = 'fixed inset-0 z-[9999] opacity-0 pointer-events-none transition-opacity duration-500';
    overlay.innerHTML = `
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900">
        <!-- Animated background particles -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="wp-particle wp-particle-1"></div>
          <div class="wp-particle wp-particle-2"></div>
          <div class="wp-particle wp-particle-3"></div>
          <div class="wp-particle wp-particle-4"></div>
        </div>
      </div>

      <div class="relative h-full flex flex-col">
        <!-- Header -->
        <header class="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 bg-black/20 backdrop-blur-sm">
          <button id="wp-exit" class="group flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300">
            <span class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </span>
            <span class="hidden sm:inline font-medium">Exit</span>
          </button>

          <div class="flex items-center gap-3">
            <button id="wp-sound" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all" title="Toggle sound">
              <svg id="wp-sound-on" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
              </svg>
              <svg id="wp-sound-off" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
              </svg>
            </button>
          </div>
        </header>

        <!-- Overview Screen -->
        <div id="wp-overview" class="flex-1 flex flex-col overflow-hidden">
          <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            <div class="max-w-2xl mx-auto">
              <!-- Workout Title -->
              <div class="text-center mb-8">
                <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white/80 text-sm mb-4">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>${this.formatTime(this.totalTime)} total</span>
                  <span class="text-white/40">•</span>
                  <span>${this.exercises.length} exercises</span>
                </div>
                <h1 id="wp-workout-title" class="text-3xl sm:text-4xl font-bold text-white mb-3">${this.escapeHtml(this.workoutTitle)}</h1>
                <p id="wp-workout-desc" class="text-white/70 text-lg">${this.escapeHtml(this.workoutDescription)}</p>
              </div>

              <!-- Exercise Preview List -->
              <div class="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden mb-6">
                <div class="p-4 border-b border-white/10">
                  <h2 class="text-white font-semibold flex items-center gap-2">
                    <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    Workout Plan
                  </h2>
                </div>
                <div id="wp-exercise-preview" class="divide-y divide-white/5 max-h-[40vh] overflow-y-auto">
                  ${this.renderExerciseList()}
                </div>
              </div>

              <!-- Video Section -->
              ${this.renderVideoSection()}
            </div>
          </div>

          <!-- Start Button -->
          <div class="flex-shrink-0 p-4 sm:p-6 bg-gradient-to-t from-black/40 to-transparent">
            <div class="max-w-md mx-auto">
              <button id="wp-start-workout" class="w-full group relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-[length:200%_100%] hover:bg-[position:100%_0] text-white font-bold py-4 px-8 rounded-2xl shadow-2xl shadow-pink-500/30 transition-all duration-500 transform hover:scale-[1.02]">
                <span class="relative z-10 flex items-center justify-center gap-3 text-lg">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Start Workout
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
              <p class="text-center text-white/50 text-sm mt-3">Press <kbd class="px-2 py-1 bg-white/10 rounded text-xs">Space</kbd> to pause • <kbd class="px-2 py-1 bg-white/10 rounded text-xs">Esc</kbd> to exit</p>
            </div>
          </div>
        </div>

        <!-- Active Workout Screen -->
        <div id="wp-active" class="flex-1 flex flex-col hidden">
          <!-- Progress Bar -->
          <div class="flex-shrink-0 px-4 sm:px-6 py-3 bg-black/20">
            <div class="flex items-center gap-3 text-white/60 text-sm mb-2">
              <span id="wp-elapsed" class="tabular-nums">0:00</span>
              <div class="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div id="wp-progress" class="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-300" style="width: 0%"></div>
              </div>
              <span id="wp-total" class="tabular-nums">${this.formatTime(this.totalTime)}</span>
            </div>
            <div class="flex justify-center gap-1.5 flex-wrap" id="wp-dots"></div>
          </div>

          <!-- Main Content -->
          <div class="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
            <!-- Exercise Type Badge -->
            <div id="wp-type-badge" class="px-4 py-1.5 rounded-full text-sm font-semibold mb-4 bg-pink-500/20 text-pink-300 transform transition-all duration-500">
              Exercise
            </div>

            <!-- Timer Circle -->
            <div class="relative mb-6 transform transition-all duration-500" id="wp-timer-container">
              <svg class="w-52 h-52 sm:w-72 sm:h-72 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="6"/>
                <circle id="wp-timer-ring" cx="60" cy="60" r="54" fill="none" stroke="url(#timerGradient)" stroke-width="6" stroke-linecap="round" stroke-dasharray="339.292" stroke-dashoffset="0" class="transition-all duration-1000 ease-linear"/>
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#ec4899"/>
                    <stop offset="50%" stop-color="#a855f7"/>
                    <stop offset="100%" stop-color="#ec4899"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span id="wp-time" class="text-6xl sm:text-8xl font-bold tabular-nums tracking-tight">0:00</span>
                <span id="wp-reps" class="text-lg text-white/60 mt-1 font-medium"></span>
              </div>
            </div>

            <!-- Exercise Name -->
            <h2 id="wp-exercise-name" class="text-2xl sm:text-4xl font-bold text-white text-center mb-4 px-4 transition-all duration-500">Exercise Name</h2>

            <!-- Instructions Panel -->
            <div id="wp-instructions-panel" class="w-full max-w-lg bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden mb-4 transition-all duration-500">
              <div class="p-4">
                <h3 class="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  Instructions
                </h3>
                <div id="wp-instructions" class="space-y-2 text-white/80 text-sm max-h-32 overflow-y-auto"></div>
              </div>

              <!-- Video Link -->
              <div id="wp-exercise-video" class="hidden border-t border-white/10">
                <a id="wp-video-link" href="#" target="_blank" rel="noopener" class="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors">
                  <span class="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                      <polygon fill="white" points="9.545,15.568 15.818,12 9.545,8.432"/>
                    </svg>
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="block text-sm font-medium text-white">Watch Tutorial</span>
                    <span id="wp-video-title" class="block text-xs text-white/50 truncate">Video tutorial for this exercise</span>
                  </span>
                  <svg class="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Up Next Preview -->
            <div id="wp-next-preview" class="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full text-white/50 text-sm hidden transition-all duration-500">
              <span>Up next:</span>
              <span id="wp-next-name" class="text-white/80 font-medium"></span>
              <span id="wp-next-duration" class="text-white/40"></span>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex-shrink-0 p-4 sm:p-6 bg-gradient-to-t from-black/40 to-transparent">
            <div class="flex items-center justify-center gap-4 sm:gap-6">
              <!-- Previous -->
              <button id="wp-prev" class="group p-3 sm:p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95" title="Previous (←)">
                <svg class="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>

              <!-- Play/Pause -->
              <button id="wp-play-pause" class="group relative p-6 sm:p-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/60 transition-all duration-300 transform hover:scale-105 active:scale-95">
                <svg id="wp-icon-play" class="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg id="wp-icon-pause" class="w-10 h-10 sm:w-12 sm:h-12 hidden group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
                <div class="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 group-active:opacity-30 transition-opacity"></div>
              </button>

              <!-- Next -->
              <button id="wp-next" class="group p-3 sm:p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95" title="Next (→)">
                <svg class="w-6 h-6 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <!-- Skip rest button -->
            <div id="wp-skip-rest" class="hidden mt-4 text-center">
              <button class="px-6 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm font-medium rounded-full transition-all duration-300">
                Skip Rest →
              </button>
            </div>
          </div>
        </div>

        <!-- Completion Screen -->
        <div id="wp-complete" class="absolute inset-0 flex flex-col items-center justify-center p-6 hidden opacity-0 transition-opacity duration-500">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600"></div>

          <!-- Confetti particles -->
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="wp-confetti wp-confetti-1"></div>
            <div class="wp-confetti wp-confetti-2"></div>
            <div class="wp-confetti wp-confetti-3"></div>
            <div class="wp-confetti wp-confetti-4"></div>
            <div class="wp-confetti wp-confetti-5"></div>
          </div>

          <div class="relative text-center max-w-md">
            <!-- Trophy animation -->
            <div class="w-28 h-28 mx-auto mb-6 relative">
              <div class="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
              <div class="relative w-full h-full rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <svg class="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>

            <h2 class="text-4xl sm:text-5xl font-bold text-white mb-3">Amazing!</h2>
            <p class="text-white/80 text-xl mb-8">You crushed that workout! 💪✨</p>

            <!-- Stats -->
            <div class="flex justify-center gap-4 mb-8">
              <div class="bg-white/20 backdrop-blur rounded-2xl px-6 py-4 text-center min-w-[100px]">
                <div id="wp-stat-time" class="text-3xl font-bold text-white">0:00</div>
                <div class="text-sm text-white/70">Total Time</div>
              </div>
              <div class="bg-white/20 backdrop-blur rounded-2xl px-6 py-4 text-center min-w-[100px]">
                <div id="wp-stat-exercises" class="text-3xl font-bold text-white">0</div>
                <div class="text-sm text-white/70">Exercises</div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row justify-center gap-3">
              <button id="wp-restart" class="px-8 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                🔄 Do It Again
              </button>
              <button id="wp-finish" class="px-8 py-3 bg-white/20 backdrop-blur text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                ✓ Finish
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        /* Particle animations */
        .wp-particle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.3;
          animation: wp-float 20s infinite;
        }
        .wp-particle-1 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%); top: -150px; left: -100px; animation-delay: 0s; }
        .wp-particle-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%); bottom: -200px; right: -150px; animation-delay: -5s; }
        .wp-particle-3 { width: 200px; height: 200px; background: radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%); top: 30%; right: 10%; animation-delay: -10s; }
        .wp-particle-4 { width: 250px; height: 250px; background: radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%); bottom: 20%; left: 5%; animation-delay: -15s; }

        @keyframes wp-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 30px) scale(1.05); }
        }

        /* Confetti animations */
        .wp-confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          opacity: 0;
        }
        #wp-complete:not(.hidden) .wp-confetti {
          animation: wp-confetti-fall 3s ease-out forwards;
        }
        .wp-confetti-1 { background: #f472b6; left: 10%; animation-delay: 0s; }
        .wp-confetti-2 { background: #a78bfa; left: 30%; animation-delay: 0.2s; }
        .wp-confetti-3 { background: #34d399; left: 50%; animation-delay: 0.4s; }
        .wp-confetti-4 { background: #fbbf24; left: 70%; animation-delay: 0.6s; }
        .wp-confetti-5 { background: #60a5fa; left: 90%; animation-delay: 0.8s; }

        @keyframes wp-confetti-fall {
          0% { top: -10%; opacity: 1; transform: rotate(0deg) scale(1); }
          100% { top: 100%; opacity: 0; transform: rotate(720deg) scale(0); }
        }

        /* Pulse animation for countdown */
        .wp-pulse {
          animation: wp-pulse 0.3s ease-out;
        }
        @keyframes wp-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        /* Slide animations */
        .wp-slide-in {
          animation: wp-slide-in 0.5s ease-out forwards;
        }
        @keyframes wp-slide-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    `;

    document.body.appendChild(overlay);
    this.overlay = overlay;
    this.cacheElements();
  }

  renderExerciseList() {
    return this.exercises.map((ex, i) => {
      const typeColors = {
        warmup: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        exercise: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
        rest: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        cooldown: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      };
      const type = ex.type || 'exercise';
      const duration = ex.duration || 30;

      return `
        <div class="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer wp-exercise-item" data-index="${i}">
          <span class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${typeColors[type] || typeColors.exercise} border">
            ${i + 1}
          </span>
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-white truncate">${this.escapeHtml(ex.name)}</h3>
            <div class="flex items-center gap-2 text-xs text-white/50">
              <span>${this.formatTime(duration)}</span>
              ${ex.reps ? `<span class="text-white/30">•</span><span>${this.escapeHtml(ex.reps)}</span>` : ''}
              <span class="text-white/30">•</span>
              <span class="capitalize">${type}</span>
            </div>
          </div>
          ${ex.video_id ? `
            <span class="flex-shrink-0 w-6 h-6 rounded bg-red-500/20 flex items-center justify-center" title="Video available">
              <svg class="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 24 24"><polygon points="9.545,15.568 15.818,12 9.545,8.432"/></svg>
            </span>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  renderVideoSection() {
    if (!this.followAlongVideo && this.relatedVideos.length === 0) return '';

    let html = `
      <div class="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div class="p-4 border-b border-white/10">
          <h2 class="text-white font-semibold flex items-center gap-2">
            <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
              <polygon fill="white" points="9.545,15.568 15.818,12 9.545,8.432"/>
            </svg>
            Follow Along Videos
          </h2>
        </div>
        <div class="p-4 space-y-3">
    `;

    if (this.followAlongVideo) {
      html += `
        <a href="https://www.youtube.com/watch?v=${this.escapeHtml(this.followAlongVideo.id)}" target="_blank" rel="noopener" class="flex gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
          <div class="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-black/20">
            <img src="https://i.ytimg.com/vi/${this.escapeHtml(this.followAlongVideo.id)}/mqdefault.jpg" alt="" class="w-full h-full object-cover" loading="lazy">
            <div class="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <span class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><polygon points="9.545,15.568 15.818,12 9.545,8.432"/></svg>
              </span>
            </div>
            <span class="absolute top-1 left-1 px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">FEATURED</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-white text-sm line-clamp-2 group-hover:text-pink-300 transition-colors">${this.escapeHtml(this.followAlongVideo.title)}</h3>
            <p class="text-white/50 text-xs mt-1">${this.escapeHtml(this.followAlongVideo.channel)}</p>
          </div>
        </a>
      `;
    }

    if (this.relatedVideos.length > 0) {
      html += `<div class="grid gap-2">`;
      for (const video of this.relatedVideos.slice(0, 3)) {
        html += `
          <a href="https://www.youtube.com/watch?v=${this.escapeHtml(video.id)}" target="_blank" rel="noopener" class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
            <div class="relative w-16 h-10 rounded overflow-hidden flex-shrink-0 bg-black/20">
              <img src="https://i.ytimg.com/vi/${this.escapeHtml(video.id)}/mqdefault.jpg" alt="" class="w-full h-full object-cover" loading="lazy">
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="w-6 h-6 bg-red-600/90 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <svg class="w-2.5 h-2.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><polygon points="9.545,15.568 15.818,12 9.545,8.432"/></svg>
                </span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-white/80 text-xs font-medium truncate group-hover:text-white transition-colors">${this.escapeHtml(video.title)}</h3>
              <p class="text-white/40 text-[10px]">${this.escapeHtml(video.channel)}</p>
            </div>
          </a>
        `;
      }
      html += `</div>`;
    }

    html += `</div></div>`;
    return html;
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  cacheElements() {
    this.elements = {
      overlay: document.getElementById('workout-player-overlay'),
      exit: document.getElementById('wp-exit'),
      sound: document.getElementById('wp-sound'),
      soundOn: document.getElementById('wp-sound-on'),
      soundOff: document.getElementById('wp-sound-off'),
      overview: document.getElementById('wp-overview'),
      active: document.getElementById('wp-active'),
      startWorkout: document.getElementById('wp-start-workout'),
      elapsed: document.getElementById('wp-elapsed'),
      total: document.getElementById('wp-total'),
      progress: document.getElementById('wp-progress'),
      dots: document.getElementById('wp-dots'),
      typeBadge: document.getElementById('wp-type-badge'),
      timerContainer: document.getElementById('wp-timer-container'),
      timerRing: document.getElementById('wp-timer-ring'),
      time: document.getElementById('wp-time'),
      reps: document.getElementById('wp-reps'),
      exerciseName: document.getElementById('wp-exercise-name'),
      instructionsPanel: document.getElementById('wp-instructions-panel'),
      instructions: document.getElementById('wp-instructions'),
      exerciseVideo: document.getElementById('wp-exercise-video'),
      videoLink: document.getElementById('wp-video-link'),
      videoTitle: document.getElementById('wp-video-title'),
      nextPreview: document.getElementById('wp-next-preview'),
      nextName: document.getElementById('wp-next-name'),
      nextDuration: document.getElementById('wp-next-duration'),
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
    this.elements.startWorkout.addEventListener('click', () => this.startWorkout());
    this.elements.prev.addEventListener('click', () => this.previous());
    this.elements.next.addEventListener('click', () => this.next());
    this.elements.playPause.addEventListener('click', () => this.togglePlayPause());
    this.elements.skipRest.querySelector('button').addEventListener('click', () => this.next());
    this.elements.restart.addEventListener('click', () => this.restart());
    this.elements.finish.addEventListener('click', () => this.close());

    // Exercise item clicks in overview
    const exerciseItems = this.overlay.querySelectorAll('.wp-exercise-item');
    exerciseItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        this.currentIndex = index;
        this.elapsedTime = this.exercises.slice(0, index).reduce((sum, ex) => sum + (ex.duration || 30), 0);
        this.startWorkout();
      });
    });

    // Keyboard controls
    this.keyHandler = (e) => {
      if (this.overlay.classList.contains('pointer-events-none')) return;

      switch(e.code) {
        case 'Space':
          e.preventDefault();
          if (this.showingOverview) {
            this.startWorkout();
          } else {
            this.togglePlayPause();
          }
          break;
        case 'ArrowLeft':
          if (!this.showingOverview) this.previous();
          break;
        case 'ArrowRight':
          if (!this.showingOverview) this.next();
          break;
        case 'Escape':
          this.close();
          break;
      }
    };
    document.addEventListener('keydown', this.keyHandler);
  }

  renderDots() {
    this.elements.dots.innerHTML = this.exercises.map((ex, i) => {
      const type = ex.type || 'exercise';
      const colors = {
        warmup: 'bg-amber-400',
        exercise: 'bg-pink-400',
        rest: 'bg-blue-400',
        cooldown: 'bg-emerald-400'
      };
      return `<div class="w-2 h-2 rounded-full transition-all duration-300 ${i === this.currentIndex ? `${colors[type] || colors.exercise} w-6` : 'bg-white/30'}" data-index="${i}"></div>`;
    }).join('');
  }

  updateDots() {
    const dots = this.elements.dots.querySelectorAll('div');
    dots.forEach((dot, i) => {
      const ex = this.exercises[i];
      const type = ex?.type || 'exercise';
      const colors = {
        warmup: 'bg-amber-400',
        exercise: 'bg-pink-400',
        rest: 'bg-blue-400',
        cooldown: 'bg-emerald-400'
      };

      if (i < this.currentIndex) {
        dot.className = 'w-2 h-2 rounded-full transition-all duration-300 bg-green-400';
      } else if (i === this.currentIndex) {
        dot.className = `w-6 h-2 rounded-full transition-all duration-300 ${colors[type] || colors.exercise}`;
      } else {
        dot.className = 'w-2 h-2 rounded-full transition-all duration-300 bg-white/30';
      }
    });
  }

  updateDisplay() {
    const exercise = this.exercises[this.currentIndex];
    if (!exercise) return;

    // Update exercise info with animation
    this.elements.exerciseName.style.opacity = '0';
    this.elements.exerciseName.style.transform = 'translateY(10px)';

    setTimeout(() => {
      this.elements.exerciseName.textContent = exercise.name;
      this.elements.exerciseName.style.opacity = '1';
      this.elements.exerciseName.style.transform = 'translateY(0)';
    }, 150);

    this.timeRemaining = exercise.duration || 30;

    // Type badge
    const typeColors = {
      warmup: 'bg-amber-500/20 text-amber-300',
      exercise: 'bg-pink-500/20 text-pink-300',
      rest: 'bg-blue-500/20 text-blue-300',
      cooldown: 'bg-emerald-500/20 text-emerald-300'
    };
    const typeNames = {
      warmup: '🔥 Warm Up',
      exercise: '💪 Exercise',
      rest: '😌 Rest',
      cooldown: '🧘 Cool Down'
    };
    const type = exercise.type || 'exercise';
    this.elements.typeBadge.className = `px-4 py-1.5 rounded-full text-sm font-semibold mb-4 transform transition-all duration-500 ${typeColors[type] || typeColors.exercise}`;
    this.elements.typeBadge.textContent = typeNames[type] || 'Exercise';

    // Show/hide skip rest button
    this.elements.skipRest.classList.toggle('hidden', type !== 'rest');

    // Reps
    this.elements.reps.textContent = exercise.reps || '';

    // Instructions
    const instructions = exercise.instructions || [];
    this.elements.instructions.innerHTML = instructions.map((inst, i) => `
      <div class="flex items-start gap-2 p-2 rounded-lg ${i === 0 ? 'bg-white/5' : ''}">
        <span class="flex-shrink-0 w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-xs font-bold text-pink-300">${i + 1}</span>
        <span class="text-white/80">${this.escapeHtml(inst)}</span>
      </div>
    `).join('');

    // Video link for this exercise
    if (exercise.video_id) {
      this.elements.exerciseVideo.classList.remove('hidden');
      this.elements.videoLink.href = `https://www.youtube.com/watch?v=${exercise.video_id}`;
      this.elements.videoTitle.textContent = exercise.video_title || `${exercise.name} tutorial`;
    } else {
      this.elements.exerciseVideo.classList.add('hidden');
    }

    // Up next preview
    const nextExercise = this.exercises[this.currentIndex + 1];
    if (nextExercise) {
      this.elements.nextPreview.classList.remove('hidden');
      this.elements.nextName.textContent = nextExercise.name;
      this.elements.nextDuration.textContent = `(${this.formatTime(nextExercise.duration || 30)})`;
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
    const duration = exercise?.duration || 30;
    const progress = 1 - (this.timeRemaining / duration);
    const circumference = 339.292;

    this.elements.time.textContent = this.formatTime(Math.ceil(this.timeRemaining));
    this.elements.timerRing.style.strokeDashoffset = circumference * (1 - progress);

    // Update progress bar
    const totalProgress = this.elapsedTime / this.totalTime;
    this.elements.progress.style.width = `${Math.min(totalProgress * 100, 100)}%`;
    this.elements.elapsed.textContent = this.formatTime(Math.floor(this.elapsedTime));

    // Pulse effect in last 3 seconds
    if (this.timeRemaining <= 3 && this.timeRemaining > 0) {
      this.elements.timerContainer.classList.add('wp-pulse');
      setTimeout(() => this.elements.timerContainer.classList.remove('wp-pulse'), 300);
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  startWorkout() {
    this.showingOverview = false;
    this.elements.overview.classList.add('hidden');
    this.elements.active.classList.remove('hidden');
    this.renderDots();
    this.updateDisplay();

    // Auto-start after a brief delay
    setTimeout(() => this.start(), 500);
  }

  start() {
    this.isRunning = true;
    this.isPaused = false;
    this.updatePlayPauseIcon();
    this.lastTick = performance.now();
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
        this.playBeep(secondsLeft === 1 ? 880 : 440, 0.15);
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
      this.elapsedTime = this.exercises.slice(0, this.currentIndex).reduce((sum, ex) => sum + (ex.duration || 30), 0);
      this.updateDisplay();
      this.lastTick = performance.now();
    }
  }

  next() {
    if (this.currentIndex < this.exercises.length - 1) {
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
    setTimeout(() => {
      this.elements.complete.classList.add('opacity-100');
    }, 50);

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
    this.showingOverview = true;

    this.elements.complete.classList.add('opacity-0');
    setTimeout(() => {
      this.elements.complete.classList.add('hidden');
      this.elements.active.classList.add('hidden');
      this.elements.overview.classList.remove('hidden');
    }, 300);

    this.updatePlayPauseIcon();
  }

  open() {
    this.overlay.classList.remove('pointer-events-none');
    this.overlay.classList.remove('opacity-0');
    this.overlay.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.overlay.classList.add('opacity-0');
    this.overlay.classList.add('pointer-events-none');
    this.overlay.classList.remove('opacity-100');
    document.body.style.overflow = '';
    this.pause();

    // Reset state after animation
    setTimeout(() => {
      this.currentIndex = 0;
      this.elapsedTime = 0;
      this.isRunning = false;
      this.isPaused = false;
      this.showingOverview = true;
      this.elements.complete.classList.add('hidden');
      this.elements.complete.classList.remove('opacity-100');
      this.elements.active.classList.add('hidden');
      this.elements.overview.classList.remove('hidden');
      this.updatePlayPauseIcon();
    }, 500);

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
        // Get workout metadata from the page
        const workoutTitle = document.querySelector('h1')?.textContent || 'Workout';
        const workoutDesc = document.querySelector('article p.text-xl')?.textContent || '';

        // Try to get video data from the page
        let followAlongVideo = null;
        let relatedVideos = [];

        // Look for video data in the page (if embedded)
        const followAlongEl = document.querySelector('[data-follow-along-video]');
        if (followAlongEl) {
          try {
            followAlongVideo = JSON.parse(followAlongEl.dataset.followAlongVideo);
          } catch (e) {}
        }

        const relatedEl = document.querySelector('[data-related-videos]');
        if (relatedEl) {
          try {
            relatedVideos = JSON.parse(relatedEl.dataset.relatedVideos);
          } catch (e) {}
        }

        const player = new WorkoutPlayer(exercises, {
          workoutTitle,
          workoutDescription: workoutDesc,
          followAlongVideo,
          relatedVideos
        });

        beginBtn.addEventListener('click', (e) => {
          e.preventDefault();
          player.open();
        });

        // Make player globally accessible for debugging
        window.workoutPlayer = player;
      }
    } catch (e) {
      console.error('Failed to initialize workout player:', e);
    }
  }
});
