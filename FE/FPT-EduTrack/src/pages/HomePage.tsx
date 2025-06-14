import React, { useEffect } from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
export default function HomePage() {
  // Effect để cố định scroll
  useEffect(() => {
    // Lưu giá trị overflow ban đầu
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Áp dụng overflow: hidden
    document.body.style.overflow = "hidden";

    // Cleanup: khôi phục lại style ban đầu khi component unmount
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center bg-white ">
      {/* App Header */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        className="w-full"
      >
        <Toolbar className="justify-between">
          <Box className="flex items-center space-x-4"></Box>
          <Button
            variant="outlined"
            className="rounded-lg border-black text-black"
          >
            Sign in
          </Button>
        </Toolbar>
      </AppBar>

      <div
        className="w-full h-screen bg-cover bg-center relative flex items-start pt-[10%] justify-center px-20"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/e4/7a/34/e47a34001489262a523c8b59ac64c782.jpg')",
        }}
      >
        <div
          className="  p-10 rounded-lg  text-white"
          style={{ backgroundColor: "rgba(191, 219, 254, 0.5)" }}
        >
          <Typography variant="h4" className="font-bold mb-4">
            Welcome to My Website
          </Typography>
          <Typography variant="body1" className="mb-6">
            Discover a world of inspiration and knowledge on my website! Explore
            a variety of content, from insightful articles to engaging
            resources, designed to inform, entertain, and connect with our
            community. Join us on this exciting journey!
          </Typography>
        </div>
      </div>
    </div>
  );
}
