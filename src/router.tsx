import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./pages/Auth";
import { CoupleProvider, useCouple } from "./pages/Couple";
import AuthPage from "./pages/Auth";
import CoupleJoin from "./pages/Couple";
import App from "./App";

function Guard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-full flex items-center justify-center"><div className="w-10 h-10 rounded-2xl animate-pulse" style={{ background: "var(--grad)" }} /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function CoupleGuard({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  if (loading) return null;
  if (!profile?.couple_id) return <Navigate to="/couple" replace />;
  return <>{children}</>;
}

export default function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/couple"
            element={
              <Guard>
                <CoupleProvider>
                  <CoupleJoin />
                </CoupleProvider>
              </Guard>
            }
          />
          <Route
            path="/*"
            element={
              <Guard>
                <CoupleGuard>
                  <CoupleProvider>
                    <App />
                  </CoupleProvider>
                </CoupleGuard>
              </Guard>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
