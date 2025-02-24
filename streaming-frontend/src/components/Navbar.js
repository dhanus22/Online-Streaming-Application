import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png'; // Import logo

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Apply theme on load
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme between light & dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        {/* Logo */}
        <img src={logo} alt="Streaming App Logo" style={{ height: 40, marginRight: 10 }} />

        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Streaming App
        </Typography>

        {/* Navigation Links */}
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/browse">
          Browse
        </Button>
        <Button color="inherit" component={Link} to="/profile">
          Profile
        </Button>

        {/* Dark Mode Toggle Button */}
        <button className="dark-mode-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
