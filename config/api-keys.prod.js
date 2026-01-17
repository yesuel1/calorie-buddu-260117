/**
 * API Keys Configuration for Production (Vercel)
 *
 * 프로덕션 환경에서 사용할 API 키 설정
 * 보안을 위해 리퍼러 제한이 설정된 키를 사용하세요
 */

window.API_KEYS = {
    // 식약처 식품영양성분 DB API
    foodSafety: 'YOUR_API_KEY_HERE',

    // Clarifai Vision API
    clarifai: 'YOUR_CLARIFAI_KEY_HERE',

    // Google Cloud Vision API
    // 리퍼러 제한 설정:
    // - https://calorie-buddu-260117-*.vercel.app/*
    // - https://calorie-buddu-260117.vercel.app/*
    googleVision: 'AIzaSyBVBs3tIehsPn8uGMfL-VgdXfWSMEZGQ9s'
};
