import { Button } from "@/components/Button";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background p-6">
    <div className="text-center space-y-4">
      <h1 className="text-3xl font-semibold">Sahifa topilmadi</h1>
      <p className="text-muted-foreground">Siz qidirayotgan sahifa mavjud emas.</p>
      <Button asChild>
        <Link to="/dashboard">Boshqaruv paneliga qaytish</Link>
      </Button>
    </div>
  </div>
);

export default NotFound;
