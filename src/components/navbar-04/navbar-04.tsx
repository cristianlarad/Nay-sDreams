import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { SelectLenguaje } from "../ui/selectLengaje";
import { ModeToggle } from "../ui/toggle-button";
import { Link } from "react-router-dom";
import Profile from "./Profile";

const Navbar04Page = () => {
  return (
    <div className="shadow-2xs">
      <nav
        className="fixed top-6 inset-x-4 z-50 h-16 bg-background border  max-w-screen-xl mx-auto rounded-full
        shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] 
        border-b-4 border-primary/20 dark:border-primary/30
        transform hover:-translate-y-0.5 transition-transform duration-300"
      >
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <Link to="/">
            <Logo className="rounded-full" />
          </Link>
          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          <div className="flex items-center ">
            {!localStorage.getItem("token") && !localStorage.getItem("user") ? (
              <Button
                className="rounded-full cursor-pointer
                  shadow-[0_2px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition-shadow duration-300"
                variant="link"
              >
                <Link to="/login">Sign In</Link>
              </Button>
            ) : (
              <Profile />
            )}

            <ModeToggle />
            <SelectLenguaje />

            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar04Page;
