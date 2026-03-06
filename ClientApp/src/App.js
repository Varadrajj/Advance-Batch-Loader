import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Mapping from "./pages/Mapping";
import './App.css';
import PrivateRoute from "./components/PrivateRoute";


function App() {
  return (
      <BrowserRouter>

          <Routes>

              <Route path="/login" element={<Login />} />

              <Route
                  path="/"
                  element={
                      <PrivateRoute>
                          <Dashboard />
                      </PrivateRoute>
                  }
              />

              <Route
                  path="/upload"
                  element={
                      <PrivateRoute>
                          <Upload />
                      </PrivateRoute>
                  }
              />

              <Route
                  path="/mapping"
                  element={
                      <PrivateRoute>
                          <Mapping />
                      </PrivateRoute>
                  }
              />

          </Routes>

      </BrowserRouter>
  );
}

export default App;
