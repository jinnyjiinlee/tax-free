#!/bin/bash

# jinny 브랜치에서 커밋하고 푸시하는 스크립트
# 사용법: ./commit-and-push.sh "커밋 메시지"

cd "$(dirname "$0")"

# jinny 브랜치로 전환
current_branch=$(git branch --show-current)
if [ "$current_branch" != "jinny" ]; then
    echo "⚠️  jinny 브랜치로 전환합니다..."
    git checkout jinny
fi

# 커밋 메시지 확인
if [ -z "$1" ]; then
    echo "❌ 커밋 메시지를 입력해주세요."
    echo ""
    echo "사용법: ./commit-and-push.sh \"커밋 메시지\""
    echo "예시: ./commit-and-push.sh \"feat: 새로운 기능 추가\""
    exit 1
fi

COMMIT_MSG="$1"

echo "📝 변경사항 확인 중..."
git status --short

echo ""
echo "➕ 모든 변경사항 스테이징..."
git add .

echo ""
echo "💾 커밋 중: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

if [ $? -eq 0 ]; then
    echo ""
    echo "📤 GitHub에 푸시 중..."
    git push origin jinny
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 완료! 커밋과 푸시가 성공했습니다."
        echo "   GitHub에서 확인: https://github.com/jinnyjiinlee/tax-free/tree/jinny"
    else
        echo ""
        echo "❌ 푸시 실패. 네트워크나 인증 문제일 수 있습니다."
    fi
else
    echo ""
    echo "❌ 커밋 실패. 변경사항이 없거나 오류가 발생했습니다."
fi
