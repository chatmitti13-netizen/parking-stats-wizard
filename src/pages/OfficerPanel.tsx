import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { toast } from "sonner";

const OfficerPanel = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Officer Monthly Submission</h2>
        <p className="text-muted-foreground">Enter statistics for assigned mahalla (Yangiobod).</p>
      </section>

      <Card className="border-border/60">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle>August 2024 Submission</CardTitle>
          <Badge variant="secondary">Draft</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Population</label>
              <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="12450" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Cameras</label>
              <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="42" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Crimes (theft)</label>
              <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="14" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Crimes (other)</label>
              <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="20" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Preventive cases</label>
              <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="18" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Migration in/out</label>
              <input className="h-10 rounded-lg border border-border bg-background px-3 text-sm" placeholder="12 / 8" />
            </div>
          </div>
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Upload supporting files (PDF, Excel) - placeholder only.
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => toast("Draft saved")}>Save Draft</Button>
            <Button onClick={() => toast.success("Submitted for review")}>Submit for Review</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfficerPanel;
