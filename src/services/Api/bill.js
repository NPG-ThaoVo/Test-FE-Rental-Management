import apiInstance from "./index";

export const getBill = async () => {
  const response = await apiInstance.get("/bills");
  return response;
};

export const createBill = async (data) => {
  const response = await apiInstance.post("/bills", data);
  return response;
};

export const updateBill = async (id, data) => {
  const response = await apiInstance.put(`/bills?id=${id}`, data);
  return response;
};

export const deleteBill = async (id) => {
  const response = await apiInstance.delete(`/bills?id=${id}`);
  return response;
};
