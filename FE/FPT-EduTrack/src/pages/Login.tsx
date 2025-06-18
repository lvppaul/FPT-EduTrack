import React from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";

export default function SignInPage() {
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
          <form className="flex flex-col gap-3">
            <TextField label="Email" variant="outlined" fullWidth />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
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
            >
              Sign in
            </Button>
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
