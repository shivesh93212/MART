import api from "./axios"

export const signupUser=async (payload)=>{
    const res= await api.post("/auth/signup",payload)

    return res.data
}


export const loginUser=async (payload)=>{
    const res=await api.post("/auth/login",payload)

    return res.data
}