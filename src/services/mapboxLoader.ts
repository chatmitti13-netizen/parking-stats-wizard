let mapboxPromise: Promise<boolean> | null = null;

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

export const loadMapbox = () => {
  if (mapboxPromise) return mapboxPromise;
  mapboxPromise = Promise.all([
    loadScript("https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.js", "mapbox-gl"),
    loadScript("https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.5.0/mapbox-gl-draw.js", "mapbox-gl-draw"),
  ])
    .then(() => true)
    .catch(() => false);

  return mapboxPromise;
};
