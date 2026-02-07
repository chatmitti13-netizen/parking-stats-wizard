import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { mockApi, AlertItem } from "@/services/mockApi";
import { useUi } from "@/store/UiContext";

const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [filter, setFilter] = useState("Barchasi");
  const [selected, setSelected] = useState<AlertItem | null>(null);
  const { setNotifications } = useUi();

  useEffect(() => {
    mockApi.getAlerts().then((items) => {
      setAlerts(items);
      setNotifications(items.filter((item) => item.status === "O'qilmagan").length);
    });
  }, [setNotifications]);

  const filtered = useMemo(() => {
    return alerts.filter((alert) => filter === "Barchasi" || alert.status === filter);
  }, [alerts, filter]);

  const badgeVariant = (severity: string) => {
    if (severity === "Yuqori") return "destructive";
    if (severity === "O'rta") return "secondary";
    return "outline";
  };

  const handleMarkAsRead = () => {
    if (!selected) return;
    const updated = alerts.map((alert) =>
      alert.id === selected.id ? { ...alert, status: "O'qilgan" } : alert
    );
    setAlerts(updated);
    setSelected({ ...selected, status: "O'qilgan" });
    setNotifications(updated.filter((item) => item.status === "O'qilmagan").length);
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Ogohlantirishlar markazi</h2>
        <p className="text-muted-foreground">Daraja, o'qilgan holati va tafsilotlarni kuzating.</p>
      </section>
      <Card className="border-border/60">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>Bildirishnomalar</CardTitle>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="Barchasi">Barchasi</option>
            <option value="O'qilmagan">O'qilmagan</option>
            <option value="O'qilgan">O'qilgan</option>
          </select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ogohlantirish</TableHead>
                <TableHead>Mahalla</TableHead>
                <TableHead>Daraja</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Sana</TableHead>
                <TableHead>Amal</TableHead>
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
                    <Badge variant={alert.status === "O'qilmagan" ? "secondary" : "outline"}>{alert.status}</Badge>
                  </TableCell>
                  <TableCell>{alert.date}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setSelected(alert)}>
                      Ko'rish
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
                  <Badge variant={selected.status === "O'qilmagan" ? "secondary" : "outline"}>{selected.status}</Badge>
                </div>
                <Button className="w-full" variant="outline" onClick={handleMarkAsRead}>
                  O'qilgan deb belgilash
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Alerts;
