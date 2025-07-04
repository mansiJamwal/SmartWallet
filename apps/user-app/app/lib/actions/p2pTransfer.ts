"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import db from "@repo/db"

//i will check if the fromUser and toUser exist or not
//then i will check if the amount is less than the current amount or not
//finally if all checks pass i will decrement from the fromUser and increment in the toUser
//in a prisma transaction
//there is a bug that we have to fix as well we see that later

export async function p2pTransfer(to:string,amount:number){
    const session=await getServerSession(authOptions);
    const from=session?.user?.id
    if(!from){
        return {
            "message":"User not logged in"
        }
    }
    const toUser=await db.user.findUnique({
        where:{
            number:to
        }
    })
    if(!toUser){
        return {
            "message":"This Number does not have an account"
        }
    }
   
    try{
       await db.$transaction(async (tx)=>{
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId"=${Number(from)} FOR UPDATE`

            const fromBalance=await tx.balance.findUnique({
                where:{
                    userId:Number(from),
                }
            })
            if(!fromBalance || fromBalance?.amount<amount){
                throw new Error("Insufficient funds")
            }
            await tx.balance.update({
                where:{
                    userId:Number(from)
                },
                data:{
                    amount:{
                        decrement:amount
                    }
                }
            })

            await tx.balance.update({
                where:{
                    userId:toUser?.id
                },
                data:{
                    amount:{
                        increment:amount
                    }
                }
            })

            await tx.p2pTransfer.create({
                data:{
                    amount:amount,
                    fromUserId:Number(from),
                    toUserId:toUser?.id,
                    timestamp:new Date()
                }
            })
            

       })
       return{
            "message":"Transaction Successful"
       }
    }catch(e){
        console.error(e);
        
    }
}