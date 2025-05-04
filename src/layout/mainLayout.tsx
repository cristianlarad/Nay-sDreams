import Footer05Page from "@/components/footer-05/footer-05";
import Navbar04Page from "@/components/navbar-04/navbar-04";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="">
      <div className="">
        {/* Header */}
        <Toaster
          position="bottom-right"
          richColors
          expand={true}
          duration={3000}
        />
        <header className="">
          <Navbar04Page />
        </header>
        {/* Main Content */}
        <main className="mt-26">
          <Outlet />
        </main>
        <footer className="bg-popover  p-4 text-center">
          <Footer05Page />
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
