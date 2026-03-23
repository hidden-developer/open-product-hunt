---
name: introduce
description: Register a new service/app to dal.ink by creating a PR automatically
---

# /introduce - 서비스 등록 스킬

이 스킬은 dal.ink에 새로운 서비스/앱을 등록하기 위한 PR을 자동으로 생성합니다.

## 실행 흐름

### Step 0: 사전 체크
1. `gh auth status`를 실행하여 GitHub CLI 인증 상태를 확인합니다. 미인증시 "gh auth login을 먼저 실행해 주세요"라고 안내하고 중단합니다.
2. `git remote -v`로 현재 레포가 hidden-developer/hidden-developer.github.io의 fork인지 확인합니다.
3. fork가 아닌 경우, 사용자에게 "이 레포의 fork가 필요합니다. fork를 생성할까요?"라고 물어본 후 `gh repo fork hidden-developer/hidden-developer.github.io --clone`을 실행합니다.

### Step 1: URL 수집
사용자에게 "등록할 서비스/앱의 URL을 입력해 주세요"라고 요청합니다.

### Step 2: 메타데이터 자동 수집
WebFetch 도구로 입력받은 URL에 접속하여 다음 정보를 수집합니다:
- og:title → name 후보
- og:description → description 후보
- og:image → 참고용
- 페이지 title → name 대체

수집된 정보를 사용자에게 보여주고 확인을 받습니다.

### Step 3: 스크린샷
"서비스 스크린샷 파일 경로를 입력해 주세요 (PNG/JPG, 권장 1280x800, 500KB 이하)"라고 요청합니다.
- Read 도구로 파일 존재 여부 확인
- 파일 크기 확인 (Bash: `ls -la`)

### Step 4: 카테고리 선택
12개 카테고리를 번호와 함께 표시하고 선택을 요청합니다:
1. productivity (생산성)
2. developer-tools (개발 도구)
3. design (디자인)
4. communication (커뮤니케이션)
5. education (교육)
6. finance (금융)
7. health (건강)
8. entertainment (엔터테인먼트)
9. social (소셜)
10. utilities (유틸리티)
11. ai (AI)
12. other (기타)

### Step 5: 태그 입력
"태그를 입력해 주세요 (쉼표로 구분, 최대 5개)"라고 요청합니다.

### Step 6: 타입 선택
"서비스 유형을 선택해 주세요: 1) web 2) app 3) both"라고 요청합니다.

### Step 7: 스토어 링크 (app/both인 경우)
type이 app 또는 both인 경우:
- "App Store URL을 입력해 주세요 (없으면 Enter)"
- "Play Store URL을 입력해 주세요 (없으면 Enter)"

### Step 8: 설명 작성
수집된 정보를 바탕으로 AI가 한국어 설명 초안을 작성합니다:
- description: 한 줄 소개 (최대 160자)
- body: 서비스 소개 마크다운 (2-3 문단 + 주요 기능 목록)

초안을 사용자에게 보여주고 수정 요청을 받습니다.

### Step 9: 파일 생성
1. slug을 name에서 생성 (소문자, 하이픈 구분, 특수문자 제거)
2. Write 도구로 `src/content/services/{slug}.md` 생성 (frontmatter + body)
3. Bash로 스크린샷 파일을 `public/screenshots/{slug}.png`으로 복사

파일 포맷 예시:
```md
---
name: "{name}"
url: "{url}"
type: "{type}"
description: "{description}"
screenshot: "/screenshots/{slug}.png"
category: "{category}"
tags: [{tags}]
author: "{github-username}"
publishedAt: "{YYYY-MM-DD}"
---

{body}
```

### Step 10: PR 생성
```bash
git checkout -b add/{slug}
git add src/content/services/{slug}.md public/screenshots/{slug}.png
git commit -m "Add service: {name}"
gh pr create --repo hidden-developer/hidden-developer.github.io \
  --title "Add service: {name}" \
  --body "## 서비스 등록\n\n- **서비스명**: {name}\n- **URL**: {url}\n- **유형**: {type}\n- **카테고리**: {category}\n\n자동 생성된 PR입니다 (/introduce 스킬 사용)"
```

PR URL을 사용자에게 보여줍니다.
