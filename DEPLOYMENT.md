
# Deployment Guide - Fixing 404 on Refresh

This guide explains how to fix the 404 error that occurs when refreshing URLs in your deployed React SPA.

## Problem
When you refresh a URL like `https://yoursite.com/dashboard` in your deployed React app, you get a 404 error. This happens because the server tries to find a file at `/dashboard` but in a Single Page Application (SPA), all routes should serve the same `index.html` file.

## Solution
The solution is to configure your server to redirect all requests to `index.html` so React Router can handle the routing client-side.

## Platform-Specific Solutions

### 1. Apache Server (Most Shared Hosting)
If you're using Apache hosting (like cPanel, GoDaddy, etc.), the `.htaccess` file in the `public` directory will handle this automatically.

### 2. Netlify
The `_redirects` file in the `public` directory will handle this automatically.

### 3. Vercel
The `vercel.json` file in the root directory will handle this automatically.

### 4. Netlify (Alternative)
The `netlify.toml` file in the root directory provides an alternative configuration.

### 5. Nginx
If you're using Nginx, add this to your server configuration:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### 6. Express.js Server
If you're using Express.js, add this middleware:

```javascript
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

## Build and Deploy

1. Build your project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider.

3. Make sure the appropriate configuration file is included in your deployment.

## Testing

After deployment:
1. Navigate to any route in your app (e.g., `/dashboard`)
2. Refresh the page
3. The page should load correctly without a 404 error

## Files Created

- `public/.htaccess` - For Apache servers
- `public/_redirects` - For Netlify
- `vercel.json` - For Vercel
- `netlify.toml` - Alternative Netlify configuration

These files ensure that all routes are properly handled by your React Router.
