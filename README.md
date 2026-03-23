# Dalink (dal.ink)

> 누구나 PR로 등록하는 오픈소스 서비스 & 앱 디렉토리

[![GitHub Pages](https://github.com/hidden-developer/hidden-developer.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/hidden-developer/hidden-developer.github.io/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hidden-developer/hidden-developer.github.io/pulls)

---

## 소개

**dal.ink**는 서비스와 앱을 발견하고 소개하는 오픈소스 디렉토리입니다.

- **PR 기반 등록** — GitHub PR을 통해 누구나 자유롭게 서비스를 등록할 수 있습니다
- **자동 빌드/배포** — GitHub Actions와 GitHub Pages로 머지 즉시 자동 배포됩니다
- **AI 검색 최적화** — AEO/GEO 최적화로 AI 검색엔진(Perplexity, ChatGPT 등)에서도 잘 노출됩니다
- **Claude Code 스킬** — `/introduce` 명령 한 번으로 메타데이터 수집부터 PR 생성까지 자동화됩니다

---

## 서비스 등록 방법

### 방법 1: Claude Code 스킬 (추천)

[Claude Code](https://claude.ai/code)에서 이 레포를 fork한 뒤 아래 명령을 실행하세요:

```bash
/introduce
```

자동으로 다음 과정이 진행됩니다:

1. URL 입력 → og:title, og:description 자동 수집
2. 스크린샷 파일 경로 입력
3. 카테고리 & 태그 선택
4. AI가 한국어 설명 초안 작성
5. 서비스 파일 생성 + PR 자동 생성

### 방법 2: 수동 PR

1. 이 레포를 fork합니다
2. `src/content/services/{slug}.md` 파일을 생성합니다 (포맷은 아래 참조)
3. `public/screenshots/{slug}.png` 스크린샷을 추가합니다
4. PR을 생성합니다

---

## 서비스 데이터 포맷

`src/content/services/{slug}.md` 파일을 아래 형식으로 작성합니다:

```markdown
---
name: "서비스 이름"               # 표시될 서비스명
url: "https://example.com"        # 서비스 공식 URL
type: "web"                       # web | app | both
description: "한 줄 소개"         # 최대 160자, 한국어 권장
screenshot: "/screenshots/{slug}.png"  # 스크린샷 경로
category: "developer-tools"       # 아래 카테고리 목록 참조
tags: ["tag1", "tag2"]            # 최대 5개
author: "github-username"         # 등록자 GitHub ID
repo: "https://github.com/..."    # (선택) 오픈소스인 경우 저장소 URL
appStore: "https://apps.apple.com/..."   # (선택) App Store URL
playStore: "https://play.google.com/..."  # (선택) Play Store URL
publishedAt: "2026-01-01"         # 등록일 (YYYY-MM-DD)
---

서비스에 대한 상세 설명을 마크다운으로 작성합니다.

## 주요 기능
- 기능 1
- 기능 2
- 기능 3
```

---

## 카테고리 목록

| 키 | 설명 |
|---|---|
| `productivity` | 생산성 |
| `developer-tools` | 개발 도구 |
| `design` | 디자인 |
| `communication` | 커뮤니케이션 |
| `education` | 교육 |
| `finance` | 금융 |
| `health` | 건강 |
| `entertainment` | 엔터테인먼트 |
| `social` | 소셜 |
| `utilities` | 유틸리티 |
| `ai` | AI |
| `other` | 기타 |

---

## 스크린샷 가이드

| 항목 | 권장 사항 |
|---|---|
| 크기 | 1280x800 px |
| 포맷 | PNG, JPG, WebP |
| 최대 용량 | 500KB |
| 내용 | 서비스의 메인 화면 |

- 로그인 화면보다는 실제 서비스 화면을 캡처해 주세요
- 개인정보가 포함된 화면은 피해 주세요
- 밝은 테마 스크린샷을 권장합니다

---

## 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (localhost:4321)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

## 기술 스택

| 기술 | 용도 |
|---|---|
| [Astro](https://astro.build) | 정적 사이트 프레임워크 |
| [Tailwind CSS](https://tailwindcss.com) | 스타일링 |
| [Pagefind](https://pagefind.app) | 정적 검색 |
| [satori](https://github.com/vercel/satori) | OG 이미지 생성 |
| [OpenAI](https://openai.com) | AI 기반 기능 |
| [GitHub Actions](https://github.com/features/actions) | CI/CD 자동화 |
| [GitHub Pages](https://pages.github.com) | 정적 호스팅 |

---

## Contributing

기여를 환영합니다! 다음 방법으로 참여할 수 있습니다:

- **서비스 등록** — 유용한 서비스/앱을 PR로 등록해 주세요
- **버그 리포트** — [Issues](https://github.com/hidden-developer/hidden-developer.github.io/issues)에 버그를 제보해 주세요
- **기능 제안** — 새로운 아이디어가 있다면 Issue를 열어 논의해 주세요
- **코드 기여** — 개선 사항을 PR로 보내주세요

### PR 가이드

- 서비스 등록 PR은 하나의 서비스만 포함해 주세요
- 스크린샷은 반드시 포함해 주세요
- 설명은 한국어로 작성해 주세요
- 중복 등록 여부를 먼저 확인해 주세요

---

## 라이선스

[MIT](LICENSE) © Dalink Contributors
