import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";
import { Modal, ModalContent, ModalDescription, ModalHeader, ModalTitle, ModalTrigger } from "@/components/Modal";
import { mockApi, Mahalla } from "@/services/mockApi";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE = 4;

const Mahallas = () => {
  const [mahallas, setMahallas] = useState<Mahalla[]>([]);
  const [boundaryVersions, setBoundaryVersions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [officerFilter, setOfficerFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [areaValue, setAreaValue] = useState<number | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [mapReady, setMapReady] = useState(true);

  useEffect(() => {
    mockApi.getMahallas().then(setMahallas);
    mockApi.getBoundaryVersions().then(setBoundaryVersions);
  }, []);

  useEffect(() => {
    if (!isModalOpen || !mapContainer.current) return;
    if (!window.mapboxgl || !window.MapboxDraw) {
      setMapReady(false);
      return;
    }

    setMapReady(true);
    window.mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const map = new window.mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [68.71, 40.67],
      zoom: 10,
    });

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

    return () => {
      map.remove();
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
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesOfficer = officerFilter === "All" || item.assignedOfficer === officerFilter;
      return matchesSearch && matchesStatus && matchesOfficer;
    });
  }, [mahallas, search, statusFilter, officerFilter]);

  const totalPages = Math.ceil(filteredMahallas.length / PAGE_SIZE) || 1;
  const paginated = filteredMahallas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSave = () => {
    toast.success("Mahalla saved (mock)");
    setIsModalOpen(false);
  };

  const versionInfo = boundaryVersions.find((item) => item.mahalla === "Yangiobod");

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Mahalla Management</h2>
        <p className="text-muted-foreground">Administer mahalla profiles, boundaries, and officer assignments.</p>
      </section>

      <Card className="border-border/60">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or code"
                className="h-10 w-64 rounded-lg border border-border bg-background pl-10 pr-3 text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              value={officerFilter}
              onChange={(event) => setOfficerFilter(event.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="All">All Officers</option>
              {mahallas.map((item) => (
                <option key={item.assignedOfficer} value={item.assignedOfficer}>
                  {item.assignedOfficer}
                </option>
              ))}
            </select>
          </div>
          <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <ModalTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New Mahalla
              </Button>
            </ModalTrigger>
            <ModalContent className="max-w-5xl">
              <ModalHeader>
                <ModalTitle>Create / Edit Mahalla</ModalTitle>
                <ModalDescription>Define mahalla profile, contact information, and boundary polygon.</ModalDescription>
              </ModalHeader>
              <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">Mahalla name</label>
                    <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="Mahalla name" />
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">MFY code</label>
                    <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="MFY-1005" />
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">Population</label>
                    <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="0" />
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">Description</label>
                    <textarea className="min-h-[90px] rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Describe mahalla" />
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">Phone</label>
                    <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="+998 90 000 00 00" />
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">Responsible officer</label>
                    <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
                      <option>Said Akhmedov</option>
                      <option>Dilfuza Karimova</option>
                      <option>Jamshid Qosimov</option>
                    </select>
                  </div>
                  <div className="grid gap-3">
                    <label className="text-sm font-medium">Status</label>
                    <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                  <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
                    Last edited: {versionInfo?.editedAt || "--"} by {versionInfo?.editedBy || "--"} · Version {versionInfo?.version || "--"}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Mahalla Boundary</p>
                      <p className="text-xs text-muted-foreground">Draw or edit polygon to update boundary.</p>
                    </div>
                    <Badge variant="outline">Area: {areaValue ? `${areaValue} km²` : "--"}</Badge>
                  </div>
                  <div className="h-[420px] rounded-xl border border-border overflow-hidden">
                    {mapReady ? (
                      <div ref={mapContainer} className="h-full" />
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-muted-foreground bg-muted/30">
                        Mapbox scripts failed to load. Check network access for the CDN.
                      </div>
                    )}
                  </div>
                  <Button variant="outline" onClick={handleSave}>Save Polygon</Button>
                </div>
              </div>
            </ModalContent>
          </Modal>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Population</TableHead>
                <TableHead>Area (km²)</TableHead>
                <TableHead>Assigned Officer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
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
                    <Badge variant={item.status === "Active" ? "default" : "secondary"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="destructive">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Mahallas;
