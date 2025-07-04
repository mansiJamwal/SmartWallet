import { SendCard } from "../../../components/SendCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import db from "@repo/db"
import { BalanceCard } from "../../../components/BalanceCard";
import { P2PTransfer } from "../../../components/P2PTransfer";

async function getPnPtransfer(){
    const session=await getServerSession(authOptions)
    const userId=Number(session?.user?.id);
    const pnpTrnasfer=await db.p2pTransfer.findMany({
        where:{
            OR: [
                { toUserId: userId },
                { fromUserId: userId }
            ]
        },
        orderBy: {
            timestamp: 'desc'
        }
    })
    return pnpTrnasfer.map(t=>({
        time:t.timestamp,
        fromUserId:t.fromUserId,
        toUserId:t.toUserId,
        amount:t.amount,
        userId:Number(session?.user?.id)
    }))
}

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


export default async function(){
    const balance=await getBalance();
    const transactions=await getPnPtransfer();
    return(
            <div className="w-screen">
                <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                        Transfer
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
                    <div>
                        <SendCard />
                    </div>
                    <div>
                        <BalanceCard amount={balance?.amount || 0}  />
                        <div className="pt-4">
                            <P2PTransfer transactions={transactions} />
                        </div>
                        </div>
                    </div>
            </div>
        )
}