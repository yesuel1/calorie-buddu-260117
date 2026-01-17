# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CalorieBuddy** is a Korean-language calorie chatbot for fitness enthusiasts. Users can search for food by text or photo (Week 2) to get nutrition information displayed in an HTML card format with protein ratings and motivational messages.

**Tech Stack**: Vanilla JavaScript (ES6+), HTML5, CSS3 - no build tools or frameworks.

## Development Commands

### Running the Application

Always use a local web server with UTF-8 encoding support and Korean locale:

```bash
# Recommended: Use the start script (includes Korean UTF-8 locale)
cd calorie-chatbot-mvp
./start-server.sh

# Alternative: Manual locale setup
export LANG=ko_KR.UTF-8
export LC_ALL=ko_KR.UTF-8
python3 /tmp/simple_ko_server.py

# Access at http://localhost:8000
```

**Critical**:
- Never open `index.html` directly in browser (`file://` protocol) - CORS and encoding issues will occur
- Always set Korean UTF-8 locale (`LANG=ko_KR.UTF-8` and `LC_ALL=ko_KR.UTF-8`) before starting server
- See `LOCALE_SETUP.md` for detailed Korean text encoding configuration

### Testing Photo Recognition

```bash
# Test Google Vision API with sample image
curl -X POST "https://vision.googleapis.com/v1/images:annotate?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/vision_test.json
```

### UTF-8 Server Setup

If Korean text appears garbled, use the UTF-8 configured server:

```python
# Create /tmp/server_utf8.py with explicit UTF-8 headers
# See implementation in conversation history for details
```

## Code Architecture

### Module Structure

The codebase uses **global function architecture** - no ES6 modules or bundling. All scripts are loaded via `<script>` tags in order:

```html
<!-- Load order matters -->
<script src="config/api-keys.js"></script>
<script src="scripts/api.js"></script>
<script src="scripts/search.js"></script>
<script src="scripts/nutrition.js"></script>
<script src="scripts/chat.js"></script>
<script src="scripts/app.js"></script>
```

### Core Files and Responsibilities

**`scripts/app.js`** (691 lines) - Main application orchestrator
- `handleSearch(query)` - Orchestrates search flow: parse → search → calculate → display
- `handlePhotoUpload(file)` - Week 2: Photo upload flow with Vision API
- `recognizeFood(imageDataUrl)` - Google Vision API integration with Mock fallback
- `resizeImage(dataUrl)` - Optimizes images before API call (60-80% cost reduction)
- `findFoodLabel(labels)` - Filters Vision API labels with 70% confidence threshold and 70+ food keywords
- `translateToKorean(englishFood)` - 100+ English→Korean food translations

**`scripts/search.js`** (220 lines) - Food search logic
- `parseInput(query)` - Extracts food name and amount (e.g., "닭가슴살 150g" → {foodName: "닭가슴살", amount: 150})
- `searchFood(foodName)` - Priority: local DB exact match → aliases → partial match → API fallback

**`scripts/nutrition.js`** (402 lines) - Nutrition calculation and card generation
- `calculateNutrition(foodData, amount)` - Scales 100g base nutrition to requested amount
- `createNutritionCard(nutritionData)` - Generates HTML card with gradient, protein stars, and motivational message
- `getProteinRating(protein)` - Returns ⭐⭐⭐ (30g+), ⭐⭐ (20-29g), ⭐ (10-19g)

**`scripts/chat.js`** (325 lines) - Chat UI rendering
- `addMessage(sender, content)` - Adds bot/user messages (accepts string or HTMLElement)
- `createConfirmCard(imageDataUrl, recognizedFood)` - Week 2: Photo confirmation UI

**`scripts/api.js`** (115 lines) - API wrapper for 식약처 (MFDS) Food Safety API
- Currently skeleton - Week 1 uses local DB only

### Data Flow

```
User Input
    ↓
parseInput() → {foodName, amount}
    ↓
searchFood() → foodData from local DB or API
    ↓
calculateNutrition() → scaled nutrition values
    ↓
createNutritionCard() → HTML card element
    ↓
addMessage() → Display in chat
```

### Photo Recognition Flow (Week 2)

```
Photo Upload
    ↓
fileToDataURL() → convert to base64
    ↓
resizeImage() → optimize to 800x800 JPEG 85%
    ↓
recognizeFood() → Google Vision API
    ↓
findFoodLabel() → filter labels (70% confidence + food keywords)
    ↓
translateToKorean() → English → Korean
    ↓
createConfirmCard() → user confirms/edits
    ↓
handleSearch() → proceed with normal search flow
```

## Data Files

### `data/foods.json`

Local food database with 20 Korean foods. Each entry:

```json
{
  "name": "닭가슴살",
  "aliases": ["닭고기", "치킨", "chicken breast"],
  "calories": 165,
  "protein": 31,
  "carbs": 0,
  "fat": 3.6
}
```

**All values are per 100g** - must be scaled based on user input.

### `config/api-keys.js` (gitignored)

```javascript
window.API_KEYS = {
    foodSafety: 'YOUR_API_KEY_HERE',
    googleVision: 'AIzaSyBVBs3tIehsPn8uGMfL-VgdXfWSMEZGQ9s'
};
```

**Security note**: API keys are exposed in browser. For production, use backend proxy or Vercel environment variables.

## Critical Implementation Details

### Korean Text Encoding

**Always ensure UTF-8 encoding**:
- All files must be UTF-8 encoded
- Server must send `Content-Type: text/html; charset=utf-8`
- `<meta charset="UTF-8">` in HTML head
- Test Korean text rendering immediately after changes

### Amount Parsing Logic

The `parseInput()` function handles multiple formats:
- "닭가슴살" → 100g (default)
- "닭가슴살 150g" → 150g
- "삼겹살 200" → 200g (implicit grams)
- "밥 2인분" → 200g (1인분 = 100g)

### Google Vision API Integration

**Key features implemented in Week 2**:
1. **Image optimization**: Resize to 800x800 JPEG 85% before API call
2. **Confidence filtering**: Only labels ≥70% confidence
3. **Food keyword matching**: 70+ keywords (Korean, Asian, Western foods)
4. **Exclude non-food**: Filters out plates, bowls, utensils, furniture
5. **Mock fallback**: Returns random food if API fails (dev mode)
6. **Error handling**: HTTP status-specific messages (400/403/429)

**maxResults**: Increased from 10 to 15 for better food detection

### Translation Table

100+ English→Korean mappings in `translateToKorean()`. When adding new foods:
1. Add exact match (e.g., "chicken breast": "닭가슴살")
2. Consider partial matches (e.g., "chicken" in "grilled chicken")
3. Fallback: English text is Title Cased if no translation found

## Common Tasks

### Adding a New Food to Local DB

Edit `data/foods.json`:

```json
{
  "name": "새로운음식",
  "aliases": ["별명1", "별명2"],
  "calories": 100,
  "protein": 20,
  "carbs": 10,
  "fat": 5
}
```

All nutrition values per 100g.

### Adding a Translation

Edit `translateToKorean()` in `scripts/app.js`:

```javascript
const foodTranslations = {
    // ... existing translations ...
    'new food': '새로운 음식',
    'another food': '다른 음식'
};
```

### Debugging Photo Recognition

Open browser console (F12) and look for:
```javascript
이미지 리사이즈 완료: { reduction: "XX%" }
인식된 라벨 (신뢰도 순): ...
음식 라벨 발견: "Chicken" (키워드: chicken, 신뢰도: 86.6%)
번역 매핑 발견: "Chicken" → "치킨"
```

### Testing Without API Key

The app automatically falls back to Mock mode:
- Returns random food from: ['닭가슴살', '계란', '삼겹살', '치킨', '김밥', '라면']
- Simulates 1-second API delay
- No errors thrown

## Code Style Conventions

1. **Functions**: JSDoc comments for all public functions
2. **Korean comments**: Initial comments often in Korean for Korean-speaking developers
3. **Beginner-friendly**: Detailed step-by-step comments in complex functions
4. **Global scope**: No `export`/`import` - all functions are global
5. **Async/await**: Preferred over `.then()` chains
6. **Error handling**: `try/catch` with user-friendly Korean error messages

## API Limits and Costs

### Google Vision API
- **Free tier**: 1,000 requests/month
- **Cost after**: $1.50 per 1,000 requests
- **Optimization**: Image resizing reduces costs by 60-80%

### 식약처 (MFDS) API
- Currently not integrated (Week 1 uses local DB only)
- Free for public use

## Known Issues and Quirks

1. **UTF-8 encoding**: Standard Python `http.server` may serve wrong encoding - use custom server
2. **API key security**: Keys visible in browser - implement backend proxy for production
3. **CORS**: Must use local server, not `file://` protocol
4. **Search priority**: Local DB always searched before API (by design)
5. **Mock mode**: Automatically enabled if API key missing or error occurs

## Week 2 Enhancements Completed

- ✅ Image resizing (800x800, JPEG 85%)
- ✅ Google Vision API integration
- ✅ 70% confidence threshold
- ✅ 70+ food keywords (Korean, Asian, Western)
- ✅ Exclude non-food keywords
- ✅ 100+ English→Korean translations
- ✅ Enhanced error messages (HTTP status-specific)
- ✅ Mock mode fallback
- ✅ Comprehensive console logging

## File Modification Guidelines

**When editing `scripts/app.js`**:
- Line 61-88: `handlePhotoUpload()` - photo upload flow
- Line 104-169: `resizeImage()` - image optimization
- Line 178-294: `recognizeFood()` - Vision API integration
- Line 268-375: `findFoodLabel()` - label filtering logic
- Line 429-633: `translateToKorean()` - translation table

**Always test after changes**:
1. Text search: "닭가슴살 150g"
2. Photo upload with Korean text rendering
3. Console logs for debugging
4. Error scenarios (bad API key, network error)

## Deployment

Currently configured for Vercel:
```bash
vercel --prod
```

**Environment variables** (set in Vercel dashboard):
- `GOOGLE_VISION_API_KEY`
- `FOOD_SAFETY_API_KEY`

See `vercel.json` for configuration.
