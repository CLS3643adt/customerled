# Sharing and live demo

## Live URL

**https://cls3643adt.github.io/customerled/**

Repo: https://github.com/CLS3643adt/customerled

## Local / offline

```bash
cd prototype
python3 -m http.server 8765
```

Open http://localhost:8765

## Netlify Drop (if you need another public link)

1. Zip or open the `prototype/` folder  
2. Visit https://app.netlify.com/drop  
3. Drop the folder and share the `*.netlify.app` URL  

## What to tell recipients

> Open the link → on the Demo hub choose a scenario → **Start demo** → use **Capture next answer** (Interactive) or switch to **Guided auto-play**.

## Access notes

- The GitHub Pages site is public HTTPS.  
- For restricted stakeholder access (login / SSO / client certs), put Cloudflare Access or similar in front of the host — GitHub Pages does not do mTLS by itself.
