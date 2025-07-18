# Deployment Guide

This document explains how to deploy the Aminals frontend to Cloudflare Pages using @cloudflare/next-on-pages.

## Overview

The frontend is configured to work with Cloudflare Pages using the `@cloudflare/next-on-pages` adapter. This approach provides:
- Full Next.js compatibility including SSR and dynamic routes
- Better performance through Cloudflare's edge network
- Automatic handling of dynamic routes without fallback configuration
- Native support for Next.js features like API routes and middleware

## Cloudflare Pages Setup

### 1. Build Configuration

The project uses `@cloudflare/next-on-pages` to convert Next.js output for Cloudflare Pages:

```bash
# Build for Cloudflare Pages
npm run build:cf

# Test locally with Wrangler
npm run start:cf
```

### 2. Environment Variables

Set these environment variables in your Cloudflare Pages project:

```bash
NODE_ENV=production
```

### 3. Build Settings

In your Cloudflare Pages dashboard:

- **Framework preset**: Next.js
- **Build command**: `npm run build:all && npm run build:cf`
- **Build output directory**: `.vercel/output/static`
- **Node.js version**: `18.x` or higher

### 4. Custom Domain (Optional)

If you want to use a custom domain:

1. Go to your Cloudflare Pages dashboard
2. Navigate to "Custom domains"
3. Add your domain and configure DNS settings

## Technical Details

### Next.js Configuration

The `next.config.js` file is configured to:
- Work with standard Next.js features
- Support dynamic routes natively
- Optimize images for edge deployment
- Handle client-side routing properly

### Dynamic Routes

Dynamic routes like `/aminals/[id]` are handled through:
- Server-side rendering on Cloudflare's edge
- Automatic route resolution
- No need for static path generation
- Real-time data fetching

### Cloudflare Adapter

The `@cloudflare/next-on-pages` adapter:
- Converts Next.js build output to Cloudflare Pages format
- Handles SSR and dynamic routes
- Provides better performance than static export
- Maintains Next.js feature compatibility

## Deployment Process

1. **Connect Repository**: Link your GitHub repository to Cloudflare Pages

2. **Configure Build Settings**: Set the build command and output directory

3. **Deploy**: Cloudflare Pages will automatically build and deploy your app

4. **Custom Domain** (optional): Configure your custom domain in the dashboard

## Troubleshooting

### Build Failures

- Check that all dependencies are listed in `package.json`
- Verify Node.js version compatibility (18.x+)
- Review build logs for specific error messages
- Ensure `@cloudflare/next-on-pages` is properly installed

### 404 Errors

- Dynamic routes should work automatically with the adapter
- Check that the build output directory is correct
- Verify the wrangler.toml configuration

### Performance Issues

- Use Next.js Image component for optimized images
- Enable caching headers through Cloudflare settings
- Consider using a CDN for static assets

## Local Development

To test the production build locally:

```bash
# Build for Cloudflare Pages
npm run build:all && npm run build:cf

# Serve with Wrangler
npm run start:cf
```

This will serve the app using Cloudflare's local development environment.

## Monitoring

Monitor your deployment through:
- Cloudflare Pages dashboard
- Build logs
- Analytics (if enabled)
- Performance metrics
- Real-time function logs

## Security

The `@cloudflare/next-on-pages` approach provides:
- Server-side rendering security
- Automatic HTTPS through Cloudflare
- DDoS protection through Cloudflare's CDN
- Edge computing benefits
- Reduced latency through global distribution

## Migration from Static Export

If you're migrating from a static export setup:

1. Remove static export configuration from `next.config.js`
2. Remove `getStaticPaths` and `getStaticProps` from dynamic routes
3. Update build commands to use `@cloudflare/next-on-pages`
4. Update `wrangler.toml` configuration
5. Test locally before deploying

## Benefits of This Approach

- **Better SEO**: Server-side rendering improves search engine optimization
- **Faster Loading**: Dynamic routes load faster without client-side data fetching
- **Better UX**: No blank pages during route transitions
- **Full Next.js Support**: All Next.js features work as expected
- **Edge Performance**: Cloudflare's global edge network provides fast response times