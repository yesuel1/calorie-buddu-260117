# CalorieBuddy MVP - 중간점검 보고서

> **작성일**: 2026-01-17  
> **프로젝트 기간**: 2026-01-16 ~ (진행 중)  
> **현재 단계**: Week 1 Day 6-7 (영양 정보 카드 단계)

---

## 📊 프로젝트 개요

**프로젝트명**: CalorieBuddy 💪  
**목표**: 운동하는 사람을 위한 칼로리 챗봇 MVP  
**기술 스택**: Vanilla JS / HTML5 / CSS3 / Local JSON  
**개발 방식**: Skill 기반 개발 (Socrates + Tasks-Generator)

---

## ✅ 완료된 작업 (2026-01-16 ~ 2026-01-17)

### Day 1-2: 프로젝트 세팅 & HTML 구조 ✅

- [x] **Task 1.1.1**: 프로젝트 초기화
  - 디렉토리 구조 생성 완료
  - Git 저장소 초기화
  - README.md 작성

- [x] **Task 1.1.2**: index.html 마크업
  - HTML5 doctype 및 기본 구조
  - 메타태그 (viewport, charset, description)
  - Open Graph 메타태그
  - 시맨틱 태그 구조 (header, main, footer)

- [x] **Task 1.1.3**: 챗봇 컨테이너 HTML
  - 헤더 영역 (로고, 타이틀)
  - 대화창 영역 (스크롤 가능)
  - 입력 영역 (input + 사진 버튼)
  - 메시지 버블 템플릿 구조

### Day 2-3: CSS 스타일링 ✅

- [x] **Task 1.2.1**: main.css - 전역 스타일
  - CSS Reset/Normalize
  - CSS 변수 정의 (색상, spacing, border-radius)
  - 기본 폰트 및 body 스타일
  - 모바일 우선 반응형 breakpoints

- [x] **Task 1.2.2**: chat.css - 챗봇 UI
  - .chat-container 레이아웃
  - .messages 스크롤 영역
  - .message.bot / .message.user 말풍선 구분
  - 입력 영역 스타일 (input, 전송 버튼, 사진 버튼)
  - 모바일 우선 반응형 디자인

### Day 3-4: 챗봇 UI 로직 ✅

- [x] **Task 1.3.1**: chat.js - 메시지 렌더링
  - `addMessage(sender, text)` 함수
  - `createMessageBubble(sender, text)` 함수
  - 자동 스크롤 기능
  - HTMLElement 지원 추가

- [x] **Task 1.3.2**: chat.js - 입력 핸들러
  - `handleSendMessage()` 함수
  - Enter 키 전송 기능
  - 입력값 trim 처리 및 빈 문자열 방지
  - `handleSearch()` 함수 연결

- [x] **Task 1.3.3**: messages.json - 챗봇 메시지 템플릿
  - 인사 메시지 배열 (5개)
  - 격려 메시지 배열 (10개)
  - 랜덤 인사 메시지 선택 기능
  - fetch로 동적 로드

### Day 4-5: 텍스트 검색 로직 ✅

- [x] **Task 1.4.1**: search.js - 입력 파싱
  - `parseInput(text)` 함수
  - 정규표현식으로 분량 감지 (숫자 + g 패턴)
  - 기본값 처리 (분량 없으면 100g)
  - 테스트 코드 포함

- [x] **Task 1.4.2**: foods.json - 로컬 데이터베이스
  - 20개 자주 먹는 음식 데이터
  - 음식명, aliases, calories, protein, carbs, fat
  - 100g 기준 데이터 정규화

- [x] **Task 1.4.3**: search.js - 로컬 검색
  - `searchLocal(foodName)` 함수
  - 검색 우선순위: name 정확 매칭 → aliases 정확 매칭 → 부분 매칭
  - fetch로 foods.json 로드
  - 테스트 코드 포함

- [x] **Task 1.4.4**: nutrition.js - 분량 계산
  - `calculateNutrition(baseData, amount)` 함수
  - 100g 기준 비율 계산
  - 소수점 1자리 반올림
  - 단백질 등급 계산 (0-3, ⭐⭐⭐)

### Day 6-7: 영양 정보 카드 (진행 중) 🔄

- [x] **Task 1.6.1**: nutrition.js - 텍스트 포맷팅
  - `formatNutritionText(nutritionData)` 함수
  - `getPostWorkoutMessage(nutrition)` 함수 (운동 후 추천 멘트)
  - 단백질 등급을 별(⭐)로 표시
  - protein/carbs/calories 기준 멘트 생성

- [x] **Task 1.6.3**: app.js - 메인 통합
  - `handleSearch(query)` 메인 함수
  - 검색 → 파싱 → 검색 → 계산 → 표시 플로우 완성
  - 전역 에러 핸들링
  - 전체 기능 연결 완료

---

## 📁 현재 프로젝트 구조

```
calorie-chatbot-mvp/
├── index.html              ✅ 메인 페이지
├── styles/
│   ├── main.css           ✅ 전역 스타일
│   ├── chat.css           ✅ 챗봇 UI
│   └── card.css           ⚠️  영양 정보 카드 (미사용)
├── scripts/
│   ├── app.js             ✅ 메인 로직 (통합 완료)
│   ├── chat.js            ✅ 챗봇 UI 핸들러
│   ├── search.js          ✅ 검색 로직 (로컬 검색 완료)
│   ├── nutrition.js       ✅ 영양 정보 처리
│   └── api.js             ⚠️  API 래퍼 (미구현)
├── data/
│   ├── foods.json         ✅ 로컬 음식 DB (20개)
│   └── messages.json      ✅ 챗봇 메시지
├── config/
│   └── api-keys.js        ⚠️  API 키 (미설정)
├── vercel.json            ✅ 배포 설정
└── README.md              ✅ 프로젝트 문서
```

---

## 🎯 현재 동작하는 기능

### 1. 챗봇 UI ✅
- 인사 메시지 자동 표시 (랜덤)
- 사용자 메시지 입력 및 전송
- 봇 메시지 표시
- 자동 스크롤

### 2. 텍스트 검색 ✅
- 음식명 + 분량 파싱 (예: "닭가슴살 100g")
- 로컬 DB 검색 (20개 음식)
- 검색 우선순위: 정확 매칭 → 별칭 매칭 → 부분 매칭

### 3. 영양 정보 계산 ✅
- 100g 기준 비율 계산
- 칼로리, 단백질, 탄수화물, 지방 계산
- 단백질 등급 계산 (⭐⭐⭐)
- 소수점 1자리 반올림

### 4. 결과 표시 ✅
- 영양 정보 텍스트 포맷팅
- 운동 후 추천 멘트 자동 생성
- protein/carbs/calories 기준 멘트

---

## 🧪 테스트 결과

### 정상 동작 확인 ✅

**테스트 케이스 1**: "닭가슴살 100g"
```
🍽️ 닭가슴살 (100g)

🔥 칼로리: 165 kcal
💪 단백질: 31g ⭐⭐⭐
🍚 탄수화물: 0g
🧈 지방: 3.6g

💪 완벽한 단백질 보충이에요! 근육 회복에 최고입니다!
```

**테스트 케이스 2**: "계란"
```
🍽️ 계란 (100g)

🔥 칼로리: 155 kcal
💪 단백질: 12.6g ⭐
🍚 탄수화물: 1.1g
🧈 지방: 10.6g

👍 좋은 단백질 섭취네요! 운동 후 식사로 딱이에요!
```

**테스트 케이스 3**: "바나나 200g"
```
🍽️ 바나나 (200g)

🔥 칼로리: 178 kcal
💪 단백질: 2.2g 
🍚 탄수화물: 46g
🧈 지방: 0.6g

⚡ 에너지 보충 완료! 운동 전후로 좋은 선택이에요!
```

---

## ⚠️ 미완성 작업

### Day 5-6: API 연동 ❌

- [ ] **Task 1.5.1**: API 키 설정
  - 식약처 API 키 발급 필요
  - config/api-keys.js 설정 필요

- [ ] **Task 1.5.2**: api.js - 식약처 API 래퍼
  - `fetchFoodData(foodName)` 함수 미구현
  - API 엔드포인트 설정 필요

- [ ] **Task 1.5.3**: search.js - API 통합
  - `searchFood()` 함수는 있으나 API 호출 부분 미구현
  - 로컬 검색 실패 시 API fallback 필요

### Day 6-7: 영양 정보 카드 (부분 완료) 🔄

- [ ] **Task 1.6.1**: HTML 카드 생성 함수
  - 현재는 텍스트 포맷만 완료
  - HTML 카드 스타일 필요 (card.css 활용)

- [ ] **Task 1.6.2**: 격려 메시지 생성
  - `getPostWorkoutMessage()` 함수는 완료
  - 단백질 등급별 메시지는 messages.json 활용 필요

---

## 🔧 발견된 이슈 및 해결

### 이슈 1: 스크립트 로드 순서 문제 ✅ 해결
- **문제**: index.html에 search.js, nutrition.js가 로드되지 않음
- **해결**: 스크립트 태그 추가

### 이슈 2: 함수 연결 단절 ✅ 해결
- **문제**: app.js에서 searchFood(), formatNutritionText() 호출 시 함수 없음
- **해결**: 
  - search.js에 searchFood() 함수 추가
  - nutrition.js에 formatNutritionText() 함수 추가

### 이슈 3: 타입 불일치 ✅ 해결
- **문제**: addMessage()가 string만 받는데 HTMLElement 필요
- **해결**: addMessage()와 createMessageBubble() 함수 수정하여 string/HTMLElement 모두 지원

### 이슈 4: ID 불일치 ✅ 해결
- **문제**: app.js에서 photoButton을 찾는데 HTML에는 image-btn
- **해결**: initPhotoButton() 함수 수정

---

## 📈 진행률

### Week 1 전체 진행률: **약 75%**

- ✅ **완료**: Day 1-4 (100%)
- ✅ **완료**: Day 5 일부 (검색 로직)
- 🔄 **진행 중**: Day 6-7 (영양 정보 표시)
- ❌ **미시작**: Day 5-6 (API 연동)
- ❌ **미시작**: Day 7-8 (테스트 및 버그 수정)

### 주요 기능 완성도

| 기능 | 완성도 | 상태 |
|------|--------|------|
| 챗봇 UI | 100% | ✅ 완료 |
| 텍스트 검색 | 100% | ✅ 완료 |
| 로컬 DB 검색 | 100% | ✅ 완료 |
| 영양 정보 계산 | 100% | ✅ 완료 |
| 결과 표시 (텍스트) | 100% | ✅ 완료 |
| API 연동 | 0% | ❌ 미시작 |
| HTML 카드 스타일 | 0% | ❌ 미시작 |

---

## 🚀 다음 작업 우선순위

### 1. 즉시 진행 가능 (Week 1 완료를 위해)

**Task 1.6.1**: HTML 카드 생성 함수
- 현재 텍스트 포맷만 있음
- card.css 스타일 활용
- createNutritionCard() 함수 구현
- 사용자 경험 개선에 직접적 영향

**이유**: 텍스트만으로는 가독성이 낮음. HTML 카드로 시각적 개선 필요.

### 2. API 연동 (선택사항)

**Task 1.5.2**: api.js - 식약처 API 래퍼
- 로컬 DB에 없는 음식 검색 가능
- API 키 발급 필요
- Week 1 완료를 위해 필수는 아님

### 3. 테스트 및 버그 수정

**Task 1.7.1**: 기능 테스트
- 다양한 음식 검색 테스트
- 분량 변경 테스트
- 에러 케이스 테스트

---

## 💡 기술적 하이라이트

### 1. 모바일 우선 설계
- CSS 변수 활용
- 반응형 breakpoints (모바일 → 태블릿 → 데스크톱)
- 터치 친화적 UI

### 2. 함수형 프로그래밍
- 순수 함수 중심 설계
- parseInput, calculateNutrition 등
- 테스트 가능한 구조

### 3. 에러 처리
- fetch 실패 시 fallback
- null 체크 및 기본값 처리
- 전역 에러 핸들러

### 4. 사용자 경험
- 자동 스크롤
- Enter 키 전송
- 랜덤 인사 메시지
- 운동 톤의 추천 멘트

---

## 📝 코드 품질

### 장점 ✅
- 명확한 함수 분리
- TODO 주석으로 Task 추적 가능
- 테스트 코드 포함
- 일관된 네이밍

### 개선 필요 ⚠️
- 불필요한 console.log 정리 필요
- HTML 카드 스타일 미완성
- API 연동 미구현

---

## 🎯 완료 기준 달성 여부

### Week 1 목표: 기본 UI + 텍스트 검색 ✅

- [x] 음식 검색 가능
- [x] 영양 정보 표시
- [x] 챗봇 UI 완성
- [x] 반응형 (모바일)
- [ ] API fallback (선택사항)
- [ ] HTML 카드 스타일 (개선사항)

**결론**: 기본 기능은 완성되었으나, 시각적 개선과 API 연동이 남아있음.

---

## 📅 다음 세션 계획

### 즉시 진행 (약 2시간)
1. Task 1.6.1: HTML 카드 생성 함수 구현
2. card.css 스타일 적용
3. createNutritionCard() 함수 완성

### 이후 진행 (선택)
1. Task 1.5.2: API 연동 (API 키 발급 후)
2. Task 1.7.1: 기능 테스트
3. Task 1.7.2: 버그 수정 및 코드 정리

---

## 📌 참고 사항

### 로컬 실행 방법
```bash
cd calorie-chatbot-mvp
python3 -m http.server 8000
# 또는
npx http-server -p 8000
```

### 테스트 입력 예시
- "닭가슴살 100g"
- "계란"
- "바나나 200g"
- "소고기 150g"
- "고구마"

### 지원 음식 (20개)
닭가슴살, 계란, 소고기, 고구마, 바나나, 흰쌀밥, 삼겹살, 연어, 참치캔, 두부, 우유, 프로틴파우더, 그릭요거트, 아몬드, 오트밀, 브로콜리, 사과, 닭다리, 현미밥, 달걀프라이

---

**작성자**: jeankim  
**마지막 업데이트**: 2026-01-17  
**프로젝트 상태**: 진행 중 (Week 1 약 75% 완료)

---

*이 문서는 프로젝트 중간점검을 위해 작성되었습니다.*
