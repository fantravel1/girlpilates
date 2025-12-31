#!/usr/bin/env python3
"""Generate markdown files for all workouts defined in premade_workouts.json"""

import json
import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
DATA_FILE = BASE_DIR / "data" / "premade_workouts.json"
CONTENT_DIR = BASE_DIR / "content" / "en" / "workouts" / "premade"

def create_workout_markdown(workout):
    """Create markdown content for a workout"""
    workout_id = workout["id"]
    title = workout["title"]
    description = workout["description"]
    duration = workout["duration"]
    difficulty = workout["difficulty"]
    equipment = workout.get("equipment", ["none"])
    categories = workout.get("categories", {})

    # Generate workout content based on workout data
    content = f'''---
title: "{title}"
description: "{description}"
translationKey: "premade-{workout_id}"
layout: "premade-single"
workout_id: "{workout_id}"
date: 2024-12-01
---

## The Workout

{description}. This {duration}-minute {difficulty} workout is designed to help you achieve your fitness goals.

'''

    # Add equipment section if needed
    if equipment and equipment != ["none"]:
        equipment_list = ", ".join(equipment)
        content += f'''### Equipment Needed

You'll need: {equipment_list}

'''

    # Add workout structure based on duration
    warmup_time = min(2, duration // 5)
    main_time = duration - warmup_time - (warmup_time if duration > 10 else 1)
    cooldown_time = duration - warmup_time - main_time

    # Determine body focus for exercise suggestions
    body_focus = categories.get("body-focus", ["full-body"])

    content += f'''### Warm-Up ({warmup_time} minute{"s" if warmup_time > 1 else ""})

- Deep breathing with arm circles
- Gentle spinal articulation
- Light stretches to prepare your body

### Main Workout ({main_time} minutes)

Focus on controlled movements and proper form throughout this section. Listen to your body and modify as needed.

'''

    # Add body-focus specific tips
    if "core" in body_focus:
        content += '''**Core Focus Tips:**
- Keep your lower back pressed into the mat during supine exercises
- Engage your deep core muscles before each movement
- Breathe steadily throughout

'''
    elif "booty" in body_focus or "legs" in body_focus:
        content += '''**Lower Body Tips:**
- Keep your movements controlled and deliberate
- Focus on squeezing your glutes at the top of each movement
- Maintain proper hip alignment throughout

'''
    elif "arms" in body_focus or "upper-body" in body_focus:
        content += '''**Upper Body Tips:**
- Keep your shoulders away from your ears
- Engage your core for stability
- Control both the lifting and lowering phases

'''
    elif "back" in body_focus:
        content += '''**Back Focus Tips:**
- Move slowly and with control
- Engage your core to protect your spine
- Stop if you feel any sharp pain

'''

    content += f'''### Cool-Down ({cooldown_time} minute{"s" if cooldown_time > 1 else ""})

- Gentle stretches for worked muscles
- Deep breathing to lower heart rate
- Final relaxation

## Modifications

**To make it easier:**
- Reduce range of motion
- Take more breaks as needed
- Skip exercises that feel too challenging

**To make it harder:**
- Increase range of motion
- Add more repetitions
- Reduce rest time between exercises

## Tips for Best Results

- Stay hydrated throughout your workout
- Focus on form over speed
- Breathe steadily and don't hold your breath
- Listen to your body and rest when needed
'''

    return content


def main():
    # Load workout data
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    workouts = data.get("workouts", [])

    # Get existing markdown files (excluding _index.md)
    existing_files = set()
    for f in CONTENT_DIR.glob("*.md"):
        if f.name != "_index.md":
            existing_files.add(f.stem)

    print(f"Found {len(workouts)} workouts in JSON")
    print(f"Found {len(existing_files)} existing markdown files")

    created_count = 0
    skipped_count = 0

    for workout in workouts:
        workout_id = workout["id"]
        md_file = CONTENT_DIR / f"{workout_id}.md"

        if workout_id in existing_files:
            skipped_count += 1
            continue

        # Create the markdown file
        content = create_workout_markdown(workout)
        with open(md_file, 'w') as f:
            f.write(content)

        print(f"Created: {workout_id}.md")
        created_count += 1

    print(f"\nSummary:")
    print(f"  Created: {created_count} files")
    print(f"  Skipped (already exist): {skipped_count} files")
    print(f"  Total workouts: {len(workouts)}")


if __name__ == "__main__":
    main()
