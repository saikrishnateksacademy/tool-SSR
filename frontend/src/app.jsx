import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/sidebar.jsx";
import Dashboard from "./pages/ashboard.jsx";
import CourseManager from "./pages/CourseManager.jsx";
import PageManager from "./pages/PageManager.jsx";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<CourseManager />} />
              <Route path="/pages" element={<PageManager />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
