import dotenv from 'dotenv';
dotenv.config();
import express from "express"
import db, { OnRampStatus } from "@repo/db"
const app=express();
app.use(express.json())

app.post("/webhook",async (req,res)=>{
    const paymentInformation:{
        token:string,
        userId:string,
        amount:string,
        password:string
    }={
        token:req.body.token,
        userId:req.body.user_identifier,
        amount:req.body.amount,
        password:req.body.password
    };
    if(paymentInformation.password!==process.env.BANK_PASSWORD){
        res.json({
            "message":"Not authenticated"
        })
    }
    const transaction=await db.onRampTransaction.findUnique({
        where:{
            token:paymentInformation.token,
            userId:Number(paymentInformation.userId)
        }
    })
    if(transaction?.status!==OnRampStatus.Processing){
       res.json({"message":"Transaction already processed"})
    }
    try{
        await db.$transaction([
            db.balance.update({
                where:{
                    userId:Number(paymentInformation.userId)
                },
                data:{
                    amount:{
                        increment:Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.update({
                where:{
                    token:paymentInformation.token
                },
                data:{
                    status:OnRampStatus.Success,
                }
            })
        ])
        res.json({
            message:"Captured"
        })
    }catch(e){
        console.error(e);
        res.status(411).json({
            message:"Error while processing webhook"
        })
    }
})

app.listen(3003,()=>{
    console.log("Listening on 3003");
});