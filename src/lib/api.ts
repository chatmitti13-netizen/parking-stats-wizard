const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user?: {
    username: string;
    role?: string;
  };
}

export interface DashboardStats {
  today: number;
  weekly: number;
  monthly: number;
  weekly_data: Array<{ name: string; cars: number }>;
  monthly_data: Array<{ name: string; cars: number }>;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Login xato" }));
      throw new Error(error.detail || "Login muvaffaqiyatsiz");
    }

    return response.json();
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/api/stats/dashboard`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("isAuthenticated");
        window.location.href = "/";
        throw new Error("Session tugadi, qayta kiring");
      }
      throw new Error("Ma'lumotlarni yuklashda xatolik");
    }

    return response.json();
  }

  async verifyToken(): Promise<boolean> {
    const token = localStorage.getItem("access_token");
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
