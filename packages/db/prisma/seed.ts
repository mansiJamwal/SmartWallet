import db from "@repo/db"
import bcrypt from "bcrypt"

async function main(){
    const alice=await db.user.upsert({
        where:{number:"1111111111"},
        update:{},
        create:{
            number:"1111111111",
            password: await bcrypt.hash('alice',10),
            name:'alice',
            Balance:{
                create:{
                    amount: 20000
                }
            },
            OnRampTransaction:{
                create:{
                    startTime: new Date(),
                    status: "Success",
                    amount:20000,
                    token:"token__1",
                    provider:"HDFC Bank",
                }
            }
        }
    })
    const bob=await db.user.upsert({
        where:{
            number:"2222222222"
        },
        update:{},
        create:{
            number:"2222222222",
            password:await bcrypt.hash("bob",10),
            name:"bob",
            Balance:{
                create:{
                    amount:2000
                }
            },
            OnRampTransaction:{
                create:{
                    startTime: new Date(),
                    status:"Failed",
                    amount:2000,
                    token:"token__2",
                    provider:"HDFC Bank"
                }
            }
        }
    })
    console.log({alice,bob})
}
main().then(async()=>{
    await db.$disconnect()
}).catch(async (e)=>{
    console.error(e)
    await db.$disconnect
    process.exit(1)
})