type LoadResult = { ok: boolean; error?: string };
let mapboxPromise: Promise<LoadResult> | null = null;

const loadScript = (src: string, id: string) =>
  new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });

const loadWithFallbacks = async (urls: string[], id: string) => {
  let lastError: Error | null = null;
  for (const url of urls) {
    try {
      await loadScript(url, id);
      return;
    } catch (error) {
      lastError = error as Error;
    }
  }
  throw lastError ?? new Error(`Failed to load ${id}`);
};

export const loadMapbox = () => {
  if (mapboxPromise) return mapboxPromise;
  mapboxPromise = Promise.all([
    loadWithFallbacks(
      [
        "https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.js",
        "https://cdn.jsdelivr.net/npm/mapbox-gl@3.4.0/dist/mapbox-gl.js",
        "https://unpkg.com/mapbox-gl@3.4.0/dist/mapbox-gl.js",
      ],
      "mapbox-gl"
    ),
    loadWithFallbacks(
      [
        "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.5.0/mapbox-gl-draw.js",
        "https://cdn.jsdelivr.net/npm/@mapbox/mapbox-gl-draw@1.5.0/dist/mapbox-gl-draw.js",
        "https://unpkg.com/@mapbox/mapbox-gl-draw@1.5.0/dist/mapbox-gl-draw.js",
      ],
      "mapbox-gl-draw"
    ),
  ])
    .then(() => ({ ok: true }))
    .catch((error) => ({ ok: false, error: error instanceof Error ? error.message : "Mapbox yuklanmadi" }));

  return mapboxPromise;
};
