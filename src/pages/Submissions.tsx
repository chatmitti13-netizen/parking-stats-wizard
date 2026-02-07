import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";
import { mockApi, Submission } from "@/services/mockApi";

const Submissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    mockApi.getSubmissions().then(setSubmissions);
  }, []);

  const filtered = useMemo(() => {
    return submissions.filter((item) => statusFilter === "All" || item.status === statusFilter);
  }, [submissions, statusFilter]);

  const getBadgeVariant = (status: string) => {
    if (status === "Approved") return "default";
    if (status === "Pending") return "secondary";
    if (status === "Rejected") return "destructive";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Approval Workflow</h2>
        <p className="text-muted-foreground">Review monthly submissions from profilaktika officers.</p>
      </section>
      <Card className="border-border/60">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>Submitted Reports</CardTitle>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Mahalla</TableHead>
                <TableHead>Officer</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
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
