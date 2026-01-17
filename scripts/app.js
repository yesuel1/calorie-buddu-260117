/**
 * app.js - 메인 애플리케이션 로직
 * 메인 통합 및 검색 플로우 관리
 */

/**
 * 앱을 초기화합니다
 */
async function initApp() {
    // 인사 메시지는 chat.js에서 처리

    // API 상태 확인
    if (typeof checkAPIStatus === 'function') {
        checkAPIStatus();
    }
}

/**
 * 음식 검색을 처리합니다
 * @param {string} query - 검색 쿼리
 */
async function handleSearch(query) {
    try {
        // 1. 입력 파싱
        const parsed = parseInput(query);

        // 2. 음식 검색
        let foodData = await searchFood(parsed.foodName);

        if (!foodData) {
            // 검색 실패
            addMessage('bot', `"${parsed.foodName}"를 찾을 수 없어요 😅\n다른 이름으로 검색해보시겠어요?`);
            return;
        }

        // 3. 영양 정보 계산
        // calculateNutrition() 함수는 음식의 100g 기준 데이터를 받아서
        // 사용자가 입력한 분량에 맞게 영양 정보를 계산합니다.
        const nutritionData = calculateNutrition(foodData, parsed.amount);

        // 4. 영양 정보 카드 생성 및 표시
        // createNutritionCard() 함수는 영양 정보를 받아서 예쁜 HTML 카드를 만듭니다.
        // 이 카드에는 칼로리, 단백질, 탄수화물, 지방 정보와 격려 메시지가 포함됩니다.
        const nutritionCard = createNutritionCard(nutritionData);

        // addMessage() 함수는 텍스트뿐만 아니라 HTML 요소도 받을 수 있습니다.
        // 'bot' 메시지로 카드를 전달하면 채팅창에 카드가 표시됩니다.
        addMessage('bot', nutritionCard);

    } catch (error) {
        // 에러 로깅 (디버깅용)
        console.error('검색 중 오류:', error);
        addMessage('bot', '검색 중 오류가 발생했어요 😢\n잠시 후 다시 시도해주세요!');
    }
}

/**
 * 사진 업로드를 처리합니다 (Week 2)
 * @param {File} file - 이미지 파일
 */
async function handlePhotoUpload(file) {
    try {
        // 1. 로딩 메시지 표시
        addMessage('bot', '사진을 분석하고 있어요... 🔍');

        // 2. 이미지를 Data URL로 변환 (미리보기용)
        const imageDataUrl = await fileToDataURL(file);

        // 3. 음식 인식 (현재는 임시로 랜덤 음식 반환)
        // TODO: Vision API 연동 시 실제 인식 로직으로 교체
        const recognizedFood = await recognizeFood(imageDataUrl);

        // 4. 확인 카드 표시
        const confirmCard = createConfirmCard(imageDataUrl, recognizedFood);
        addMessage('bot', confirmCard);

    } catch (error) {
        console.error('사진 업로드 중 오류:', error);
        addMessage('bot', '사진 처리 중 오류가 발생했어요 😢\n다시 시도해주세요!');
    }
}

/**
 * File 객체를 Data URL로 변환합니다
 * @param {File} file - 이미지 파일
 * @returns {Promise<string>} Data URL
 */
function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
}

/**
 * 이미지에서 음식을 인식합니다 (Google Cloud Vision API)
 * @param {string} imageDataUrl - 이미지 Data URL
 * @returns {Promise<string>} 인식된 음식 이름
 */
async function recognizeFood(imageDataUrl) {
    // API 키 확인
    const apiKey = window.API_KEYS?.googleVision;

    // API 키가 없으면 Mock 모드
    if (!apiKey || apiKey === 'YOUR_GOOGLE_VISION_API_KEY_HERE') {
        console.warn('Google Vision API 키가 없습니다. Mock 모드로 실행합니다.');
        return await recognizeFoodMock();
    }

    try {
        // 1. Data URL에서 base64 부분만 추출
        const base64Image = imageDataUrl.split(',')[1];

        // 2. Google Vision API 호출
        const response = await fetch(
            `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requests: [
                        {
                            image: {
                                content: base64Image
                            },
                            features: [
                                {
                                    type: 'LABEL_DETECTION',
                                    maxResults: 10
                                }
                            ]
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`);
        }

        const data = await response.json();
        console.log('Google Vision API 응답:', data);

        // 3. 라벨에서 음식 추출
        const labels = data.responses[0]?.labelAnnotations || [];

        // 4. 음식 관련 라벨 찾기
        const foodLabel = findFoodLabel(labels);

        if (foodLabel) {
            // 5. 영어 → 한글 변환
            const koreanFood = translateToKorean(foodLabel);
            return koreanFood;
        }

        // 음식을 찾지 못한 경우
        throw new Error('음식을 인식하지 못했습니다');

    } catch (error) {
        console.error('Google Vision API 오류:', error);

        // 에러 발생 시 Mock 모드로 폴백
        console.warn('API 오류로 인해 Mock 모드로 전환합니다.');
        return await recognizeFoodMock();
    }
}

/**
 * Mock 음식 인식 (API 키 없을 때)
 * @returns {Promise<string>} 랜덤 음식 이름
 */
async function recognizeFoodMock() {
    // 1초 대기 (API 호출 시뮬레이션)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const sampleFoods = ['닭가슴살', '계란', '삼겹살', '치킨', '김밥', '라면'];
    const randomFood = sampleFoods[Math.floor(Math.random() * sampleFoods.length)];

    return randomFood;
}

/**
 * 라벨 목록에서 음식 관련 라벨 찾기
 * @param {Array} labels - Vision API 라벨 배열
 * @returns {string|null} 음식 라벨 (영어)
 */
function findFoodLabel(labels) {
    // 음식 관련 키워드
    const foodKeywords = [
        'food', 'dish', 'cuisine', 'meal', 'meat', 'chicken', 'beef',
        'pork', 'fish', 'rice', 'noodle', 'salad', 'soup', 'pizza',
        'burger', 'sandwich', 'sushi', 'ramen', 'pasta', 'steak'
    ];

    // 신뢰도가 높은 순서대로 음식 라벨 찾기
    for (const label of labels) {
        const description = label.description.toLowerCase();

        // 'Food' 라벨은 너무 일반적이므로 두 번째 라벨 확인
        if (description === 'food') {
            continue;
        }

        // 음식 관련 키워드 포함 여부 확인
        if (foodKeywords.some(keyword => description.includes(keyword))) {
            return label.description;
        }
    }

    // 음식 키워드를 못 찾으면 첫 번째 라벨 반환 (Food 제외)
    for (const label of labels) {
        if (label.description.toLowerCase() !== 'food') {
            return label.description;
        }
    }

    return labels[0]?.description || null;
}

/**
 * 영어 음식명을 한글로 변환합니다
 * @param {string} englishFood - 영어 음식 이름
 * @returns {string} 한글 음식 이름
 */
function translateToKorean(englishFood) {
    // 영어 → 한글 음식명 매핑 테이블
    const foodTranslations = {
        // 육류
        'chicken breast': '닭가슴살',
        'chicken': '치킨',
        'chicken thigh': '닭다리',
        'pork belly': '삼겹살',
        'pork': '돼지고기',
        'beef': '소고기',
        'steak': '스테이크',
        'meat': '고기',
        'rib': '갈비',

        // 해산물
        'salmon': '연어',
        'fish': '생선',
        'tuna': '참치',
        'shrimp': '새우',
        'crab': '게',

        // 계란/유제품
        'egg': '계란',
        'fried egg': '달걀프라이',
        'milk': '우유',
        'cheese': '치즈',
        'yogurt': '요거트',
        'tofu': '두부',

        // 밥/면
        'rice': '밥',
        'fried rice': '볶음밥',
        'noodle': '면',
        'ramen': '라면',
        'pasta': '파스타',
        'spaghetti': '스파게티',
        'jajangmyeon': '짜장면',

        // 채소/과일
        'broccoli': '브로콜리',
        'banana': '바나나',
        'apple': '사과',
        'sweet potato': '고구마',
        'potato': '감자',
        'salad': '샐러드',

        // 한식
        'kimchi': '김치',
        'kimchi stew': '김치찌개',
        'doenjang stew': '된장찌개',
        'bulgogi': '불고기',
        'bibimbap': '비빔밥',
        'gimbap': '김밥',
        'kimbap': '김밥',
        'tteokbokki': '떡볶이',
        'sundae': '순대',
        'samgyetang': '삼계탕',

        // 중식
        'jjamppong': '짬뽕',
        'sweet and sour pork': '탕수육',
        'dumpling': '만두',

        // 양식/패스트푸드
        'pizza': '피자',
        'burger': '햄버거',
        'hamburger': '햄버거',
        'sandwich': '샌드위치',
        'hot dog': '핫도그',
        'french fries': '감자튀김',

        // 기타
        'soup': '국',
        'stew': '찌개',
        'dish': '요리',
        'meal': '식사',
        'bread': '빵',
        'cake': '케이크',
        'cookie': '쿠키'
    };

    // 소문자로 변환해서 매핑 테이블 검색
    const lowerFood = englishFood.toLowerCase();

    // 정확히 일치하는 경우
    if (foodTranslations[lowerFood]) {
        return foodTranslations[lowerFood];
    }

    // 부분 일치 검색 (예: "Chicken breast" → "닭가슴살")
    for (const [eng, kor] of Object.entries(foodTranslations)) {
        if (lowerFood.includes(eng) || eng.includes(lowerFood)) {
            return kor;
        }
    }

    // 매핑되지 않은 경우 원래 영어 이름 반환
    // (사용자가 수정할 수 있음)
    return englishFood;
}

// 사진 버튼 이벤트 (Week 2)
function initPhotoButton() {
    const photoButton = document.getElementById('image-btn');
    const photoInput = document.getElementById('image-input');

    if (photoButton && photoInput) {
        // 사진 버튼 클릭 시 파일 선택 다이얼로그 열기
        photoButton.addEventListener('click', () => {
            photoInput.click();
        });

        // 파일 선택 시 처리
        photoInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];

            if (file) {
                // 이미지 파일인지 확인
                if (!file.type.startsWith('image/')) {
                    addMessage('bot', '이미지 파일만 업로드할 수 있어요! 📸\nJPG, PNG 등의 형식을 사용해주세요.');
                    return;
                }

                // 파일 크기 체크 (5MB 제한)
                if (file.size > 5 * 1024 * 1024) {
                    addMessage('bot', '이미지 파일이 너무 커요! 😅\n5MB 이하의 이미지를 선택해주세요.');
                    return;
                }

                // 사진 업로드 처리
                await handlePhotoUpload(file);
            }

            // 같은 파일 재선택 가능하도록 초기화
            photoInput.value = '';
        });
    }
}

// DOMContentLoaded 이벤트
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initPhotoButton();
});

// 전역 에러 핸들러
window.addEventListener('error', (event) => {
    console.error('전역 에러:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('처리되지 않은 Promise 거부:', event.reason);
});
