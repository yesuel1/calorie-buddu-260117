# Google Cloud Vision API 설정 가이드 🔑

> CalorieBuddy에서 Google Cloud Vision API를 사용하여 음식 이미지를 인식하는 방법

## 📋 준비 사항

- Google 계정 (Gmail)
- 신용카드 (무료 사용이지만 등록 필요)

---

## 🚀 1단계: Google Cloud Console 접속

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Google 계정으로 로그인

---

## 🏗️ 2단계: 프로젝트 생성

1. 상단 프로젝트 선택 드롭다운 클릭
2. **"새 프로젝트"** 클릭
3. 프로젝트 이름: `CalorieBuddy` (또는 원하는 이름)
4. **"만들기"** 클릭
5. 프로젝트가 생성될 때까지 대기 (약 30초)

---

## 💳 3단계: 결제 계정 설정

**중요**: 무료 사용이지만 결제 정보 등록 필요

1. 좌측 메뉴 → **"결제"** 클릭
2. **"결제 계정 연결"** 클릭
3. 신용카드 정보 입력
4. **무료 크레딧 $300** 자동 제공 (12개월간)

**참고**:
- Vision API 무료 한도: **월 1,000건**
- 무료 한도 초과 시에도 자동 과금 안 됨 (수동 설정 필요)

---

## 🔌 4단계: Vision API 활성화

1. 좌측 메뉴 → **"API 및 서비스"** → **"라이브러리"**
2. 검색창에 **"Vision API"** 입력
3. **"Cloud Vision API"** 선택
4. **"사용 설정"** 클릭
5. 활성화될 때까지 대기 (약 1분)

---

## 🔑 5단계: API 키 생성

### 방법 1: API 키 (간단, 권장)

1. 좌측 메뉴 → **"API 및 서비스"** → **"사용자 인증 정보"**
2. 상단 **"+ 사용자 인증 정보 만들기"** 클릭
3. **"API 키"** 선택
4. API 키가 생성됨 (예: `AIzaSyABC123...`)
5. **복사** 버튼 클릭하여 저장

### API 키 제한 설정 (보안)

1. 생성된 API 키 옆 **"편집"** 아이콘 클릭
2. **"API 제한사항"** → **"키 제한"** 선택
3. **"Cloud Vision API"** 체크
4. **"저장"** 클릭

### HTTP 리퍼러 제한 (선택사항)

1. **"애플리케이션 제한사항"** → **"HTTP 리퍼러"** 선택
2. 리퍼러 추가:
   ```
   localhost:*
   127.0.0.1:*
   https://your-domain.com/*
   ```
3. **"저장"** 클릭

---

## 📝 6단계: API 키 설정

### 방법 A: config/api-keys.js 수정

```bash
cd /Users/jeankim/development/claude_code/vibelabs_skill_260110/calorie-chatbot-mvp
```

`config/api-keys.js` 파일 열기:

```javascript
window.API_KEYS = {
    foodSafety: 'YOUR_FOOD_SAFETY_KEY_HERE',
    clarifai: 'YOUR_CLARIFAI_KEY_HERE',

    // 여기에 Google Vision API 키 추가
    googleVision: 'AIzaSyABC123...' // 실제 API 키로 교체
};
```

### 방법 B: 환경변수 (프로덕션)

```javascript
// Vercel 배포 시
// 환경변수: GOOGLE_VISION_API_KEY
```

---

## ✅ 7단계: 테스트

1. 브라우저에서 `http://localhost:8888` 접속
2. 📷 버튼 클릭
3. 음식 사진 업로드
4. 콘솔에서 API 응답 확인 (F12 → Console 탭)

### 예상 응답:

```json
{
  "responses": [{
    "labelAnnotations": [
      { "description": "Food", "score": 0.98 },
      { "description": "Chicken breast", "score": 0.95 },
      { "description": "Meat", "score": 0.92 }
    ]
  }]
}
```

---

## 🎯 무료 사용 한도

| 항목 | 무료 한도 | 초과 시 비용 |
|------|-----------|-------------|
| **Label Detection** | 월 1,000건 | $1.50 / 1,000건 |
| **무료 크레딧** | $300 (12개월) | - |

**예상 비용 계산**:
- 하루 10장 업로드 = 300장/월 → **무료**
- 하루 50장 업로드 = 1,500장/월 → 500장만 과금 → **$0.75/월**

---

## 🔒 보안 주의사항

### ⚠️ API 키 노출 방지

1. **절대 GitHub에 커밋하지 말 것**
   - `.gitignore`에 `config/api-keys.js` 추가됨

2. **브라우저 개발자 도구에서 보임**
   - 프로덕션에서는 백엔드 프록시 사용 권장

3. **리퍼러 제한 설정 필수**
   - 다른 사이트에서 API 키 도용 방지

---

## 🆘 문제 해결

### 1. "API not enabled" 에러

**해결**: Vision API 활성화 확인
```
Google Cloud Console → API 및 서비스 → 라이브러리 → Vision API → 사용 설정
```

### 2. "Quota exceeded" 에러

**해결**: 무료 한도 초과
- 사용량 확인: API 및 서비스 → 할당량
- 다음 달까지 대기 또는 결제 설정

### 3. "Invalid API key" 에러

**해결**:
- API 키 복사 오류 확인
- API 키 제한사항 확인 (Vision API 허용되었는지)

### 4. CORS 에러

**해결**:
- 로컬 서버에서 실행 (`python3 -m http.server`)
- `file://` 프로토콜에서는 작동 안 함

---

## 📊 사용량 모니터링

1. Google Cloud Console → **"결제"** → **"보고서 및 비용"**
2. Vision API 사용량 확인
3. 알림 설정 (예: $5 초과 시 이메일)

---

## 🔄 대안 (API 키 없이 테스트)

API 키 없이 테스트하려면:

1. **Mock 모드 유지** (현재 상태)
   - 랜덤 음식 반환
   - UI/UX 테스트 가능

2. **TensorFlow.js 사용**
   - 완전 무료
   - API 키 불필요
   - 브라우저에서 실행

---

## 📚 참고 링크

- [Google Cloud Vision API 문서](https://cloud.google.com/vision/docs)
- [가격 정보](https://cloud.google.com/vision/pricing)
- [빠른 시작 가이드](https://cloud.google.com/vision/docs/quickstart-client-libraries)

---

**작성일**: 2026-01-17
**다음 단계**: API 키 발급 후 `config/api-keys.js`에 추가
