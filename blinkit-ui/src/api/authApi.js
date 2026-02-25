import api from "./axios"

export const signupUser=async (payload)=>{
    const res= await api.post("/auth/signup",payload)

    return res.data
}



export const loginUser = async (email, password) => {
  const params = new URLSearchParams();
  params.append("username", email);   // important
  params.append("password", password);

  const res = await api.post("/auth/login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res.data;
};