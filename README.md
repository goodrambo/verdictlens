# VerdictLens — AI Models & Skills Ratings MVP

A polished bilingual MVP website for comparing AI models and practical agent skills.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Static export for GitHub Pages
- Seeded local data + generated JSON catalog files

## Included pages

- Home
- Models index
- Skills index
- Compare page
- Use-cases index
- 3 use-case detail pages
- 12 model detail pages
- 12 skill detail pages

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>

## Production build

```bash
npm install
npm run build
npm run start
```

- `npm run build` generates a static export in `out/`
- `npm run start` previews the exported site via Python at <http://localhost:3000>

## Machine-readable data

These files are generated during build:

- `/data/models.json`
- `/data/skills.json`
- `/data/catalog.json`
- `/sitemap.xml`
- `/robots.txt`
- `/llms.txt`

The site also ships with a static social preview image at `/og-cover.png` for Open Graph and Twitter cards.

## GitHub Pages deployment

This repo includes `.github/workflows/deploy-pages.yml`.

Recommended flow:

1. Push to `main`
2. In GitHub repo settings, enable **Pages** with **GitHub Actions** as the source
3. The workflow computes the correct `basePath` automatically for:
   - user/org pages: `https://owner.github.io`
   - project pages: `https://owner.github.io/repo-name`

## Notes

- Content is seeded demo data intended for MVP presentation and product shaping.
- Scores are editorial framework examples, not official vendor benchmark claims.
