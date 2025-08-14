# El Mail de JRG

> [!WARNING]
> Set up the repository with the proper hooks. Run `pre-commit install` in the root directory of the repository.

Personal newsletter for JRG. No spam, no ads, no tracking just personal updates and thoughts.

**Stack:**

- **Authentication:** Clerk
- **Frontend:** Astro + React islands
- **Admin UI:** EditorJS
- **Backend:** Hono
- **Database:** Turso
- **Deployment:** Vercel (frontend) + Cloudflare Workers (backend)

## Local development

```sh
$ pnpm i
$ pnpm dev
```

### Environment variables

Copy the `.env.sample` file to `.env` and fill in the required environment variables.

Keep in mind all environment variables with a prefix of `PUBLIC_` will be exposed to the client-side code.

There is a component in `src/components/core/Posthog.astro` that initializes PostHog for analytics. If you want to disable it, set the `PUBLIC_POSTHOG_KEY` environment variable to an empty string.

## 🚀 Deployment

Automatic deployments on dokploy.

```yaml
# docker-compose.yml
services:
  elmaildejrg-page:
    image: ghcr.io/jrg-tools/elmaildejrg-page:latest
    ports:
      - "80:80"
    environment:
      - API_URL=${API_URL}
      - PUBLIC_CLERK_PUBLISHABLE_KEY=${PUBLIC_CLERK_PUBLISHABLE_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
    restart: unless-stopped
```
