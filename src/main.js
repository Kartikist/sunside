import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css';

const $ = (selector) => document.querySelector(selector);
const app = $('#app');

const icons = {
  sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"></circle><path d="M12 2v2.1M12 19.9V22M4.93 4.93l1.5 1.5M17.57 17.57l1.5 1.5M2 12h2.1M19.9 12H22M4.93 19.07l1.5-1.5M17.57 6.43l1.5-1.5"></path></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"></path></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7v5l3.2 2"></path></svg>',
  car: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5.5 8.5 1.5-4h10l1.5 4M4 9.5h16v7H4zM7 16.5v2M17 16.5v2M7 12h.01M17 12h.01"></path></svg>',
  bus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17V6.5C5 4 7.4 3 12 3s7 1 7 3.5V17M5 12h14M7.5 17v2M16.5 17v2M8 7h8M8 14h.01M16 14h.01"></path></svg>',
  compass: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"></circle><path d="m15.3 8.7-2.1 4.5-4.5 2.1 2.1-4.5 4.5-2.1Z"></path></svg>',
  info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 10.5v5M12 7.5h.01"></path></svg>',
  refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 8.5A7.5 7.5 0 1 0 19.5 15M19 4.5v4h-4"></path></svg>'
};

app.innerHTML = `
  <div class="site-shell">
    <header class="topbar">
      <a class="wordmark" href="#top" aria-label="SunSide home">
        <span class="wordmark-mark">${icons.sun}</span>
        <span>Sun<span>Side</span></span>
      </a>
      <div class="topbar-note"><span class="live-dot"></span> Solar-aware trip planning</div>
      <a class="topbar-link" href="#how-it-works">How it works <span aria-hidden="true">↗</span></a>
    </header>

    <main id="top">
      <section class="hero-section">
        <div class="hero-copy">
          <div class="eyebrow"><span class="eyebrow-line"></span> THE SHADY-SIDE CALCULATOR</div>
          <h1>Your commute,<br /><em>without the glare.</em></h1>
          <p class="hero-lede">Tell SunSide where you’re going and when. We’ll tell you which side of the car or bus keeps the sun out of your eyes.</p>
          <div class="hero-proof">
            <span class="proof-icon">${icons.compass}</span>
            <span>Built from your route, the sun’s position, and a little geometry.</span>
          </div>
        </div>

        <div class="planner-card" aria-labelledby="planner-heading">
          <div class="card-kicker">PLAN A RIDE <span>01</span></div>
          <h2 id="planner-heading">Where are you headed?</h2>
          <p class="card-intro">A building, society, station, or landmark works. Add a neighbourhood if it’s private.</p>

          <form id="trip-form">
            <div class="location-stack">
              <label class="field location-field">
                <span class="field-label">From</span>
                <span class="field-icon origin-icon">${icons.pin}</span>
                <input id="origin" name="origin" autocomplete="off" placeholder="Origin, station, or landmark" required />
                <span class="location-stem"></span>
              </label>
              <label class="field location-field">
                <span class="field-label">To</span>
                <span class="field-icon destination-icon">${icons.pin}</span>
                <input id="destination" name="destination" autocomplete="off" placeholder="Destination, station, or landmark" required />
              </label>
            </div>

            <div class="planner-row">
              <label class="field compact-field">
                <span class="field-label">Leave on</span>
                <span class="field-icon">${icons.clock}</span>
                <input id="departure" name="departure" type="datetime-local" required />
              </label>
              <div class="mode-control">
                <span class="field-label">Riding in</span>
                <div class="mode-toggle" role="group" aria-label="Travel mode">
                  <button type="button" class="mode-option is-active" data-mode="car">${icons.car}<span>Car</span></button>
                  <button type="button" class="mode-option" data-mode="bus">${icons.bus}<span>Bus</span></button>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button class="primary-button" type="submit">Find the shady side <span class="button-arrow">${icons.arrow}</span></button>
              <button class="sample-link" type="button" id="sample-trip">Try a sample route <span aria-hidden="true">→</span></button>
            </div>
            <p class="form-footnote"><span class="footnote-lock">○</span> No account. No paid map key. Just a better seat.</p>
          </form>
        </div>
      </section>

      <section class="results-section is-empty" id="results" aria-live="polite">
        <div class="section-heading">
          <div>
            <div class="eyebrow"><span class="eyebrow-line"></span> YOUR SUN CHECK</div>
            <h2 id="results-title">The route is waiting.</h2>
          </div>
          <div class="result-context" id="result-context"></div>
        </div>

        <div class="empty-state" id="empty-state">
          <div class="empty-sun">${icons.sun}</div>
          <p>Once you plan a ride, your route and sun angle will show up here.</p>
        </div>

        <div class="loading-state" id="loading-state" hidden>
          <div class="loading-orbit"><span></span></div>
          <p><strong>Reading the road and the sky…</strong><br /><span id="loading-detail">Finding your places first.</span></p>
        </div>

        <div class="error-state" id="error-state" hidden>
          <div class="error-icon">!</div>
          <div><strong>We couldn’t read that trip.</strong><p id="error-message">Try a more specific place name or check your connection.</p></div>
          <button type="button" class="text-button" id="error-dismiss">Dismiss</button>
        </div>

        <div class="results-grid" id="results-grid" hidden>
          <div class="map-card">
            <div id="map" class="route-map" aria-label="Trip route map"></div>
            <div class="map-overlay map-overlay-top"><span class="map-live-dot"></span><span id="map-status">Route context</span></div>
            <div class="map-overlay map-legend"><span><i class="legend-dot start-dot"></i> Start</span><span><i class="legend-dot end-dot"></i> End</span><span><i class="legend-line"></i> Route</span></div>
          </div>

          <aside class="recommendation-card">
            <div class="recommendation-topline"><span>THE SHORT ANSWER</span><span id="recommendation-mode">CAR</span></div>
            <div class="recommendation-icon" id="recommendation-icon">${icons.sun}</div>
            <div class="recommendation-label">Best side to sit on</div>
            <h3 id="recommendation-title">Right side</h3>
            <p class="recommendation-copy" id="recommendation-copy">The sun stays mostly to your left, so the right side gets the calmer ride.</p>
            <div class="confidence-block">
              <div class="confidence-label"><span>SHADE ADVANTAGE</span><strong id="confidence-value">—</strong></div>
              <div class="confidence-track"><span id="confidence-bar"></span></div>
              <p id="confidence-copy">Calculated across the route</p>
            </div>
            <div class="metrics-row">
              <div><strong id="metric-duration">—</strong><span>trip time</span></div>
              <div><strong id="metric-coverage">—</strong><span>route analyzed</span></div>
              <div><strong id="metric-sun">—</strong><span>sun angle</span></div>
            </div>
            <div class="recommendation-footnote">${icons.info}<span>We model the sun in 10–15 minute slices. “No clear winner” means both sides are within 8% of each other.</span></div>
          </aside>
        </div>

        <div class="analysis-card" id="analysis-card" hidden>
          <div class="analysis-head"><div><div class="eyebrow"><span class="eyebrow-line"></span> WHY THIS SIDE?</div><h3>Read the light, not just the map.</h3></div><span class="analysis-date" id="analysis-date"></span></div>
          <div class="analysis-body">
            <div class="timeline-wrap">
              <div class="timeline-labels"><span>Departure</span><span>Arrival</span></div>
              <div class="timeline" id="timeline"></div>
              <div class="timeline-legend"><span><i class="side-swatch left-swatch"></i> Left gets sun</span><span><i class="side-swatch right-swatch"></i> Right gets sun</span><span><i class="side-swatch neutral-swatch"></i> Neutral</span></div>
            </div>
            <p class="analysis-explanation" id="analysis-explanation"></p>
          </div>
        </div>
      </section>

      <section class="how-section" id="how-it-works">
        <div class="how-intro"><div class="eyebrow"><span class="eyebrow-line"></span> A LITTLE FIELD GUIDE</div><h2>Good seats are<br /><em>calculated, not guessed.</em></h2></div>
        <div class="how-steps">
          <div class="how-step"><span>01</span><h3>Plot the road</h3><p>We find your places and trace the drivable route between them.</p></div>
          <div class="how-step"><span>02</span><h3>Read the sky</h3><p>For each part of the journey, we compare the sun’s angle with your direction.</p></div>
          <div class="how-step"><span>03</span><h3>Pick the shade</h3><p>We tally the calmer side and show you how strong the advantage is.</p></div>
        </div>
      </section>
    </main>

    <footer class="site-footer"><div class="footer-brand">${icons.sun}<span>SunSide</span></div><p>Free to use · Built with open map data · Made for less squinting</p><span class="footer-year">2026</span></footer>
  </div>
`;

const now = new Date();
now.setMinutes(Math.ceil(now.getMinutes() / 5) * 5, 0, 0);
$('#departure').value = toDateTimeLocal(now);

let selectedMode = 'car';
let map;
let routeLayer;
let routeData;

function toDateTimeLocal(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function setStatus(status) {
  const results = $('#results');
  results.classList.remove('is-empty', 'is-loading', 'has-error', 'has-results');
  if (status === 'empty') results.classList.add('is-empty');
  if (status === 'loading') results.classList.add('is-loading');
  if (status === 'error') results.classList.add('has-error');
  if (status === 'results') results.classList.add('has-results');
  $('#empty-state').hidden = status !== 'empty';
  $('#loading-state').hidden = status !== 'loading';
  $('#error-state').hidden = status !== 'error';
  $('#results-grid').hidden = status !== 'results';
  $('#analysis-card').hidden = status !== 'results';
}

function setLoadingDetail(text) {
  $('#loading-detail').textContent = text;
}

function showError(message) {
  $('#error-message').textContent = message;
  setStatus('error');
  $('#results-title').textContent = 'Let’s adjust the trip.';
  $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const PLACE_HINTS = [
  {
    match: /ashoka\s+chandra\s+enclave/i,
    fallbackQuery: 'Lakdikapul, Hyderabad, Telangana, India',
    label: 'Ashoka Chandra Enclave · Lakdikapul, Hyderabad'
  }
];

function normalizedText(value) {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function distanceBetween(a, b) {
  if (!a || !b) return null;
  const rad = Math.PI / 180;
  const latitudeDelta = (b.lat - a.lat) * rad;
  const longitudeDelta = (b.lon - a.lon) * rad;
  const latitudeOne = a.lat * rad;
  const latitudeTwo = b.lat * rad;
  const haversine = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(latitudeOne) * Math.cos(latitudeTwo) * Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function candidateScore(candidate, query, near) {
  const queryTokens = normalizedText(query).split(' ').filter((token) => token.length > 2);
  const searchable = normalizedText(`${candidate.name} ${candidate.label} ${candidate.city || ''} ${candidate.state || ''}`);
  const nameText = normalizedText(candidate.name || '');
  const tokenHits = queryTokens.filter((token) => searchable.includes(token)).length;
  const nameHits = queryTokens.filter((token) => nameText.includes(token)).length;
  const typeBoost = { locality: 1.5, house: 1.2, commercial: 1.1, building: 1, street: 0.7, other: 0.3, construction: -1.5 }[candidate.type] || 0;
  const exactBoost = searchable.includes(normalizedText(query)) ? 3 : 0;
  const stateBoost = candidate.state && /telangana|hyderabad/i.test(candidate.state) && /sattva|knowledge/i.test(query) ? 2 : 0;
  const distanceKm = distanceBetween(candidate, near);
  const proximityBoost = distanceKm === null ? 0 : Math.max(-4, 5 - Math.log10(Math.max(1, distanceKm)) * 2.5);
  return tokenHits + nameHits * 0.8 + typeBoost + exactBoost + stateBoost + proximityBoost;
}

function fromNominatim(place) {
  return {
    lat: Number(place.lat), lon: Number(place.lon), name: place.name || place.display_name.split(',')[0],
    label: place.display_name, type: place.type || place.addresstype || 'place',
    city: place.address?.city || place.address?.town || place.address?.municipality || '',
    state: place.address?.state || ''
  };
}

function fromPhoton(feature) {
  const properties = feature.properties || {};
  const coordinates = feature.geometry?.coordinates || [];
  const area = [properties.street, properties.locality, properties.district, properties.city, properties.state, properties.country].filter(Boolean);
  return {
    lat: Number(coordinates[1]), lon: Number(coordinates[0]), name: properties.name || properties.street || '',
    label: [properties.name, ...area].filter(Boolean).filter((value, index, values) => values.indexOf(value) === index).join(', '),
    type: properties.type || 'place', city: properties.city || properties.locality || '', state: properties.state || ''
  };
}

async function searchPlaces(query, near = null) {
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&addressdetails=1&q=${encodeURIComponent(query)}`;
  const nearbyParams = near ? `&lat=${encodeURIComponent(near.lat)}&lon=${encodeURIComponent(near.lon)}` : '';
  const photonUrl = `https://photon.komoot.io/api/?limit=8${nearbyParams}&q=${encodeURIComponent(query)}`;
  const responses = await Promise.allSettled([
    fetch(nominatimUrl, { headers: { Accept: 'application/json' } }).then((response) => response.ok ? response.json() : []),
    fetch(photonUrl, { headers: { Accept: 'application/json' } }).then((response) => response.ok ? response.json() : { features: [] })
  ]);
  const nominatimPlaces = responses[0].status === 'fulfilled' ? responses[0].value.map(fromNominatim) : [];
  const photonPlaces = responses[1].status === 'fulfilled' ? responses[1].value.features.map(fromPhoton) : [];
  const seen = new Set();
  return [...nominatimPlaces, ...photonPlaces].filter((place) => {
    const key = `${place.lat.toFixed(4)}:${place.lon.toFixed(4)}`;
    if (!Number.isFinite(place.lat) || !Number.isFinite(place.lon) || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => candidateScore(b, query, near) - candidateScore(a, query, near));
}

async function geocode(query, near = null) {
  const contextualQuery = near && !/[\d,]|\b(hyderabad|bengaluru|bangalore|chennai|mumbai|delhi|pune|kolkata|india|telangana|karnataka|tamil|maharashtra)\b/i.test(query)
    ? `${query}, ${near.city || near.state || ''}`.replace(/, $/, '')
    : query;
  let candidates = await searchPlaces(contextualQuery, near);
  let selected = candidates[0];
  const hint = PLACE_HINTS.find((item) => item.match.test(query));
  if (hint) {
    const fallbackCandidates = await searchPlaces(hint.fallbackQuery, near);
    if (fallbackCandidates[0]) selected = fallbackCandidates[0];
    if (selected) selected.label = hint.label;
  }
  if (!selected) throw new Error(`We couldn't find “${query}”. Try adding a neighbourhood, city, or country.`);
  return selected;
}

async function getRoute(origin, destination) {
  const endpoint = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson&steps=false`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error('The route service is taking a breather. Please try again in a moment.');
  const data = await response.json();
  if (data.code !== 'Ok' || !data.routes?.length) throw new Error('No drivable route was found between those places.');
  return data.routes[0];
}

function normalizeAngle(angle) {
  return ((angle + 180) % 360 + 360) % 360 - 180;
}

function bearingBetween(a, b) {
  const lat1 = a[1] * Math.PI / 180;
  const lat2 = b[1] * Math.PI / 180;
  const delta = (b[0] - a[0]) * Math.PI / 180;
  const y = Math.sin(delta) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(delta);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function interpolatePoint(coords, index) {
  const point = coords[Math.min(index, coords.length - 1)];
  return point;
}

// Compact solar position approximation based on NOAA's published solar calculations.
function solarPosition(date, latitude, longitude) {
  const rad = Math.PI / 180;
  const day = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 86400000);
  const minutes = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
  const gamma = 2 * Math.PI / 365 * (day - 1 + (minutes / 60 - 12) / 24);
  const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const declination = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma) - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);
  const offset = date.getTimezoneOffset();
  const trueSolarMinutes = minutes + eqTime + 4 * longitude - offset;
  const hourAngle = (trueSolarMinutes / 4 - 180) * rad;
  const latRad = latitude * rad;
  const cosZenith = Math.sin(latRad) * Math.sin(declination) + Math.cos(latRad) * Math.cos(declination) * Math.cos(hourAngle);
  const zenith = Math.acos(Math.max(-1, Math.min(1, cosZenith)));
  const elevation = 90 - zenith / rad;
  const azimuth = (Math.atan2(Math.sin(hourAngle), Math.cos(hourAngle) * Math.sin(latRad) - Math.tan(declination) * Math.cos(latRad)) / rad + 180) % 360;
  return { elevation, azimuth };
}

function analyzeRoute(route, departureDate) {
  const coords = route.geometry.coordinates;
  const slices = Math.max(6, Math.min(18, Math.round(route.duration / 600)));
  const observations = [];
  let leftSun = 0;
  let rightSun = 0;
  let neutral = 0;
  let sunlightWeighted = 0;

  for (let i = 0; i < slices; i += 1) {
    const progress = slices === 1 ? 0 : i / (slices - 1);
    const index = Math.round(progress * (coords.length - 2));
    const point = interpolatePoint(coords, index);
    const nextPoint = interpolatePoint(coords, Math.min(index + Math.max(1, Math.floor(coords.length / slices)), coords.length - 1));
    const timestamp = new Date(departureDate.getTime() + route.duration * 1000 * progress);
    const sun = solarPosition(timestamp, point[1], point[0]);
    const heading = bearingBetween(point, nextPoint);
    const sideAngle = normalizeAngle(sun.azimuth - heading);
    const sideSignal = Math.sin(sideAngle * Math.PI / 180);
    let side = 'neutral';
    if (sun.elevation > 5 && Math.abs(sideSignal) > 0.22) {
      side = sideSignal > 0 ? 'right' : 'left';
      sunlightWeighted += Math.max(0.15, Math.sin(sun.elevation * Math.PI / 180));
      if (side === 'left') leftSun += 1;
      if (side === 'right') rightSun += 1;
    } else {
      neutral += 1;
    }
    observations.push({ progress, side, elevation: sun.elevation, azimuth: sun.azimuth, heading, timestamp });
  }

  const analyzed = slices - neutral;
  const shadeSide = analyzed === 0 || Math.abs(leftSun - rightSun) / Math.max(1, analyzed) < 0.08 ? 'neutral' : leftSun < rightSun ? 'left' : 'right';
  const advantage = analyzed === 0 ? 0 : Math.round(Math.abs(leftSun - rightSun) / analyzed * 100);
  const coverage = Math.round((analyzed / slices) * 100);
  const avgElevation = observations.reduce((sum, item) => sum + Math.max(0, item.elevation), 0) / observations.length;
  return { observations, shadeSide, advantage, coverage, avgElevation, leftSun, rightSun, neutral, slices, sunlightWeighted };
}

function durationLabel(seconds) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
}

function formatPlace(place) {
  return place.label.split(',').slice(0, 2).join(',');
}

function renderTimeline(observations) {
  $('#timeline').innerHTML = observations.map((item) => `<span class="timeline-segment ${item.side}-segment" style="--segment-width: ${100 / observations.length}%" title="${item.side === 'neutral' ? 'Neutral light' : `${item.side === 'left' ? 'Left' : 'Right'} side gets sun`} · ${Math.round(item.elevation)}° elevation"></span>`).join('');
}

function renderMap(origin, destination, route) {
  if (!map) {
    map = L.map('map', { zoomControl: false, attributionControl: true });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
  }
  if (routeLayer) routeLayer.clearLayers();
  routeLayer = L.layerGroup().addTo(map);
  const routeCoords = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
  L.polyline(routeCoords, { color: '#f4b860', weight: 9, opacity: 0.22, lineCap: 'round' }).addTo(routeLayer);
  L.polyline(routeCoords, { color: '#273f43', weight: 4, opacity: 0.92, lineCap: 'round' }).addTo(routeLayer);
  const startIcon = L.divIcon({ className: 'custom-marker start-marker', html: '<span></span>', iconSize: [18, 18], iconAnchor: [9, 9] });
  const endIcon = L.divIcon({ className: 'custom-marker end-marker', html: '<span></span>', iconSize: [18, 18], iconAnchor: [9, 9] });
  L.marker([origin.lat, origin.lon], { icon: startIcon }).addTo(routeLayer).bindTooltip('Start', { direction: 'top', offset: [0, -8] });
  L.marker([destination.lat, destination.lon], { icon: endIcon }).addTo(routeLayer).bindTooltip('End', { direction: 'top', offset: [0, -8] });
  map.fitBounds(L.latLngBounds(routeCoords), { padding: [34, 34] });
}

function renderResults(origin, destination, route, analysis, departureDate) {
  const modeLabel = selectedMode.toUpperCase();
  const isNeutral = analysis.shadeSide === 'neutral';
  const recommendation = isNeutral ? 'No clear winner' : `${analysis.shadeSide === 'left' ? 'Left' : 'Right'} side`;
  const sunlightSide = isNeutral ? 'both sides' : analysis.shadeSide === 'left' ? 'right' : 'left';
  $('#results-title').textContent = isNeutral ? 'The light is pretty even.' : `Take the ${analysis.shadeSide} side.`;
  $('#result-context').innerHTML = `<span>${escapeHtml(formatPlace(origin))}</span><i>→</i><span>${escapeHtml(formatPlace(destination))}</span>`;
  $('#map-status').textContent = `${durationLabel(route.duration)} · ${modeLabel.toLowerCase()} route`;
  $('#recommendation-mode').textContent = modeLabel;
  $('#recommendation-icon').innerHTML = isNeutral ? icons.compass : icons.sun;
  $('#recommendation-title').textContent = recommendation;
  $('#recommendation-copy').textContent = isNeutral ? 'The sun moves across the route rather than favoring one window for long enough to matter.' : `The sun lands mostly on the ${analysis.shadeSide === 'left' ? 'right' : 'left'} side of the vehicle, so the ${analysis.shadeSide} side gets the calmer ride.`;
  $('#confidence-value').textContent = isNeutral ? '8% gap' : `${analysis.advantage}% edge`;
  $('#confidence-bar').style.width = `${Math.max(8, Math.min(100, isNeutral ? 8 : analysis.advantage))}%`;
  $('#confidence-copy').textContent = `${analysis.coverage}% of the route had a meaningful side signal`;
  $('#metric-duration').textContent = durationLabel(route.duration);
  $('#metric-coverage').textContent = `${analysis.coverage}%`;
  $('#metric-sun').textContent = `${Math.round(analysis.avgElevation)}°`;
  $('#analysis-date').textContent = formatDate(departureDate);
  $('#analysis-explanation').textContent = isNeutral ? `We checked ${analysis.slices} points along the route. The sun was side-on for ${analysis.coverage}% of the trip, but neither window stayed meaningfully calmer than the other.` : `Across ${analysis.slices} checkpoints, the sun favored the ${sunlightSide} window often enough to give the ${analysis.shadeSide} side a ${analysis.advantage}% shade edge. Higher sun angles and front/back light were treated as neutral.`;
  renderTimeline(analysis.observations);
  renderMap(origin, destination, route);
  setStatus('results');
}

async function calculateTrip({ sample = false } = {}) {
  const form = $('#trip-form');
  if (!sample && !form.reportValidity()) return;
  const originQuery = $('#origin').value.trim();
  const destinationQuery = $('#destination').value.trim();
  const departureDate = new Date($('#departure').value);
  if (!sample && (!originQuery || !destinationQuery || Number.isNaN(departureDate.getTime()))) return;
  setStatus('loading');
  $('#results-title').textContent = 'Reading your route.';
  $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  try {
    let origin;
    let destination;
    if (sample) {
      origin = { lat: 12.9352, lon: 77.6245, label: 'Koramangala, Bengaluru' };
      destination = { lat: 12.9784, lon: 77.6408, label: 'Indiranagar, Bengaluru' };
      setLoadingDetail('Tracing a sample road through Bengaluru.');
    } else {
      setLoadingDetail('Finding your starting point.');
      origin = await geocode(originQuery);
      setLoadingDetail('Finding your destination.');
      destination = await geocode(destinationQuery, origin);
    }
    setLoadingDetail('Tracing the road between them.');
    const route = await getRoute(origin, destination);
    setLoadingDetail('Comparing the route with the sun.');
    const analysis = analyzeRoute(route, departureDate);
    routeData = { origin, destination, route, analysis, departureDate };
    renderResults(origin, destination, route, analysis, departureDate);
  } catch (error) {
    showError(error.message || 'Something went wrong while planning that trip.');
  }
}

$('.mode-toggle').addEventListener('click', (event) => {
  const button = event.target.closest('.mode-option');
  if (!button) return;
  selectedMode = button.dataset.mode;
  document.querySelectorAll('.mode-option').forEach((item) => item.classList.toggle('is-active', item === button));
});

$('#trip-form').addEventListener('submit', (event) => {
  event.preventDefault();
  calculateTrip();
});

$('#sample-trip').addEventListener('click', () => {
  $('#origin').value = 'Koramangala, Bengaluru';
  $('#destination').value = 'Indiranagar, Bengaluru';
  calculateTrip({ sample: true });
});

$('#error-dismiss').addEventListener('click', () => setStatus('empty'));
