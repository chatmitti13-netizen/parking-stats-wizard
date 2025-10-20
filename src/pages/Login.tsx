import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, User, AlertCircle } from "lucide-react";
import { apiService } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.login({
        username: login,
        password: password,
      });

      // Save token and authentication state
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("isAuthenticated", "true");
      
      if (response.user?.username) {
        localStorage.setItem("username", response.user.username);
      }

      toast.success("Tizimga muvaffaqiyatli kirdingiz!");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login muvaffaqiyatsiz";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-3 sm:p-4 lg:p-6">
      <Card className="w-full max-w-md shadow-[var(--shadow-card)] border-border/50 mx-auto">
        <CardHeader className="space-y-2 text-center p-4 sm:p-6">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary-glow rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 shadow-lg">
            <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Parking Tizimi
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Tizimga kirish uchun ma'lumotlaringizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login" className="text-xs sm:text-sm font-medium">
                Login
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <Input
                  id="login"
                  type="text"
                  placeholder="admin"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="pl-9 sm:pl-10 h-10 sm:h-11 border-border/50 focus:border-primary transition-colors text-sm sm:text-base"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs sm:text-sm font-medium">
                Parol
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 sm:pl-10 h-10 sm:h-11 border-border/50 focus:border-primary transition-colors text-sm sm:text-base"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-10 sm:h-11 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 active:scale-[0.98] transition-all font-semibold shadow-md text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Kirish..." : "Kirish"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
