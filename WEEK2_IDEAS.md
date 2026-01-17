# Week 2 확장 아이디어 💡

> Week 1 MVP를 기반으로 추가할 수 있는 기능들입니다.

## 🎯 Week 2 핵심 기능 (우선순위 높음)

### 1. 사진 인식 기능 📸

**목표**: 음식 사진을 찍으면 자동으로 음식 이름을 인식

**구현 계획**:
```javascript
// scripts/vision.js (새로 생성)

/**
 * 이미지를 Vision API로 전송하여 음식을 인식합니다
 * @param {File} imageFile - 이미지 파일
 * @returns {Promise<string>} 인식된 음식 이름
 */
async function recognizeFood(imageFile) {
    // 1. 이미지를 base64로 변환
    // 2. Clarifai Vision API 호출
    // 3. 응답에서 음식 이름 추출
    // 4. 한글 매핑 (영어 → 한글)
}
```

**필요한 작업**:
- [ ] Clarifai API 키 발급 및 설정
- [ ] 이미지 업로드 UI 구현 (파일 선택 + 미리보기)
- [ ] vision.js 파일 생성 및 API 연동
- [ ] 영어-한글 음식명 매핑 테이블 추가
- [ ] 확인 UI (인식 결과를 사용자가 확인하고 수정 가능하게)

**참고 코드 위치**:
- `app.js:63-66` - handlePhotoUpload() 함수 (현재 스텁)
- `index.html:77-85` - 사진 버튼 UI

---

### 2. 확인 UI (인식 결과 확인)

**목표**: 사진 인식 후 결과를 사용자가 확인하고 수정할 수 있게

**UI 흐름**:
```
[사진 업로드]
    ↓
[AI가 음식 인식 중...]
    ↓
┌─────────────────────────────┐
│ 이 음식이 맞나요?           │
│                             │
│ [사진 미리보기]              │
│                             │
│ 🍗 닭가슴살 (100g)          │
│                             │
│ [맞아요] [다시 검색]         │
└─────────────────────────────┘
```

**구현 방법**:
```javascript
// scripts/chat.js에 추가

/**
 * 확인 카드를 생성합니다
 * @param {string} imageUrl - 업로드된 이미지 URL
 * @param {string} foodName - 인식된 음식 이름
 * @returns {HTMLElement} 확인 카드
 */
function createConfirmCard(imageUrl, foodName) {
    // 1. 카드 컨테이너 생성
    // 2. 이미지 미리보기 추가
    // 3. 인식된 음식 이름 표시
    // 4. "맞아요" 버튼 → handleSearch(foodName) 호출
    // 5. "다시 검색" 버튼 → 입력창 포커스
}
```

---

### 3. 에러 핸들링 개선

**현재 문제점**:
- API 오류 시 간단한 메시지만 표시
- 네트워크 오류와 다른 오류 구분 안 됨
- 재시도 기능 없음

**개선 계획**:
```javascript
// scripts/error.js (새로 생성)

/**
 * 에러 타입에 따라 사용자 친화적인 메시지를 생성합니다
 * @param {Error} error - 발생한 에러
 * @returns {string} 사용자에게 보여줄 메시지
 */
function getErrorMessage(error) {
    if (error.name === 'NetworkError') {
        return '인터넷 연결을 확인해주세요 📡';
    }
    if (error.name === 'APIError') {
        return 'API 오류가 발생했어요. 잠시 후 다시 시도해주세요 🔧';
    }
    if (error.name === 'NotFoundError') {
        return '음식을 찾을 수 없어요. 다른 이름으로 검색해보세요 🔍';
    }
    return '오류가 발생했어요. 잠시 후 다시 시도해주세요 😢';
}

/**
 * 재시도 버튼이 포함된 에러 카드를 생성합니다
 */
function createErrorCard(error, retryFunction) {
    // 1. 에러 메시지 카드 생성
    // 2. "다시 시도" 버튼 추가
    // 3. 버튼 클릭 시 retryFunction 호출
}
```

---

## 🚀 추가 개선 아이디어 (우선순위 중간)

### 4. 검색 히스토리 저장

**목표**: 최근 검색한 음식을 빠르게 다시 조회

**구현 방법**:
```javascript
// scripts/history.js (새로 생성)

/**
 * LocalStorage를 사용하여 검색 히스토리를 관리합니다
 */
class SearchHistory {
    constructor(maxItems = 10) {
        this.maxItems = maxItems;
        this.storageKey = 'calorieBuddy_searchHistory';
    }

    /**
     * 검색 기록 추가
     * @param {Object} searchData - { foodName, amount, timestamp }
     */
    add(searchData) {
        let history = this.getAll();
        // 중복 제거 (같은 음식명이면 업데이트)
        history = history.filter(item => item.foodName !== searchData.foodName);
        history.unshift({ ...searchData, timestamp: Date.now() });
        // 최대 개수 제한
        history = history.slice(0, this.maxItems);
        localStorage.setItem(this.storageKey, JSON.stringify(history));
    }

    /**
     * 모든 히스토리 가져오기
     * @returns {Array} 검색 기록 배열
     */
    getAll() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    /**
     * 히스토리 초기화
     */
    clear() {
        localStorage.removeItem(this.storageKey);
    }
}
```

**UI 추가**:
- 입력창 아래에 최근 검색 칩(chip) 표시
- 칩 클릭하면 해당 음식 바로 검색

---

### 5. 즐겨찾기 음식

**목표**: 자주 먹는 음식을 즐겨찾기에 추가

**UI**:
```
영양 카드에 ⭐ 버튼 추가
→ 클릭하면 즐겨찾기에 추가/제거
→ 입력창 위에 즐겨찾기 목록 표시
```

**구현**:
```javascript
// scripts/favorites.js (새로 생성)

class FavoriteFoods {
    constructor() {
        this.storageKey = 'calorieBuddy_favorites';
    }

    /**
     * 즐겨찾기 추가
     * @param {Object} foodData - 음식 데이터
     */
    add(foodData) {
        let favorites = this.getAll();
        // 중복 체크
        if (!favorites.find(f => f.name === foodData.name)) {
            favorites.push(foodData);
            localStorage.setItem(this.storageKey, JSON.stringify(favorites));
        }
    }

    /**
     * 즐겨찾기 제거
     * @param {string} foodName - 음식 이름
     */
    remove(foodName) {
        let favorites = this.getAll();
        favorites = favorites.filter(f => f.name !== foodName);
        localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    }

    /**
     * 즐겨찾기 여부 확인
     * @param {string} foodName - 음식 이름
     * @returns {boolean}
     */
    isFavorite(foodName) {
        return this.getAll().some(f => f.name === foodName);
    }

    getAll() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }
}
```

---

### 6. 여러 음식 합산 계산

**목표**: 식사로 여러 음식을 먹을 때 총 칼로리 계산

**UI 흐름**:
```
[장바구니 모드 활성화]
    ↓
닭가슴살 150g 검색 → [추가] 버튼
밥 200g 검색 → [추가] 버튼
계란 50g 검색 → [추가] 버튼
    ↓
[합산 결과 보기]
    ↓
┌─────────────────────────────┐
│ 🍽️ 식사 총합               │
│                             │
│ 🔥 총 칼로리: 650 kcal      │
│ 💪 총 단백질: 55g ⭐⭐⭐   │
│ 🍚 총 탄수화물: 60g         │
│ 🧈 총 지방: 8g              │
│                             │
│ 📋 포함된 음식:             │
│  • 닭가슴살 150g            │
│  • 밥 200g                  │
│  • 계란 50g                 │
└─────────────────────────────┘
```

---

### 7. 일일 칼로리/단백질 트래킹

**목표**: 하루 섭취량 목표 설정 및 추적

**기능**:
- 목표 설정 (칼로리, 단백질)
- 진행률 표시 (프로그레스 바)
- 하루 끝에 리셋

**UI**:
```
┌─────────────────────────────┐
│ 오늘의 목표 📊              │
│                             │
│ 칼로리: 1200 / 2000 kcal    │
│ ███████░░░░░ 60%            │
│                             │
│ 단백질: 80 / 120g           │
│ ██████████░░ 67%            │
└─────────────────────────────┘
```

---

## 🎨 UX 개선 아이디어 (우선순위 낮음)

### 8. 다크 모드

**구현**:
- CSS 변수를 활용한 테마 시스템
- LocalStorage에 사용자 설정 저장
- 시스템 설정 자동 감지 (`prefers-color-scheme`)

```css
/* styles/themes.css (새로 생성) */

/* 라이트 모드 (기본) */
:root {
    --color-background: #f5f7fa;
    --color-text: #333333;
    --color-primary: #667eea;
}

/* 다크 모드 */
[data-theme="dark"] {
    --color-background: #1a1a1a;
    --color-text: #e0e0e0;
    --color-primary: #8b9aff;
}
```

---

### 9. PWA 지원 (오프라인 동작)

**목표**: 앱처럼 설치하고 오프라인에서도 사용

**필요한 작업**:
- [ ] manifest.json 생성 (앱 메타데이터)
- [ ] Service Worker 등록 (오프라인 캐싱)
- [ ] 아이콘 세트 추가 (다양한 크기)

```javascript
// service-worker.js (새로 생성)

const CACHE_NAME = 'calorie-buddy-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/styles/chat.css',
    '/styles/card.css',
    '/scripts/app.js',
    '/scripts/chat.js',
    '/scripts/nutrition.js',
    '/scripts/search.js',
    '/data/foods.json',
    '/data/messages.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
```

---

### 10. 애니메이션 개선

**추가 애니메이션**:
- 카드 전환 효과 (flip, slide)
- 로딩 스피너 (검색 중)
- 타이핑 효과 (봇 메시지)
- 숫자 카운트업 효과 (칼로리 표시)

---

### 11. 음성 입력

**목표**: 음식 이름을 말로 입력

**구현**:
```javascript
// scripts/voice.js (새로 생성)

/**
 * Web Speech API를 사용한 음성 인식
 */
function startVoiceInput() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // 입력창에 채우고 검색
        document.getElementById('user-input').value = transcript;
        handleSendMessage();
    };

    recognition.start();
}
```

---

## 📦 데이터 확장

### 12. 음식 데이터베이스 확장

**현재**: foods.json에 약 20개 음식
**목표**: 100개 이상의 한국 음식 데이터

**추가할 카테고리**:
- 한식 (김치찌개, 된장찌개, 불고기, 갈비, 삼계탕...)
- 양식 (파스타, 피자, 스테이크, 샐러드...)
- 중식 (짜장면, 짬뽕, 탕수육...)
- 일식 (초밥, 라멘, 돈부리...)
- 분식 (떡볶이, 김밥, 라면...)
- 디저트 (케이크, 아이스크림, 쿠키...)
- 음료 (커피, 주스, 탄산음료...)

---

### 13. 상세 영양소 정보

**현재**: 칼로리, 단백질, 탄수화물, 지방
**확장**: 나트륨, 비타민, 미네랄, 식이섬유 등

```javascript
// data/foods.json 확장 예시
{
    "name": "닭가슴살",
    "calories": 165,
    "protein": 31,
    "carbs": 0,
    "fat": 3.6,
    // 추가 영양소
    "sodium": 74,        // 나트륨 (mg)
    "fiber": 0,          // 식이섬유 (g)
    "vitaminC": 0,       // 비타민C (mg)
    "calcium": 11,       // 칼슘 (mg)
    "iron": 0.7          // 철분 (mg)
}
```

---

## 🔧 기술 개선

### 14. 타입스크립트 전환

**이유**: 타입 안정성, 자동완성, 에러 감소

**진행 방법**:
1. `tsconfig.json` 생성
2. `.js` 파일을 `.ts`로 변경
3. 타입 정의 추가
4. 빌드 설정 (webpack or vite)

---

### 15. 단위 테스트 추가

**목표**: 코드 안정성 확보

**테스트 대상**:
- `parseInput()` - 입력 파싱
- `calculateNutrition()` - 영양 정보 계산
- `getProteinLevel()` - 단백질 등급
- `searchLocal()` - 로컬 검색

**프레임워크**: Jest or Vitest

---

### 16. CI/CD 파이프라인

**목표**: 자동 배포

**구성**:
- GitHub Actions
- 테스트 자동 실행
- Vercel 자동 배포
- 린트 체크

---

## 💡 창의적인 아이디어

### 17. 운동 추천

**개념**: 섭취한 칼로리를 소모하려면 어떤 운동을 해야 하는지 추천

**예시**:
```
닭가슴살 150g (247.5 kcal)를 소모하려면:
• 조깅 30분
• 수영 20분
• 웨이트 트레이닝 40분
```

---

### 18. 식단 추천

**개념**: 목표 칼로리/단백질에 맞는 식단 조합 추천

**예시**:
```
💪 근육 증량 식단 (2500 kcal, 단백질 150g)

아침: 계란 3개 + 오트밀 100g
점심: 닭가슴살 200g + 현미밥 200g + 브로콜리
저녁: 연어 150g + 고구마 200g + 샐러드
간식: 프로틴 쉐이크 + 바나나
```

---

### 19. 소셜 기능

**기능**:
- 친구 추가
- 식단 공유
- 목표 달성 인증
- 리더보드 (주간 단백질 왕)

---

### 20. 영양사 채팅봇 (AI)

**개념**: GPT API를 사용한 영양 상담

**예시 대화**:
```
사용자: 근육을 키우고 싶은데 어떤 음식을 먹어야 하나요?
봇: 근육 증량을 위해서는 단백질 섭취가 중요해요!
    체중 1kg당 1.6~2.2g의 단백질을 드시는 것을 추천해요.
    닭가슴살, 계란, 프로틴 파우더 등을 드셔보세요! 💪
```

---

## 📚 참고 자료

### 유용한 API들
- **Clarifai Vision API**: 이미지 인식
- **식약처 식품영양성분 DB API**: 음식 데이터
- **OpenAI GPT API**: 영양 상담 챗봇
- **Web Speech API**: 음성 입력 (무료, 브라우저 내장)

### 참고할 만한 프로젝트
- MyFitnessPal
- LoseIt
- Cronometer
- Samsung Health

---

## ✅ Week 2 권장 순서

1. **사진 인식 기능** (핵심)
2. **확인 UI** (핵심)
3. **에러 핸들링 개선** (핵심)
4. **검색 히스토리** (UX 개선)
5. **즐겨찾기** (UX 개선)
6. 그 외는 시간에 따라 선택

---

**작성일**: 2026-01-17
**작성자**: CalorieBuddy Team
