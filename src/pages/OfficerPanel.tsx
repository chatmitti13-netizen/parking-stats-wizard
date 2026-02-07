import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { toast } from "sonner";

const OfficerPanel = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Xodim oylik topshirig'i</h2>
        <p className="text-muted-foreground">Biriktirilgan mahalla (Yangiobod) bo'yicha statistikani kiriting.</p>
      </section>

      <Card className="border-border/60">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle>Avgust 2024 topshirig'i</CardTitle>
          <Badge variant="secondary">Qoralama</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Aholi soni</label>
              <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="12450" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Kameralar</label>
              <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="42" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Jinoyatlar (o'g'irlik)</label>
              <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="14" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Jinoyatlar (boshqa)</label>
              <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="20" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Profilaktika holatlari</label>
              <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="18" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Migratsiya kirish/chiqish</label>
              <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="12 / 8" />
            </div>
          </div>
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Qo'llab-quvvatlovchi fayllarni yuklash (PDF, Excel) - faqat maket.
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => toast("Qoralama saqlandi")}>Qoralamani saqlash</Button>
            <Button onClick={() => toast.success("Ko'rib chiqish uchun yuborildi")}>Ko'rib chiqishga yuborish</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfficerPanel;
