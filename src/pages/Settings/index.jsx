import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";
import { Droplet } from "lucide-react";
import { Wifi } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSetting, updateSetting } from "@/services/Api/setting";
import { toast } from "react-hot-toast";

const Settings = () => {
  const [setting, setSetting] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const fetchGetSetting = async () => {
    try {
      setLoading(true);
      const response = await getSetting();
      console.log("🚀 ~ fetchGetSetting ~ response:", response);
      const dataSetting = response.data;
      console.log("🚀 ~ fetchGetSetting ~ dataSetting:", dataSetting);
      setSetting(dataSetting);
    } catch (error) {
      console.error("Error fetching setting:", error);
      toast.error(error.message || "Lỗi khi tải cài đặt");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = async () => {
    try {
      setLoadingSubmit(true);

      // Validation
      if (!setting.electricityPrice || !setting.waterPrice || !setting.internetFee) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
        setLoadingSubmit(false);
        return;
      }

      const settingData = {
        electricityPrice: Number(setting.electricityPrice),
        waterPrice: Number(setting.waterPrice),
        internetFee: Number(setting.internetFee),
        cleaningFee: Number(setting.cleaningFee) || 0,
      };

      const response = await updateSetting(settingData);
      console.log("🚀 ~ handleUpdateSetting ~ response:", response);
      toast.success("Cập nhật cài đặt thành công");
      fetchGetSetting();
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error(error.response?.data?.error || error.message || "Lỗi khi cập nhật cài đặt");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSetting(prev => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    fetchGetSetting();
  }, []);
  const listSetting = [
    {
      id: 1,
      key: "electricityPrice",
      name: "Electricity Price (₫/kWh)",
      icon: <Zap className="inline-block w-4 h-4 mr-1 text-yellow-500" />,
      description: "Price per kilowatt-hour (kWh)",
      value: setting?.electricityPrice,
    },
    {
      id: 2,
      key: "waterPrice",
      name: "Water Price (₫/m³)",
      icon: <Droplet className="inline-block w-4 h-4 mr-1 text-blue-500" />,
      description: "Price per cubic meter (m³)",
      value: setting?.waterPrice,
    },
    {
      id: 3,
      key: "internetFee",
      name: "Internet Fee (₫/month)",
      icon: <Wifi className="inline-block w-4 h-4 mr-1 text-purple-500" />,
      description: "Monthly internet subscription fee",
      value: setting?.internetFee,
    },
    {
      id: 4,
      key: "cleaningFee",
      name: "Cleaning Fee (₫/month) - Optional",
      icon: <Sparkles className="inline-block w-4 h-4 mr-1 text-green-500" />,
      description: "Monthly cleaning service fee (optional)",
      value: setting?.cleaningFee,
    },
  ];
  return (
    <div>
      <div className="grid gap-5">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-foreground">Settings</h1>
            <p class="text-muted-foreground mt-2">
              Manage your system preferences and pricing
            </p>
          </div>
        </div>
        <Card className="px-6 grid gap-6">
          <div class="grid gap-2">
            <div data-slot="card-title" class="leading-none font-semibold">
              Pricing Configuration
            </div>
            <div
              data-slot="card-description"
              class="text-muted-foreground text-sm"
            >
              Set the pricing for utilities and services
            </div>
          </div>
          <div className="grid gap-6">
            {listSetting.map((item) => (
              <div className="grid gap-2" key={item.id}>
                <Label className="text-sm">
                  {item.icon}
                  {item.name}
                </Label>
                <Input
                  id={`price-${item.id}`}
                  type="number"
                  value={item.value || ""}
                  onChange={(e) => handleInputChange(item.key, e.target.value)}
                  disabled={loading}
                />
                <span className="text-muted-foreground text-sm">
                  {item.description}
                </span>
              </div>
            ))}
          </div>
          <Button 
            type="button" 
            className="w-full"
            onClick={handleUpdateSetting}
            disabled={loadingSubmit || loading}
          >
            {loadingSubmit ? "Đang lưu..." : "Lưu cài đặt"}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
