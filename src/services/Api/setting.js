import apiInstance from "./index";

export const getSetting = async () => {
  const response = await apiInstance.get("/settings");
  return response;
};

export const updateSetting = async (data) => {
  const response = await apiInstance.put("/settings", data);
  return response;
};
