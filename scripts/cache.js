// ============================================================
// Week 3: 성능 최적화 - API 캐싱
// ============================================================

/**
 * LocalStorage를 사용한 캐싱 관리 클래스
 *
 * 기능:
 * - API 결과 캐싱 (24시간)
 * - 검색 결과 캐싱
 * - 캐시 크기 제한
 * - 캐시 무효화
 */
class CacheManager {
    constructor(options = {}) {
        this.prefix = options.prefix || 'calorieBuddy_cache_';
        this.maxAge = options.maxAge || 24 * 60 * 60 * 1000; // 24시간 (밀리초)
        this.maxSize = options.maxSize || 50; // 최대 캐시 항목 수
        this.storageKey = this.prefix + 'index';
    }

    /**
     * 캐시 키 생성
     * @param {string} namespace - 네임스페이스 (예: 'search', 'api')
     * @param {string} key - 캐시 키
     * @returns {string} 전체 캐시 키
     */
    _getCacheKey(namespace, key) {
        return `${this.prefix}${namespace}_${key}`;
    }

    /**
     * 캐시 저장
     * @param {string} namespace - 네임스페이스
     * @param {string} key - 캐시 키
     * @param {any} data - 저장할 데이터
     */
    set(namespace, key, data) {
        try {
            const cacheKey = this._getCacheKey(namespace, key);
            const cacheData = {
                data: data,
                timestamp: Date.now(),
                namespace: namespace,
                key: key
            };

            // LocalStorage에 저장
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));

            // 인덱스 업데이트
            this._updateIndex(cacheKey);

            // 캐시 크기 제한 확인
            this._enforceSizeLimit();

        } catch (error) {
            console.warn('캐시 저장 실패:', error);
            // LocalStorage가 가득 찬 경우 오래된 캐시 삭제
            if (error.name === 'QuotaExceededError') {
                this._cleanOldCache();
                // 재시도
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
                    this._updateIndex(cacheKey);
                } catch (retryError) {
                    console.error('캐시 재시도 실패:', retryError);
                }
            }
        }
    }

    /**
     * 캐시 가져오기
     * @param {string} namespace - 네임스페이스
     * @param {string} key - 캐시 키
     * @returns {any|null} 캐시된 데이터 또는 null
     */
    get(namespace, key) {
        try {
            const cacheKey = this._getCacheKey(namespace, key);
            const cached = localStorage.getItem(cacheKey);

            if (!cached) {
                return null;
            }

            const cacheData = JSON.parse(cached);
            const age = Date.now() - cacheData.timestamp;

            // 캐시가 만료되었는지 확인
            if (age > this.maxAge) {
                console.log(`캐시 만료: ${key} (${Math.floor(age / 1000 / 60)}분 경과)`);
                this.remove(namespace, key);
                return null;
            }

            console.log(`캐시 히트: ${key} (${Math.floor(age / 1000)}초 전)`);
            return cacheData.data;

        } catch (error) {
            console.warn('캐시 읽기 실패:', error);
            return null;
        }
    }

    /**
     * 특정 캐시 삭제
     * @param {string} namespace - 네임스페이스
     * @param {string} key - 캐시 키
     */
    remove(namespace, key) {
        try {
            const cacheKey = this._getCacheKey(namespace, key);
            localStorage.removeItem(cacheKey);
            this._removeFromIndex(cacheKey);
        } catch (error) {
            console.warn('캐시 삭제 실패:', error);
        }
    }

    /**
     * 네임스페이스의 모든 캐시 삭제
     * @param {string} namespace - 네임스페이스
     */
    clearNamespace(namespace) {
        try {
            const index = this._getIndex();
            const keysToRemove = index.filter(key => key.includes(`${this.prefix}${namespace}_`));

            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });

            // 인덱스 업데이트
            const newIndex = index.filter(key => !keysToRemove.includes(key));
            localStorage.setItem(this.storageKey, JSON.stringify(newIndex));

            console.log(`네임스페이스 캐시 삭제: ${namespace} (${keysToRemove.length}개)`);
        } catch (error) {
            console.warn('네임스페이스 캐시 삭제 실패:', error);
        }
    }

    /**
     * 모든 캐시 삭제
     */
    clearAll() {
        try {
            const index = this._getIndex();
            index.forEach(key => {
                localStorage.removeItem(key);
            });
            localStorage.removeItem(this.storageKey);
            console.log('모든 캐시 삭제 완료');
        } catch (error) {
            console.warn('전체 캐시 삭제 실패:', error);
        }
    }

    /**
     * 캐시 인덱스 가져오기
     * @returns {Array<string>} 캐시 키 배열
     * @private
     */
    _getIndex() {
        try {
            const index = localStorage.getItem(this.storageKey);
            return index ? JSON.parse(index) : [];
        } catch (error) {
            return [];
        }
    }

    /**
     * 캐시 인덱스 업데이트
     * @param {string} cacheKey - 캐시 키
     * @private
     */
    _updateIndex(cacheKey) {
        try {
            let index = this._getIndex();

            // 중복 제거
            index = index.filter(key => key !== cacheKey);

            // 새 키 추가 (앞에 추가하여 최근 항목이 먼저 오도록)
            index.unshift(cacheKey);

            localStorage.setItem(this.storageKey, JSON.stringify(index));
        } catch (error) {
            console.warn('인덱스 업데이트 실패:', error);
        }
    }

    /**
     * 인덱스에서 캐시 키 제거
     * @param {string} cacheKey - 캐시 키
     * @private
     */
    _removeFromIndex(cacheKey) {
        try {
            let index = this._getIndex();
            index = index.filter(key => key !== cacheKey);
            localStorage.setItem(this.storageKey, JSON.stringify(index));
        } catch (error) {
            console.warn('인덱스 제거 실패:', error);
        }
    }

    /**
     * 캐시 크기 제한 적용
     * @private
     */
    _enforceSizeLimit() {
        try {
            const index = this._getIndex();

            // 최대 크기 초과 시 오래된 항목 삭제
            if (index.length > this.maxSize) {
                const keysToRemove = index.slice(this.maxSize);

                keysToRemove.forEach(key => {
                    localStorage.removeItem(key);
                });

                // 인덱스 업데이트
                const newIndex = index.slice(0, this.maxSize);
                localStorage.setItem(this.storageKey, JSON.stringify(newIndex));

                console.log(`캐시 크기 제한 적용: ${keysToRemove.length}개 삭제`);
            }
        } catch (error) {
            console.warn('캐시 크기 제한 적용 실패:', error);
        }
    }

    /**
     * 오래된 캐시 삭제
     * @private
     */
    _cleanOldCache() {
        try {
            const index = this._getIndex();
            const now = Date.now();
            let removedCount = 0;

            index.forEach(cacheKey => {
                try {
                    const cached = localStorage.getItem(cacheKey);
                    if (cached) {
                        const cacheData = JSON.parse(cached);
                        const age = now - cacheData.timestamp;

                        // 만료된 캐시 삭제
                        if (age > this.maxAge) {
                            localStorage.removeItem(cacheKey);
                            removedCount++;
                        }
                    }
                } catch (error) {
                    // 파싱 실패한 캐시도 삭제
                    localStorage.removeItem(cacheKey);
                    removedCount++;
                }
            });

            // 인덱스 재구성
            this._rebuildIndex();

            console.log(`오래된 캐시 정리 완료: ${removedCount}개 삭제`);
        } catch (error) {
            console.warn('오래된 캐시 정리 실패:', error);
        }
    }

    /**
     * 캐시 인덱스 재구성
     * @private
     */
    _rebuildIndex() {
        try {
            const newIndex = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix) && key !== this.storageKey) {
                    newIndex.push(key);
                }
            }

            localStorage.setItem(this.storageKey, JSON.stringify(newIndex));
        } catch (error) {
            console.warn('인덱스 재구성 실패:', error);
        }
    }

    /**
     * 캐시 통계 가져오기
     * @returns {Object} 캐시 통계
     */
    getStats() {
        try {
            const index = this._getIndex();
            let totalSize = 0;
            let expiredCount = 0;
            const now = Date.now();
            const namespaces = {};

            index.forEach(cacheKey => {
                try {
                    const cached = localStorage.getItem(cacheKey);
                    if (cached) {
                        totalSize += cached.length;
                        const cacheData = JSON.parse(cached);
                        const age = now - cacheData.timestamp;

                        if (age > this.maxAge) {
                            expiredCount++;
                        }

                        // 네임스페이스별 카운트
                        const namespace = cacheData.namespace || 'unknown';
                        namespaces[namespace] = (namespaces[namespace] || 0) + 1;
                    }
                } catch (error) {
                    // 무시
                }
            });

            return {
                total: index.length,
                expired: expiredCount,
                sizeBytes: totalSize,
                sizeKB: Math.round(totalSize / 1024),
                namespaces: namespaces,
                maxAge: this.maxAge,
                maxSize: this.maxSize
            };
        } catch (error) {
            console.warn('캐시 통계 가져오기 실패:', error);
            return null;
        }
    }
}

// 전역 캐시 매니저 인스턴스 생성
const cacheManager = new CacheManager({
    prefix: 'calorieBuddy_',
    maxAge: 24 * 60 * 60 * 1000, // 24시간
    maxSize: 100 // 최대 100개 항목
});

// 전역으로 노출
window.cacheManager = cacheManager;

console.log('✅ 캐시 매니저 초기화 완료');
console.log('📊 캐시 통계:', cacheManager.getStats());
