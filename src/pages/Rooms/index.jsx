import React, { useState, useEffect } from "react";
import HeaderBar from "@/components/HeaderBar";
import TableManagement from "@/components/TableManagement";
import {
  getRooms,
  createRoom,
  deleteRoom,
  updateRoom,
} from "@/services/Api/room";
import DialogData from "@/components/DialogData";
import { toast } from "react-hot-toast";

const Rooms = () => {
  const [isCreate, setIsCreate] = useState(true);
  const [listRooms, setListRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [resultSearch, setResultSearch] = useState([]);
  const [groupSearch, setGroupSearch] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [loadingDelete, setLoadingDelete] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleOpenDialog = () => {
    setIsCreate(true);
    setFormData({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  const fetchGetRooms = async () => {
    try {
      setLoading(true);
      const response = await getRooms();
      console.log("🚀 ~ fetchGetRooms ~ response:", response);
      setListRooms(response.data.data);
      setResultSearch(response.data.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      //show alert confirm delete
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this room?"
      );
      if (!isConfirmed) {
        return;
      }
      setLoadingDelete(id);
      await deleteRoom(id);
      toast.success("Delete room successfully");
      fetchGetRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error(error.message);
    } finally {
      setLoadingDelete(id);
    }
  };

  useEffect(() => {
    fetchGetRooms();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setResultSearch(listRooms);
      return;
    }
    const filteredRooms = listRooms.filter((room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResultSearch(filteredRooms);
  };

  const handleCreateRoom = async (formData) => {
    try {
      setLoadingSubmit(true);
      console.log("formData:", formData);

      // Validation
      if (!formData.name || !formData.price || !formData.status) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
        setLoadingSubmit(false);
        return;
      }

      const response = await createRoom({
        name: formData.name,
        price: Number(formData.price),
        status: formData.status,
        description: formData.description || "",
      });
      console.log("🚀 ~ handleCreateRoom ~ response:", response);
      toast.success("Tạo phòng thành công");
      handleCloseDialog();
      fetchGetRooms();
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error(error.response?.data?.error || error.message || "Lỗi khi tạo phòng");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleUpdateRoom = async (id, formData) => {
    try {
      setLoadingSubmit(true);
      
      const response = await updateRoom(id, {
        name: formData.name,
        price: Number(formData.price),
        status: formData.status,
        description: formData.description || "",
      });
      console.log("🚀 ~ handleUpdateRoom ~ response:", response);
      toast.success("Cập nhật phòng thành công");
      handleCloseDialog();
      fetchGetRooms();
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error(error.response?.data?.error || error.message || "Lỗi khi cập nhật phòng");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleSubmit = (formData) => {
    if (isCreate) {
      handleCreateRoom(formData);
    } else {
      handleUpdateRoom(formData._id, formData);
    }
  };

  const listColumns = [
    {
      name: "Name",
      key: "name",
    },
    {
      name: "Price",
      key: "price",
    },
    {
      name: "Status",
      key: "status",
    },
    {
      name: "Action",
      key: "action",
    },
  ];

  const dataDialog = [
    {
      title: "",
      fields: [
        {
          key: "name",
          label: "Tên Phòng",
          placeholder: "VD: Room 101",
          type: "input",
          required: true,
          width: "full",
        },
        {
          key: "price",
          label: "Giá Phòng",
          placeholder: "VD: 1000000",
          type: "input-number",
          required: true,
          width: "half",
        },
        {
          key: "status",
          label: "Trạng Thái",
          placeholder: "Chọn trạng thái phòng",
          type: "select",
          required: true,
          options: [
            { value: "available", label: "Trống" },
            { value: "occupied", label: "Đã Đặt" },
          ],
          width: "half",
        },
        {
          key: "description",
          label: "Mô tả",
          placeholder: "Mô tả phòng diện và tiện nghi...",
          type: "textarea",
          required: false,
          line: 3,
          width: "full",
        },
      ],
    },
  ];

  return (
    <div className="grid gap-6">
      <HeaderBar
        title="Rooms Management"
        subTitle="Manage your rooms"
        titleSearch="Search Rooms"
        placeholderSearch="Search rooms by name..."
        buttonText="Create Room"
        groupSearch={groupSearch}
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleOpenDialog={handleOpenDialog}
      />
      <TableManagement
        titleTable="All Rooms"
        loading={loading}
        list={resultSearch}
        listColumns={listColumns}
        handleDeleteRoom={handleDeleteRoom}
        loadingDelete={loadingDelete}
        setOpenDialog={setOpenDialog}
        setIsCreate={setIsCreate}
        setFormData={setFormData}
      />
      <DialogData
        open={openDialog}
        onOpenChange={handleCloseDialog}
        titleDialog={isCreate ? "Tạo Phòng mới" : "Chỉnh Sửa Phòng"}
        titleButton={isCreate ? "Tạo Phòng mới" : "Cập nhật Phòng"}
        dataDialog={dataDialog}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        loading={loadingSubmit}
      />
    </div>
  );
};

export default Rooms;
