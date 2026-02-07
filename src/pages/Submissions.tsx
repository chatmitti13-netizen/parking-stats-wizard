import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";
import { mockApi, Submission } from "@/services/mockApi";

const Submissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [statusFilter, setStatusFilter] = useState("Barchasi");
  const navigate = useNavigate();

  useEffect(() => {
    mockApi.getSubmissions().then(setSubmissions);
  }, []);

  const filtered = useMemo(() => {
    return submissions.filter((item) => statusFilter === "Barchasi" || item.status === statusFilter);
  }, [submissions, statusFilter]);

  const getBadgeVariant = (status: string) => {
    if (status === "Tasdiqlangan") return "default";
    if (status === "Ko'rib chiqilmoqda") return "secondary";
    if (status === "Rad etilgan") return "destructive";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Tasdiqlash jarayoni</h2>
        <p className="text-muted-foreground">Profilaktika xodimlarining oylik topshiriqlarini ko'rib chiqing.</p>
      </section>
      <Card className="border-border/60">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>Yuborilgan hisobotlar</CardTitle>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="Barchasi">Barcha holatlar</option>
            <option value="Ko'rib chiqilmoqda">Ko'rib chiqilmoqda</option>
            <option value="Tasdiqlangan">Tasdiqlangan</option>
            <option value="Rad etilgan">Rad etilgan</option>
          </select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Mahalla</TableHead>
                <TableHead>Xodim</TableHead>
                <TableHead>Davr</TableHead>
                <TableHead>Holat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="cursor-pointer" onClick={() => navigate(`/submissions/${item.id}`)}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.mahalla}</TableCell>
                  <TableCell>{item.officer}</TableCell>
                  <TableCell>{item.period}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(item.status)}>{item.status}</Badge>
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

export default Submissions;
