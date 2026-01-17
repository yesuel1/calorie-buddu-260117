# CalorieBuddy 💪

> 운동하는 사람을 위한 칼로리 챗봇 MVP

음식 이름을 입력하거나 사진을 찍으면 칼로리와 영양 정보를 알려주는 웹 애플리케이션입니다.

## 🎯 프로젝트 개요

**타겟 사용자**: 운동하는 사람 (헬스, 크로스핏, 보디빌딩 등)
**주요 기능**:
- 텍스트 검색으로 음식 칼로리 조회
- 사진 인식으로 음식 검색 (Week 2 예정)
- 단백질 중심의 영양 정보 표시
- 운동 톤의 격려 메시지

**기술 스택**:
- HTML5 + CSS3 + Vanilla JavaScript
- 식약처 식품영양성분 DB API
- Vercel 배포

## 📁 프로젝트 구조

```
calorie-chatbot-mvp/
├── index.html              # 메인 페이지
├── styles/
│   ├── main.css           # 전역 스타일
│   ├── chat.css           # 챗봇 UI
│   └── card.css           # 영양 정보 카드
├── scripts/
│   ├── app.js             # 메인 로직
│   ├── chat.js            # 챗봇 UI 핸들러
│   ├── search.js          # 검색 로직
│   ├── nutrition.js       # 영양 정보 처리
│   └── api.js             # API 래퍼
├── data/
│   ├── foods.json         # 로컬 음식 DB
│   └── messages.json      # 챗봇 메시지
├── config/
│   └── api-keys.js        # API 키 (gitignore)
└── README.md
```

## 🚀 시작하기

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd calorie-chatbot-mvp
```

### 2. API 키 설정

#### 식약처 API 키 발급

1. [공공데이터포털](https://www.data.go.kr/) 회원가입
2. "식품영양성분DB" 검색
3. 활용신청 후 API 키 발급
4. `config/api-keys.js` 파일에서 `YOUR_API_KEY_HERE`를 실제 키로 교체

```javascript
window.API_KEYS = {
    foodSafety: '여기에_실제_API_키_입력',
    clarifai: 'YOUR_CLARIFAI_KEY_HERE' // Week 2
};
```

### 3. 로컬 실행

정적 웹 서버를 사용하여 실행:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (http-server 설치 필요)
npx http-server -p 8000

# VS Code Live Server 확장 사용
```

브라우저에서 `http://localhost:8000` 접속

### 4. Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 📋 Week 1 Task 체크리스트

### Day 1-2: 프로젝트 세팅 & HTML 구조
- [x] Task 1.1.1: 프로젝트 초기화
- [x] Task 1.1.2: index.html 마크업
- [x] Task 1.1.3: 챗봇 컨테이너 HTML

### Day 2-3: CSS 스타일링
- [x] Task 1.2.1: main.css - 전역 스타일
- [x] Task 1.2.2: chat.css - 챗봇 UI
- [x] Task 1.2.3: card.css - 영양 정보 카드

### Day 3-4: 챗봇 UI 로직
- [x] Task 1.3.1: chat.js - 메시지 렌더링
- [x] Task 1.3.2: chat.js - 입력 핸들러
- [x] Task 1.3.3: messages.json - 메시지 템플릿

### Day 4-5: 텍스트 검색 로직
- [x] Task 1.4.1: search.js - 입력 파싱
- [x] Task 1.4.2: foods.json - 로컬 데이터베이스
- [x] Task 1.4.3: search.js - 로컬 검색
- [x] Task 1.4.4: nutrition.js - 분량 계산

### Day 5-6: API 연동
- [x] Task 1.5.1: API 키 설정
- [x] Task 1.5.2: api.js - 식약처 API 래퍼
- [x] Task 1.5.3: search.js - API 통합

### Day 6-7: 영양 정보 카드
- [x] Task 1.6.1: nutrition.js - 카드 생성 함수 (createNutritionCard)
- [x] Task 1.6.2: nutrition.js - 격려 메시지 생성
- [x] Task 1.6.3: app.js - 메인 통합

### Day 7-8: Week 1 마무리
- [x] Task 1.7.1: 기능 테스트
- [x] Task 1.7.2: 버그 수정 및 코드 정리

## 🧪 테스트

### 로컬 음식 검색 테스트

다음 음식들은 로컬 DB에 저장되어 있습니다:

- 닭가슴살, 계란, 삼겹살, 소고기, 연어
- 참치캔, 두부, 흰쌀밥, 고구마, 바나나
- 우유, 프로틴파우더, 김치찌개, 된장찌개
- 불고기, 치킨샐러드, 그릭요거트, 아몬드
- 오트밀, 브로콜리

### 입력 예시

```
닭가슴살
닭가슴살 150g
삼겹살 200
밥 2인분
```

## 📊 개발 진행 상황

- [x] **Week 1**: 기본 UI + 텍스트 검색 + HTML 영양 카드 (완료 ✅)
- [ ] **Week 2**: 사진 인식 추가
- [ ] **Week 3**: 다듬기 & 배포

## 🎨 주요 기능 (Week 1)

### 1. 텍스트 검색
- 음식명 입력 시 영양 정보 표시
- 분량 자동 파싱 (100g, 2인분 등)
- 로컬 DB 우선 검색 → API fallback

### 2. 영양 정보 카드 (HTML 카드)
- 그라디언트 배경의 예쁜 카드 UI
- 칼로리, 단백질, 탄수화물, 지방 표시
- 단백질 등급 시스템 (⭐⭐⭐) - 자동 별점 표시
- 운동 톤의 격려 메시지 (카드 하단에 통합)
- 카드 등장 애니메이션 효과

### 3. 챗봇 UI
- 친근한 대화형 인터페이스
- 부드러운 애니메이션
- 모바일 반응형 디자인

## 🔜 다음 단계 (Week 2)

### 핵심 기능
- [ ] 사진 업로드 기능
- [ ] Clarifai Vision API 연동
- [ ] 음식 인식 및 확인 UI
- [ ] 에러 핸들링 개선

### 추가 개선 아이디어
- [ ] 일일 칼로리/단백질 트래킹 기능
- [ ] 검색 히스토리 저장
- [ ] 즐겨찾기 음식 기능
- [ ] 여러 음식 합산 계산
- [ ] 음식별 상세 영양소 정보 (비타민, 미네랄)
- [ ] PWA 지원 (오프라인 동작)
- [ ] 다크 모드

## 📝 개발 문서

- [기획서](../.claude/skills/socrates/calorie-chatbot-mvp-spec.md)
- [Task 리스트](../.claude/skills/tasks-generator/calorie-chatbot-tasks.md)

## 🤝 기여하기

이 프로젝트는 개인 학습 프로젝트입니다.

## 📄 라이선스

MIT License

## 👨‍💻 개발자

- **jeankim**
- 프로젝트 기간: 2026-01-16 ~ (진행 중)
- Skill 기반 개발 (Socrates + Tasks-Generator + Project-Bootstrap)

---

**Made with 💪 by CalorieBuddy Team**
