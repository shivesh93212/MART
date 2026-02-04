import api from "./axios"

export const createPaymentOrder=async (userId)=>{
    const res=await api.post(`/payment/create_order?user_id=${userId}`)
    return res.data
}

export const verifyPayment=async (payload)=>{
    const res=await api.post(`/payment/verify`,null,{
        params:payload,
    })
    return res.data
}