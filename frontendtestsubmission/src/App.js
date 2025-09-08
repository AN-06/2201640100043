// FrontendTestSubmission/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ShortenerPage from "./pages/ShortenerPage";
import StatsPage from "./pages/StatsPage";
import RedirectHandler from "./pages/RedirectHandler";

function App(){
  return (
    <Router>
      <nav style={{padding:12}}>
        <Link to="/">Shorten</Link>{" | "}
        <Link to="/stats">Statistics</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ShortenerPage/>} />
        <Route path="/stats" element={<StatsPage/>} />
        <Route path="/r/:shortcode" element={<RedirectHandler/>} />
      </Routes>
    </Router>
  );
}
export default App;
