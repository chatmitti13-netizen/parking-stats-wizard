import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { mockApi, AlertItem } from "@/services/mockApi";

const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<AlertItem | null>(null);

  useEffect(() => {
    mockApi.getAlerts().then(setAlerts);
  }, []);

  const filtered = useMemo(() => {
    return alerts.filter((alert) => filter === "All" || alert.status === filter);
  }, [alerts, filter]);

  const badgeVariant = (severity: string) => {
    if (severity === "High") return "destructive";
    if (severity === "Medium") return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Alerts Center</h2>
        <p className="text-muted-foreground">Monitor severity, read status, and detail drill-downs.</p>
      </section>
      <Card className="border-border/60">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>Notifications</CardTitle>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="All">All</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
          </select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert</TableHead>
                <TableHead>Mahalla</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((alert) => (
                <TableRow key={alert.id} className="cursor-pointer">
                  <TableCell className="font-medium">{alert.title}</TableCell>
                  <TableCell>{alert.mahalla}</TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant(alert.severity)}>{alert.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={alert.status === "Unread" ? "secondary" : "outline"}>{alert.status}</Badge>
                  </TableCell>
                  <TableCell>{alert.date}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setSelected(alert)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3 text-sm">
                <p className="text-muted-foreground">Mahalla: {selected.mahalla}</p>
                <p>{selected.details}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={badgeVariant(selected.severity)}>{selected.severity}</Badge>
                  <Badge variant={selected.status === "Unread" ? "secondary" : "outline"}>{selected.status}</Badge>
                </div>
                <Button className="w-full" variant="outline">Mark as Read</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Alerts;
