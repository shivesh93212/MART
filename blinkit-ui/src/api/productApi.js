import api from "./axios";

export const getAllProducts = async () => {
  const res = await api.get("/product");
  return res.data;
};

export const addProduct = async (formData) => {
  const res = await api.post("/product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
