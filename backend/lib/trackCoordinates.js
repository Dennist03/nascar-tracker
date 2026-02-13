// NASCAR Cup Series track coordinates and metadata
// Track IDs match the NASCAR CDN race_list_basic feed
const tracks = {
  // Superspeedways
  105: { lat: 29.1852, lon: -81.0705, type: 'superspeedway', name: 'Daytona International Speedway' },
  82:  { lat: 33.4537, lon: -86.0641, type: 'superspeedway', name: 'Talladega Superspeedway' },
  // Intermediates
  111: { lat: 33.3856, lon: -84.3163, type: 'intermediate', name: 'Atlanta Motor Speedway' },
  162: { lat: 35.3522, lon: -80.6832, type: 'intermediate', name: 'Charlotte Motor Speedway' },
  4:   { lat: 34.2946, lon: -79.9055, type: 'intermediate', name: 'Darlington Raceway' },
  40:  { lat: 25.4517, lon: -80.4075, type: 'intermediate', name: 'Homestead-Miami Speedway' },
  41:  { lat: 39.1158, lon: -94.8310, type: 'intermediate', name: 'Kansas Speedway' },
  42:  { lat: 36.2720, lon: -115.0101, type: 'intermediate', name: 'Las Vegas Motor Speedway' },
  133: { lat: 42.0649, lon: -84.2417, type: 'intermediate', name: 'Michigan International Speedway' },
  84:  { lat: 33.3753, lon: -112.3118, type: 'intermediate', name: 'Phoenix Raceway' },
  198: { lat: 41.0548, lon: -75.5126, type: 'intermediate', name: 'Pocono Raceway' },
  43:  { lat: 32.8597, lon: -97.2820, type: 'intermediate', name: 'Texas Motor Speedway' },
  52:  { lat: 36.1746, lon: -86.3882, type: 'intermediate', name: 'Nashville Superspeedway' },
  45:  { lat: 38.6300, lon: -90.1498, type: 'intermediate', name: 'World Wide Technology Raceway' },
  206: { lat: 41.6837, lon: -93.0247, type: 'intermediate', name: 'Iowa Speedway' },
  // Short tracks
  103: { lat: 39.1900, lon: -75.5302, type: 'short', name: 'Dover Motor Speedway' },
  14:  { lat: 36.5151, lon: -82.2565, type: 'short', name: 'Bristol Motor Speedway' },
  22:  { lat: 36.6340, lon: -79.8517, type: 'short', name: 'Martinsville Speedway' },
  138: { lat: 43.3630, lon: -71.4611, type: 'short', name: 'New Hampshire Motor Speedway' },
  26:  { lat: 37.4922, lon: -77.3197, type: 'short', name: 'Richmond Raceway' },
  177: { lat: 36.1610, lon: -81.0978, type: 'short', name: 'North Wilkesboro Speedway' },
  159: { lat: 36.0808, lon: -80.2489, type: 'short', name: 'Bowman Gray Stadium' },
  // Road courses
  99:  { lat: 38.1610, lon: -122.4551, type: 'road', name: 'Sonoma Raceway' },
  157: { lat: 42.3369, lon: -76.9272, type: 'road', name: 'Watkins Glen International' },
  214: { lat: 30.1327, lon: -97.6412, type: 'road', name: 'Circuit of The Americas' },
  123: { lat: 39.7955, lon: -86.2353, type: 'road', name: 'Indianapolis Motor Speedway' },
  // Street circuits
  39:  { lat: 41.8617, lon: -87.6155, type: 'street', name: 'Chicagoland Speedway' },
  221: { lat: 32.7157, lon: -117.1611, type: 'street', name: 'San Diego Street Course' },
};

export function getTrackCoords(trackId) {
  return tracks[trackId] || null;
}

export function isSuperspeedway(trackId) {
  return tracks[trackId]?.type === 'superspeedway';
}

export function getTrackType(trackId) {
  return tracks[trackId]?.type || null;
}
