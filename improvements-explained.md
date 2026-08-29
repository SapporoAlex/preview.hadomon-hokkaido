# What Was Improved — Hadomon Hokkaido

A plain-language explanation of what changed between the original site and this rebuild. No jargon — written for the site owner, not a developer.

**What it was:** A judo/self-defense school's website that hadn't been touched in over a decade. Looked and worked like it was frozen in 2012.

## What changed, and why it matters

**Removed a hidden tracker that shouldn't have been there.**
The old site had an invisible bit of code quietly recording things like visitors' locations and device info, and probably serving pop-up ads — without telling anyone. That's like a store having a hidden camera nobody consented to. Gone now.

**Added a lock (HTTPS).**
The old site had no security certificate at all, meaning anything typed into it — even just browsing — traveled in the open, readable by anyone snooping on the same network (public wifi, etc.). Every browser now flags sites like that as "Not Secure." The rebuild fixes this by design.

**Made it actually work on a phone.**
The old site was built for a computer screen and never resized for phones — visitors had to pinch-zoom and scroll sideways just to read it. Most people now find local businesses on their phone first, so this alone was probably costing them visitors.

**Fixed the "invisible for blind visitors" problem.**
Almost none of the 78 photos on the old site had a text description attached. That means someone using a screen reader (software that reads a webpage aloud for visually impaired visitors) heard nothing but silence where every photo was. Every image now has a real description.

**Cleaned up the old technology.**
The site relied on a 2012-era piece of software (jQuery 1.7.2) for its photo slider — like a business still running Windows XP. Old software stops getting security patches, so it becomes a weak point over time. Replaced with modern, lighter code that does the same job.

**Sped it up.**
Images were needlessly large (a header logo alone was 165 KB — like emailing a full-size photo instead of a thumbnail). Compressed everything to a fraction of the size with no visible quality loss, so the page loads faster, especially on mobile data.

**Made the content easier to scan.**
News, class schedules, and locations used to be one giant wall of text with manual line breaks. Now they're organized into real lists and sections you can skim in seconds instead of reading paragraph by paragraph.

---

*See `site-audit.md` in this folder for the full technical findings behind these fixes.*
