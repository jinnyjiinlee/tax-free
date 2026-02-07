#!/bin/bash

# jinny 브랜치를 GitHub에 푸시하는 스크립트

cd "$(dirname "$0")"

echo "🚀 jinny 브랜치를 GitHub에 푸시합니다..."
echo ""

# 현재 브랜치 확인
current_branch=$(git branch --show-current)
echo "현재 브랜치: $current_branch"

if [ "$current_branch" != "jinny" ]; then
    echo "⚠️  jinny 브랜치로 전환합니다..."
    git checkout jinny
fi

# 푸시 실행
echo ""
echo "📤 푸시 중..."
git push -u origin jinny

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 성공! jinny 브랜치가 GitHub에 푸시되었습니다."
    echo "   GitHub에서 확인해보세요: https://github.com/jinnyjiinlee/tax-free"
else
    echo ""
    echo "❌ 푸시 실패. 인증이 필요할 수 있습니다."
    echo ""
    echo "다음 중 하나를 시도해보세요:"
    echo "1. GitHub Personal Access Token 사용:"
    echo "   git remote set-url origin https://YOUR_TOKEN@github.com/jinnyjiinlee/tax-free.git"
    echo ""
    echo "2. SSH 키 설정 후:"
    echo "   git remote set-url origin git@github.com:jinnyjiinlee/tax-free.git"
fi
