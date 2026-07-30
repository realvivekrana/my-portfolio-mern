import { Outlet } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/footer/Footer";
import ScrollProgress from "../components/ui/ScrollProgress";
import ScrollToTop from "../components/ui/ScrollToTop";

const MainLayout = () => {
  return (
    <>
      <ScrollProgress />
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
      <ScrollToTop />
    </>
  );
};

export default MainLayout;