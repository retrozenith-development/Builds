# RetroZenith Builds

A static website for displaying Android ROM downloads, built with Next.js.

## Features

- Display ROM information in a clean, modern interface
- Show download buttons for ROM, GApps, and Recovery files
- Include links to forums, repositories, and donation options
- Responsive design for all device sizes

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Production Build

To build the site for production:

```bash
pnpm build
```

This will generate a static export in the `out` directory.

## Deployment to GitHub Pages

This repository is configured to automatically deploy to GitHub Pages when changes are pushed to the main branch. The site will be available at [https://cdn.zenyhosting.cloud](https://cdn.zenyhosting.cloud).

### Deployment Process

1. The GitHub Actions workflow in `/.github/workflows/deploy.yml` (located at the repository root) handles the deployment process
2. It builds the site using Next.js static export
3. The `public/CNAME` file ensures the custom domain is preserved

### Custom Domain Setup

To use the custom domain with GitHub Pages and Cloudflare:

1. **GitHub Pages Configuration:**
   - In your GitHub repository settings, under "Pages", ensure the custom domain is set to `cdn.zenyhosting.cloud`
   - Enable "Enforce HTTPS"

2. **Cloudflare DNS Configuration:**
   - Add an `A` record pointing `cdn.zenyhosting.cloud` to GitHub Pages IP addresses:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Set the proxy status to "Proxied" (orange cloud)
   - Enable the "Always Use HTTPS" option in Cloudflare SSL/TLS settings

3. **Cloudflare Page Rules (Optional):**
   - Create a page rule for `cdn.zenyhosting.cloud/*` with the following settings:
     - Cache Level: Cache Everything
     - Edge Cache TTL: 1 month

## License

MIT

