# Git cleanup: secrets and personal data that are tracked in this repository

Status: **nothing here has been run.** These are instructions for you (the repo owner). Do them in order.

## Why
`git ls-files` shows that 5 `.env` files and about 44 lead / click / partner data files are committed and pushed to GitHub.
One `.env` (`public_html/crm/crm_subdomain_update/.env`) holds database credentials. Treat everything in them as exposed,
even after the files are removed from the latest commit, because they are still in the history.

## Step 0: before touching git
1. Make the GitHub repository **private** (Settings → General → Danger Zone → Change visibility).
2. **Rotate** every secret that was in those files: the database password, any API keys, the Super Admin password, the
   partner API keys / postback secrets and the default partner passwords. Rotating matters more than removing the files.
3. Make sure the server import has already used the data files (they are the import source). Keep a private backup copy
   of them outside the repo (for example in an encrypted folder) until the import is verified.

## Step 1: stop tracking the files (they stay on disk)
Run from the repository root (`paisainminutes-crm/`):

```bash
# 1. the .env files
git rm --cached $(git ls-files | grep -E '(^|/)\.env$')

# 2. lead / click / partner data files and logs
git rm --cached $(git ls-files | grep -E '\.csv$|(^|/)data/[^/]+\.json$|public/data/|partner_assignments\.json$|leads_log')

git status --short | head -60     # check: only the files you expect are listed as deleted from the index
```

## Step 2: stop them coming back
Append to `.gitignore` (root of this repo):

```
.env
**/.env
**/.env.*
!**/.env.example
**/leads_log.csv
**/clicks_log.csv
**/partner_assignments.json
public_html/data/
public_html/crm/data/
public_html/crm/public/data/
public_html/admin/**/data/
public_html/deploy_update/data/
```

Optionally add an example file with names only, so people know which variables exist:
`public_html/.env.example` containing `BACKEND_API_URL=` (no values).

## Step 3: commit
```bash
git add .gitignore
git commit -m "chore: stop tracking .env files and lead/click data"
git push
```
The files are now untracked but still in the old commits.

## Step 4 (recommended): remove them from the history too
Only after Step 0 (rotation) is done. This rewrites history, so everyone who has a clone must re-clone afterwards.

```bash
pip install git-filter-repo        # or use the BFG Repo-Cleaner
git clone --mirror <repo-url> repo-backup.git      # safety copy first
git filter-repo --invert-paths \
  --path-regex '(^|/)\.env$' \
  --path-regex '\.csv$' \
  --path-regex '(^|/)data/[^/]+\.json$' \
  --path-regex 'public/data/' \
  --path-regex 'partner_assignments\.json$'
git push --force --all
git push --force --tags
```
Then ask GitHub support to purge cached views if the repository was ever public, and delete any forks.

## Step 5: check
```bash
git ls-files | grep -E '(^|/)\.env$|\.csv$|(^|/)data/[^/]+\.json$' || echo "clean"
git log --all --oneline -- '*.env' | head      # empty after Step 4
```

## Other copies that still contain the old Super Admin password (not edited)
`public_html/crm/crm_subdomain_update/assets/index.js`, `public_html/admin/assets/index.js`, `public_html/crm.php` and the
`public_html/deploy_update/` copies. The password must be changed (Step 0) and these stale copies are the first candidates
to delete once you decide the legacy cleanup (see "Files that become deletable" in `plan.md`, Phase 9).
