"use server"
import db from "@repo/db"
import axios from "axios"
export async function authorizeTransaction(token:string){
    const transaction=await db.onRampTransaction.findUnique({
        where:{
            token:token
        }
    })
    if(!transaction){
        return {
            "message":"Failed"
        }
    }
    
    const response=await axios.post(`${process.env.BANK_WEBHOOK_URL}/webhook`,{
        amount:transaction.amount,
        user_identifier:transaction.userId,
        token:token,
        password:process.env.BANK_PASSWORD
    },{
        headers:{
            "Content-Type":"application/json"
        }
    })
    console.log(response);
    return {
        "message":response.data.message
    }
    
}