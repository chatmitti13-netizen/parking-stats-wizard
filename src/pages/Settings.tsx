import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";

const Settings = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Sozlamalar</h2>
        <p className="text-muted-foreground">Platforma sozlamalari va konfiguratsiyasini boshqaring.</p>
      </section>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Platforma sozlamalari</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
            <div>
              <p className="font-medium">Ma'lumotlarni yangilash oralig'i</p>
              <p className="text-muted-foreground">Boshqaruv paneli ma'lumotlari uchun avtomatik yangilash.</p>
            </div>
            <select className="h-9 rounded-lg border border-border bg-background px-3">
              <option>15 daqiqa</option>
              <option>30 daqiqa</option>
              <option>60 daqiqa</option>
            </select>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
            <div>
              <p className="font-medium">Bildirishnoma email</p>
              <p className="text-muted-foreground">alerts@baxmal.gov.uz</p>
            </div>
            <Button variant="outline">Tahrirlash</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
