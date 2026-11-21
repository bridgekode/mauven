# Publishing to **bridgekode/mauven** only

This package is prepared for the existing repository at
https://github.com/bridgekode/mauven — it must not be used to create or publish
to any other repository.

Before pushing, clone the existing repository, compare files, and use a branch
if existing content might be overwritten. Do not use `git push --force`.

## Safe steps (macOS Terminal)

```bash
git clone https://github.com/bridgekode/mauven.git
cd mauven
# Copy the CONTENTS of the extracted Mauven-GitHub-Ready folder here.
git status
git add .
git commit -m "Add Mauven v0.9.1 browser prototype and test workflow"
git push origin HEAD
```

If the repository contains files you did not expect, inspect the differences and
do not overwrite them blindly.

## GitHub Pages demo

1. Repository Settings → Pages → Build and deployment → Source → **GitHub Actions**.
2. Push the workflow to `main` and check the Actions tab for the test/deploy jobs.
3. Once successful, the expected site address is:
   https://bridgekode.github.io/mauven/
4. This is a **public localStorage demo**, not private cloud-hosted notes.

If the repo default branch is not `main`, adjust the workflow branch filters before pushing.

## Checks

- Workflows: four Chromium regression suites, then static demo deployment.
- User acceptance: create a note, add tasks, expand completion history, confirm deletion.
- Inspect browsers and mobile; test Ctrl/Cmd+Z caveat and storage behavior.
- Never copy private notes or browser backups into the repository.
