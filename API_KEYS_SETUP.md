# API 키 설정 가이드

## 개요

CalorieBuddy는 환경에 따라 다른 API 키 파일을 로드합니다:
- **로컬 개발**: `config/api-keys.js` (gitignore)
- **프로덕션 (Vercel)**: `config/api-keys.prod.js` (git 커밋)

## 로컬 개발 설정

### 1. API 키 파일 생성

```bash
cd config
cp api-keys.template.js api-keys.js
```

### 2. API 키 입력

`config/api-keys.js` 파일을 열고 YOUR_API_KEY_HERE를 실제 키로 교체:

```javascript
window.API_KEYS = {
    foodSafety: '실제_식약처_API_키',
    clarifai: '실제_Clarifai_키',
    googleVision: '실제_Google_Vision_키'
};
```

### 3. 로컬 서버 실행

```bash
./start-server.sh
```

브라우저에서 `http://localhost:8000` 접속

## 프로덕션 배포 설정

### Vercel에 배포할 때

`config/api-keys.prod.js` 파일에 프로덕션용 API 키가 이미 설정되어 있습니다.

**중요: 프로덕션 API 키는 반드시 리퍼러 제한을 설정하세요**

#### Google Vision API 리퍼러 제한 설정

1. Google Cloud Console 접속
2. API 및 서비스 > 사용자 인증 정보
3. API 키 편집
4. 애플리케이션 제한사항 > HTTP 리퍼러 선택
5. 다음 리퍼러 추가:
   ```
   https://calorie-buddu-260117-*.vercel.app/*
   https://calorie-buddu-260117.vercel.app/*
   localhost:*
   127.0.0.1:*
   ```

## 파일 구조

```
config/
├── api-keys.js           # 로컬 전용 (gitignore)
├── api-keys.template.js  # 템플릿 (git 커밋)
└── api-keys.prod.js      # 프로덕션용 (git 커밋)
```

## 환경 감지 로직

`index.html`에서 자동으로 환경을 감지:

```javascript
// localhost/127.0.0.1 = 로컬 개발
// 그 외 = 프로덕션
const isProduction = !['localhost', '127.0.0.1'].some(host =>
    window.location.hostname.includes(host)
);
```

## Mock 모드

API 키가 없거나 로드에 실패하면 자동으로 Mock 모드로 전환됩니다:
- 사진 업로드 시 랜덤 음식 반환 (닭가슴살, 계란, 삼겹살, 치킨, 김밥, 라면)
- 개발 및 테스트 시 API 할당량을 소비하지 않음

## API 키 발급 방법

### Google Cloud Vision API

상세 가이드: `GOOGLE_VISION_SETUP.md` 참조

1. Google Cloud Console 접속
2. 프로젝트 생성
3. Vision API 활성화
4. API 키 생성
5. 리퍼러 제한 설정

**무료 한도**: 월 1,000건

### 식약처 식품영양성분 DB API

1. https://www.data.go.kr/ 접속
2. 회원가입 및 로그인
3. "식품영양성분DB" 검색
4. 활용신청 후 키 발급

**무료**: 제한 없음

## 보안 주의사항

### ⚠️ 프론트엔드에서 API 키 노출

프론트엔드 앱에서는 API 키가 브라우저에 노출됩니다. 다음 방법으로 보호:

1. **리퍼러 제한 필수**
   - 허용된 도메인에서만 API 호출 가능

2. **API 키 권한 제한**
   - Vision API만 사용하도록 제한
   - 다른 Google Cloud 서비스는 비활성화

3. **사용량 모니터링**
   - Google Cloud Console에서 일일 사용량 확인
   - 예산 알림 설정

4. **키 순환**
   - 정기적으로 API 키 재발급
   - 이전 키는 비활성화

### 권장: 백엔드 프록시 사용

프로덕션에서 더 안전한 방법:
- Vercel Serverless Functions 사용
- API 키를 환경 변수로 관리
- 프론트엔드는 프록시 엔드포인트만 호출

## 문제 해결

### API 키 파일을 로드할 수 없습니다

**로컬 개발:**
```bash
# api-keys.js 파일이 존재하는지 확인
ls -la config/api-keys.js

# 없으면 템플릿에서 생성
cp config/api-keys.template.js config/api-keys.js
```

**Vercel 배포:**
```bash
# api-keys.prod.js가 커밋되었는지 확인
git ls-files config/api-keys.prod.js

# 없으면 추가
git add config/api-keys.prod.js
git commit -m "chore: add production API keys"
git push
```

### Mock 모드로 동작합니다

콘솔에서 다음 확인:
1. API 키 파일이 로드되었는지
2. `window.API_KEYS.googleVision` 값 확인
3. API 키가 'YOUR_API_KEY_HERE'가 아닌지 확인

### 403 에러: API 키 권한 없음

Google Cloud Console에서:
1. Vision API가 활성화되었는지 확인
2. API 키 제한사항에서 Vision API가 허용되었는지 확인
3. 리퍼러 제한이 현재 도메인을 포함하는지 확인

## 커밋 체크리스트

로컬 개발자:
- [ ] `config/api-keys.js` 절대 커밋하지 말 것
- [ ] `.gitignore`에 `config/api-keys.js` 포함 확인

프로덕션 배포:
- [ ] `config/api-keys.prod.js` 커밋
- [ ] 프로덕션 API 키에 리퍼러 제한 설정
- [ ] Google Cloud Console에서 사용량 모니터링 설정

---

**작성일**: 2026-01-17
**업데이트**: API 키 환경별 관리 시스템 구축
