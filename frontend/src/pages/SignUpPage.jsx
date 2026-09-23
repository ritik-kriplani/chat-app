import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon, SparklesIcon, KeyRoundIcon, ArrowLeftIcon, RefreshCwIcon } from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";

function SignUpPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const { sendOtp, verifyOtp, isSendingOtp, isVerifyingOtp } = useAuthStore();

  // Handle resend timer
  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // Step 1 Submit -> Send OTP
  const handleSendOtpSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const success = await sendOtp(formData);
    if (success) {
      setStep(2);
      setResendTimer(60);
      setCanResend(false);
    }
  };

  // Step 2 OTP input handling
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value.slice(-1); // keep last entered digit
    setOtpDigits(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtpDigits(digits);
      inputRefs.current[5]?.focus();
    }
  };

  // Step 2 Submit -> Verify OTP & Complete Signup
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");
    if (fullOtp.length < 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    await verifyOtp({ email: formData.email, otp: fullOtp });
  };

  // Resend OTP
  const handleResend = async () => {
    if (!canResend) return;
    const success = await sendOtp(formData);
    if (success) {
      setResendTimer(60);
      setCanResend(false);
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
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
                  <h1 className="text-3xl font-bold text-stone-800 mb-2 tracking-tight">
                    {step === 1 ? "Create account" : "Verify your email"}
                  </h1>
                  <p className="text-stone-500 text-sm">
                    {step === 1 ? "Join Chatify and start connecting 🚀" : `Enter 6-digit code sent to ${formData.email}`}
                  </p>
                </div>

                {/* STEP 1: REGISTRATION DETAILS FORM */}
                {step === 1 && (
                  <form onSubmit={handleSendOtpSubmit} className="space-y-4">
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
                    <button className="auth-btn mt-2" type="submit" disabled={isSendingOtp}>
                      {isSendingOtp ? (
                        <LoaderIcon className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Continue to Verification <SparklesIcon className="w-4 h-4" />
                        </span>
                      )}
                    </button>
                  </form>
                )}

                {/* STEP 2: 6-DIGIT OTP VERIFICATION VIEW */}
                {step === 2 && (
                  <form onSubmit={handleVerifyOtpSubmit} className="space-y-6">
                    <div>
                      <label className="auth-input-label text-center mb-3">6-Digit Verification Code</label>
                      <div className="flex justify-between gap-2" onPaste={handlePaste}>
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => (inputRefs.current[idx] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            className="w-12 h-14 text-center text-xl font-extrabold text-orange-600 bg-white border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-300 outline-none transition-all shadow-xs"
                          />
                        ))}
                      </div>
                    </div>

                    {/* SUBMIT VERIFY */}
                    <button className="auth-btn" type="submit" disabled={isVerifyingOtp}>
                      {isVerifyingOtp ? (
                        <LoaderIcon className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Verify & Complete Sign Up <KeyRoundIcon className="w-4 h-4" />
                        </span>
                      )}
                    </button>

                    {/* RESEND + BACK ACTIONS */}
                    <div className="flex items-center justify-between text-xs pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-stone-500 hover:text-orange-600 flex items-center gap-1 font-medium transition-colors"
                      >
                        <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Edit
                      </button>

                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={!canResend || isSendingOtp}
                        className={`flex items-center gap-1.5 font-semibold transition-colors ${
                          canResend
                            ? "text-orange-600 hover:text-orange-700 cursor-pointer"
                            : "text-stone-400 cursor-not-allowed"
                        }`}
                      >
                        <RefreshCwIcon className={`w-3.5 h-3.5 ${isSendingOtp ? "animate-spin" : ""}`} />
                        {canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
                      </button>
                    </div>
                  </form>
                )}

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
                  <h3 className="text-2xl font-bold text-stone-700 mb-2">
                    {step === 1 ? "Start your journey" : "Verify email address"}
                  </h3>
                  <h3 className="text-2xl font-bold mb-5"
                    style={{ background: "linear-gradient(90deg,#f97316,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {step === 1 ? "today 🎉" : "securely 🔐"}
                  </h3>
                  <div className="flex justify-center gap-3">
                    <span className="auth-badge">✓ 6-Digit OTP</span>
                    <span className="auth-badge">✓ Secure</span>
                    <span className="auth-badge">✓ Verified</span>
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



