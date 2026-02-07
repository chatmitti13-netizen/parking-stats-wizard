# Baxmal District Statistics Platform

Frontend-only React 18 + Vite application for the Baxmal district administration. The platform delivers a government-style analytics dashboard with district mapping, mahalla administration, officer workflows, and AI/alert insights using **mocked JSON data only**.

## ✨ Key Features (Phase 4)

- **Government-style dashboard** with KPI cards, charts, and submission summaries.
- **District map (Mapbox GL JS)** with mahalla polygons, hover states, and side panel insights.
- **Mahalla management UI** with Mapbox Draw polygon editing and area calculation.
- **Officer management UI** with CRUD modals and role/status filters.
- **Approval workflow** for officer submissions with review timeline.
- **Reports builder** with export button placeholders.
- **AI analytics** mock dashboards (radar, forecast, heatmap grid).
- **Alerts center** with severity badges and detail drawer.
- **Light/Dark theme toggle** persisted in localStorage.

## 🧱 Tech Stack

- React 18 + Vite
- Tailwind CSS
- React Router
- Zustand
- Mapbox GL JS + Mapbox Draw
- Chart.js (react-chartjs-2)
- Lucide React icons

## 📁 Folder Structure

```
/src
  /components
    Sidebar.tsx
    Header.tsx
    Layout.tsx
    Card.tsx
    Button.tsx
    Table.tsx
    Modal.tsx
    Badge.tsx
  /data
    district.geojson
    mahallas.geojson
    statistics_monthly.json
    officers.json
    mahallas.json
    submissions.json
    boundary_versions.json
    reports.json
    ai_predictions.json
    alerts.json
    heatmap_points.json
  /pages
    Dashboard.tsx
    DistrictMap.tsx
    Mahallas.tsx
    Officers.tsx
    Statistics.tsx
    Reports.tsx
    AiAnalytics.tsx
    Alerts.tsx
    Settings.tsx
    Submissions.tsx
    SubmissionReview.tsx
    OfficerPanel.tsx
  /routes
    AppRoutes.tsx
  /services
    mockApi.ts
  /store
    useUiStore.ts
```

## 🔧 Setup

```bash
npm install
npm run dev
```

## 🌍 Mapbox

Mapbox GL JS and Mapbox Draw are loaded via CDN scripts in `index.html` to avoid blocked registry installs. The access token is loaded from `.env`:

```
VITE_MAPBOX_TOKEN=pk.eyJ1IjoiaHVtb3l1bjEzMTIiLCJhIjoiY21hYmIwMzBuMjRmbDJtczh2cDFsZmNobSJ9.isj-iGJnRKTpVraIoy2bKQ
```

## ✅ Notes

- **Frontend-only**: No backend services or APIs.
- **Mock data** is stored in `/src/data` and accessed via `mockApi.ts`.
- **Export actions** (PDF/Excel) are UI-only placeholders.

---

Maintained for Baxmal district administration digital transformation initiatives.
