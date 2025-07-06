"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/Select";
import { useState,useEffect } from "react";
import { TextInput } from "@repo/ui/TextInput";
import { createOnRampTransaction } from "../app/lib/actions/createOnRampTransactions";

const SUPPORTED_BANKS=[{
    name:"HDFC Bank",
    redirectUrl:"https://smart-wallet-bank-api.vercel.app"
},{
    name:"Axis Bank",
    redirectUrl:"https://smart-wallet-bank-api.vercel.app"
}]

export const AddMoney=()=>{
    const [redirectUrl,setRedirectUrl]=useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [amount,setAmount]=useState(0);
    const [provider,setProvider]=useState(SUPPORTED_BANKS[0]?.name || "");

    useEffect(() => {
        const defaultBank = SUPPORTED_BANKS[0];
        setRedirectUrl(defaultBank?.redirectUrl);
        setProvider(defaultBank?.name||"");
    }, []);
    
    return (
        <Card title="Add Money">
            <div className="w-full">
            <TextInput placeholder={"Amount"} label={"Amount"} onChange={(val)=>{setAmount(Number(val))
                //function that takes string and sets money and then sends a request
            }}></TextInput>
            <div className="py-4 text-left">
                Bank
            </div>
            <Select onSelect={(value)=>{
                setRedirectUrl(SUPPORTED_BANKS.find(x=>x.name===value)?.redirectUrl||"");
                setProvider(SUPPORTED_BANKS.find(x=>x.name===value)?.name || "")
            }} options={
                    SUPPORTED_BANKS.map(x=>({
                        key:x.name,
                        value:x.name
                    }))
                } >
            </Select>
            <div className="flex justify-center pt-4">
            <Button onClick={async () => {
                const transaction=await createOnRampTransaction(amount,provider);
                const token=transaction.transaction?.token || "";
                if (!token) {
                    alert("Transaction token missing");
                    return;
                }
                if (!redirectUrl) {
                    alert("Redirect URL not selected");
                    return;
                }
                if(amount<0){
                    alert("Amount cannot be negative");
                    return;
                }
                window.location.href = `${redirectUrl}?token=${token}&provider=${provider}`;
            }}>
                    Add Money
                    </Button>
                </div>
            </div>
        </Card>
    )
}