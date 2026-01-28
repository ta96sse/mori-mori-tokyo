# Mori‑Mori TOKYO

The official website for **Mori‑Mori TOKYO**, an adventure team based in Tokyo.
"Mori-Mori makes us DOVA-DOVA."

## 🚀 Tech Stack

- **Framework**: [Astro](https://astro.build)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Package Manager**: [Yarn](https://yarnpkg.com)
- **Deployment**: GitHub Pages (via GitHub Actions)

## 🛠️ Project Structure

```text
/
├── public/          # Static assets (favicons, sitemap, etc.)
├── src/
│   ├── components/  # Reusable UI components
│   ├── layouts/     # Page layouts
│   ├── pages/       # Route definitions (index.astro)
│   └── styles/      # Global styles (Tailwind directives)
├── src/consts.ts    # centralized configuration (SNS links, API URLs, etc.)
└── astro.config.mjs # Astro configuration
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command | Action |
| :--- | :--- |
| `yarn install` | Installs dependencies |
| `yarn dev` | Starts local dev server at `localhost:4321` |
| `yarn build` | Build your production site to `./dist/` |
| `yarn preview` | Preview your build locally, before deploying |

## 📦 Data Management

Data (Race schedule, Member info) is fetched from **Google Spreadsheet** via GAS (Google Apps Script).

- **Development**: You can run `yarn dev` and the data will be fetched client-side or during build depending on logic.
- **Production**: Data is fetched **at build time** in GitHub Actions.
  - The fetch logic is contained within `src/pages/index.astro`.
  - A GitHub Actions workflow (`deploy.yml`) triggers the build.
  - To update data on the site without code changes, trigger the `update-data` repository dispatch event (usually from the GAS script).

## 🚀 Deployment

The site is automatically deployed to **GitHub Pages** whenever:
1.  Changes are pushed to the `main` branch.
2.  The `update-data` webhook is received from GAS.