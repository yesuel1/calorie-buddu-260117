# 한글 UTF-8 로케일 설정 가이드

CalorieBuddy에서 한글이 제대로 표시되려면 UTF-8 로케일 설정이 필요합니다.

## 🚀 빠른 시작

### 방법 1: 시작 스크립트 사용 (추천)

```bash
cd calorie-chatbot-mvp
./start-server.sh
```

이 스크립트는 자동으로 한글 로케일을 설정하고 서버를 시작합니다.

### 방법 2: 직접 환경변수 설정

```bash
export LANG=ko_KR.UTF-8
export LC_ALL=ko_KR.UTF-8
python3 /tmp/simple_ko_server.py
```

## 🔧 영구 설정 (권장)

개발 환경에서 매번 설정하지 않으려면 셸 프로파일에 추가하세요.

### Bash 사용자

`~/.bash_profile` 또는 `~/.bashrc`에 추가:

```bash
# 한글 UTF-8 로케일 설정
export LANG=ko_KR.UTF-8
export LC_ALL=ko_KR.UTF-8
```

적용:
```bash
source ~/.bash_profile
```

### Zsh 사용자 (macOS 기본)

`~/.zshrc`에 추가:

```bash
# 한글 UTF-8 로케일 설정
export LANG=ko_KR.UTF-8
export LC_ALL=ko_KR.UTF-8
```

적용:
```bash
source ~/.zshrc
```

## ✅ 설정 확인

터미널에서 다음 명령어로 로케일을 확인:

```bash
locale
```

예상 출력:
```
LANG="ko_KR.UTF-8"
LC_COLLATE="ko_KR.UTF-8"
LC_CTYPE="ko_KR.UTF-8"
LC_MESSAGES="ko_KR.UTF-8"
LC_MONETARY="ko_KR.UTF-8"
LC_NUMERIC="ko_KR.UTF-8"
LC_TIME="ko_KR.UTF-8"
LC_ALL="ko_KR.UTF-8"
```

## 🌐 서버 UTF-8 헤더 확인

서버가 올바른 인코딩을 전송하는지 확인:

```bash
curl -I http://localhost:8000/index.html | grep -i content-type
```

예상 출력:
```
Content-Type: text/html; charset=utf-8
```

## 🐛 문제 해결

### 한글이 여전히 깨져 보이는 경우

1. **브라우저 캐시 지우기**
   - Chrome: `Cmd + Shift + R` (Mac) 또는 `Ctrl + F5` (Windows)
   - Safari: `Cmd + Option + E`, 그 다음 `Cmd + R`

2. **로케일이 설치되어 있는지 확인**
   ```bash
   locale -a | grep ko_KR
   ```

   출력에 `ko_KR.UTF-8`가 없다면:
   ```bash
   # macOS
   # 이미 설치되어 있어야 함. 없다면 시스템 환경설정에서 한국어 추가

   # Linux (Ubuntu/Debian)
   sudo locale-gen ko_KR.UTF-8
   sudo update-locale
   ```

3. **서버 재시작**
   ```bash
   # 기존 서버 종료
   lsof -ti:8000 | xargs kill

   # 새로 시작
   ./start-server.sh
   ```

4. **Python 버전 확인**
   ```bash
   python3 --version
   ```
   Python 3.6 이상이 권장됩니다.

### macOS에서 로케일 오류가 발생하는 경우

터미널 앱 설정:
1. Terminal.app 열기
2. Preferences (환경설정)
3. Profiles → Advanced
4. "Set locale environment variables on startup" 체크

## 📚 추가 정보

### UTF-8이 중요한 이유

- CalorieBuddy의 모든 UI 텍스트가 한글로 작성됨
- JSON 데이터 파일 (`data/foods.json`, `data/messages.json`)이 한글 포함
- JavaScript 파일 내 한글 문자열 및 주석
- API 응답 메시지가 한글

### 서버 스크립트가 하는 일

`start-server.sh`와 Python 서버 스크립트는:

1. 환경변수 `LANG`과 `LC_ALL`을 `ko_KR.UTF-8`로 설정
2. HTTP 응답 헤더에 `charset=utf-8` 명시
3. HTML, JavaScript, CSS, JSON 파일에 적절한 Content-Type 전송

## 🎯 개발 워크플로우

```bash
# 1. 로케일 설정 (첫 실행 시 한 번만)
echo 'export LANG=ko_KR.UTF-8' >> ~/.zshrc
echo 'export LC_ALL=ko_KR.UTF-8' >> ~/.zshrc
source ~/.zshrc

# 2. 프로젝트 디렉토리로 이동
cd calorie-chatbot-mvp

# 3. 서버 시작
./start-server.sh

# 4. 브라우저에서 확인
open http://localhost:8000

# 5. 개발자 콘솔 열기 (Cmd+Option+J)
# 한글이 제대로 표시되는지 확인
```

## ✨ 추가 팁

### VS Code 사용자

VS Code에서도 UTF-8 인코딩 사용:

1. 설정 (`Cmd + ,`)
2. "files.encoding" 검색
3. "UTF-8" 선택

### Git 설정

Git 커밋 메시지도 한글 사용 시:

```bash
git config --global core.quotepath false
```

---

**작성일**: 2026-01-17
**업데이트**: 한글 로케일 설정 완료
