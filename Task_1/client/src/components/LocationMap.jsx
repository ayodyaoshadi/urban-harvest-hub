import { useState, useEffect } from 'react';

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const OSM_EMBED = 'https://www.openstreetmap.org/export/embed.html';

/**
 * External API: OpenStreetMap (Nominatim) for geocoding and map embed.
 * Shows a small map for an address. If geocoding fails, shows a fallback map so the user always sees a map.
 */
function LocationMap({ address, title = 'Location', className = '' }) {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(!!address);

  useEffect(() => {
    if (!address || !address.trim()) {
      setLoading(false);
      return;
    }
    const headers = { Accept: 'application/json', 'User-Agent': 'UrbanHarvestHub/1.0' };
    const tryGeocode = (query) =>
      fetch(`${NOMINATIM}?q=${encodeURIComponent(query)}&format=json&limit=1`, { headers })
        .then((res) => res.json())
        .then((data) => (data && data[0] ? { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) } : null));
    tryGeocode(address.trim())
      .then((c) => {
        if (c) return c;
        const parts = address.split(',').map((s) => s.trim()).filter(Boolean);
        return parts.length > 1 ? tryGeocode(parts[parts.length - 1]) : null;
      })
      .then((c) => {
        setCoords(c || { lat: 52.8054, lon: -2.1164 });
      })
      .catch(() => setCoords({ lat: 52.8054, lon: -2.1164 }))
      .finally(() => setLoading(false));
  }, [address]);

  if (!address) return null;
  if (loading) return <p className="text-gray-500 text-sm">Loading map…</p>;
  if (!coords) return null;

  const { lat, lon } = coords;
  const bbox = `${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}`;
  const embedUrl = `${OSM_EMBED}?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;

  return (
    <div className={className}>
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <iframe
        title={title}
        src={embedUrl}
        className="w-full h-48 border border-gray-200 rounded-lg"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-eco-green text-sm mt-1 inline-block"
      >
        Open in OpenStreetMap
      </a>
    </div>
  );
}

export default LocationMap;
