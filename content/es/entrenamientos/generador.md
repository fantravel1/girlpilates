---
title: "Generador de Entrenamientos"
description: "Crea tu entrenamiento de Pilates personalizado en segundos. Elige tu duración, equipo y área de enfoque para una rutina personalizada hecha para ti."
translationKey: "workout-generator"
layout: "generator"
---

## Construye Tu Entrenamiento Perfecto

Crea una rutina de Pilates personalizada en segundos. Solo selecciona tus preferencias y generaremos un entrenamiento balanceado solo para ti.

### Cómo Funciona

1. **Elige tu tiempo** - ¿Cuántos minutos tienes?
2. **Selecciona equipo** - ¿Solo mat? ¿Tienes pared? ¿Sin equipo?
3. **Escoge tu nivel** - ¿Principiante, intermedio o avanzado?
4. **Área de enfoque** - ¿Cuerpo completo, core, flexibilidad o objetivo específico?

### Tus Preferencias

<div id="workout-generator">
  <form class="space-y-6">
    <div>
      <label class="block font-medium mb-2">Duración (minutos)</label>
      <select name="duration" class="select">
        <option value="10">10 minutos - Sesión rápida</option>
        <option value="15">15 minutos - Entrenamiento corto</option>
        <option value="20">20 minutos - Sesión estándar</option>
        <option value="30" selected>30 minutos - Entrenamiento completo</option>
        <option value="45">45 minutos - Sesión extendida</option>
      </select>
    </div>

    <div>
      <label class="block font-medium mb-2">Equipo</label>
      <div class="space-y-2">
        <label class="flex items-center gap-2">
          <input type="checkbox" name="equipment" value="mat" checked>
          <span>Mat</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" name="equipment" value="none">
          <span>Sin equipo (solo de pie)</span>
        </label>
      </div>
    </div>

    <div>
      <label class="block font-medium mb-2">Nivel de Dificultad</label>
      <select name="difficulty" class="select">
        <option value="beginner">Principiante</option>
        <option value="intermediate" selected>Intermedio</option>
        <option value="advanced">Avanzado</option>
      </select>
    </div>

    <div>
      <label class="block font-medium mb-2">Área de Enfoque</label>
      <select name="focus" class="select">
        <option value="full_body" selected>Cuerpo Completo</option>
        <option value="core">Core y Abdominales</option>
        <option value="back">Espalda y Postura</option>
        <option value="legs">Piernas y Glúteos</option>
        <option value="arms">Brazos y Hombros</option>
        <option value="flexibility">Flexibilidad y Estiramientos</option>
      </select>
    </div>

    <button type="submit" class="btn btn-primary w-full">
      Generar Mi Entrenamiento
    </button>
  </form>
</div>

<div id="workout-results" class="mt-8">
  <!-- El entrenamiento generado aparece aquí -->
</div>

### Consejos Para Tu Entrenamiento

- **Calienta primero** - Aunque tu entrenamiento incluya calentamiento, toma un momento para moverte suavemente
- **Escucha a tu cuerpo** - Modifica cualquier ejercicio que no se sienta bien
- **Enfócate en la forma** - Calidad sobre cantidad siempre
- **Respira** - Nunca aguantes la respiración; usa las indicaciones de respiración proporcionadas
- **Enfría** - Toma tiempo para estirar después de tu entrenamiento

---

**¿Prefieres un programa pre-diseñado?** [Explora nuestros programas de entrenamiento →](/es/entrenamientos/programas/)
