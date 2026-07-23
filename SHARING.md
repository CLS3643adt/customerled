# Sharing the Care Hub Voice interactive prototype

## Live demo (temporary public tunnel)

While this cloud agent session is still running, open:

**https://wav-debut-mailto-surfing.trycloudflare.com**

This URL stops working when the session ends. Use option A or B below for a lasting link.

## Durable option A — GitHub Pages (recommended once enabled)

This repo is prepared to publish from the `/docs` folder.

### Enable in GitHub (one-time)

1. Merge PR `#1` into `main` (or keep using this branch — the workflow supports both).
2. Open the repo: https://github.com/CLS3643adt/customerled
3. Go to **Settings → Pages**
4. Under **Build and deployment**:
   - Source: **GitHub Actions**
5. Open the **Actions** tab, run **Deploy Care Hub prototype to GitHub Pages** if it did not start automatically.
6. When green, your site URL will be:

`https://cls3643adt.github.io/customerled/`

> Note: this repository is currently **private**. For anyone on the internet to open the Pages URL without a GitHub login, either:
> - make the repository **public**, or
> - use a GitHub plan that supports private GitHub Pages and share access as needed.

### What gets published

Files in `/docs` (copied from `customer-led-strategy/care-hub-voice-screen-pop`).

After editing the prototype source, refresh `/docs` before publish:

```bash
cp customer-led-strategy/care-hub-voice-screen-pop/{index.html,app.js,flows.js,styles.css} docs/
cp customer-led-strategy/care-hub-voice-screen-pop/README.md docs/README.md
```

## Durable option B — Netlify Drop (public in ~30 seconds)

1. Zip or open folder: `customer-led-strategy/care-hub-voice-screen-pop`
2. Visit https://app.netlify.com/drop
3. Drop the folder
4. Share the `*.netlify.app` link

## What to tell viewers

> Open the link → on the Demo hub choose a scenario → **Start demo** → use **Capture next answer** (Interactive) or switch to **Guided auto-play**.
