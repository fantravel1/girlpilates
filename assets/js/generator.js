/**
 * GirlPilates Workout Generator
 * Client-side workout builder with no external dependencies
 */

class WorkoutGenerator {
  constructor(exercises) {
    this.exercises = exercises || [];
    this.difficultyLevels = {
      beginner: 1,
      principiante: 1,
      intermediate: 2,
      intermedio: 2,
      advanced: 3,
      avanzado: 3,
    };
  }

  generate({ duration = 30, equipment = ['mat'], difficulty = 'beginner', focus = 'full_body' }) {
    // Filter exercises based on criteria
    let pool = this.exercises.filter((ex) => {
      const hasEquipment = ex.equipment.some((e) => equipment.includes(e));
      const matchesDifficulty = this.difficultyMatch(ex.difficulty, difficulty);
      const matchesFocus = focus === 'full_body' || ex.muscles?.includes(focus);
      return hasEquipment && matchesDifficulty && matchesFocus;
    });

    if (pool.length === 0) {
      return {
        exercises: [],
        totalDuration: 0,
        message: 'No exercises match your criteria. Try adjusting your filters.',
      };
    }

    const targetTime = duration * 60; // Convert to seconds
    let workout = [];
    let totalTime = 0;

    // Add warm-up exercises first
    const warmups = pool.filter((e) => e.tags?.includes('warmup'));
    if (warmups.length > 0) {
      const warmup = this.randomPick(warmups);
      workout.push({ ...warmup, category: 'warmup' });
      totalTime += warmup.duration || 60;
      pool = pool.filter((e) => e.id !== warmup.id);
    }

    // Build main workout
    const mainExercises = pool.filter((e) => !e.tags?.includes('cooldown'));

    while (totalTime < targetTime * 0.85 && mainExercises.length > 0) {
      const exercise = this.randomPick(mainExercises);
      workout.push({ ...exercise, category: 'main' });
      totalTime += exercise.duration || 60;

      // Remove from pool to avoid duplicates
      const index = mainExercises.indexOf(exercise);
      if (index > -1) mainExercises.splice(index, 1);
    }

    // Add cooldown
    const cooldowns = this.exercises.filter((e) => e.tags?.includes('cooldown'));
    if (cooldowns.length > 0) {
      const cooldown = this.randomPick(cooldowns);
      workout.push({ ...cooldown, category: 'cooldown' });
      totalTime += cooldown.duration || 60;
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
}

// Initialize generator with exercises data
async function initGenerator() {
  const generatorForm = document.getElementById('workout-generator');
  const resultsContainer = document.getElementById('workout-results');

  if (!generatorForm || !resultsContainer) return;

  // Load exercises data
  let exercises = [];
  try {
    const response = await fetch('/data/exercises.json');
    const data = await response.json();
    exercises = data.exercises || [];
  } catch (error) {
    console.log('Using sample exercises');
    exercises = getSampleExercises();
  }

  const generator = new WorkoutGenerator(exercises);

  // Handle form submission
  generatorForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(generatorForm);
    const options = {
      duration: parseInt(formData.get('duration')) || 30,
      equipment: formData.getAll('equipment') || ['mat'],
      difficulty: formData.get('difficulty') || 'beginner',
      focus: formData.get('focus') || 'full_body',
    };

    const workout = generator.generate(options);
    displayWorkout(workout, resultsContainer);
  });
}

function displayWorkout(workout, container) {
  if (!workout.exercises || workout.exercises.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-gray-500">${workout.message || 'No exercises found. Try different filters.'}</p>
      </div>
    `;
    return;
  }

  const exerciseHTML = workout.exercises
    .map(
      (ex, index) => `
      <div class="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100">
        <span class="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
          ${index + 1}
        </span>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <h3 class="font-semibold text-gray-900">${ex.title}</h3>
            ${ex.category === 'warmup' ? '<span class="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">Warm-up</span>' : ''}
            ${ex.category === 'cooldown' ? '<span class="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">Cool-down</span>' : ''}
          </div>
          <p class="text-sm text-gray-600">${ex.description || ''}</p>
          <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>${Math.ceil((ex.duration || 60) / 60)} min</span>
            <span>${ex.difficulty || 'beginner'}</span>
          </div>
        </div>
      </div>
    `
    )
    .join('');

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Your Workout</h2>
          <p class="text-gray-600">${workout.totalDuration} minutes • ${workout.exercises.length} exercises</p>
        </div>
        <button onclick="window.print()" class="btn btn-secondary text-sm py-2">
          Print Workout
        </button>
      </div>

      <div class="space-y-3">
        ${exerciseHTML}
      </div>

      <div class="bg-pink-50 rounded-xl p-4">
        <p class="text-sm text-pink-700">
          <strong>Tip:</strong> Take 30-60 seconds rest between exercises. Focus on form over speed.
        </p>
      </div>
    </div>
  `;
}

// Sample exercises for when data file is not available
function getSampleExercises() {
  return [
    {
      id: 1,
      title: 'The Hundred',
      description: 'Classic Pilates warm-up for core activation',
      difficulty: 'beginner',
      equipment: ['mat'],
      muscles: ['core', 'abs'],
      duration: 120,
      tags: ['warmup'],
    },
    {
      id: 2,
      title: 'Roll Up',
      description: 'Spine articulation and core strength',
      difficulty: 'intermediate',
      equipment: ['mat'],
      muscles: ['core', 'spine'],
      duration: 90,
    },
    {
      id: 3,
      title: 'Single Leg Circles',
      description: 'Hip mobility and core stabilization',
      difficulty: 'beginner',
      equipment: ['mat'],
      muscles: ['core', 'hips'],
      duration: 60,
    },
    {
      id: 4,
      title: 'Rolling Like a Ball',
      description: 'Spinal massage and core control',
      difficulty: 'beginner',
      equipment: ['mat'],
      muscles: ['core', 'spine'],
      duration: 60,
    },
    {
      id: 5,
      title: 'Single Leg Stretch',
      description: 'Core endurance and coordination',
      difficulty: 'beginner',
      equipment: ['mat'],
      muscles: ['core', 'abs'],
      duration: 90,
    },
    {
      id: 6,
      title: 'Double Leg Stretch',
      description: 'Full body coordination and core',
      difficulty: 'intermediate',
      equipment: ['mat'],
      muscles: ['core', 'full_body'],
      duration: 90,
    },
    {
      id: 7,
      title: 'Spine Stretch Forward',
      description: 'Hamstring and spine flexibility',
      difficulty: 'beginner',
      equipment: ['mat'],
      muscles: ['spine', 'hamstrings'],
      duration: 60,
    },
    {
      id: 8,
      title: 'Saw',
      description: 'Rotational flexibility and stretch',
      difficulty: 'intermediate',
      equipment: ['mat'],
      muscles: ['spine', 'obliques'],
      duration: 60,
    },
    {
      id: 9,
      title: 'Swan',
      description: 'Back extension and shoulder opening',
      difficulty: 'intermediate',
      equipment: ['mat'],
      muscles: ['back', 'shoulders'],
      duration: 60,
    },
    {
      id: 10,
      title: 'Side Kicks',
      description: 'Leg strength and hip stability',
      difficulty: 'beginner',
      equipment: ['mat'],
      muscles: ['legs', 'hips'],
      duration: 90,
    },
    {
      id: 11,
      title: 'Teaser',
      description: 'Advanced core challenge',
      difficulty: 'advanced',
      equipment: ['mat'],
      muscles: ['core', 'abs'],
      duration: 90,
    },
    {
      id: 12,
      title: 'Mermaid Stretch',
      description: 'Side body stretch and cooldown',
      difficulty: 'beginner',
      equipment: ['mat'],
      muscles: ['obliques', 'spine'],
      duration: 60,
      tags: ['cooldown'],
    },
  ];
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initGenerator);
