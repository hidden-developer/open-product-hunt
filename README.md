# Dalink (dal.ink)

> Open-source service & app directory — anyone can register via PR

[![GitHub Pages](https://github.com/hidden-developer/open-product-hunt/actions/workflows/deploy.yml/badge.svg)](https://github.com/hidden-developer/open-product-hunt/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hidden-developer/open-product-hunt/pulls)

---

## About

**dal.ink** is an open-source directory for discovering and showcasing services and apps.

- **PR-based registration** — Anyone can register a service by submitting a GitHub PR
- **Auto build & deploy** — Merges to main trigger automatic deployment via GitHub Actions + GitHub Pages
- **AI search optimized** — AEO/GEO optimized for AI search engines (Perplexity, ChatGPT, etc.)
- **Claude Code skill** — One `/introduce` command automates everything from metadata collection to PR creation

---

## How to Register a Service

### Option 1: Claude Code Skill (Recommended)

The `/introduce` skill lets you register a service from **any project directory** — you don't even need to clone this repo.

#### Prerequisites

- [Claude Code](https://claude.ai/code) installed
- [GitHub CLI](https://cli.github.com/) authenticated (`gh auth login`)

#### Setup

Add this repo as a Claude Code plugin (one-time setup):

```bash
/plugin add hidden-developer/open-product-hunt
```

#### Usage

Run the following command in Claude Code from any project:

```bash
/introduce
```

The skill will interactively guide you through:

1. **URL input** — Enter the service URL; metadata (og:title, og:description) is auto-fetched
2. **Screenshot** — Provide a local file path, or auto-capture via Playwright
3. **Category & tags** — Select from 12 categories, add up to 5 tags
4. **Type** — Choose web, app, or both (with optional App Store / Play Store links)
5. **Description** — AI drafts bilingual descriptions (Korean + English); you review and edit
6. **PR creation** — Service file and screenshot are committed, and a PR is auto-created

The skill handles forking, branching, committing, and PR creation automatically.

### Option 2: Manual PR

1. Fork this repo
2. Create `src/content/services/{slug}.md` (see format below)
3. Add a screenshot at `public/screenshots/{slug}.png`
4. Submit a PR

---

## Service Data Format

Create `src/content/services/{slug}.md` with the following frontmatter:

```markdown
---
name: "Service Name"                     # Display name
url: "https://example.com"               # Official service URL
type: "web"                              # web | app | both
description_ko: "한국어 한 줄 소개"       # Korean description (max 160 chars)
description_en: "One-line description"    # English description (max 160 chars)
screenshot: "/screenshots/{slug}.png"     # Screenshot path
category: "developer-tools"              # See category list below
tags: ["tag1", "tag2"]                   # Up to 5 tags
author: "github-username"                # Contributor's GitHub ID
repo: "https://github.com/..."           # (optional) Repository URL
appStore: "https://apps.apple.com/..."   # (optional) App Store URL
playStore: "https://play.google.com/..." # (optional) Play Store URL
publishedAt: "2026-01-01"               # Registration date (YYYY-MM-DD)
---

Korean description in markdown.

<!-- @en -->

English description in markdown.
```

---

## Categories

| Key | Description |
|---|---|
| `productivity` | Productivity |
| `developer-tools` | Developer Tools |
| `design` | Design |
| `communication` | Communication |
| `education` | Education |
| `finance` | Finance |
| `health` | Health |
| `entertainment` | Entertainment |
| `social` | Social |
| `utilities` | Utilities |
| `ai` | AI |
| `other` | Other |

---

## Screenshot Guide

| Item | Recommendation |
|---|---|
| Size | 1280x800 px |
| Format | PNG, JPG, WebP |
| Max file size | 500KB |
| Content | Main screen of the service |

- Capture the actual service screen, not the login page
- Avoid screens containing personal information
- Light theme screenshots are preferred

---

## Development

```bash
# Install dependencies
npm install

# Start dev server (localhost:4321)
npm run dev

# Production build
npm run build

# Preview build output
npm run preview
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Astro](https://astro.build) | Static site framework |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [satori](https://github.com/vercel/satori) | OG image generation |
| [OpenAI](https://openai.com) | AI-powered features |
| [Supabase](https://supabase.com) | Votes, bookmarks, page views |
| [GitHub Actions](https://github.com/features/actions) | CI/CD automation |
| [GitHub Pages](https://pages.github.com) | Static hosting |

---

## Contributing

Contributions are welcome! Here's how you can participate:

- **Register a service** — Submit useful services/apps via PR
- **Report bugs** — File issues at [Issues](https://github.com/hidden-developer/open-product-hunt/issues)
- **Suggest features** — Open an issue to discuss new ideas
- **Code contributions** — Send improvements via PR

### PR Guidelines

- Each service registration PR should contain only one service
- Screenshots are required
- Bilingual descriptions (Korean + English) are preferred
- Check for duplicates before submitting

---

## License

[MIT](LICENSE) © HD Corporation
