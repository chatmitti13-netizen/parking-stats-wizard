import { Button } from "@/components/Button";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background p-6">
    <div className="text-center space-y-4">
      <h1 className="text-3xl font-semibold">Page Not Found</h1>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <Button asChild>
        <Link to="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  </div>
);

export default NotFound;
