# KeyFlow Typing Coach v1.0.0

## What's new
- Sidebar stays fixed while the main workspace scrolls on desktop; mobile layout remains responsive.
- Google Gemini uses its native generateContent API. If the configured model is retired or unavailable, KeyFlow queries Google for models enabled for your API key and retries with an available Flash model.
- 100 focused lessons spanning beginner, intermediate, and advanced typing skills, organized as ten progressive modules. You can stop at 50 or 80 lessons and still build strong skills; the full 100 is optional.
- Course search, level/completion filters, 25 lessons per page, and saved completion state.
- Every new practice session creates a randomized passage capped at 50 words.
- Built-in live typing metrics and rule-based coaching remain available without AI.
- If an API key is configured, the app automatically requests an AI review after a completed practice session.
- If the AI provider fails, KeyFlow falls back to built-in advice and practice continues.
- AI provider presets: OpenAI, OpenRouter, Groq, Gemini native API with model discovery, and custom OpenAI-compatible endpoints.
- Chrome, Edge, Brave, and Firefox developer-loadable builds.

## Install Chromium browsers
1. Extract the ZIP.
2. Open `chrome://extensions`, `edge://extensions`, or `brave://extensions`.
3. Enable Developer mode.
4. Click Load unpacked and select the extracted folder containing `manifest.json` and `background.js`.
5. Click the toolbar icon to open the local typing workspace.

## Install Firefox
1. Extract the ZIP.
2. Rename `manifest.json` to `manifest.chromium.json`.
3. Rename `manifest.firefox.json` to `manifest.json`.
4. Open `about:debugging#/runtime/this-firefox`.
5. Click Load Temporary Add-on and choose the renamed manifest.
6. Temporary add-ons are removed when Firefox closes. Permanent use requires a signed extension or approved deployment.

## AI setup
Open Settings, select a provider, enter an API key, endpoint, and model. Provider models and endpoints change; verify current details with the provider. Direct browser requests may fail because of network, quota, invalid key/model, or CORS restrictions.

## Reliability and privacy
- Typing, lesson progression, metrics, and built-in coaching work locally without an API key.
- AI is optional and cannot be guaranteed never to fail: provider outages, network problems, quota limits, invalid keys/models, and CORS restrictions are outside the extension's control. When AI fails, local coaching remains available.
- The app does not send every keystroke to the AI. It monitors typing locally in real time and sends aggregate session statistics when requesting a review, limiting unnecessary exposure and API cost.
- The API key is stored in extension local storage. Do not save it on a shared PC profile.
- This is a developer-loadable build, not a signed/published extension-store release.


Version 1.0.0 includes: practice passages are strictly capped at 50 words; Gemini requests attempt model discovery and retry a limited number of alternate Flash models after overload/unavailable responses; a one-time toolbar pinning guide opens after install. Browsers do not allow extensions to pin themselves automatically.


## GitHub tips for contributors

- **Report bugs:** Open an Issue and include your browser, operating system, steps to reproduce, and the exact error message. Never include API keys or other secrets.
- **Suggest features:** Open an Issue describing the problem and the proposed improvement before making large changes.
- **Contribute code:** Fork the repository, create a focused branch, make a small change, test it locally, and open a Pull Request explaining what changed.
- **Protect secrets:** Never commit API keys, tokens, passwords, personal settings, or private data. If a key is exposed, revoke it with the provider immediately; deleting it from a later commit may not remove it from Git history.
- **Keep changes focused:** Avoid unrelated formatting changes and describe any browser-specific limitations.
- **Versioning:** Use tags such as `v1.0.0` for releases and update the changelog when publishing future versions.
- **Testing:** Test the extension in the target browser before claiming compatibility. AI features depend on provider availability, model access, API quotas, and network conditions.

See `SETUP_GUIDE.txt` for local installation and AI setup instructions.
