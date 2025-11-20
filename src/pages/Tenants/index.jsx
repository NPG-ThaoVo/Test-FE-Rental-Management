import React, { useState, useEffect } from "react";
import HeaderBar from "@/components/HeaderBar";
import TableManagement from "@/components/TableManagement";
import {
  getTenants,
  deleteTenant,
  createTenant,
  updateTenant,
} from "@/services/Api/tenant";
import { getRooms } from "@/services/Api/room";
import { toast } from "react-hot-toast";
import DialogData from "@/components/DialogData";
import { set } from "lodash";
import { CloudCog } from "lucide-react";

const Tenants = () => {
  const [listTenants, setListTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupSearch, setGroupSearch] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [resultSearch, setResultSearch] = useState([]);
  const [isCreate, setIsCreate] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [listRoomsAvailable, setListRoomsAvailable] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState("");
  const fetchGetTenants = async () => {
    try {
      setLoading(true);

      // Fetch tenants and rooms in parallel
      const [tenantsResponse, roomsResponse] = await Promise.all([
        getTenants(),
        getRooms(),
      ]);

      // Set tenants data
      setListTenants(tenantsResponse.data.data);
      setResultSearch(tenantsResponse.data.data);

      // Filter and set available rooms only
      const availableRooms = roomsResponse.data.data.filter(
        (room) => room.status === "available"
      );
      setListRoomsAvailable(availableRooms);
      console.log("Available rooms:", availableRooms);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      toast.error(error.message || "Failed to load tenants data");
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setResultSearch(listTenants);
      return;
    }
    const filteredTenants = listTenants.filter((tenant) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResultSearch(filteredTenants);
  };

  const handleOpenDialog = (isCreate) => {
    setIsCreate(isCreate);
    if (isCreate) {
      setFormData({});
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  const handleCreateTenant = async (formData) => {
    try {
      setLoadingSubmit(true);

      // Validation
      if (!formData.name || !formData.phone || !formData.idCard) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
        setLoadingSubmit(false);
        return;
      }

      const tenantData = {
        name: formData.name,
        phone: formData.phone,
        idCard: formData.idCard,
        email: formData.email || "",
        roomId: formData.roomId || null,
        status: formData.status || "active",
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        note: formData.note || "",
      };

      const response = await createTenant(tenantData);
      console.log("🚀 ~ handleCreateTenant ~ response:", response);
      toast.success("Tạo người thuê thành công");
      handleCloseDialog();
      fetchGetTenants();
    } catch (error) {
      console.error("Error creating tenant:", error);
      toast.error(
        error.response?.data?.error || error.message || "Lỗi khi tạo người thuê"
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleUpdateTenant = async (id, formData) => {
    try {
      setLoadingSubmit(true);

      const tenantData = {
        name: formData.name,
        phone: formData.phone,
        idCard: formData.idCard,
        email: formData.email || "",
        roomId: formData.roomId || null,
        status: formData.status || "active",
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        note: formData.note || "",
      };

      const response = await updateTenant(id, tenantData);
      console.log("🚀 ~ handleUpdateTenant ~ response:", response);
      toast.success("Cập nhật người thuê thành công");
      handleCloseDialog();
      fetchGetTenants();
    } catch (error) {
      console.error("Error updating tenant:", error);
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Lỗi khi cập nhật người thuê"
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDeleteTenant = async (id) => {
    try {
      const isConfirmed = window.confirm(
        "Bạn có chắc chắn muốn xóa người thuê này?"
      );
      if (!isConfirmed) return;

      setLoadingDelete(id);
      await deleteTenant(id);
      toast.success("Xóa người thuê thành công");
      fetchGetTenants();
    } catch (error) {
      console.error("Error deleting tenant:", error);
      toast.error(
        error.response?.data?.error || error.message || "Lỗi khi xóa người thuê"
      );
    } finally {
      setLoadingDelete("");
    }
  };

  const handleSubmit = (formData) => {
    if (isCreate) {
      handleCreateTenant(formData);
    } else {
      handleUpdateTenant(formData._id, formData);
    }
  };

  useEffect(() => {
    fetchGetTenants();
  }, []);

  const listColumns = [
    { key: "name", name: "Name" },
    { key: "phone", name: "Phone" },
    { key: "idCard", name: "ID Card" },
    {
      key: "room",
      name: "Room",
      render: (row) => row.roomId?.name || "Unknown",
    },
    { key: "action", name: "Action" },
  ];

  const dataDialog = [
    {
      title: "Thông tin cơ bản",
      fields: [
        {
          key: "name",
          label: "Họ và tên",
          placeholder: "Nguyễn Văn A",
          type: "input",
          required: true,
        },
        {
          key: "phone",
          label: "Số điện thoại",
          placeholder: "0987654321",
          type: "input",
          required: true,
        },
        {
          key: "idCard",
          label: "Số CMND/CCCD",
          placeholder: "123456789",
          type: "input",
          required: true,
        },
        {
          key: "email",
          label: "Email",
          placeholder: "example@domain.com",
          type: "input",
          required: false,
        },
      ],
    },
    {
      title: "Phòng & Trạng Thái",
      fields: [
        {
          key: "roomId",
          label: "Phòng",
          placeholder: "Chọn phòng",
          type: "select",
          options: listRoomsAvailable?.map((room) => ({
            value: room._id,
            label: room.name,
          })),
          required: false,
        },
        {
          key: "status",
          label: "Trạng Thái",
          placeholder: "Chọn trạng thái",
          type: "select",
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ],
          required: false,
        },
      ],
    },
    {
      title: "Ngày Tháng",
      fields: [
        {
          key: "startDate",
          label: "Ngày vào ở",
          placeholder: "Chọn ngày bắt đầu",
          type: "date",
          required: false,
        },
        {
          key: "endDate",
          label: "Ngày trả phòng",
          placeholder: "Chọn ngày kết thúc",
          type: "date",
          required: false,
        },
      ],
    },
    {
      title: "Ghi chú",
      fields: [
        {
          key: "note",
          label: "",
          placeholder: "Ghi chú thêm về người thuê",
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
        title="Tenants Management"
        subTitle="Manage your tenants"
        titleSearch="Search Tenants"
        placeholderSearch="Search tenants by name..."
        buttonText="Create Tenant"
        groupSearch={groupSearch}
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleOpenDialog={handleOpenDialog}
      />
      <TableManagement
        titleTable="All Tenants"
        loading={loading}
        list={resultSearch}
        listColumns={listColumns}
        handleDeleteRoom={handleDeleteTenant}
        loadingDelete={loadingDelete}
        setOpenDialog={setOpenDialog}
        setIsCreate={setIsCreate}
        setFormData={setFormData}
      />
      <DialogData
        open={openDialog}
        onOpenChange={handleCloseDialog}
        titleDialog={isCreate ? "Thêm người thuê mới" : "Chỉnh Sửa Thông Tin"}
        titleButton={isCreate ? "Thêm người thuê" : "Cập nhật thông tin"}
        dataDialog={dataDialog}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        loading={loadingSubmit}
      />
    </div>
  );
};

export default Tenants;
