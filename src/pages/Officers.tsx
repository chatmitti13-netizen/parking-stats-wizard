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
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    mockApi.getOfficers().then(setOfficers);
  }, []);

  const filtered = useMemo(() => {
    return officers.filter((officer) => {
      const matchesSearch = `${officer.name} ${officer.surname}`.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "All" || officer.role === roleFilter;
      const matchesStatus = statusFilter === "All" || officer.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [officers, search, roleFilter, statusFilter]);

  const handleSave = () => {
    toast.success("Officer saved (mock)");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Officer Management</h2>
        <p className="text-muted-foreground">Manage profilaktika officers, roles, and assignments.</p>
      </section>

      <Card className="border-border/60">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search officers"
                className="h-10 w-56 rounded-lg border border-border bg-background pl-10 pr-3 text-sm"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Officer">Officer</option>
              <option value="Analyst">Analyst</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>
          <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <ModalTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New Officer
              </Button>
            </ModalTrigger>
            <ModalContent className="max-w-2xl">
              <ModalHeader>
                <ModalTitle>Create / Edit Officer</ModalTitle>
                <ModalDescription>Manage officer identity, role, and assigned mahalla.</ModalDescription>
              </ModalHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Name</label>
                  <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="Name" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Surname</label>
                  <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="Surname" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Phone</label>
                  <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="+998 90 000 00 00" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Username</label>
                  <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="username" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Role</label>
                  <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
                    <option>Admin</option>
                    <option>Officer</option>
                    <option>Analyst</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Assigned Mahalla</label>
                  <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
                    <option>Yangiobod</option>
                    <option>Gulzor</option>
                    <option>Navbahor</option>
                    <option>Bunyodkor</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Status</label>
                  <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
                    <option>Active</option>
                    <option>Disabled</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Reset password</label>
                  <Button variant="outline">Send reset link</Button>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Officer</Button>
              </div>
            </ModalContent>
          </Modal>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Assigned Mahalla</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
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
                    <Badge variant={officer.status === "Active" ? "default" : "secondary"}>{officer.status}</Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="destructive">Disable</Button>
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
