import { BrowserRouter, Routes, Route } from "react-router";
import { LandingPage } from "./pages/Landing";
import { CreatePage } from "./pages/Create";
import { CheckoutPage } from "./pages/Checkout";
import { SuccessPage } from "./pages/Success";
import { LoveSitePage } from "./pages/LoveSite";
import { DemoSitePage } from "./pages/Demo";
import { AdminLogin } from "./pages/admin/Login";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminPayments } from "./pages/admin/Payments";
import { AdminSites } from "./pages/admin/Sites";
import { AdminProtected } from "./components/admin/AdminProtected";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/criar" element={<CreatePage />} />
        <Route path="/checkout/:draftId" element={<CheckoutPage />} />
        <Route path="/sucesso/:draftId" element={<SuccessPage />} />
        <Route path="/love/:slug" element={<LoveSitePage />} />
        <Route path="/demo" element={<DemoSitePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminProtected>
              <AdminDashboard />
            </AdminProtected>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <AdminProtected>
              <AdminPayments />
            </AdminProtected>
          }
        />
        <Route
          path="/admin/sites"
          element={
            <AdminProtected>
              <AdminSites />
            </AdminProtected>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
