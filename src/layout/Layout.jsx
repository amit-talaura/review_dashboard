import { Outlet, useLocation } from "react-router-dom";
import Sidemenu from "../components/Sidemenu";
import logo from "../assets/images/logo.png";
import { useEffect, useState } from "react";

const Layout = () => {
  const location = useLocation();
  const [selectedChild, setSelectedChild] = useState("");

  useEffect(() => {
    if (location?.pathname.endsWith("metric")) {
      setSelectedChild("");
    }
    if (location?.pathname === "/") {
      setSelectedChild("Conversation");
    }
  }, [location?.pathname]);
  return (
    <div className="h-screen overflow-hidden">
      <header className="fixed top-0 left-0 right-0 h-16 text-white flex items-center justify-between px-4 z-10 border-b border-gray-300">
        <div className="text-xl font-bold text-black">
          <img
            src={logo}
            alt="website logo"
            className="relative object-cover w-[108px] cursor-pointer"
          />
        </div>
      </header>

      <div className="flex pt-16 h-full">
        <Sidemenu
          setSelectedChild={setSelectedChild}
          selectedChild={selectedChild}
        />

        <main className="overflow-y-auto h-[calc(100vh-4rem)] w-full bg-white p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
