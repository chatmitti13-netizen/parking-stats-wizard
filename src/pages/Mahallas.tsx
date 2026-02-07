import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";
import { Modal, ModalContent, ModalDescription, ModalHeader, ModalTitle, ModalTrigger } from "@/components/Modal";
import { mockApi, Mahalla, Officer } from "@/services/mockApi";
import { loadMapbox } from "@/services/mapboxLoader";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE = 4;
const EMPTY_FORM = {
  id: "",
  name: "",
  code: "",
  population: 0,
  area: 0,
  assignedOfficer: "",
  status: "Faol",
  phone: "",
  description: "",
};

const Mahallas = () => {
  const [mahallas, setMahallas] = useState<Mahalla[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [boundaryVersions, setBoundaryVersions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Barchasi");
  const [officerFilter, setOfficerFilter] = useState("Barchasi");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [areaValue, setAreaValue] = useState<number | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [mapReady, setMapReady] = useState(true);

  useEffect(() => {
    mockApi.getMahallas().then(setMahallas);
    mockApi.getOfficers().then(setOfficers);
    mockApi.getBoundaryVersions().then(setBoundaryVersions);
  }, []);

  useEffect(() => {
    if (!isModalOpen || !mapContainer.current) return;
    let map: any;
    let isMounted = true;

    const initMap = async () => {
      const loaded = await loadMapbox();
      if (!loaded || !window.mapboxgl || !window.MapboxDraw) {
        if (isMounted) {
          setMapReady(false);
        }
        return;
      }

      if (!import.meta.env.VITE_MAPBOX_TOKEN) {
        if (isMounted) {
          setMapReady(false);
        }
        return;
      }
      window.mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
      map = new window.mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [68.71, 40.67],
        zoom: 10,
      });
      map.on("load", () => {
        const draw = new window.MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: true,
            trash: true,
          },
        });
        map.addControl(draw, "top-left");
        map.on("draw.create", () => handleDrawChange(draw));
        map.on("draw.update", () => handleDrawChange(draw));
        map.on("draw.delete", () => setAreaValue(null));
        map.resize();
        if (isMounted) {
          setMapReady(true);
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
  }, [isModalOpen]);

  const calculatePolygonArea = (coords: number[][]) => {
    if (coords.length < 3) return 0;
    let sum = 0;
    for (let i = 0; i < coords.length - 1; i += 1) {
      const [x1, y1] = coords[i];
      const [x2, y2] = coords[i + 1];
      sum += x1 * y2 - x2 * y1;
    }
    const areaDegrees = Math.abs(sum / 2);
    const kmPerDegree = 111;
    return areaDegrees * kmPerDegree * kmPerDegree;
  };

  const handleDrawChange = (draw: any) => {
    const data = draw.getAll();
    if (data.features.length === 0) return;
    const coords = (data.features[0].geometry as any).coordinates[0];
    const areaSqKm = calculatePolygonArea(coords);
    setAreaValue(Number(areaSqKm.toFixed(2)));
  };

  const filteredMahallas = useMemo(() => {
    return mahallas.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "Barchasi" || item.status === statusFilter;
      const matchesOfficer = officerFilter === "Barchasi" || item.assignedOfficer === officerFilter;
      return matchesSearch && matchesStatus && matchesOfficer;
    });
  }, [mahallas, search, statusFilter, officerFilter]);

  const totalPages = Math.ceil(filteredMahallas.length / PAGE_SIZE) || 1;
  const paginated = filteredMahallas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error("Mahalla nomi va MFY kodi kerak.");
      return;
    }
    const payload: Mahalla = {
      ...formData,
      id: formData.id || `MH-${Date.now()}`,
      population: Number(formData.population) || 0,
      area: (areaValue ?? Number(formData.area)) || 0,
    };
    mockApi.saveMahalla(payload).then((items) => {
      setMahallas(items);
      toast.success("Mahalla saqlandi.");
      setIsModalOpen(false);
      setFormData(EMPTY_FORM);
      setAreaValue(null);
    });
  };

  const versionInfo = boundaryVersions.find((item) => item.mahalla === "Yangiobod");
  const officerOptions = officers.map((officer) => `${officer.name} ${officer.surname}`);

  const handleEdit = (item: Mahalla) => {
    setFormData({
      id: item.id,
      name: item.name,
      code: item.code,
      population: item.population,
      area: item.area,
      assignedOfficer: item.assignedOfficer,
      status: item.status,
      phone: item.phone,
      description: item.description,
    });
    setAreaValue(item.area);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    mockApi.deleteMahalla(id).then((items) => {
      setMahallas(items);
      toast.success("Mahalla o'chirildi.");
    });
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Mahallalar boshqaruvi</h2>
        <p className="text-muted-foreground">Mahalla profillari, chegaralari va xodim biriktirishini boshqarish.</p>
      </section>

      <Card className="border-border/60">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nom yoki kod bo'yicha qidirish"
                className="h-10 w-64 rounded-lg border border-border bg-background pl-10 pr-3 text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="Barchasi">Barcha holatlar</option>
              <option value="Faol">Faol</option>
              <option value="Faol emas">Faol emas</option>
            </select>
            <select
              value={officerFilter}
              onChange={(event) => setOfficerFilter(event.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="Barchasi">Barcha xodimlar</option>
              {mahallas.map((item) => (
                <option key={item.assignedOfficer} value={item.assignedOfficer}>
                  {item.assignedOfficer}
                </option>
              ))}
            </select>
          </div>
          <Modal
            open={isModalOpen}
            onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) {
                setFormData(EMPTY_FORM);
                setAreaValue(null);
              }
            }}
          >
            <ModalTrigger asChild>
              <Button
                className="gap-2"
                onClick={() => {
                  setFormData(EMPTY_FORM);
                  setAreaValue(null);
                }}
              >
                <Plus className="h-4 w-4" /> Yangi mahalla
              </Button>
            </ModalTrigger>
            <ModalContent className="max-w-5xl">
              <ModalHeader>
                <ModalTitle>Mahalla yaratish / tahrirlash</ModalTitle>
                <ModalDescription>Mahalla profili, aloqa ma'lumotlari va chegarasini belgilang.</ModalDescription>
              </ModalHeader>
              <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">Mahalla nomi</label>
                    <input
                      className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                      placeholder="Mahalla nomi"
                      value={formData.name}
                      onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                    />
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">MFY kodi</label>
                    <input
                      className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                      placeholder="MFY-1005"
                      value={formData.code}
                      onChange={(event) => setFormData((prev) => ({ ...prev, code: event.target.value }))}
                    />
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">Aholi soni</label>
                    <input
                      className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                      placeholder="0"
                      type="number"
                      value={formData.population}
                      onChange={(event) => setFormData((prev) => ({ ...prev, population: Number(event.target.value) }))}
                    />
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">Tavsif</label>
                    <textarea
                      className="min-h-[90px] rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      placeholder="Mahalla haqida qisqacha"
                      value={formData.description}
                      onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                    />
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">Telefon</label>
                    <input
                      className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                      placeholder="+998 90 000 00 00"
                      value={formData.phone}
                      onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                    />
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">Mas'ul xodim</label>
                    <select
                      className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                      value={formData.assignedOfficer}
                      onChange={(event) => setFormData((prev) => ({ ...prev, assignedOfficer: event.target.value }))}
                    >
                      <option value="">Xodimni tanlang</option>
                      {officerOptions.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">Holat</label>
                    <select
                      className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                      value={formData.status}
                      onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value }))}
                    >
                      <option>Faol</option>
                      <option>Faol emas</option>
                    </select>
                  </div>
                  <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
                    Oxirgi tahrir: {versionInfo?.editedAt || "--"} · {versionInfo?.editedBy || "--"} · Versiya {versionInfo?.version || "--"}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Mahalla chegarasi</p>
                      <p className="text-xs text-muted-foreground">Poligon chizib yoki tahrirlab chegarani yangilang.</p>
                    </div>
                    <Badge variant="outline">Maydon: {areaValue ? `${areaValue} km²` : "--"}</Badge>
                  </div>
                  <div className="h-[420px] rounded-xl border border-border overflow-hidden">
                    {mapReady ? (
                      <div ref={mapContainer} className="h-full" />
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-muted-foreground bg-muted/30">
                        Mapbox skriptlari yuklanmadi. CDN uchun tarmoq ruxsatini tekshiring.
                      </div>
                    )}
                  </div>
                  <Button variant="outline" onClick={handleSave}>Poligonni saqlash</Button>
                </div>
              </div>
            </ModalContent>
          </Modal>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomi</TableHead>
                <TableHead>Kod</TableHead>
                <TableHead>Aholi</TableHead>
                <TableHead>Maydon (km²)</TableHead>
                <TableHead>Biriktirilgan xodim</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.population.toLocaleString()}</TableCell>
                  <TableCell>{item.area}</TableCell>
                  <TableCell>{item.assignedOfficer}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Faol" ? "default" : "secondary"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>Ko'rish</Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>Tahrirlash</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>O'chirish</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Sahifa {page} / {totalPages}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Oldingi
              </Button>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                Keyingi
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Mahallas;
