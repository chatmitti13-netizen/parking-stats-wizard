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
  const [period, setPeriod] = useState("Oylik");
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
      { name: "O'g'irlik", value: 32 },
      { name: "Zo'ravonlik", value: 18 },
      { name: "Firibgarlik", value: 22 },
      { name: "Boshqa", value: 28 },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Statistika</h2>
        <p className="text-muted-foreground">Filtrlar orqali jinoyat, migratsiya va profilaktika ko'rsatkichlarini tahlil qiling.</p>
      </section>

      <Tabs defaultValue="mahalla" className="space-y-6">
        <TabsList>
          <TabsTrigger value="mahalla">Mahalla bo'yicha</TabsTrigger>
          <TabsTrigger value="district">Tuman bo'yicha</TabsTrigger>
        </TabsList>
        <TabsContent value="mahalla" className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Filtrlar</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              <select value={mahalla} onChange={(event) => setMahalla(event.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
                <option>Yangiobod</option>
                <option>Gulzor</option>
                <option>Navbahor</option>
                <option>Bunyodkor</option>
              </select>
              <select value={period} onChange={(event) => setPeriod(event.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
                <option>Oylik</option>
                <option>Choraklik</option>
                <option>Yillik</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={compareYear} onChange={() => setCompareYear((prev) => !prev)} />
                O'tgan yil bilan solishtirish
              </label>
              <Button variant="outline">PDF eksport</Button>
              <Button variant="outline">Excel eksport</Button>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-border/60 lg:col-span-2">
              <CardHeader>
                <CardTitle>{mahalla} - {period} trendi</CardTitle>
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
                <CardTitle>Jinoyat tarkibi</CardTitle>
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
              <CardTitle>Batafsil ko'rsatkichlar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Davr</TableHead>
                    <TableHead>Jinoyatlar</TableHead>
                    <TableHead>Profilaktika</TableHead>
                    <TableHead>Migratsiya</TableHead>
                    <TableHead>Kameralar</TableHead>
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
                <CardTitle>Tuman bo'yicha jinoyatlar trendi</CardTitle>
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
                <CardTitle>Xavf bo'yicha top mahallalar</CardTitle>
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
              <CardTitle>Tuman bo'yicha umumiy jadval</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mahalla</TableHead>
                    <TableHead>Jinoyatlar</TableHead>
                    <TableHead>Profilaktika</TableHead>
                    <TableHead>Aholi</TableHead>
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
