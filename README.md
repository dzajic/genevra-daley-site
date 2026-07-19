# Genevra Daley portfolio

Markdown-powered recreation of [genevradaley.com](https://genevradaley.com), prepared for GitHub Pages.

## Editing the site

The artwork and written content live in `src/pages/` as Markdown files. Each
page has a short settings block followed by its editable content. Shared page
structure is in `src/_includes/`, all styling is in `src/assets/site.css`, and
carousel behavior is in `src/assets/site.js`.

## Preview locally

```sh
pnpm install
pnpm dev
```

Eleventy prints the local preview address. Changes to Markdown, templates, CSS,
or JavaScript rebuild automatically.

## Build and verify

```sh
pnpm validate
```

The generated static website is written to `_site/`.

## Before publishing

- Confirm image credits, captions, and final copy with Genevra Daley.
- Connect the contact form to an approved endpoint if required.
- Enable GitHub Pages and update the domain DNS only after final approval.
