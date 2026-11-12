# Interview Preparation Hub

A modular, SEO-ready interview preparation platform built with Next.js App Router, TypeScript, and Tailwind CSS. The landing page is powered by a typed content engine containing 40 React interview questions across four categories.

## Requirements

- Node.js 26.x
- npm 10 or newer

## Local development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `Ctrl+C` to stop the development server.

## Validation

```bash
npm run lint
npm run typecheck
npm run validate:content
npm run generate:pdfs
npm run validate:pdfs
npm test
npm run validate:seo
npm run validate:browser
npm run build
```

The content validator checks required fields and references. Tests use Node's built-in runner with React Testing Library and jsdom for browser interactions.

`npm test` generates PDFs before running tests. `npm run validate:seo` checks generated production HTML across all public page routes; run `npm run build` and `npm run start` in one terminal first, then run the audit in another. It checks metadata, JSON-LD, links, sitemap, robots, and the generated social image. `SEO_AUDIT_URL` can point the audit at another running origin and defaults to `http://localhost:3000`. `npm run validate:production` checks every question and category route, search/filter results, all 45 deployed PDFs, sitemap, robots, and the health endpoint. It requires `PRODUCTION_URL` and the production site's `NEXT_PUBLIC_SITE_URL` (or Vercel's `VERCEL_PROJECT_PRODUCTION_URL`). `npm run validate:browser` starts the local production server and installed Chrome/Chromium to check primary routes at 375, 768, 1024, and 1440 pixels, including overflow, keyboard navigation, and axe accessibility checks. Set `BROWSER_BASE_URL` to an HTTPS deployment URL to run those same browser checks against a deployment instead.

## Project structure

```text
src/
  app/                 Landing page, React/category routes, question routes, and design tokens
  components/
    common/            Shared icons, buttons, badges, and containers
    home/              Landing page sections
    layout/            Header, mobile navigation, theme toggle, and footer
    questions/         Question cards, filters, details, code blocks, and navigation
    pdf/               React PDF document components and the HTML download library
  config/              Site navigation and configurable social URLs
  content/             Technology/category metadata and modular React question sets
  lib/                 Content lookup, search, filtering, routes, and validation utilities
  types/               Question, code example, category, and technology models
scripts/               Content validation, PDF generation, and PDF verification
tests/                 Content, browsing, and PDF generation tests
.github/workflows/     Required CI workflow for pull requests and main
public/
  images/              Static image assets
  fonts/               Local font assets
Dockerfile             Multi-stage standalone production image foundation
.dockerignore          Files excluded from Docker build context
.github/workflows/ci.yml  Content, PDF, code, browser, build, and Docker checks
```

Question browsing is available at `/react`; category pages and individual answer pages are generated from the content files. Search and filters submit as accessible GET forms, so they work without client-side state. The short route `/react/architecture` redirects to the existing category slug at `/react/architecture-optimization`.

The PDF library is available on `/react`. Downloads are rendered on demand by `/api/downloads/[filename]`, so development startup, tests, and production builds do not generate PDF files. To generate a local batch for document quality checks, run `npm run generate:pdfs`, then `npm run validate:pdfs`. Question pages link to [@ai_dev234](https://www.instagram.com/ai_dev234/); add an `instagramReelUrl` to a question in `src/content/react` to point directly to its reel.

## Search and social metadata

Page titles, descriptions, canonical paths, Open Graph cards, and Twitter/X cards are generated from the route and its content. Question pages include article and breadcrumb JSON-LD; the home page includes WebSite JSON-LD. The sitemap and robots files use the configured public origin. Set `NEXT_PUBLIC_SITE_URL` to the production HTTPS origin in Vercel's **Production** environment. If it is absent, the site uses Vercel's `VERCEL_PROJECT_PRODUCTION_URL` system variable, which identifies the production host even during a Preview build; it never uses `VERCEL_URL`, the per-deployment preview host. Enable Vercel's automatic system environment variables for this fallback. Local development falls back to `http://localhost:3000`; production builds without either production URL omit origin-dependent metadata and sitemap entries instead of publishing a guessed host. The static branded `public/social-image.png` is used as the default social preview to avoid a separately bundled Edge Function; optionally set `NEXT_PUBLIC_OG_IMAGE_URL` to another root-relative image path or absolute HTTPS image URL.

## Social links

Copy `.env.example` to `.env.local` for development. Configure these values in Vercel's Project Settings â†’ Environment Variables:

| Variable | Required | Value and scope |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | `https://<project-name>.vercel.app` (or the chosen primary custom domain); set for Production. The Vercel production-host fallback is used if unset. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | The exact `content` value Google gives for HTML-tag verification of a URL-prefix property. Set for Production, then redeploy. |
| `NEXT_PUBLIC_INSTAGRAM_URL` | No | Your full HTTPS Instagram profile URL, once available. |
| `NEXT_PUBLIC_GITHUB_URL` | No | The repository or profile HTTPS URL, once available. |
| `NEXT_PUBLIC_OG_IMAGE_URL` | No | An absolute HTTPS social image URL or root-relative image path. |

These `NEXT_PUBLIC_*` values are public and embedded into the application at build time; never store credentials in them. `.env*` files are ignored by Git except for the empty-key `.env.example` template. No Instagram URL or production domain is invented in the site configuration.

## Docker

The multi-stage image uses Node 26 Alpine, `npm ci`, Next.js standalone output, BuildKit's npm cache, and a non-root runtime user. The image health check calls `/api/health`. PDF documents are rendered only when their download routes are requested.

```bash
docker build -t react-interview-hub .
docker run -d -p 3000:3000 --name react-interview-hub react-interview-hub
curl --fail http://localhost:3000/
curl --fail http://localhost:3000/react
curl --fail http://localhost:3000/questions/what-is-react
curl --fail http://localhost:3000/api/downloads/react-question-what-is-react.pdf -o question.pdf
curl --fail http://localhost:3000/api/health
docker inspect --format='{{.State.Health.Status}}' react-interview-hub
docker stop react-interview-hub
docker rm react-interview-hub
```

The container is for local and CI validation. Vercel remains the production host.

## GitHub Actions and branch protection

`.github/workflows/ci.yml` runs on pull requests targeting `main`, pushes to `main`, and manual dispatch. It installs with `npm ci`, validates content and PDFs, runs lint, typecheck, tests, Chrome/axe browser checks, builds Next.js, and builds a Docker image. The workflow has read-only repository permissions, does not receive deployment credentials, cancels superseded runs, and does not deploy to Vercel. It generates PDFs once, then skips npm's PDF pre-hooks for the unit test and Next build commands because those PDFs were already generated and validated in earlier CI steps.

After pushing the repository to GitHub, protect `main` in **Settings → Branches** (or Rulesets):

- Require pull requests before merging.
- Require the **Validate and build** CI status check.
- Prevent force pushes and branch deletion.

These repository settings must be enabled by a repository administrator; they are not changed by this code configuration.

## Vercel production setup

**Production URL:** pending Vercel project creation. Vercel will provide `https://<project-name>.vercel.app`; replace this placeholder in release notes after a deployment is verified. Docker remains a CI/local validation tool, not the Vercel runtime. No Vercel deployment action or token is used in GitHub Actions.

1. Push this repository to GitHub, then import the repository in Vercel. Select the repository root as the Root Directory and Next.js as the framework.
2. In Project Settings â†’ Git, set the Production Branch to `main`. Enable Preview deployments for pull requests/branches and Production deployment for `main`. Connect the GitHub integration and allow its repository access.
3. Keep the standard Next.js settings: Node.js 26.x (matching local development, CI, Docker, and the `26.x` project engine), Install Command `npm ci`, Build Command `npm run build`, and the default Next.js Output Directory. Do not set `output: "export"` or override the output directory. PDF downloads render at request time through the Node.js API route.
4. In Settings â†’ Environment Variables, set `NEXT_PUBLIC_SITE_URL=https://<project-name>.vercel.app` for Production. Alternatively, enable automatic system environment variables and let `VERCEL_PROJECT_PRODUCTION_URL` supply the production hostname. Do not set the per-deployment `VERCEL_URL` as the canonical origin. Set the optional social URL/image variables only when their real values are known.
5. Create a pull request targeting `main`. Wait for the independent GitHub **Validate and build** check and Vercel Preview deployment; inspect the Preview URL, then merge only after approval and passing checks. Vercel deploys `main` to Production automatically. GitHub Actions validates and builds but does not deploy.
6. After the first production deployment completes, record the actual `.vercel.app` URL in this README. Validate it using the steps below before calling the site launched.

### Production smoke checklist

Run the production validation against the actual Vercel URL from a machine with Node/npm and Chrome installed. In PowerShell:

```powershell
$env:PRODUCTION_URL = "https://<project-name>.vercel.app"
$env:NEXT_PUBLIC_SITE_URL = $env:PRODUCTION_URL
$env:BROWSER_BASE_URL = $env:PRODUCTION_URL
$env:SEO_AUDIT_URL = $env:PRODUCTION_URL
npm ci
npm run validate:content
npm run generate:pdfs
npm run validate:pdfs
npm run lint
npm run typecheck
npm test
npm run build
npm run validate:production
npm run validate:seo
npm run validate:browser
```

The production script checks all 40 question routes, four category routes, search/category filtering, all 45 PDFs (HTTP status, content type, and PDF signature), canonical origins, sitemap entries, `robots.txt`, and `/api/health`. The SEO audit checks page metadata and structured data. The browser audit checks navigation/theme keyboard behavior, WCAG A/AA, and overflow at 375, 768, 1024, and 1440 pixels. Also manually confirm the homepage technology cards, code highlighting/copy controls, follow-up disclosures, and related-question links in the deployment.

Record the results and timestamp in the release notes. A local or Preview result does not verify the production deployment. Check the Vercel deployment's build and runtime logs for errors; verify every smoke-check endpoint returns successfully before declaring launch.

### Optional custom domain

The free `.vercel.app` domain is sufficient initially. If you later choose a custom domain, add it in Vercel Project Settings â†’ Domains, follow the exact DNS records Vercel displays at your DNS provider, complete ownership verification, and wait for HTTPS provisioning. Choose the primary domain in Vercel, update Production `NEXT_PUBLIC_SITE_URL` to its HTTPS origin, redeploy, and rerun the production smoke, SEO, and browser checks. Do not change DNS until a domain is selected and you explicitly authorize the change.

### Google Search Console

After the production domain is live:

1. For the initial Vercel-hosted domain, add a **URL-prefix property** such as `https://<project-name>.vercel.app/` in [Google Search Console](https://search.google.com/search-console/). Choose HTML tag verification, copy the exact `content` token into Vercel Production's `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, redeploy, and click Verify. This project adds Google's meta tag to the homepage when configured. If you later own a custom apex domain, you can instead add a **Domain property** and place the DNS TXT verification record at your DNS provider; DNS changes require your explicit approval.
2. Open the Sitemaps report and submit `https://<production-domain>/sitemap.xml`. Confirm the report can fetch and parse it.
3. Use URL Inspection on the homepage, `/react`, a representative category, and important question URLs. Test the live URL, check canonical selection and rendered resources, and request indexing for a small number of important pages when appropriate.
4. Review Page indexing, sitemap processing, crawl, and Core Web Vitals reports periodically. Fix reported issues and validate again.

Submitting a sitemap or requesting indexing is a discovery signal, not a guarantee that Google will crawl, index, or show the pages. Monitor Search Console for actual status.

### Production troubleshooting

- **Build fails:** confirm Node.js 26.x, `npm ci`, and `npm run build`; inspect Vercel's build logs.
- **Vercel reports an oversized `social-image` Edge Function:** the social preview now uses a static PNG from `public/`, so a new commit should no longer create that Edge Function. Confirm the deployment commit includes `public/social-image.png` and the `social-image` route was removed.
- **Canonical URLs or sitemap are missing/wrong:** set Production `NEXT_PUBLIC_SITE_URL` to the exact HTTPS primary origin, or enable Vercel system variables so `VERCEL_PROJECT_PRODUCTION_URL` is available; trigger a new deployment because public environment values are build-time values.
- **PDF route is missing:** inspect the build log for PDF generation/validation, then check the requested filename against `createPdfManifest()` and `/react`'s download library.
- **Preview uses production canonical URLs:** this is intentional to avoid indexing deployment-specific hosts. Do not configure `NEXT_PUBLIC_SITE_URL` to a Preview URL.
- **Local SEO/production smoke check fails:** ensure a production server is running (`npm run start`) and set `PRODUCTION_URL`, `SEO_AUDIT_URL`, or the expected canonical environment as documented.
- **Deployment failed:** use Vercel's deployment details and runtime logs; push a fix through a pull request and allow CI plus the Preview deployment to pass before merging.
