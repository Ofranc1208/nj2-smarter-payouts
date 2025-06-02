// next.config.js
// Add a Content Security Policy (CSP) header in report-only mode for security monitoring.
// This will NOT block any resources, only report violations to the browser console.
// Adjust the policy as needed for your external resources.

const ContentSecurityPolicy = [
  "default-src 'self';",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
  "img-src 'self' data: blob: https://*.googleusercontent.com https://*.google-analytics.com https://*.googletagmanager.com https://images.unsplash.com https://picsum.photos;",
  "font-src 'self' https://fonts.gstatic.com data:;",
  "connect-src 'self' https://*.googleapis.com https://*.google-analytics.com https://*.googletagmanager.com;",
  "frame-src 'self' https://www.youtube.com https://player.vimeo.com;",
  "object-src 'none';",
  "base-uri 'self';",
  "form-action 'self';"
].join(' ');

module.exports = {
  productionBrowserSourceMaps: true, // Enable source maps for production debugging
  images: {
    domains: ['randomuser.me'],
  },
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy-Report-Only',
            value: ContentSecurityPolicy,
          },
        ],
      },
    ];
  },
}; 