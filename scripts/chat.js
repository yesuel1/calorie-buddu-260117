/**
 * chat.js - 챗봇 메시지 렌더링
 * TODO: Task 1.3.1 - 메시지 렌더링
 */

// TODO: Task 1.3.1 - addMessage(sender, text) 함수
/**
 * 메시지를 채팅창에 추가합니다
 * @param {string} sender - 'bot' 또는 'user'
 * @param {string|HTMLElement} content - 메시지 텍스트 내용 또는 HTML 요소
 */
function addMessage(sender, content) {
    // .messages 컨테이너 가져오기
    const messagesContainer = document.getElementById('messages');
    
    if (!messagesContainer) {
        console.error('messages 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    // 메시지 버블 생성
    const messageElement = createMessageBubble(sender, content);
    
    // .messages 컨테이너에 추가
    messagesContainer.appendChild(messageElement);
    
    // 자동 스크롤
    scrollToBottom();
}

// TODO: Task 1.3.1 - createMessageBubble(sender, content) 함수
/**
 * 메시지 버블 DOM 요소를 생성합니다
 * @param {string} sender - 'bot' 또는 'user'
 * @param {string|HTMLElement} content - 메시지 텍스트 내용 또는 HTML 요소
 * @returns {HTMLElement} 메시지 버블 요소
 */
function createMessageBubble(sender, content) {
    // 메시지 컨테이너 생성
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    // 메시지 버블 생성
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    // 메시지 내용 생성
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // TODO: Task 1.6.1 - content가 HTMLElement인지 string인지 확인
    // 이 부분이 중요합니다! content는 두 가지 형태로 올 수 있습니다:
    //
    // 1. 텍스트 메시지: '안녕하세요!' 같은 일반 문자열
    //    → textContent로 설정하면 텍스트가 그대로 표시됩니다
    //
    // 2. HTML 요소: createNutritionCard()가 반환한 카드 같은 DOM 요소
    //    → appendChild로 추가하면 카드가 예쁘게 표시됩니다
    //
    // 이렇게 함으로써 addMessage('bot', '텍스트')와
    // addMessage('bot', htmlElement) 둘 다 사용할 수 있습니다!

    if (typeof content === 'string') {
        // 문자열인 경우: 일반 텍스트 메시지로 표시
        contentDiv.textContent = content;
    } else if (content instanceof HTMLElement) {
        // HTML 요소인 경우: 카드 같은 복잡한 UI를 표시
        // nutrition.js의 createNutritionCard()가 만든 카드가 여기에 추가됩니다
        contentDiv.appendChild(content);
    } else {
        // 그 외의 경우: 문자열로 변환해서 표시
        contentDiv.textContent = String(content);
    }
    
    // 구조 조립
    bubbleDiv.appendChild(contentDiv);
    messageDiv.appendChild(bubbleDiv);
    
    return messageDiv;
}

// TODO: Task 1.3.1 - 스크롤 자동 이동 기능
/**
 * 채팅창을 맨 아래로 스크롤합니다
 */
function scrollToBottom() {
    const messagesContainer = document.getElementById('messages');
    
    if (!messagesContainer) {
        return;
    }
    
    // scrollTop = scrollHeight로 맨 아래로 스크롤
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// TODO: Task 1.3.2 - handleSendMessage() 함수
/**
 * 사용자 메시지를 전송합니다
 */
function handleSendMessage() {
    // TODO: Task 1.3.2 - 입력값 가져오기 및 trim 처리
    const userInput = document.getElementById('user-input');
    
    if (!userInput) {
        console.error('user-input 요소를 찾을 수 없습니다.');
        return;
    }
    
    const messageText = userInput.value.trim();
    
    // TODO: Task 1.3.2 - 빈 문자열이면 무시
    if (!messageText) {
        return;
    }
    
    // TODO: Task 1.3.2 - 사용자 메시지 표시
    addMessage('user', messageText);
    
    // TODO: Task 1.3.2 - input 값 초기화
    userInput.value = '';
    
    // TODO: Task 1.3.2 - input focus 유지
    userInput.focus();
    
    // 검색 처리 (app.js의 handleSearch 호출)
    if (typeof handleSearch === 'function') {
        handleSearch(messageText);
    } else {
        // handleSearch가 아직 로드되지 않은 경우 임시 응답
        console.warn('handleSearch 함수를 찾을 수 없습니다. 검색 기능이 아직 로드되지 않았을 수 있습니다.');
        addMessage('bot', '검색 기능을 준비 중입니다... 🔍');
    }
}

// TODO: Task 1.3.2 - Enter 키 입력 핸들러
/**
 * 키보드 이벤트를 처리합니다
 * @param {KeyboardEvent} event - 키보드 이벤트
 */
function handleKeyPress(event) {
    // TODO: Task 1.3.2 - Enter 키 입력 시 메시지 전송
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
    }
}

// TODO: Task 1.3.2 - 이벤트 바인딩 초기화
/**
 * 챗봇 UI 이벤트를 초기화합니다
 */
function initChatInputHandlers() {
    // TODO: Task 1.3.2 - #send-btn 클릭 이벤트 바인딩
    const sendButton = document.getElementById('send-btn');
    if (sendButton) {
        sendButton.addEventListener('click', handleSendMessage);
    }
    
    // TODO: Task 1.3.2 - #user-input Enter 키 이벤트 바인딩
    const userInput = document.getElementById('user-input');
    if (userInput) {
        userInput.addEventListener('keypress', handleKeyPress);
        // 초기 포커스 설정
        userInput.focus();
    }
}

// TODO: Task 1.3.3 - messages.json에서 랜덤 인사 메시지 선택
/**
 * messages.json을 불러와서 랜덤 인사 메시지를 반환합니다
 * @returns {Promise<string>} 랜덤 인사 메시지
 */
async function getRandomGreeting() {
    try {
        // TODO: Task 1.3.3 - fetch로 messages.json 불러오기
        const response = await fetch('data/messages.json');
        
        if (!response.ok) {
            throw new Error('messages.json을 불러올 수 없습니다.');
        }
        
        const messagesData = await response.json();
        
        // TODO: Task 1.3.3 - 랜덤 인사 메시지 선택
        if (messagesData.greetings && messagesData.greetings.length > 0) {
            const randomIndex = Math.floor(Math.random() * messagesData.greetings.length);
            return messagesData.greetings[randomIndex];
        }
        
        throw new Error('greetings 배열이 비어있습니다.');
    } catch (error) {
        // TODO: Task 1.3.3 - 실패 시 기본 메시지 fallback
        console.error('인사 메시지 로드 실패:', error);
        return '안녕하세요! 💪\n운동 후 뭐 드시나요?\n음식 이름을 입력해주세요!';
    }
}

// TODO: Task 1.3.3 - 초기 봇 메시지 표시 (messages.json 기반)
/**
 * 초기 인사 메시지를 표시합니다
 */
async function showWelcomeMessage() {
    // TODO: Task 1.3.3 - messages.json에서 랜덤 인사 메시지 가져오기
    const greeting = await getRandomGreeting();
    addMessage('bot', greeting);
}

// TODO: Task 1.3.1 - 테스트용 bot 메시지 자동 출력
// TODO: Task 1.3.2 - DOMContentLoaded 안에서 이벤트 바인딩
// TODO: Task 1.3.3 - 초기 봇 메시지를 messages.json 기반으로 변경
// ============================================================
// Week 2: 확인 카드 생성 함수
// ============================================================

/**
 * 사진 인식 결과를 확인하는 카드를 생성합니다
 *
 * 이 카드는 사용자가 업로드한 사진과 AI가 인식한 음식 이름을 보여주고,
 * 사용자가 "맞아요" 또는 "다시 검색" 버튼을 선택할 수 있게 합니다.
 *
 * @param {string} imageUrl - 업로드된 이미지 URL (Data URL)
 * @param {string} foodName - 인식된 음식 이름
 * @returns {HTMLElement} 확인 카드 DOM 요소
 */
function createConfirmCard(imageUrl, foodName) {
    // 1. 메인 카드 컨테이너 생성
    const card = document.createElement('div');
    card.className = 'confirm-card';

    // 2. 카드 헤더 (제목)
    const header = document.createElement('div');
    header.className = 'confirm-card-header';
    header.textContent = '이 음식이 맞나요? 🤔';

    // 3. 이미지 미리보기
    const imagePreview = document.createElement('div');
    imagePreview.className = 'confirm-card-image';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = '업로드된 음식 사진';

    imagePreview.appendChild(img);

    // 4. 인식된 음식 이름 (수정 가능)
    const foodNameContainer = document.createElement('div');
    foodNameContainer.className = 'confirm-card-food-name-container';

    const foodNameLabel = document.createElement('div');
    foodNameLabel.className = 'confirm-card-food-label';
    foodNameLabel.textContent = '인식된 음식:';

    const foodNameInput = document.createElement('input');
    foodNameInput.type = 'text';
    foodNameInput.className = 'confirm-card-food-input';
    foodNameInput.value = foodName;
    foodNameInput.placeholder = '음식 이름을 입력하세요';

    foodNameContainer.appendChild(foodNameLabel);
    foodNameContainer.appendChild(foodNameInput);

    // 5. 버튼 그룹
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'confirm-card-buttons';

    // "검색하기" 버튼
    const confirmButton = document.createElement('button');
    confirmButton.className = 'confirm-button confirm-yes';
    confirmButton.textContent = '✅ 검색하기';
    confirmButton.onclick = () => {
        // 입력된 음식 이름으로 검색
        const finalFoodName = foodNameInput.value.trim();
        if (finalFoodName) {
            handleSearch(finalFoodName);
        } else {
            addMessage('bot', '음식 이름을 입력해주세요! 😊');
        }
    };

    // "취소" 버튼
    const retryButton = document.createElement('button');
    retryButton.className = 'confirm-button confirm-retry';
    retryButton.textContent = '❌ 취소';
    retryButton.onclick = () => {
        addMessage('bot', '음식 이름을 직접 입력해주세요! 😊');
    };

    buttonGroup.appendChild(confirmButton);
    buttonGroup.appendChild(retryButton);

    // 6. 모든 요소 조립
    card.appendChild(header);
    card.appendChild(imagePreview);
    card.appendChild(foodNameContainer);
    card.appendChild(buttonGroup);

    // 7. Enter 키로도 검색 가능하게
    foodNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmButton.click();
        }
    });

    // 8. 입력창에 자동 포커스
    setTimeout(() => foodNameInput.focus(), 100);

    return card;
}

// DOM 로드 완료 후 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        // 인사 메시지 표시 (messages.json 기반)
        await showWelcomeMessage();
        // 입력 핸들러 초기화
        initChatInputHandlers();
    });
} else {
    // 이미 로드된 경우 즉시 실행
    (async () => {
        await showWelcomeMessage();
        initChatInputHandlers();
    })();
}
