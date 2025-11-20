import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const Layout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    if (openSidebar) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
  }, [openSidebar]);

  const handleClickOutside = (e) => {
    if (e.target.classList.contains("fixed")) {
      setOpenSidebar(false);
    }
  };
  return (
    <div className="flex h-screen">
      <Toaster />
      <div
        className={`${
          openSidebar ? "fixed inset-0 z-40 bg-black/50 lg:hidden" : ""
        }`}
      ></div>
      <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <div className="flex flex-1 flex-col w-full">
        <Header openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
