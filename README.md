# SunSide — Find the Shady Side of Your Ride

**SunSide is a solar-aware trip planner that tells you whether to sit on the left or right side of a road journey to avoid direct sunlight.** Enter an origin, destination, and departure time. SunSide traces the route, models the sun’s position along the trip, and recommends the less sunny side of the vehicle.

Live demo: **[sunside-yfhwmgjq.manus.space](https://sunside-yfhwmgjq.manus.space)**

[![Live demo](https://img.shields.io/badge/Live%20demo-Open%20SunSide-F4B860?style=flat-square&labelColor=21383B)](https://sunside-yfhwmgjq.manus.space)
[![License](https://img.shields.io/badge/license-MIT-88C7B5?style=flat-square&labelColor=21383B)](#license)
[![Built with open map data](https://img.shields.io/badge/maps-OpenStreetMap-88C7B5?style=flat-square&labelColor=21383B)](#mapping-and-routing)

## The problem

When you travel across a city, the sunny side of the vehicle can make a noticeable difference. A rider may want to know **which side of a car or bus to sit on to avoid the sun** or **whether the left or right window will be more comfortable for a particular commute**. Typical navigation apps calculate distance and arrival time, but they do not answer this seating-side question.

SunSide is designed for short daily trips such as **home to office**, apartment to campus, hotel to airport, station to workplace, and other local car or bus journeys. It is especially useful in hot, sunny cities where a few minutes of direct window light can matter.

## What SunSide does

- Accepts origin and destination place names, addresses, buildings, apartment societies, stations, and landmarks.
- Shows ranked place suggestions with the full locality and address so users can choose the exact same-name building or hotel.
- Requires an explicit place selection before routing; SunSide never silently chooses the first ambiguous match.
- Uses the departure date and time to model the sun during the actual journey.
- Focuses on the road geometry and sunlight direction shared by ordinary car and bus journeys; it does not pretend to provide transit schedules or vehicle-specific behavior.
- Calculates a drivable route and estimated travel time.
- Analyzes sun elevation, sun azimuth, route bearing, and elapsed trip time in multiple checkpoints.
- Recommends the **left side**, **right side**, or **no clear winner**.
- Shows the estimated shade advantage, route coverage, average sun angle, and a plain-language explanation.
- Displays the route and endpoints on an interactive Leaflet map.
- Handles geocoding and routing failures with readable UI states instead of silently guessing.

## Why this project exists

SunSide is an open-source experiment in **solar-aware navigation**, **sun exposure routing**, and **seat-side recommendation for public transport and road trips**. It combines mapping, geocoding, route bearings, and solar-position calculations into a small consumer utility.

Useful search terms for this project include:

- which side of the car should I sit on to avoid the sun
- which side of the bus is less sunny
- left or right side of car for sunlight
- avoid sun while commuting
- shaded side of a vehicle route
- sun exposure along a driving route
- solar-aware trip planner
- sun position route calculator
- home to office shaded route
- car seat side recommendation

## How the analysis works

1. **Find the places.** SunSide queries free geocoding providers and ranks candidates by place-name similarity, place type, and location context. It includes a fallback for low-level apartment societies that are not consistently indexed by public map databases.
2. **Trace the road.** The app requests a GeoJSON route from OSRM using OpenStreetMap road data.
3. **Sample the journey.** The route is divided into time-and-location checkpoints. A short trip gets a minimum number of checkpoints; longer trips get more samples up to a practical limit.
4. **Calculate the sun.** A compact browser-side implementation based on NOAA solar-position calculations estimates solar elevation and azimuth for each checkpoint.
5. **Compare left and right.** The app compares the sun’s direction to the vehicle’s route bearing. It counts meaningful left-side and right-side sun exposure and treats low-angle, front-facing, or rear-facing light as neutral.
6. **Explain the result.** The side with less meaningful direct exposure always becomes the recommendation. If the edge is tiny, SunSide still names the mathematically better side but explains that either side is fine in practice.

This is an estimate, not a guarantee of shade. Buildings, trees, window tint, road elevation, vehicle orientation, seat position, and local weather can all change the real experience.

## Technology stack

- **Vite** — fast frontend development and production builds.
- **Vanilla JavaScript** — small, dependency-light application logic.
- **Leaflet** — open-source interactive maps.
- **OpenStreetMap** — open map and road data.
- **Nominatim** — free OpenStreetMap geocoding fallback.
- **Photon** — open-source OpenStreetMap geocoder with POI search and typo-tolerant ranking.
- **OSRM** — free route geometry and travel-time estimation.
- **NOAA-style solar calculations** — browser-side solar elevation and azimuth estimates.
- **DM Sans, DM Mono, and Playfair Display** — readable open web typography.

No paid Google Maps key is required by the current version. A future production-scale version may add Google Places Autocomplete or another managed POI provider for higher-quality apartment, office, and business-place selection while retaining the same solar analysis layer.

## Local development

```bash
git clone https://github.com/Kartikist/sunside.git
cd sunside
npm install
npm run dev
```

The development server runs on port `3000`. Create a production build with:

```bash
npm run build
```

The build output is written to `dist`.

## Mapping and routing notes

OpenStreetMap is open data, not a guarantee that every apartment complex or private society has a precise searchable record. Nominatim and Photon can return multiple places with the same name, especially for common names such as “Brindavan Apartments” or “Dwaraka Hotel.” SunSide therefore uses multiple providers, nearby-place ranking, and an explicit candidate dropdown. The route cannot start until the user confirms the exact result. Adding a neighborhood, city, or country can still narrow the list faster.

The public Nominatim and Photon demo endpoints are intended for reasonable interactive use and may throttle heavy traffic. A larger deployment should move geocoding behind a server-side proxy with caching, use a managed geocoding provider, or run a dedicated geocoder instance. See the provider policies before operating this project at scale.

## Roadmap

- Add address and POI autocomplete with a visible candidate-selection row.
- Add Google Places or another managed POI provider as an optional, key-protected integration.
- Show multiple matching places on a small confirmation map before routing.
- Add transit-aware routing for bus and public-transport itineraries.
- Add sunrise, sunset, and low-sun warnings.
- Add route replay so riders can see how the sunlight changes over time.
- Add weather and cloud-cover context without changing the core sun geometry result.
- Add server-side caching and provider failover for a larger public deployment.
- Add tests for solar-position math, route bearings, geocoder ranking, and ambiguous-place handling.

## Contributing

Bug reports and improvements are welcome. If a place resolves to the wrong city, please include the exact input text, the intended neighborhood or city, and the incorrect result. Do not include private home addresses or personal information in an issue.

A useful contribution can improve one of three layers: better place disambiguation, more reliable free routing, or clearer solar-exposure explanations. Keep provider attribution and usage policies intact.

## Privacy

The current browser-only app sends the place text entered into the form to the selected geocoding and routing services. Do not enter sensitive personal information. The app does not require an account and does not intentionally store trip history.

## License

This project is released under the MIT License. Map data remains subject to the OpenStreetMap ODbL and provider-specific attribution and usage terms. Review the terms of each upstream service before deploying a high-volume or commercial instance.
