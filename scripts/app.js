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

        if (!parsed.foodName) {
            // 음식명이 없는 경우
            const validationError = new Error('음식 이름이 필요합니다');
            validationError.name = 'ValidationError';
            throw validationError;
        }

        // 2. 음식 검색
        let foodData = await searchFood(parsed.foodName);

        if (!foodData) {
            // 검색 실패 - NOT_FOUND 에러 발생
            const notFoundError = new Error(`"${parsed.foodName}"를 찾을 수 없습니다`);
            notFoundError.status = 404;
            throw notFoundError;
        }

        // 3. 영양 정보 계산
        const nutritionData = calculateNutrition(foodData, parsed.amount);

        // 4. 영양 정보 카드 생성 및 표시
        const nutritionCard = createNutritionCard(nutritionData);
        addMessage('bot', nutritionCard);

    } catch (error) {
        // Week 3: 중앙 집중식 에러 핸들러 사용
        if (window.ErrorHandler) {
            window.ErrorHandler.handle(error, 'search', {
                retryFunction: () => handleSearch(query)
            });
        } else {
            // 폴백: ErrorHandler가 없는 경우 기본 메시지
            console.error('검색 중 오류:', error);
            addMessage('bot', '검색 중 오류가 발생했어요 😢\n잠시 후 다시 시도해주세요!');
        }
    }
}

/**
 * 사진 업로드를 처리합니다 (Week 2)
 * @param {File} file - 이미지 파일
 */
async function handlePhotoUpload(file) {
    try {
        // 1. 초기 로딩 메시지 표시 (Week 2 - Task 5: Enhanced feedback)
        addMessage('bot', '사진을 분석하고 있어요... 🔍\n잠시만 기다려주세요!');

        // 2. 이미지를 Data URL로 변환
        const originalDataUrl = await fileToDataURL(file);

        // 3. 이미지 리사이즈 (API 비용 절감)
        console.log('이미지 처리 중...');
        const resizedDataUrl = await resizeImage(originalDataUrl);

        // 4. 음식 인식 시작 알림
        console.log('AI 음식 인식 시작...');

        // 5. 음식 인식 (리사이즈된 이미지로 API 호출)
        const recognizedFood = await recognizeFood(resizedDataUrl);

        // 6. 확인 카드 표시 (원본 이미지로 미리보기)
        console.log('인식 완료! 확인 카드 표시 중...');
        const confirmCard = createConfirmCard(originalDataUrl, recognizedFood);
        addMessage('bot', confirmCard);

    } catch (error) {
        // Week 3: 중앙 집중식 에러 핸들러 사용
        if (window.ErrorHandler) {
            window.ErrorHandler.handle(error, 'photo', {
                retryFunction: () => {
                    // 재시도 시 파일 입력 다시 열기
                    const fileInput = document.getElementById('image-input');
                    if (fileInput) {
                        fileInput.click();
                    }
                }
            });
        } else {
            // 폴백: ErrorHandler가 없는 경우 기본 메시지
            console.error('사진 업로드 중 오류:', error);
            addMessage('bot', '사진 처리 중 오류가 발생했어요 😢\n다시 시도해주세요!');
        }
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
 * 이미지를 리사이즈하여 API 비용 절감 (Week 2 - Task 1)
 * @param {string} dataUrl - 원본 이미지 Data URL
 * @param {number} maxWidth - 최대 너비 (기본: 800px)
 * @param {number} maxHeight - 최대 높이 (기본: 800px)
 * @returns {Promise<string>} 리사이즈된 이미지 Data URL
 */
function resizeImage(dataUrl, maxWidth = 800, maxHeight = 800) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            // 원본 크기
            let width = img.width;
            let height = img.height;

            // 리사이즈가 필요없는 경우 (이미 충분히 작음)
            if (width <= maxWidth && height <= maxHeight) {
                console.log('이미지가 충분히 작아 리사이즈하지 않습니다:', { width, height });
                resolve(dataUrl);
                return;
            }

            // 가로세로 비율 유지하면서 리사이즈
            const aspectRatio = width / height;

            if (width > height) {
                // 가로가 더 긴 경우
                if (width > maxWidth) {
                    width = maxWidth;
                    height = width / aspectRatio;
                }
            } else {
                // 세로가 더 긴 경우
                if (height > maxHeight) {
                    height = maxHeight;
                    width = height * aspectRatio;
                }
            }

            // Canvas 생성 및 리사이즈
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // JPEG 85% 품질로 변환 (파일 크기 최적화)
            const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

            // 리사이즈 통계 로깅
            const originalSize = dataUrl.length;
            const resizedSize = resizedDataUrl.length;
            const reduction = ((1 - resizedSize / originalSize) * 100).toFixed(1);

            console.log('이미지 리사이즈 완료:', {
                original: { width: img.width, height: img.height, size: `${(originalSize / 1024).toFixed(1)}KB` },
                resized: { width, height, size: `${(resizedSize / 1024).toFixed(1)}KB` },
                reduction: `${reduction}%`
            });

            resolve(resizedDataUrl);
        };

        img.onerror = (e) => {
            console.error('이미지 로드 실패:', e);
            reject(new Error('이미지를 로드할 수 없습니다'));
        };

        img.src = dataUrl;
    });
}

/**
 * 이미지에서 음식을 인식합니다 (Google Cloud Vision API) - Week 2 Task 3: Enhanced
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

        // 2. Google Vision API 호출 (maxResults 증가: 10 → 15)
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
                                    maxResults: 15
                                }
                            ]
                        }
                    ]
                })
            }
        );

        // 3. HTTP 상태 코드별 에러 처리
        if (!response.ok) {
            let errorMessage = '';

            switch (response.status) {
                case 400:
                    errorMessage = '잘못된 요청입니다. 이미지 형식을 확인해주세요.';
                    break;
                case 403:
                    errorMessage = 'API 키 권한이 없습니다. API 키를 확인해주세요.';
                    break;
                case 429:
                    errorMessage = 'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
                    break;
                default:
                    errorMessage = `API 오류가 발생했습니다 (상태 코드: ${response.status})`;
            }

            console.error(`Google Vision API HTTP 오류 [${response.status}]:`, errorMessage);
            throw new Error(errorMessage);
        }

        const data = await response.json();

        // 4. API 응답 내부 에러 체크
        if (data.responses && data.responses[0]?.error) {
            const apiError = data.responses[0].error;
            console.error('Google Vision API 응답 오류:', apiError);
            throw new Error(`API 오류: ${apiError.message || '알 수 없는 오류'}`);
        }

        console.log('Google Vision API 응답:', data);

        // 5. 라벨 배열 유효성 검사
        const labels = data.responses[0]?.labelAnnotations || [];

        if (labels.length === 0) {
            console.warn('Vision API가 라벨을 반환하지 않았습니다.');
            throw new Error('이미지에서 객체를 인식할 수 없습니다');
        }

        // 6. 디버깅: 모든 라벨 로깅
        console.log('인식된 라벨 (신뢰도 순):');
        labels.forEach(label => {
            console.log(`  - ${label.description}: ${(label.score * 100).toFixed(1)}%`);
        });

        // 7. 음식 관련 라벨 찾기
        const foodLabel = findFoodLabel(labels);

        if (foodLabel) {
            console.log(`최종 선택된 음식 라벨: "${foodLabel}"`);

            // 8. 영어 → 한글 변환
            const koreanFood = translateToKorean(foodLabel);
            console.log(`한글 변환: "${foodLabel}" → "${koreanFood}"`);

            return koreanFood;
        }

        // 음식을 찾지 못한 경우
        console.warn('음식 관련 라벨을 찾지 못했습니다.');
        throw new Error('음식을 인식하지 못했습니다');

    } catch (error) {
        console.error('Google Vision API 오류:', error);

        // 사용자 친화적인 에러 메시지 표시
        if (error.message && !error.message.includes('Mock 모드')) {
            addMessage('bot', `⚠️ ${error.message}\n\nMock 모드로 전환합니다.`);
        }

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
 * 라벨 목록에서 음식 관련 라벨 찾기 (Week 2 - Task 2: Enhanced)
 * @param {Array} labels - Vision API 라벨 배열
 * @returns {string|null} 음식 라벨 (영어)
 */
function findFoodLabel(labels) {
    // 신뢰도 임계값 (70% 이상만 고려)
    const CONFIDENCE_THRESHOLD = 0.7;

    // 음식 관련 키워드 (70+ 확장)
    const foodKeywords = [
        // 기본
        'food', 'dish', 'cuisine', 'meal', 'ingredient',

        // 육류
        'meat', 'chicken', 'beef', 'pork', 'poultry', 'wing', 'thigh', 'breast',
        'duck', 'lamb', 'bacon', 'sausage', 'ham', 'rib',

        // 해산물
        'fish', 'salmon', 'tuna', 'shrimp', 'shellfish', 'seafood',
        'mackerel', 'squid', 'octopus', 'clam', 'oyster', 'crab',

        // 곡물/면
        'rice', 'grain', 'noodle', 'pasta', 'ramen', 'spaghetti',
        'macaroni', 'udon', 'soba', 'bread',

        // 채소/과일
        'vegetable', 'produce', 'salad', 'tomato', 'potato', 'carrot',
        'lettuce', 'spinach', 'cucumber', 'onion', 'garlic', 'mushroom',
        'cabbage', 'broccoli', 'fruit', 'banana', 'apple',

        // 계란/유제품
        'egg', 'milk', 'cheese', 'yogurt', 'tofu',

        // 한식
        'kimchi', 'bibimbap', 'bulgogi', 'gimbap', 'kimbap',
        'tteokbokki', 'jjigae', 'stew',

        // 조리법
        'fried', 'grilled', 'baked', 'boiled', 'steamed', 'roasted',
        'cooked', 'barbecue', 'bbq',

        // 기타
        'soup', 'broth', 'hot pot', 'pizza', 'burger', 'sandwich',
        'sushi', 'steak', 'snack', 'fast food'
    ];

    // 제외할 키워드 (음식이 아닌 것들)
    const excludeKeywords = [
        'plate', 'bowl', 'dish (tableware)', 'utensil', 'cutlery',
        'fork', 'knife', 'spoon', 'chopstick', 'table', 'tablecloth',
        'furniture', 'person', 'hand', 'finger', 'restaurant', 'kitchen'
    ];

    // 디버깅: 모든 라벨 로깅
    console.log('Vision API 라벨 (신뢰도와 함께):',
        labels.map(l => `${l.description} (${(l.score * 100).toFixed(1)}%)`).join(', ')
    );

    // 1단계: 신뢰도 필터링 (70% 이상)
    const confidentLabels = labels.filter(label => label.score >= CONFIDENCE_THRESHOLD);

    console.log(`신뢰도 ${CONFIDENCE_THRESHOLD * 100}% 이상 라벨:`,
        confidentLabels.map(l => l.description).join(', ')
    );

    // 2단계: 제외 키워드 필터링
    const filteredLabels = confidentLabels.filter(label => {
        const description = label.description.toLowerCase();
        return !excludeKeywords.some(keyword => description.includes(keyword.toLowerCase()));
    });

    // 3단계: 음식 키워드로 매칭 (신뢰도 높은 순)
    for (const label of filteredLabels) {
        const description = label.description.toLowerCase();

        // 'Food' 라벨은 너무 일반적이므로 스킵
        if (description === 'food') {
            console.log('일반적인 "Food" 라벨 스킵');
            continue;
        }

        // 음식 관련 키워드 포함 여부 확인
        const matchedKeyword = foodKeywords.find(keyword =>
            description.includes(keyword.toLowerCase())
        );

        if (matchedKeyword) {
            console.log(`음식 라벨 발견: "${label.description}" (키워드: ${matchedKeyword}, 신뢰도: ${(label.score * 100).toFixed(1)}%)`);
            return label.description;
        }
    }

    // 4단계: 음식 키워드를 못 찾으면 첫 번째 필터링된 라벨 반환 (Food 제외)
    for (const label of filteredLabels) {
        if (label.description.toLowerCase() !== 'food') {
            console.log(`폴백: 첫 번째 필터링된 라벨 사용 - "${label.description}"`);
            return label.description;
        }
    }

    // 5단계: 그래도 없으면 신뢰도 무시하고 원본 라벨에서 찾기
    console.warn('신뢰도 높은 음식 라벨을 찾지 못했습니다. 전체 라벨에서 검색합니다.');
    for (const label of labels) {
        if (label.description.toLowerCase() !== 'food') {
            console.log(`최종 폴백: "${label.description}" 사용`);
            return label.description;
        }
    }

    console.warn('음식 라벨을 찾지 못했습니다.');
    return labels[0]?.description || null;
}

/**
 * 영어 음식명을 한글로 변환합니다 (Week 2 - Task 4: Expanded)
 * @param {string} englishFood - 영어 음식 이름
 * @returns {string} 한글 음식 이름
 */
function translateToKorean(englishFood) {
    // 영어 → 한글 음식명 매핑 테이블 (100+ 확장)
    const foodTranslations = {
        // 육류 - 닭
        'chicken breast': '닭가슴살',
        'chicken': '치킨',
        'chicken thigh': '닭다리',
        'chicken leg': '닭다리',
        'chicken wing': '닭날개',
        'fried chicken': '후라이드치킨',
        'korean fried chicken': '한국식 치킨',
        'grilled chicken': '구운 닭고기',
        'roasted chicken': '로스트 치킨',

        // 육류 - 돼지
        'pork belly': '삼겹살',
        'pork': '돼지고기',
        'bacon': '베이컨',
        'sausage': '소시지',
        'ham': '햄',

        // 육류 - 소
        'beef': '소고기',
        'steak': '스테이크',
        'rib': '갈비',
        'short rib': '갈비',
        'brisket': '양지',

        // 육류 - 기타
        'meat': '고기',
        'duck': '오리고기',
        'lamb': '양고기',

        // 해산물
        'salmon': '연어',
        'fish': '생선',
        'tuna': '참치',
        'shrimp': '새우',
        'crab': '게',
        'mackerel': '고등어',
        'squid': '오징어',
        'octopus': '문어',
        'clam': '조개',
        'oyster': '굴',
        'shellfish': '조개류',
        'seafood': '해산물',

        // 계란 요리
        'egg': '계란',
        'fried egg': '달걀프라이',
        'boiled egg': '삶은 계란',
        'scrambled egg': '스크램블 에그',
        'poached egg': '수란',
        'omelette': '오믈렛',

        // 유제품
        'milk': '우유',
        'cheese': '치즈',
        'yogurt': '요거트',
        'butter': '버터',
        'cream': '크림',

        // 두부/콩
        'tofu': '두부',
        'soybean': '콩',

        // 밥/쌀
        'rice': '밥',
        'white rice': '흰쌀밥',
        'brown rice': '현미밥',
        'fried rice': '볶음밥',
        'rice bowl': '덮밥',

        // 면
        'noodle': '면',
        'ramen': '라면',
        'instant noodles': '라면',
        'pasta': '파스타',
        'spaghetti': '스파게티',
        'macaroni': '마카로니',
        'udon': '우동',
        'soba': '소바',
        'jajangmyeon': '짜장면',

        // 채소
        'vegetable': '채소',
        'salad': '샐러드',
        'broccoli': '브로콜리',
        'potato': '감자',
        'sweet potato': '고구마',
        'tomato': '토마토',
        'carrot': '당근',
        'lettuce': '상추',
        'spinach': '시금치',
        'cucumber': '오이',
        'onion': '양파',
        'garlic': '마늘',
        'mushroom': '버섯',
        'cabbage': '양배추',

        // 과일
        'fruit': '과일',
        'banana': '바나나',
        'apple': '사과',
        'orange': '오렌지',
        'grape': '포도',
        'strawberry': '딸기',
        'watermelon': '수박',
        'pear': '배',
        'peach': '복숭아',

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
        'blood sausage': '순대',
        'samgyetang': '삼계탕',
        'korean bbq': '한국식 바베큐',
        'galbi': '갈비',
        'jjigae': '찌개',
        'army stew': '부대찌개',

        // 중식
        'jjamppong': '짬뽕',
        'sweet and sour pork': '탕수육',
        'sweet and sour': '탕수육',
        'dumpling': '만두',
        'wonton': '완탕',
        'fried rice': '볶음밥',

        // 일식
        'sushi': '초밥',
        'tempura': '튀김',
        'teriyaki': '데리야끼',
        'katsu': '돈까스',
        'tonkatsu': '돈까스',

        // 양식
        'pizza': '피자',
        'burger': '햄버거',
        'hamburger': '햄버거',
        'sandwich': '샌드위치',
        'hot dog': '핫도그',
        'french fries': '감자튀김',
        'carbonara': '까르보나라',
        'lasagna': '라자냐',
        'risotto': '리조또',

        // 국/탕/찌개
        'soup': '국',
        'stew': '찌개',
        'broth': '육수',
        'hot pot': '전골',

        // 빵/디저트
        'bread': '빵',
        'toast': '토스트',
        'cake': '케이크',
        'cookie': '쿠키',
        'pastry': '페이스트리',

        // 일반
        'dish': '요리',
        'meal': '식사',
        'food': '음식',
        'snack': '간식',
        'fast food': '패스트푸드'
    };

    // 소문자로 변환해서 매핑 테이블 검색
    const lowerFood = englishFood.toLowerCase();

    // 정확히 일치하는 경우
    if (foodTranslations[lowerFood]) {
        console.log(`번역 매핑 발견: "${englishFood}" → "${foodTranslations[lowerFood]}"`);
        return foodTranslations[lowerFood];
    }

    // 부분 일치 검색 (예: "Chicken breast" → "닭가슴살")
    for (const [eng, kor] of Object.entries(foodTranslations)) {
        if (lowerFood.includes(eng) || eng.includes(lowerFood)) {
            console.log(`부분 매핑 발견: "${englishFood}" → "${kor}" (키워드: ${eng})`);
            return kor;
        }
    }

    // 매핑되지 않은 경우: 영어 이름을 보기 좋게 포맷
    // 각 단어의 첫 글자를 대문자로
    const formattedFood = englishFood
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    console.warn(`번역되지 않은 음식: "${englishFood}" → 포맷된 영어 "${formattedFood}" 반환`);
    console.warn('translateToKorean()에 이 음식을 추가하면 사용자 경험이 개선됩니다.');

    // 사용자가 확인 카드에서 수정할 수 있음
    return formattedFood;
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
