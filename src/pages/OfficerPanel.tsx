import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { mockApi, Submission } from "@/services/mockApi";
import { toast } from "sonner";

const OfficerPanel = () => {
  const [formData, setFormData] = useState({
    population: 12450,
    cameras: 42,
    crimesTheft: 14,
    crimesOther: 20,
    preventive: 18,
    migrationIn: 12,
    migrationOut: 8,
  });

  const buildSubmission = (status: Submission["status"]): Submission => ({
    id: `SUB-${Date.now()}`,
    mahalla: "Yangiobod",
    officer: "Said Akhmedov",
    period: "Avgust 2024",
    status,
    population: Number(formData.population) || 0,
    crimes: Number(formData.crimesTheft) + Number(formData.crimesOther),
    preventive: Number(formData.preventive) || 0,
    migrationIn: Number(formData.migrationIn) || 0,
    migrationOut: Number(formData.migrationOut) || 0,
    cameras: Number(formData.cameras) || 0,
    documents: [],
    submittedAt: new Date().toISOString().slice(0, 10),
    history: [{ date: new Date().toISOString().slice(0, 10), event: `${status} sifatida saqlandi` }],
  });

  const handleSave = (status: Submission["status"]) => {
    const payload = buildSubmission(status);
    mockApi.saveSubmission(payload).then(() => {
      toast.success(status === "Qoralama" ? "Qoralama saqlandi" : "Ko'rib chiqish uchun yuborildi");
    });
  };

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
              <input
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                placeholder="12450"
                type="number"
                value={formData.population}
                onChange={(event) => setFormData((prev) => ({ ...prev, population: Number(event.target.value) }))}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Kameralar</label>
              <input
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                placeholder="42"
                type="number"
                value={formData.cameras}
                onChange={(event) => setFormData((prev) => ({ ...prev, cameras: Number(event.target.value) }))}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Jinoyatlar (o'g'irlik)</label>
              <input
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                placeholder="14"
                type="number"
                value={formData.crimesTheft}
                onChange={(event) => setFormData((prev) => ({ ...prev, crimesTheft: Number(event.target.value) }))}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Jinoyatlar (boshqa)</label>
              <input
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                placeholder="20"
                type="number"
                value={formData.crimesOther}
                onChange={(event) => setFormData((prev) => ({ ...prev, crimesOther: Number(event.target.value) }))}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Profilaktika holatlari</label>
              <input
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                placeholder="18"
                type="number"
                value={formData.preventive}
                onChange={(event) => setFormData((prev) => ({ ...prev, preventive: Number(event.target.value) }))}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Migratsiya kirish/chiqish</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                  placeholder="Kirish"
                  type="number"
                  value={formData.migrationIn}
                  onChange={(event) => setFormData((prev) => ({ ...prev, migrationIn: Number(event.target.value) }))}
                />
                <input
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                  placeholder="Chiqish"
                  type="number"
                  value={formData.migrationOut}
                  onChange={(event) => setFormData((prev) => ({ ...prev, migrationOut: Number(event.target.value) }))}
                />
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Qo'llab-quvvatlovchi fayllarni yuklash (PDF, Excel) - faqat maket.
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => handleSave("Qoralama")}>Qoralamani saqlash</Button>
            <Button onClick={() => handleSave("Ko'rib chiqilmoqda")}>Ko'rib chiqishga yuborish</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfficerPanel;
