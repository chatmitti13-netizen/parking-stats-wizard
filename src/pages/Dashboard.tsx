import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Car, TrendingUp, Calendar, LogOut, BarChart3 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Mock data for demonstration
const weeklyData = [
  { name: "Dush", cars: 145 },
  { name: "Sesh", cars: 178 },
  { name: "Chor", cars: 156 },
  { name: "Pay", cars: 189 },
  { name: "Jum", cars: 234 },
  { name: "Shan", cars: 267 },
  { name: "Yak", cars: 198 },
];

const monthlyData = [
  { name: "1-hafta", cars: 1203 },
  { name: "2-hafta", cars: 1456 },
  { name: "3-hafta", cars: 1389 },
  { name: "4-hafta", cars: 1567 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [todayCars, setTodayCars] = useState(0);
  const [weeklyCars, setWeeklyCars] = useState(0);
  const [monthlyCars, setMonthlyCars] = useState(0);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // Simulate real-time data with animation
    const todayTarget = 198;
    const weeklyTarget = 1356;
    const monthlyTarget = 5615;

    const animateValue = (start: number, end: number, duration: number, setter: (value: number) => void) => {
      const range = end - start;
      const increment = range / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 16);
    };

    animateValue(0, todayTarget, 1000, setTodayCars);
    animateValue(0, weeklyTarget, 1200, setWeeklyCars);
    animateValue(0, monthlyTarget, 1400, setMonthlyCars);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Tizimdan chiqdingiz");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-md">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Parking Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">Mashinalar statistikasi</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2 border-border/50 hover:border-destructive hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Chiqish
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-shadow border-border/50">
            <CardHeader className="pb-3 bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Bugungi mashinalar</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center shadow-md">
                  <Car className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {todayCars}
              </div>
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-accent" />
                +12% kecha bilan solishtirganda
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-shadow border-border/50">
            <CardHeader className="pb-3 bg-gradient-to-br from-accent/10 to-accent/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Haftalik statistika</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center shadow-md">
                  <Calendar className="w-5 h-5 text-accent-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-4xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                {weeklyCars}
              </div>
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-accent" />
                So'nggi 7 kun
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-shadow border-border/50">
            <CardHeader className="pb-3 bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Oylik statistika</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center shadow-md">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {monthlyCars}
              </div>
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-accent" />
                So'nggi 30 kun
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-[var(--shadow-card)] border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary-foreground" />
                </div>
                Haftalik tendensiya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cars"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Mashinalar soni"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)] border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-accent-foreground" />
                </div>
                Oylik taqqoslash
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="cars"
                    fill="hsl(var(--accent))"
                    radius={[8, 8, 0, 0]}
                    name="Mashinalar soni"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
