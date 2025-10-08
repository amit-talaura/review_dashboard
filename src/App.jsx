import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//layout
import Layout from "./layout/Layout";
import ProtectedRoutes from "./protectedRouted/ProtectedRoutes";

//pages
import Login from "./pages/auth/Login";
import Index from "./pages/Index";
import Conversation from "./pages/conversation/Conversation";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<Index />} path="/" />
          <Route element={<Conversation />} path="/conversation" />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
