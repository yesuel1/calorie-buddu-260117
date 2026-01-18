/**
 * error-handler.js - 중앙 집중식 에러 핸들러
 * 일관된 에러 처리 및 사용자 친화적 메시지 제공
 */

/**
 * 에러 타입 정의
 */
const ErrorType = {
    NETWORK: 'NETWORK',           // 네트워크 오류
    NOT_FOUND: 'NOT_FOUND',       // 음식을 찾을 수 없음
    SERVER: 'SERVER',             // 서버 오류 (5xx)
    API_ERROR: 'API_ERROR',       // API 호출 오류
    PARSE_ERROR: 'PARSE_ERROR',   // 파싱 오류
    VALIDATION: 'VALIDATION',     // 유효성 검증 오류
    UNKNOWN: 'UNKNOWN'            // 알 수 없는 오류
};

/**
 * 중앙 집중식 에러 핸들러 클래스
 */
class ErrorHandler {
    /**
     * 에러를 처리합니다
     * @param {Error} error - 발생한 에러
     * @param {string} context - 에러 발생 컨텍스트 (예: 'search', 'api', 'photo')
     * @param {Object} options - 추가 옵션
     * @param {boolean} options.showToUser - 사용자에게 메시지 표시 여부 (기본: true)
     * @param {Function} options.retryFunction - 재시도 함수
     */
    static handle(error, context = '', options = {}) {
        const {
            showToUser = true,
            retryFunction = null
        } = options;

        // 1. 에러 타입 분류
        const errorType = this.categorize(error);

        // 2. 로깅 (개발 환경)
        if (this.isDevelopment()) {
            console.group(`🚨 에러 발생 [${context}]`);
            console.error('타입:', errorType);
            console.error('메시지:', error.message);
            console.error('스택:', error.stack);
            console.groupEnd();
        } else {
            // 프로덕션에서는 간단히
            console.error(`[${context}]`, error.message);
        }

        // 3. 사용자에게 메시지 표시
        if (showToUser && typeof addMessage === 'function') {
            const userMessage = this.getUserMessage(errorType, context);
            addMessage('bot', userMessage);

            // 4. 재시도 버튼 추가 (필요 시)
            if (retryFunction && this.shouldShowRetry(errorType)) {
                this.addRetryButton(retryFunction);
            }
        }

        // 5. 에러 추적 (프로덕션 환경에서 Sentry 등 사용 가능)
        if (!this.isDevelopment()) {
            this.trackError(errorType, context, error);
        }

        return errorType;
    }

    /**
     * 에러 타입을 분류합니다
     * @param {Error} error - 에러 객체
     * @returns {string} 에러 타입
     */
    static categorize(error) {
        // TypeError는 주로 네트워크 오류
        if (error.name === 'TypeError' || error.message.includes('fetch')) {
            return ErrorType.NETWORK;
        }

        // HTTP 상태 코드 기반 분류
        if (error.status) {
            if (error.status === 404) {
                return ErrorType.NOT_FOUND;
            }
            if (error.status >= 500) {
                return ErrorType.SERVER;
            }
            if (error.status >= 400) {
                return ErrorType.API_ERROR;
            }
        }

        // 파싱 오류
        if (error.name === 'SyntaxError' || error.message.includes('parse')) {
            return ErrorType.PARSE_ERROR;
        }

        // 유효성 검증 오류
        if (error.name === 'ValidationError' || error.message.includes('validation')) {
            return ErrorType.VALIDATION;
        }

        return ErrorType.UNKNOWN;
    }

    /**
     * 사용자 친화적 메시지를 생성합니다
     * @param {string} errorType - 에러 타입
     * @param {string} context - 컨텍스트
     * @returns {string} 사용자 메시지
     */
    static getUserMessage(errorType, context) {
        const messages = {
            [ErrorType.NETWORK]: '인터넷 연결을 확인해주세요 📡\n\n잠시 후 다시 시도해주세요.',
            [ErrorType.NOT_FOUND]: '음식을 찾을 수 없어요 😅\n\n다른 이름으로 검색해보시겠어요?\n예: "닭가슴살", "계란", "소고기"',
            [ErrorType.SERVER]: '서버 오류가 발생했어요 🔧\n\n잠시 후 다시 시도해주세요.',
            [ErrorType.API_ERROR]: 'API 호출 중 오류가 발생했어요 😢\n\n잠시 후 다시 시도해주세요.',
            [ErrorType.PARSE_ERROR]: '데이터 처리 중 오류가 발생했어요 🤔\n\n다시 시도해주세요.',
            [ErrorType.VALIDATION]: '입력값이 올바르지 않아요 ⚠️\n\n음식 이름을 확인해주세요.',
            [ErrorType.UNKNOWN]: '오류가 발생했어요 😢\n\n잠시 후 다시 시도해주세요.'
        };

        // 컨텍스트별 메시지 커스터마이징
        if (context === 'photo' && errorType === ErrorType.NOT_FOUND) {
            return '사진에서 음식을 인식할 수 없어요 📸\n\n다른 사진을 시도하거나\n텍스트로 검색해주세요!';
        }

        if (context === 'photo' && errorType === ErrorType.API_ERROR) {
            return '사진 인식 중 오류가 발생했어요 😢\n\n다시 시도해주세요!';
        }

        return messages[errorType] || messages[ErrorType.UNKNOWN];
    }

    /**
     * 재시도 버튼을 추가합니다
     * @param {Function} retryFunction - 재시도할 함수
     */
    static addRetryButton(retryFunction) {
        if (typeof createRetryButton === 'function') {
            const retryButton = createRetryButton(retryFunction);
            if (typeof addMessage === 'function') {
                addMessage('bot', retryButton);
            }
        }
    }

    /**
     * 재시도 버튼을 표시할지 결정합니다
     * @param {string} errorType - 에러 타입
     * @returns {boolean}
     */
    static shouldShowRetry(errorType) {
        // 네트워크 오류, 서버 오류, API 오류는 재시도 가능
        return [
            ErrorType.NETWORK,
            ErrorType.SERVER,
            ErrorType.API_ERROR
        ].includes(errorType);
    }

    /**
     * 개발 환경인지 확인합니다
     * @returns {boolean}
     */
    static isDevelopment() {
        return typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' ||
             window.location.hostname === '127.0.0.1');
    }

    /**
     * 에러를 추적합니다 (프로덕션용)
     * @param {string} errorType - 에러 타입
     * @param {string} context - 컨텍스트
     * @param {Error} error - 에러 객체
     */
    static trackError(errorType, context, error) {
        // TODO: 프로덕션에서 Sentry, LogRocket 등 사용
        // Example:
        // if (window.Sentry) {
        //     window.Sentry.captureException(error, {
        //         tags: {
        //             errorType: errorType,
        //             context: context
        //         }
        //     });
        // }

        // 현재는 간단히 로컬 스토리지에 저장
        try {
            const errorLog = {
                type: errorType,
                context: context,
                message: error.message,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };

            const logs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
            logs.push(errorLog);

            // 최대 50개까지만 저장
            if (logs.length > 50) {
                logs.shift();
            }

            localStorage.setItem('errorLogs', JSON.stringify(logs));
        } catch (e) {
            // 로깅 실패는 무시
        }
    }

    /**
     * 에러 로그를 가져옵니다
     * @returns {Array} 에러 로그 배열
     */
    static getErrorLogs() {
        try {
            return JSON.parse(localStorage.getItem('errorLogs') || '[]');
        } catch (e) {
            return [];
        }
    }

    /**
     * 에러 로그를 삭제합니다
     */
    static clearErrorLogs() {
        try {
            localStorage.removeItem('errorLogs');
        } catch (e) {
            // 무시
        }
    }
}

/**
 * 재시도 버튼을 생성합니다
 * @param {Function} retryFunction - 재시도할 함수
 * @returns {HTMLElement} 재시도 버튼 요소
 */
function createRetryButton(retryFunction) {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; justify-content: center; margin-top: 12px;';

    const button = document.createElement('button');
    button.textContent = '🔄 다시 시도';
    button.className = 'send-button';
    button.style.cssText = 'min-width: 120px; cursor: pointer;';

    button.addEventListener('click', () => {
        retryFunction();
    });

    container.appendChild(button);
    return container;
}

// 전역으로 노출
window.ErrorHandler = ErrorHandler;
window.ErrorType = ErrorType;

console.log('✅ 에러 핸들러 초기화 완료');
