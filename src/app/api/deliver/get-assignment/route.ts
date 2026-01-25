// import { auth } from "@/auth";
// import connectDb from "@/lib/db";
// import DeliveryAssignment from "@/models/deliveryAssigment.model";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req:NextRequest) {
//     try {
//         await connectDb()
//         const session=await auth()
//         const assignments=await DeliveryAssignment.find({
//             brodcastedTo:session?.user?.id,
//             status:"brodcasted"
//         }).populate("order")
//         return NextResponse.json(
//             assignments,
//             {status:200}
//         )
//     } catch (error) {
//         return NextResponse.json(
//             {message:`get assignments error ${error}`},
//             {status:500}
//         )
//     }
    
// }


import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssigment.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb();

        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json([], { status: 200 });
        }

        const deliveryBoyId = new mongoose.Types.ObjectId(session.user.id);

        const assignments = await DeliveryAssignment.find({
            brodcastedTo: { $in: [deliveryBoyId] },
            status: "brocasted",
        }).populate("order");

        return NextResponse.json(assignments, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `get assignments error ${error}` },
            { status: 500 }
        );
    }
}
