# Animal Kingdom Quiz

## Overview

Animal Kingdom Quiz is a gamified educational web application that teaches users about animals through interactive quizzes. The application features 10 animal packs (Mammals, Birds, Reptiles, Fish, Amphibians, Insects, Big Cats, Sharks, Jungle, Arctic Animals) with 15-20 questions each (186 total), containing quiz questions with facts, images, videos, and interactive elements. Users earn coins for correct answers, unlock badges for achievements, and can track their progress through various quiz packs. The app is designed with a playful, engaging interface inspired by platforms like Duolingo and Kahoot, and includes offline PWA capabilities.

## Recent Updates (November 2024)

### XP & Level Progression System
- 15-level progression system from "Curious Cub" to "Animal Master"
- XP earned for every answer: 15 XP for correct, 5 XP for incorrect
- Level thresholds: 0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 17000, 23000, 30000, 40000, 50000
- Level display badge in toolbar shows current level
- Helper functions: calculateLevel(), getXpForNextLevel(), getLevelName()

### Daily Streak System
- Tracks consecutive days of play
- Streak bonus coins: 3 coins at 3 days, 5 at 7 days, 7 at 14 days, 10 at 30+ days
- Streak display badge shows current and longest streak
- Auto-detection of new day and streak continuation/reset
- Toast notifications for streak milestones

### Daily Challenges
- New daily challenge generated each day (seeded by date)
- 5 questions from a randomly selected pack
- +50 bonus XP for completion
- Challenge history tracked in progress
- DailyChallengeCard component on pack selection screen

### Stats Dashboard
- Comprehensive statistics page accessible from toolbar
- Level progress bar with XP tracking
- Quick stats grid: Correct answers, Accuracy %, Current Streak, Total Coins
- Lifetime stats: Questions answered, correct answers, score, XP, coins, daily challenges, badges
- Per-pack progress: Times completed, best score, accuracy
- Wrong answers section for review mode

### Enhanced Badge System
- 20+ badge definitions across 5 categories: progress, streak, speed, mastery, special
- Badges include: First Steps, Pack Master, Centurion, Week Warrior, Monthly Master, Speedster, Perfect Pack, and animal-specific mastery badges
- Badge rewards include coins and XP
- Helper functions for badge checking and awarding

### Complete Animal Pack Library
- 10 fully populated packs: Mammals, Birds, Reptiles, Fish, Amphibians, Insects, Big Cats, Sharks, Jungle, Arctic Animals
- 186 total quiz questions with unique facts and educational content
- Each question has a high-quality stock or AI-generated animal image (stored in public/media/{pack}/)
- 58 AI-generated animal videos distributed across all packs (5-6 videos per pack):
  - Mammals: Lion, Elephant, Giraffe, Cheetah, Panda, Dolphin
  - Birds: Bald Eagle, Parrot, Owl, Peacock, Flamingo, Hummingbird
  - Reptiles: Crocodile, Sea Turtle, Chameleon, Komodo Dragon, Cobra, Bearded Dragon
  - Fish: Great White Shark, Clownfish, Seahorse, Manta Ray, Betta, Jellyfish
  - Amphibians: Axolotl, Tree Frog, Salamander, Bullfrog, Newt
  - Insects: Monarch Butterfly, Bee, Dragonfly, Ladybug, Praying Mantis, Firefly
  - Big Cats: Lion, Tiger, Leopard, Cheetah, Jaguar, Panther
  - Sharks: Great White, Hammerhead, Tiger Shark, Whale Shark, Mako, Bull Shark
  - Jungle: Jaguar, Gorilla, Toucan, Anaconda, Tree Frog, Poison Dart Frog
  - Arctic: Polar Bear, Arctic Fox, Snowy Owl, Narwhal, Walrus, Beluga Whale
- Videos stored in public/media/videos/ (MP4 format for universal browser compatibility)
- Graceful fallback to images if video can't play

### Dynamic Pack System
- **Pack Registry**: All packs defined in `client/public/packs-config.json`
- **Easy expansion**: Add 20-30+ new packs without code changes
- **Adding new packs requires 3 steps**:
  1. Register pack in `packs-config.json` (id, name, description, icon, category, unlockCost)
  2. Create question file in `client/public/packs/{pack-id}.json`
  3. Add images to `client/public/media/{pack-id}/`
- **Category system**: Packs can be grouped (ocean, safari, rainforest, arctic, etc.)
- **Service worker**: Automatically caches new packs and media on first access
- **Documentation**: See `PACK_TEMPLATE.md` for detailed instructions

### Enhanced Audio System
- Web Audio API synthesized sound effects (no audio files needed)
- Sound effects: Correct answer (ascending notes), Incorrect (buzz tone), Click
- Game sounds: Coin pickup, Badge earned, Level complete, Hint button
- Background music generator with ambient loops
- Proper timer cleanup and AudioContext.resume() for autoplay compliance
- Mute/unmute toggle in toolbar with localStorage persistence
- Text-to-speech (TTS): Questions read aloud using browser's SpeechSynthesis API
  - Toggle in toolbar (AudioLines/AudioWaveform icons)
  - Automatically reads question when displayed (if enabled)
  - Friendly voice selection with adjusted rate/pitch
- Animal sound support: Schema includes sound field, button shows when URL available

### Multiplayer Mode
- Support for 1-4 players with custom names
- Turn-based gameplay with atomic state management via useReducer
- Results screen highlighting the winner
- Isolated from single-player stats to prevent contamination

### Colorful Themes
- 5 vibrant color themes: Forest Green, Royal Purple, Safari Red, Ocean Blue, Sunset Orange
- Theme selector in the toolbar (palette icon)
- Persists to localStorage across sessions
- Full dark mode support for all themes

### Difficulty Levels
- Kids mode: Hint button reveals first letter, friendlier feedback messages, celebratory icons
- Adults mode: Standard quiz experience
- Toggle between modes in the toolbar

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript as the primary UI framework
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- All application logic runs client-side with minimal backend requirements

**State Management**
- Client-side state management using React hooks (useState, useEffect, useReducer)
- LocalStorage for persisting user progress, coins, badges, and completed packs
- TanStack React Query for any future API data fetching needs
- No global state management library (Redux, Zustand) - keeping state local to components

**UI Component System**
- Shadcn/ui component library (New York style variant) with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Framer Motion for animations and transitions
- Custom design system following playful, nature-inspired aesthetics
- Typography: Inter (UI elements) and Fredoka (playful headings)
- Icon library: lucide-react only (no other icon libraries)
- Color scheme: Theme-aware with 5 selectable color palettes

**PWA Implementation**
- Service Worker (v10) for offline functionality and asset caching
- Manifest file for installability
- Cache-first strategy for quiz packs, media assets, and static resources
- Manual service worker update prompts via custom banner component
- All 10 pack JSON files and animal sounds cached for offline play

**Key Application States**
- Splash screen → Pack selection → Quiz → Results → Badge gallery
- State machine pattern for game flow management
- Global readiness hooks (window.AKQ_packReady, window.AKQ_setReady) for splash screen dismissal

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server
- Minimal backend footprint - primarily serves static assets
- Two server modes: development (with Vite middleware) and production (static file serving)
- Session management ready but not actively used in current implementation

**Development vs Production**
- Development: Vite dev server integrated as Express middleware for HMR
- Production: Pre-built static assets served from dist/public directory
- TypeScript compilation with tsx for development, esbuild for production bundling

**API Structure**
- Routes registered via registerRoutes function in server/routes.ts
- Currently minimal API endpoints - app is primarily client-side
- Storage interface defined but not implemented (MemStorage placeholder)
- Future-ready for backend features like leaderboards or user accounts

### Data Storage Solutions

**Client-Side Storage**
- LocalStorage for all user data persistence
- Schema-validated data structures using Zod:
  - UserProgress: coins, score, answered questions, completed packs, badges
  - Pack: quiz pack metadata and questions
  - QuizItem: individual question with options, answers, and media
  - Badge: achievement definitions and unlock status

**Content Storage**
- Static JSON files in public/packs/ directory (6 packs total)
- Media assets organized by pack type in public/media/ (114 images)
- Each pack contains 15-20 quiz items with questions, facts, and images
- Video support exists in schema but not used (to keep PWA lightweight)

**Database Configuration**
- Drizzle ORM configured with PostgreSQL dialect
- Database schema defined in shared/schema.ts
- Currently unused but ready for future server-side features
- Migration system configured via drizzle.config.ts

### Audio System

**Web Audio API Implementation**
- SoundManager class with synthesized sounds (no external audio files)
- AudioContext management with proper resume() for browser autoplay policies
- Sound effects generated using OscillatorNode with gain envelopes
- Music loop with timer tracking and proper cleanup on stopMusic()

**Available Sounds**
- playCorrect(): Ascending C5-E5-G5 notes with harmonics
- playIncorrect(): Two descending triangle wave tones
- playClick(): Quick dual-frequency click
- playCoinPickup(): Two quick ascending notes
- playBadgeEarned(): Fanfare melody sequence
- playLevelComplete(): Victory melody with chord
- playHint(): Two ascending notes for hint button
- startMusic()/stopMusic(): Ambient background music generator

### External Dependencies

**UI & Styling**
- @radix-ui/* - Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- tailwindcss - Utility-first CSS framework
- framer-motion - Animation library for smooth transitions
- lucide-react - Icon library (only icon library used)
- class-variance-authority - Type-safe variant styling
- embla-carousel-react - Carousel/slider component

**Form & Data Management**
- react-hook-form - Form state management
- @hookform/resolvers - Form validation resolvers
- zod - Schema validation and type inference
- drizzle-zod - Zod schema generation from Drizzle schemas

**Database & Backend**
- drizzle-orm - TypeScript ORM
- @neondatabase/serverless - Neon PostgreSQL serverless driver
- connect-pg-simple - PostgreSQL session store for Express

**Development Tools**
- vite - Build tool and dev server
- @vitejs/plugin-react - React integration for Vite
- typescript - Type checking
- @replit/vite-plugin-* - Replit-specific development plugins

**Runtime**
- express - Web server framework
- wouter - Lightweight routing
- date-fns - Date manipulation utilities

**Google Fonts**
- Inter (weights: 400, 600, 700) - Primary UI font
- Fredoka (weights: 500, 600) - Display/heading font

**Progressive Web App**
- Custom service worker implementation (no workbox)
- Manual cache versioning and update management (currently v5)
- Offline-first content strategy

**Asset Management**
- Static media assets served from public/ directory
- Base URL configuration for deployment flexibility
- Placeholder images for missing content

**Future Integration Points**
- Database ready for user accounts and cloud sync
- API routes ready for leaderboards and social features
- Session management configured but inactive
- Video support in schema ready for future enhancement
