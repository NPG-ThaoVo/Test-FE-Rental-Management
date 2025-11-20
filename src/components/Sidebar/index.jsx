import React from "react";
import { Button } from "../ui/button";
import { LayoutDashboard } from "lucide-react";
import { House } from "lucide-react";
import { Users } from "lucide-react";
import { FileText } from "lucide-react";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";

const Sidebar = ({ openSidebar, setOpenSidebar }) => {
  const url = useLocation().pathname;

  const listMenu = [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: 2,
      name: "Rooms",
      path: "/rooms",
      icon: House,
    },
    {
      id: 3,
      name: "Tenants",
      path: "/tenants",
      icon: Users,
    },
    {
      id: 4,
      name: "Bills",
      path: "/bills",
      icon: FileText,
    },
    {
      id: 5,
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];
  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transform transition-transform duration-200 ease-in-out lg:translate-x-0 -translate-x-full ${
        openSidebar ? "translate-x-0" : ""
      }`}
    >
      <div className="p-6 border-b border-border flex items-center w-full">
        <div className="flex items-center w-full">
          <div className="w-full">
            <h1 className="text-2xl font-bold text-primary">RentMgr</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Rental Management
            </p>
          </div>
          <Button
            className="lg:hidden"
            variant="ghost"
            size="icon"
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="p-4 grid gap-2 w-full">
        {listMenu.map((item) => (
          <Link to={item.path} key={item.id}>
            <Button
              onClick={() => setOpenSidebar(!openSidebar)}
              key={item.id}
              variant="ghost"
              className={`w-full justify-start items-center ${
                url === item.path
                  ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  : ""
              }
              `}
            >
              <item.icon className="w-6 h-6" />
              {item.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
