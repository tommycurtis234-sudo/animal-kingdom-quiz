# Animal Kingdom Quiz - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from gamified learning platforms like Duolingo, Kahoot, and Quizlet, combined with nature/wildlife documentary aesthetics (National Geographic, BBC Earth).

**Core Principle**: Playful, engaging quiz experience with vibrant animal imagery and smooth interactions that feel rewarding and educational.

## Typography

**Font Families** (Google Fonts):
- Primary: "Inter" (400, 600, 700) - clean, modern for UI elements
- Display: "Fredoka" (500, 600) - playful, rounded for headings and game elements

**Hierarchy**:
- Hero/Splash Titles: 3xl to 4xl (Fredoka 600)
- Question Text: xl to 2xl (Inter 600)
- Answer Options: base to lg (Inter 400)
- Facts/Descriptions: sm to base (Inter 400)
- Badges/Coins UI: sm (Inter 600)

## Layout System

**Spacing Units**: Use Tailwind units of 2, 4, 6, and 8 for consistent rhythm (p-4, gap-6, mb-8)

**Container Strategy**:
- Splash/Game Views: max-w-2xl centered (mobile-first single column)
- Quiz Cards: max-w-xl with generous padding
- Results/Stats: max-w-3xl to accommodate grid layouts

**Grid Patterns**:
- Answer Options: Single column stack on mobile, 2-column grid (grid-cols-2) on tablet+
- Badge Display: 3-4 column grid (grid-cols-3 lg:grid-cols-4)
- Pack Selection: 2-column on mobile, 3-column on desktop

## Component Library

**Splash Screen**:
- Full viewport height with centered content
- Large animal silhouette or nature pattern background (abstract leaves/paw prints)
- Animated loading indicator (pulsing circle or progress ring)
- Bold app title with playful icon
- Status text ("Loading packs…" → "Tap to start")
- Large tap target for dismissal

**Quiz Card Container**:
- Rounded corners (rounded-2xl)
- Elevated appearance with shadow (shadow-xl)
- White/light background for content contrast
- Top section: Question number & coin counter
- Middle: Media (video/image with rounded-xl edges)
- Bottom: Question text and answer buttons

**Answer Buttons**:
- Large tap targets with rounded-lg borders
- Clear hover states with subtle scale (hover:scale-[1.02])
- Selected state with border highlight
- Correct/incorrect feedback states (green check/red x icons)
- Consistent padding (p-4)

**Video/Image Media**:
- 16:9 aspect ratio container with rounded corners
- Poster frame loading for videos
- Subtle border or shadow for depth
- Max height constraint to prevent oversized media

**Skip Button**:
- Secondary style (outline or ghost button)
- Coin cost displayed clearly (-2🪙)
- Disabled state when coins < 2 (opacity-50, cursor-not-allowed)
- Positioned top-right of quiz card

**Coin Display**:
- Always visible in top-right or top-left
- Coin icon + number (e.g., "🪙 12")
- Animated on change (scale pulse effect)

**Badge System**:
- Card-based layout with icon + title + description
- Locked state (grayscale with lock icon)
- Unlocked state (full color with celebration animation on first view)
- Grid display in profile/results view

**Daily Challenge Banner**:
- Prominent card at top of main view
- "Daily Challenge" label with calendar icon
- Preview of today's question category
- CTA button to start challenge

**Toast Notifications**:
- Fixed position top-center or bottom-center
- Slide-in animation (translate-y)
- Auto-dismiss after 3-4 seconds
- Icon + message (e.g., "✅ Ready — tap to start")

**Service Worker Update Banner**:
- Sticky top banner (yellow/orange background)
- "New version available" message
- Reload/Update button
- Dismiss option

**Results Screen**:
- Score display (large numbers, celebratory)
- Performance breakdown (grid of stats)
- Earned badges showcase
- Share results button
- Play again CTA

**Pack Selection Screen**:
- Grid of pack cards (mammals, birds, reptiles)
- Each card with representative animal image
- Pack name and question count
- Completion indicator (progress ring or percentage)

## Animations

**Minimal, Purposeful Animations**:
- Splash dismiss: Fade out (300ms)
- Answer selection: Scale feedback (150ms)
- Coin change: Pulse animation (200ms)
- Toast notifications: Slide in/out (300ms)
- Badge unlock: Confetti or sparkle effect (one-time, 500ms)
- Card transitions: Slide/fade between questions (400ms)

**No Animations** for:
- Background patterns
- Continuous looping effects
- Hover states (except subtle scale)

## Images

**Required Images**:

1. **Splash Screen Background**: Abstract nature pattern (leaves, animal silhouettes, paw prints) - subtle, non-distracting, can be CSS gradient with SVG overlay

2. **Pack Selection Cards**: Representative animal photos for each pack
   - Mammals pack: Lion or elephant head
   - Birds pack: Colorful parrot or eagle
   - Reptiles pack: Chameleon or snake
   - Size: 400x300px, high quality

3. **Quiz Media**: Per-question animal photos/videos
   - Format: 16:9 ratio, 800x450px minimum
   - Include poster frames for videos
   - Stored in `/media/<pack>/<animal>.jpg/mp4`

4. **Badge Icons**: Achievement illustrations (can use emoji or simple SVG icons initially)
   - First quiz completion badge
   - Perfect score badge
   - 7-day streak badge
   - All packs completed badge

5. **Placeholder**: Generic animal silhouette at `/images/placeholder.png` for failed loads

**No Large Hero Image** - This is a game app, not a marketing site. Focus on functional, in-context imagery within quiz cards.

## Accessibility

- All interactive elements meet 44x44px minimum touch targets
- Color contrast ratios meet WCAG AA standards (especially for text on nature-themed backgrounds)
- Focus indicators on all clickable elements (ring-2 ring-offset-2)
- Alt text for all animal images and videos
- Keyboard navigation support for answer selection (arrow keys)
- Screen reader announcements for score changes, correct/incorrect feedback

## Responsive Behavior

- Mobile-first design (320px minimum width)
- Single column layout below 768px
- Answer buttons stack vertically on mobile
- Video/image media scales responsively within container
- Badge grid adjusts from 2 to 3 to 4 columns based on viewport