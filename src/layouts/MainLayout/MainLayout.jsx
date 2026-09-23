import { Outlet } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import BackButton from "../../components/BackButton/BackButton";

import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />

      <BackButton fallbackPath="/" />

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;