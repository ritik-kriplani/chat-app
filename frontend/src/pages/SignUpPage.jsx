import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon, SparklesIcon } from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
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
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 shadow-lg shadow-orange-200"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)" }}>
                    <MessageCircleIcon className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-stone-800 mb-2 tracking-tight">Create account</h1>
                  <p className="text-stone-500 text-sm">Join Chatify and start connecting 🚀</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* FULL NAME */}
                  <div>
                    <label className="auth-input-label">Full Name</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="input"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

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
                        placeholder="Create a strong password"
                      />
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <button className="auth-btn mt-2" type="submit" disabled={isSigningUp}>
                    {isSigningUp ? (
                      <LoaderIcon className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Create Account <SparklesIcon className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="auth-link">
                    Already have an account? <span className="font-semibold">Sign In →</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-8"
              style={{ background: "linear-gradient(135deg, #fff7ed, #fef3e8 60%, #fff9f4)" }}>
              <div className="text-center">
                <img
                  src="/signup.png"
                  alt="Sign up illustration"
                  className="w-full max-w-xs h-auto object-contain mx-auto drop-shadow-xl"
                />
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-stone-700 mb-2">Start your journey</h3>
                  <h3 className="text-2xl font-bold mb-5"
                    style={{ background: "linear-gradient(90deg,#f97316,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    today 🎉
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
export default SignUpPage;


