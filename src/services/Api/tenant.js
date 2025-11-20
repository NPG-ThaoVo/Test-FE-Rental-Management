import apiInstance from "./index";

export const getTenants = async () => {
  const response = await apiInstance.get("/tenants");
  return response;
};

//delete tenant
export const deleteTenant = async (id) => {
  const response = await apiInstance.delete(`/tenants/${id}`);
  return response;
};

//create tenant
export const createTenant = async (data) => {
  const response = await apiInstance.post("/tenants", data);
  return response;
};

//update tenant
export const updateTenant = async (id, data) => {
  const response = await apiInstance.put(`/tenants/${id}`, data);
  return response;
};
