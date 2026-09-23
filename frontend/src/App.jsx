import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";

import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="w-screen h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fef3e8 40%, #fdf6ef 100%)" }}
    >
      {/* WARM DECORATORS */}
      {/* Subtle dot-grid */}
      <div className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #fdba74 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />
      {/* Glow blobs */}
      <div className="absolute top-0 -left-8 w-96 h-96 rounded-full opacity-30 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #f97316, #fbbf24)" }} />
      <div className="absolute bottom-0 -right-8 w-96 h-96 rounded-full opacity-25 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #fb923c, #f43f5e)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }} />

      <main className="w-full h-full relative z-10 flex flex-col">
        <Routes>
          <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
        </Routes>
      </main>

      <Toaster
        toastOptions={{
          style: {
            background: "#fff7ed",
            color: "#292524",
            border: "1px solid #fed7aa",
            borderRadius: "12px",
            fontFamily: "Inter, sans-serif",
          },
          success: { iconTheme: { primary: "#f97316", secondary: "white" } },
        }}
      />
    </div>
  );
}
export default App;

