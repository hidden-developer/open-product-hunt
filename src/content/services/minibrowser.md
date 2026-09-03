---
name: "MiniBrowser"
url: "https://github.com/trendzza/minibrowser"
type: "app"
description_ko: "RAM을 아끼는 네이티브 macOS 브라우저. 탭 보관으로 메모리를 절약하고, 추적기 차단과 개인정보 보호에 집중."
description_en: "A native macOS browser that doesn't eat your RAM; tab hibernation, network-layer tracker blocking, and privacy by default."
screenshot: "/screenshots/minibrowser.png"
category: "utilities"
tags: ["browser", "macos", "privacy", "webkit", "open-source"]
author: "trendzza"
repo: "https://github.com/trendzza/minibrowser"
publishedAt: "2026-09-04"
---

MiniBrowser는 Swift와 WebKit으로 만든 네이티브 macOS 브라우저입니다.
Chromium이 아닌, Safari와 같은 렌더링 엔진을 사용하면서도 개발자에게 유용한 기능을 제공합니다.

## 주요 기능
- 초저메모리: 탭 하이버네이션, 백그라운드 탭 동결, RAM HUD
- 네트워크 레이어 추적기 차단: 광고·추적기를 다운로드 전에 차단
- 사전 워밍 WebKit: 첫 페이지 로딩이 냉시작이 아님
- 세션 복원, 리더 모드, PIP, Command Palette
- Web Inspector, UA 전환, 로컬호스트 개발 서버 자동 감지

<!-- @en -->

MiniBrowser is a native macOS browser built with Swift and WebKit — not a
Chromium fork, not an Electron wrapper. It uses the same engine as Safari but
rebuilds around memory efficiency, speed, and privacy.

## Key Features
- Ultra-low RAM: tab hibernation, background-tab freezing, live RAM HUD
- Network-layer ad/tracker blocking: ads blocked before they download
- Pre-warmed WebKit: the first page isn't a cold start
- Session restore, reader mode, Picture-in-Picture, Command Palette (⌘K)
- Developer tools: Web Inspector, UA switching, localhost dev-server discovery
- Universal binary: arm64 + x86_64, macOS 11.0+
