# Heard form and scheduler embeds

## Commands

- `bun run build` minifies the deployable JS and CSS into `dist/`.
- `bun run watch` rebuilds on changes.
- Run the configured Prettier formatter after source edits.

## Constraints

- This is vanilla browser JavaScript, not TypeScript.
- Keep embeds isolated with the existing IIFE pattern and preserve resilient handling around DOM, storage, and unload-time requests.
- Use `fetch(..., { keepalive: true })` where the existing unload/partial-fill behavior requires it.
- Treat `dist/` as generated output. README documents each embed's current product behavior and installation.
