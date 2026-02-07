import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import stats from "@/data/statistics_monthly.json";

const Statistics = () => {
  const [period, setPeriod] = useState("Monthly");
  const [mahalla, setMahalla] = useState("Yangiobod");
  const [compareYear, setCompareYear] = useState(false);

  const lineData = useMemo(() => {
    return stats.months.map((month, index) => ({
      month,
      crimes: stats.crimeTotals[index],
      crimesPrev: stats.crimeTotals[index] - 12,
    }));
  }, []);

  const barData = useMemo(() => stats.topMahallas.map((item) => ({ name: item.name, risk: item.value })), []);

  const pieData = useMemo(
    () => [
      { name: "Theft", value: 32 },
      { name: "Violence", value: 18 },
      { name: "Fraud", value: 22 },
      { name: "Other", value: 28 },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Statistics</h2>
        <p className="text-muted-foreground">Analyze crime, migration, and preventive measures with filters.</p>
      </section>

      <Tabs defaultValue="mahalla" className="space-y-6">
        <TabsList>
          <TabsTrigger value="mahalla">By Mahalla</TabsTrigger>
          <TabsTrigger value="district">Whole District</TabsTrigger>
        </TabsList>
        <TabsContent value="mahalla" className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              <select value={mahalla} onChange={(event) => setMahalla(event.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
                <option>Yangiobod</option>
                <option>Gulzor</option>
                <option>Navbahor</option>
                <option>Bunyodkor</option>
              </select>
              <select value={period} onChange={(event) => setPeriod(event.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={compareYear} onChange={() => setCompareYear((prev) => !prev)} />
                Compare to last year
              </label>
              <Button variant="outline">Export PDF</Button>
              <Button variant="outline">Export Excel</Button>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-border/60 lg:col-span-2">
              <CardHeader>
                <CardTitle>{mahalla} - {period} Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                    <Legend />
                    <Line type="monotone" dataKey="crimes" stroke="#1E3A8A" strokeWidth={2} />
                    {compareYear && <Line type="monotone" dataKey="crimesPrev" stroke="#93C5FD" strokeWidth={2} />}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle>Crime Composition</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={110}>
                      {["#1E3A8A", "#3B82F6", "#93C5FD", "#BFDBFE"].map((color) => (
                        <Cell key={color} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Detailed Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Crimes</TableHead>
                    <TableHead>Preventive</TableHead>
                    <TableHead>Migration</TableHead>
                    <TableHead>Cameras</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.months.map((month, index) => (
                    <TableRow key={month}>
                      <TableCell className="font-medium">{month}</TableCell>
                      <TableCell>{stats.crimeTotals[index]}</TableCell>
                      <TableCell>{stats.preventiveCases[index]}</TableCell>
                      <TableCell>{stats.migration[index]}</TableCell>
                      <TableCell>{Math.round(stats.cameras / 12)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="district" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle>District Crime Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                    <Legend />
                    <Line type="monotone" dataKey="crimes" stroke="#1E3A8A" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle>Top Mahallas by Risk</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                    <Bar dataKey="risk" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>District Summary Table</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mahalla</TableHead>
                    <TableHead>Crimes</TableHead>
                    <TableHead>Preventive</TableHead>
                    <TableHead>Population</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.topMahallas.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.value}</TableCell>
                      <TableCell>{Math.round(item.value * 0.6)}</TableCell>
                      <TableCell>{(stats.population / 4).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
