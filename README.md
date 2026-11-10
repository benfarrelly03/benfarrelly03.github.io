# Benjamin Farrelly · portfolio site

Knitwear and textile portfolio: Home, Twinship, Knit samples, Portfolio and CV.

Plain HTML, CSS and JavaScript, no build step, hosted free on GitHub Pages.

## Pages

| File | Page |
|---|---|
| `index.html` | Home: montage, About, contact drawer |
| `twinship.html` | Twinship graduate collection |
| `samples.html` | Knit samples board (Stripes, Ribbing, Experiments, Working samples) |
| `portfolio.html` | Portfolio page viewer and PDF downloads |
| `cv.html` | CV with PDF download |

## Common edits

- **Home montage images and captions:** `js/montage-data.js` (each entry has `src`, `label`, `alt`). Change `MONTAGE_INTERVAL` to change the seconds between images.
- **Knit samples layout:** `js/samples-data.js`. It holds the layout saved on 10 Nov 2026 from the Arrange tool. To publish a newer layout, paste a new "Keep this layout" code into Claude and ask for this file to be regenerated.
- **CV:** edit `cv.html`, and replace `files/Benjamin-Farrelly-CV-2026.pdf` with the new PDF (same file name).
- **PDFs:** `files/`.
- **Images:** `images/`. Photos are resized to at most 2000 px for fast loading.

## Publishing

On GitHub: Settings → Pages → Build and deployment → Deploy from a branch → `main`, folder `/ (root)`. Changes go live a minute or two after each commit.
