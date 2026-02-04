import api from "./axios"

export const  getAllProduct=async()=>{
    const res=await api.get("/product");
    return res.data;
}