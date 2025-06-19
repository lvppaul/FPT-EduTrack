import React from "react";
import { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
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
    <div
      className="h-screen w-full bg-cover flex items-center justify-center "
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/e4/7a/34/e47a34001489262a523c8b59ac64c782.jpg')",
      }}
    >
      <Paper elevation={24} className="w-full min-w-fit max-w-4xl flex">
        {/* Left Side - Form */}
        <div className="w-full  p-23">
          <Typography
            variant="h4"
            className="font-semibold  text-center "
            sx={{ marginBottom: "30px" }}
          >
            Sign In
          </Typography>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
            />
            <div className="flex items-center justify-end mt-4">
              <input type="checkbox" id="rememberMe" className="mr-2 h-4 w-4" />
              <label htmlFor="rememberMe" className="text-gray-700">
                Remember me
              </label>
            </div>
            <Button
              type="submit"
              variant="contained"
              className="!bg-black hover:!bg-gray-800 text-white rounded-full py-2"
              disabled={loading}
            >
              Sign in
            </Button>
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <div className="text-center mt-4">
              <Typography variant="body2" className="text-gray-600">
                Forgot password?{" "}
                <a
                  href="/forgot-password"
                  className="text-blue-500 hover:underline"
                >
                  Reset it
                </a>
              </Typography>
            </div>
          </form>
        </div>
      </Paper>
    </div>
  );
}
