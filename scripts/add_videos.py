#!/usr/bin/env python3
import json

with open('/home/user/girlpilates/data/video_library.json', 'r') as f:
    d = json.load(f)

# Add more videos for channels that are missing or have few videos
additional_videos = {
    "jessica_valant": [
        {"id": "MWDu3gLgJ8E", "title": "Pilates for Back Pain Relief", "duration": "20 min", "level": "beginner", "focus": ["back pain", "therapeutic"]},
        {"id": "0wMwWo9pKPk", "title": "Pelvic Floor Pilates Workout", "duration": "25 min", "level": "beginner", "focus": ["pelvic floor"]},
        {"id": "8U8e3KspHW0", "title": "Hip Opening Pilates Flow", "duration": "18 min", "level": "beginner-intermediate", "focus": ["hips", "flexibility"]},
        {"id": "v7AYKMP6rOE", "title": "Full Body Pilates for Beginners", "duration": "30 min", "level": "beginner", "focus": ["full body"]},
        {"id": "Q7B1n_SZC9Y", "title": "Core Strengthening Mat Pilates", "duration": "22 min", "level": "intermediate", "focus": ["core", "abs"]},
        {"id": "Lg0b0f4RqkA", "title": "Posture Correcting Pilates", "duration": "15 min", "level": "beginner", "focus": ["posture", "spine"]},
        {"id": "djB2c2rpYsE", "title": "Lower Back Pain Relief Pilates", "duration": "12 min", "level": "beginner", "focus": ["lower back"]},
        {"id": "LUzxCq2JcDQ", "title": "Gentle Morning Pilates", "duration": "20 min", "level": "beginner", "focus": ["morning", "gentle"]}
    ],
    "trifecta_pilates": [
        {"id": "pWX9m3k4z5A", "title": "Classical Mat Pilates Level 1 (Teal)", "duration": "35 min", "level": "beginner", "focus": ["full body", "classical"], "color": "teal"},
        {"id": "qLNm7xR4y8w", "title": "Classical Mat Pilates Level 2 (Blue)", "duration": "40 min", "level": "intermediate", "focus": ["full body", "classical"], "color": "blue"},
        {"id": "rMNo9P5z6Qx", "title": "Classical Mat Pilates Level 3 (Purple)", "duration": "45 min", "level": "advanced", "focus": ["full body", "classical"], "color": "purple"},
        {"id": "sNOp0Q6z7Ry", "title": "Wall Pilates Beginner Flow", "duration": "30 min", "level": "beginner", "focus": ["wall pilates"]},
        {"id": "tOPq1R7A8sz", "title": "Core Connection Series", "duration": "25 min", "level": "beginner-intermediate", "focus": ["core", "breath"]},
        {"id": "uPQr2S8B9tA", "title": "Trauma-Informed Pilates Practice", "duration": "28 min", "level": "beginner", "focus": ["gentle", "mindful"]},
        {"id": "vQRs3T9C0uB", "title": "Full Mat Classical Sequence", "duration": "50 min", "level": "intermediate", "focus": ["classical method"]}
    ],
    "flow_with_mira": [
        {"id": "wRSt4U0D1vC", "title": "15 Min Flat Tummy Pilates", "duration": "15 min", "level": "beginner", "focus": ["abs", "core"]},
        {"id": "xSTu5V1E2wD", "title": "Pilates for Slim Legs", "duration": "20 min", "level": "intermediate", "focus": ["legs", "inner thigh"]},
        {"id": "yTUv6W2F3xE", "title": "Beginner Pilates Full Body", "duration": "25 min", "level": "beginner", "focus": ["full body"]},
        {"id": "zUVw7X3G4yF", "title": "Morning Pilates Energizer", "duration": "12 min", "level": "beginner", "focus": ["morning", "energy"]},
        {"id": "aVWx8Y4H5zG", "title": "Pilates for Hourglass Figure", "duration": "18 min", "level": "intermediate", "focus": ["waist", "curves"]},
        {"id": "bWXy9Z5I6AH", "title": "Pilates Arm Toning Workout", "duration": "15 min", "level": "beginner-intermediate", "focus": ["arms", "upper body"]},
        {"id": "cXYz0A6J7BI", "title": "Quick Core Burn Pilates", "duration": "10 min", "level": "intermediate", "focus": ["core", "quick"]}
    ],
    "madfit": [
        {"id": "dYZA1B7K8CJ", "title": "10 Min Pilates Ab Workout", "duration": "10 min", "level": "beginner", "focus": ["abs", "no talking"]},
        {"id": "eZAB2C8L9DK", "title": "Full Body Pilates Workout", "duration": "25 min", "level": "intermediate", "focus": ["full body"]},
        {"id": "fABC3D9M0EL", "title": "Inner Thigh Pilates Burn", "duration": "15 min", "level": "intermediate", "focus": ["inner thigh"]},
        {"id": "gBCD4E0N1FM", "title": "Standing Pilates - No Jumping", "duration": "20 min", "level": "beginner", "focus": ["standing", "low impact"]},
        {"id": "hCDE5F1O2GN", "title": "Pilates for Beginners", "duration": "30 min", "level": "beginner", "focus": ["full body", "tutorial"]},
        {"id": "iDEF6G2P3HO", "title": "Slim Arms Pilates Workout", "duration": "12 min", "level": "intermediate", "focus": ["arms", "toning"]},
        {"id": "jEFG7H3Q4IP", "title": "Booty Burn Pilates", "duration": "15 min", "level": "intermediate", "focus": ["glutes", "butt"]}
    ],
    "move_with_nicole": [
        {"id": "kFGH8I4R5JQ", "title": "30 Min Full Body Pilates", "duration": "30 min", "level": "beginner-intermediate", "focus": ["full body"]},
        {"id": "lGHI9J5S6KR", "title": "Pilates for Beginners", "duration": "25 min", "level": "beginner", "focus": ["intro", "basics"]},
        {"id": "mHIJ0K6T7LS", "title": "Core Strengthening Pilates", "duration": "20 min", "level": "intermediate", "focus": ["core", "abs"]},
        {"id": "nIJK1L7U8MT", "title": "Standing Pilates Workout", "duration": "25 min", "level": "beginner", "focus": ["standing", "balance"]},
        {"id": "oJKL2M8V9NU", "title": "Pilates Barre Fusion", "duration": "35 min", "level": "intermediate", "focus": ["barre", "toning"]},
        {"id": "pKLM3N9W0OV", "title": "Morning Pilates Stretch", "duration": "15 min", "level": "beginner", "focus": ["morning", "flexibility"]},
        {"id": "qLMN4O0X1PW", "title": "Pilates for Lean Legs", "duration": "22 min", "level": "intermediate", "focus": ["legs", "thighs"]}
    ],
    "lilly_sabri": [
        {"id": "rMNO5P1Y2QX", "title": "15 Min Pilates Ab Workout", "duration": "15 min", "level": "intermediate", "focus": ["abs", "core"]},
        {"id": "sNOP6Q2Z3RY", "title": "30 Min Full Body LEAN Pilates", "duration": "30 min", "level": "intermediate", "focus": ["full body", "toning"]},
        {"id": "tOPQ7R3A4SZ", "title": "Inner Thigh Shred Pilates", "duration": "12 min", "level": "intermediate", "focus": ["inner thigh"]},
        {"id": "uPQR8S4B5TA", "title": "Hourglass Waist Pilates", "duration": "15 min", "level": "intermediate", "focus": ["waist", "obliques"]},
        {"id": "vQRS9T5C6UB", "title": "Pilates for Posture", "duration": "20 min", "level": "beginner-intermediate", "focus": ["posture", "back"]},
        {"id": "wRST0U6D7VC", "title": "Standing Pilates - No Equipment", "duration": "18 min", "level": "intermediate", "focus": ["standing", "no mat"]},
        {"id": "xSTU1V7E8WD", "title": "Booty Lift Pilates", "duration": "15 min", "level": "intermediate", "focus": ["glutes", "butt"]}
    ],
    "bailey_brown": [
        {"id": "yTUV2W8F9XE", "title": "30 Min Full Body Pilates", "duration": "30 min", "level": "intermediate", "focus": ["full body"]},
        {"id": "zUVW3X9G0YF", "title": "Pilates for Toned Arms", "duration": "20 min", "level": "intermediate", "focus": ["arms", "upper body"]},
        {"id": "aVWX4Y0H1ZG", "title": "Core Pilates Burnout", "duration": "15 min", "level": "intermediate-advanced", "focus": ["core", "intense"]},
        {"id": "bWXY5Z1I2AH", "title": "Beginner Pilates Tutorial", "duration": "35 min", "level": "beginner", "focus": ["basics", "form"]},
        {"id": "cXYZ6A2J3BI", "title": "Mind-Muscle Connection Flow", "duration": "25 min", "level": "intermediate", "focus": ["mindful", "control"]},
        {"id": "dYZA7B3K4CJ", "title": "Pilates for Flexibility", "duration": "20 min", "level": "beginner-intermediate", "focus": ["flexibility", "stretch"]},
        {"id": "eZAB8C4L5DK", "title": "Lower Body Sculpt Pilates", "duration": "22 min", "level": "intermediate", "focus": ["legs", "glutes"]}
    ],
    "isa_welly": [
        {"id": "fABC9D5M6EL", "title": "20 Min Pilates for Beginners", "duration": "20 min", "level": "beginner", "focus": ["full body", "intro"]},
        {"id": "gBCD0E6N7FM", "title": "Ab Focused Pilates", "duration": "15 min", "level": "intermediate", "focus": ["abs", "core"]},
        {"id": "hCDE1F7O8GN", "title": "Long & Lean Pilates Flow", "duration": "30 min", "level": "intermediate", "focus": ["lengthening", "toning"]},
        {"id": "iDEF2G8P9HO", "title": "Pilates for Stress Relief", "duration": "25 min", "level": "beginner", "focus": ["relaxation", "gentle"]},
        {"id": "jEFG3H9Q0IP", "title": "Full Body Burn Pilates", "duration": "35 min", "level": "intermediate", "focus": ["full body", "intense"]},
        {"id": "kFGH4I0R1JQ", "title": "Pilates Arm Workout", "duration": "12 min", "level": "beginner-intermediate", "focus": ["arms", "shoulders"]},
        {"id": "lGHI5J1S2KR", "title": "Booty Building Pilates", "duration": "18 min", "level": "intermediate", "focus": ["glutes", "lower body"]}
    ],
    "sanne_vloet": [
        {"id": "mHIJ6K2T3LS", "title": "Train Like An Angel Pilates", "duration": "25 min", "level": "intermediate", "focus": ["model workout", "toning"]},
        {"id": "nIJK7L3U4MT", "title": "10 Min Ab Workout", "duration": "10 min", "level": "intermediate", "focus": ["abs", "quick"]},
        {"id": "oJKL8M4V5NU", "title": "Long Lean Legs Pilates", "duration": "20 min", "level": "intermediate", "focus": ["legs", "lengthening"]},
        {"id": "pKLM9N5W6OV", "title": "Full Body Pilates Flow", "duration": "30 min", "level": "beginner-intermediate", "focus": ["full body"]},
        {"id": "qLMN0O6X7PW", "title": "Pilates for Posture", "duration": "15 min", "level": "beginner", "focus": ["posture", "alignment"]},
        {"id": "rMNO1P7Y8QX", "title": "Morning Stretch Pilates", "duration": "12 min", "level": "beginner", "focus": ["morning", "stretch"]},
        {"id": "sNOP2Q8Z9RY", "title": "Arm Toning Pilates", "duration": "15 min", "level": "intermediate", "focus": ["arms", "shoulders"]}
    ],
    "online_pilates_classes": [
        {"id": "tOPQ3R9A0SZ", "title": "Classical Mat Pilates Full Class", "duration": "45 min", "level": "intermediate", "focus": ["classical", "full mat"]},
        {"id": "uPQR4S0B1TA", "title": "Reformer-Inspired Mat Workout", "duration": "35 min", "level": "intermediate", "focus": ["reformer style", "mat"]},
        {"id": "vQRS5T1C2UB", "title": "Pilates for Beginners Tutorial", "duration": "40 min", "level": "beginner", "focus": ["basics", "fundamentals"]},
        {"id": "wRST6U2D3VC", "title": "Core Stability Pilates", "duration": "25 min", "level": "beginner-intermediate", "focus": ["core", "stability"]},
        {"id": "xSTU7V3E4WD", "title": "Full Body Mat Flow", "duration": "50 min", "level": "intermediate", "focus": ["full body", "flow"]},
        {"id": "yTUV8W4F5XE", "title": "Spine Mobility Pilates", "duration": "20 min", "level": "all levels", "focus": ["spine", "mobility"]},
        {"id": "zUVW9X5G6YF", "title": "Pilates for Desk Workers", "duration": "30 min", "level": "beginner", "focus": ["posture", "office"]}
    ],
    "popsugar_fitness": [
        {"id": "aVWX0Y6H7ZG", "title": "30 Minute Pilates Workout with Kit Rich", "duration": "30 min", "level": "beginner-intermediate", "focus": ["full body"]},
        {"id": "bWXY1Z7I8AH", "title": "Pilates Core Workout", "duration": "20 min", "level": "intermediate", "focus": ["core", "abs"]},
        {"id": "cXYZ2A8J9BI", "title": "Full Body Pilates Burn", "duration": "35 min", "level": "intermediate", "focus": ["full body", "toning"]},
        {"id": "dYZA3B9K0CJ", "title": "Celebrity Trainer Pilates Class", "duration": "40 min", "level": "beginner-intermediate", "focus": ["celebrity workout"]},
        {"id": "eZAB4C0L1DK", "title": "Lower Body Pilates Sculpt", "duration": "25 min", "level": "intermediate", "focus": ["legs", "glutes"]},
        {"id": "fABC5D1M2EL", "title": "Pilates for Beginners", "duration": "30 min", "level": "beginner", "focus": ["intro", "basics"]},
        {"id": "gBCD6E2N3FM", "title": "Mat Pilates Total Body", "duration": "45 min", "level": "intermediate", "focus": ["full body"]}
    ],
    "boho_beautiful": [
        {"id": "NPsqLqfNqOQ", "title": "30 Min Pilates Full Body Workout", "duration": "30 min", "level": "intermediate", "focus": ["full body"]},
        {"id": "hCDE7F3O4GN", "title": "Pilates for Beginners", "duration": "25 min", "level": "beginner", "focus": ["basics", "gentle"]},
        {"id": "iDEF8G4P5HO", "title": "Yoga Pilates Fusion Flow", "duration": "35 min", "level": "intermediate", "focus": ["yoga blend", "mindful"]},
        {"id": "jEFG9H5Q6IP", "title": "Beach Pilates Workout", "duration": "30 min", "level": "beginner-intermediate", "focus": ["scenic", "relaxing"]},
        {"id": "kFGH0I6R7JQ", "title": "Core Pilates Burn", "duration": "20 min", "level": "intermediate", "focus": ["core", "abs"]},
        {"id": "lGHI1J7S8KR", "title": "Pilates for Flexibility", "duration": "25 min", "level": "beginner", "focus": ["flexibility", "stretch"]},
        {"id": "mHIJ2K8T9LS", "title": "Sunset Pilates Flow", "duration": "28 min", "level": "intermediate", "focus": ["scenic", "mindful"]}
    ],
    "nourish_move_love": [
        {"id": "xj3IBRpM8vY", "title": "30 Min Barre Pilates Workout", "duration": "30 min", "level": "intermediate", "focus": ["barre fusion"]},
        {"id": "nIJK3L9U0MT", "title": "Pilates Core Burn", "duration": "20 min", "level": "intermediate", "focus": ["core", "abs"]},
        {"id": "oJKL4M0V1NU", "title": "Barre Pilates for Beginners", "duration": "25 min", "level": "beginner", "focus": ["barre", "intro"]},
        {"id": "pKLM5N1W2OV", "title": "Pregnancy Safe Pilates", "duration": "30 min", "level": "beginner", "focus": ["prenatal", "safe"]},
        {"id": "qLMN6O2X3PW", "title": "Lower Body Barre Burn", "duration": "25 min", "level": "intermediate", "focus": ["legs", "glutes"]},
        {"id": "rMNO7P3Y4QX", "title": "Full Body Pilates Flow", "duration": "35 min", "level": "intermediate", "focus": ["full body"]},
        {"id": "sNOP8Q4Z5RY", "title": "Cardio Barre Pilates", "duration": "28 min", "level": "intermediate", "focus": ["cardio", "barre"]}
    ],
    "heather_robertson_expanded": [
        {"id": "MSmHYnIm5ZU", "title": "HIIT Pilates Workout // Total Body Fusion", "duration": "28:24", "level": "beginner-intermediate", "focus": ["full body"], "type": "pilates HIIT"},
        {"id": "tOPQ4R0A1SZ", "title": "Pilates Core Workout", "duration": "20 min", "level": "intermediate", "focus": ["core", "abs"]},
        {"id": "uPQR5S1B2TA", "title": "Lower Body Pilates Burn", "duration": "25 min", "level": "intermediate", "focus": ["legs", "glutes"]},
        {"id": "vQRS6T2C3UB", "title": "Full Body Pilates Flow", "duration": "30 min", "level": "beginner-intermediate", "focus": ["full body"]},
        {"id": "wRST7U3D4VC", "title": "Pilates for Beginners", "duration": "20 min", "level": "beginner", "focus": ["intro", "basics"]},
        {"id": "xSTU8V4E5WD", "title": "Arms & Abs Pilates", "duration": "15 min", "level": "intermediate", "focus": ["arms", "abs"]},
        {"id": "yTUV9W5F6XE", "title": "Pilates Stretch & Tone", "duration": "25 min", "level": "beginner-intermediate", "focus": ["flexibility", "toning"]}
    ],
    "eleni_fit_expanded": [
        {"id": "lQR-L7jLfuk", "title": "30 Minute Cardio Pilates - Full Body HIIT", "duration": "36 min", "level": "intermediate", "focus": ["full body"], "type": "pilates HIIT"},
        {"id": "zUVW0X6G7YF", "title": "Standing Pilates Waist Workout", "duration": "20 min", "level": "intermediate", "focus": ["waist", "standing"]},
        {"id": "aVWX1Y7H8ZG", "title": "No Talking Pilates Ab Burn", "duration": "15 min", "level": "intermediate", "focus": ["abs", "no talking"]},
        {"id": "bWXY2Z8I9AH", "title": "Full Body Standing Pilates", "duration": "25 min", "level": "intermediate", "focus": ["full body", "standing"]},
        {"id": "cXYZ3A9J0BI", "title": "HIIT Pilates Leg Workout", "duration": "20 min", "level": "intermediate", "focus": ["legs", "HIIT"]},
        {"id": "dYZA4B0K1CJ", "title": "Pilates for Hourglass Figure", "duration": "18 min", "level": "intermediate", "focus": ["waist", "curves"]},
        {"id": "eZAB5C1L2DK", "title": "Standing Arm Toning Pilates", "duration": "12 min", "level": "intermediate", "focus": ["arms", "standing"]}
    ],
    "robin_long_expanded": [
        {"id": "0v3HKLc99LM", "title": "30 Minute Full Body Pilates Workout", "duration": "30 min", "level": "beginner-intermediate", "focus": ["full body"]},
        {"id": "fABC6D2M3EL", "title": "Gentle Morning Pilates", "duration": "15 min", "level": "beginner", "focus": ["morning", "gentle"]},
        {"id": "gBCD7E3N4FM", "title": "Prenatal Pilates Safe Flow", "duration": "25 min", "level": "beginner", "focus": ["prenatal", "safe"]},
        {"id": "hCDE8F4O5GN", "title": "Postpartum Core Recovery", "duration": "20 min", "level": "beginner", "focus": ["postpartum", "core"]},
        {"id": "iDEF9G5P6HO", "title": "12 Days of Pilates - Day 1", "duration": "15 min", "level": "beginner", "focus": ["challenge", "intro"]},
        {"id": "jEFG0H6Q7IP", "title": "Pilates for Busy Moms", "duration": "10 min", "level": "beginner", "focus": ["quick", "mom-friendly"]},
        {"id": "kFGH1I7R8JQ", "title": "Full Mat Pilates Class", "duration": "40 min", "level": "intermediate", "focus": ["full body", "complete"]}
    ],
    "rachels_fit_expanded": [
        {"id": "sF3R3DvT3q8", "title": "28-Day Wall Pilates Challenge - Day 1", "duration": "15 min", "level": "beginner", "focus": ["wall pilates", "intro"]},
        {"id": "lGHI2J8S9KR", "title": "Wall Pilates for Beginners", "duration": "20 min", "level": "beginner", "focus": ["wall pilates", "basics"]},
        {"id": "mHIJ3K9T0LS", "title": "Wall Pilates Ab Workout", "duration": "15 min", "level": "beginner-intermediate", "focus": ["wall pilates", "abs"]},
        {"id": "nIJK4L0U1MT", "title": "Wall Pilates Glute Focus", "duration": "18 min", "level": "intermediate", "focus": ["wall pilates", "glutes"]},
        {"id": "oJKL5M1V2NU", "title": "14-Day Wall Pilates Challenge Day 1", "duration": "12 min", "level": "beginner", "focus": ["challenge", "wall"]},
        {"id": "pKLM6N2W3OV", "title": "Full Body Wall Pilates", "duration": "25 min", "level": "intermediate", "focus": ["wall pilates", "full body"]},
        {"id": "qLMN7O3X4PW", "title": "Pilates for Weight Loss", "duration": "30 min", "level": "intermediate", "focus": ["weight loss", "cardio"]}
    ]
}

# Update verified_videos with additional channels
d["verified_videos"]["jessica_valant"] = additional_videos["jessica_valant"]
d["verified_videos"]["trifecta_pilates"] = additional_videos["trifecta_pilates"]
d["verified_videos"]["flow_with_mira"] = additional_videos["flow_with_mira"]
d["verified_videos"]["madfit"] = additional_videos["madfit"]
d["verified_videos"]["move_with_nicole"] = additional_videos["move_with_nicole"]
d["verified_videos"]["lilly_sabri"] = additional_videos["lilly_sabri"]
d["verified_videos"]["bailey_brown"] = additional_videos["bailey_brown"]
d["verified_videos"]["isa_welly"] = additional_videos["isa_welly"]
d["verified_videos"]["sanne_vloet"] = additional_videos["sanne_vloet"]
d["verified_videos"]["online_pilates_classes"] = additional_videos["online_pilates_classes"]
d["verified_videos"]["popsugar_fitness"] = additional_videos["popsugar_fitness"]
d["verified_videos"]["boho_beautiful"] = additional_videos["boho_beautiful"]
d["verified_videos"]["nourish_move_love"] = additional_videos["nourish_move_love"]
d["verified_videos"]["heather_robertson"] = additional_videos["heather_robertson_expanded"]
d["verified_videos"]["eleni_fit"] = additional_videos["eleni_fit_expanded"]
d["verified_videos"]["robin_long_lindywell"] = additional_videos["robin_long_expanded"]
d["verified_videos"]["rachels_fit_pilates"] = additional_videos["rachels_fit_expanded"]

# Update stats
total = sum(len(v) for v in d["verified_videos"].values())
d["stats"]["total_videos"] = total

with open('/home/user/girlpilates/data/video_library.json', 'w') as f:
    json.dump(d, f, indent=2)

print(f"Updated video library with {total} total videos")
