import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";
import { mockApi, ReportItem } from "@/services/mockApi";
import { toast } from "sonner";

const Reports = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);

  useEffect(() => {
    mockApi.getReports().then(setReports);
  }, []);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Reports</h2>
        <p className="text-muted-foreground">Build reports with selected metrics and export formats.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Report Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Scope</label>
              <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
                <option>District</option>
                <option>Mahalla: Yangiobod</option>
                <option>Mahalla: Gulzor</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Date range</label>
              <div className="grid gap-2 md:grid-cols-2">
                <input type="date" className="h-10 rounded-lg border border-border bg-background px-3 text-sm" />
                <input type="date" className="h-10 rounded-lg border border-border bg-background px-3 text-sm" />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Metrics</label>
              <div className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
                {[
                  "Crimes",
                  "Preventive",
                  "Population",
                  "Migration",
                  "Cameras",
                  "Risk Score",
                ].map((metric) => (
                  <label key={metric} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked /> {metric}
                  </label>
                ))}
              </div>
            </div>
            <Button onClick={() => toast.success("Preview generated")}>Generate Preview</Button>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              Preview summary: District safety performance report with selected KPIs and charts.
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => toast("PDF export queued")}>Export PDF</Button>
              <Button variant="outline" onClick={() => toast("Excel export queued")}>Export Excel</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Report History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Range</TableHead>
                <TableHead>Metrics</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.scope}</TableCell>
                  <TableCell>{item.range}</TableCell>
                  <TableCell>{item.metrics.join(", ")}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
