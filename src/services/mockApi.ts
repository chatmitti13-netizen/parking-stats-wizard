import stats from "@/data/statistics_monthly.json";
import mahallas from "@/data/mahallas.json";
import officers from "@/data/officers.json";
import submissions from "@/data/submissions.json";
import reports from "@/data/reports.json";
import alerts from "@/data/alerts.json";
import aiPredictions from "@/data/ai_predictions.json";
import mahallaGeo from "@/data/mahallas_geo.json";
import districtGeo from "@/data/district.json";
import heatmapPoints from "@/data/heatmap_points.json";
import boundaryVersions from "@/data/boundary_versions.json";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type Mahalla = (typeof mahallas)[number];
export type Officer = (typeof officers)[number];
export type Submission = (typeof submissions)[number];
export type AlertItem = (typeof alerts)[number];
export type ReportItem = (typeof reports)[number];

export const mockApi = {
  async getDashboard() {
    await delay(300);
    return stats;
  },
  async getMahallas() {
    await delay(200);
    return mahallas;
  },
  async getOfficers() {
    await delay(200);
    return officers;
  },
  async getSubmissions() {
    await delay(200);
    return submissions;
  },
  async getReports() {
    await delay(200);
    return reports;
  },
  async getAlerts() {
    await delay(200);
    return alerts;
  },
  async getAiPredictions() {
    await delay(200);
    return aiPredictions;
  },
  async getMahallaGeoJson() {
    await delay(150);
    return mahallaGeo;
  },
  async getDistrictGeoJson() {
    await delay(150);
    return districtGeo;
  },
  async getHeatmapPoints() {
    await delay(150);
    return heatmapPoints;
  },
  async getBoundaryVersions() {
    await delay(150);
    return boundaryVersions;
  },
};
