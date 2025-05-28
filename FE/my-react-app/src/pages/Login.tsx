import React from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Paper elevation={3} className="w-full max-w-4xl flex">
        {/* Left Side - Form */}
        <div className="w-1/2 p-10">
          <Typography variant="h4" className="font-semibold mb-6 text-center">
            Sign In
          </Typography>
          <form className="flex flex-col space-y-4">
            <TextField label="Email" variant="outlined" fullWidth />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
            />
            <div className="text-sm text-gray-500 grid grid-cols-2 gap-2">
              <div>• Use 8 or more characters</div>
              <div>• Use upper and lower case letters (e.g. Aa)</div>
              <div>• Use a number (e.g. 1234)</div>
              <div>• Use a symbol (e.g. #$%)</div>
            </div>
            <Button
              type="submit"
              variant="contained"
              className="!bg-black hover:!bg-gray-800 text-white rounded-full py-2"
            >
              Sign in
            </Button>
          </form>
          <Typography variant="body2" className="mt-4 text-center">
            Already have an account?{" "}
            <span className="text-black font-semibold cursor-pointer">
              Sign in
            </span>
          </Typography>
        </div>

        {/* Right Side - Features */}
        <div className="w-1/2 bg-gray-50 p-10 flex flex-col justify-center">
          <img
            src="https://via.placeholder.com/300x150.png?text=Illustration"
            alt="illustration"
            className="mx-auto mb-6"
          />
          <Typography variant="h6" className="mb-4 font-semibold">
            Some features:
          </Typography>
          <ul className="text-gray-700 space-y-2 text-sm list-disc pl-5">
            <li>The system provides a tool to help grade assignment.</li>
            <li>The system provides user-friendly interface.</li>
            <li>The system provides convenient management features.</li>
            <li>
              The system provides the contact between students and lecturers.
            </li>
          </ul>
        </div>
      </Paper>
    </div>
  );
}
