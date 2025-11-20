import React, { useState, useEffect } from "react";
import HeaderBar from "@/components/HeaderBar";
import TableManagement from "@/components/TableManagement";
import {
  getBill,
  createBill,
  updateBill,
  deleteBill,
} from "@/services/Api/bill";
import { getTenants } from "@/services/Api/tenant";
import { getRooms } from "@/services/Api/room";
import { getSetting } from "@/services/Api/setting";
import { Badge } from "@/components/ui/badge";
import DialogData from "@/components/DialogData";
import { toast } from "react-hot-toast";

const Bills = () => {
  const [loading, setLoading] = useState(true);
  const [listBills, setListBills] = useState([]);
  const [groupSearch, setGroupSearch] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isCreate, setIsCreate] = useState(true);
  const [formData, setFormData] = useState({});
  const [listTenants, setListTenants] = useState([]);
  const [listRooms, setListRooms] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Fetch all data in parallel with Promise.all()
  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Call all APIs in parallel
      const [billResponse, tenantsResponse, settingsResponse] =
        await Promise.all([getBill(), getTenants(), getSetting()]);

      // Set settings data
      setSettings(settingsResponse.data);
      console.log("🚀 ~ fetchAllData ~ settings:", settingsResponse.data);

      // Process bills data with breakdown calculation
      const processedBills = billResponse.data.data.map((item) => ({
        ...item,
        breakdown: {
          electricity:
            (item.newElectricityIndex - item.oldElectricityIndex) *
            item.electricityPrice,
          water: (item.newWaterIndex - item.oldWaterIndex) * item.waterPrice,
          internet: item.internetFee,
          rent: item.rent,
        },
      }));
      setListBills(processedBills);

      // Set tenants data
      setListTenants(tenantsResponse.data.data);

      // Set rooms data
      setListRooms(tenantsResponse.data.data.map((tenant) => tenant.roomId));
      console.log(
        "list rooms:",
        tenantsResponse.data.data.map((tenant) => tenant.roomId)
      );
    } catch (error) {
      console.error("Error fetching bills data:", error);
      toast.error(error.message || "Failed to load bills data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (isCreate) => {
    setIsCreate(isCreate);

    // Set default month to current month when creating new bill
    if (isCreate) {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;
      setFormData({ month: currentMonth });
    }

    setOpenDialog(true);
  };

  // Handle close dialog - Reset form
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Helper function to format date to YYYY-MM (API requirement)
  const formatMonth = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  // Handle Create Bill
  const handleCreateBill = async (formData) => {
    try {
      setLoadingSubmit(true);
      console.log("Creating bill with data:", formData);

      // Validate required fields
      if (!formData.tenantId || !formData.roomId || !formData.month) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
        setLoadingSubmit(false);
        return;
      }

      // Get settings values with fallback defaults
      const electricityPrice = settings?.electricityPrice || 3000;
      const waterPrice = settings?.waterPrice || 15000;
      const internetFee = settings?.internetFee || 100000;

      const billData = {
        tenantId: formData.tenantId,
        roomId: formData.roomId,
        month: formatMonth(formData.month),
        oldElectricityIndex: Number(formData.oldElectricityIndex) || 0,
        newElectricityIndex: Number(formData.newElectricityIndex) || 0,
        electricityPrice: electricityPrice,
        oldWaterIndex: Number(formData.oldWaterIndex) || 0,
        newWaterIndex: Number(formData.newWaterIndex) || 0,
        waterPrice: waterPrice,
        internetFee: internetFee,
        rent: Number(formData.rent) || 0,
        status: formData.status || "unpaid",
        note: formData.note || "",
      };

      // Calculate total
      const electricityCost =
        (billData.newElectricityIndex - billData.oldElectricityIndex) *
        billData.electricityPrice;
      const waterCost =
        (billData.newWaterIndex - billData.oldWaterIndex) * billData.waterPrice;
      billData.total =
        electricityCost + waterCost + billData.internetFee + billData.rent;

      const response = await createBill(billData);
      console.log("🚀 ~ handleCreateBill ~ response:", response);

      toast.success("Tạo hóa đơn thành công");
      handleCloseDialog(); // Close and reset form
      fetchAllData(); // Refresh list
    } catch (error) {
      console.error("Error creating bill:", error);
      toast.error(
        error.response?.data?.error || error.message || "Lỗi khi tạo hóa đơn"
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Handle Update Bill
  const handleUpdateBill = async (id, formData) => {
    try {
      setLoadingSubmit(true);
      console.log("Updating bill:", id, formData);

      // Get settings values with fallback defaults
      const electricityPrice = settings?.electricityPrice || 3000;
      const waterPrice = settings?.waterPrice || 15000;
      const internetFee = settings?.internetFee || 100000;

      const billData = {
        tenantId: formData.tenantId,
        roomId: formData.roomId,
        month: formatMonth(formData.month),
        oldElectricityIndex: Number(formData.oldElectricityIndex) || 0,
        newElectricityIndex: Number(formData.newElectricityIndex) || 0,
        electricityPrice: electricityPrice,
        oldWaterIndex: Number(formData.oldWaterIndex) || 0,
        newWaterIndex: Number(formData.newWaterIndex) || 0,
        waterPrice: waterPrice,
        internetFee: internetFee,
        rent: Number(formData.rent) || 0,
        status: formData.status || "unpaid",
        note: formData.note || "",
      };

      // Calculate total
      const electricityCost =
        (billData.newElectricityIndex - billData.oldElectricityIndex) *
        billData.electricityPrice;
      const waterCost =
        (billData.newWaterIndex - billData.oldWaterIndex) * billData.waterPrice;
      billData.total =
        electricityCost + waterCost + billData.internetFee + billData.rent;

      const response = await updateBill(id, billData);
      console.log("🚀 ~ handleUpdateBill ~ response:", response);

      toast.success("Cập nhật hóa đơn thành công");
      handleCloseDialog(); // Close and reset form
      fetchAllData();
    } catch (error) {
      console.error("Error updating bill:", error);
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Lỗi khi cập nhật hóa đơn"
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Handle Delete Bill
  const handleDeleteBill = async (id) => {
    try {
      const isConfirmed = window.confirm(
        "Bạn có chắc chắn muốn xóa hóa đơn này?"
      );
      if (!isConfirmed) return;

      await deleteBill(id);
      toast.success("Xóa hóa đơn thành công");
      fetchAllData();
    } catch (error) {
      console.error("Error deleting bill:", error);
      toast.error(
        error.response?.data?.error || error.message || "Lỗi khi xóa hóa đơn"
      );
    }
  };

  // Handle Submit (Create or Update)
  const handleSubmit = (formData) => {
    if (isCreate) {
      handleCreateBill(formData);
    } else {
      handleUpdateBill(formData._id, formData);
    }
  };

  // Handle Edit - Format bill data for form
  const handleEditBill = (bill) => {
    console.log("🚀 ~ handleEditBill ~ bill:", bill);

    // Format data to match form structure
    const formattedData = {
      _id: bill._id,
      tenantId: bill.tenantId?._id || bill.tenantId,
      roomId: bill.roomId?._id || bill.roomId,
      month: bill.month, // Already in YYYY-MM format from API
      oldElectricityIndex: bill.oldElectricityIndex,
      newElectricityIndex: bill.newElectricityIndex,
      oldWaterIndex: bill.oldWaterIndex,
      newWaterIndex: bill.newWaterIndex,
      rent: bill.rent,
      status: bill.status,
      note: bill.note || "",
    };

    setFormData(formattedData);
    setIsCreate(false);
    setOpenDialog(true);
  };

  // Trong Bills component
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  // Auto filter rooms khi chọn tenant
  useEffect(() => {
    if (formData.tenantId) {
      const tenant = listTenants.find((t) => t._id === formData.tenantId);
      console.log("🚀 ~ useEffect ~ tenant:", tenant);
      if (tenant?.roomId) {
        setFilteredRooms([listRooms.find((r) => r._id === tenant.roomId._id)]);
      } else {
        setFilteredRooms(listRooms);
      }
    } else {
      setFilteredRooms(listRooms);
    }
  }, [formData.tenantId, listTenants, listRooms]);

  // Auto filter tenants khi chọn room
  useEffect(() => {
    if (formData.roomId) {
      debugger;
      const room = listRooms.find((r) => r._id === formData.roomId);
      if (room?.tenantId) {
        setFilteredTenants([listTenants.find((t) => t._id === room.tenantId)]);
      } else {
        setFilteredTenants(listTenants);
      }
    } else {
      setFilteredTenants(listTenants);
    }
  }, [formData.room, listRooms, listTenants]);

  useEffect(() => {
    if (!formData.tenantId) {
      // Nếu chưa chọn tenant → show toàn bộ phòng
      setFilteredRooms(
        listRooms.map((room) => ({
          value: room._id,
          label: room.name,
        }))
      );
      return;
    }

    const tenant = listTenants.find((t) => t._id === formData.tenantId);
    if (tenant?.roomId) {
      // Nếu tenant có roomId → chỉ hiển thị phòng đó
      setFilteredRooms([
        {
          value: tenant.roomId._id,
          label: tenant.roomId.name,
        },
      ]);
    } else {
      // Nếu không có phòng → show toàn bộ
      setFilteredRooms(
        listRooms.map((room) => ({
          value: room._id,
          label: room.name,
        }))
      );
    }
  }, [formData.tenantId, listTenants, listRooms]);

  // Auto-fill giá thuê phòng khi chọn phòng
  useEffect(() => {
    if (formData.roomId && listRooms.length > 0) {
      const selectedRoom = listRooms.find((r) => r._id === formData.roomId);
      if (selectedRoom?.price && formData.rent !== selectedRoom.price) {
        setFormData((prev) => ({
          ...prev,
          rent: selectedRoom.price,
        }));
      }
    }
  }, [formData.roomId, listRooms]);

  useEffect(() => {
    if (formData.roomId && listBills.length > 0) {
      const roomBills = listBills.filter(
        (bill) => bill.roomId?._id === formData.roomId
      );

      if (roomBills.length > 0) {
        const sortedBills = roomBills.sort(
          (a, b) => new Date(b.month) - new Date(a.month)
        );

        // Lấy hóa đơn mới nhất
        const latestBill = sortedBills[0];

        setFormData((prev) => ({
          ...prev,
          oldElectricityIndex:
            latestBill.newElectricityIndex || prev.oldElectricityIndex,
          oldWaterIndex: latestBill.newWaterIndex || prev.oldWaterIndex,
        }));
      }
    }
  }, [formData.roomId, listBills]);

  const listColumns = [
    {
      name: "Tenant",
      key: "tenant",
      render: (row) => row.tenantId.name,
    },
    {
      name: "Room",
      key: "room",
      render: (row) => row.roomId.name,
    },
    {
      name: "Month",
      key: "month",
    },
    {
      name: "Breakdown",
      key: "breakdown",
      render: (row) => (
        <div>
          <div className="font-thin text-xs">
            Electricity: ₫{row.breakdown.electricity.toLocaleString()}
          </div>
          <div className="font-thin text-xs">
            Water: ₫{row.breakdown.water.toLocaleString()}
          </div>
          <div className="font-thin text-xs">
            Internet: ₫{row.breakdown.internet.toLocaleString()}
          </div>
          <div className="font-thin text-xs">
            Rent: ₫{row.breakdown.rent.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      name: "Total",
      key: "total",
      render: (row) => <>₫{row.total.toLocaleString()}</>,
    },
    {
      name: "Status",
      key: "status",
      render: (row) => (
        <div className="font-thin text-xs">
          {row.status === "paid" ? (
            <Badge className="text-green-500 bg-green-500/20">Paid</Badge>
          ) : (
            <Badge className="text-red-500 bg-red-500/20">Unpaid</Badge>
          )}
        </div>
      ),
    },
    {
      name: "Action",
      key: "action",
    },
  ];

  const getLatestBillInfo = () => {
    if (!formData.roomId || listBills.length === 0) {
      return null;
    }

    const roomBills = listBills.filter(
      (bill) => bill.roomId?._id === formData.roomId
    );
    if (roomBills.length === 0) {
      return null;
    }

    const sortedBills = roomBills.sort(
      (a, b) => new Date(b.month) - new Date(a.month)
    );

    return sortedBills[0];
  };

  const dataDialog = [
    {
      title: "Thông tin cơ bản",
      fields: [
        {
          key: "tenantId",
          label: "Người thuê",
          placeholder: "Chọn người thuê",
          type: "select",
          required: true,
          options: listTenants.map((tenant) => ({
            value: tenant._id,
            label: tenant.name,
          })),
          // options: handleFilterTenants(),
        },
        //phòng
        {
          key: "roomId",
          label: "Phòng",
          type: "select",
          required: true,
          placeholder: "Chọn phòng",
          // options: listRooms.map((room) => ({
          //   value: room._id,
          //   label: room.name,
          // })),
          options: filteredRooms,
        },
        //month
        {
          key: "month",
          label: "Tháng",
          placeholder: "Chọn tháng",
          type: "month",
          required: true,
          width: "full",
        },
      ],
    },
    //chỉ số điện nước
    {
      title: "Chỉ số điện nước",
      fields: [
        {
          key: "oldElectricityIndex",
          label: "Chỉ số điện trước",
          description: "₫3,000/kWh",
          placeholder: "VD: 1000",
          type: "input-number",
          required: false,
        },
        {
          key: "newElectricityIndex",
          label: "Chỉ số điện sau",
          description:
            formData.oldElectricityIndex &&
            formData.newElectricityIndex &&
            settings
              ? `Tiêu thụ: ${
                  formData.newElectricityIndex - formData.oldElectricityIndex
                } kWh × ₫${(
                  settings.electricityPrice || 3000
                ).toLocaleString()} = ₫${(
                  (formData.newElectricityIndex -
                    formData.oldElectricityIndex) *
                  (settings.electricityPrice || 3000)
                ).toLocaleString()}`
              : `Nhập chỉ số điện cuối kỳ (₫${(
                  settings?.electricityPrice || 3000
                ).toLocaleString()}/kWh)`,
          placeholder: "VD: 2000",
          type: "input-number",
          required: false,
        },
        {
          key: "oldWaterIndex",
          label: "Chỉ số nước trước",
          description: "₫15,000/m³",
          placeholder: "VD: 1000",
          type: "input-number",
          required: false,
        },
        {
          key: "newWaterIndex",
          label: "Chỉ số nước sau",
          description: "₫15,000/m³",
          placeholder: "VD: 2000",
          type: "input-number",
          required: false,
        },
      ],
    },
    //thanh toán
    {
      title: "Thanh toán",
      fields: [
        {
          key: "rent",
          label: "Tiền thuê phòng",
          placeholder: "VD: 100000",
          type: "input-number",
          required: true,
        },
        //status paid/unpaid
        {
          key: "status",
          label: "Trạng Thái",
          placeholder: "Chọn trạng thái thanh toán",
          type: "select",
          required: true,
          options: [
            { value: "paid", label: "Paid" },
            { value: "unpaid", label: "Unpaid" },
          ],
        },
      ],
    },
    //ghi chú
    {
      title: "Ghi chú",
      fields: [
        {
          key: "note",
          label: "",
          placeholder: "Ghi chú thêm về hóa đơn...",
          type: "textarea",
          required: false,
          width: "full",
        },
      ],
    },
  ];

  return (
    <div className="grid gap-6">
      <HeaderBar
        title="Bills Management"
        subTitle="Manage your bills"
        titleSearch="Search Bills"
        placeholderSearch="Search bills by name..."
        groupSearch={groupSearch}
        buttonText="Create Bill"
        handleOpenDialog={handleOpenDialog}
      />
      <TableManagement
        titleTable="All Bills"
        loading={loading}
        list={listBills}
        listColumns={listColumns}
        handleDeleteRoom={handleDeleteBill}
        handleEditRoom={handleEditBill}
      />
      <DialogData
        open={openDialog}
        onOpenChange={handleCloseDialog}
        titleDialog={isCreate ? "Tạo hóa đơn mới" : "Cập nhật hóa đơn"}
        titleButton={isCreate ? "Tạo hóa đơn" : "Cập nhật hóa đơn"}
        dataDialog={dataDialog}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        loading={loadingSubmit}
      />
    </div>
  );
};

export default Bills;
