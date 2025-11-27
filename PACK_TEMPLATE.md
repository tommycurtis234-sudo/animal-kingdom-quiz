# How to Add New Animal Packs

This guide explains how to add new quiz packs to the Animal Kingdom Quiz app.

## Quick Start

Adding a new pack requires 3 simple steps:

1. **Register the pack** in `packs-config.json`
2. **Create the questions** as a JSON file in `client/public/packs/`
3. **Add images** to `client/public/media/{pack-id}/`

---

## Step 1: Register Your Pack

Open `client/public/packs-config.json` and add your pack to the `packs` array:

```json
{
  "id": "sharks",
  "name": "Sharks",
  "description": "Meet the apex predators of the ocean",
  "icon": "🦈",
  "category": "ocean",
  "unlockCost": 0,
  "questionCount": 15
}
```

### Pack Config Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique ID (lowercase, no spaces). Used for filenames. |
| `name` | Yes | Display name shown to users |
| `description` | No | Short description (shown in pack selection) |
| `icon` | No | Emoji icon for the pack |
| `category` | No | Category ID for grouping packs |
| `unlockCost` | Yes | Coins needed to unlock (0 = free) |
| `questionCount` | No | Number of questions (for reference) |

---

## Step 2: Create the Questions File

Create a new file: `client/public/packs/{pack-id}.json`

Example: `client/public/packs/sharks.json`

```json
[
  {
    "id": "great-white",
    "name": "Great White Shark",
    "fact": "Great white sharks can detect a single drop of blood in 25 gallons of water.",
    "question": "How many teeth can a great white shark have at once?",
    "options": ["50", "100", "300", "1000"],
    "answer": "300",
    "media": {
      "image": "media/sharks/great-white.jpg"
    }
  },
  {
    "id": "hammerhead",
    "name": "Hammerhead Shark",
    "fact": "Hammerhead sharks have 360-degree vision thanks to their unique head shape.",
    "question": "What is the main advantage of a hammerhead's head shape?",
    "options": ["Better swimming", "Improved vision", "Faster eating", "Deeper diving"],
    "answer": "Improved vision",
    "media": {
      "image": "media/sharks/hammerhead.jpg"
    }
  }
]
```

### Question Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique ID within the pack (lowercase, hyphens OK) |
| `name` | Yes | Animal name displayed to user |
| `fact` | Yes | Fun fact shown after answering |
| `question` | Yes | The quiz question |
| `options` | Yes | Array of 4 answer choices |
| `answer` | Yes | The correct answer (must match one option exactly) |
| `media.image` | Yes | Path to image (relative to public folder) |
| `media.video` | No | Path to video (optional) |
| `media.sound` | No | Path to animal sound (optional) |

---

## Step 3: Add Images

Create a folder: `client/public/media/{pack-id}/`

Add one image per question using the question's `id` as the filename.

Example for sharks pack:
```
client/public/media/sharks/
├── great-white.jpg
├── hammerhead.jpg
├── whale-shark.jpg
└── tiger-shark.jpg
```

### Image Guidelines

- **Format**: JPG or PNG (JPG preferred for smaller file size)
- **Size**: Aim for 800x600 pixels or similar
- **Quality**: Clear, well-lit photos of the animal
- **Naming**: Use the question `id` as the filename

---

## Optional: Add Videos

If you have videos for featured animals:

1. Place videos in `client/public/media/videos/`
2. Use WebM format (VP9 codec) for best compatibility
3. Keep videos short (5-10 seconds)
4. Reference in the question's `media.video` field

---

## Categories Available

You can group packs into these categories (or add new ones to `packs-config.json`):

| Category ID | Name | Description |
|-------------|------|-------------|
| `core` | Core Packs | Original animal kingdom packs |
| `ocean` | Ocean Life | Deep sea and marine creatures |
| `safari` | Safari Adventures | African savanna animals |
| `rainforest` | Rainforest | Tropical rainforest creatures |
| `arctic` | Arctic & Antarctic | Cold climate animals |
| `endangered` | Endangered Species | Animals we need to protect |
| `prehistoric` | Prehistoric | Ancient creatures and fossils |
| `nocturnal` | Nocturnal | Night-time animals |
| `pets` | Pets & Domestic | Companion animals |
| `australia` | Australian Wildlife | Unique Australian creatures |

---

## Pack Ideas

Here are some pack ideas for future expansion:

### Ocean Packs
- Sharks
- Whales & Dolphins
- Coral Reef
- Deep Sea Creatures
- Jellyfish & Rays

### Safari Packs
- Big Cats
- African Elephants
- Primates
- Savanna Birds
- African Predators

### Regional Packs
- Australian Wildlife
- Amazon Rainforest
- Arctic Animals
- Asian Wildlife
- North American Wildlife

### Special Packs
- Baby Animals
- Endangered Species
- Nocturnal Animals
- Venomous Creatures
- Fastest Animals
- Largest Animals
- Smallest Animals
- Camouflage Masters

---

## Testing Your Pack

1. Add the pack to `packs-config.json`
2. Create the JSON file with questions
3. Add all images
4. Refresh the app (clear cache if needed)
5. Your pack should appear in pack selection!

---

## Question Writing Tips

1. **Make facts memorable** - Choose surprising or interesting facts
2. **Vary difficulty** - Mix easy and challenging questions
3. **Use clear options** - All 4 options should be plausible
4. **Be accurate** - Double-check your facts!
5. **Keep it fun** - The goal is to educate while entertaining

---

## Checklist for New Pack

- [ ] Added entry to `packs-config.json`
- [ ] Created `client/public/packs/{id}.json`
- [ ] Added 15-20 questions
- [ ] Each question has: id, name, fact, question, options, answer
- [ ] Created `client/public/media/{id}/` folder
- [ ] Added image for each question
- [ ] Image filenames match question IDs
- [ ] Tested pack loads in app
