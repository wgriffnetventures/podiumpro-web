# PodiumPro public website

Buildless HTML/CSS website with home, `/support/`, and `/privacy/` pages. Source page templates are in `pages/`; `node scripts/build.mjs` generates static pages in `dist/`. No packages or remote assets are required.

Set the verified copyright owner and public support email in `identity.json`, then rebuild. Until both are set, the pages display a draft notice and robots disallow indexing. Do not use the draft as an App Store support/privacy URL.

Repository: https://github.com/wgriffnetventures/podiumpro-web

Hosting target: GitHub Pages, with `basePath` set to `/podiumpro-web`. A GitHub Actions workflow builds and deploys the static site when manually triggered. Set Pages' source to GitHub Actions before deploying. The workflow refuses to deploy until contact information is complete. No repository credentials belong in this checkout.

Before public launch, verify the support contact works, the privacy description matches the shipped app and hosting configuration, pages load without sign-in, and the app exposes the public support/privacy links in Settings. App Store Connect's Copyright field uses `2026 <rights holder>` without the © symbol; the app and website may display ©.
