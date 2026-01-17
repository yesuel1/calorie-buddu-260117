#!/bin/bash
# CalorieBuddy 개발 서버 시작 스크립트
# 한글 UTF-8 인코딩 지원

# 한글 로케일 설정
export LANG=ko_KR.UTF-8
export LC_ALL=ko_KR.UTF-8

# Python 버전 확인
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3가 설치되어 있지 않습니다."
    exit 1
fi

echo "🚀 CalorieBuddy 서버를 시작합니다..."
echo ""

# 서버 스크립트 경로
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 임시 서버 스크립트 생성
cat > /tmp/calorie_server.py << 'EOF'
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import http.server
import socketserver
import os
import sys

# 한글 UTF-8 환경 설정
os.environ['LANG'] = 'ko_KR.UTF-8'
os.environ['LC_ALL'] = 'ko_KR.UTF-8'

PORT = 8000

class KoreanHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # UTF-8 인코딩을 명시적으로 설정
        if self.path.endswith('.html'):
            self.send_header('Content-Type', 'text/html; charset=utf-8')
        elif self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript; charset=utf-8')
        elif self.path.endswith('.css'):
            self.send_header('Content-Type', 'text/css; charset=utf-8')
        elif self.path.endswith('.json'):
            self.send_header('Content-Type', 'application/json; charset=utf-8')
        super().end_headers()

print("=" * 60)
print("🚀 CalorieBuddy 서버 시작")
print("=" * 60)
print(f"📍 주소: http://localhost:{PORT}")
print(f"🌐 로케일: ko_KR.UTF-8")
print(f"📂 경로: {os.getcwd()}")
print("=" * 60)
print("서버가 실행 중입니다... (Ctrl+C로 종료)")
print("=" * 60)
print("")

with socketserver.TCPServer(("", PORT), KoreanHTTPRequestHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n서버를 종료합니다... 👋")
EOF

# 서버 실행
cd "$SCRIPT_DIR"
python3 /tmp/calorie_server.py
