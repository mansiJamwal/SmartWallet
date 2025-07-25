import db from "@repo/db";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransaction";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";



async function getBalance(){
    const session=await getServerSession(authOptions);
    const balance=await db.balance.findFirst({
        where:{
            userId:Number(session?.user?.id)
        }
    });
    return{
        amount: balance?.amount
    }
}

async function getOnRampTransactions(){
    const session=await getServerSession(authOptions);
    const transactions=await db.onRampTransaction.findMany({
        where:{
            userId:Number(session?.user?.id)
        }
    })
    return transactions.map(t=>({
        time:t.startTime,
        amount:t.amount,
        status:t.status,
        provider:t.provider
    }))
}

export default async function(){
    const balance=await getBalance();
    const transactions=await getOnRampTransactions();
    return(
        <div className="w-screen">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                    Transfer
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
                <div>
                    <AddMoney />
                </div>
                <div>
                    <BalanceCard amount={balance?.amount || 0} />
                    <div className="pt-4">
                        <OnRampTransactions transactions={transactions} />
                    </div>
                    </div>
                </div>
        </div>
    )
}
