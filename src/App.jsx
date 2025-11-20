import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { Spinner } from "./components/ui/spinner";

// Lazy load all pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Rooms = lazy(() => import("./pages/Rooms"));
const Tenants = lazy(() => import("./pages/Tenants"));
const Settings = lazy(() => import("./pages/Settings"));
const Bills = lazy(() => import("./pages/Bills"));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/bills" element={<Bills />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
