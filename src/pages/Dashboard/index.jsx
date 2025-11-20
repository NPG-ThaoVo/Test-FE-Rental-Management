import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { Card } from "@/components/ui/card";
import { House } from "lucide-react";
import { Users } from "lucide-react";
import { FileText } from "lucide-react";
import { CircleAlert } from "lucide-react";
import { getBill } from "@/services/Api/bill";
import { getRooms } from "@/services/Api/room";
import { getTenants } from "@/services/Api/tenant";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [billUnpaid, setBillUnpaid] = useState([]);
  const [billPaid, setBillPaid] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch all data in parallel with Promise.all()
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Call all APIs in parallel
      const [billResponse, roomsResponse, tenantsResponse] = await Promise.all([
        getBill(),
        getRooms(),
        getTenants()
      ]);
      
      // Process bill data
      const totalUnpaid = billResponse.data.data
        .filter((item) => item.status === "unpaid")
        .reduce((sum, item) => sum + item.total, 0);
      setBillUnpaid(totalUnpaid);
      
      const totalPaid = billResponse.data.data
        .filter((item) => item.status === "paid")
        .reduce((sum, item) => sum + item.total, 0);
      setBillPaid(totalPaid);
      
      // Process rooms data
      const totalRooms = roomsResponse.data.data.length;
      setRooms(totalRooms);
      
      // Process tenants data
      const totalTenants = tenantsResponse.data.data.length;
      setTenants(totalTenants);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAllData();
  }, []);
  const listData = [
    {
      title: "Tổng số phòng",
      value: rooms,
      icon: <House className="w-4 h-4" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Tổng người thuê",
      value: tenants,
      icon: <Users className="w-4 h-4" />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Tổng hóa đơn",
      value: billPaid,
      icon: <FileText className="w-4 h-4" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Hóa đơn chưa thanh toán",
      value: billUnpaid,
      icon: <CircleAlert className="w-4 h-4" />,
      color: "bg-red-100 text-red-600",
    },
  ];
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your rental property management
        </p>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {listData.map((item, index) => (
          <Card key={index}>
            <div className="grid px-6 gap-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{item.title}</p>
                <p className={`p-2 rounded-lg ${item.color}`}>{item.icon}</p>
              </div>
              {loading ? (
                <div className="text-2xl font-bold text-muted-foreground">
                  ...
                </div>
              ) : (
                <div className="flex items-center">
                  {(item.title === "Tổng hóa đơn" ||
                    item.title === "Hóa đơn chưa thanh toán") &&
                    " đ"}
                  <CountUp className="text-2xl font-bold" end={item.value} />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
