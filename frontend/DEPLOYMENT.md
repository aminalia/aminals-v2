# Deployment Guide

## Development vs Production

This Next.js app is configured to work differently in development and production:

### Development
- Uses Next.js server-side rendering with `fallback: 'blocking'`
- Dynamic routes work with hot reload
- Run with: `npm run dev`

### Production (Cloudflare Pages)
- Uses static export with `fallback: false`
- Pre-generates static pages
- Build with: `npm run build:static`

## Cloudflare Pages Deployment

### Build Configuration
In your Cloudflare Pages project settings:

- **Build command**: `npm run build:static`
- **Build output directory**: `out`
- **Node.js version**: `18.x` or higher

### Environment Variables
Make sure to set:
- `NODE_ENV=production` (automatically set by build:static command)

### Redirects
The `public/_redirects` file handles dynamic route redirects:
```
/breeding/:auctionId /breeding/[auctionId].html 200
/aminals/:id /aminals/[id].html 200
/genes/:id /genes/[id].html 200
/profile/:address /profile/[address].html 200
/* /index.html 200
```

## Testing Static Export Locally

1. Build the static export:
   ```bash
   npm run build:static
   ```

2. Serve the static files:
   ```bash
   npm run start:static
   ```

3. Test dynamic routes by visiting:
   - `http://localhost:3000/aminals/some-contract-address`
   - `http://localhost:3000/breeding/some-auction-id`
   - etc.

## Troubleshooting

### 404 Errors on Refresh
- Make sure `_redirects` file is in the build output
- Check that Cloudflare Pages is properly configured
- Verify build output directory is set to `out`

### Development Server Issues
- Use `npm run dev` for development (not `npm run build:static`)
- Development server uses different routing configuration

### Build Issues
- Run `npm run build:static` to test production build locally
- Check that all environment variables are set correctly