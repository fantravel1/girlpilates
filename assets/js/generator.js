/**
 * GirlPilates Workout Generator
 * Client-side workout builder with bilingual support
 */

class WorkoutGenerator {
  constructor(exercises, lang = 'en') {
    this.exercises = exercises || [];
    this.lang = lang;
    this.difficultyLevels = {
      beginner: 1,
      principiante: 1,
      intermediate: 2,
      intermedio: 2,
      advanced: 3,
      avanzado: 3,
    };
    // Map focus areas to muscle groups in data
    this.focusMapping = {
      full_body: ['full_body', 'core', 'legs', 'arms', 'back', 'glutes'],
      core: ['core', 'abs', 'obliques'],
      legs: ['legs', 'glutes', 'hamstrings', 'quadriceps', 'inner-thighs', 'hips'],
      back: ['back', 'spine', 'shoulders'],
      arms: ['arms', 'shoulders', 'chest', 'biceps', 'triceps'],
      glutes: ['glutes', 'hips', 'legs'],
    };
  }

  generate({ duration = 30, equipment = ['mat'], difficulty = 'beginner', focus = 'full_body' }) {
    const focusMuscles = this.focusMapping[focus] || this.focusMapping.full_body;

    // Filter exercises based on criteria
    let pool = this.exercises.filter((ex) => {
      const hasEquipment = ex.equipment.some((e) => equipment.includes(e));
      const matchesDifficulty = this.difficultyMatch(ex.difficulty, difficulty);
      const matchesFocus = focus === 'full_body' ||
        ex.muscles?.some(m => focusMuscles.includes(m));
      return hasEquipment && matchesDifficulty && matchesFocus;
    });

    if (pool.length === 0) {
      // Try without focus filter as fallback
      pool = this.exercises.filter((ex) => {
        const hasEquipment = ex.equipment.some((e) => equipment.includes(e));
        const matchesDifficulty = this.difficultyMatch(ex.difficulty, difficulty);
        return hasEquipment && matchesDifficulty;
      });
    }

    if (pool.length === 0) {
      const message = this.lang === 'es'
        ? 'No se encontraron ejercicios. Intenta ajustar tus filtros.'
        : 'No exercises match your criteria. Try adjusting your filters.';
      return {
        exercises: [],
        totalDuration: 0,
        message,
      };
    }

    const targetTime = duration * 60; // Convert to seconds
    let workout = [];
    let totalTime = 0;
    let usedIds = new Set();

    // Add warm-up exercises first (aim for 1-2)
    const warmups = pool.filter((e) => e.tags?.includes('warmup') && !usedIds.has(e.id));
    const numWarmups = Math.min(duration < 20 ? 1 : 2, warmups.length);

    for (let i = 0; i < numWarmups && warmups.length > 0; i++) {
      const warmup = this.randomPick(warmups.filter(w => !usedIds.has(w.id)));
      if (warmup) {
        workout.push({ ...warmup, category: 'warmup' });
        totalTime += warmup.duration || 60;
        usedIds.add(warmup.id);
      }
    }

    // Build main workout (target ~80% of duration for main exercises)
    const mainTargetTime = targetTime * 0.80;
    const mainPool = pool.filter((e) =>
      !e.tags?.includes('cooldown') &&
      !e.tags?.includes('warmup') &&
      !usedIds.has(e.id)
    );

    // Shuffle the pool for variety
    const shuffledPool = this.shuffle([...mainPool]);

    for (const exercise of shuffledPool) {
      if (totalTime >= mainTargetTime) break;
      if (usedIds.has(exercise.id)) continue;

      workout.push({ ...exercise, category: 'main' });
      totalTime += exercise.duration || 60;
      usedIds.add(exercise.id);
    }

    // Add cooldown exercises (1-2)
    const cooldowns = this.exercises.filter((e) =>
      e.tags?.includes('cooldown') &&
      !usedIds.has(e.id) &&
      e.equipment.some(eq => equipment.includes(eq))
    );
    const numCooldowns = Math.min(duration < 20 ? 1 : 2, cooldowns.length);

    for (let i = 0; i < numCooldowns && cooldowns.length > 0; i++) {
      const cooldown = this.randomPick(cooldowns.filter(c => !usedIds.has(c.id)));
      if (cooldown) {
        workout.push({ ...cooldown, category: 'cooldown' });
        totalTime += cooldown.duration || 60;
        usedIds.add(cooldown.id);
      }
    }

    return {
      exercises: workout,
      totalDuration: Math.ceil(totalTime / 60),
      equipment,
      difficulty,
      focus,
    };
  }

  difficultyMatch(exerciseDiff, targetDiff) {
    const exLevel = this.difficultyLevels[exerciseDiff?.toLowerCase()] || 1;
    const targetLevel = this.difficultyLevels[targetDiff?.toLowerCase()] || 1;
    return exLevel <= targetLevel;
  }

  randomPick(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

// Detect language from URL
function detectLanguage() {
  return window.location.pathname.startsWith('/es/') ? 'es' : 'en';
}

// Get localized text
function getText(key, lang) {
  const texts = {
    en: {
      yourWorkout: 'Your Workout',
      minutes: 'minutes',
      exercises: 'exercises',
      printWorkout: 'Print Workout',
      warmup: 'Warm-up',
      cooldown: 'Cool-down',
      min: 'min',
      tip: 'Tip',
      tipText: 'Take 30-60 seconds rest between exercises. Focus on form over speed.',
      noExercises: 'No exercises found. Try different filters.',
      generateNew: 'Generate New',
    },
    es: {
      yourWorkout: 'Tu Entrenamiento',
      minutes: 'minutos',
      exercises: 'ejercicios',
      printWorkout: 'Imprimir',
      warmup: 'Calentamiento',
      cooldown: 'Enfriamiento',
      min: 'min',
      tip: 'Consejo',
      tipText: 'Descansa 30-60 segundos entre ejercicios. Enfócate en la forma, no en la velocidad.',
      noExercises: 'No se encontraron ejercicios. Intenta con otros filtros.',
      generateNew: 'Generar Nuevo',
    },
  };
  return texts[lang]?.[key] || texts.en[key];
}

// Initialize generator with exercises data
async function initGenerator() {
  const generatorForm = document.getElementById('workout-generator');
  const resultsContainer = document.getElementById('workout-results');
  const regenerateBtn = document.getElementById('regenerate-btn');

  if (!generatorForm || !resultsContainer) return;

  const lang = detectLanguage();
  let exercises = [];

  // Load exercises data
  try {
    const response = await fetch('/data/exercises.json');
    if (response.ok) {
      const data = await response.json();
      exercises = data.exercises || [];
    } else {
      throw new Error('Failed to load exercises');
    }
  } catch (error) {
    console.log('Using embedded exercises');
    exercises = getEmbeddedExercises();
  }

  const generator = new WorkoutGenerator(exercises, lang);
  let currentOptions = null;

  // Handle form submission
  function handleGenerate(e) {
    if (e) e.preventDefault();

    const formData = new FormData(generatorForm);
    const equipmentValues = formData.getAll('equipment');

    currentOptions = {
      duration: parseInt(formData.get('duration')) || 30,
      equipment: equipmentValues.length > 0 ? equipmentValues : ['mat'],
      difficulty: formData.get('difficulty') || 'beginner',
      focus: formData.get('focus') || 'full_body',
    };

    const workout = generator.generate(currentOptions);
    displayWorkout(workout, resultsContainer, lang);

    // Show regenerate button
    if (regenerateBtn) {
      regenerateBtn.classList.remove('hidden');
    }
  }

  generatorForm.addEventListener('submit', handleGenerate);

  if (regenerateBtn) {
    regenerateBtn.addEventListener('click', handleGenerate);
  }
}

function displayWorkout(workout, container, lang) {
  if (!workout.exercises || workout.exercises.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <p class="text-gray-500">${workout.message || getText('noExercises', lang)}</p>
      </div>
    `;
    return;
  }

  const exerciseHTML = workout.exercises
    .map((ex, index) => {
      const title = lang === 'es' && ex.title_es ? ex.title_es : ex.title;
      const description = lang === 'es' && ex.description_es ? ex.description_es : ex.description;
      const diffLabel = ex.difficulty?.charAt(0).toUpperCase() + ex.difficulty?.slice(1) || '';

      return `
      <div class="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
        <span class="flex-shrink-0 w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">
          ${index + 1}
        </span>
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <h3 class="font-semibold text-gray-900">${title}</h3>
            ${ex.category === 'warmup' ? `<span class="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">${getText('warmup', lang)}</span>` : ''}
            ${ex.category === 'cooldown' ? `<span class="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">${getText('cooldown', lang)}</span>` : ''}
          </div>
          <p class="text-sm text-gray-600 mb-2">${description || ''}</p>
          <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              ${Math.ceil((ex.duration || 60) / 60)} ${getText('min', lang)}
            </span>
            <span class="px-2 py-0.5 bg-gray-100 rounded">${diffLabel}</span>
          </div>
        </div>
      </div>
    `;
    })
    .join('');

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">${getText('yourWorkout', lang)}</h2>
          <p class="text-gray-600">${workout.totalDuration} ${getText('minutes', lang)} • ${workout.exercises.length} ${getText('exercises', lang)}</p>
        </div>
        <button onclick="window.print()" class="btn btn-secondary text-sm py-2 px-4 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          ${getText('printWorkout', lang)}
        </button>
      </div>

      <div class="space-y-3">
        ${exerciseHTML}
      </div>

      <div class="bg-pink-50 rounded-xl p-4 border border-pink-100">
        <p class="text-sm text-pink-700">
          <strong>${getText('tip', lang)}:</strong> ${getText('tipText', lang)}
        </p>
      </div>
    </div>
  `;
}

// Comprehensive embedded exercises for fallback
function getEmbeddedExercises() {
  return [
    // Mat Warmups
    { id: 'hundred', title: 'The Hundred', title_es: 'El Cien', description: 'Classic Pilates warm-up for core activation', description_es: 'Calentamiento clásico de Pilates para activación del core', difficulty: 'beginner', equipment: ['mat'], muscles: ['core', 'abs'], duration: 120, tags: ['warmup', 'classic'] },
    { id: 'pelvic-curl', title: 'Pelvic Curl', title_es: 'Curl Pélvico', description: 'Warm up the spine by rolling up and down', description_es: 'Calienta la columna rodando hacia arriba y abajo', difficulty: 'beginner', equipment: ['mat'], muscles: ['core', 'spine', 'glutes'], duration: 90, tags: ['warmup'] },
    { id: 'chest-lift', title: 'Chest Lift', title_es: 'Elevación de Pecho', description: 'Basic abdominal curl focusing on core engagement', description_es: 'Curl abdominal básico enfocado en el core', difficulty: 'beginner', equipment: ['mat'], muscles: ['core', 'abs'], duration: 60, tags: ['warmup'] },
    { id: 'cat-cow', title: 'Cat-Cow Stretch', title_es: 'Estiramiento Gato-Vaca', description: 'Alternate between arching and rounding the spine', description_es: 'Alterna entre arquear y redondear la columna', difficulty: 'beginner', equipment: ['mat'], muscles: ['spine', 'back'], duration: 60, tags: ['warmup', 'stretch'] },

    // Mat Main Exercises
    { id: 'roll-up', title: 'Roll Up', title_es: 'Roll Up', description: 'Articulate through the spine as you roll up', description_es: 'Articula a través de la columna mientras subes', difficulty: 'intermediate', equipment: ['mat'], muscles: ['core', 'spine', 'abs'], duration: 90, tags: ['classic'] },
    { id: 'single-leg-circles', title: 'Single Leg Circles', title_es: 'Círculos de Una Pierna', description: 'Circle one leg while keeping pelvis stable', description_es: 'Haz círculos con una pierna manteniendo la pelvis estable', difficulty: 'beginner', equipment: ['mat'], muscles: ['core', 'hips', 'legs'], duration: 60, tags: ['classic'] },
    { id: 'rolling-like-ball', title: 'Rolling Like a Ball', title_es: 'Rodar Como Pelota', description: 'Roll back and forth maintaining balance', description_es: 'Rueda adelante y atrás manteniendo el equilibrio', difficulty: 'beginner', equipment: ['mat'], muscles: ['core', 'spine'], duration: 60, tags: ['classic'] },
    { id: 'single-leg-stretch', title: 'Single Leg Stretch', title_es: 'Estiramiento de Una Pierna', description: 'Alternate pulling one knee in while extending the other', description_es: 'Alterna llevando una rodilla mientras extiendes la otra', difficulty: 'beginner', equipment: ['mat'], muscles: ['core', 'abs'], duration: 90, tags: ['classic'] },
    { id: 'double-leg-stretch', title: 'Double Leg Stretch', title_es: 'Estiramiento de Dos Piernas', description: 'Extend arms and legs simultaneously', description_es: 'Extiende brazos y piernas simultáneamente', difficulty: 'intermediate', equipment: ['mat'], muscles: ['core', 'abs', 'full_body'], duration: 90, tags: ['classic'] },
    { id: 'criss-cross', title: 'Criss Cross', title_es: 'Criss Cross', description: 'Rotate torso to bring elbow toward opposite knee', description_es: 'Rota el torso para llevar el codo hacia la rodilla opuesta', difficulty: 'intermediate', equipment: ['mat'], muscles: ['core', 'obliques'], duration: 90, tags: ['classic'] },
    { id: 'spine-stretch', title: 'Spine Stretch Forward', title_es: 'Estiramiento de Columna', description: 'Round forward over straight legs', description_es: 'Redondea hacia adelante sobre piernas rectas', difficulty: 'beginner', equipment: ['mat'], muscles: ['spine', 'hamstrings'], duration: 60, tags: ['classic', 'stretch'] },
    { id: 'saw', title: 'Saw', title_es: 'La Sierra', description: 'Twist and reach opposite hand toward foot', description_es: 'Gira y estira la mano opuesta hacia el pie', difficulty: 'intermediate', equipment: ['mat'], muscles: ['spine', 'obliques', 'hamstrings'], duration: 60, tags: ['classic'] },
    { id: 'swan', title: 'Swan', title_es: 'El Cisne', description: 'Lift chest and extend spine', description_es: 'Eleva el pecho y extiende la columna', difficulty: 'intermediate', equipment: ['mat'], muscles: ['back', 'spine', 'shoulders'], duration: 60, tags: ['classic', 'back-extension'] },
    { id: 'swimming', title: 'Swimming', title_es: 'Natación', description: 'Alternate lifting opposite arm and leg', description_es: 'Alterna elevar brazo y pierna opuestos', difficulty: 'intermediate', equipment: ['mat'], muscles: ['back', 'glutes', 'shoulders'], duration: 60, tags: ['classic'] },
    { id: 'plank', title: 'Plank', title_es: 'Plancha', description: 'Hold body in straight line', description_es: 'Mantén el cuerpo en línea recta', difficulty: 'beginner', equipment: ['mat'], muscles: ['core', 'arms', 'shoulders', 'full_body'], duration: 60, tags: ['strength'] },
    { id: 'side-kick', title: 'Side Kick Front/Back', title_es: 'Patada Lateral', description: 'Kick leg forward and back while on side', description_es: 'Patea la pierna adelante y atrás de lado', difficulty: 'beginner', equipment: ['mat'], muscles: ['legs', 'hips', 'glutes'], duration: 60, tags: ['classic'] },
    { id: 'teaser', title: 'Teaser', title_es: 'Teaser', description: 'Roll up to V-sit with legs at 45 degrees', description_es: 'Rueda hasta V-sit con piernas a 45 grados', difficulty: 'advanced', equipment: ['mat'], muscles: ['core', 'abs'], duration: 90, tags: ['classic', 'advanced'] },
    { id: 'shoulder-bridge', title: 'Shoulder Bridge', title_es: 'Puente de Hombros', description: 'Hold bridge and kick one leg', description_es: 'Mantén el puente y patea una pierna', difficulty: 'intermediate', equipment: ['mat'], muscles: ['core', 'glutes', 'legs'], duration: 90, tags: ['classic'] },

    // Mat Cooldowns
    { id: 'mermaid', title: 'Mermaid Stretch', title_es: 'Estiramiento Sirena', description: 'Seated side stretch', description_es: 'Estiramiento lateral sentada', difficulty: 'beginner', equipment: ['mat'], muscles: ['obliques', 'spine'], duration: 60, tags: ['stretch', 'cooldown'] },
    { id: 'child-pose', title: "Child's Pose", title_es: 'Postura del Niño', description: 'Rest position with arms extended', description_es: 'Posición de descanso con brazos extendidos', difficulty: 'beginner', equipment: ['mat'], muscles: ['spine', 'back'], duration: 60, tags: ['stretch', 'cooldown'] },
    { id: 'spinal-twist', title: 'Spinal Twist Stretch', title_es: 'Giro Espinal', description: 'Lying twist to stretch spine', description_es: 'Giro acostada para estirar la columna', difficulty: 'beginner', equipment: ['mat'], muscles: ['spine', 'obliques'], duration: 60, tags: ['stretch', 'cooldown'] },
    { id: 'seal', title: 'Seal', title_es: 'Foca', description: 'Roll back and forth clapping heels', description_es: 'Rueda aplaudiendo los talones', difficulty: 'beginner', equipment: ['mat'], muscles: ['core', 'spine'], duration: 60, tags: ['classic', 'cooldown'] },

    // Ball Exercises
    { id: 'ball-bridge', title: 'Ball Bridge', title_es: 'Puente con Pelota', description: 'Bridge with feet on stability ball', description_es: 'Puente con pies en la pelota', difficulty: 'intermediate', equipment: ['ball'], muscles: ['core', 'glutes', 'hamstrings'], duration: 90, tags: ['warmup'] },
    { id: 'ball-crunch', title: 'Ball Crunch', title_es: 'Crunch con Pelota', description: 'Ab curls with back on ball', description_es: 'Curls abdominales con espalda en la pelota', difficulty: 'beginner', equipment: ['ball'], muscles: ['core', 'abs'], duration: 60, tags: [] },
    { id: 'ball-plank', title: 'Ball Plank', title_es: 'Plancha con Pelota', description: 'Plank with forearms on ball', description_es: 'Plancha con antebrazos en la pelota', difficulty: 'intermediate', equipment: ['ball'], muscles: ['core', 'shoulders', 'full_body'], duration: 60, tags: ['strength'] },
    { id: 'ball-back-ext', title: 'Ball Back Extension', title_es: 'Extensión con Pelota', description: 'Back extension draped over ball', description_es: 'Extensión de espalda sobre la pelota', difficulty: 'beginner', equipment: ['ball'], muscles: ['back', 'spine', 'glutes'], duration: 60, tags: [] },
    { id: 'ball-hamstring', title: 'Ball Hamstring Curl', title_es: 'Curl de Isquiotibiales', description: 'Curl ball toward glutes from bridge', description_es: 'Enrolla la pelota hacia los glúteos', difficulty: 'intermediate', equipment: ['ball'], muscles: ['hamstrings', 'glutes', 'core'], duration: 60, tags: ['legs'] },
    { id: 'ball-side-stretch', title: 'Ball Side Stretch', title_es: 'Estiramiento Lateral con Pelota', description: 'Side stretch draped over ball', description_es: 'Estiramiento lateral sobre la pelota', difficulty: 'beginner', equipment: ['ball'], muscles: ['obliques', 'spine'], duration: 60, tags: ['stretch', 'cooldown'] },

    // Ring Exercises
    { id: 'ring-chest', title: 'Ring Chest Squeeze', title_es: 'Apretar Pecho con Aro', description: 'Squeeze ring between palms', description_es: 'Aprieta el aro entre las palmas', difficulty: 'beginner', equipment: ['ring'], muscles: ['chest', 'arms'], duration: 60, tags: ['warmup', 'arms'] },
    { id: 'ring-thigh', title: 'Ring Inner Thigh Squeeze', title_es: 'Apretar Muslo con Aro', description: 'Squeeze ring between inner thighs', description_es: 'Aprieta el aro entre los muslos', difficulty: 'beginner', equipment: ['ring'], muscles: ['inner-thighs', 'core'], duration: 60, tags: ['legs'] },
    { id: 'ring-bridge', title: 'Ring Bridge', title_es: 'Puente con Aro', description: 'Bridge while squeezing ring', description_es: 'Puente mientras aprietas el aro', difficulty: 'beginner', equipment: ['ring'], muscles: ['glutes', 'inner-thighs', 'core'], duration: 60, tags: [] },
    { id: 'ring-hundred', title: 'Ring Hundred', title_es: 'El Cien con Aro', description: 'The Hundred with ring between ankles', description_es: 'El Cien con aro entre los tobillos', difficulty: 'intermediate', equipment: ['ring'], muscles: ['core', 'abs', 'inner-thighs'], duration: 120, tags: ['warmup', 'classic'] },
    { id: 'ring-arm', title: 'Ring Arm Press', title_es: 'Presión de Brazos con Aro', description: 'Press ring overhead', description_es: 'Presiona el aro sobre la cabeza', difficulty: 'beginner', equipment: ['ring'], muscles: ['arms', 'shoulders'], duration: 60, tags: ['arms'] },
    { id: 'ring-stretch', title: 'Ring Overhead Stretch', title_es: 'Estiramiento con Aro', description: 'Side stretch with ring overhead', description_es: 'Estiramiento lateral con aro', difficulty: 'beginner', equipment: ['ring'], muscles: ['obliques', 'shoulders'], duration: 60, tags: ['stretch', 'cooldown'] },

    // Band Exercises
    { id: 'band-row', title: 'Band Seated Row', title_es: 'Remo con Banda', description: 'Row band toward waist', description_es: 'Rema la banda hacia la cintura', difficulty: 'beginner', equipment: ['band'], muscles: ['back', 'arms'], duration: 60, tags: ['warmup', 'arms'] },
    { id: 'band-bicep', title: 'Band Bicep Curl', title_es: 'Curl de Bíceps con Banda', description: 'Curl with band resistance', description_es: 'Curl con resistencia de banda', difficulty: 'beginner', equipment: ['band'], muscles: ['arms', 'biceps'], duration: 60, tags: ['arms'] },
    { id: 'band-squat', title: 'Band Squat', title_es: 'Sentadilla con Banda', description: 'Squat with band around thighs', description_es: 'Sentadilla con banda en los muslos', difficulty: 'beginner', equipment: ['band'], muscles: ['legs', 'glutes'], duration: 60, tags: ['legs'] },
    { id: 'band-clamshell', title: 'Band Clamshell', title_es: 'Almeja con Banda', description: 'Clamshell with band resistance', description_es: 'Almeja con resistencia de banda', difficulty: 'beginner', equipment: ['band'], muscles: ['glutes', 'hips'], duration: 60, tags: ['legs'] },
    { id: 'band-lateral', title: 'Band Lateral Walk', title_es: 'Caminata Lateral con Banda', description: 'Side steps with band around thighs', description_es: 'Pasos laterales con banda', difficulty: 'beginner', equipment: ['band'], muscles: ['glutes', 'hips'], duration: 60, tags: ['legs', 'warmup'] },
    { id: 'band-stretch', title: 'Band Hamstring Stretch', title_es: 'Estiramiento con Banda', description: 'Use band to stretch hamstrings', description_es: 'Usa la banda para estirar isquiotibiales', difficulty: 'beginner', equipment: ['band'], muscles: ['hamstrings'], duration: 60, tags: ['stretch', 'cooldown'] },
  ];
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initGenerator);
