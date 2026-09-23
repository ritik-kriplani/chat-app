import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, MailIcon, LoaderIcon, LockIcon, SparklesIcon } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="w-full flex items-center justify-center h-full">
      <div className="relative w-full h-full">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row min-h-full">

            {/* FORM COLUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center border-r border-orange-100">
              <div className="w-full max-w-md">

                {/* Logo + Heading */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 shadow-lg shadow-orange-200"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)" }}>
                    <MessageCircleIcon className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-stone-800 mb-2 tracking-tight">Welcome back!</h1>
                  <p className="text-stone-500 text-sm">Sign in to pick up where you left off ✨</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* EMAIL */}
                  <div>
                    <label className="auth-input-label">Email address</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input"
                        placeholder="Your password"
                      />
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <button className="auth-btn" type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <LoaderIcon className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Sign In <SparklesIcon className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/signup" className="auth-link">
                    Don't have an account? <span className="font-semibold">Sign Up →</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-8"
              style={{ background: "linear-gradient(135deg, #fff7ed, #fef3e8 60%, #fff9f4)" }}>
              <div className="text-center">
                <img
                  src="/login.png"
                  alt="People chatting"
                  className="w-full max-w-xs h-auto object-contain mx-auto drop-shadow-xl"
                />
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-stone-700 mb-2">Connect anytime,</h3>
                  <h3 className="text-2xl font-bold mb-5"
                    style={{ background: "linear-gradient(90deg,#f97316,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    anywhere 🌍
                  </h3>
                  <div className="flex justify-center gap-3">
                    <span className="auth-badge">✓ Free</span>
                    <span className="auth-badge">✓ Easy Setup</span>
                    <span className="auth-badge">✓ Private</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
export default LoginPage;

