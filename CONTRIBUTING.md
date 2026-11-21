# Contributing to Mauven

Mauven is currently a **frontend prototype**. Please open an issue describing the change
before attempting a large feature or architectural rewrite.

## Development

```bash
python3 -m http.server 4173
```

Visit `http://localhost:4173/`.

## Tests

```bash
python3 -m pip install -r tests/requirements.txt
python3 -m playwright install chromium
python3 tests/test_completed_history.py
python3 tests/test_tasks_calendar.py
python3 tests/test_slash_commands.py
python3 tests/test_youtube_embeds.py
```

Tests use headless Chromium and mocked localStorage to isolate test cases. For a
system-installed Chromium, set `MAUVEN_CHROMIUM_PATH=/usr/bin/chromium`.

Keep PRs scoped, test changes, include clear before/after screenshots for UI changes,
and never commit personal notes, tokens, or private keys.
