import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";

const Settings = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-muted-foreground">Manage platform preferences and configuration.</p>
      </section>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Platform Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
            <div>
              <p className="font-medium">Data refresh interval</p>
              <p className="text-muted-foreground">Set automated refresh for dashboard data.</p>
            </div>
            <select className="h-9 rounded-lg border border-border bg-background px-3">
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>60 minutes</option>
            </select>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
            <div>
              <p className="font-medium">Notification email</p>
              <p className="text-muted-foreground">alerts@baxmal.gov.uz</p>
            </div>
            <Button variant="outline">Edit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
