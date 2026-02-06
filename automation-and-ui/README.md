
# Automation & UI (Repo A)

This repository contains the browser editor page and the GitHub Actions workflow that ingests recipe submissions via **Issues** and appends them to **Repo B** (`recipe-frontend/data/recipes.json`).

## How it works
1. The HTML page (optionally hosted with GitHub Pages from `docs/`) opens a **prefilled GitHub Issue** containing the JSON payload.
2. The workflow in `.github/workflows/ingest-recipe-from-issue.yml` triggers on `issues: opened`, extracts the JSON from the fenced code block, optionally normalizes it with `tools/generate_recipe_json.js`, and then **appends** it to `data/recipes.json` in Repo B using the **Create or update file contents** REST API (Base64 + `sha`).

- GitHub events that can trigger workflows (e.g., `issues: opened`) are documented in **Events that trigger workflows**.  
- The file update uses GitHub REST API: **PUT /repos/{owner}/{repo}/contents/{path}** which requires Base64-encoded content and (when updating) the current blob `sha`.  
- Authentication for REST calls from Actions should use a **Personal Access Token** (fine-grained) stored as an Actions secret.  

## One-time setup

1. **Create Repo B** (e.g., `recipe-frontend`) and commit `data/recipes.json` with `[]` (empty array).  
2. **Create Repo A** (this repo). Commit everything in this folder. Ensure the workflow file is on the **default branch** so it can trigger on issue events.  
3. In **Repo A → Settings → Secrets and variables → Actions**, add a secret named **`generator`** containing a **fine-grained PAT** with **Repository permissions → Contents: Read & write** on **Repo B**.  
4. In the workflow file `ingest-recipe-from-issue.yml`, update:
   - `TARGET_REPO_OWNER` to your Repo B owner (e.g., `Forlgore`)
   - `TARGET_REPO_NAME` to your Repo B name (e.g., `recipe-frontend`)
   - `TARGET_FILE_PATH` if you use a different path (default `data/recipes.json`).
5. In `docs/index.html`, update `REPO_A_OWNER` and `REPO_A_NAME` to point to **this repo** (Repo A). Optionally enable **GitHub Pages** (Settings → Pages → Deploy from branch → `/docs`).

## Usage
- Open the page in `docs/index.html` (from Pages URL or locally), fill in the recipe, click **Submit to GitHub** → a new Issue draft opens in Repo A. Click **Submit**.  
- The Action will run, append to Repo B, and (optionally) comment & close the Issue.

## References
- Events that trigger workflows (GitHub Actions).  
- REST API: Create or update file contents.  
- Authenticating to the REST API / fine-grained PATs.  

