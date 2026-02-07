import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";
import { Modal, ModalContent, ModalDescription, ModalHeader, ModalTitle, ModalTrigger } from "@/components/Modal";
import { mockApi, Mahalla, Officer } from "@/services/mockApi";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

const Officers = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [mahallas, setMahallas] = useState<Mahalla[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Barchasi");
  const [statusFilter, setStatusFilter] = useState("Barchasi");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    surname: "",
    phone: "",
    username: "",
    role: "Inspektor",
    assignedMahalla: "",
    status: "Faol",
  });

  useEffect(() => {
    mockApi.getOfficers().then(setOfficers);
    mockApi.getMahallas().then(setMahallas);
  }, []);

  const filtered = useMemo(() => {
    return officers.filter((officer) => {
      const matchesSearch = `${officer.name} ${officer.surname}`.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "Barchasi" || officer.role === roleFilter;
      const matchesStatus = statusFilter === "Barchasi" || officer.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [officers, search, roleFilter, statusFilter]);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.surname.trim()) {
      toast.error("Ism va familiya to'ldirilishi shart.");
      return;
    }
    const payload: Officer = {
      ...formData,
      id: formData.id || `OFF-${Date.now()}`,
    };
    mockApi.saveOfficer(payload).then((items) => {
      setOfficers(items);
      toast.success("Xodim saqlandi.");
      setIsModalOpen(false);
      setFormData({
        id: "",
        name: "",
        surname: "",
        phone: "",
        username: "",
        role: "Inspektor",
        assignedMahalla: "",
        status: "Faol",
      });
    });
  };

  const handleEdit = (officer: Officer) => {
    setFormData({
      id: officer.id,
      name: officer.name,
      surname: officer.surname,
      phone: officer.phone,
      username: officer.username,
      role: officer.role,
      assignedMahalla: officer.assignedMahalla,
      status: officer.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    mockApi.deleteOfficer(id).then((items) => {
      setOfficers(items);
      toast.success("Xodim o'chirildi.");
    });
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Xodimlar boshqaruvi</h2>
        <p className="text-muted-foreground">Profilaktika xodimlari, rollar va biriktirishlarni boshqarish.</p>
      </section>

      <Card className="border-border/60">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Xodimlarni qidirish"
                className="h-10 w-56 rounded-lg border border-border bg-background pl-10 pr-3 text-sm"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="Barchasi">Barcha rollar</option>
              <option value="Administrator">Administrator</option>
              <option value="Inspektor">Inspektor</option>
              <option value="Analitik">Analitik</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="Barchasi">Barcha holatlar</option>
              <option value="Faol">Faol</option>
              <option value="O'chirilgan">O'chirilgan</option>
            </select>
          </div>
          <Modal
            open={isModalOpen}
            onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) {
                setFormData({
                  id: "",
                  name: "",
                  surname: "",
                  phone: "",
                  username: "",
                  role: "Inspektor",
                  assignedMahalla: "",
                  status: "Faol",
                });
              }
            }}
          >
            <ModalTrigger asChild>
              <Button
                className="gap-2"
                onClick={() =>
                  setFormData({
                    id: "",
                    name: "",
                    surname: "",
                    phone: "",
                    username: "",
                    role: "Inspektor",
                    assignedMahalla: "",
                    status: "Faol",
                  })
                }
              >
                <Plus className="h-4 w-4" /> Yangi xodim
              </Button>
            </ModalTrigger>
            <ModalContent className="max-w-2xl">
              <ModalHeader>
                <ModalTitle>Xodim yaratish / tahrirlash</ModalTitle>
                <ModalDescription>Xodim profili, roli va biriktirilgan mahallasini boshqaring.</ModalDescription>
              </ModalHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Ism</label>
                  <input
                    className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                    placeholder="Ism"
                    value={formData.name}
                    onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Familiya</label>
                  <input
                    className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                    placeholder="Familiya"
                    value={formData.surname}
                    onChange={(event) => setFormData((prev) => ({ ...prev, surname: event.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Telefon</label>
                  <input
                    className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                    placeholder="+998 90 000 00 00"
                    value={formData.phone}
                    onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Login</label>
                  <input
                    className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                    placeholder="login"
                    value={formData.username}
                    onChange={(event) => setFormData((prev) => ({ ...prev, username: event.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Rol</label>
                  <select
                    className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                    value={formData.role}
                    onChange={(event) => setFormData((prev) => ({ ...prev, role: event.target.value }))}
                  >
                    <option>Administrator</option>
                    <option>Inspektor</option>
                    <option>Analitik</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Biriktirilgan mahalla</label>
                  <select
                    className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                    value={formData.assignedMahalla}
                    onChange={(event) => setFormData((prev) => ({ ...prev, assignedMahalla: event.target.value }))}
                  >
                    <option value="">Mahalla tanlang</option>
                    {mahallas.map((mahalla) => (
                      <option key={mahalla.id} value={mahalla.name}>
                        {mahalla.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Holat</label>
                  <select
                    className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                    value={formData.status}
                    onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value }))}
                  >
                    <option>Faol</option>
                    <option>O'chirilgan</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Parolni tiklash</label>
                  <Button variant="outline">Tiklash havolasini yuborish</Button>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Bekor qilish</Button>
                <Button onClick={handleSave}>Xodimni saqlash</Button>
              </div>
            </ModalContent>
          </Modal>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ism</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Biriktirilgan mahalla</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((officer) => (
                <TableRow key={officer.id}>
                  <TableCell className="font-medium">
                    {officer.name} {officer.surname}
                  </TableCell>
                  <TableCell>{officer.phone}</TableCell>
                  <TableCell>{officer.username}</TableCell>
                  <TableCell>{officer.role}</TableCell>
                  <TableCell>{officer.assignedMahalla}</TableCell>
                  <TableCell>
                    <Badge variant={officer.status === "Faol" ? "default" : "secondary"}>{officer.status}</Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(officer)}>Ko'rish</Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(officer)}>Tahrirlash</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(officer.id)}>O'chirish</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Officers;
