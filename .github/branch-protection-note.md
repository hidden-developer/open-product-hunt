# Branch Protection Setup

Go to: Settings → Branches → Add branch protection rule

## Rule for `main` branch:
- **Branch name pattern**: `main`
- ✅ Require a pull request before merging
  - ✅ Require approvals (1)
  - ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require status checks to pass before merging
  - Required checks: `validate` (from pr-review.yml)
- ✅ Do not allow bypassing the above settings
- ❌ Allow force pushes (disabled)
- ❌ Allow deletions (disabled)

## Notes:
- The PR review workflow automatically requests review from original service authors when their content is modified
- OPENAI_API_KEY secret is needed for AI content moderation (optional)
