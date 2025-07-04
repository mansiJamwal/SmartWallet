import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Client password:", body.password);
        console.log("Server password:", process.env.BANK_PASSWORD);
        if (body.password !== process.env.BANK_PASSWORD) {
            return NextResponse.json(
                { message: "Failed: Invalid password" },
                { status: 401 }
            );
        }

        const token = randomUUID();
        return NextResponse.json(
            { message: token },
            { status: 200 }
        );
    } catch (e) {
        return NextResponse.json(
            { message: "Failed to generate token" },
            { status: 500 }
        );
    }
}
