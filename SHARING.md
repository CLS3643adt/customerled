# Sharing the Care Hub Voice interactive prototype

## Live demo (use this now)

**https://cls3643adt.github.io/customerled/docs/**

(GitHub’s default Jekyll workflow published the whole repo, so the prototype currently lives under `/docs/`. After the Care Hub-only workflow redeploys, the cleaner URL below will also work.)

**Preferred URL after next Care Hub deploy:**  
https://cls3643adt.github.io/customerled/

## How to deploy (GitHub Pages)

1. Open the Actions tab:  
   https://github.com/CLS3643adt/customerled/actions
2. In the left sidebar, click **Deploy Care Hub prototype to GitHub Pages**
3. Click **Run workflow** (right side) → branch **main** → **Run workflow**
4. Wait until the run is green (about 1 minute)
5. Open: https://cls3643adt.github.io/customerled/

### One-time Pages settings (if not already done)

1. https://github.com/CLS3643adt/customerled/settings/pages  
2. **Build and deployment → Source:** GitHub Actions  

### Important

Only keep the **Deploy Care Hub prototype to GitHub Pages** workflow.  
If GitHub adds **Deploy Jekyll with GitHub Pages…**, delete that workflow file so it does not overwrite the Care Hub site.

## Alternative — Netlify Drop

1. Use folder: `customer-led-strategy/care-hub-voice-screen-pop` (multi-scenario) or `customer-led-strategy/new-enquiry-to-lead` (Lead-only)
2. Visit https://app.netlify.com/drop
3. Drop the folder and share the `*.netlify.app` link

## What to tell viewers

> Open the link → on the Demo hub choose a scenario → **Start demo** → use **Capture next answer** (Interactive) or switch to **Guided auto-play**.
