import React from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";

const Header = ({ openSidebar, setOpenSidebar }) => {
  return (
    <div className="border-b border-border bg-card h-16 flex items-center px-4 lg:px-8 gap-2">
      <Button
        className="lg:hidden"
        variant="ghost"
        size="icon"
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        <Menu className="w-4 h-4" />
      </Button>
      <h2 class="text-sm lg:text-lg font-semibold text-foreground truncate">
        Welcome to Rental Management System
      </h2>
    </div>
  );
};

export default Header;
