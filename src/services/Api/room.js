import apiInstance from "./index";

export const getRooms = async () => {
  const response = await apiInstance.get("/rooms");
  return response;
};

export const deleteRoom = async (id) => {
  const response = await apiInstance.delete(`/rooms?id=${id}`);
  return response;
};

export const createRoom = async (data) => {
  const response = await apiInstance.post("/rooms", data);
  return response;
};

export const updateRoom = async (id, data) => {
  const response = await apiInstance.put(`/rooms?id=${id}`, data);
  return response;
};
