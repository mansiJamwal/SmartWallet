"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/Center";
import { TextInput } from "@repo/ui/TextInput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");

    return <div className="flex justify-center pb-6 mt-8">
            <Card title="Send">
                <div className="min-w-90 min-h-60 pt-5">
                    <TextInput placeholder={"Number"} label="Number" onChange={(value) => {
                        setNumber(value)
                    }} />
                    <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => {
                        setAmount(value)
                    }} />
                    <div className="pt-4 flex justify-center">
                        <Button onClick={async () => {
                            if(Number(amount)<0){
                                alert("Amount cannot be negative");
                                return;
                            }
                            await p2pTransfer(number,Number(amount)*100)
                        }}>Send</Button>
                    </div>
                </div>
            </Card>
    </div>
}