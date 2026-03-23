---
name: introduce
description: Register a new service/app to dal.ink by creating a PR automatically. Works from any project.
---

# /introduce - dal.ink 서비스 등록

이 스킬은 **어디서든** dal.ink에 새로운 서비스/앱을 등록하기 위한 PR을 자동으로 생성합니다.
현재 프로젝트가 open-product-hunt 레포가 아니어도 동작합니다.

## 실행 흐름

### Step 0: 사전 체크

1. `gh auth status`를 실행하여 GitHub CLI 인증 상태를 확인합니다.
   - 미인증시: "gh auth login을 먼저 실행해 주세요"라고 안내하고 중단합니다.

2. fork 존재 여부를 확인합니다:
   ```bash
   gh repo view hidden-developer/open-product-hunt --json isFork 2>/dev/null
   ```
   - fork가 없으면: "dal.ink 레포의 fork가 필요합니다. 생성할까요?"라고 물어본 후:
     ```bash
     gh repo fork hidden-developer/open-product-hunt --clone=false
     ```

3. 작업 디렉토리를 준비합니다:
   ```bash
   # 사용자의 fork를 temp 디렉토리에 clone
   WORK_DIR=$(mktemp -d)/open-product-hunt
   GITHUB_USER=$(gh api user --jq '.login')
   gh repo clone $GITHUB_USER/open-product-hunt $WORK_DIR -- --depth 1
   cd $WORK_DIR
   ```
   - 현재 프로젝트 디렉토리를 원래 경로로 기억해둡니다 (`ORIGINAL_DIR`).

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
두 가지 방법 중 하나를 제안합니다:

**방법 A (권장)**: "스크린샷 파일 경로를 입력해 주세요 (PNG/JPG, 권장 1280x800, 500KB 이하)"
- 사용자가 로컬 파일 경로를 제공하면 해당 파일 사용
- `ORIGINAL_DIR` 기준의 상대 경로도 지원

**방법 B (자동)**: "URL에서 자동으로 스크린샷을 캡쳐할까요?"
- Playwright가 설치되어 있으면 자동 캡쳐:
  ```bash
  npx playwright screenshot {url} $WORK_DIR/public/screenshots/{slug}.png --viewport-size=1280,800
  ```
- 설치 안 되어있으면 방법 A로 fallback

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

### Step 8: 설명 작성 (한국어 + 영어)
수집된 정보를 바탕으로 AI가 **한국어와 영어 설명**을 모두 작성합니다:
- description_ko: 한국어 한 줄 소개 (최대 160자)
- description_en: 영어 한 줄 소개 (최대 160자)
- body: 한국어 서비스 소개 + `<!-- @en -->` 구분자 + 영어 서비스 소개

초안을 사용자에게 보여주고 수정 요청을 받습니다.

### Step 9: 파일 생성
1. slug을 name에서 생성 (소문자, 하이픈 구분, 특수문자 제거)
2. 작업 디렉토리($WORK_DIR)에서:
   - Write 도구로 `src/content/services/{slug}.md` 생성 (frontmatter + body)
   - 스크린샷 파일을 `public/screenshots/{slug}.png`으로 복사

파일 포맷:
```md
---
name: "{name}"
url: "{url}"
type: "{type}"
description_ko: "{description_ko}"
description_en: "{description_en}"
screenshot: "/screenshots/{slug}.png"
category: "{category}"
tags: [{tags}]
author: "{github-username}"
publishedAt: "{YYYY-MM-DD}"
---

{한국어 본문}

<!-- @en -->

{영어 본문}
```

### Step 10: PR 생성
```bash
cd $WORK_DIR
git checkout -b add/{slug}
git add src/content/services/{slug}.md public/screenshots/{slug}.png
git commit -m "Add service: {name}"
git push -u origin add/{slug}
gh pr create --repo hidden-developer/open-product-hunt \
  --title "Add service: {name}" \
  --body "## 서비스 등록 / Service Registration

- **서비스명 / Name**: {name}
- **URL**: {url}
- **유형 / Type**: {type}
- **카테고리 / Category**: {category}

자동 생성된 PR입니다 (/introduce 스킬 사용)
Auto-generated PR via /introduce skill"
```

PR URL을 사용자에게 보여줍니다.

### Step 11: 정리
```bash
cd $ORIGINAL_DIR  # 원래 프로젝트로 복귀
rm -rf $WORK_DIR  # temp clone 삭제
```

## 설치 방법

다른 프로젝트에서 이 스킬을 사용하려면:
```bash
# Claude Code에서 플러그인 추가
/plugin add hidden-developer/open-product-hunt

# 그 후 어디서든 실행
/introduce
```
