import { useEffect, useMemo, useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { mockApi } from "@/services/mockApi";

const AiAnalytics = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    mockApi.getAiPredictions().then(setData);
  }, []);

  const radarData = useMemo(() => {
    if (!data) return null;
    return data.riskIndex.map((item: any) => ({
      mahalla: item.mahalla,
      score: item.score,
    }));
  }, [data]);

  const forecastData = useMemo(() => {
    if (!data) return null;
    return data.forecast.map((item: any) => ({
      month: item.month,
      value: item.value,
    }));
  }, [data]);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">AI Analytics</h2>
        <p className="text-muted-foreground">Mock AI insights with risk scoring and predictive analysis.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Risk Index per Mahalla</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {radarData && (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="mahalla" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar dataKey="score" stroke="#1E3A8A" fill="rgba(59,130,246,0.3)" />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Crime Prediction Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {forecastData && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Heatmap Grid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {data?.heatmapGrid.flat().map((value: number, index: number) => (
                <div
                  key={index}
                  className="h-10 rounded-lg"
                  style={{ backgroundColor: `rgba(30,58,138,${value / 30})` }}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">Darker cells indicate higher predicted risk.</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Top 5 Emerging Risk Areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data?.emerging.map((item: any) => (
              <div key={item.name} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                <span>{item.name}</span>
                <Badge variant={item.risk === "High" ? "destructive" : item.risk === "Medium" ? "secondary" : "outline"}>
                  {item.risk}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {data?.recommendations.map((recommendation: string) => (
            <div key={recommendation} className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
              {recommendation}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AiAnalytics;
