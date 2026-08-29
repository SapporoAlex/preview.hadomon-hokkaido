# Dojo Site Audit — hado.dpcnp.info

**Date:** 2026-08-28
**Type:** Hokkaido martial-arts & self-defense club, static HTML site
**Scope:** Security · Content · SEO · Loading speed · UX
**Checked:** Homepage + 4 subpages (`newkai.html`, `hadotoha.html`, `shihan.html`, `link.html`), HTTP response headers, DNS/mail records

**Scorecard:** 1 Critical · 2 High · 5 Moderate · 78→1 images with alt text · 0 `<h1>` tags found

---

## 1. Security & malware

No active malware payload was found, but the page is unencrypted and carries an undisclosed third-party tracker.

| Severity | Finding |
|---|---|
| **Critical** | **No HTTPS anywhere on the domain.** `https://hado.dpcnp.info` doesn't respond at all — there is no TLS certificate. Every request, including phone numbers, addresses, and any future contact form, travels in plaintext, and modern browsers mark the site "Not secure." |
| **High** | **Undisclosed tracking tag loaded on every page.** A `<script src="//kitchen.juicer.cc/...">` tag in the `<head>` pulls a Japanese ad-tech tracker (internally named "Juicertag"). Its code fingerprints visitors by hashing IP + user-agent, sets several year-long cookies, infers age/sex/area, and reports into a Treasure Data pipeline built for pop-up ads and A/B tests. It is not a keylogger or credential-stealer, but it has nothing to do with the dojo's content and there's no privacy notice disclosing it — a sign the hosting or template has been touched by an ad-injection party without the owner's knowledge. Confirmed present on every subpage checked, not just the homepage. |
| **Moderate** | **jQuery 1.7.2 in production.** Released in 2012. Over a decade of security and bug fixes in later 1.x/3.x releases are missing, and the library is 94 KB unminified for what's used to run one image carousel. |
| **Moderate** | **No security response headers, sitewide.** None of the pages checked send `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`, or `Referrer-Policy`. On this stack they're free to add (server config only, no rebuild) and would have made the injected tracker script easier to notice or block in the first place. |
| **Low** | **Stale code left commented in the HTML.** An old xrea.com visitor-counter and ~45 unused photo references sit inside HTML comments. Harmless on its own, but it shows the codebase hasn't had a real review in years — exactly the kind of neglect that let the tracking tag above go unnoticed. |
| **Info** | **Hosting fingerprint & likely update path.** Plain Apache, version not disclosed, resolving to an IP block registered to GMO DIGIROCK in Osaka — a Japanese shared-hosting provider. The domain's SPF record (`v=spf1 ip4:202.172.28.12`) points at that same IP, so email is self-hosted there too. The site is 100% static HTML/CSS/JS with no server-side code, which — combined with the hosting tier — means it's almost certainly maintained today by uploading files directly over FTP, not through any admin panel or deploy pipeline. Any hosting migration needs to carry the mail setup along with it, or deliverability breaks. (Note: a live port scan to confirm FTP is open wasn't possible from the working environment used for this audit — this is inference from the server/site fingerprint, not a confirmed scan.) |

---

## 2. Content review

The schedule and news content are actively maintained; the surrounding scaffolding is not.

| Severity | Finding |
|---|---|
| Moderate | **Copyright year frozen at 2014.** The footer still reads "Copyright© 2014," even though the news list has entries dated into 2026 — a small but visible signal the template hasn't been touched in over a decade. |
| Low | **Live and dead news entries mixed together.** Several past class announcements are kept as commented-out HTML instead of being removed, making the update list harder to edit safely over time. |
| Low | **Legacy Shift_JIS encoding.** Still functional, but obsolete — it complicates copy-paste, breaks if any modern character (emoji, certain punctuation) is ever pasted in, and search engines generally prefer UTF-8. |
| Info | **Thin contact options.** Contact is a phone/fax number as plain text plus one `tel:` link — no map embed, no email link, no contact form. |

---

## 3. SEO

The page gives search engines almost nothing to work with beyond raw text.

| Severity | Finding |
|---|---|
| High | **Zero `<h1>` tags on the page.** The "headline" is a logo image with no text alternative. Search engines have no single authoritative signal for what the page is about. |
| High | **78 images, 1 with alt text.** Nearly every image — including class photos that could rank in image search — is invisible to screen readers and to Google Images. |
| Moderate | **No viewport meta tag.** Without it, mobile browsers render the desktop layout and zoom out. This also fails Google's mobile-first indexing, which now decides most rankings. |
| Moderate | **No robots.txt, sitemap, or structured data.** Both `/robots.txt` and `/sitemap.xml` return 404. There's no `LocalBusiness` schema either, despite the page already listing an address, phone number, and class times in plain text — exactly what that schema is for. |
| Low | **Title and meta description are keyword fragments.** Both read as comma-separated keyword lists rather than natural phrases a person would click on in a search result. |

---

## 4. Loading speed

Nothing is catastrophic, but a stack of small waste adds up on a slow connection.

| Severity | Finding |
|---|---|
| Moderate | **Unoptimized JPEGs.** The logo alone is 165 KB for a header graphic; the five homepage slider images add another ~275 KB. Nothing is served as WebP/AVIF or with responsive `srcset` sizes. |
| Moderate | **Two YouTube embeds load eagerly.** Both `<iframe>` embeds fetch player assets on page load rather than showing a lightweight thumbnail that loads the real player on click — each can pull over 1 MB before a visitor ever presses play. |
| Low | **No cache headers on static assets.** Images and CSS have no `Cache-Control`/`Expires` header, so repeat visits re-validate every file with the server instead of reading straight from the browser cache. |
| Low | **No lazy loading, missing favicon.** Images lack `loading="lazy"` and dimension attributes (contributing to layout shift), and `/favicon.ico` 404s on every single page load. |

---

## 5. User experience

The information is there; finding it is the hard part.

| Severity | Finding |
|---|---|
| High | **No responsive layout.** Paired with the missing viewport tag, the site is desktop-only — a real problem for people checking class times from a phone. |
| Moderate | **Layout built from `<br>` tags and inline styles.** Class schedules and announcements are line breaks inside a wall of text rather than real lists or headings — hard to scan and easy to break when editing. |
| Low | **No clear call to action.** The phone number is present but buried mid-page; there's no "book a trial class" or equivalent prompt near the top. |
| Low | **Old carousel plugin, no touch support.** `s3Slider` predates touch-first design — no swipe gestures on the homepage image slider. |

---

## 6. Current vs. after fix

| Category | Issue | Current | After fix |
|---|---|---|---|
| Security | Transport encryption | HTTP only, no TLS cert | Free TLS cert (Let's Encrypt) + forced HTTPS redirect |
| Security | Third-party tracker | Undisclosed juicer.cc fingerprinting script sitewide | Script removed, or kept only with owner's consent and a privacy notice |
| Security | JS dependencies | jQuery 1.7.2 (2012) | Current jQuery or a native-JS carousel, no legacy CVEs |
| Security | Response headers | No HSTS, CSP, X-Frame-Options, or Referrer-Policy on any page | Standard header set added at the server/CDN level |
| Content | Footer date | "Copyright© 2014" beside 2026 news entries | Dynamic or manually updated current year |
| Content | Encoding | Shift_JIS | UTF-8 site-wide |
| Content | Dead entries | Old announcements kept as HTML comments | Removed from source, archived in a simple changelog if needed |
| SEO | Heading structure | 0 `<h1>` tags, logo image stands in for the headline | One clear `<h1>` naming the dojo and its discipline |
| SEO | Image alt text | 1 of 78 images described | Descriptive alt text on every meaningful image |
| SEO | Mobile indexing | No viewport meta tag | Responsive layout, passes Google's mobile-friendly test |
| SEO | Crawl guidance | robots.txt and sitemap.xml both 404 | Both present, plus `LocalBusiness` structured data |
| Speed | Image weight | Logo 165 KB, slider ~275 KB, all raw JPEG | Compressed WebP with responsive sizes, <100 KB combined |
| Speed | Video embeds | 2 YouTube iframes load eagerly | Click-to-load thumbnail facade, player loads on demand |
| Speed | Caching | No Cache-Control/Expires headers | Long-lived cache headers on static assets |
| UX | Responsiveness | Fixed desktop layout only | Fluid layout that reflows for phones and tablets |
| UX | Content structure | Manual `<br>` line breaks and inline styles | Semantic lists and headings for schedules and news |
| UX | Call to action | Phone number buried mid-page | Visible "Book a trial class" prompt near the top |

---

## 7. Renewal strategy

Ordered by dependency, not just severity — each phase either has to finish before the next can start, or deliberately ships first because it's cheap and high-impact.

### Phase 0 — Stabilize
*Week 1 · config only, no rebuild*

Stop active harm before touching anything structural.

- Issue a TLS certificate and force HTTPS on every URL
- Confirm with the site owner whether the juicer.cc tracker was ever authorized; if not, remove it immediately and check for any other unexplained injected code
- Add HSTS, CSP, X-Frame-Options, and Referrer-Policy headers at the server level

> **Why first:** these are server-configuration changes on the existing host — no redesign required, and they close the two highest-severity findings in a day, not a redesign cycle.

### Phase 1 — Clean up content & markup
*Weeks 2–3*

Make the existing pages honest and machine-readable before rebuilding their skin.

- Convert Shift_JIS → UTF-8 across all pages
- Delete dead/commented-out code (old counter, unused photo blocks, retired news entries)
- Add one real `<h1>` per page and alt text on every meaningful image
- Fix the footer year and reconcile it with the live news list

> **Why now:** doing this before the visual rebuild means the new templates start from clean, correctly-encoded content instead of inheriting fourteen years of patched-over markup.

### Phase 2 — Rebuild as a responsive static site
*Weeks 3–5*

Replace the desktop-only, jQuery-1.7.2 front end — without adding a database or admin panel this site doesn't need.

- Mobile-first responsive layout with a real viewport meta tag
- Plain HTML/CSS with minimal vanilla JS (or a static-site generator like Eleventy/Astro) — no framework, no server-side runtime to patch later
- Compressed WebP images with lazy loading; click-to-load facades for the two YouTube embeds
- Semantic lists/headings for the class schedule and news feed, plus a visible "book a trial class" call to action

> **Why static, not a CMS:** this is a low-traffic informational site updated a few times a month by a non-technical owner. A static site removes the entire class of server-side vulnerability that let jQuery 1.7.2 and the injected tracker linger unnoticed for years, while a small Markdown/JSON content file still lets the owner add a news item without editing raw HTML.

### Phase 3 — Migrate hosting & domain plumbing
*Weeks 4–6, timed with launch*

Land on a host that gives TLS, caching, and security headers by default instead of requiring manual upkeep.

- Move to a platform with automatic HTTPS and CDN caching (e.g. Cloudflare Pages, Netlify, or a modern Japanese host with SSL included)
- Migrate or repoint mail separately — the current SPF record ties email delivery to the same shared IP as the website, so cutting over the site without a mail plan will break deliverability
- Publish `robots.txt`, a real `sitemap.xml`, and `LocalBusiness` structured data at cutover

> **Why last:** DNS and mail changes are the riskiest, hardest-to-reverse step — sequencing it after the new site is built and tested keeps the cutover window short.

### Phase 4 — SEO & measurement
*Ongoing, post-launch*

Turn the fixed foundation into actual search visibility.

- Submit the sitemap to Google Search Console; watch mobile-usability and Core Web Vitals reports for regressions
- Add a simple contact form (a hosted form endpoint is enough) alongside the phone number
- Rewrite the title and meta description as natural sentences instead of comma-separated keywords

> **Why it's ongoing:** everything before this is a one-time fix; search performance compounds only if someone keeps an eye on it after launch.

---

**Scope note:** this is a passive diagnostic — response headers, page source across five pages, DNS/mail records, and the third-party script payload were inspected from the outside. No login attempts, file uploads, or intrusive testing were performed, and no port scan of the live host was possible from the working environment used (only proxied HTTP requests were reachable, not raw sockets), so hosting/FTP conclusions above are inference from the server fingerprint and site architecture, not a confirmed scan. Treat the "high" severity tracker finding as something to verify with the actual site owner before removal, since it's presented here as a fixed-site practice exercise rather than a live client engagement.
