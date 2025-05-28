import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      {/* App Header */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        className="w-full"
      >
        <Toolbar className="justify-between">
          <Box className="flex items-center space-x-4">
            <IconButton size="large">
              <AccountCircleIcon fontSize="large" />
            </IconButton>
          </Box>
          <Box className="space-x-8 flex">
            <Button color="inherit">Home</Button>
            <Button color="inherit">About us</Button>
            <Button color="inherit">Contacts</Button>
          </Box>
          <Button
            variant="outlined"
            className="rounded-lg border-black text-black"
          >
            Sign in
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <div
        className="w-full h-[500px] bg-cover bg-center relative flex items-center justify-start px-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1588072432836-e10032774350')",
        }}
      >
        <div className="bg-black bg-opacity-40 p-10 rounded-lg max-w-xl text-white">
          <Typography variant="h4" className="font-bold mb-4">
            Welcome to My Website
          </Typography>
          <Typography variant="body1" className="mb-6">
            Discover a world of inspiration and knowledge on my website! Explore
            a variety of content, from insightful articles to engaging
            resources, designed to inform, entertain, and connect with our
            community. Join us on this exciting journey!
          </Typography>
          <Button
            variant="contained"
            className="!bg-black hover:!bg-gray-800 rounded-full"
          >
            Sign up for free
          </Button>
        </div>
      </div>
    </div>
  );
}
