import { useEffect, useMemo, useRef, useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { mockApi } from "@/services/mockApi";
import { loadMapbox } from "@/services/mapboxLoader";
import { MapPin } from "lucide-react";

const DistrictMap = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const hoveredId = useRef<number | null>(null);
  const [selectedMahalla, setSelectedMahalla] = useState<any>(null);
  const [layers, setLayers] = useState({ heatmap: true, migration: false, cameras: false });
  const [mapReady, setMapReady] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);

  const chartData = useMemo(() => {
    if (!selectedMahalla) return null;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const values = [12, 14, 18, 16, 20, 22, 21, 24, 27, 23, 19, 18];
    return months.map((month, index) => ({ month, incidents: values[index] }));
  }, [selectedMahalla]);

  useEffect(() => {
    if (!mapContainer.current) return;
    let isMounted = true;
    let map: any;

    const initMap = async () => {
      const loaded = await loadMapbox();
      if (!loaded || !window.mapboxgl) {
        if (isMounted) {
          setMapReady(false);
          setMapLoading(false);
        }
        return;
      }

      window.mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
      map = new window.mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [68.71, 40.67],
        zoom: 9.5,
      });

      mapRef.current = map;

      map.on("load", async () => {
        const [districtGeo, mahallaGeo, heatmapPoints] = await Promise.all([
          mockApi.getDistrictGeoJson(),
          mockApi.getMahallaGeoJson(),
          mockApi.getHeatmapPoints(),
        ]);

        map.addSource("district", {
          type: "geojson",
          data: districtGeo,
        });

        map.addSource("mahallas", {
          type: "geojson",
          data: mahallaGeo,
        });

        map.addSource("heatmap", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: heatmapPoints.map((point: any) => ({
              type: "Feature",
              properties: { value: point.value },
              geometry: { type: "Point", coordinates: point.coordinates },
            })),
          },
        });

        map.addLayer({
          id: "district-boundary",
          type: "line",
          source: "district",
          paint: {
            "line-color": "#1E3A8A",
            "line-width": 3,
          },
        });

        map.addLayer({
          id: "mahalla-fill",
          type: "fill",
          source: "mahallas",
          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "crimeLevel"],
              0,
              "#93C5FD",
              0.5,
              "#3B82F6",
              1,
              "#1E3A8A",
            ],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.9,
              0.65,
            ],
          },
        });

        map.addLayer({
          id: "mahalla-outline",
          type: "line",
          source: "mahallas",
          paint: {
            "line-color": "#1E3A8A",
            "line-width": 1.5,
          },
        });

        map.addLayer({
          id: "heatmap-layer",
          type: "heatmap",
          source: "heatmap",
          layout: {
            visibility: layers.heatmap ? "visible" : "none",
          },
          paint: {
            "heatmap-weight": ["get", "value"],
            "heatmap-intensity": 1.2,
            "heatmap-radius": 25,
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(59,130,246,0)",
              0.3,
              "rgba(59,130,246,0.4)",
              0.7,
              "rgba(30,58,138,0.7)",
              1,
              "rgba(30,58,138,0.9)",
            ],
          },
        });

        map.addLayer({
          id: "migration-layer",
          type: "circle",
          source: "heatmap",
          layout: {
            visibility: layers.migration ? "visible" : "none",
          },
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["get", "value"], 0, 4, 1, 12],
            "circle-color": "#60A5FA",
            "circle-opacity": 0.6,
          },
        });

        map.addLayer({
          id: "camera-layer",
          type: "circle",
          source: "heatmap",
          layout: {
            visibility: layers.cameras ? "visible" : "none",
          },
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["get", "value"], 0, 3, 1, 9],
            "circle-color": "#1E3A8A",
            "circle-opacity": 0.7,
          },
        });

        (mahallaGeo as any).features.forEach((feature: any) => {
          const coords = feature.geometry.coordinates[0];
          const lng = coords.reduce((sum: number, item: number[]) => sum + item[0], 0) / coords.length;
          const lat = coords.reduce((sum: number, item: number[]) => sum + item[1], 0) / coords.length;
          new window.mapboxgl.Marker({ color: "#1E3A8A" }).setLngLat([lng, lat]).addTo(map);
        });

        map.on("mousemove", "mahalla-fill", (event) => {
          if (!event.features?.length) return;
          const featureId = event.features[0].id as number;
          if (hoveredId.current !== null) {
            map.setFeatureState({ source: "mahallas", id: hoveredId.current }, { hover: false });
          }
          hoveredId.current = featureId;
          map.setFeatureState({ source: "mahallas", id: featureId }, { hover: true });
        });

        map.on("mouseleave", "mahalla-fill", () => {
          if (hoveredId.current !== null) {
            map.setFeatureState({ source: "mahallas", id: hoveredId.current }, { hover: false });
          }
          hoveredId.current = null;
        });

        map.on("click", "mahalla-fill", (event) => {
          if (!event.features?.length) return;
          const feature = event.features[0];
          setSelectedMahalla(feature.properties);
        });

        if (isMounted) {
          setMapLoading(false);
        }
      });
    };

    initMap();

    return () => {
      isMounted = false;
      if (map) {
        map.remove();
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    if (map.getLayer("heatmap-layer")) {
      map.setLayoutProperty("heatmap-layer", "visibility", layers.heatmap ? "visible" : "none");
    }
    if (map.getLayer("migration-layer")) {
      map.setLayoutProperty("migration-layer", "visibility", layers.migration ? "visible" : "none");
    }
    if (map.getLayer("camera-layer")) {
      map.setLayoutProperty("camera-layer", "visibility", layers.cameras ? "visible" : "none");
    }
  }, [layers]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-semibold">District Map</h2>
          <Badge variant="outline">Mapbox GL</Badge>
        </div>
        <p className="text-muted-foreground">
          Interactive district map with mahalla boundaries, risk levels, and infrastructure layers.
        </p>
        <div className="flex flex-wrap gap-3">
          {(["heatmap", "migration", "cameras"] as const).map((layer) => (
            <button
              key={layer}
              type="button"
              onClick={() => setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }))}
              className={`rounded-full px-4 py-2 text-xs font-semibold border transition ${
                layers[layer] ? "bg-primary text-white border-primary" : "border-border text-muted-foreground"
              }`}
            >
              {layer === "heatmap" && "Crime Heatmap"}
              {layer === "migration" && "Migration Density"}
              {layer === "cameras" && "Camera Coverage"}
            </button>
          ))}
        </div>
        <div className="relative h-[640px] rounded-2xl border border-border overflow-hidden shadow-[var(--shadow-card)]">
          {mapReady ? (
            <div ref={mapContainer} className="absolute inset-0" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/30 text-sm text-muted-foreground">
              Mapbox scripts failed to load. Check network access for the CDN.
            </div>
          )}
          {mapLoading && mapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/20 text-sm text-muted-foreground">
              Loading map layers...
            </div>
          )}
          <div className="absolute bottom-4 left-4 rounded-xl bg-card/90 backdrop-blur border border-border px-4 py-3 text-xs shadow">
            <p className="font-semibold text-foreground mb-1">Legend</p>
            <div className="space-y-1 text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-2 w-6 rounded-full bg-[#93C5FD]" /> Low risk
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-6 rounded-full bg-[#3B82F6]" /> Medium risk
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-6 rounded-full bg-[#1E3A8A]" /> High risk
              </div>
            </div>
          </div>
        </div>
      </div>
      <Card className="border-border/60 shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Mahalla Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedMahalla ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedMahalla.name}</h3>
                  <p className="text-sm text-muted-foreground">Profilaktika officer: {selectedMahalla.officer}</p>
                </div>
                <Badge>{Math.round(selectedMahalla.crimeLevel * 100)} risk</Badge>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Card className="border-border/60">
                  <CardHeader>
                    <CardTitle className="text-sm">Population</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xl font-semibold">{selectedMahalla.population}</CardContent>
                </Card>
                <Card className="border-border/60">
                  <CardHeader>
                    <CardTitle className="text-sm">Monthly Cases</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xl font-semibold">{Math.round(selectedMahalla.crimeLevel * 45)}</CardContent>
                </Card>
              </div>
              <div className="h-48">
                {chartData && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Line type="monotone" dataKey="incidents" stroke="#1E3A8A" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              <Button className="w-full">Open Mahalla Detail</Button>
            </>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-12">
              <MapPin className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              Click a mahalla polygon to see insights.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DistrictMap;
