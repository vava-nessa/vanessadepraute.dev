# PageSpeed Optimization Report - vanessadepraute.dev

## Performance & SEO Metrics Summary

| Category | Metric | Value | Score | Status |
|----------|--------|-------|-------|--------|
| **Performance** | LCP (Largest Contentful Paint) | 4,433 ms | ❌ Poor | Needs improvement (target: <2,500 ms) |
| | CLS (Cumulative Layout Shift) | 0.00 | ✅ Excellent | Meets target (<0.1) |
| | TTFB (Time to First Byte) | 11 ms | ✅ Excellent | Meets target (<800 ms) |
| | FCP (First Contentful Paint) | 248 ms | ✅ Excellent | Meets target (<1,800 ms) |
| | First Paint | 248 ms | ✅ Excellent | Meets target (<1,800 ms) |
| | DOM Interactive | 28 ms | ✅ Excellent | Meets target (<3,800 ms) |
| | DOM Content Loaded | 183 ms | ✅ Excellent | Meets target (<3,800 ms) |
| | Load Complete | 184 ms | ✅ Excellent | Meets target (<3,800 ms) |
| **SEO** | Page Title | Present | ✅ Good | "Vanessa Depraute : Designer & Developer" |
| | Meta Description | Present | ✅ Good | 138 characters |
| | Meta Keywords | Present | ✅ Good | Set |
| | Open Graph Tags | Partial | ⚠️ Fair | Has OG title/desc, OG image path issue |
| | Twitter Card | Present | ✅ Good | summary_large_image |
| | Canonical URL | Missing | ❌ Poor | Should be set |
| | Robots Meta | noindex | ❌ Poor | Blocks search indexing |
| | H1 Tags | 11 | ❌ Poor | Should be 1 |
| | H2 Tags | 3 | ✅ Good | Acceptable |
| | H3 Tags | 29 | ⚠️ Fair | High count, but acceptable |
| | Structured Data | 1 | ✅ Good | JSON-LD present |
| | Images without Alt | 0/38 | ✅ Excellent | All images have alt text |
| **Accessibility** | Body Font Size | 16px | ✅ Good | Meets minimum |
| | Buttons without ARIA | 11/14 | ❌ Poor | 78.6% missing labels |
| | Links without Text | 0/5 | ✅ Excellent | All have text |
| | Images without Alt | 0/38 | ✅ Excellent | All images accessible |
| | Skip to Content Link | Missing | ❌ Poor | Should be present |
| | Language Attribute | en | ✅ Good | Set correctly |
| | Heading Hierarchy | Skipped | ❌ Poor | Levels not sequential |
| | Focusable Elements | 19 | ✅ Good | Keyboard navigable |
| **Best Practices** | HTTPS | ✅ Yes | ✅ Excellent | Secure connection |
| | Mixed Content | 0 | ✅ Excellent | None detected |
| | Content-Security-Policy | Missing | ❌ Poor | Not set |
| | X-Frame-Options | Missing | ❌ Poor | Not set |
| | Viewport Meta | Set | ✅ Good | Responsive |
| | Service Worker | Not registered | ⚠️ Fair | Could enable offline support |
| | Inline Styles | 219 | ❌ Poor | High number (consider CSS classes) |
| | Inline Scripts | 17 | ❌ Poor | High number (consider external files) |
| | Modern Image Formats | 15.8% | ❌ Poor | Only 6/38 images are WebP/AVIF |
| | Large Images (>1.9MB) | 1/38 | ⚠️ Fair | One large resource detected |
| **Resources** | Total Resources | 68 | - | Reasonable |
| | Total Transfer Size | ~6.7 MB | ❌ Poor | Large (target: <3 MB) |
| | Third-Party Domains | 4 | ✅ Good | Minimal |
| | Total Images | 38 | - | - |
| | CSS Files | 5 | - | - |
| | JavaScript Files | 6 | - | - |

**Overall Assessment**: Performance is hindered by large image assets (especially GIFs totaling ~7 MB) and render-blocking resources. SEO issues include multiple H1 tags, missing canonical URL, and noindex directive. Accessibility needs ARIA labels on buttons. Best practices require CSP headers and more modern image formats.

---

## Performance Analysis Summary

Based on Chrome DevTools Lighthouse performance analysis, the website has the following key metrics:

- **Largest Contentful Paint (LCP): 4,361 ms** - Significantly above the recommended 2.5 seconds
- **Cumulative Layout Shift (CLS): 0.00** - Excellent (meets target)
- **Max Critical Path Latency: 720 ms**

## Key Performance Issues

### 1. High LCP (4,361 ms)
The main issue is the **element render delay of 4,352 ms (99.8% of total LCP time)**. This indicates that while the resources load relatively quickly (TTFB: 10 ms), the browser takes a long time to render the content after resources are available.

### 2. Render Blocking Resources
Two render-blocking resources are impacting initial render:
- `https://www.vanessadepraute.dev/assets/index.vBsHeRuI.css` (43 ms)
- `https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap` (30 ms)

### 3. Critical Resource Chain
The longest network dependency chain is:
```
HTML → Google Fonts CSS → JetBrains Mono Font (720 ms)
```
This font download is the critical bottleneck.

## Optimization Recommendations

### High Priority Optimizations

#### 1. Optimize Font Loading
- **Issue**: The JetBrains Mono font takes 720 ms to load, creating the longest critical path
- **Solution**: 
  - Preload the font file directly instead of loading through CSS
  - Consider using system fonts or web-safe alternatives for faster rendering
  - Implement font-display: swap to prevent invisible text during loading

#### 2. Reduce Render Blocking CSS
- **Issue**: Main CSS file is render-blocking
- **Solution**:
  - Split CSS into critical (above-the-fold) and non-critical parts
  - Inline critical CSS directly in HTML
  - Defer non-critical CSS loading

#### 3. Improve Resource Prioritization
- **Issue**: Font resources have high priority but block rendering
- **Solution**:
  - Adjust resource hints to prioritize core content over fonts
  - Consider using `preload` for critical resources and `prefetch` for others

### Medium Priority Optimizations

#### 4. Optimize JavaScript Loading
- Analyze and optimize the main JavaScript bundle (78 ms load time)
- Consider code splitting and lazy loading for non-critical scripts

#### 5. Implement Image Optimization
- Ensure images are properly optimized and use modern formats (WebP, AVIF)
- Implement lazy loading for below-the-fold images

### Low Priority Optimizations

#### 6. Caching Improvements
- Extend cache headers for static assets
- Implement service workers for offline caching

#### 7. Minification and Compression
- Ensure all assets are minified and compressed
- Verify Gzip/Brotli compression is enabled

## Expected Improvements

Implementing these optimizations could reduce:
- LCP from 4,361 ms to under 2,500 ms (target)
- Critical path latency from 720 ms to under 500 ms
- Initial page load time by 30-50%

## Next Steps

1. Implement font optimization (highest impact)
2. Split and optimize CSS loading
3. Review and optimize JavaScript bundle
4. Test improvements with real user monitoring

## Tools Used
- Chrome DevTools Performance Trace
- Lighthouse Performance Insights
- Network Dependency Analysis

*Analysis conducted on January 20, 2026*