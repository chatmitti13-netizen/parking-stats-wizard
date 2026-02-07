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
import { loadCollection, saveCollection } from "@/services/localStore";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const STORE_KEYS = {
  mahallas: "baxmal-mahallas",
  officers: "baxmal-officers",
  submissions: "baxmal-submissions",
  alerts: "baxmal-alerts",
  reports: "baxmal-reports",
};

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
    return loadCollection(STORE_KEYS.mahallas, mahallas);
  },
  async getOfficers() {
    await delay(200);
    return loadCollection(STORE_KEYS.officers, officers);
  },
  async getSubmissions() {
    await delay(200);
    return loadCollection(STORE_KEYS.submissions, submissions);
  },
  async getReports() {
    await delay(200);
    return loadCollection(STORE_KEYS.reports, reports);
  },
  async getAlerts() {
    await delay(200);
    return loadCollection(STORE_KEYS.alerts, alerts);
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
  async saveMahalla(item: Mahalla) {
    const items = loadCollection(STORE_KEYS.mahallas, mahallas);
    const exists = items.find((entry) => entry.id === item.id);
    const updated = exists ? items.map((entry) => (entry.id === item.id ? item : entry)) : [...items, item];
    saveCollection(STORE_KEYS.mahallas, updated);
    return updated;
  },
  async deleteMahalla(id: string) {
    const items = loadCollection(STORE_KEYS.mahallas, mahallas);
    const updated = items.filter((entry) => entry.id !== id);
    saveCollection(STORE_KEYS.mahallas, updated);
    return updated;
  },
  async saveOfficer(item: Officer) {
    const items = loadCollection(STORE_KEYS.officers, officers);
    const exists = items.find((entry) => entry.id === item.id);
    const updated = exists ? items.map((entry) => (entry.id === item.id ? item : entry)) : [...items, item];
    saveCollection(STORE_KEYS.officers, updated);
    return updated;
  },
  async deleteOfficer(id: string) {
    const items = loadCollection(STORE_KEYS.officers, officers);
    const updated = items.filter((entry) => entry.id !== id);
    saveCollection(STORE_KEYS.officers, updated);
    return updated;
  },
  async saveReport(item: ReportItem) {
    const items = loadCollection(STORE_KEYS.reports, reports);
    const updated = [item, ...items];
    saveCollection(STORE_KEYS.reports, updated);
    return updated;
  },
  async updateAlertStatus(id: string, status: AlertItem["status"]) {
    const items = loadCollection(STORE_KEYS.alerts, alerts);
    const updated = items.map((entry) => (entry.id === id ? { ...entry, status } : entry));
    saveCollection(STORE_KEYS.alerts, updated);
    return updated;
  },
  async saveSubmission(item: Submission) {
    const items = loadCollection(STORE_KEYS.submissions, submissions);
    const exists = items.find((entry) => entry.id === item.id);
    const updated = exists ? items.map((entry) => (entry.id === item.id ? item : entry)) : [item, ...items];
    saveCollection(STORE_KEYS.submissions, updated);
    return updated;
  },
};
