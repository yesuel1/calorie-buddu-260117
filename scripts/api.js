/**
 * api.js - API 호출 래퍼
 * Task 1.5.2: 식약처 API 래퍼
 */

// Task 1.5.1: API 키 로드 (config/api-keys.js에서)
let API_KEYS = {};

// API 키 파일이 있으면 로드
if (typeof window.API_KEYS !== 'undefined') {
    API_KEYS = window.API_KEYS;
}

// Task 1.5.2: fetchFoodData(foodName) 함수
/**
 * 식약처 API에서 음식 데이터를 가져옵니다
 * @param {string} foodName - 검색할 음식 이름
 * @returns {Object|null} 음식 데이터 또는 null
 */
async function fetchFoodData(foodName) {
    // TODO: Task 1.5.2 - API 엔드포인트 설정
    // 식약처 식품영양성분 DB API
    // https://www.foodsafetykorea.go.kr/api/openApiInfo.do?menu_grp=MENU_GRP31&menu_no=661&show_cnt=10&start_idx=1&svc_no=COOKRCP01

    if (!API_KEYS.foodSafety) {
        console.warn('식약처 API 키가 설정되지 않았습니다');
        return null;
    }

    try {
        // TODO: Task 1.5.2 - 요청 파라미터 구성
        const apiKey = API_KEYS.foodSafety;
        const serviceId = 'I2790'; // 식품영양성분DB
        const dataType = 'json';
        const startIdx = 1;
        const endIdx = 10;

        const url = `https://openapi.foodsafetykorea.go.kr/api/${apiKey}/${serviceId}/${dataType}/${startIdx}/${endIdx}/DESC_KOR=${encodeURIComponent(foodName)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API 요청 실패: ${response.status}`);
        }

        const data = await response.json();

        // TODO: Task 1.5.2 - 응답 파싱 및 정규화
        if (data[serviceId] && data[serviceId].row && data[serviceId].row.length > 0) {
            const foodData = data[serviceId].row[0];
            return normalizeFoodData(foodData);
        }

        return null;

    } catch (error) {
        // TODO: Task 1.5.2 - 에러 핸들링
        console.error('API 호출 에러:', error);
        return null;
    }
}

/**
 * API 응답을 로컬 포맷으로 변환합니다
 * @param {Object} apiData - API 응답 데이터
 * @returns {Object} 정규화된 음식 데이터
 */
function normalizeFoodData(apiData) {
    // TODO: Task 1.5.2 - API 응답 구조에 따라 변환
    // 식약처 API 응답 필드명에 맞춰 매핑
    return {
        name: apiData.DESC_KOR || apiData.FOOD_NM_KR,
        calories: parseFloat(apiData.ENERC_KCAL || apiData.NUTR_CONT1 || 0),
        protein: parseFloat(apiData.PROT_G || apiData.NUTR_CONT3 || 0),
        carbs: parseFloat(apiData.CHOCDF_G || apiData.NUTR_CONT2 || 0),
        fat: parseFloat(apiData.FAT_G || apiData.NUTR_CONT4 || 0),
        sodium: parseFloat(apiData.NA_MG || apiData.NUTR_CONT5 || 0),
        sugar: parseFloat(apiData.SUGAR_G || 0),
        fiber: parseFloat(apiData.FIBTG_G || 0),
        source: 'api'
    };
}

/**
 * Clarifai Vision API로 음식 이미지를 인식합니다 (Week 2)
 * @param {string} imageBase64 - Base64 인코딩된 이미지
 * @returns {Array} 인식된 음식 후보 배열
 */
async function recognizeFood(imageBase64) {
    // ============================================================
    // Week 2 TODO - Clarifai Vision API 연동
    // ============================================================
    // 1. Clarifai API 엔드포인트로 POST 요청
    // 2. imageBase64를 body에 포함
    // 3. 응답에서 food concepts 추출
    // 4. 신뢰도(confidence) 순으로 정렬
    // 5. 상위 3개 후보 반환
    //
    // API 키: config/api-keys.js의 clarifai
    // 참고: WEEK2_IDEAS.md 문서 참조
    // ============================================================

    return []; // Week 2에서 실제 구현
}

// API 상태 확인
function checkAPIStatus() {
    const status = {
        foodSafety: !!API_KEYS.foodSafety,
        clarifai: !!API_KEYS.clarifai
    };

    console.log('API Status:', status);
    return status;
}
