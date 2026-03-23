---
description: Register a new service/app to dal.ink by creating a PR automatically. Works from any project.
---

# /introduce - dal.ink Service Registration

This skill automatically creates a PR to register a new service/app on dal.ink.
It works from **any project directory** — you don't need to be in the open-product-hunt repo.

## Flow

### Step 0: Pre-checks

1. Run `gh auth status` to verify GitHub CLI authentication.
   - If not authenticated: tell the user to run `gh auth login` first and stop.

2. Check if a fork exists:
   ```bash
   gh repo view hidden-developer/open-product-hunt --json isFork 2>/dev/null
   ```
   - If no fork: ask "A fork of the dal.ink repo is needed. Create one?" then:
     ```bash
     gh repo fork hidden-developer/open-product-hunt --clone=false
     ```

3. Prepare the working directory:
   ```bash
   # Clone user's fork to a temp directory
   WORK_DIR=$(mktemp -d)/open-product-hunt
   GITHUB_USER=$(gh api user --jq '.login')
   gh repo clone $GITHUB_USER/open-product-hunt $WORK_DIR -- --depth 1
   cd $WORK_DIR
   ```
   - Remember the original project directory as `ORIGINAL_DIR`.

### Step 1: URL Collection
Ask the user: "Please enter the URL of the service/app you want to register."

### Step 2: Auto-collect Metadata
Use the WebFetch tool to access the provided URL and collect:
- og:title → name candidate
- og:description → description candidate
- og:image → reference
- page title → name fallback

Show the collected info to the user and get confirmation.

### Step 3: Screenshot
Offer two methods:

**Method A (recommended)**: "Please enter the screenshot file path (PNG/JPG, recommended 1280x800, under 500KB)"
- Use the local file path provided by the user
- Support relative paths based on `ORIGINAL_DIR`

**Method B (auto)**: "Shall I auto-capture a screenshot from the URL?"
- If Playwright is installed, auto-capture:
  ```bash
  npx playwright screenshot {url} $WORK_DIR/public/screenshots/{slug}.png --viewport-size=1280,800
  ```
- If not installed, fall back to Method A

### Step 4: Category Selection
Display 12 categories with numbers and ask for selection:
1. productivity
2. developer-tools
3. design
4. communication
5. education
6. finance
7. health
8. entertainment
9. social
10. utilities
11. ai
12. other

### Step 5: Tag Input
Ask: "Please enter tags (comma-separated, up to 5)."

### Step 6: Type Selection
Ask: "Please select the service type: 1) web 2) app 3) both"

### Step 7: Store Links (if app/both)
If type is app or both:
- "Enter the App Store URL (press Enter to skip)"
- "Enter the Play Store URL (press Enter to skip)"

### Step 8: Write Descriptions (Korean + English)
Based on collected info, AI drafts **both Korean and English descriptions**:
- description_ko: Korean one-liner (max 160 chars)
- description_en: English one-liner (max 160 chars)
- body: Korean service intro + `<!-- @en -->` separator + English service intro

Show the draft to the user and accept edits.

### Step 9: File Generation
1. Generate slug from name (lowercase, hyphen-separated, no special chars)
2. In the working directory ($WORK_DIR):
   - Use Write tool to create `src/content/services/{slug}.md` (frontmatter + body)
   - Copy screenshot to `public/screenshots/{slug}.png`

File format:
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

{Korean body}

<!-- @en -->

{English body}
```

### Step 10: Create PR
```bash
cd $WORK_DIR
git checkout -b add/{slug}
git add src/content/services/{slug}.md public/screenshots/{slug}.png
git commit -m "Add service: {name}"
git push -u origin add/{slug}
gh pr create --repo hidden-developer/open-product-hunt \
  --title "Add service: {name}" \
  --body "## Service Registration

- **Name**: {name}
- **URL**: {url}
- **Type**: {type}
- **Category**: {category}

Auto-generated PR via /introduce skill"
```

Show the PR URL to the user.

### Step 11: Cleanup
```bash
cd $ORIGINAL_DIR  # Return to original project
rm -rf $WORK_DIR  # Delete temp clone
```
