/**
 * search.js - 텍스트 검색 로직
 * TODO: Task 1.4.1 - 입력 파싱
 * TODO: Task 1.4.3 - 로컬 검색
 */

// TODO: Task 1.4.1 - parseInput(text) 함수
/**
 * 사용자 입력을 파싱하여 음식명과 분량을 추출합니다
 * @param {string} text - 사용자 입력 텍스트
 * @returns {Object} { foodName: string, amount: number }
 */
function parseInput(text) {
    // 입력값 trim 처리
    const trimmedText = text.trim();
    
    if (!trimmedText) {
        // 빈 문자열인 경우 기본값 반환
        return {
            foodName: '',
            amount: 100
        };
    }
    
    // TODO: Task 1.4.1 - 정규표현식으로 분량 감지 (숫자 + g 패턴만)
    // 예: "100g", "150g", "200g" 등
    const amountPattern = /(\d+(?:\.\d+)?)\s*g/i;
    const match = trimmedText.match(amountPattern);
    
    let foodName = trimmedText;
    let amount = 100; // 기본값
    
    if (match) {
        // TODO: Task 1.4.1 - 분량 추출 및 음식명 분리
        amount = parseFloat(match[1]);
        
        // 분량 패턴을 제거하여 음식명 추출
        foodName = trimmedText.replace(amountPattern, '').trim();
        
        // 분량만 있고 음식명이 없는 경우 처리
        if (!foodName) {
            foodName = trimmedText;
            amount = 100; // 기본값으로 재설정
        }
    }
    
    // TODO: Task 1.4.1 - 기본값 처리 (분량 없으면 100g)
    // foodName이 있지만 amount가 기본값인 경우는 이미 처리됨
    
    // TODO: Task 1.4.1 - 테스트 출력 (개발 중에만)
    // console.log('parseInput 입력:', text);
    // console.log('parseInput 결과:', { foodName, amount });
    
    return {
        foodName: foodName,
        amount: amount
    };
}

// TODO: Task 1.4.1 - 테스트 케이스
// 개발 중 테스트용 (실제 사용 시 제거 가능)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // 로컬 개발 환경에서만 테스트 실행
    console.log('=== parseInput 테스트 ===');
    
    // 테스트 케이스 1: "닭가슴살 100g"
    const test1 = parseInput('닭가슴살 100g');
    console.assert(test1.foodName === '닭가슴살' && test1.amount === 100, '테스트 1 실패');
    
    // 테스트 케이스 2: "닭가슴살"
    const test2 = parseInput('닭가슴살');
    console.assert(test2.foodName === '닭가슴살' && test2.amount === 100, '테스트 2 실패');
    
    // 테스트 케이스 3: "삼겹살 200g"
    const test3 = parseInput('삼겹살 200g');
    console.assert(test3.foodName === '삼겹살' && test3.amount === 200, '테스트 3 실패');
    
    // 테스트 케이스 4: "계란 50g"
    const test4 = parseInput('계란 50g');
    console.assert(test4.foodName === '계란' && test4.amount === 50, '테스트 4 실패');
    
    // 테스트 케이스 5: 공백 처리 "  닭가슴살  150g  "
    const test5 = parseInput('  닭가슴살  150g  ');
    console.assert(test5.foodName === '닭가슴살' && test5.amount === 150, '테스트 5 실패');
    
    console.log('=== parseInput 테스트 완료 ===');
}

// TODO: Task 1.4.3 - searchLocal(foodName) 함수
/**
 * 로컬 데이터베이스에서 음식을 검색합니다
 * @param {string} foodName - 검색할 음식 이름
 * @returns {Promise<Object|null>} 음식 데이터 또는 null
 */
async function searchLocal(foodName) {
    // TODO: Task 1.4.3 - data/foods.json을 fetch로 불러오기
    try {
        const response = await fetch('data/foods.json');
        
        if (!response.ok) {
            throw new Error('foods.json을 불러올 수 없습니다.');
        }
        
        const foodsData = await response.json();
        const foods = foodsData.foods;

        if (!foods || foods.length === 0) {
            return null;
        }

        // 검색어 정규화 (소문자 변환 및 trim)
        const normalizedSearchName = foodName.trim().toLowerCase();

        if (!normalizedSearchName) {
            return null;
        }

        // 검색 우선순위 1: name 정확 매칭
        let result = foods.find(food =>
            food.name.toLowerCase() === normalizedSearchName
        );

        if (result) {
            return result;
        }

        // 검색 우선순위 2: aliases 배열 포함 (정확 매칭)
        result = foods.find(food =>
            food.aliases && food.aliases.some(alias =>
                alias.toLowerCase() === normalizedSearchName
            )
        );

        if (result) {
            return result;
        }

        // 검색 우선순위 3: name 또는 alias 부분 매칭
        result = foods.find(food => {
            // name 부분 매칭
            if (food.name.toLowerCase().includes(normalizedSearchName)) {
                return true;
            }
            // aliases 부분 매칭
            if (food.aliases && food.aliases.some(alias =>
                alias.toLowerCase().includes(normalizedSearchName)
            )) {
                return true;
            }
            return false;
        });

        if (result) {
            return result;
        }

        // 못 찾으면 null 반환
        return null;
        
    } catch (error) {
        console.error('로컬 검색 실패:', error);
        return null;
    }
}

// TODO: Task 1.4.3 - parseInput() 결과와 연결 테스트 코드
// 개발 중 테스트용 (실제 사용 시 제거 가능)
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    // 로컬 개발 환경에서만 테스트 실행
    (async () => {
        console.log('=== searchLocal 테스트 ===');
        
        // 테스트 케이스 1: parseInput + searchLocal 연결 테스트
        const parsed1 = parseInput('닭가슴살 100g');
        const result1 = await searchLocal(parsed1.foodName);
        console.assert(result1 !== null && result1.name === '닭가슴살', '테스트 1 실패: 닭가슴살');
        
        // 테스트 케이스 2: aliases 검색
        const parsed2 = parseInput('치킨 150g');
        const result2 = await searchLocal(parsed2.foodName);
        console.assert(result2 !== null && result2.name === '닭가슴살', '테스트 2 실패: 치킨 (aliases)');
        
        // 테스트 케이스 3: 부분 매칭
        const parsed3 = parseInput('계란');
        const result3 = await searchLocal(parsed3.foodName);
        console.assert(result3 !== null && result3.name === '계란', '테스트 3 실패: 계란');
        
        // 테스트 케이스 4: 존재하지 않는 음식
        const parsed4 = parseInput('존재하지않는음식');
        const result4 = await searchLocal(parsed4.foodName);
        console.assert(result4 === null, '테스트 4 실패: 존재하지 않는 음식');
        
        // 테스트 케이스 5: 바나나 검색
        const parsed5 = parseInput('바나나 200g');
        const result5 = await searchLocal(parsed5.foodName);
        console.assert(result5 !== null && result5.name === '바나나', '테스트 5 실패: 바나나');
        
        console.log('=== searchLocal 테스트 완료 ===');
    })();
}

// TODO: Task 1.5.3 - searchFood() 함수 (searchLocal 래핑)
/**
 * 음식을 검색합니다 (로컬 우선)
 * @param {string} foodName - 검색할 음식 이름
 * @returns {Promise<Object|null>} 음식 데이터 또는 null
 */
async function searchFood(foodName) {
    // TODO: Task 1.5.3 - 로컬 검색 먼저 시도
    const result = await searchLocal(foodName);
    
    if (result) {
        return result;
    }
    
    // TODO: Task 1.5.3 - API 호출은 Week 1에서는 제외
    // Week 2에서 API 통합 예정
    
    return null;
}
