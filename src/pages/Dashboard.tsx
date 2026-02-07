import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";
import { Skeleton } from "@/components/ui/skeleton";
import { mockApi } from "@/services/mockApi";
import { Camera, ChartLine, ShieldAlert, Users, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await mockApi.getDashboard();
      setDashboardData(data);
      setLoading(false);
    };
    load();
  }, []);

  const lineChartData = useMemo(() => {
    if (!dashboardData) return null;
    return dashboardData.months.map((month: string, index: number) => ({
      month,
      crimes: dashboardData.crimeTotals[index],
      preventive: dashboardData.preventiveCases[index],
    }));
  }, [dashboardData]);

  const barChartData = useMemo(() => {
    if (!dashboardData) return null;
    return dashboardData.topMahallas.map((item: any) => ({ name: item.name, value: item.value }));
  }, [dashboardData]);

  const kpis = dashboardData
    ? [
        { label: "Jami jinoyatlar", value: dashboardData.crimeTotals.at(-1), icon: ShieldAlert },
        { label: "Profilaktika ishlari", value: dashboardData.preventiveCases.at(-1), icon: TrendingUp },
        { label: "Aholi soni", value: dashboardData.population.toLocaleString(), icon: Users },
        { label: "Migratsiya balansi", value: "+" + dashboardData.migration.at(-1), icon: ChartLine },
        { label: "Kameralar", value: dashboardData.cameras, icon: Camera },
      ]
    : [];

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Tuman bo'yicha umumiy ko'rinish</h2>
        <p className="text-muted-foreground">
          Baxmal tumani xavfsizligi va aholi boshqaruvi bo'yicha real vaqt KPI va oylik tahlillar.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="border-border/60 shadow-[var(--shadow-card)]">
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20" />
                </CardContent>
              </Card>
            ))
          : kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <Card key={kpi.label} className="border-border/60 shadow-[var(--shadow-card)]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle>
                    <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold text-foreground">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground">Oylik yangilanadi</p>
                  </CardContent>
                </Card>
              );
            })}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Oylik jinoyatlar</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {lineChartData && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Legend />
                  <Line type="monotone" dataKey="crimes" stroke="#1E3A8A" strokeWidth={2} />
                  <Line type="monotone" dataKey="preventive" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Eng xavfli 5 ta mahalla</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {barChartData && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Mini xarita ko'rinishi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-xl border border-dashed border-border bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-sm text-muted-foreground">
              Xarita ko'rinishi (tuman chegarasi va xavf nuqtalari)
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>So'nggi topshiriqlar</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Mahalla</TableHead>
                  <TableHead>Xodim</TableHead>
                  <TableHead>Holat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData?.latestSubmissions.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.mahalla}</TableCell>
                    <TableCell>{item.officer}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "Tasdiqlangan" ? "default" : item.status === "Ko'rib chiqilmoqda" ? "secondary" : "outline"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
