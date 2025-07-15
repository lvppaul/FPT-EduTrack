import React from "react";
import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { userLogin } from "../service/userService";
import { useAuth } from "../context/AuthContext";
import { validateLogin } from "../utils/validation";
export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { handleLogin } = useAuth();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn chặn reload trang
    setError(null);
    setLoading(true);
    const trimmedEmail = email.trim();
    const validationErrors = validateLogin(trimmedEmail, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      const { accessToken, refreshToken } = await userLogin(
        trimmedEmail,
        password
      );

      handleLogin(accessToken, refreshToken);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Login failed at Login.tsx"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">FPT</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your FPT EduTrack account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <TextField
                  label="Email Address"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  autoFocus
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#f8fafc",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                  }}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#f8fafc",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                  }}
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 text-sm text-gray-700 select-none"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                  borderRadius: "12px",
                  padding: "12px 0",
                  fontSize: "16px",
                  fontWeight: "600",
                  textTransform: "none",
                  boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                    boxShadow: "0 6px 20px 0 rgba(59, 130, 246, 0.4)",
                  },
                  "&:disabled": {
                    background: "#d1d5db",
                    boxShadow: "none",
                  },
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm text-center">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600">
              Need help? Contact{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                IT Support
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            © 2025 FPT Education. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
