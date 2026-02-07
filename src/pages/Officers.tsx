import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";
import { Modal, ModalContent, ModalDescription, ModalHeader, ModalTitle, ModalTrigger } from "@/components/Modal";
import { mockApi, Officer } from "@/services/mockApi";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

const Officers = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Barchasi");
  const [statusFilter, setStatusFilter] = useState("Barchasi");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    mockApi.getOfficers().then(setOfficers);
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
    toast.success("Xodim saqlandi (mock)");
    setIsModalOpen(false);
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
          <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <ModalTrigger asChild>
              <Button className="gap-2">
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
                  <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="Ism" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Familiya</label>
                  <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="Familiya" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Telefon</label>
                  <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="+998 90 000 00 00" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Login</label>
                  <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="login" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Rol</label>
                  <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
                    <option>Administrator</option>
                    <option>Inspektor</option>
                    <option>Analitik</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Biriktirilgan mahalla</label>
                  <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
                    <option>Yangiobod</option>
                    <option>Gulzor</option>
                    <option>Navbahor</option>
                    <option>Bunyodkor</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Holat</label>
                  <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
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
                    <Button size="sm" variant="outline">Ko'rish</Button>
                    <Button size="sm" variant="outline">Tahrirlash</Button>
                    <Button size="sm" variant="destructive">Faolsizlantirish</Button>
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
