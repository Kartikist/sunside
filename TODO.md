# SunSide delivery checklist

## Trip planning inputs and initial guidance
- [ ] Provide a polished responsive consumer utility where a rider can enter an origin and destination.
- [ ] Let the rider choose a departure date and time used to model the sun’s position during the journey.
- [ ] Let the rider choose car or bus as the travel mode.
- [ ] Show clear initial guidance before a trip is calculated, plus invalid-input and in-progress states.

## Free route and place data
- [ ] Look up origin and destination through a free geocoding provider without requiring a paid Google Maps API key.
- [ ] Calculate route geometry and travel-time estimation using an open-source map stack and a free routing service such as OpenStreetMap with OSRM.
- [ ] Show an interactive route map with trip path, endpoints, and directional context.
- [ ] Keep routing/geocoding failures understandable and actionable.

## Sun-exposure recommendation
- [ ] Analyze sun exposure along route segments from route bearing, timestamp, location, and solar position.
- [ ] Give a prominent left-side, right-side, or no-clear-winner recommendation.
- [ ] Explain in plain language how route direction and sun position produced the recommendation.
- [ ] Show confidence and coverage, including estimated shaded-side advantage and analyzed route share.

## Project delivery
- [ ] Keep the interface responsive across desktop and mobile.
- [ ] Serve the complete page through the project preview and production build.
