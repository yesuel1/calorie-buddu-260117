/**
 * nutrition.js - 영양 정보 처리 및 카드 생성
 * 분량 계산, 단백질 등급, 카드 UI 생성을 담당합니다
 */
/**
 * 100g 기준 데이터를 비율로 계산하여 분량에 맞는 영양 정보를 반환합니다
 * @param {Object} baseData - 기본 음식 데이터 (100g 기준)
 *   { name: string, calories: number, protein: number, carbs: number, fat: number }
 * @param {number} amount - 계산할 분량 (g)
 * @returns {Object} 계산된 영양 정보
 */
function calculateNutrition(baseData, amount) {
    // 100g 기준 데이터를 비율로 계산
    const ratio = amount / 100;

    // calories / protein / carbs / fat 계산 (소수점 1자리로 반올림)
    const calories = Math.round(baseData.calories * ratio * 10) / 10;
    const protein = Math.round(baseData.protein * ratio * 10) / 10;
    const carbs = Math.round(baseData.carbs * ratio * 10) / 10;
    const fat = Math.round(baseData.fat * ratio * 10) / 10;

    // 단백질 등급 계산
    const proteinLevel = getProteinLevel(protein);
    
    return {
        name: baseData.name,
        amount: amount,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat,
        proteinLevel: proteinLevel
    };
}

/**
 * 단백질 함량에 따라 등급을 계산합니다
 * @param {number} protein - 단백질 함량 (g)
 * @returns {number} 등급 (0-3)
 *   - 3: protein >= 30 → ⭐⭐⭐
 *   - 2: protein >= 20 → ⭐⭐
 *   - 1: protein >= 10 → ⭐
 *   - 0: protein < 10 → (등급 없음)
 */
function getProteinLevel(protein) {
    if (protein >= 30) {
        return 3; // ⭐⭐⭐
    } else if (protein >= 20) {
        return 2; // ⭐⭐
    } else if (protein >= 10) {
        return 1; // ⭐
    } else {
        return 0; // 등급 없음
    }
}

// ============================================================
// 테스트 코드 (개발 환경에서만 실행)
// ============================================================
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    // 로컬 개발 환경에서만 테스트 실행
    console.log('=== calculateNutrition 테스트 ===');
    
    // 테스트 케이스 1: 닭가슴살 100g
    const baseData1 = {
        name: '닭가슴살',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6
    };
    const result1 = calculateNutrition(baseData1, 100);
    console.assert(result1.calories === 165 && result1.protein === 31, '테스트 1 실패: 닭가슴살 100g');
    console.assert(result1.proteinLevel === 3, '테스트 1 실패: 단백질 등급 3');
    
    // 테스트 케이스 2: 닭가슴살 150g (비율 계산)
    const result2 = calculateNutrition(baseData1, 150);
    console.assert(result2.calories === 247.5 && result2.protein === 46.5, '테스트 2 실패: 닭가슴살 150g');
    console.assert(result2.proteinLevel === 3, '테스트 2 실패: 단백질 등급 3');
    
    // 테스트 케이스 3: 계란 50g (소수점 처리)
    const baseData3 = {
        name: '계란',
        calories: 155,
        protein: 12.6,
        carbs: 1.1,
        fat: 10.6
    };
    const result3 = calculateNutrition(baseData3, 50);
    console.assert(result3.calories === 77.5 && result3.protein === 6.3, '테스트 3 실패: 계란 50g');
    console.assert(result3.proteinLevel === 0, '테스트 3 실패: 단백질 등급 0');
    
    // 테스트 케이스 4: 소고기 200g (단백질 등급 2)
    const baseData4 = {
        name: '소고기',
        calories: 250,
        protein: 26,
        carbs: 0,
        fat: 15
    };
    const result4 = calculateNutrition(baseData4, 200);
    console.assert(result4.protein === 52 && result4.proteinLevel === 3, '테스트 4 실패: 소고기 200g');
    
    // 테스트 케이스 5: 바나나 100g (단백질 등급 0)
    const baseData5 = {
        name: '바나나',
        calories: 89,
        protein: 1.1,
        carbs: 23,
        fat: 0.3
    };
    const result5 = calculateNutrition(baseData5, 100);
    console.assert(result5.protein === 1.1 && result5.proteinLevel === 0, '테스트 5 실패: 바나나 100g');
    
    // 테스트 케이스 6: 단백질 등급 경계값 테스트
    const baseData6 = {
        name: '테스트음식',
        calories: 100,
        protein: 20,
        carbs: 0,
        fat: 0
    };
    const result6_1 = calculateNutrition(baseData6, 100); // protein 20 → 등급 2
    console.assert(result6_1.proteinLevel === 2, '테스트 6-1 실패: 단백질 등급 2');
    
    const baseData6_2 = {
        name: '테스트음식2',
        calories: 100,
        protein: 10,
        carbs: 0,
        fat: 0
    };
    const result6_2 = calculateNutrition(baseData6_2, 100); // protein 10 → 등급 1
    console.assert(result6_2.proteinLevel === 1, '테스트 6-2 실패: 단백질 등급 1');
    
    console.log('=== calculateNutrition 테스트 완료 ===');
}

/**
 * 영양 정보를 사용자 친화적인 텍스트로 포맷팅합니다
 * (카드 UI가 추가되면서 현재는 사용되지 않지만, 텍스트 모드를 위해 유지)
 * @param {Object} nutritionData - 계산된 영양 정보
 * @returns {string} 포맷팅된 텍스트
 */
function formatNutritionText(nutritionData) {
    // 단백질 등급을 별로 표시
    const proteinStars = '⭐'.repeat(nutritionData.proteinLevel);

    // 텍스트 포맷팅
    const text = `🍽️ ${nutritionData.name} (${nutritionData.amount}g)

🔥 칼로리: ${nutritionData.calories} kcal
💪 단백질: ${nutritionData.protein}g ${proteinStars}
🍚 탄수화물: ${nutritionData.carbs}g
🧈 지방: ${nutritionData.fat}g`;

    return text;
}

/**
 * 운동 후 영양 결과에 따라 추천 멘트를 생성합니다
 * @param {Object} nutrition - 계산된 영양 정보
 *   { protein: number, carbs: number, calories: number }
 * @returns {string} 짧고 긍정적인 한국어 멘트
 */
function getPostWorkoutMessage(nutrition) {
    const { protein, carbs, calories } = nutrition;

    // 단백질이 높은 경우 (30g 이상)
    if (protein >= 30) {
        return '💪 완벽한 단백질 보충이에요! 근육 회복에 최고입니다!';
    }

    if (protein >= 20) {
        return '👍 좋은 단백질 섭취네요! 운동 후 식사로 딱이에요!';
    }

    if (carbs >= 30) {
        return '⚡ 에너지 보충 완료! 운동 전후로 좋은 선택이에요!';
    }

    if (calories >= 150 && calories <= 300) {
        return '✨ 균형 잡힌 식사네요! 다른 음식과 함께 드시면 더 좋아요!';
    }

    if (calories < 150) {
        return '🥗 가벼운 식사네요! 단백질이나 탄수화물을 추가로 드시면 좋아요!';
    }

    if (calories > 300) {
        return '🔥 에너지 충전 완료! 벌크업이나 장시간 운동에 좋아요!';
    }

    return '💪 좋은 선택이에요! 계속 이렇게 관리하세요!';
}

// ============================================================
// HTML 카드 생성 함수
// ============================================================
/**
 * 영양 정보를 HTML 카드 형태로 생성합니다
 *
 * 이 함수는 영양 정보를 받아서 사용자에게 보여줄 수 있는
 * 예쁜 카드 형태의 HTML 요소를 만들어 반환합니다.
 *
 * @param {Object} nutritionData - 계산된 영양 정보
 *   { name: string,        // 음식 이름
 *     amount: number,      // 분량 (g)
 *     calories: number,    // 칼로리 (kcal)
 *     protein: number,     // 단백질 (g)
 *     carbs: number,       // 탄수화물 (g)
 *     fat: number,         // 지방 (g)
 *     proteinLevel: number // 단백질 등급 (0-3)
 *   }
 * @returns {HTMLElement} 영양 정보 카드 DOM 요소
 *
 * 사용 예시:
 *   const nutritionData = { name: '닭가슴살', amount: 150, calories: 247.5, ... };
 *   const card = createNutritionCard(nutritionData);
 *   addMessage('bot', card); // chat.js의 addMessage에 카드 전달
 */
function createNutritionCard(nutritionData) {
    // ============================================================
    // 1단계: 메인 카드 컨테이너 생성
    // ============================================================
    // div 요소를 만들고 'nutrition-card' 클래스를 지정합니다.
    // 이 클래스는 card.css에 정의된 스타일을 적용받습니다.
    const card = document.createElement('div');
    card.className = 'nutrition-card';

    // ============================================================
    // 2단계: 카드 헤더 만들기 (음식 이름 + 분량)
    // ============================================================
    // 카드의 상단 부분을 만듭니다. 여기에는 음식 이름과 분량이 표시됩니다.
    const header = document.createElement('div');
    header.className = 'nutrition-card-header';

    // 음식 이름을 표시할 제목 요소
    const title = document.createElement('div');
    title.className = 'nutrition-card-title';
    title.textContent = `🍽️ ${nutritionData.name}`;

    // 분량을 표시할 요소 (예: 150g)
    const amount = document.createElement('div');
    amount.className = 'nutrition-card-amount';
    amount.textContent = `${nutritionData.amount}g`;

    // 헤더에 제목과 분량을 추가
    header.appendChild(title);
    header.appendChild(amount);

    // ============================================================
    // 3단계: 카드 본문 만들기 (영양 정보)
    // ============================================================
    // 카드의 중간 부분을 만듭니다. 여기에 칼로리, 단백질, 탄수화물, 지방 정보가 들어갑니다.
    const body = document.createElement('div');
    body.className = 'nutrition-card-body';

    // --------------------------------
    // 3-1. 칼로리 항목 생성
    // --------------------------------
    // 칼로리는 가장 중요한 정보이므로 강조 스타일을 적용합니다.
    const caloriesItem = createNutritionItem(
        '🔥',                           // 아이콘
        '칼로리',                       // 라벨
        `${nutritionData.calories}`,   // 값
        'kcal',                         // 단위
        true                            // 강조 여부
    );
    // 칼로리 항목에 'calories' 클래스 추가 (card.css에서 정의된 스타일)
    caloriesItem.classList.add('calories');

    // --------------------------------
    // 3-2. 단백질 항목 생성 (별 등급 포함)
    // --------------------------------
    // 단백질은 운동하는 사람에게 가장 중요한 영양소이므로 특별하게 표시합니다.
    // 단백질 등급에 따라 별(⭐)을 표시합니다.
    const proteinStars = '⭐'.repeat(nutritionData.proteinLevel);
    const proteinItem = createNutritionItem(
        '💪',                           // 아이콘
        '단백질',                       // 라벨
        `${nutritionData.protein}`,    // 값
        'g',                            // 단위
        false                           // 강조 여부 (아래에서 별도 클래스 추가)
    );
    // 단백질 항목에 'protein-highlight' 클래스 추가 (강조 스타일)
    proteinItem.classList.add('protein-highlight');

    // 단백질 등급이 있으면 별을 추가합니다
    if (proteinStars) {
        const valueElement = proteinItem.querySelector('.nutrition-value');
        const starsSpan = document.createElement('span');
        starsSpan.className = 'protein-stars';
        starsSpan.textContent = proteinStars;
        valueElement.appendChild(starsSpan);
    }

    // --------------------------------
    // 3-3. 탄수화물 항목 생성
    // --------------------------------
    const carbsItem = createNutritionItem(
        '🍚',                           // 아이콘
        '탄수화물',                     // 라벨
        `${nutritionData.carbs}`,      // 값
        'g',                            // 단위
        false                           // 강조하지 않음
    );

    // --------------------------------
    // 3-4. 지방 항목 생성
    // --------------------------------
    const fatItem = createNutritionItem(
        '🧈',                           // 아이콘
        '지방',                         // 라벨
        `${nutritionData.fat}`,        // 값
        'g',                            // 단위
        false                           // 강조하지 않음
    );

    // --------------------------------
    // 모든 영양소 항목을 body에 추가
    // --------------------------------
    body.appendChild(caloriesItem);
    body.appendChild(proteinItem);
    body.appendChild(carbsItem);
    body.appendChild(fatItem);

    // ============================================================
    // 4단계: 카드 푸터 만들기 (격려 메시지)
    // ============================================================
    // 카드의 하단 부분을 만듭니다. 여기에는 사용자를 격려하는 메시지가 표시됩니다.
    const footer = document.createElement('div');
    footer.className = 'nutrition-card-footer';

    // 격려 메시지 생성 (getPostWorkoutMessage 함수 사용)
    const encouragementDiv = document.createElement('div');
    encouragementDiv.className = 'encouragement-message';
    encouragementDiv.textContent = getPostWorkoutMessage(nutritionData);

    footer.appendChild(encouragementDiv);

    // ============================================================
    // 5단계: 모든 부분을 카드에 조립
    // ============================================================
    // 헤더, 본문, 푸터를 메인 카드에 추가합니다.
    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(footer);

    // ============================================================
    // 6단계: 완성된 카드 반환
    // ============================================================
    // 이 카드는 addMessage('bot', card) 형태로 사용됩니다.
    return card;
}

/**
 * 영양소 항목 요소를 생성하는 헬퍼 함수
 *
 * 이 함수는 createNutritionCard 내부에서 반복적으로 사용되는
 * 영양소 항목(칼로리, 단백질 등)을 만들기 위한 함수입니다.
 *
 * @param {string} icon - 아이콘 (이모지)
 * @param {string} label - 라벨 (예: '칼로리', '단백질')
 * @param {string} value - 값 (예: '247.5', '31')
 * @param {string} unit - 단위 (예: 'kcal', 'g')
 * @param {boolean} highlight - 강조 여부
 * @returns {HTMLElement} 영양소 항목 DOM 요소
 */
function createNutritionItem(icon, label, value, unit, highlight = false) {
    // 영양소 항목을 감싸는 div 생성
    const item = document.createElement('div');
    item.className = 'nutrition-item';

    // 왼쪽: 라벨 영역 (아이콘 + 텍스트)
    const labelDiv = document.createElement('div');
    labelDiv.className = 'nutrition-label';

    // 아이콘
    const iconSpan = document.createElement('span');
    iconSpan.className = 'nutrition-icon';
    iconSpan.textContent = icon;

    // 라벨 텍스트
    const labelText = document.createElement('span');
    labelText.textContent = label;

    // 라벨 영역 조립
    labelDiv.appendChild(iconSpan);
    labelDiv.appendChild(labelText);

    // 오른쪽: 값 영역 (숫자 + 단위)
    const valueDiv = document.createElement('div');
    valueDiv.className = 'nutrition-value';
    valueDiv.textContent = `${value}${unit}`;

    // 항목 조립
    item.appendChild(labelDiv);
    item.appendChild(valueDiv);

    return item;
}
