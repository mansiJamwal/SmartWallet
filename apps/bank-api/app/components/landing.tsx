"use client"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react";
import { authorizeTransaction } from "../lib/authorize";
export function Landing(){
    const params=useSearchParams();
    const provider=params.get("provider");
    useEffect(()=>{
        async function approveTransaction(){
            try{
                const token=params.get("token");
                if(token){
                    const res=await authorizeTransaction(token||"");
                    if(res.message==="Failed"){
                        throw new Error("Transaction failed")
                    }
                }else{
                    throw new Error("Token not found")  
                }
                window.location.href="http://localhost:3001/transfer"
            } catch(e){
                console.error(e);
                window.location.href="http://localhost:3001/transfer"
            } 
        }
        setTimeout(async ()=>{
            await approveTransaction();
        },3000)

    },[])
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm text-center">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">{provider}</h3>
            <div className="text-lg text-gray-600 animate-pulse">
            Please wait while we process your request...
            </div>
        </div>
        </div>

    )
}