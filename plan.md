# SunSide implementation plan

The approved product is a responsive single-page trip utility that accepts two places, departure date/time, and car or bus mode, then uses free geocoding and road routing to estimate which side of the vehicle gets less direct sun. The browser owns the analysis so no paid Google Maps key or backend data store is required.

## Implementation

- **Place lookup:** OpenStreetMap Nominatim with a single-result lookup for each endpoint.
- **Route:** OSRM public routing endpoint with GeoJSON geometry. The bus option uses the same road geometry and is labeled as a road-based estimate because the free routing endpoint does not provide transit schedules.
- **Solar model:** Client-side NOAA-style solar position approximation, sampled along the route and across elapsed travel time. Route bearing and the sun’s azimuth determine left/right/neutral exposure.
- **Map:** Leaflet with OpenStreetMap tiles, route line, endpoint markers, fit-to-route bounds, and attribution.
- **Serving:** Vite development server on port 3000 with static build output in `dist`.

## Project structure

- `index.html` — metadata and Vite entry.
- `src/main.js` — page structure, free API calls, solar model, route analysis, Leaflet map, and UI state transitions.
- `src/styles.css` — responsive visual system and states.
- `public/manus-routes.json` — canonical page route declaration.
- `app.config.ts` — durable platform logo metadata.
- `TODO.md` — outcome-oriented delivery checklist.

## Design direction

Three style options were considered: **sunlit editorial utility** (0.06), **quiet transit dashboard** (0.03), and **playful wayfinding poster** (0.08). The chosen direction is sunlit editorial utility.

- **Design movement:** Scandinavian editorial utility with warm field-notes energy.
- **Core principles:** Make the answer feel immediate; keep the method legible; use warmth without visual noise; let whitespace frame the route.
- **Color philosophy:** Warm paper and sun-gold signal daylight, deep blue-green provides calm contrast, and mint/rose create a simple visual language for route and exposure states.
- **Layout paradigm:** Asymmetric editorial composition: large left-aligned statement, offset planning card, then a results field with map-to-recommendation tension rather than a centered dashboard grid.
- **Signature elements:** Sun disc mark, mono eyebrow labels, and “field guide” language with small route annotations.
- **Interaction philosophy:** Every control should feel like adjusting a trip note; progress states narrate what the model is reading instead of showing a generic spinner.
- **Animation:** Restrained breathing on the empty sun, orbital progress while APIs resolve, and short lift on the primary CTA. No looping decoration after results are ready.
- **Typography system:** DM Sans for utility text, DM Mono for data labels, and Playfair Display italic for the human, memorable promise.
- **Brand essence:** The seat-side calculator for sun-sensitive riders; clear, warm, practical.
- **Brand voice:** “Your commute, without the glare.” and “Read the light, not just the map.”
- **Wordmark & logo:** A compact sun-disc mark paired with a close-set wordmark, with “Side” picked out in route mint.
- **Signature brand color:** Sun-gold `#F4B860`, used as the ownable daylight cue.
