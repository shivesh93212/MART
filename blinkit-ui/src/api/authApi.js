import api from "./axios"

export const signupUser=async (payload)=>{
    const res= await api.post("/auth/signup",payload)

    return res.data
}



export const loginUser = async (email, password) => {
  const formData = new FormData();
  formData.append("username", email); 
  formData.append("password", password);

  const res = await api.post("/auth/login", formData);
  return res.data;
};