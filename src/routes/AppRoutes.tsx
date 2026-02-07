import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import DistrictMap from "@/pages/DistrictMap";
import Mahallas from "@/pages/Mahallas";
import Officers from "@/pages/Officers";
import Statistics from "@/pages/Statistics";
import Reports from "@/pages/Reports";
import Alerts from "@/pages/Alerts";
import Settings from "@/pages/Settings";
import AiAnalytics from "@/pages/AiAnalytics";
import Submissions from "@/pages/Submissions";
import SubmissionReview from "@/pages/SubmissionReview";
import OfficerPanel from "@/pages/OfficerPanel";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/district-map" element={<DistrictMap />} />
      <Route path="/mahallas" element={<Mahallas />} />
      <Route path="/officers" element={<Officers />} />
      <Route path="/statistics" element={<Statistics />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/ai-analytics" element={<AiAnalytics />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/submissions" element={<Submissions />} />
      <Route path="/submissions/:id" element={<SubmissionReview />} />
      <Route path="/officer-panel" element={<OfficerPanel />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
