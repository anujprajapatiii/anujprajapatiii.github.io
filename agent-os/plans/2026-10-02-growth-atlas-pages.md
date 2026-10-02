# Publish Growth Atlas on GitHub Pages

## Status

Complete — implementation verified; publication status is tracked by GitHub Actions.

## Context

Anuj explicitly requested moving the completed Growth Atlas to GitHub Pages.
The connected GitHub integration cannot create repositories, but it can update
this existing Pages repository. The app is already built and reviewed.

## Desired Outcome

Growth Atlas is available at `/growth-atlas/`, with working assets, hash links,
interactive patterns, and runnable source downloads.

## Approach

Keep the existing Vite app self-contained in `apps/growth-atlas/`. Build its
static output into ignored `public/growth-atlas/` before the existing Astro
build. Existing Pages deployment then publishes both applications together.
This implements the user's requested hosting migration without redesigning
the app or the portfolio.

## Scope

In: app source, dependency installation in CI, combined build, Pages paths,
deployment verification, and maintainer documentation.

Out: portfolio design/content changes, new navigation, app features, a user
study, and further ChatGPT Sites deployment.

## Files To Modify

- `apps/growth-atlas/`: standalone app and its existing dependency lockfile.
- `package.json`: build the app before Astro.
- `.github/workflows/deploy.yml` and `checks.yml`: install the app dependencies.
- `.gitignore`: exclude generated app output.
- `README.md` and `agent-os/system-map.md`: document source and build boundaries.

## Steps

- [x] Verify the app under the `/growth-atlas/` base path.
- [x] Integrate the source and combined build.
- [x] Build and review the combined artifact.
- [x] Configure publication through the existing GitHub Pages deployment.

## Review

- Design: preserve the approved app and existing portfolio.
- Content: retain the curated collection and evidence.
- Architecture: separate app dependencies, generated output, and hash router.
- Verification: combined production build passed for all 13 portfolio routes and Growth Atlas. The design-system guard passed. Browser checks passed for a pattern deep link and source download under `/growth-atlas/`; all 45 manifest paths resolve to files.

## Learnings

Update the system map with the new app source and publication route. The
GitHub installation can update repositories but cannot create them.
