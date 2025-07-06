"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import db, { OnRampStatus } from "@repo/db"
import axios from "axios"

export async function createOnRampTransaction(amount:number,provider:string){
    const session=await getServerSession(authOptions);
    const response=await axios.post(`${process.env.BANK_API_URL}/api/token`,{
        password:process.env.BANK_PASSWORD
    },{
        headers:{
            "Content-Type":"application/json"
        }
    })
    const message=response.data.message
    if(!session?.user || !session?.user?.id){
        return {
            message:"User not logged in"
        }
    }
    if(message==="Failed"){
        return{
            "message":"Unauthorized action"
        }
    }
    const transaction=await db.onRampTransaction.create({
        data:{
            status:OnRampStatus.Processing,
            token:message,
            amount: amount*100,
            provider,
            startTime:new Date(),
            userId:Number(session?.user?.id)
        }
    })
    return {
        transaction:transaction
    }

}