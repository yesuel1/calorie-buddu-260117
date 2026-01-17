/**
 * API Keys Configuration Template
 *
 * 사용 방법:
 * 1. 이 파일을 api-keys.js로 복사
 * 2. YOUR_API_KEY_HERE를 실제 API 키로 교체
 * 3. api-keys.js는 .gitignore에 포함되어 커밋되지 않음
 */

window.API_KEYS = {
    // 식약처 식품영양성분 DB API
    // 발급: https://www.data.go.kr/ -> "식품영양성분DB" 검색
    foodSafety: 'YOUR_FOOD_SAFETY_API_KEY_HERE',

    // Clarifai Vision API (선택사항)
    clarifai: 'YOUR_CLARIFAI_KEY_HERE',

    // Google Cloud Vision API
    // 발급 방법: GOOGLE_VISION_SETUP.md 참조
    // Mock 모드: 키가 없으면 자동으로 Mock 모드로 동작
    googleVision: 'YOUR_GOOGLE_VISION_API_KEY_HERE'
};

// 환경 변수 지원 (Vercel 등)
if (typeof process !== 'undefined' && process.env) {
    if (process.env.GOOGLE_VISION_API_KEY) {
        window.API_KEYS.googleVision = process.env.GOOGLE_VISION_API_KEY;
    }
    if (process.env.FOOD_SAFETY_API_KEY) {
        window.API_KEYS.foodSafety = process.env.FOOD_SAFETY_API_KEY;
    }
}
