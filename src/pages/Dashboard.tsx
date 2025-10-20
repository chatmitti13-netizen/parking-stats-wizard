import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Car, TrendingUp, Calendar, LogOut, BarChart3, RefreshCw, AlertCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { apiService, DashboardStats } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDashboardData = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) {
        setIsRefreshing(true);
      }

      const data = await apiService.getDashboardStats();
      setStats(data);

      if (showRefreshToast) {
        toast.success("Ma'lumotlar yangilandi");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ma'lumotlarni yuklashda xatolik";
      toast.error(errorMessage);
      
      // If authentication error, redirect to login
      if (errorMessage.includes("Session")) {
        navigate("/");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const token = localStorage.getItem("access_token");
    
    if (!isAuthenticated || !token) {
      navigate("/");
      return;
    }

    loadDashboardData();

    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    toast.success("Tizimdan chiqdingiz");
    navigate("/");
  };

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header - Responsive */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
              <Car className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Parking Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Mashinalar statistikasi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-1 sm:gap-2 border-border/50 hover:border-primary transition-colors text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden md:inline">Yangilash</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              size="sm"
              className="gap-1 sm:gap-2 border-border/50 hover:border-destructive hover:text-destructive transition-colors text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Chiqish</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Responsive padding */}
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {isLoading ? (
          <>
            {/* Loading Skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-border/50">
                  <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4 lg:p-6">
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <Skeleton className="h-10 w-24 mb-2" />
                    <Skeleton className="h-4 w-36" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="border-border/50">
                  <CardHeader className="p-3 sm:p-4 lg:p-6">
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent className="p-2 sm:p-4 lg:p-6">
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : stats ? (
          <>
            {/* Stats Cards - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <Card className="overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 active:scale-[0.98] border-border/50">
            <CardHeader className="pb-2 sm:pb-3 bg-gradient-to-br from-primary/10 to-primary/5 p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Bugungi mashinalar</CardTitle>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center shadow-md">
                  <Car className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3 sm:pt-4 lg:pt-6 p-3 sm:p-4 lg:p-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {stats.today}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                <span className="truncate">+12% kecha bilan</span>
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 active:scale-[0.98] border-border/50">
            <CardHeader className="pb-2 sm:pb-3 bg-gradient-to-br from-accent/10 to-accent/5 p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Haftalik statistika</CardTitle>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center shadow-md">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3 sm:pt-4 lg:pt-6 p-3 sm:p-4 lg:p-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                {stats.weekly}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                <span className="truncate">So'nggi 7 kun</span>
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 active:scale-[0.98] border-border/50 sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2 sm:pb-3 bg-gradient-to-br from-primary/10 to-primary/5 p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Oylik statistika</CardTitle>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center shadow-md">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3 sm:pt-4 lg:pt-6 p-3 sm:p-4 lg:p-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {stats.monthly}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                <span className="truncate">So'nggi 30 kun</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts - Responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <Card className="shadow-[var(--shadow-card)] border-border/50">
            <CardHeader className="p-3 sm:p-4 lg:p-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                </div>
                <span>Haftalik tendensiya</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6">
              <ResponsiveContainer width="100%" height={250} className="sm:h-[280px] lg:h-[300px]">
                <LineChart data={stats.weekly_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 11 }}
                    className="sm:text-xs"
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 11 }}
                    className="sm:text-xs"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="cars"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Mashinalar"
                    className="sm:stroke-[3]"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)] border-border/50">
            <CardHeader className="p-3 sm:p-4 lg:p-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-accent-foreground" />
                </div>
                <span>Oylik taqqoslash</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6">
              <ResponsiveContainer width="100%" height={250} className="sm:h-[280px] lg:h-[300px]">
                <BarChart data={stats.monthly_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 11 }}
                    className="sm:text-xs"
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 11 }}
                    className="sm:text-xs"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="cars"
                    fill="hsl(var(--accent))"
                    radius={[6, 6, 0, 0]}
                    name="Mashinalar"
                    className="sm:radius-[8,8,0,0]"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Ma'lumotlar yuklanmadi</p>
              <Button onClick={handleRefresh} variant="outline">
                Qayta urinish
              </Button>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
